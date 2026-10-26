/* ============================================================
   CONTENIDO DEL PORTAFOLIO
   Edita aquí títulos, textos y archivos. El sitio se arma solo.
   ============================================================ */
window.PORTFOLIO = {
  contacto: {
    correo: "alexpinocaro@gmail.com",
    ciudad: "Pereira, Risaralda",
    whatsapp: "573042969936", // mensaje inicial abajo
    mensajeWhatsapp: "Hola Alex, vi tu portafolio y quiero hablar de un proyecto." // ej: "573001234567" (sin +). Si queda vacío, no aparece.
  },

  /* ---------- AUDIOVISUAL ---------- */
  destacados: [
    {
      id: "austin",
      titulo: "Austin Marchese",
      cliente: "YouTube · Cliente internacional",
      anio: "2026",
      roles: ["Edición", "Motion graphics"],
      cifra: "80.000",
      cifraTexto: "seguidores en 4 meses",
      descripcion: "Edición rítmica y motion graphics para un canal de YouTube en inglés. Ganchos en los primeros segundos, cortes precisos y animación para explicar ideas complejas rápido.",
      videos: [
        { tipo: "youtube", id: "BZluE67z1MA", titulo: "Video 01" },
        { tipo: "youtube", id: "DMlBzXvG22g", titulo: "Video 02" },
        { tipo: "youtube", id: "CNsP0mi1DLw", titulo: "Video 03" },
        { tipo: "youtube", id: "QsU0f-547rQ", titulo: "Video 04" },
        { tipo: "youtube", id: "g6tmqwTULk8", titulo: "Video 05" }
      ]
    },
    {
      id: "ckabai",
      titulo: "Paisajes Íntimos",
      cliente: "Ckabai",
      anio: "2025",
      roles: ["Edición"],
      cifra: "",
      cifraTexto: "Serie de cápsulas documentales",
      descripcion: "Edición de cápsulas documentales: selección del material, estructura del relato y un ritmo que deja respirar las imágenes.",
      videos: [
        { tipo: "youtube", id: "VzGc5tcptno", titulo: "Cápsula 01" },
        { tipo: "youtube", id: "udC6kL8bDzU", titulo: "Cápsula 02" }
      ]
    },
    {
      id: "telecafe",
      titulo: "Por encima de la mesa",
      cliente: "Telecafé · InsignVisualMedia",
      anio: "2026",
      roles: ["Edición", "Foto fija", "Making of"],
      cifra: "Al aire",
      cifraTexto: "en Telecafé",
      descripcion: "Serie documental para televisión abierta. Edición con el estándar técnico de un canal, foto fija y registro del making of en set.",
      videos: [
        { tipo: "local", src: "assets/video/por-encima-de-la-mesa.mp4", poster: "assets/poster/por-encima-de-la-mesa.jpg", titulo: "Tráiler" }
      ]
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
