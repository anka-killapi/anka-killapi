let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return null;

  if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
    sharedAudioContext = new AudioCtx();
  }
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume().catch(() => {});
  }
  return sharedAudioContext;
}

function createNoiseBuffer(ctx: AudioContext, durationSeconds: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const frameCount = Math.max(1, Math.floor(sampleRate * durationSeconds));
  const buffer = ctx.createBuffer(1, frameCount, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function scheduleSingleClap(
  ctx: AudioContext,
  noiseBuffer: AudioBuffer,
  masterGain: GainNode,
  when: number,
  volume: number,
  centerFreq: number,
  panValue: number
) {
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;

  // Bandpass shaping gives the warm hollow "cupped hands" clap tone
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(centerFreq, when);
  bandpass.Q.setValueAtTime(1.6, when);

  // Gentle high-shelf attenuation so claps sound warm rather than hissy
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(3400, when);

  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, when);
  env.gain.linearRampToValueAtTime(volume, when + 0.004);
  env.gain.exponentialRampToValueAtTime(volume * 0.35, when + 0.022);
  env.gain.exponentialRampToValueAtTime(0.0001, when + 0.085);

  source.connect(bandpass);
  bandpass.connect(lowpass);
  lowpass.connect(env);

  if (typeof ctx.createStereoPanner === 'function') {
    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(panValue, when);
    env.connect(panner);
    panner.connect(masterGain);
  } else {
    env.connect(masterGain);
  }

  source.start(when);
  source.stop(when + 0.095);
}

function scheduleStarChime(ctx: AudioContext, masterGain: GainNode, startAt: number) {
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const t = startAt + idx * 0.075;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.11, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.36);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(t);
    osc.stop(t + 0.38);
  });
}

/**
 * Plays a cheerful star chime followed by warm crowd applause claps
 * using the browser Web Audio API (no external audio file needed).
 */
export function playStarApplauseSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + 0.02;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.8, now);
    masterGain.connect(ctx.destination);

    scheduleStarChime(ctx, masterGain, now);

    const noiseBuffer = createNoiseBuffer(ctx, 0.11);

    // 32 staggered claps across ~1.85s simulating a cheerful audience
    const clapCount = 32;
    for (let i = 0; i < clapCount; i++) {
      const progress = i / (clapCount - 1);
      // Slight ramp-in at start, steady middle, natural taper at the end
      const fadeEnvelope =
        progress < 0.15
          ? 0.55 + progress * 3
          : progress > 0.72
            ? Math.max(0.2, 1 - (progress - 0.72) / 0.3)
            : 1;

      const offset = progress * 1.75 + (Math.random() - 0.5) * 0.045;
      const when = now + 0.08 + Math.max(0, offset);
      const volume = (0.16 + Math.random() * 0.14) * fadeEnvelope;
      const centerFreq = 900 + Math.random() * 950;
      const pan = (Math.random() * 1.4 - 0.7);

      scheduleSingleClap(
        ctx,
        noiseBuffer,
        masterGain,
        when,
        volume,
        centerFreq,
        pan
      );
    }
  } catch {
    // Ignore audio synthesis errors in restricted environments
  }
}

/**
 * Plays a playful descending "wah-wah-waaaah / buuu" game-show sound
 * when the user picks the wrong part.
 */
export function playTryAgainBooSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + 0.02;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.45, now);
    masterGain.connect(ctx.destination);

    // Classic 4-note descending cartoon trombone ("wah-wah-wah-waaaah / buuu")
    const steps = [
      { freq: 293.66, duration: 0.21, slideTo: null }, // D4
      { freq: 277.18, duration: 0.21, slideTo: null }, // C#4
      { freq: 261.63, duration: 0.21, slideTo: null }, // C4
      { freq: 246.94, duration: 0.58, slideTo: 185.0 }, // B3 -> F#3 slump
    ];

    let cursor = now;
    for (const step of steps) {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(step.freq, cursor);

      if (step.slideTo !== null) {
        osc.frequency.linearRampToValueAtTime(
          step.freq,
          cursor + step.duration * 0.25
        );
        osc.frequency.exponentialRampToValueAtTime(
          step.slideTo,
          cursor + step.duration
        );
      }

      // Warm brassy lowpass filter sweep ("wah" vowel inflection)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, cursor);
      filter.frequency.exponentialRampToValueAtTime(
        step.slideTo !== null ? 360 : 520,
        cursor + step.duration
      );
      filter.Q.setValueAtTime(2.5, cursor);

      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, cursor);
      env.gain.linearRampToValueAtTime(0.32, cursor + 0.025);
      env.gain.setValueAtTime(0.28, cursor + step.duration * 0.72);
      env.gain.exponentialRampToValueAtTime(0.0001, cursor + step.duration);

      osc.connect(filter);
      filter.connect(env);
      env.connect(masterGain);

      osc.start(cursor);
      osc.stop(cursor + step.duration + 0.02);

      cursor += step.duration + 0.035;
    }
  } catch {
    // Ignore audio synthesis errors in restricted environments
  }
}

/**
 * Plays a bright two-note sparkle chime when finding 1 of the Moon objects.
 */
export function playSingleStarSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + 0.02;
    const notes = [659.25, 987.77]; // E5 -> B5
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.09;
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.38);
    });
  } catch {
    // Ignore audio synthesis errors in restricted environments
  }
}

/**
 * Plays a gentle, friendly two-tone error chime ("boop-boop") for ages 5-10.
 */
export function playGentleErrorSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + 0.02;
    const notes = [329.63, 246.94]; // E4 -> B3 soft descending tones
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.14;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  } catch {
    // Ignore audio synthesis errors in restricted environments
  }
}
