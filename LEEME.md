# Portafolio Alex Pino

Sitio estático (HTML, CSS y JS, sin dependencias). Se sube tal cual a Netlify.

## Publicar en Netlify
1. Entra a app.netlify.com → **Add new site → Deploy manually**.
2. Arrastra **esta carpeta completa** (la que tiene `index.html`).
3. Listo. Para actualizar, arrastra la carpeta otra vez en *Deploys*.

## Verlo en tu computador
Abre la carpeta en Visual Studio Code y usa la extensión **Live Server** (clic derecho en `index.html` → *Open with Live Server*).
Abrir `index.html` con doble clic también funciona, pero los videos de YouTube se ven mejor con Live Server.

## Editar contenido
Todo el contenido está en **`js/data.js`**: títulos, clientes, años, roles, cifras, videos de YouTube, reels, piezas gráficas y publicaciones.
- **Videos de YouTube:** solo cambia el `id` (lo que va después de `watch?v=`).
- **Videoclips:** agrega los de Apóstol en `videoclips` con el mismo formato de `destacados`. Si la lista está vacía, la sección no aparece.
- **WhatsApp:** pon tu número en `contacto.whatsapp` (ej. `"573001234567"`) y aparece el botón.
- **Reels:** cambia `titulo` y `cliente` de cada uno si alguno no corresponde.

## Estructura
- `index.html` · estructura
- `css/style.css` · estilos (identidad: Krona One + Figtree, paleta teal & orange)
- `js/main.js` · interacción (visor, libros, reels, código de tiempo)
- `js/data.js` · contenido
- `assets/` · imágenes, videos comprimidos, páginas de los PDF
