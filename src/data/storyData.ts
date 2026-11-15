export type LanguageCode = 'en' | 'es';

export interface StoryChapter {
  id: string;
  number: string;
  location: string;
  title: Record<LanguageCode, string>;
  summary: Record<LanguageCode, string>;
  excerpt: Record<LanguageCode, string>;
  quechuaSpotlight: {
    term: string;
    phonetic: string;
    meaning: Record<LanguageCode, string>;
  };
}

export interface ProloguePage {
  pageNumber: string;
  sceneTitle: Record<LanguageCode, string>;
  paragraphs: Record<LanguageCode, string[]>;
  quechuaNote: {
    phrase: string;
    translation: Record<LanguageCode, string>;
  };
}

export interface LexiconEntry {
  index: string;
  word: string;
  phonetic: string;
  category: 'cosmos' | 'andes' | 'companions';
  categoryLabel: Record<LanguageCode, string>;
  english: string;
  spanish: string;
  context: Record<LanguageCode, string>;
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'signal',
    number: '01',
    location: 'Ausangate · 4,800m',
    title: {
      en: '01. The Signal Above Ausangate',
      es: '01. La Señal sobre el Ausangate',
    },
    summary: {
      en: 'On the night of the full silver moon, Inti packs his copper compass and woven chullo after noticing an impossible shadow circling the lunar rim.',
      es: 'En la noche de luna llena plateada, Inti empaca su brújula de cobre y su chullo tejido tras descubrir una sombra imposible rodeando el borde lunar.',
    },
    excerpt: {
      en: 'High above the frost-laced stone corrals of Cusco, the air grew thin enough to hear starlight crackle. Inti tightened the straps of his leather satchel and looked up at Mama Killa—she was brighter than any lantern, and something winged was calling back from her craters.',
      es: 'En lo alto de los corrales de piedra cubiertos de escarcha en Cusco, el aire se volvió tan delgado que parecía oírse el crujido de las estrellas. Inti ajustó las correas de su mochila de cuero y miró hacia Mama Killa: brillaba más que cualquier farol, y algo alado respondía desde sus cráteres.',
    },
    quechuaSpotlight: {
      term: 'Killa',
      phonetic: 'KEE-yah',
      meaning: {
        en: 'Moon — revered in Andean astronomy as the keeper of tides, planting cycles, and silver night skies.',
        es: 'Luna — venerada en la astronomía andina como guardiana de los ciclos de siembra y las noches plateadas.',
      },
    },
  },
  {
    id: 'crossing',
    number: '02',
    location: 'Mare Tranquillitatis',
    title: {
      en: '02. Across the Cratered Sea',
      es: '02. A Través del Mar de Cráteres',
    },
    summary: {
      en: 'Landing softly on moonlit dust, Inti discovers that gravity on Killa feels just like leaping between boulders in the high sierra.',
      es: 'Al aterrizar suavemente sobre el polvo lunar, Inti descubre que la gravedad en Killa se siente como saltar entre las rocas de la alta sierra.',
    },
    excerpt: {
      en: 'Every footstep kicked up silent plumes of silver powder that settled in slow motion around his boots. Far across the ridge, perched on a jagged crest of basalt, stood an eagle whose feathers caught the blue glow of Earthrise.',
      es: 'Cada paso levantaba columnas silenciosas de polvo plateado que caían en cámara lenta alrededor de sus botas. Al otro lado de la cresta, posada sobre una roca de basalto, se alzaba un águila cuyas plumas reflejaban el resplandor azul de la Tierra.',
    },
    quechuaSpotlight: {
      term: 'Killapi',
      phonetic: 'kee-YAH-pee',
      meaning: {
        en: 'On the Moon / In the Moon — combining Killa (moon) with the Quechua locative suffix -pi.',
        es: 'En la Luna — combina Killa (luna) con el sufijo locativo quechua -pi.',
      },
    },
  },
  {
    id: 'pact',
    number: '03',
    location: 'Crater Rim · Starfall',
    title: {
      en: '03. Pact of the Anka',
      es: '03. El Pacto del Anka',
    },
    summary: {
      en: 'With neither spoken words nor fear, the boy and the Andean eagle map the constellations linking the Southern Cross to the lunar highlands.',
      es: 'Sin miedo y sin necesidad de palabras, el niño y el águila andina trazan las constelaciones que unen la Cruz del Sur con las tierras altas lunares.',
    },
    excerpt: {
      en: 'The eagle tilted its golden beak toward the horizon where a shooting star drew an arc of amber fire. Inti smiled—not even 384,000 kilometers from home could separate a traveler from the sky that raised him.',
      es: 'El águila inclinó su pico dorado hacia el horizonte donde una estrella fugaz trazó un arco de fuego ámbar. Inti sonrió: ni siquiera 384,000 kilómetros de distancia podían separar a un viajero del cielo que lo vio crecer.',
    },
    quechuaSpotlight: {
      term: 'Anka',
      phonetic: 'AHN-kah',
      meaning: {
        en: 'Andean Eagle — symbol of sharp vision, endurance at high altitude, and guidance across vast distances.',
        es: 'Águila Andina — símbolo de visión aguda, resistencia en las alturas y guía en grandes travesías.',
      },
    },
  },
];

