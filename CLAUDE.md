# Portafolio de Alexander Pino Caro (alexpino.netlify.app)

## Quién es y cómo hablarle
- Alex: Diseñador Crossmedia (8.º semestre) y Técnico en Elaboración de Medios Audiovisuales, en Pereira.
  Fuerte en cámara, dirección de fotografía, edición rítmica, color y motion graphics.
  Odia la preproducción y la burocracia: ve al grano, propón y haz.
- Háblale en español, cercano y directo, como un colega con experiencia.
- Los textos del sitio van en su voz: primera persona, frases cortas, contrastes con dos puntos, nada de adornos.

## Reglas que no se rompen (curso de Portafolio, profe Leandro Hernández)
- NO inventar cifras, clientes ni experiencia. Cifras reales:
  - Austin Marchese: 80.000 seguidores en 4 meses.
  - La Cepa · Hotel Pinares Plaza: +40 % en reservas.
  - Por encima de la mesa: salió al aire en Telecafé.
- Nada de porcentajes, barras ni puntitos para medir habilidades.
- Máximo 2 familias tipográficas: Krona One (títulos) y Figtree (texto).
- Cada proyecto justifica su efectividad: Problema → Proceso → Solución → Resultado.
- La bio debe tener entre 50 y 80 palabras.
- Si algo no se sabe (años, herramientas, gustos), no se inventa: se deja vacío y se le pregunta a Alex.

## Narrativa (elegida por Alex)
"¿Quién soy? Depende del proyecto." Es el hilo de todo el sitio:
- Claqueta con REC al entrar.
- Portada con su presentación.
- Sobre mí.
- Cifras.
- Cada proyecto es una "Escena" con "Aquí soy…", ficha técnica y "Lo que hice".
- Línea de tiempo.
- Cierre que repite quién fue en cada proyecto: "Ahora ya sabes quién soy. Hablemos."
- Créditos finales.

## Cómo está hecho (v5: sitio con páginas internas)
- HTML, CSS y JavaScript sin frameworks ni build. Los scripts son clásicos (no módulos); se prueba con Live Server.
- Páginas:
  - `index.html` (Inicio: claqueta REC, portada con la cámara jugable, cifras, Escenas, Quién soy en corto, Más trabajo, llamado a contacto)
  - `sobre-mi.html`, `audiovisual.html`, `grafico.html`, `editorial.html`, `contacto.html`, `404.html`
  - una por proyecto: `proyecto-austin.html`, `proyecto-la-cepa.html`, `proyecto-telecafe.html`, `proyecto-paisajes-intimos.html`, `proyecto-nos-fui-pues-mijo.html`. Cada una es casi vacía (`<body data-page="proyecto" data-id="...">`) y la arma `js/proyecto.js`.
- `js/data.js`: TODO el contenido. Cada proyecto tiene `pagina` (su archivo) y `set` (su puesta en escena). Cada pieza de Gráfico tiene `vitrina`.
- `js/shell.js`: barra superior, fondo, pie, créditos finales, visor y ayudas de TODAS las páginas. Se cambian aquí una sola vez.
- `js/main.js`: lo común (casos, reels, visor, claqueta, cámara jugable, filtro por oficio, Arma tu pedido, atajos J K L / 1–5 / H, tarjetas de escena). Todo revisa si su parte existe en la página antes de actuar.
- `js/proyecto.js` + `css/sets.css`: un set por proyecto:
  - `editor` (Austin): interfaz de edición + contador del canal;
  - `celulares` (La Cepa): reels dentro de celulares + "Y en la mesa";
  - `television` (Telecafé): televisor al aire + hoja de contactos con fotogramas del tráiler (`assets/telecafe/`);
  - `cine` (Paisajes Íntimos): formato panorámico 2.39;
  - `control` (Nos fui pues mijo): sala de control, monitor PROGRAMA, cámaras por rol, escaleta con `bloques`.
