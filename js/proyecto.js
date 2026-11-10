/* ==========================================================================
   Página de cada proyecto: cada escena tiene su propio set
   - editor      → Austin Marchese: interfaz de edición + canal que crece
   - celulares   → La Cepa: los reels corriendo dentro de celulares
   - television  → Telecafé: un televisor "al aire" + hoja de contactos
   - cine        → Paisajes Íntimos: formato panorámico, sin afán
   - control     → Nos fui pues mijo: sala de control de un magazine
   El contenido sale de js/data.js; aquí solo está la puesta en escena.
   ========================================================================== */
(function () {
  "use strict";
  var D = window.PORTFOLIO || {}, APP = window.APP || {}, U = APP.u;
  var mount = document.getElementById("set");
  if (!mount || !U) return;
  var $ = U.$, $$ = U.$$, esc = U.esc, pad = U.pad;
  var list = D.destacados || [];
  var id = document.body.dataset.id, idx = -1;
  list.forEach(function (p, i) { if (p.id === id) idx = i; });
  var p = list[idx];
  if (!p) { mount.innerHTML = '<p class="wrap empty">Esta escena no existe.</p>'; return; }
  var reduce = APP.reduce, fine = APP.finePointer;
  var vids = p.videos || [];
  var n = pad(idx + 1);

  /* ---------- piezas comunes ---------- */
  function head() {
    return '<header class="set-head wrap">' +
      '<a class="set-back" href="audiovisual.html">← Todas las escenas</a>' +
      '<p class="ph-kicker"><b class="rec"></b>Escena ' + n + " · " + esc(p.formato || p.cliente || "") + "</p>" +
      '<h1 class="set-title">' + esc(p.titulo) + "</h1>" +
      '<p class="set-soy">Aquí soy <em>' + esc(p.soy || "") + "</em>.</p></header>";
  }
  function ficha() {
    return '<dl class="ficha">' + [["Cliente", p.cliente], ["Formato", p.formato], ["Mi rol", (p.roles || []).join(" · ")], ["Año", p.anio]]
      .filter(function (r) { return r[1]; })
      .map(function (r) { return "<div><dt>" + r[0] + "</dt><dd>" + esc(r[1]) + "</dd></div>"; }).join("") + "</dl>";
  }
  function info() {
    var hice = (p.hice || []).length ? '<div class="hice"><p class="label">Lo que hice</p><ul>' + p.hice.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul></div>" : "";
    var res = p.cifra ? '<div class="set-res"><span class="v">' + esc(p.cifra) + '</span><span class="t">' + esc(p.cifraTexto || "") + "</span></div>" : "";
    var also = p.verTambien ? '<a class="see-also" href="' + esc(p.verTambien.href) + '">' + esc(p.verTambien.texto) + " →</a>" : "";
    return '<section class="set-info wrap reveal"><div class="si-card glass"><p class="label">Ficha técnica</p>' + ficha() + "</div>" +
      '<div class="si-card glass">' + hice + res + also + "</div></section>";
  }
  function caso() {
    var c = p.caso || {};
    var steps = [["Problema", c.problema], ["Proceso", c.proceso], ["Solución", c.solucion], ["Resultado", c.resultado]].filter(function (s) { return s[1]; });
    if (!steps.length) return "";
    return '<section class="set-case wrap tone tone-mist pad" aria-labelledby="h-caso"><header class="bhead reveal"><span class="kf"></span><h2 id="h-caso">El caso</h2><p class="label">Problema → proceso → solución → resultado</p><span class="tcode">' + n + "</span></header>" +
      '<div class="ruler" aria-hidden="true"></div><ol class="markers">' + steps.map(function (s, i) {
        return '<li class="marker reveal" style="--i:' + i + '"><span class="mk-tc">' + "00:0" + i + ":00:00" + '</span><b>' + s[0] + "</b><p>" + esc(s[1]) + "</p></li>";
      }).join("") + "</ol></section>";
  }
  function compare() { var h = U.compareHTML(p.comparar); return h ? '<section class="wrap set-compare">' + h + "</section>" : ""; }
  function nav() {
    var prev = list[(idx - 1 + list.length) % list.length], next = list[(idx + 1) % list.length];
    return '<nav class="set-nav wrap" aria-label="Otras escenas">' +
      '<a class="sn prev" href="' + esc(prev.pagina) + '"><small>← Escena anterior</small><b>' + esc(prev.titulo) + "</b></a>" +
      '<a class="sn all" href="audiovisual.html"><small>Ver</small><b>Todas</b></a>' +
      '<a class="sn next" href="' + esc(next.pagina) + '"><small>Siguiente escena →</small><b>' + esc(next.titulo) + "</b></a></nav>";
  }
  function count(el, to, ms) {
    if (!el) return;
    var fmt = new Intl.NumberFormat("es-CO");
    if (reduce) { el.textContent = fmt.format(to); return; }
    var go = function () {
      var t0 = performance.now();
      (function f(now) { var k = Math.min(1, (now - t0) / ms); k = 1 - Math.pow(1 - k, 3); el.textContent = fmt.format(Math.round(to * k)); if (k < 1) requestAnimationFrame(f); })(t0);
    };
    if ("IntersectionObserver" in window) { var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); go(); } }, { threshold: .6 }); io.observe(el); } else go();
  }
  var ICON = {
    heart: '<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.6.7-1.4 2.2-2.6 4.3-2.6 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H8l-4 4z"/></svg>',
    send: '<svg viewBox="0 0 24 24"><path d="M3 11 21 3l-8 18-2-8z"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'
  };

  /* ======================================================================
     SETS
     ====================================================================== */
  var SETS = {};

  /* --- Austin: interfaz de edición + canal que crece --- */
  SETS.editor = function () {
    return '<section class="stage wrap reveal"><div class="editor glass">' +
      '<div class="ed-bar"><span class="dots"><i></i><i></i><i></i></span><span class="ed-file">' + esc(p.titulo.toLowerCase().replace(/\s+/g, "-")) + '_final.prproj</span><span class="ed-tc">' + vids.length + " clips</span></div>" +
      '<div class="ed-main"><div class="ed-monitor"><p class="ed-label">Programa</p><div class="screen">' + U.screenHTML(vids[0]) + "</div></div>" +
      '<aside class="ed-channel"><p class="ed-label">Canal</p><div class="yt-card"><span class="yt-av">' + esc(p.titulo.charAt(0)) + "</span><b>" + esc(p.titulo) + "</b><small>" + esc(p.cliente || "") + "</small>" +
      '<p class="yt-count"><span id="yt-n">0</span><small>' + esc(p.cifraTexto || "") + "</small></p>" +
      '<p class="yt-note">Edité ' + vids.length + " videos del canal, de los que ves aquí.</p></div></aside></div>" +
      '<div class="ed-tl-mount"></div></div></section>';
  };
  SETS.editor.wire = function () {
    var scr = $(".ed-monitor .screen");
    var tl = U.Timeline(scr, vids, { mount: $(".ed-tl-mount"), v2: "MG", cls: "in-editor" });
    U.attachPreview(scr, function () { return vids[tl.cur()]; });
    scr.addEventListener("click", function (e) { if (e.target.closest(".playbtn")) U.playIn(scr, vids[tl.cur()]); });
    var num = parseInt(String(p.cifra).replace(/\D/g, ""), 10);
    if (num) count($("#yt-n"), num, 2200); else $("#yt-n").textContent = p.cifra || "";
    APP.k = function () { var b = $(".playbtn", scr); if (b) { b.click(); return true; } return false; };
  };

  /* --- La Cepa: reels dentro de celulares --- */
  SETS.celulares = function () {
    var phones = vids.slice(0, 4).map(function (v, i) {
      return '<button class="phone reveal" type="button" data-v="' + i + '" style="--i:' + i + '" aria-label="Ver ' + esc(v.titulo) + ' con sonido">' +
        '<span class="ph-screen"><img src="' + esc(v.poster || "") + '" alt="" loading="lazy">' +
        '<video muted loop playsinline preload="none" src="' + esc(v.src) + '"></video>' +
        '<span class="ig-top"><b>Reels</b></span>' +
        '<span class="ig-side">' + ICON.heart + ICON.chat + ICON.send + "</span>" +
        '<span class="ig-cap"><span class="ig-user"><i></i>lacepapinares</span>' + esc(v.titulo) + "</span>" +
        '<span class="ph-sound">Toca para verlo con sonido</span></span><span class="notch"></span></button>';
    }).join("");
    var carta = (D.grafico || []).filter(function (g) { return g.id === "carta-la-cepa"; })[0];
    var habl = (D.grafico || []).filter(function (g) { return g.id === "hablador"; })[0];
    var mesa = carta || habl ? '<section class="wrap enmesa reveal"><header class="bhead"><span class="kf"></span><h2>Y en la mesa</h2><p class="label">El mismo hotel, en impreso</p><span class="tcode">' + n + "</span></header>" +
      '<div class="ruler" aria-hidden="true"></div><div class="em-row">' +
      (carta ? '<a class="em-item" href="grafico.html#carta-la-cepa"><span class="em-pic menu"><img src="' + esc(carta.paginas[0]) + '" alt=""><img src="' + esc(carta.paginas[2] || carta.paginas[1]) + '" alt=""></span><b>Carta del restaurante</b><small>Hojéala →</small></a>' : "") +
      (habl ? '<a class="em-item" href="grafico.html#hablador"><span class="em-pic tent"><img src="' + esc(habl.imagenes[0]) + '" alt=""></span><b>Hablador de mesa</b><small>Gíralo →</small></a>' : "") +
      "</div></section>" : "";
    return '<section class="stage wrap"><div class="phones-row">' + phones + "</div>" +
      '<p class="stage-note">Así se ven en el celular de quien va a reservar. Toca uno para verlo con sonido.</p></section>' + mesa;
  };
  SETS.celulares.wire = function () {
    $$(".phone").forEach(function (ph) {
      var v = $("video", ph);
      var on = function () { if (reduce) return; v.play().then(function () { ph.classList.add("playing"); }).catch(function () {}); };
      var off = function () { v.pause(); ph.classList.remove("playing"); };
      if ("IntersectionObserver" in window && !U.saveData) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) on(); else off(); }); }, { threshold: .55 }).observe(ph);
      ph.addEventListener("click", function () {
        U.openViewer(vids.map(function (x) { return { kind: "video", src: x.src, poster: x.poster, title: x.titulo }; }), +ph.dataset.v);
      });
    });
  };

  /* --- Telecafé: un televisor al aire + hoja de contactos --- */
  SETS.television = function () {
    var v = vids[0] || {};
    var fr = p.fotogramas || [], fotos = p.fotos || [];
    var sheet = function (arr, title, note, cls) {
      if (!arr.length) return "";
      return '<section class="wrap contact-sheet reveal ' + (cls || "") + '"><header class="bhead"><span class="kf"></span><h2>' + title + '</h2><p class="label">' + note + '</p><span class="tcode">' + n + "</span></header>" +
        '<div class="ruler" aria-hidden="true"></div><div class="cs-strip">' + arr.map(function (src, i) {
          return '<button class="cs-frame" type="button" data-i="' + i + '"><img src="' + esc(src) + '" alt="Fotograma ' + (i + 1) + '" loading="lazy"><span>' + pad(i + 1) + "A</span></button>";
        }).join("") + "</div></section>";
    };
    return '<section class="stage wrap"><div class="room"><div class="tv reveal">' +
      '<div class="tv-screen"><div class="screen">' + U.screenHTML(v) + '</div><span class="tv-bug"><b class="rec"></b>Al aire · ' + esc((p.cliente || "").split(" · ")[0]) + '</span><span class="tv-scan" aria-hidden="true"></span></div>' +
      '<span class="tv-brand" aria-hidden="true">' + esc(p.titulo) + '</span></div><div class="tv-stand" aria-hidden="true"></div><div class="tv-tl"></div>' +
      '<p class="stage-note">Una serie documental para televisión abierta: tenía que pasar el control técnico del canal. Pasó.</p></div></section>' +
      sheet(fotos, "Foto fija", "Desde el set", "fotos") +
      sheet(fr, "Hoja de contactos", "Fotogramas del tráiler", "frames");
  };
  SETS.television.wire = function () {
    var scr = $(".tv .screen");
    U.Timeline(scr, vids, { mount: $(".tv-tl"), cls: "on-tv" });
    U.attachPreview(scr, function () { return vids[0]; });
    scr.addEventListener("click", function (e) { if (e.target.closest(".playbtn")) { U.playIn(scr, vids[0]); $(".tv").classList.add("on"); } });
    $$(".contact-sheet").forEach(function (s) {
      var arr = s.classList.contains("fotos") ? p.fotos : p.fotogramas;
      s.addEventListener("click", function (e) {
        var b = e.target.closest(".cs-frame"); if (!b) return;
        U.openViewer(arr.map(function (src, i) { return { kind: "image", src: src, title: p.titulo + " · " + pad(i + 1) + "A" }; }), +b.dataset.i);
      });
    });
    APP.k = function () { var b = $(".playbtn", scr); if (b) { b.click(); return true; } return false; };
  };

  /* --- Paisajes Íntimos: cine panorámico, sin afán --- */
  SETS.cine = function () {
    return '<section class="stage cinema reveal"><div class="cine-frame"><div class="screen">' + U.screenHTML(vids[0]) + '</div><span class="bar top"></span><span class="bar bot"></span></div>' +
      '<div class="wrap cine-under"><div class="cine-tl"></div><p class="cine-quote">' + esc((p.caso || {}).solucion || "") + "</p></div></section>";
  };
  SETS.cine.wire = function () {
    var scr = $(".cine-frame .screen"), frame = $(".cine-frame");
    var tl = U.Timeline(scr, vids, { mount: $(".cine-tl"), cls: "cine", onSelect: function () { frame.classList.remove("fade"); void frame.offsetWidth; frame.classList.add("fade"); } });
    U.attachPreview(scr, function () { return vids[tl.cur()]; });
    scr.addEventListener("click", function (e) { if (e.target.closest(".playbtn")) { U.playIn(scr, vids[tl.cur()]); frame.classList.add("rolling"); } });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) frame.classList.add("in"); }); }, { threshold: .4 }).observe(frame);
    else frame.classList.add("in");
    APP.k = function () { var b = $(".playbtn", scr); if (b) { b.click(); return true; } return false; };
  };

  /* --- Nos fui pues mijo: sala de control --- */
  SETS.control = function () {
    var v = vids[0] || {};
    var cams = (p.camaras || []).map(function (c, i) {
      return '<button class="cam" type="button" data-i="' + i + '" data-t="' + (c.t || 0) + '" aria-label="Cortar a la cámara ' + (i + 1) + ": " + esc(c.rol) + '"><span class="cam-scr"><span class="bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>' +
        '<span class="cam-feed" data-t="' + (c.t || 0) + '"></span><b>' + esc(c.rol) + '</b></span><span class="cam-lbl"><i class="tally"></i>CAM ' + (i + 1) + "<em>" + U.tcode(c.t || 0).slice(0, 8) + "</em></span></button>";
    }).join("");
    var blocks = (p.bloques || []).map(function (b) {
      var t = Math.floor(b.t || 0);
      return '<button class="blk" type="button" data-t="' + t + '"><span>' + U.tcode(t).slice(0, 8) + "</span>" + esc(b.titulo) + "</button>";
    }).join("");
    return '<section class="stage wrap reveal"><div class="control glass">' +
      '<div class="ctl-top"><span class="ctl-name">Sala de control · ' + esc(p.titulo) + '</span><span class="ctl-air" id="ctl-air"><b></b>Al aire</span><span class="ctl-clock" id="ctl-clock">00:00:00</span></div>' +
      '<div class="ctl-grid"><div class="pgm"><p class="ctl-lbl"><i class="tally on"></i>Programa</p><div class="screen pgm-scr">' + U.screenHTML(v) + '</div><div class="pgm-tl"></div></div>' +
      '<div class="cams"><p class="ctl-lbl">Cámaras · toca una para cortar</p>' + cams + "</div></div>" +
      '<div class="ctl-bottom"><div class="vu" aria-hidden="true">' + new Array(12).join("<i></i>") + '</div>' +
      '<div class="rundown"><p class="ctl-lbl">Escaleta</p><div class="blks">' + blocks + '</div></div>' +
      '<p class="cam-say" id="cam-say" aria-live="polite">' + esc((p.hice || []).join(" ")) + "</p></div>" +
      "</div></section>";
  };
  SETS.control.wire = function () {
    var v = vids[0] || {}, scr = $(".pgm-scr"), air = $("#ctl-air"), say = $("#cam-say"), ctl = $(".control");
    var tl = U.Timeline(scr, vids, { mount: $(".pgm-tl"), cls: "on-control" });
    U.attachPreview(scr, function () { return v; });
    function live() { if (v.embed === false) return; air.classList.add("on"); ctl.classList.add("live"); }
    scr.addEventListener("click", function (e) { if (e.target.closest(".playbtn")) { U.playIn(scr, v); live(); } });
    ctl.addEventListener("click", function (e) {
      var b = e.target.closest(".blk") || e.target.closest(".cam");
      if (!b) return;
      if (b.classList.contains("cam")) {
        $$(".cam").forEach(function (x) { x.classList.toggle("on", x === b); });
        ctl.classList.remove("cut"); void b.offsetWidth; ctl.classList.add("cut");
        var c = (p.camaras || [])[+b.dataset.i] || {};
        say.textContent = "CAM " + (+b.dataset.i + 1) + " al aire · " + (c.rol || "");
      }
      tl.seekAbs(+b.dataset.t); live();
    });
    // las cámaras muestran el magazine de verdad (en silencio), solo en pantallas grandes
    var feeds = $$(".cam-feed");
    if (v.embed === false) {
      // sin embebido: cada cámara muestra un fotograma real del magazine
      feeds.forEach(function (f, i) {
        f.innerHTML = '<img src="https://i.ytimg.com/vi/' + esc(v.id) + "/hq" + ((i % 3) + 1) + '.jpg" alt="" loading="lazy">';
        f.closest(".cam").classList.add("feed");
      });
    } else if (feeds.length && fine && !U.saveData && !reduce && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return; io.disconnect();
        feeds.forEach(function (f, i) {
          setTimeout(function () {
            f.innerHTML = '<iframe tabindex="-1" title="Cámara ' + (i + 1) + '" allow="autoplay; encrypted-media" src="https://www.youtube-nocookie.com/embed/' + esc(v.id) +
              "?autoplay=1&mute=1&controls=0&disablekb=1&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&start=" + f.dataset.t + '"></iframe>';
            f.closest(".cam").classList.add("feed");
          }, i * 700);
        });
      }, { threshold: .3 });
      io.observe(ctl);
    }
    var clock = $("#ctl-clock");
    setInterval(function () { var d = new Date(); clock.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()); }, 1000);
    APP.k = function () { var b = $(".playbtn", scr); if (b) { b.click(); return true; } return false; };
  };

  /* ---------- montaje ---------- */
  var set = SETS[p.set] || SETS.cine;
  document.body.classList.add("set-" + (p.set || "cine"));
  mount.innerHTML = head() + set() + info() + caso() + compare() + nav();
  if (set.wire) set.wire();
  // en la página de un proyecto, J y L pasan de escena
  APP.jl = function (d) { var t = list[(idx + d + list.length) % list.length]; location.href = t.pagina; };
  U.wireCompare(mount);
  // las apariciones de esta página nacieron después de que main.js revisara la página
  var rev = $$(".reveal", mount);
  if (reduce || !("IntersectionObserver" in window)) rev.forEach(function (r) { r.classList.add("in"); });
  else { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" }); rev.forEach(function (r) { io.observe(r); }); }
})();
