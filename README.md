# Alex Pino · Portafolio

Portafolio profesional de **Alexander Pino Caro**, Diseñador Crossmedia y Creador Audiovisual (Pereira, Colombia).

- **Sitio publicado:** https://alexpino.netlify.app
- **En inglés:** https://alexpino.netlify.app/?lang=en

**Concepto:** "¿Quién soy? Depende del proyecto." Cada proyecto es una *escena* donde Alex cumple un papel distinto: editor, director de fotografía, camarógrafo o diseñador. La interfaz es una mesa de edición vista a través de vidrio estriado: claqueta, timecode, línea de tiempo y monitores.

---

## Tecnología (Ruta B · desarrollo a medida)

| Capa | Qué se usa | Por qué |
|---|---|---|
| Estructura | **HTML5** semántico (`header`, `nav`, `main`, `section`, `footer`, `aria-*`) | Accesible y sin dependencias. |
| Estilos | **CSS3** con *design tokens* en variables CSS | Un solo lugar para colores, tipografía, espaciado y radios. |
| Framework CSS | **[Open Props](https://open-props.style) v1.7.16** (sizes, fonts, easings, borders) | Es un framework de variables CSS. Da escalas probadas de tamaño, tipografía y curvas de animación sin imponer componentes ni reescribir el diseño. Los tokens del sitio se construyen encima (`--space-4: var(--size-3)`). |
| Interacción | **JavaScript** (vanilla, sin build) | Claqueta, línea de tiempo funcional sobre los videos, visor, filtros por oficio, vitrinas de impresos, pedido por WhatsApp, tema claro/oscuro e idioma ES/EN. |
| Video | YouTube IFrame API y MP4 locales | Arrastrar el cabezal adelanta el video de verdad. |
| Publicación | **Netlify** conectado a este repositorio (`main`) | Cada `push` publica el sitio. |

No hay paso de compilación: el repositorio es el sitio.

---

## Cómo ejecutarlo

```bash
git clone https://github.com/El-Axel/portafolio-alexpino.git
cd portafolio-alexpino

# Opción 1: VS Code → extensión Live Server → clic derecho en index.html → "Open with Live Server"
# Opción 2: cualquier servidor estático
python3 -m http.server 8000      # y abrir http://localhost:8000
```

Abrir `index.html` con doble clic también funciona, pero los videos de YouTube necesitan un servidor (`http://`).

**Publicar:** hacer commit y `push` a `main`. Netlify publica la carpeta raíz (`netlify.toml` → `publish = "."`).

---

## Estructura

```
├── index.html                 Inicio
├── sobre-mi.html              Sobre mí (origen, Grabo/Edito/Cuento, línea de tiempo)
├── audiovisual.html           Escenas audiovisuales + reels y videoclips
├── grafico.html               Diseño gráfico (vitrinas interactivas)
├── editorial.html             Diseño editorial (estantería + libro)
├── web.html                   Sitios y apps web (hechas de cero / páginas que sumé)
├── contacto.html              "Arma tu pedido" → WhatsApp
├── proyecto-*.html            Una página por proyecto (5), armadas por js/proyecto.js
├── 404.html
├── css/
│   ├── vendor/open-props.min.css   Framework (tokens base)
│   ├── style.css              Tokens + base + componentes (secciones numeradas 01–32)
│   ├── sets.css               "Sets" de cada proyecto (editor, celulares, TV, cine, control)
│   ├── impresos.css           Vitrinas de gráfico y editorial
│   └── claro.css              Tema claro (GENERADO por tools/gen_light.py)
├── js/
│   ├── data.js                TODO el contenido (proyectos, cifras, textos, videos)
│   ├── i18n.js                Traducción ES → EN
│   ├── shell.js               Barra superior, pie, visor y ayudas comunes a todas las páginas
│   ├── main.js                Lógica común (línea de tiempo, claqueta, filtros, pedido…)
│   ├── experiencia.js         Menú a pantalla completa, cortes entre páginas, portada cinética, «el programa» y el reel de Audiovisual
│   ├── proyecto.js            Páginas de proyecto (entrada en diagonal, el caso paso a paso, cifra de remate, CRT)
│   ├── impresos.js            Vitrinas y libros
│   ├── paginas.js             Sobre mí
│   └── cursors.js             Cursores animados que "diseñan" la página
├── assets/                    Imágenes, posters, videos comprimidos y páginas de PDF
└── tools/gen_light.py         Genera css/claro.css a partir de los colores del CSS
```

**Contenido separado de la presentación:** los textos y proyectos viven en `js/data.js`. Las páginas son casi vacías (`<body data-page="…">`) y los scripts las arman. Por eso un proyecto nuevo es un objeto más en `data.js`, no una página nueva escrita a mano.

---

## Design System

### Tokens (`css/style.css` · sección 01)

**Color**

| Token | HEX | Uso |
|---|---|---|
| `--ground` | `#0B1315` | Fondo |
| `--ink` | `#F4F1EA` | Texto |
| `--petrol` | `#2A5159` | Color de marca, zonas |
| `--teal` | `#2EA690` | Acento, foco, enlaces |
| `--sand` | `#F2C572` | Botón principal, énfasis |
| `--peach` | `#F29863` | Acento cálido, llamados finales |
| `--terra` | `#D9674E` | REC, timecode, alertas |

Tema claro (`html[data-theme="light"]`): `--ground #EEF2F0` y `--ink #10201F`, más acentos oscurecidos para mantener el contraste.

**Tipografía** (máximo dos familias): **Krona One** para títulos y **Figtree** para texto e interfaz.

| Token | Valor | Uso |
|---|---|---|
| `--fs-2xs` | 10px | Chips, timecode |
| `--fs-xs` | 11px | Etiquetas en mayúsculas |
| `--fs-sm` | 12px | Metadatos |
| `--fs-md` | 13px | Navegación, botones |
| `--fs-base` | 14px | Texto secundario |
| `--fs-body` | 16px | Lectura |
| `--fs-lg` | 18px | Entradillas |
| `--fs-xl` | 24px | Títulos de tarjeta |
| `--fs-lead` → `--fs-display` | fluidos (`clamp`) | Títulos de sección y portada |

**Espaciado** (base 4px, sobre Open Props `--size-*`): `--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 20 · `--space-6` 24 · `--space-7` 32 · `--space-8` 40 · `--space-9` 48 · `--space-10` 64 · `--space-11` 80 · `--space-12` 96 · `--space-section` (fluido).

**Radios y movimiento:** `--radius` 18px (paneles), `--radius-md` 10px, `--radius-sm` 5px, `--radius-pill`; `--ease`, `--ease-io` y `--ease-out` (Open Props).

### Atomic Design (correspondencia con el código)

| Nivel | Componentes (clase CSS) |
|---|---|
| **Átomos** | Tokens de color, tipo y espacio · `.btn` (+ `.primary`) · `.chip` · `.label` · `.tc` (timecode) · `.dot` · iconos SVG · `.tgl` (switch) |
| **Moléculas** | `.stat` (cifra + texto) · `.opt` (opción del pedido) · campo con etiqueta del pedido · `.ficha` (dato de ficha técnica) · grupo de botones del cierre · `.prefs` (tema + idioma) |
| **Organismos** | `.topbar` (barra lateral: marca + botón de menú + escena actual + prefs + timecode) · `.mnu` (menú a pantalla completa) · `.pslide` (escena del programa) · `.corte` (transición) · `.scard` (tarjeta de escena) · `.bhead` (encabezado de sección: rombo + título + etiqueta + número) · `.tlx` (línea de tiempo de video) · `.brief` (formulario "Arma tu pedido") · `.viewer` (visor) · `.cta` (cierre "Próxima escena") · `footer` / créditos · `.pre` (claqueta) |
| **Plantillas** | `data-page="inicio"`, `"sobre-mi"`, `"audiovisual"`, `"grafico"`, `"editorial"`, `"web"`, `"contacto"` y `"proyecto"`. Esta última es una sola plantilla que se rellena con `data-id` + `data.js` para los 5 proyectos. |
| **Páginas** | `index.html`, `sobre-mi.html`, `audiovisual.html`, `grafico.html`, `editorial.html`, `web.html`, `contacto.html` y las 5 páginas `proyecto-*.html` |

### Reglas de uso
- No hay barras, porcentajes ni puntos para medir habilidades.
- Cada proyecto muestra su efectividad: Problema → Proceso → Solución → Resultado, con cifras reales.
- No se usa el mismo "material" (tono o vidrio) en dos zonas seguidas.
- Se respeta "reducir movimiento": sin claqueta ni cursores, y el sitio se ve terminado.

### Responsive
Puntos de quiebre en **900px** (la barra lateral pasa a ser una fila arriba y los proyectos a una columna) y **760px** (celular: la portada pasa a vertical). Probado en 1440, 1024, 390 y 360px, sin scroll horizontal.

---

## Accesibilidad básica
- Enlace "Saltar al contenido".
- Foco visible y `aria-label` en los controles.
- Switches con `role="switch"` y `aria-checked`.
- Textos alternativos en las imágenes.
- `lang` correcto en ES y EN.
- Contraste revisado en los dos temas.
- Atajos de teclado: `1–6` secciones, `J K L` reproducción, `?` ayuda.