- `js/impresos.js` + `css/impresos.css`: gráfico y editorial.
  - Vitrinas: `libro3d` (pasa página), `hablador` (se gira arrastrando), `marca` (colores que se copian, patrón, lupa), `presentacion` (diapositivas), `feed` (perfil en un celular).
  - Editorial: estantería + libro abierto en la mesa.
- `js/paginas.js`: Sobre mí (Grabo/Edito/Cuento con pruebas y el "casting" de papeles).
- `js/cursors.js`: cursores con nombre de oficio que "diseñan" partes del sitio. Cada escena corre una vez y solo si su parte existe en la página.
- `css/style.css`: lo común, organizado por secciones numeradas.
  - Colores: petrol #2A5159, teal #2EA690, sand #F2C572, peach #F29863, terra #D9674E, fondo #0B1315, texto #F4F1EA.
  - Ojo: la clase `.empty` ya existe (borde punteado); no la reuses para otra cosa.
- Línea de tiempo funcional (`Timeline` en `js/main.js`, estilos en la sección 21 de `css/style.css`). Va debajo de TODOS los videos horizontales: cada video es un clip y el cabezal se arrastra.
  - Antes del play recorre la vista previa.
  - Con el video andando lo adelanta de verdad: los locales con `currentTime` y los de YouTube con su API (`enablejsapi`).
  - Los videos verticales siguen sin línea de tiempo.
- Claqueta de entrada (sección 22): foco que entra, REC, cuenta regresiva 3-2-1 de película, destello y obturador. La portada se "revela" con `html.revealing` (sección 23: fugas de luz, destello anamórfico, barras de cine).
- Tonos por zona (sección 24): `tone` + `tone-sand` | `tone-mist` | `tone-petrol` | `tone-terra` | `tone-film`, y `pad` para el aire de abajo. Los tonos claros vuelven el texto oscuro solos.
  - Vidrios de color: `glass-teal`, `glass-peach`, `glass-sand`, `frost`.
  - Regla: no repetir el mismo material en dos zonas seguidas.
  - Todos los tonos son OSCUROS con un lavado de color suave (como los vidrios de las cifras). Alex rechazó los fondos claros (beige, amarillo y naranja plenos): no volver a usarlos.
- Las páginas HTML las genera un script interno a partir de la portada; si las editas a mano, no pasa nada.
- Todo respeta "reducir movimiento": sin claqueta, sin cursores y el sitio se ve terminado.

## Antes de dar algo por terminado
- Probar en escritorio y en celular de 390 px y 360 px de ancho: sin errores en consola y sin scroll horizontal.
- Revisar también con "reducir movimiento" activado.
- Publicar: commit y push a `main`; Netlify publica solo.

## Pendientes que dependen de Alex
- Nos fui pues mijo:
  - YouTube bloquea el video fuera de su página por una canción con derechos (LatinAutor - UMPG). Por eso tiene `embed: false` y muestra un botón para verlo allá. Para que se reproduzca dentro del sitio, Alex tiene que subir una versión sin esa canción o un mp4 de su parte;
  - problema, proceso, solución y resultado (hoy vacíos; el caso no se muestra);
  - los bloques del magazine con su segundo de inicio, para la escaleta;
  - los segundos de `camaras` (los monitores CAM 1-3 muestran el magazine desde 40:25, 43:25 y 47:25; ajustarlos a momentos buenos);
  - confirmar la frase "Aquí soy…".
- Confirmar "Aquí soy…" y "Lo que hice" de cada proyecto, sobre todo Paisajes Íntimos (Ckabai).
- Foto fija real de Telecafé para `fotos` (hoy solo hay fotogramas del tráiler).
- Año del técnico en la línea de tiempo (hoy dice "Formación").
- `fueraDeCamara`: 3 o 4 gustos personales.
- Lista real de herramientas para una sección "mesa de trabajo".
- Clips en LOG con su versión etalonada, y material en bruto, para `comparar`.
- Marcar "Color" en los `roles` de los proyectos donde hizo el color.
- Revisar los rangos de presupuesto del pedido de WhatsApp.