export const PROLOGUE_PAGES: ProloguePage[] = [
  {
    pageNumber: '01',
    sceneTitle: {
      en: 'Night Watch on the Ridge',
      es: 'Vigilia Nocturna en la Cumbre',
    },
    paragraphs: {
      en: [
        'Before the village roosters even dreamed of dawn, Inti sat upon the cold limestone boulder above the valley. His grandmother had woven his chullo with zigzag patterns—mountain ridges in crimson, rivers in cobalt, and golden stars along the earflaps.',
        'Pinned to his leather pack was a small red-and-white Peruvian patch, sewn by hand so he would always carry the warmth of home wherever the wind carried him.',
      ],
      es: [
        'Antes de que los gallos del pueblo soñaran con el alba, Inti se sentó sobre la fría roca caliza sobre el valle. Su abuela había tejido su chullo con figuras en zigzag: cumbres en carmesí, ríos en cobalto y estrellas doradas en las orejeras.',
        'Cosido a su mochila de cuero llevaba un pequeño emblema rojo y blanco del Perú, bordado a mano para llevar siempre consigo el calor de su hogar.',
      ],
    },
    quechuaNote: {
      phrase: 'Allin tuta, Mama Killa.',
      translation: {
        en: 'Good evening, Mother Moon.',
        es: 'Buenas noches, Madre Luna.',
      },
    },
  },
  {
    pageNumber: '02',
    sceneTitle: {
      en: 'The Silver Dust Below',
      es: 'El Polvo Plateado Bajo Sus Botas',
    },
    paragraphs: {
      en: [
        'When the golden arc of the comet swept behind the moon, the quiet mountain night dissolved into an endless lunar plain. Cratered stone stretched to the horizon under a sky deeper than obsidian, alive with diamond-blue stars.',
        'Inti rested his clasped hands over his knees and laughed aloud—though in the vacuum of space, only his own heartbeat answered inside his chest.',
      ],
      es: [
        'Cuando el arco dorado del cometa cruzó detrás de la luna, la tranquila noche andina se transformó en una inmensa llanura lunar. Rocas y cráteres se extendían hasta el horizonte bajo un cielo más profundo que la obsidiana, vivo con estrellas azul diamante.',
        'Inti apoyó las manos entrelazadas sobre sus rodillas y rió con asombro, aunque en el silencio del espacio solo su propio corazón respondió en su pecho.',
      ],
    },
    quechuaNote: {
      phrase: 'Ch’askakunaqa k’anchashanku.',
      translation: {
        en: 'The stars are shining brightly.',
        es: 'Las estrellas están brillando con fuerza.',
      },
    },
  },
  {
    pageNumber: '03',
    sceneTitle: {
      en: 'Eyes of the Guardian',
      es: 'La Mirada del Guardián',
    },
    paragraphs: {
      en: [
        'Across the basin, perched atop a sunlit ridge of pale granite, stood the Anka. Its talons gripped the moonstone with the quiet certainty of a bird born above the clouds.',
        'Boy and eagle held each other’s gaze beneath the rising glow of the full moon. The first chapter of their journey across the constellations had begun.',
      ],
      es: [
        'Al otro lado de la cuenca, posada sobre una loma de granito pálido iluminada por la luna, se encontraba el Anka. Sus garras se aferraban a la piedra lunar con la serena certeza de un ave nacida sobre las nubes.',
        'El niño y el águila sostuvieron la mirada bajo el resplandor de la luna llena. El primer capítulo de su travesía por las constelaciones acababa de comenzar.',
      ],
    },
    quechuaNote: {
      phrase: 'Haku puririsun, Anka!',
      translation: {
        en: 'Let us journey onward, Eagle!',
        es: '¡Vamos a emprender el viaje, Águila!',
      },
    },
  },
];

