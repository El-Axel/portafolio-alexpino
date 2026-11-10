/* ============================================================
   CONTENIDO DEL PORTAFOLIO
   Edita aquí títulos, textos y archivos. El sitio se arma solo.
   ============================================================ */
window.PORTFOLIO = {
  contacto: {
    correo: "alexpinocaro@gmail.com",
    ciudad: "Pereira, Risaralda",
    whatsapp: "573042969936", // mensaje inicial abajo
    mensajeWhatsapp: "Hola Alex, vi tu portafolio y quiero hablar de un proyecto.", // mensaje si no eligen nada
    /* "Arma tu pedido": tres preguntas rápidas que llenan el mensaje de WhatsApp.
       Cambia, quita o agrega opciones. Si borras "presupuesto", esa pregunta desaparece. */
    brief: {
      que: ["Reels o videos cortos", "Video para mi marca", "Videoclip", "Fotografía", "Diseño gráfico o de marca", "Otra cosa"],
      cuando: ["Lo antes posible", "Este mes", "Sin afán"],
      presupuesto: ["Menos de $1 millón", "$1 a $3 millones", "Más de $3 millones", "Aún no sé"]
    }
  },

  /* ---------- SOBRE MÍ ----------
     bio: entre 50 y 80 palabras (regla del curso). */
  sobre: {
    /* intro: la primera frase que se lee en la portada, debajo de "¿Quién soy? Depende del proyecto." */
    intro: "Soy Alexander Pino Caro, diseñador crossmedia y creador audiovisual en Pereira. Grabo, edito y cuento historias para marcas, y después las mido.",
    bio: "Soy Alexander Pino Caro, Diseñador Crossmedia y Creador Audiovisual en Pereira. Grabo, edito y cuento: tomo material en bruto y lo convierto en piezas que retienen la atención y se pueden medir. Edité para un canal de YouTube que llegó a 80.000 seguidores en cuatro meses, hice contenido para Meta que subió un 40 % las reservas de un hotel y trabajé en una serie que salió al aire en Telecafé.",
    pasos: [
      { verbo: "Grabo", pruebas: ["lacepa", "nosfui"], texto: "Cámara, luz y dirección de fotografía. Busco lo que hace única a la marca y lo registro con intención." },
      { verbo: "Edito", pruebas: ["austin", "ckabai"], texto: "Escojo el material, corto con ritmo y le doy color. Si no engancha en los primeros segundos, lo vuelvo a cortar." },
      { verbo: "Cuento", pruebas: ["telecafe", "lacepa"], texto: "Uno video, diseño y web en una sola historia, y la mido: seguidores, reservas, pantalla." }
    ],
    oficios: ["Cámara", "Dirección de fotografía", "Edición", "Color", "Motion graphics", "Diseño gráfico", "Diseño editorial", "Diseño web"],
    manifiesto: "No respondo con una lista de oficios. Respondo con proyectos.",

    /* Fuera de cámara: lo que te gusta cuando no estás grabando (música, fútbol, cine…).
       Mientras esté vacío, no aparece. Ej: ["Cine de autor", "Fútbol", "Música urbana"] */
    fueraDeCamara: []
  },

  /* ---------- MI LÍNEA DE TIEMPO ----------
     Formación y trabajos en orden. "cuando" puede ser un año o un texto corto.
     Pon el año del técnico donde dice "Formación". */
  trayectoria: [
    { cuando: "Formación", que: "Técnico en Elaboración de Medios Audiovisuales", donde: "Aquí aprendí cámara, luz y montaje." },
    { cuando: "2025", que: "Paisajes Íntimos · Ckabai", donde: "Edición de cápsulas documentales.", href: "proyecto-paisajes-intimos.html" },
    { cuando: "2025", que: "Nos fui pues mijo", donde: "Magazine: dirección de fotografía, cámara y edición.", href: "proyecto-nos-fui-pues-mijo.html" },
    { cuando: "2026", que: "Austin Marchese", donde: "Edición y motion graphics para YouTube. 80.000 seguidores en 4 meses.", href: "proyecto-austin.html" },
    { cuando: "2026", que: "La Cepa · Hotel Pinares Plaza", donde: "Cámara, edición y diseño. +40 % en reservas.", href: "proyecto-la-cepa.html" },
    { cuando: "2026", que: "Por encima de la mesa · Telecafé", donde: "Edición, foto fija y making of. Salió al aire.", href: "proyecto-telecafe.html" },
    { cuando: "Hoy", que: "Diseño Crossmedia · 8.º semestre", donde: "Uno video, diseño y web en una sola historia." }
  ],

  /* ---------- CRÉDITOS FINALES (pie de página) ---------- */
  creditos: [
    ["Dirección", "Alexander Pino Caro"], ["Cámara", "Alexander Pino Caro"], ["Edición", "Alexander Pino Caro"],
    ["Color", "Alexander Pino Caro"], ["Diseño", "Alexander Pino Caro"], ["Y el próximo proyecto", "Tú"]
  ],

  /* ---------- AUDIOVISUAL ----------
     Cada caso: problema → proceso → solución → resultado.
     "cifra" y "cifraTexto" son el resultado medible.

     FILTRO POR OFICIO: cada caso se filtra según sus "roles"
     (Edición, Cámara, Color, Motion graphics, Diseño gráfico…).
     Si quieres control total, agrega oficios: ["edicion", "color"]
     (claves: edicion, camara, color, motion, grafico, editorial, web).
     Una capa sin proyectos aparece apagada.

     COMPARAR (opcional, por caso). Pon los archivos en assets/compare/:
       comparar: { tipo: "color",            // barra que se arrastra
                   antes: "assets/compare/austin-log.jpg",   // o .mp4
                   despues: "assets/compare/austin-final.jpg",
                   textoAntes: "LOG", textoDespues: "Color final" }
       comparar: { tipo: "corte",            // botón bruto / final
                   antes: "assets/compare/cepa-bruto.mp4",
                   despues: "assets/video/la-cepa-vacaciones.mp4",
                   poster: "assets/poster/la-cepa-vacaciones.jpg" }
     Para tener los dos en un caso, usa una lista: comparar: [ {...}, {...} ] */
  destacados: [
    {
      id: "austin",
      pagina: "proyecto-austin.html",
      set: "editor",        // diseño especial de su página (ver js/proyecto.js)
      titulo: "Austin Marchese",
      cliente: "YouTube · Cliente internacional",
      anio: "2026",
      roles: ["Edición", "Motion graphics"],
      soy: "el que hace que la gente se quede hasta el final",
      formato: "Videos para YouTube, en inglés",
      hice: ["Edité los videos del canal a partir del guion.", "Escogí la mejor toma de cada frase y corté lo que sobraba.", "Diseñé y animé los motion graphics que explican las ideas."],
      cifra: "80.000",
      cifraTexto: "seguidores en 4 meses",
      descripcion: "Edición rítmica y motion graphics para un canal de YouTube en inglés.",
      caso: {
        problema: "Un canal en inglés con ideas complejas que tenían que entenderse rápido y retener a la audiencia hasta el final.",
        proceso: "Edición desde el guion: escoger la mejor toma por frase, cortar lo que sobra y marcar dónde entra cada animación.",
        solucion: "Ganchos en los primeros segundos, cortes precisos y motion graphics para explicar las ideas sin frenar el ritmo.",
        resultado: "El canal llegó a 80.000 seguidores en cuatro meses. Arranqué con miedo por el idioma; el ritmo terminó hablando por mí."
      },
      videos: [
        { tipo: "youtube", id: "BZluE67z1MA", titulo: "Video 01" },
        { tipo: "youtube", id: "DMlBzXvG22g", titulo: "Video 02" },
        { tipo: "youtube", id: "CNsP0mi1DLw", titulo: "Video 03" },
        { tipo: "youtube", id: "QsU0f-547rQ", titulo: "Video 04" },
        { tipo: "youtube", id: "g6tmqwTULk8", titulo: "Video 05" }
      ]
    },
    {
      id: "lacepa",
      pagina: "proyecto-la-cepa.html",
      set: "celulares",
      titulo: "La Cepa · Hotel Pinares Plaza",
      cliente: "Hotel y restaurante · Contenido para Meta",
      anio: "2026",
      roles: ["Cámara", "Edición", "Diseño gráfico"],
      soy: "el que hace que la gente reserve",
      formato: "Reels verticales para Meta y piezas impresas",
      hice: ["Grabé en el hotel y en el restaurante.", "Edité los reels en vertical para Meta.", "Diseñé la carta del restaurante y el hablador de mesa."],
      cifra: "+40 %",
      cifraTexto: "en reservas",
      descripcion: "Reels para Meta, carta del restaurante y hablador de mesa para el hotel.",
      caso: {
        problema: "El hotel y su restaurante necesitaban que su oferta se viera en redes y se convirtiera en reservas.",
        proceso: "Grabación en el hotel y el restaurante, edición en formato vertical y diseño de las piezas impresas con la misma línea.",
        solucion: "Reels cortos para Meta que muestran la experiencia, más la carta y el hablador de mesa para el punto de venta.",
        resultado: "Las reservas subieron un 40 %. El contenido dejó de ser solo bonito y empezó a vender."
      },
      videos: [
        { tipo: "local", vertical: true, src: "assets/video/la-cepa-vacaciones.mp4", poster: "assets/poster/la-cepa-vacaciones.jpg", titulo: "Vacaciones en La Cepa" },
        { tipo: "local", vertical: true, src: "assets/video/corto-01.mp4", poster: "assets/poster/corto-01.jpg", titulo: "Volver a La Cepa" },
        { tipo: "local", vertical: true, src: "assets/video/corto-03.mp4", poster: "assets/poster/corto-03.jpg", titulo: "Cocina y barra" },
        { tipo: "local", vertical: true, src: "assets/video/corto-05.mp4", poster: "assets/poster/corto-05.jpg", titulo: "Sabores que cuentan historias" }
      ],
      verTambien: { texto: "Ver la carta y el hablador", href: "grafico.html#carta-la-cepa" }
    },
    {
      id: "telecafe",
      pagina: "proyecto-telecafe.html",
      set: "television",
      // fotogramas sacados del tráiler (no son la foto fija; si tienes la foto fija, ponla en "fotos")
      fotogramas: ["assets/telecafe/f01.jpg", "assets/telecafe/f02.jpg", "assets/telecafe/f03.jpg", "assets/telecafe/f04.jpg", "assets/telecafe/f05.jpg", "assets/telecafe/f06.jpg", "assets/telecafe/f07.jpg", "assets/telecafe/f08.jpg", "assets/telecafe/f09.jpg", "assets/telecafe/f10.jpg", "assets/telecafe/f11.jpg", "assets/telecafe/f12.jpg"],
      fotos: [],            // foto fija del set: agrega aquí las rutas cuando las tengas
      titulo: "Por encima de la mesa",
      cliente: "Telecafé · InsignVisualMedia",
      anio: "2026",
      roles: ["Edición", "Foto fija", "Making of"],
      soy: "el que cuida la historia hasta que llega a la televisión",
      formato: "Serie documental para televisión abierta",
      hice: ["Edité los capítulos de la serie.", "Hice la foto fija en el set.", "Registré el making of del rodaje."],
      cifra: "Al aire",
      cifraTexto: "en Telecafé",
      descripcion: "Serie documental para televisión abierta.",
      caso: {
        problema: "Una serie documental que tenía que cumplir el estándar técnico de un canal de televisión abierta.",
        proceso: "Edición de los capítulos, foto fija en el set y registro del making of durante el rodaje.",
        solucion: "Un montaje que respeta el relato de cada capítulo y entrega con las especificaciones del canal.",
        resultado: "La serie salió al aire en Telecafé. Cumplir el estándar de la televisión abierta fue la prueba."
      },
      videos: [
        { tipo: "local", src: "assets/video/por-encima-de-la-mesa.mp4", poster: "assets/poster/por-encima-de-la-mesa.jpg", titulo: "Tráiler" }
      ]
    },
    {
      id: "ckabai",
      pagina: "proyecto-paisajes-intimos.html",
      set: "cine",
      titulo: "Paisajes Íntimos",
      cliente: "Ckabai",
      anio: "2025",
      roles: ["Edición"],
      soy: "el que deja respirar las imágenes",
      formato: "Cápsulas documentales",
      hice: ["Escogí el material y armé la estructura de cada cápsula.", "Edité con un ritmo pausado para sostener la emoción."],
      cifra: "",
      cifraTexto: "Serie de cápsulas documentales",
      descripcion: "Edición de cápsulas documentales.",
      caso: {
        problema: "Contar historias íntimas en cápsulas cortas sin perder lo que las hace humanas.",
        proceso: "Selección del material y estructura del relato antes de cortar.",
        solucion: "Un ritmo pausado que deja respirar las imágenes y sostiene la emoción.",
        resultado: "Una serie de cápsulas con una misma voz visual."
      },
      videos: [
        { tipo: "youtube", id: "VzGc5tcptno", titulo: "Cápsula 01" },
        { tipo: "youtube", id: "udC6kL8bDzU", titulo: "Cápsula 02" }
      ]
    },
    {
      id: "nosfui",
      pagina: "proyecto-nos-fui-pues-mijo.html",
      set: "control",
      titulo: "Nos fui pues mijo",
      cliente: "Proyecto académico · Diseño Crossmedia, 5.º semestre",
      anio: "2025",
      roles: ["Dirección de fotografía", "Cámara", "Edición"],
      soy: "el que arma un programa entero, del lente a la línea de tiempo",
      formato: "Magazine",
      hice: ["Dirigí la fotografía del magazine.", "Operé la cámara.", "Edité el programa completo."],
      cifra: "",
      cifraTexto: "Magazine completo",
      descripcion: "Magazine: dirección de fotografía, cámara y edición.",
      /* PENDIENTE (Alex): problema, proceso, solución y resultado. Mientras estén vacíos, no se muestran. */
      caso: { problema: "", proceso: "", solucion: "", resultado: "" },
      /* Bloques del magazine para los monitores de la sala de control: { titulo, t } con t en segundos.
         El primero es donde arranca el magazine dentro del video (39:25). Agrega más bloques cuando los tengas. */
      bloques: [{ titulo: "Arranca el magazine", t: 2365 }],
      /* Cámaras de la sala de control: cada una muestra el magazine desde un segundo distinto
         y al tocarla "corta" el programa a ese momento. Ajusta "t" (en segundos) a los momentos que quieras mostrar. */
      camaras: [{ rol: "Dirección de fotografía", t: 2425 }, { rol: "Cámara", t: 2605 }, { rol: "Edición", t: 2845 }],
      /* embed: false → YouTube bloquea este video fuera de su página por una canción con derechos
         (reclamo de LatinAutor - UMPG). El sitio lo muestra con vista previa y un botón para verlo en YouTube.
         Si subes una versión sin esa canción (o un mp4 en assets/video), quita "embed: false" o cambia el video. */
      videos: [{ tipo: "youtube", id: "pH4I3-CPcwU", inicio: 2365, embed: false, titulo: "Nos fui pues mijo" }]
    }
  ],

  /* Videoclips: cambia "cliente", "roles" y los títulos por los reales (artista / canción). */
  videoclips: [
    {
      id: "videoclips",
      titulo: "Videoclips",
      cliente: "Música · artistas independientes",
      anio: "2026",
      roles: ["Videoclip"],
      descripcion: "Cinco videoclips: la música manda el ritmo del corte.",
      videos: [
        { tipo: "youtube", id: "4RtfGuRQXYw", titulo: "Videoclip 01" },
        { tipo: "youtube", id: "Yv687H7gZnk", titulo: "Videoclip 02" },
        { tipo: "youtube", id: "zzhdbEWIKj8", titulo: "Videoclip 03" },
        { tipo: "youtube", id: "e9Jl1wr8j24", titulo: "Videoclip 04" },
        { tipo: "youtube", id: "2KBNRGW3v3w", titulo: "Videoclip 05" }
      ]
    }
  ],

  /* Reels: todo el formato vertical y corto en una sola sección. */
  reels: [
    {
      "src": "assets/video/la-cepa-vacaciones.mp4",
      "poster": "assets/poster/la-cepa-vacaciones.jpg",
      "titulo": "Vacaciones en La Cepa",
      "cliente": "La Cepa · Hotel Pinares Plaza",
      "dur": "0:20"
    },
    {
      "src": "assets/video/san-isidro.mp4",
      "poster": "assets/poster/san-isidro.jpg",
      "titulo": "San Isidro",
      "cliente": "Puerto Caldas",
      "dur": "0:45"
    },
    {
      "src": "assets/video/video-corto-web.mp4",
      "poster": "assets/poster/video-corto-web.jpg",
      "titulo": "Video corto para web",
      "cliente": "Taller",
      "dur": "1:36"
    },
    {
      "src": "assets/video/corto-01.mp4",
      "poster": "assets/poster/corto-01.jpg",
      "titulo": "Volver a La Cepa",
      "cliente": "La Cepa · Hotel Pinares Plaza",
      "dur": "1:28"
    },
    {
      "src": "assets/video/corto-03.mp4",
      "poster": "assets/poster/corto-03.jpg",
      "titulo": "Cocina y barra",
      "cliente": "La Cepa",
      "dur": "0:25"
    },
    {
      "src": "assets/video/corto-05.mp4",
      "poster": "assets/poster/corto-05.jpg",
      "titulo": "Sabores que cuentan historias",
      "cliente": "La Cepa",
      "dur": "0:38"
    },
    {
      "src": "assets/video/corto-02.mp4",
      "poster": "assets/poster/corto-02.jpg",
      "titulo": "Reto ArisFitness",
      "cliente": "Aristena",
      "dur": "2:17"
    },
    {
      "src": "assets/video/corto-08.mp4",
      "poster": "assets/poster/corto-08.jpg",
      "titulo": "Hábitos y entrenamiento",
      "cliente": "Aristena",
      "dur": "1:03"
    },
    {
      "src": "assets/video/corto-11.mp4",
      "poster": "assets/poster/corto-11.jpg",
      "titulo": "Reacción",
      "cliente": "Aristena",
      "dur": "2:50"
    },
    {
      "src": "assets/video/corto-06.mp4",
      "poster": "assets/poster/corto-06.jpg",
      "titulo": "Escribe la palabra proceso",
      "cliente": "Santiffit",
      "dur": "0:27"
    },
    {
      "src": "assets/video/corto-07.mp4",
      "poster": "assets/poster/corto-07.jpg",
      "titulo": "8 semanas",
      "cliente": "Santiffit",
      "dur": "0:25"
    },
    {
      "src": "assets/video/corto-10.mp4",
      "poster": "assets/poster/corto-10.jpg",
      "titulo": "Hidratación estratégica",
      "cliente": "Santiffit",
      "dur": "0:37"
    },
    {
      "src": "assets/video/corto-09.mp4",
      "poster": "assets/poster/corto-09.jpg",
      "titulo": "No es casualidad",
      "cliente": "Testimonio",
      "dur": "0:32"
    },
    {
      "src": "assets/video/corto-04.mp4",
      "poster": "assets/poster/corto-04.jpg",
      "titulo": "Historia de grado",
      "cliente": "Testimonio",
      "dur": "0:52"
    }
  ],

  /* ---------- GRÁFICO ---------- */
  grafico: [
    {
      "id": "carta-la-cepa",
      "vitrina": "libro3d",
      "texto": "La carta del restaurante, pensada para hojearse en la mesa: cada plato con su foto y su precio a la vista.",
      "titulo": "Carta La Cepa",
      "tipo": "Menú · restaurante",
      "ancho": "w8",
      "modo": "libro",
      "portada": "assets/grafico/carta-la-cepa/p01.jpg",
      "paginas": [
        "assets/grafico/carta-la-cepa/p01.jpg",
        "assets/grafico/carta-la-cepa/p02.jpg",
        "assets/grafico/carta-la-cepa/p03.jpg",
        "assets/grafico/carta-la-cepa/p04.jpg",
        "assets/grafico/carta-la-cepa/p05.jpg",
        "assets/grafico/carta-la-cepa/p06.jpg",
        "assets/grafico/carta-la-cepa/p07.jpg",
        "assets/grafico/carta-la-cepa/p08.jpg",
        "assets/grafico/carta-la-cepa/p09.jpg",
        "assets/grafico/carta-la-cepa/p10.jpg",
        "assets/grafico/carta-la-cepa/p11.jpg",
        "assets/grafico/carta-la-cepa/p12.jpg",
        "assets/grafico/carta-la-cepa/p13.jpg",
        "assets/grafico/carta-la-cepa/p14.jpg",
        "assets/grafico/carta-la-cepa/p15.jpg",
        "assets/grafico/carta-la-cepa/p16.jpg",
        "assets/grafico/carta-la-cepa/p17.jpg",
        "assets/grafico/carta-la-cepa/p18.jpg"
      ],
      "dobles": [],
      "ar": "16/10",
      "mockup": "menu"
    },
    {
      "id": "hablador",
      "vitrina": "hablador",
      "texto": "Una cara invita a pedir desde la habitación con un QR; la otra recuerda las reglas del huésped.",
      "titulo": "Hablador La Cepa · Hotel Pinares Plaza",
      "tipo": "Impreso de mesa",
      "ancho": "w4",
      "modo": "galeria",
      "portada": "assets/grafico/hablador/p01.jpg",
      "imagenes": [
        "assets/grafico/hablador/p01.jpg",
        "assets/grafico/hablador/p02.jpg"
      ],
      "mockup": "hablador",
      "ar": "4/5"
    },
    {
      "id": "importadora-maka",
      "vitrina": "marca",
      "colores": ["#28A8B5", "#FFBB12", "#D85B95"],
      "texto": "Logo, patrón y aplicaciones de una importadora.",
      "titulo": "Importadora Maka",
      "tipo": "Logo · identidad de marca",
      "ancho": "w12",
      "modo": "galeria",
      "mockup": "marca",
      "portada": "assets/grafico/importadora-maka/p01.jpg",
      "imagenes": [
        "assets/grafico/importadora-maka/p01.jpg",
        "assets/grafico/importadora-maka/p02.jpg",
        "assets/grafico/importadora-maka/p03.jpg",
        "assets/grafico/importadora-maka/p04.jpg",
        "assets/grafico/importadora-maka/p05.jpg",
        "assets/grafico/importadora-maka/p06.jpg",
        "assets/grafico/importadora-maka/p07.jpg",
        "assets/grafico/importadora-maka/p08.jpg"
      ],
      "ar": "21/9"
    },
    {
      "id": "arborea",
      "vitrina": "presentacion",
      "texto": "Identidad visual y manual de marca: de dónde sale el nombre, el logo y cómo se usa.",
      "titulo": "Arbórea",
      "tipo": "Identidad visual · manual de marca",
      "ancho": "w6",
      "modo": "libro",
      "portada": "assets/grafico/arborea/p01.jpg",
      "paginas": [
        "assets/grafico/arborea/p01.jpg",
        "assets/grafico/arborea/p02.jpg",
        "assets/grafico/arborea/p03.jpg",
        "assets/grafico/arborea/p04.jpg",
        "assets/grafico/arborea/p05.jpg",
        "assets/grafico/arborea/p06.jpg",
        "assets/grafico/arborea/p07.jpg",
        "assets/grafico/arborea/p08.jpg",
        "assets/grafico/arborea/p09.jpg",
        "assets/grafico/arborea/p10.jpg",
        "assets/grafico/arborea/p11.jpg",
        "assets/grafico/arborea/p12.jpg",
        "assets/grafico/arborea/p13.jpg",
        "assets/grafico/arborea/p14.jpg",
        "assets/grafico/arborea/p15.jpg",
        "assets/grafico/arborea/p16.jpg",
        "assets/grafico/arborea/p17.jpg",
        "assets/grafico/arborea/p18.jpg",
        "assets/grafico/arborea/p19.jpg",
        "assets/grafico/arborea/p20.jpg",
        "assets/grafico/arborea/p21.jpg",
        "assets/grafico/arborea/p22.jpg",
        "assets/grafico/arborea/p23.jpg",
        "assets/grafico/arborea/p24.jpg",
        "assets/grafico/arborea/p25.jpg"
      ],
      "dobles": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24
      ],
      "ar": "16/9"
    },
    {
      "id": "bai-rural",
      "vitrina": "feed",
      "texto": "Portadas y publicaciones para el feed de Bai Rural.",
      "titulo": "Bai Rural",
      "tipo": "Piezas para redes",
      "ancho": "w6",
      "modo": "galeria",
      "portada": "assets/grafico/bai-rural/portada.jpg",
      "imagenes": [
        "assets/grafico/bai-rural/p01.jpg",
        "assets/grafico/bai-rural/p02.jpg",
        "assets/grafico/bai-rural/p03.jpg",
        "assets/grafico/bai-rural/p04.jpg"
      ],
      "ar": "16/9"
    }
  ],

  /* ---------- EDITORIAL ---------- */
  editorial: [
    {
      "titulo": "Punta al Pie",
      "tipo": "Catálogo de moda",
      "portada": "assets/editorial/punta-al-pie/p01.jpg",
      "paginas": [
        "assets/editorial/punta-al-pie/p01.jpg",
        "assets/editorial/punta-al-pie/p02.jpg",
        "assets/editorial/punta-al-pie/p03.jpg",
        "assets/editorial/punta-al-pie/p04.jpg",
        "assets/editorial/punta-al-pie/p05.jpg",
        "assets/editorial/punta-al-pie/p06.jpg",
        "assets/editorial/punta-al-pie/p07.jpg",
        "assets/editorial/punta-al-pie/p08.jpg",
        "assets/editorial/punta-al-pie/p09.jpg"
      ],
      "dobles": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "ar": "920/1300"
    },
    {
      "titulo": "Voces Libres",
      "tipo": "Revista",
      "portada": "assets/editorial/voces-libres/p01.jpg",
      "paginas": [
        "assets/editorial/voces-libres/p01.jpg",
        "assets/editorial/voces-libres/p02.jpg",
        "assets/editorial/voces-libres/p03.jpg",
        "assets/editorial/voces-libres/p04.jpg",
        "assets/editorial/voces-libres/p05.jpg"
      ],
      "dobles": [
        1,
        2,
        3
      ],
      "ar": "1005/1300"
    },
    {
      "titulo": "Palestina, Chele Ojo",
      "tipo": "Álbum ilustrado",
      "portada": "assets/editorial/palestina-chele-ojo/p01.jpg",
      "paginas": [
        "assets/editorial/palestina-chele-ojo/p01.jpg",
        "assets/editorial/palestina-chele-ojo/p02.jpg",
        "assets/editorial/palestina-chele-ojo/p03.jpg",
        "assets/editorial/palestina-chele-ojo/p04.jpg",
        "assets/editorial/palestina-chele-ojo/p05.jpg",
        "assets/editorial/palestina-chele-ojo/p06.jpg",
        "assets/editorial/palestina-chele-ojo/p07.jpg",
        "assets/editorial/palestina-chele-ojo/p08.jpg",
        "assets/editorial/palestina-chele-ojo/p09.jpg",
        "assets/editorial/palestina-chele-ojo/p10.jpg",
        "assets/editorial/palestina-chele-ojo/p11.jpg"
      ],
      "dobles": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ],
      "ar": "976/1300"
    },
    {
      "titulo": "¡Qué tan bueno! Palestina",
      "tipo": "Librito",
      "portada": "assets/editorial/que-tan-bueno/p01.jpg",
      "paginas": [
        "assets/editorial/que-tan-bueno/p01.jpg",
        "assets/editorial/que-tan-bueno/p02.jpg",
        "assets/editorial/que-tan-bueno/p03.jpg",
        "assets/editorial/que-tan-bueno/p04.jpg",
        "assets/editorial/que-tan-bueno/p05.jpg",
        "assets/editorial/que-tan-bueno/p06.jpg",
        "assets/editorial/que-tan-bueno/p07.jpg",
        "assets/editorial/que-tan-bueno/p08.jpg",
        "assets/editorial/que-tan-bueno/p09.jpg",
        "assets/editorial/que-tan-bueno/p10.jpg",
        "assets/editorial/que-tan-bueno/p11.jpg",
        "assets/editorial/que-tan-bueno/p12.jpg",
        "assets/editorial/que-tan-bueno/p13.jpg",
        "assets/editorial/que-tan-bueno/p14.jpg",
        "assets/editorial/que-tan-bueno/p15.jpg",
        "assets/editorial/que-tan-bueno/p16.jpg",
        "assets/editorial/que-tan-bueno/p17.jpg",
        "assets/editorial/que-tan-bueno/p18.jpg",
        "assets/editorial/que-tan-bueno/p19.jpg",
        "assets/editorial/que-tan-bueno/p20.jpg"
      ],
      "dobles": [],
      "ar": "867/1300"
    }
  ]
};
