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

## Narrativa compacta (v8): una idea por página, sin repetir
- Inicio plantea la pregunta ("¿Quién soy? Depende del proyecto.") + gancho al origen (`sobre.gancho`) + cifras + escenas.
- Sobre mí cuenta el origen: Escena 00 (`sobre.origen`, con marcas de "corte") + bio sin cifras + Grabo/Edito/Cuento con pruebas + línea de tiempo.
- Las escenas muestran las pruebas: "Aquí soy…" solo en las tarjetas de escena y en la página de cada proyecto.
- Contacto cierra: "Ahora ya sabes quién soy. ¿Y en tu proyecto?" + pedido + créditos finales (los créditos SOLO salen en Contacto).
- Las cifras viven solo en las tarjetas de cifras y en cada escena. No repetirlas en la bio ni en la línea de tiempo.
- Alex pidió NO agregar más secciones narrativas (conflicto, sección para el cliente, etc.): se siente redundante. Antes de sumar texto, revisar si ya se dice en otra página.

## Tema claro / oscuro e idioma (pedido del profe, nov. 2026)
- En la barra superior hay dos switches (`.tgl-theme` y `.tgl-lang`, en `js/shell.js`; estilos en la sección 27 de `css/style.css`). OJO: `.sw` ya existe en impresos.css (muestras de color), no usarlo.
- Cada página tiene en el `<head>` un script corto que decide tema e idioma ANTES de pintar (localStorage `ap-theme` / `ap-lang`, o `?lang=en` en el enlace; si no hay nada, idioma del navegador). El tema por defecto es oscuro.
- Tema claro:
  - colores base y ajustes a mano: sección 27 de `css/style.css`;
  - `css/claro.css` lo GENERA `tools/gen_light.py` (`python3 tools/gen_light.py css/style.css css/sets.css css/impresos.css css/claro.css`). Si cambias colores fijos en el CSS, vuelve a correrlo. No lo edites a mano.
  - "Islas oscuras" que no cambian: portada, claqueta, visor, sets de cada proyecto, pantallas, celulares, televisor.
- Inglés: `js/i18n.js`. El sitio se escribe en español; si el visitante elige inglés, i18n.js cambia cada texto por su traducción apenas aparece (diccionario `EN` + reglas para textos con números o nombres).
  - Texto nuevo en el sitio = agregar su traducción en `EN` con la frase EXACTA en español.
  - Nombres propios y títulos de piezas (La Cepa, Austin Marchese, títulos de reels y publicaciones) no se traducen.
  - El mensaje de WhatsApp del pedido también sale en inglés.
  - Para mandarle el portafolio a un cliente de EE. UU.: `https://alexpino.netlify.app/?lang=en`.
- En el inicio se quitaron el panel de "Capas" y la cinta de oficios (pedido del profe: menos movimiento). Lo demás de la portada sigue igual.

## Tokens y framework (Aplicaciones móviles y web, Momento 2)
- Framework CSS: Open Props (`css/vendor/open-props.min.css`, se carga antes de style.css). Solo variables: no trae componentes.
- Escalas en la sección 01 de style.css: espaciado `--space-1…12` (base 4 px) y tipografía `--fs-2xs…xl` + fluidas `--fs-lead/h3/h2/h1/display`.
- Regla: nada de px sueltos en padding, margin, gap ni font-size. Usa el token más cercano.
- README.md documenta la tecnología, la estructura, los tokens y el Atomic Design (con los nombres reales de las clases). Si renombras un componente, actualiza el README y Figma.

## Antes de dar algo por terminado
- Probar en escritorio y en celular de 390 px y 360 px de ancho: sin errores en consola y sin scroll horizontal.
- Probar en los dos temas (claro y oscuro) y en los dos idiomas.
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

## Experiencia «transmisión en vivo» (entrega 1)
- Misma identidad (colores, Krona One + Figtree, vidrio estriado, isotipo); cambia la ESTRUCTURA.
- `js/experiencia.js` (va después de main.js en todas las páginas): barra lateral con la escena actual, menú a pantalla completa (`.mnu`, Esc/Tab atrapado), corte entre páginas (`.corte`, sessionStorage `ap-cut`), video que se reproduce al pasar el mouse (`video[data-hover]`), título cinético de la portada (`.hero-pin` → `--k`) y «el programa» de escenas (`#prog-pin`, una escena por pantalla, línea de tiempo abajo).
- CSS en style.css sección 28. Escritorio ≥901px: la barra superior es una barra lateral (`--rail: 76px`). Celular: una fila (marca · menú · timecode); los switches viven dentro del menú.
- Clases nuevas que NO se deben reutilizar: `.mnu`, `.corte`, `.prg`, `.pslide`, `.pframe`, `.ptl-*`, `.kin*`, `.lens-o`.
- `.prog-stage`, `.mnu` y `.corte` son islas oscuras (también en tema claro); están en la lista ISL de tools/gen_light.py.
- Reducir movimiento: sin corte, título quieto y todas las escenas una debajo de otra.

## Experiencia, entrega 2
- Portada: el bloque de texto de la derecha es grande en escritorio (título 8.4vw, subtítulo 2.9vw); reglas al final de style.css.
- Audiovisual (experiencia.js §7): `.reelv` envuelve `#escenas` (clase `.reel-col`): palabra «Escenas» fija detrás (`.reel-word`), la tarjeta del centro se enciende (`.on`) y su ficha se escribe en `.rv-l`/`.rv-r`. Snap suave (`html.snap-reel`). Los filtros por oficio siguen igual.
- Proyecto (proyecto.js): entrada `#entry` con el título partido en diagonal (`.en-a`/`.en-b`, `--e` por scroll); «El caso» en `.cas` (un paso por pantalla, índice fijo a la izquierda); `.remate` con la cifra contando (solo si el proyecto tiene `cifra`; no se inventan cifras); `.crt` en Telecafé (tv) y Nos fui (sala de control); `.nxt` = siguiente escena a lo ancho.
- `.entry`, `.nxt-go` y `.crt` son islas oscuras en gen_light.py.