export const QUECHUA_LEXICON: LexiconEntry[] = [
  {
    index: '01',
    word: 'Anka',
    phonetic: 'AHN-kah',
    category: 'companions',
    categoryLabel: { en: 'Companions', es: 'Compañeros' },
    english: 'Eagle',
    spanish: 'Águila',
    context: {
      en: 'Guardian of the high Andean thermals and Inti’s guide across the lunar craters.',
      es: 'Guardián de las alturas andinas y guía de Inti entre los cráteres lunares.',
    },
  },
  {
    index: '02',
    word: 'Killa',
    phonetic: 'KEE-yah',
    category: 'cosmos',
    categoryLabel: { en: 'Cosmos', es: 'Cosmos' },
    english: 'Moon',
    spanish: 'Luna',
    context: {
      en: 'Central celestial body of the story, governing light, shadow, and memory.',
      es: 'Astro central de la historia, regente de la luz, la sombra y la memoria.',
    },
  },
  {
    index: '03',
    word: 'Killapi',
    phonetic: 'kee-YAH-pee',
    category: 'cosmos',
    categoryLabel: { en: 'Cosmos', es: 'Cosmos' },
    english: 'On the Moon',
    spanish: 'En la Luna',
    context: {
      en: 'Formed by attaching the spatial suffix -pi (“in / on”) to Killa.',
      es: 'Se forma añadiendo el sufijo espacial -pi (“en”) a la palabra Killa.',
    },
  },
  {
    index: '04',
    word: 'Ch’aska',
    phonetic: 'CHAHS-kah',
    category: 'cosmos',
    categoryLabel: { en: 'Cosmos', es: 'Cosmos' },
    english: 'Star / Dawn Star',
    spanish: 'Estrella / Lucero',
    context: {
      en: 'Used in Inca navigation to align mountain sanctuaries and nighttime trails.',
      es: 'Empleada en la astronomía incaica para orientar santuarios y caminos nocturnos.',
    },
  },
  {
    index: '05',
    word: 'Chullo',
    phonetic: 'CHOO-yoh',
    category: 'andes',
    categoryLabel: { en: 'Andes', es: 'Andes' },
    english: 'Woven Andean earflap hat',
    spanish: 'Gorro tejido andino con orejeras',
    context: {
      en: 'Hand-knitted from alpaca wool with geometric motifs encoding mountain lineage.',
      es: 'Tejido a mano en lana de alpaca con figuras geométricas que cuentan historias.',
    },
  },
  {
    index: '06',
    word: 'Pacha',
    phonetic: 'PAH-chah',
    category: 'andes',
    categoryLabel: { en: 'Andes', es: 'Andes' },
    english: 'World, Space & Time',
    spanish: 'Mundo, Espacio y Tiempo',
    context: {
      en: 'Describes the unity between physical terrain and the unfolding of eras.',
      es: 'Expresa la unidad entre el territorio físico y el transcurrir del tiempo.',
    },
  },
];
