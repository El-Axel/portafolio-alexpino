/* Alex Pino · Portafolio — interacción */
(function () {
  "use strict";
  var D = window.PORTFOLIO || {};
  var doc = document.documentElement;
  doc.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var pad = function (n) { return String(n).padStart(2, "0"); };
  var SEL = "<b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b>";

  /* ---------- miniaturas de YouTube ---------- */
  function ytThumb(id) { return "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg"; }
  function ytEmbed(id) { return "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&modestbranding=1"; }

  /* ---------- proyectos (destacados y videoclips) ---------- */
  function renderProjects(list, mount, startIndex) {
    if (!mount) return;
    mount.innerHTML = list.map(function (p, i) {
      var v = p.videos || [];
      var first = v[0] || {};
      var thumbs = v.length > 1 ? '<div class="thumbs" role="tablist">' + v.map(function (x, j) {
        var img = x.tipo === "youtube" ? ytThumb(x.id) : (x.poster || "");
        return '<button class="thumb' + (j === 0 ? " on" : "") + '" type="button" data-p="' + i + '" data-v="' + j + '" aria-label="' + esc(x.titulo) + '"><img src="' + img + '" alt="" loading="lazy"><span>' + esc(x.titulo) + "</span></button>";
      }).join("") + "</div>" : "";
      var roles = (p.roles || []).map(function (r) { return '<span class="chip">' + esc(r) + "</span>"; }).join("");
      var res = (p.cifra || p.cifraTexto) ? '<div class="p-res">' + (p.cifra ? '<span class="v">' + esc(p.cifra) + "</span>" : "") + '<span class="t">' + esc(p.cifraTexto) + "</span></div>" : "";
      return '<article class="project reveal" id="p-' + esc(p.id) + '">' +
        '<div class="p-info glass"><div class="p-num"><b>' + pad(startIndex + i + 1) + '</b><span class="label">' + esc(p.anio) + "</span></div>" +
        "<h3>" + esc(p.titulo) + '</h3><p class="meta">' + esc(p.cliente) + '</p><div class="roles">' + roles + "</div>" +
        '<p class="desc">' + esc(p.descripcion) + "</p>" + res + "</div>" +
        '<div class="player"><div class="screen" data-p="' + i + '">' + screenHTML(first) + "</div>" + thumbs + "</div></article>";
    }).join("");
    mount.addEventListener("click", function (e) {
      var t = e.target.closest(".thumb");
      var play = e.target.closest(".playbtn");
      if (t) {
        var p = list[+t.dataset.p], v = p.videos[+t.dataset.v];
        var art = t.closest(".project");
        art.querySelectorAll(".thumb").forEach(function (b) { b.classList.toggle("on", b === t); });
        art.querySelector(".screen").innerHTML = screenHTML(v);
      } else if (play) {
        var scr = play.closest(".screen");
        var art2 = scr.closest(".project");
        var on = art2.querySelector(".thumb.on");
        var proj = list[+scr.dataset.p];
        var vid = proj.videos[on ? +on.dataset.v : 0];
        playIn(scr, vid);
      }
    });
  }
  function screenHTML(v) {
    if (!v) return "";
    var img = v.tipo === "youtube" ? ytThumb(v.id) : (v.poster || "");
    return '<img src="' + img + '" alt="" loading="lazy"><span class="scr-tc"><b class="rec"></b>' + esc(v.titulo) + '</span><button class="playbtn" type="button" aria-label="Reproducir ' + esc(v.titulo) + '"><span class="pb"></span></button>';
  }
  function playIn(scr, v) {
    if (v.tipo === "youtube") {
      scr.innerHTML = '<iframe src="' + ytEmbed(v.id) + '" title="' + esc(v.titulo) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    } else {
      scr.innerHTML = '<video src="' + esc(v.src) + '" poster="' + esc(v.poster || "") + '" controls autoplay playsinline></video>';
    }
  }

  /* ---------- reels ---------- */
  function renderReels(list, mount, wrap) {
    if (!mount || !list || !list.length) return;
    wrap.hidden = false;
    mount.innerHTML = list.map(function (r, i) {
      return '<button class="reel reveal' + (r.ancho ? " wide" : "") + '" type="button" data-i="' + i + '" aria-label="Ver ' + esc(r.titulo) + '">' +
        '<video muted loop playsinline preload="none" poster="' + esc(r.poster) + '" data-src="' + esc(r.src) + '"></video>' +
        (r.dur ? '<span class="dur">' + esc(r.dur) + "</span>" : "") +
        '<span class="cap"><small>' + esc(r.cliente || "") + "</small><b>" + esc(r.titulo) + "</b></span></button>";
    }).join("");
    var vids = mount.querySelectorAll("video");
    function load(v) { if (!v.src) v.src = v.dataset.src; }
    var fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    if (fine && !reduce) {
      mount.querySelectorAll(".reel").forEach(function (b) {
        var v = b.querySelector("video");
        b.addEventListener("mouseenter", function () { load(v); v.play().catch(function () {}); });
        b.addEventListener("mouseleave", function () { v.pause(); });
      });
    } else if (!reduce && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { var v = e.target; if (e.isIntersecting) { load(v); v.play().catch(function () {}); } else { v.pause(); } });
      }, { threshold: .65 });
      vids.forEach(function (v) { io.observe(v); });
    }
    mount.addEventListener("click", function (e) {
      var b = e.target.closest(".reel"); if (!b) return;
      openViewer(list.map(function (r) { return { kind: "video", src: r.src, poster: r.poster, title: r.titulo + (r.cliente ? " · " + r.cliente : "") }; }), +b.dataset.i);
    });
  }

  /* ---------- gráfico ---------- */
  function pieceCard(g) {
    var n = (g.imagenes || g.paginas || []).length;
    var badge = g.modo === "libro" ? '<span class="count">Hojear · ' + n + " págs.</span>" : (n > 1 ? '<span class="count">' + n + " piezas</span>" : "");
    if (g.mockup === "hablador") {
      var im = g.imagenes || [];
      return '<div class="card mock-table" style="--ar:' + esc(g.ar || "4/5") + '"><div class="stand"><span class="shadow"></span><div class="tent"><div class="face front"><img src="' + esc(im[0]) + '" alt="Cara 1 del hablador" loading="lazy"></div><div class="face back"><img src="' + esc(im[1] || im[0]) + '" alt="Cara 2 del hablador" loading="lazy"></div></div></div>' + badge + '<span class="hint">Mueve el cursor para girarlo</span></div>';
    }
    if (g.mockup === "menu") {
      var p = g.paginas || [];
      return '<div class="card mock-menu" style="--ar:' + esc(g.ar || "16/10") + '"><img class="m3" src="' + esc(p[5] || p[1]) + '" alt="" loading="lazy"><img class="m2" src="' + esc(p[3] || p[1]) + '" alt="" loading="lazy"><img class="m1" src="' + esc(p[0]) + '" alt="Portada de la carta" loading="lazy">' + badge + "</div>";
    }
    if (g.mockup === "marca") {
      var m = g.imagenes || [];
      return '<div class="card mock-brand" style="--ar:' + esc(g.ar || "21/9") + '"><div class="mb-wrap mb1"><img src="' + esc(m[0]) + '" alt="Logo ' + esc(g.titulo) + '" loading="lazy"><span class="chips"><i style="--c:#28A8B5"></i><i style="--c:#FFBB12"></i><i style="--c:#D85B95"></i></span></div><div class="mb-wrap"><img src="' + esc(m[5] || m[1]) + '" alt="" loading="lazy"></div><div class="mb-wrap"><img src="' + esc(m[7] || m[2]) + '" alt="" loading="lazy"></div>' + badge + "</div>";
    }
    return '<div class="card" style="--ar:' + esc(g.ar || "4/5") + '"><img src="' + esc(g.portada) + '" alt="' + esc(g.titulo) + '" loading="lazy">' + badge + "</div>";
  }
  function renderPieces(list, mount) {
    if (!mount) return;
    if (!list || !list.length) { mount.innerHTML = '<p class="empty">Piezas en preparación.</p>'; return; }
    mount.innerHTML = list.map(function (g, i) {
      return '<button class="piece reveal ' + esc(g.ancho || "") + '" type="button" data-i="' + i + '" aria-label="Ver ' + esc(g.titulo) + '">' + pieceCard(g) +
        '<div class="pc"><b>' + esc(g.titulo) + "</b><small>" + esc(g.tipo || "") + "</small></div></button>";
    }).join("");
    mount.addEventListener("click", function (e) {
      var b = e.target.closest(".piece"); if (!b) return;
      var g = list[+b.dataset.i];
      if (g.modo === "libro") return openBook(g);
      openViewer((g.imagenes || [g.portada]).map(function (src) { return { kind: "image", src: src, title: g.titulo }; }), 0);
    });
    tilt(mount.querySelectorAll(".piece"));
    mount.querySelectorAll(".mock-table").forEach(function (c) {
      var t = c.querySelector(".tent");
      c.addEventListener("mousemove", function (e) { var r = c.getBoundingClientRect(); var x = (e.clientX - r.left) / r.width; t.style.animation = "none"; t.style.transform = "rotateX(-8deg) rotateY(" + ((x - .5) * 300).toFixed(1) + "deg)"; });
      c.addEventListener("mouseleave", function () { t.style.transform = ""; t.style.animation = ""; });
    });
  }

  /* ---------- editorial ---------- */
  function renderBooks(list, mount) {
    if (!mount) return;
    if (!list || !list.length) { mount.innerHTML = '<p class="empty">Publicaciones en preparación.</p>'; return; }
    mount.innerHTML = list.map(function (b, i) {
      return '<button class="book reveal" type="button" data-i="' + i + '" aria-label="Hojear ' + esc(b.titulo) + '">' +
        '<div class="cover" style="--ar:' + esc(b.ar || "3/4") + '"><img src="' + esc(b.portada) + '" alt="' + esc(b.titulo) + '" loading="lazy"></div>' +
        '<div class="bc"><small>' + esc(b.tipo || "") + " · " + (b.paginas || []).length + " págs.</small><b>" + esc(b.titulo) + "</b></div></button>";
    }).join("");
    mount.addEventListener("click", function (e) {
      var el = e.target.closest(".book"); if (!el) return;
      openBook(list[+el.dataset.i]);
    });
  }

  /* ---------- visor ---------- */
  var viewer = $("#viewer"), stage = $("#viewer-stage"), vTitle = $("#viewer-title"), vCount = $("#viewer-count");
  var vPrev = $("#viewer-prev"), vNext = $("#viewer-next");
  var vItems = [], vIndex = 0, vMode = "gallery", book = null, lastFocus = null;

  function openViewer(items, index) {
    vMode = "gallery"; vItems = items; vIndex = index || 0; show(); drawItem();
  }
  function drawItem() {
    var it = vItems[vIndex];
    vTitle.textContent = it.title || "";
    vCount.textContent = vItems.length > 1 ? pad(vIndex + 1) + " / " + pad(vItems.length) : "";
    if (it.kind === "video") stage.innerHTML = '<video src="' + esc(it.src) + '" poster="' + esc(it.poster || "") + '" controls autoplay playsinline></video>';
    else stage.innerHTML = '<img src="' + esc(it.src) + '" alt="' + esc(it.title || "") + '">';
    vPrev.hidden = vNext.hidden = vItems.length < 2;
  }
  function spreads(n, dobles) { // portada sola; páginas dobles solas; las demás de a dos
    var d = {}; (dobles || []).forEach(function (i) { d[i] = 1; });
    var s = [[0]], i = 1;
    while (i < n) {
      if (d[i]) { s.push([i]); i++; }
      else if (i + 1 < n && !d[i + 1] && i + 1 !== n - 1) { s.push([i, i + 1]); i += 2; }
      else { s.push([i]); i++; }
    }
    return s;
  }
  function openBook(b) {
    vMode = "book"; book = { data: b, single: window.innerWidth < 860, i: 0 };
    book.list = book.single ? b.paginas.map(function (_, i) { return [i]; }) : spreads(b.paginas.length, b.dobles);
    show(); drawSpread(0);
  }
  function drawSpread(dir) {
    var sp = book.list[book.i], b = book.data;
    vTitle.textContent = b.titulo;
    vCount.textContent = "Pág. " + sp.map(function (p) { return p + 1; }).join("–") + " / " + b.paginas.length;
    var wide = sp.length === 1 && (b.dobles || []).indexOf(sp[0]) > -1;
    stage.innerHTML = '<div class="flip"><div class="spread' + (sp.length === 1 ? " single" : "") + (wide ? " wide" : "") + (dir > 0 ? " turn-next" : dir < 0 ? " turn-prev" : "") + '">' +
      sp.map(function (p) { return '<img src="' + esc(b.paginas[p]) + '" alt="Página ' + (p + 1) + '">'; }).join("") +
      (sp.length === 2 ? '<span class="spine"></span>' : "") + "</div></div>";
    vPrev.hidden = book.i === 0; vNext.hidden = book.i === book.list.length - 1;
    var nx = book.list[book.i + 1]; if (nx) nx.forEach(function (p) { var im = new Image(); im.src = b.paginas[p]; });
  }
  function step(d) {
    if (vMode === "book") { var n = book.i + d; if (n < 0 || n >= book.list.length) return; book.i = n; drawSpread(d); }
    else { vIndex = (vIndex + d + vItems.length) % vItems.length; drawItem(); }
  }
  function show() { lastFocus = document.activeElement; viewer.hidden = false; document.body.style.overflow = "hidden"; $(".viewer-x").focus(); }
  function close() { viewer.hidden = true; stage.innerHTML = ""; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
  viewer.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) close(); });
  vPrev.addEventListener("click", function () { step(-1); });
  vNext.addEventListener("click", function () { step(1); });
  document.addEventListener("keydown", function (e) {
    if (viewer.hidden) return;
    if (e.key === "Escape") close(); else if (e.key === "ArrowRight") step(1); else if (e.key === "ArrowLeft") step(-1);
  });
  var tx = null;
  stage.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", function (e) { if (tx == null) return; var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); tx = null; });

  /* ---------- inclinación 3D en piezas ---------- */
  function tilt(nodes) {
    if (reduce || !window.matchMedia("(hover:hover)").matches) return;
    nodes.forEach(function (n) {
      var c = n.querySelector(".card");
      if (!c || c.classList.contains("mock-table")) return;
      n.addEventListener("mousemove", function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.transform = "rotateX(" + ((.5 - y) * 8).toFixed(2) + "deg) rotateY(" + ((x - .5) * 10).toFixed(2) + "deg) translateZ(0)";
        c.style.setProperty("--mx", (x * 100).toFixed(1) + "%"); c.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      });
      n.addEventListener("mouseleave", function () { c.style.transform = ""; });
    });
  }

  /* ---------- portada: roles en el prompt ---------- */
  (function typer() {
    var el = $("#typed"); if (!el) return;
    var words = ["Editor de video", "Director de fotografía", "Camarógrafo", "Colorista", "Motion graphics", "Diseñador gráfico", "Diseñador editorial", "Diseñador web", "Depende del proyecto…"];
    if (reduce) { el.textContent = words[words.length - 1]; document.querySelectorAll("#lp li").forEach(function (li) { li.classList.add("on"); }); return; }
    var map = [0, 1, 1, 2, 3, 4, 5, 6, -1];
    var lis = document.querySelectorAll("#lp li");
    function light(i) { lis.forEach(function (li, k) { li.classList.toggle("on", i === -1 || +li.dataset.l === i); }); }
    var w = 0, c = 0, del = false;
    (function tick() {
      var word = words[w];
      if (!del && c === 0) light(map[w]);
      if (!del) { c++; el.textContent = word.slice(0, c); if (c === word.length) { del = true; return setTimeout(tick, w === words.length - 1 ? 2600 : 1300); } }
      else { c--; el.textContent = word.slice(0, c); if (c === 0) { del = false; w = (w + 1) % words.length; } }
      setTimeout(tick, del ? 28 : 55);
    })();
  })();

  /* ---------- portada: paralaje con el cursor ---------- */
  var hero = $(".hero");
  if (hero && !reduce && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty("--px", (((e.clientX - r.left) / r.width) - .5).toFixed(3));
      hero.style.setProperty("--py", (((e.clientY - r.top) / r.height) - .5).toFixed(3));
    });
    hero.addEventListener("mouseleave", function () { hero.style.setProperty("--px", 0); hero.style.setProperty("--py", 0); });
  }
  var decos = document.querySelectorAll(".deco");

  /* ---------- código de tiempo y cabezal según el scroll ---------- */
  var tcEl = $("#timecode"), ph = $("#playhead"), ticking = false;
  var TOTAL = 3 * 60 * 25; // 3 minutos a 25 fps
  function onScroll() {
    ticking = false;
    var max = doc.scrollHeight - doc.clientHeight, p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    var f = Math.round(p * TOTAL), s = Math.floor(f / 25);
    tcEl.textContent = "00:" + pad(Math.floor(s / 60)) + ":" + pad(s % 60) + ":" + pad(f % 25);
    ph.style.width = (p * 100).toFixed(2) + "%";
    if (!reduce) decos.forEach(function (d) { var r = d.parentNode.getBoundingClientRect(); d.style.setProperty("--sy", (-(r.top) * (+d.style.getPropertyValue("--d") || .1)).toFixed(1)); });
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- capas activas ---------- */
  var links = document.querySelectorAll(".layers a");
  if ("IntersectionObserver" in window) {
    var secIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle("on", a.dataset.sec === e.target.id); }); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["audiovisual", "grafico", "editorial", "contacto"].forEach(function (id) { var s = document.getElementById(id); if (s) secIO.observe(s); });
  }

  /* ---------- contacto ---------- */
  var C = D.contacto || {};
  if (C.whatsapp) {
    var wa = $("#wa");
    wa.href = "https://wa.me/" + C.whatsapp + (C.mensajeWhatsapp ? "?text=" + encodeURIComponent(C.mensajeWhatsapp) : "");
    wa.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>Escríbeme por WhatsApp';
    wa.className = "btn primary"; wa.hidden = false;
    wa.parentNode.insertBefore(wa, wa.parentNode.firstChild);
  }
  $("#year").textContent = new Date().getFullYear();

  /* ---------- montar contenido ---------- */
  renderProjects(D.destacados || [], $("#destacados"), 0);
  if (D.videoclips && D.videoclips.length) { $("#videoclips-wrap").hidden = false; renderProjects(D.videoclips, $("#videoclips"), (D.destacados || []).length); }
  renderReels(D.reels, $("#reels"), $("#reels-wrap"));
  if (D.reels && D.reels.length) $("#reels-n").textContent = D.reels.length + " piezas";
  renderPieces(D.grafico, $("#grafico-grid"));
  renderBooks(D.editorial, $("#editorial-grid"));

  /* ---------- aparición al hacer scroll ---------- */
  var rev = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) rev.forEach(function (r) { r.classList.add("in"); });
  else {
    var rIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); rIO.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    rev.forEach(function (r) { rIO.observe(r); });
    setTimeout(function () { rev.forEach(function (r) { if (r.getBoundingClientRect().top < innerHeight) r.classList.add("in"); }); }, 60);
  }
})();