## Intro (index.html · #pre)
- 1 · Monitor (`.pre-mon`) con `assets/video/monitor-reel.mp4` (5 escenas de 4 s) y rótulos sincronizados por `timeupdate` (lista LT en main.js). Botón Play amarillo al centro.
- 2 · Play → `.pre.x`: `assets/video/montaje.mp4` (cortes que aceleran y frenan, ~10,8 s, termina congelado en el árbol) a pantalla completa dentro de `.x-face`, cuya máscara del isotipo encoge (3,3–5,7 s). Luego el isotipo gira en 3D (18 capas `.x-l` creadas por JS: filo arena + laterales petróleo), reflejo, se llena de arena (8,4 s), la cámara entra (9,5 s) y todo queda amarillo.
- 3 · Cuenta amarilla 3·2·1, un segundo por número (10,5–13,5 s), destello, obturador lento y portada. Tiempos largos a propósito (pedido de Alex: que las cosas tomen su tiempo).
- "Saltar intro" o Esc entra directo. Una vez por sesión (`ap-rec`); no sale con "reducir movimiento".
- Austin, Paisajes Íntimos y Nos fui pues mijo aún no están en los videos (solo existen en YouTube): cuando Alex mande clips mp4, regenerar monitor-reel.mp4 y montaje.mp4 (ver comandos ffmpeg en el historial) y añadir sus rótulos a LT.

## Vidrio y sección Web
- Sección 31 de style.css: vidrio esmerilado (tokens `--gl-fill`, `--gl-hi`, `--gl-rim`, `--gl-drop`) aplicado con un solo `:is(...)` a paneles, chips, botones, barra lateral. Versión clara con los mismos tokens bajo `html[data-theme="light"]`; gen_light.py no regenera esas reglas.
- web.html (Capítulo 05 · Web): datos en `D.web` (grupo "cero" = hechas de cero en código; "modificadas" = WordPress + Elementor), render en experiencia.js §8, CSS sección 32. Capturas en assets/web (primer pantallazo, 1280 px). Contacto pasó a ser 06 en el menú; atajos 1–6.
- Mis Finanzas va sin captura a propósito: la app abierta mostraba datos personales de Alex. Tarjeta tipográfica hasta que él mande una captura con datos de ejemplo.
- Pregón de la plaza = Escena 06 (proyecto universitario; cámara, dirección de fotografía y producción de las cápsulas + la web). El podcast NO se menciona (pedido de Alex). Sin cifra: el resultado es el tráiler publicado y el sitio en línea. El número de escenas en el Inicio sale de `D.destacados.length` (`--n`).

## Audiovisual = sala de proyección
- experiencia.js §7 crea `.sala` (fuera del `.wrap`, antes de `#audiovisual`): pantallas en arco con `transform` calculado en JS (`layout()`), títulos `.sala-tt`, anterior/siguiente, flechas del teclado (solo con la sala en pantalla), arrastre, filtros por oficio (lee `.f-out` de las `.scard` ocultas de `#escenas`, que siguen existiendo solo para eso).
- Imagen de cada pantalla: campo `sala` en `D.destacados` (assets/poster/sala-*.jpg; las de YouTube son sus portadas guardadas en el repo). La central corre su video si es local y horizontal (Telecafé).
- CSS sección 33. `.sala` es isla oscura (también en tema claro).

## Fondo unificado («luz de set»)
- Sección 34 de style.css: `.bg` ya no pinta las manchas SVG (oculto); es el fondo liso + una luz radial (`--lc`, `--lc2`, `--lx`, `--ly`, registradas con @property para que transicionen). experiencia.js §9 cambia la luz según la sección en pantalla (data-light="teal|sand|terra|petrol" opcional; si no, se alternan; CTA/remate = terra).
- Las franjas `.tone*` ya no pintan fondo ni textura (::before/::after ocultos). Hero, entrada de proyecto, programa y siguiente escena se funden con el fondo por degradado. No volver a poner fondos propios con bordes duros por sección.
- cursors.js: las cifras de la portada tienen red de seguridad (si el cursor no las anima en 6 s, cuentan solas).

## Recorrido lineal (pedido de Alex: que el visitante no se salte capítulos)
- Orden: Inicio → Sobre mí (01) → Audiovisual (02) → Gráfico (03) → Editorial (04) → Web (05) → Contacto (06). Lista CHAPS en experiencia.js §10.
- La portada es un tráiler por capítulos (`.chap#cap-0n`, data-chap, data-light). Ningún elemento de la portada lleva directo a un proyecto: el programa de escenas lleva a `audiovisual.html?e=N` (la sala abre en esa escena). Las cifras ya no son enlaces.
- Capítulo 01: frase con imágenes dentro (`[data-words]` + `.pill`, referencia Hero Studio); las palabras se encienden con el scroll. Si se cambia el texto, actualizar los fragmentos en i18n.js (se traducen antes de partir en palabras).
- Capítulos 03–05: adelantos con `[data-scrub]` (`--p` 0→1 al cruzar la pantalla): abanico de impresos, portadas que giran, ventanas que se despliegan.
- Cada página (01–05) termina con `.nextch` «Siguiente capítulo» (y «← Capítulo anterior»). En Sobre mí reemplaza su cierre anterior.
- En la portada, la barra lateral muestra el capítulo actual.
