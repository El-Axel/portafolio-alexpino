/* ==========================================================================
   Impresos que se tocan (páginas Gráfico y Editorial)
   - Libro 3D: pasa la página arrastrando, con clic o con las flechas.
   - Hablador: se gira arrastrándolo, como si estuviera en la mesa.
   - Marca: colores que se copian, patrón que corre y lupa en las aplicaciones.
   - Presentación: el manual de marca como diapositivas.
   - Feed: las piezas para redes dentro de un celular.
   - Estantería editorial: escoges una publicación y se abre en la mesa.
   El contenido sale de js/data.js ("vitrina" en cada pieza de Gráfico).
   ========================================================================== */
(function () {
  "use strict";
  var D = window.PORTFOLIO || {}, APP = window.APP || {}, U = APP.u;
  if (!U) return;
  var $ = U.$, $$ = U.$$, esc = U.esc, pad = U.pad;
  var reduce = APP.reduce, fine = APP.finePointer;

  /* ======================================================================
     LIBRO 3D
     Cada pliego se arma con dos mitades. Una página doble se parte en dos
     mitades de la misma imagen, así cualquier libro funciona igual.
     ====================================================================== */
  function Flipbook(el, b) {
    var pages = b.paginas || [], dobles = {};
    (b.dobles || []).forEach(function (i) { dobles[i] = 1; });
    var sp = U.spreads(pages.length, b.dobles).map(function (s) {
      if (s.length === 2) return [{ src: pages[s[0]], pos: "full" }, { src: pages[s[1]], pos: "full" }];
      var i = s[0];
      if (dobles[i]) return [{ src: pages[i], pos: "left" }, { src: pages[i], pos: "right" }];
      return i === 0 ? [null, { src: pages[i], pos: "full" }] : [{ src: pages[i], pos: "full" }, null];
    });
    var ar = String(b.ar || "3/4").split("/"), pr = (+ar[0] / +ar[1]) || .75;
    // si la proporción guardada es de una página doble, la página sencilla es la mitad
    if (pr > 1.1) pr = pr / 2;
    var cur = 0, busy = false;
    el.classList.add("fb-wrap");
    el.innerHTML = '<div class="fb" style="--pr:' + pr.toFixed(4) + '"><div class="fb-book"><div class="fb-half l"></div><div class="fb-half r"></div><span class="fb-spine"></span></div></div>' +
      '<div class="fb-ui"><button type="button" class="fb-btn prev" aria-label="Página anterior">‹</button>' +
      '<span class="fb-count" aria-live="polite"></span><button type="button" class="fb-btn next" aria-label="Página siguiente">›</button>' +
      '<button type="button" class="fb-big">Ver en grande</button></div>' + (fine ? '<p class="fb-hint">Arrastra la esquina o haz clic en la página</p>' : '<p class="fb-hint">Desliza para pasar la página</p>');
    var book = $(".fb-book", el), L = $(".fb-half.l", el), R = $(".fb-half.r", el), cnt = $(".fb-count", el);
    book.style.setProperty("--bar", (pr * 2).toFixed(4));
    function paint(node, h) {
      node.className = node.className.replace(/\s*(blank|pos-\w+)/g, "");
      if (!h) { node.style.backgroundImage = ""; node.classList.add("blank"); return; }
      node.style.backgroundImage = 'url("' + h.src + '")';
      node.classList.add("pos-" + h.pos);
    }
    function closedShift(s) { book.style.setProperty("--shift", !s[0] ? "-25%" : !s[1] ? "25%" : "0%"); }
    function draw() {
      var s = sp[cur]; paint(L, s[0]); paint(R, s[1]); closedShift(s);
      var nums = [];
      U.spreads(pages.length, b.dobles)[cur].forEach(function (i) { nums.push(i + 1); });
      cnt.textContent = (nums.length > 1 ? "Págs. " + nums.join("–") : "Pág. " + nums[0]) + " de " + pages.length;
      $(".prev", el).disabled = cur === 0; $(".next", el).disabled = cur === sp.length - 1;
      var nx = sp[cur + 1]; if (nx) nx.forEach(function (h) { if (h) new Image().src = h.src; });
    }
    function turn(d) {
      var to = cur + d;
      if (busy || to < 0 || to >= sp.length) return;
      if (reduce) { cur = to; draw(); return; }
      busy = true;
      var a = sp[cur], z = sp[to];
      var leaf = document.createElement("div");
      leaf.className = "fb-leaf " + (d > 0 ? "fwd" : "back");
      leaf.innerHTML = '<div class="fb-face front"></div><div class="fb-face backf"></div>';
      // hacia adelante: la hoja derecha se levanta; debajo ya está la derecha siguiente
      if (d > 0) { paint($(".front", leaf), a[1]); paint($(".backf", leaf), z[0]); paint(R, z[1]); }
      else { paint($(".front", leaf), a[0]); paint($(".backf", leaf), z[1]); paint(L, z[0]); }
      $$(".fb-face", leaf).forEach(function (f) { f.classList.add("fb-half"); });
      book.appendChild(leaf);
      book.style.setProperty("--shift", (!z[0] ? "-25%" : !z[1] ? "25%" : "0%"));
      requestAnimationFrame(function () { requestAnimationFrame(function () { leaf.classList.add("go"); }); });
      setTimeout(function () { cur = to; draw(); leaf.remove(); busy = false; }, 720);
    }
    $(".prev", el).addEventListener("click", function () { turn(-1); });
    $(".next", el).addEventListener("click", function () { turn(1); });
    $(".fb-big", el).addEventListener("click", function () { U.openBook(b); });
    // arrastrar o tocar la página
    var x0 = null, side = 0;
    book.addEventListener("pointerdown", function (e) {
      var r = book.getBoundingClientRect(); side = (e.clientX - r.left) > r.width / 2 ? 1 : -1; x0 = e.clientX;
      book.setPointerCapture(e.pointerId);
    });
    book.addEventListener("pointerup", function (e) {
      if (x0 == null) return;
      var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 30) turn(dx < 0 ? 1 : -1); else turn(side);
    });
    book.addEventListener("pointercancel", function () { x0 = null; });
    el.tabIndex = 0;
    el.setAttribute("role", "group");
    el.setAttribute("aria-label", "Publicación: " + (b.titulo || "") + ". Usa las flechas para pasar la página.");
    el.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); turn(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); turn(-1); }
    });
    // la esquina se levanta un poquito al pasar el cursor
    if (fine && !reduce) book.addEventListener("mousemove", function (e) {
      var r = book.getBoundingClientRect(); book.classList.toggle("peek-r", e.clientX > r.right - r.width * .18); book.classList.toggle("peek-l", e.clientX < r.left + r.width * .18);
    });
    book.addEventListener("mouseleave", function () { book.classList.remove("peek-r", "peek-l"); });
    draw();
    return { turn: turn, el: el };
  }

  /* ---------- lupa ---------- */
  function loupe(node, src) {
    if (!fine || reduce) return;
    var lens = document.createElement("span"); lens.className = "loupe"; lens.setAttribute("aria-hidden", "true");
    node.appendChild(lens); node.classList.add("has-loupe");
    node.addEventListener("mousemove", function (e) {
      var r = node.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, z = 2.4;
      lens.style.cssText = "left:" + x + "px;top:" + y + "px;background-image:url('" + (src || node.dataset.zoom) + "');background-size:" + (r.width * z) + "px " + (r.height * z) + "px;background-position:" + (-x * z + 80) + "px " + (-y * z + 80) + "px";
    });
  }

  function toast(t) {
    var h = $("#hud"); if (!h) return;
    h.textContent = t; h.classList.remove("show"); void h.offsetWidth; h.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { h.classList.remove("show"); }, 1300);
  }

  /* ======================================================================
     VITRINAS DE GRÁFICO
     ====================================================================== */
  var V = {};
  function intro(g, i, extra) {
    return '<div class="vt-text reveal"><p class="ph-kicker"><b class="rec"></b>Pieza ' + pad(i + 1) + " · " + esc(g.tipo || "") + "</p><h2>" + esc(g.titulo) + "</h2>" +
      (g.texto ? "<p>" + esc(g.texto) + "</p>" : "") + (extra || "") + "</div>";
  }

  V.libro3d = function (g, i) {
    return '<section class="vitrina vt-libro wrap" id="' + esc(g.id) + '">' + intro(g, i, '<p class="vt-how">Pasa la página arrastrando la esquina, con clic o con las flechas del teclado.</p>') +
      '<div class="vt-stage table reveal"><div class="fb-mount"></div></div></section>';
  };
  V.libro3d.wire = function (sec, g) { var fb = Flipbook($(".fb-mount", sec), g); sec._fb = fb; };

  V.hablador = function (g, i) {
    var im = g.imagenes || [];
    return '<section class="vitrina vt-hablador wrap" id="' + esc(g.id) + '">' + intro(g, i, '<p class="vt-how">Arrástralo para girarlo. <span class="side-say">Estás viendo la <b>cara A</b>.</span></p>') +
      '<div class="vt-stage table reveal"><div class="tent3d" role="img" aria-label="Hablador de mesa con dos caras">' +
      '<div class="tent"><div class="tface a" style="background-image:url(\'' + esc(im[0]) + '\')"></div><div class="tface b" style="background-image:url(\'' + esc(im[1] || im[0]) + '\')"></div><span class="tshade"></span></div>' +
      '<span class="tshadow"></span></div><div class="t-ctrl"><button type="button" class="btn sm" data-face="0">Cara A</button><button type="button" class="btn sm" data-face="180">Cara B</button></div></div></section>';
  };
  V.hablador.wire = function (sec) {
    var stage = $(".tent3d", sec), tent = $(".tent", sec), say = $(".side-say b", sec);

    var ang = -24, vel = 0, drag = false, x0 = 0, last = 0, idle = !reduce, raf = 0;
    // el giro se simula achicando la cara de lado y cambiándola al pasar el filo:
    // funciona igual en todos los navegadores, sin depender del 3D
    var fa = $(".tface.a", sec), fb = $(".tface.b", sec), shade = $(".tshade", sec);
    function set(a) {
      ang = a;
      var r = a * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r), front = c >= 0;
      tent.style.transform = "scaleX(" + Math.max(Math.abs(c), .035).toFixed(3) + ") skewY(" + (sn * (front ? -5 : 5)).toFixed(2) + "deg)";
      fa.style.opacity = front ? 1 : 0; fb.style.opacity = front ? 0 : 1;
      shade.style.opacity = ((1 - Math.abs(c)) * .55).toFixed(3);
      shade.style.background = "linear-gradient(" + (sn * (front ? 1 : -1) > 0 ? "90deg" : "270deg") + ",rgba(0,0,0,.6),transparent)";
      say.textContent = front ? "cara A" : "cara B";
    }
    function loop() {
      if (!drag) { if (Math.abs(vel) > .05) { vel *= .94; set(ang + vel); } else if (idle) set(ang + .25); }
      raf = requestAnimationFrame(loop);
    }
    stage.addEventListener("pointerdown", function (e) { drag = true; idle = false; x0 = last = e.clientX; vel = 0; stage.setPointerCapture(e.pointerId); stage.classList.add("grab"); });
    stage.addEventListener("pointermove", function (e) { if (!drag) return; var dx = e.clientX - last; last = e.clientX; vel = dx * .5; set(ang + dx * .5); });
    var end = function () { drag = false; stage.classList.remove("grab"); };
    stage.addEventListener("pointerup", end); stage.addEventListener("pointercancel", end);
    $(".t-ctrl", sec).addEventListener("click", function (e) {
      var b = e.target.closest("[data-face]"); if (!b) return;
      idle = false; vel = 0; tent.style.transition = "transform .8s cubic-bezier(.2,.7,.2,1)"; set(+b.dataset.face + (ang > 90 && +b.dataset.face === 0 ? 360 * Math.round(ang / 360) : 0) - 14);
      setTimeout(function () { tent.style.transition = ""; }, 820);
    });
    set(ang);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { if (es[0].isIntersecting) { cancelAnimationFrame(raf); loop(); } else cancelAnimationFrame(raf); }).observe(stage);
    else loop();
    APP.hablador = { set: function (a) { idle = false; set(a); }, get: function () { return ang; } };
  };

  V.marca = function (g, i) {
    var im = g.imagenes || [], col = g.colores || [];
    var sw = col.map(function (c) { return '<button type="button" class="sw" style="--c:' + esc(c) + '" data-c="' + esc(c) + '"><span></span><b>' + esc(c) + "</b><small>Copiar</small></button>"; }).join("");
    var apps = im.slice(3).map(function (src, k) { return '<button type="button" class="app-pic" data-k="' + (k + 3) + '" data-zoom="' + esc(src) + '"><img src="' + esc(src) + '" alt="Aplicación ' + (k + 1) + ' de ' + esc(g.titulo) + '" loading="lazy"></button>'; }).join("");
    return '<section class="vitrina vt-marca wrap" id="' + esc(g.id) + '">' + intro(g, i, sw ? '<div class="swatches">' + sw + "</div>" : "") +
      '<div class="vt-stage board reveal"><div class="logo-card"><img src="' + esc(im[0]) + '" alt="Logo ' + esc(g.titulo) + '"></div>' +
      (im[2] ? '<div class="pattern" style="background-image:url(\'' + esc(im[2]) + '\')" aria-hidden="true"></div>' : "") +
      (apps ? '<div class="apps">' + apps + "</div>" : "") + "</div></section>";
  };
  V.marca.wire = function (sec, g) {
    $$(".sw", sec).forEach(function (b) {
      b.addEventListener("click", function () {
        var c = b.dataset.c;
        var ok = function () { b.classList.add("copied"); toast("Copiado " + c); setTimeout(function () { b.classList.remove("copied"); }, 1200); };
        if (navigator.clipboard) navigator.clipboard.writeText(c).then(ok, ok); else ok();
      });
    });
    $$(".app-pic", sec).forEach(function (a) { loupe(a); });
    sec.addEventListener("click", function (e) {
      var a = e.target.closest(".app-pic"); if (!a) return;
      U.openViewer((g.imagenes || []).map(function (src) { return { kind: "image", src: src, title: g.titulo }; }), +a.dataset.k);
    });
  };

  V.presentacion = function (g, i) {
    var pg = g.paginas || g.imagenes || [];
    var th = pg.map(function (src, k) { return '<button type="button" class="thumbp' + (k === 0 ? " on" : "") + '" data-k="' + k + '" aria-label="Diapositiva ' + (k + 1) + '"><img src="' + esc(src) + '" alt="" loading="lazy"></button>'; }).join("");
    return '<section class="vitrina vt-deck wrap" id="' + esc(g.id) + '">' + intro(g, i, '<p class="vt-how">Pasa las diapositivas con las flechas o tocando la pantalla.</p>') +
      '<div class="vt-stage reveal"><div class="deck"><div class="deck-screen" tabindex="0" aria-label="Presentación ' + esc(g.titulo) + '"><img class="slide" src="' + esc(pg[0]) + '" alt="Diapositiva 1">' +
      '<button type="button" class="dk prev" aria-label="Anterior">‹</button><button type="button" class="dk next" aria-label="Siguiente">›</button>' +
      '<span class="dk-n">01 / ' + pad(pg.length) + '</span><span class="dk-prog"><i></i></span></div><div class="deck-foot"></div></div>' +
      '<div class="thumbsp">' + th + "</div></div></section>";
  };
  V.presentacion.wire = function (sec, g) {
    var pg = g.paginas || g.imagenes || [], k = 0, img = $(".slide", sec), scr = $(".deck-screen", sec);
    function go(n) {
      k = (n + pg.length) % pg.length;
      img.classList.remove("in"); void img.offsetWidth;
      img.src = pg[k]; img.alt = "Diapositiva " + (k + 1); img.classList.add("in");
      $(".dk-n", sec).textContent = pad(k + 1) + " / " + pad(pg.length);
      $(".dk-prog i", sec).style.width = ((k + 1) / pg.length * 100) + "%";
      $$(".thumbp", sec).forEach(function (t) { t.classList.toggle("on", +t.dataset.k === k); });
      var t = $('.thumbp[data-k="' + k + '"]', sec), strip = t.parentNode;
      strip.scrollTo({ left: t.offsetLeft - strip.clientWidth / 2 + t.clientWidth / 2, behavior: reduce ? "auto" : "smooth" });
      if (pg[k + 1]) new Image().src = pg[k + 1];
    }
    $(".prev", sec).addEventListener("click", function (e) { e.stopPropagation(); go(k - 1); });
    $(".next", sec).addEventListener("click", function (e) { e.stopPropagation(); go(k + 1); });
    scr.addEventListener("click", function (e) { var r = scr.getBoundingClientRect(); go(e.clientX - r.left < r.width / 3 ? k - 1 : k + 1); });
    scr.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") { e.preventDefault(); go(k + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(k - 1); } });
    $(".thumbsp", sec).addEventListener("click", function (e) { var t = e.target.closest(".thumbp"); if (t) go(+t.dataset.k); });
    var tx = null;
    scr.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
    scr.addEventListener("touchend", function (e) { if (tx == null) return; var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) go(dx < 0 ? k + 1 : k - 1); tx = null; });
    go(0);
  };

  V.feed = function (g, i) {
    var im = g.imagenes || [];
    var posts = im.map(function (src, k) { return '<button type="button" class="post" data-k="' + k + '"><img src="' + esc(src) + '" alt="Publicación ' + (k + 1) + '" loading="lazy"></button>'; }).join("");
    var handle = g.titulo.toLowerCase().replace(/[^a-z0-9]+/g, "");
    return '<section class="vitrina vt-feed wrap" id="' + esc(g.id) + '">' + intro(g, i, '<p class="vt-how">Así se ven en el perfil. Toca una publicación para abrirla.</p>') +
      '<div class="vt-stage reveal"><div class="phone big"><span class="ph-screen feed-scr">' +
      '<span class="fd-top"><b>' + esc(handle) + "</b></span>" +
      '<span class="fd-prof"><span class="fd-av"><img src="' + esc(g.portada || im[0]) + '" alt=""></span><span class="fd-stats"><b>' + im.length + "</b><small>publicaciones</small></span></span>" +
      '<span class="fd-name">' + esc(g.titulo) + "</span>" +
      '<span class="fd-grid">' + posts + "</span>" +
      '<span class="fd-open" hidden><button type="button" class="fd-back">← Volver al perfil</button><img alt=""><span class="fd-acts"></span></span>' +
      '</span><span class="notch"></span></div></div></section>';
  };
  V.feed.wire = function (sec, g) {
    var open = $(".fd-open", sec), im = g.imagenes || [];
    sec.addEventListener("click", function (e) {
      var p = e.target.closest(".post");
      if (p) { $("img", open).src = im[+p.dataset.k]; open.hidden = false; open.classList.remove("in"); void open.offsetWidth; open.classList.add("in"); return; }
      if (e.target.closest(".fd-back")) open.hidden = true;
    });
  };

  /* ---------- montar Gráfico ---------- */
  var vit = $("#vitrinas");
  if (vit) {
    var items = (D.grafico || []).filter(function (g) { return V[g.vitrina]; });
    vit.innerHTML = '<nav class="vt-index wrap" aria-label="Piezas">' + items.map(function (g, i) {
      return '<a href="#' + esc(g.id) + '"><span>' + pad(i + 1) + "</span>" + esc(g.titulo.split(" · ")[0]) + "</a>";
    }).join("") + "</nav>" + items.map(function (g, i) {
      // cada pieza cambia de material: papel, oscuro, semitono…
      var tone = ["tone-mist", "", "tone-petrol", "tone-film", "tone-sand"][i % 5];
      return V[g.vitrina](g, i).replace('<section class="vitrina', '<section class="tone pad ' + tone + ' vitrina');
    }).join("");
    items.forEach(function (g) { var sec = document.getElementById(g.id); if (V[g.vitrina].wire) V[g.vitrina].wire(sec, g); });
    // si llegan con #ancla (por ejemplo desde La Cepa), bajar a esa pieza
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(function () { t.scrollIntoView(); }, 60); }
    APP.flipFirst = function () { var s = $(".vt-libro"); return s && s._fb; };
  }

  /* ======================================================================
     EDITORIAL: la mesa y la estantería
     ====================================================================== */
  var mesa = $("#mesa"), estante = $("#estante");
  if (mesa && estante) {
    var books = D.editorial || [], current = -1, fb = null;
    estante.innerHTML = books.map(function (b, i) {
      return '<button type="button" class="lomo" data-i="' + i + '" style="--ar:' + esc(b.ar || "3/4") + ';--i:' + i + '" aria-label="Abrir ' + esc(b.titulo) + '">' +
        '<span class="lomo-cover"><img src="' + esc(b.portada) + '" alt="" loading="lazy"></span><b>' + esc(b.titulo) + "</b><small>" + esc(b.tipo || "") + " · " + (b.paginas || []).length + " págs.</small></button>";
    }).join("");
    function openOn(i) {
      if (i === current) return;
      current = i; var b = books[i];
      $$(".lomo", estante).forEach(function (l) { var on = +l.dataset.i === i; l.classList.toggle("on", on); l.setAttribute("aria-pressed", on); });
      mesa.innerHTML = '<div class="mesa-head"><p class="ph-kicker"><b class="rec"></b>' + esc(b.tipo || "") + " · " + (b.paginas || []).length + " páginas</p><h2>" + esc(b.titulo) + '</h2></div><div class="mesa-book table"></div>';
      mesa.classList.remove("in"); void mesa.offsetWidth; mesa.classList.add("in");
      fb = Flipbook($(".mesa-book", mesa), b);
    }
    estante.addEventListener("click", function (e) {
      var l = e.target.closest(".lomo"); if (!l) return;
      openOn(+l.dataset.i);
      mesa.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
    openOn(0);
    APP.flipFirst = function () { return fb; };
  }

  // las apariciones de estas páginas nacieron después de que main.js revisara la página
  var rev = $$(".vitrinas .reveal, .mesa .reveal");
  if (reduce || !("IntersectionObserver" in window)) rev.forEach(function (r) { r.classList.add("in"); });
  else { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" }); rev.forEach(function (r) { io.observe(r); }); }
})();
