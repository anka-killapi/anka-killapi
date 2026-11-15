export interface MoonwalkCaptionCue {
  start: number;
  end: number;
  speaker?: string;
  text: string;
}

/**
 * Spanish translation of the narration and Mission Control / astronaut radio
 * dialogue for NASA's "The Flight of Apollo 11" (255-HQ-194) strictly covering
 * the locked segment from 08:55 (535s) to 18:05 (1085s).
 */
export const MOONWALK_CAPTIONS_ES: MoonwalkCaptionCue[] = [
  {
    start: 534.5,
    end: 538.0,
    text: 'El piloto puede ver detalles que su cámara no logra captar. Las cuatro patas de aterrizaje del',
  },
  {
    start: 538.0,
    end: 544.1,
    text: 'Módulo Lunar están totalmente extendidas y aseguradas. El Eagle está listo para descender',
  },
  {
    start: 544.1,
    end: 548.0,
    text: 'hacia la superficie lunar.',
  },
  {
    start: 558.5,
    end: 562.7,
    text: 'El motor del cohete de la nave lunar se enciende',
  },
  {
    start: 562.7,
    end: 569.5,
    text: 'para frenarla y guiarla hacia el lugar de aterrizaje en el Mar de la Tranquilidad.',
  },
  {
    start: 569.5,
    end: 574.5,
    text: 'Hay tensión y mucha cautela mientras el Eagle desciende más bajo. Se encienden luces de alerta',
  },
  {
    start: 574.5,
    end: 579.8,
    text: 'mientras la computadora intenta procesar todos los datos de control, ¡pero el estado sigue en «Adelante»!',
  },
  {
    start: 579.8,
    end: 585.7,
    speaker: '🎙️ Control de Misión (Houston)',
    text: 'Eagle, ya los tenemos en señal. Todo se ve bien. Cambio.',
  },
  {
    start: 585.7,
    end: 588.6,
    speaker: '👨‍🚀 Buzz Aldrin',
    text: 'Recibido. Copiado.',
  },
  {
    start: 588.6,
    end: 595.0,
    speaker: '🎙️ Control de Misión (Houston)',
    text: 'Eagle, aquí Houston. Tras el giro: ángulos de banda S, cabeceo menos 9, guiñada más 18.',
  },
  {
    start: 595.0,
    end: 603.0,
    speaker: '🎙️ Control de Misión (Houston)',
    text: 'Recibido. Tienen luz verde para continuar el descenso propulsado.',
  },
  {
    start: 603.0,
    end: 610.2,
    speaker: '👨‍🚀 Buzz Aldrin',
    text: 'Altitud ahora: 21,000 pies. Todo sigue muy bien. Velocidad reducida a 1,200 pies por segundo.',
  },
  {
    start: 610.2,
    end: 613.1,
    speaker: '🎙️ Control de Misión (Houston)',
    text: 'Se ven estupendos desde aquí, Eagle.',
  },
  {
    start: 613.1,
    end: 616.4,
    speaker: '👨‍🚀 Neil Armstrong',
    text: 'Denos una lectura de la alarma de programa 1202.',
  },
  {
    start: 616.4,
    end: 619.5,
    speaker: '🎙️ Control de Misión (Houston)',
    text: 'Recibido, seguimos adelante a pesar de esa alarma.',
  },
  {
    start: 619.5,
    end: 625.5,
    speaker: '👨‍🚀 Buzz Aldrin',
    text: 'Buenos datos de radar. Ya estamos en la fase de aproximación. Todo bien. Altitud 4,200...',
  },
  {
    start: 625.5,
    end: 630.0,
    speaker: '🎙️ Control de Misión (Houston)',
    text: 'Aquí Houston. Tienen autorización para aterrizar. Cambio.',
  },
  {
    start: 630.0,
    end: 634.5,
    speaker: '👨‍🚀 Buzz Aldrin',
    text: 'Recibido, entendido. Autorizados para aterrizar.',
  },
  {
    start: 634.5,
    end: 641.9,
    speaker: '👨‍🚀 Buzz Aldrin',
    text: '3,000 pies. Alarma de programa. Altitud 1,600... 1,400 pies. Todo sigue muy bien. 700 pies,',
  },
  {
    start: 641.9,
    end: 647.3,
    speaker: '👨‍🚀 Buzz Aldrin',
    text: '21 hacia abajo, 33 grados... 600 pies bajando a 19. Alarma 1201.',
  },
  {
    start: 647.3,
    end: 649.8,
    speaker: '👨‍🚀 Neil Armstrong',
    text: '1201.',
  },
  {
    start: 649.8,
    end: 655.6,
    speaker: '🎙️ Control de Misión (Houston)',
    text: 'Recibido, alarma 1201. Seguimos adelante, es del mismo tipo. Luz verde.',
  },
  {
    start: 655.6,
    end: 666.1,
    speaker: '👨‍🚀 Buzz Aldrin',
    text: 'Luz de altitud y velocidad... 3 y medio abajo, 220 pies, 13 adelante... 200 pies, 4 y medio abajo.',
  },
  {
    start: 666.1,
    end: 669.5,
    speaker: '🎙️ Control de Misión (Houston)',
    text: 'Quedan 60 segundos de combustible.',
  },
  {
    start: 669.5,
    end: 684.3,
    speaker: '👨‍🚀 Buzz Aldrin',
    text: 'Luces encendidas... Bajando 2 y medio... Adelante, adelante... 40 pies. Levantando algo de polvo...',
  },
  {
    start: 684.3,
    end: 696.4,
    speaker: '👨‍🚀 Buzz Aldrin',
    text: '4 adelante... Desviándose un poco a la derecha... ¡Luz de contacto! Bien.',
  },
  {
    start: 696.4,
    end: 703.3,
    speaker: '🎙️ Control de Misión (Houston)',
    text: 'Motor apagado. Confirmamos que están en tierra, Eagle.',
  },
  {
    start: 703.3,
    end: 711.1,
    speaker: '👨‍🚀 Neil Armstrong',
    text: 'Aquí Base Tranquilidad. El Eagle ha alunizado.',
  },
  {
    start: 711.1,
    end: 717.3,
    text: 'Por la ventana del Eagle, Armstrong y Aldrin contemplan lo que ningún ojo humano',
  },
  {
    start: 717.3,
    end: 727.5,
    text: 'había visto jamás. Su nave proyecta una larga sombra sobre el polvo intacto de siglos.',
  },
  {
    start: 733.5,
    end: 738.1,
    text: 'Siete horas después del alunizaje, tras completar con cuidado los preparativos',
  },
  {
    start: 738.1,
    end: 748.0,
    text: 'para el despegue posterior, Armstrong abre la escotilla del Eagle y comienza a bajar hacia la superficie.',
  },
  {
    start: 777.0,
    end: 783.0,
    text: 'Los primeros pasos en este nuevo y extraño mundo',
  },
  {
    start: 783.0,
    end: 788.7,
    text: 'deben darse con mucha cautela. La Luna tiene solo una sexta parte de la gravedad de la Tierra.',
  },
  {
    start: 788.7,
    end: 793.0,
    text: 'Cómo era realmente su superficie seguía siendo un misterio.',
  },
  {
    start: 793.0,
    end: 798.5,
    speaker: '👨‍🚀 Neil Armstrong',
    text: 'Bien, voy a bajar del módulo lunar ahora.',
  },
  {
    start: 798.5,
    end: 809.5,
    speaker: '👨‍🚀 Neil Armstrong',
    text: 'Es un pequeño paso para un hombre, pero un gran salto para la humanidad.',
  },
  {
    start: 810.4,
    end: 817.5,
    text: 'Una vez en la superficie, Armstrong recoge una pequeña muestra de polvo y roca lunar,',
  },
  {
    start: 817.5,
    end: 825.5,
    text: 'como precaución ante la posibilidad de un despegue de emergencia.',
  },
  {
    start: 831.7,
    end: 837.6,
    text: 'Según el plan, el astronauta Aldrin ahora desciende del Eagle.',
  },
  {
    start: 837.6,
    end: 847.5,
    text: 'Él y su equipo pesarían unos 174 kilos en la Tierra. Aquí en la Luna pesan solo unos 30 kilos.',
  },
  {
    start: 884.2,
    end: 890.3,
    text: 'Por un breve instante, los primeros hombres en la Luna se detienen a observar el paisaje solitario',
  },
  {
    start: 890.3,
    end: 897.5,
    text: 'y desolado que los rodea, una experiencia que nadie antes había podido vivir.',
  },
  {
    start: 897.5,
    end: 902.7,
    text: 'Pero hay mucho por hacer en el poco tiempo que pueden quedarse en este satélite sin aire ni nubes.',
  },
  {
    start: 902.7,
    end: 908.4,
    text: 'Esta lámina de metal atrapa y retiene partículas del Sol, el llamado viento solar,',
  },
  {
    start: 908.4,
    end: 914.4,
    text: 'un flujo constante de energía solar que golpea la superficie de la Luna.',
  },
  {
    start: 914.4,
    end: 924.0,
    text: 'Los resultados de este experimento volverán a la Tierra para revelar nuevos secretos a los científicos.',
  },
  {
    start: 925.2,
    end: 930.4,
    text: 'Dejan en la Luna una bandera estadounidense junto con medallas en honor a astronautas',
  },
  {
    start: 930.4,
    end: 937.6,
    text: 'y cosmonautas que perdieron la vida en pruebas anteriores, y un pequeño disco con mensajes',
  },
  {
    start: 937.6,
    end: 946.0,
    text: 'de buena voluntad de 73 naciones de la Tierra.',
  },
  {
    start: 946.0,
    end: 954.0,
    text: 'Una placa en el Módulo Lunar dice: «Aquí hombres del planeta Tierra pisaron por primera vez la Luna.',
  },
  {
    start: 954.0,
    end: 963.5,
    text: 'Julio de 1969 d. C. Vinimos en paz en nombre de toda la humanidad».',
  },
  {
    start: 964.0,
    end: 971.4,
    text: 'Gracias a una cámara de televisión especial, personas de muchos países pudieron ver a los astronautas',
  },
  {
    start: 971.4,
    end: 978.3,
    text: 'caminar y trabajar en la Luna. A pesar de los trajes grandes y las mochilas con oxígeno,',
  },
  {
    start: 978.3,
    end: 987.0,
    text: 'control de temperatura y radio, el equipo del Apollo 11 descubrió que podía moverse con facilidad.',
  },
  {
    start: 994.0,
    end: 1005.5,
    text: 'Como en la Luna no hay viento ni lluvia, estas huellas permanecerán allí durante siglos.',
  },
  {
    start: 1012.2,
    end: 1017.9,
    text: 'Además de recoger muestras de roca y suelo, los exploradores instalan un sismómetro.',
  },
  {
    start: 1017.9,
    end: 1029.5,
    text: 'Este aparato tan sensible enviaría datos valiosos sobre impactos de meteoritos y sismos internos lunares.',
  },
  {
    start: 1052.5,
    end: 1064.1,
    text: 'Un reflector láser de 100 prismas ayudaría a medir la distancia exacta entre la Tierra',
  },
  {
    start: 1064.1,
    end: 1069.1,
    text: 'y la Luna con una precisión de unos 15 centímetros.',
  },
  {
    start: 1069.1,
    end: 1074.4,
    text: 'Estos fueron los primeros de muchos experimentos llevados a la Luna para ampliar nuestro conocimiento',
  },
  {
    start: 1074.4,
    end: 1081.0,
    text: 'sobre la Luna y la inmensidad del espacio.',
  },
  {
    start: 1081.0,
    end: 1085.5,
    text: 'Después de 2 horas y 31 minutos, los primeros exploradores lunares habían completado su investigación.',
  },
];

export function getMoonwalkSpanishCaption(
  currentTimeSeconds: number
): MoonwalkCaptionCue | null {
  for (let i = 0; i < MOONWALK_CAPTIONS_ES.length; i++) {
    const cue = MOONWALK_CAPTIONS_ES[i];
    if (currentTimeSeconds >= cue.start && currentTimeSeconds < cue.end) {
      return cue;
    }
  }
  return null;
}
