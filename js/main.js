/* ==========================================================================
   Alex Pino · Portafolio — contenido e interacción
   Lee js/data.js (window.PORTFOLIO) y arma cada sección.
   Índice: utilidades · casos · reels · gráfico · editorial · sobre mí ·
           visor y libro · portada · scroll · contacto · montaje
   ========================================================================== */
(function () {
  "use strict";

  var D = window.PORTFOLIO || {};
  var root = document.documentElement;
  root.classList.add("js");

  /* ---------- utilidades ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) {
    return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
  var pad = function (n) { return String(n).padStart(2, "0"); };
  var ytThumb = function (id) { return "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg"; };
  var ytEmbed = function (id, start) {
    var o = location.protocol.indexOf("http") === 0 ? "&enablejsapi=1&origin=" + encodeURIComponent(location.origin) : "";
    return "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&modestbranding=1&playsinline=1" + o + (start ? "&start=" + Math.floor(start) : "");
  };
  var posterOf = function (v) { return v.tipo === "youtube" ? ytThumb(v.id) : (v.poster || ""); };
  var isVideo = function (src) { return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(src || ""); };
  var saveData = !!(navigator.connection && navigator.connection.saveData);

  // oficios: claves del filtro y cómo se leen desde los "roles" de cada caso
  var OFICIOS = [["edicion", "Edición"], ["camara", "Cámara"], ["color", "Color"], ["motion", "Motion"], ["grafico", "Diseño gráfico"], ["editorial", "Editorial"], ["web", "Web"]];
  var ROLE_OF = {
    "edición": "edicion", "edicion": "edicion", "videoclip": "edicion",
    "cámara": "camara", "camara": "camara", "foto fija": "camara", "fotografía": "camara", "making of": "camara", "dirección de fotografía": "camara",
    "color": "color", "colorización": "color", "etalonaje": "color",
    "motion graphics": "motion", "motion": "motion", "animación": "motion",
    "diseño gráfico": "grafico", "diseño editorial": "editorial", "editorial": "editorial", "diseño web": "web", "web": "web"
  };
  function oficiosOf(item, base) {
    if (item.oficios && item.oficios.length) return item.oficios.join(" ");
    var s = {};
    (item.roles || []).forEach(function (r) { var k = ROLE_OF[String(r).toLowerCase()]; if (k) s[k] = 1; });
    if (base) s[base] = 1;
    return Object.keys(s).join(" ");
  }

  /* ---------- casos (destacados y videoclips) ---------- */
  function caseHTML(c) {
    if (!c) return "";
    var steps = [["Problema", c.problema], ["Proceso", c.proceso], ["Solución", c.solucion], ["Resultado", c.resultado]]
      .filter(function (s) { return s[1]; })
      .map(function (s) { return "<li><b>" + s[0] + "</b>" + esc(s[1]) + "</li>"; }).join("");
    return '<details class="case"><summary>Ver el caso completo</summary><ol>' + steps + "</ol></details>";
  }

  function screenHTML(v) {
    if (!v) return "";
    var img = posterOf(v);
    var media = v.vertical
      ? '<img class="bgblur" src="' + esc(img) + '" alt=""><img class="fg" src="' + esc(img) + '" alt="" loading="lazy">'
      : '<img src="' + esc(img) + '" alt="" loading="lazy">';
    return media + '<span class="scr-tc"><b class="rec"></b>' + esc(v.titulo) + "</span>" +
      '<span class="pv-tag" aria-hidden="true">Vista previa<em></em></span><span class="pv-bar" aria-hidden="true"><i></i><b></b></span>' +
      '<button class="playbtn" type="button" aria-label="Reproducir ' + esc(v.titulo) + ' con sonido"><span class="pb"></span></button>';
  }

  function setScreen(scr, v) {
    if (scr._pv) scr._pv.stop();
    scr.classList.toggle("vertical", !!v.vertical);
    scr.innerHTML = screenHTML(v);
  }

  /* ---------- vista previa: el video corre al pasar el cursor ----------
     Escritorio: al entrar corre en silencio y el cursor hace de cabezal
     (izquierda = inicio, derecha = final), como revisar material en el editor.
     Celular: corre en silencio mientras está en pantalla.
     YouTube: no deja reproducir sin abrirlo, así que se recorren sus fotogramas. */
  function attachPreview(scr, getV) {
    if (reduce) return;
    var raf = 0, timer = 0, frames = null, fi = 0, active = false, lastMove = 0;
    var tc = function (s) { s = Math.max(0, Math.floor(s || 0)); return pad(Math.floor(s / 60)) + ":" + pad(s % 60); };
    function bar(p) { var b = $(".pv-bar", scr); if (b) b.style.setProperty("--p", (Math.max(0, Math.min(1, p)) * 100).toFixed(2) + "%"); }
    function label(t) { var e = $(".pv-tag em", scr); if (e) e.textContent = t; }
    function vid() { return $("video.pv", scr); }
    function loop() {
      var el = vid();
      if (el && el.duration) { bar(el.currentTime / el.duration); label(tc(el.currentTime) + " / " + tc(el.duration)); }
      raf = requestAnimationFrame(loop);
    }
    function showFrame(i) {
      if (!frames || !frames.length) return;
      fi = (i + frames.length) % frames.length;
      var img = $("img.pv-frame", scr);
      if (!img) { img = document.createElement("img"); img.className = "pv-frame"; img.alt = ""; scr.insertBefore(img, $(".scr-tc", scr)); }
      img.src = frames[fi];
      bar((fi + 1) / frames.length); label("Fotograma " + (fi + 1) + " / " + frames.length);
    }
    function start() {
      if (active || $("iframe, video[controls]", scr)) return;
      var v = getV(); if (!v) return;
      active = true; scr.classList.add("pv-on");
      if (v.tipo === "youtube") {
        frames = ["hq1", "hq2", "hq3"].map(function (n) { return "https://i.ytimg.com/vi/" + v.id + "/" + n + ".jpg"; });
        frames.forEach(function (src) { var i = new Image(); i.onerror = function () { frames = frames.filter(function (f) { return f !== src; }); }; i.src = src; });
        showFrame(0);
        timer = setInterval(function () { if (Date.now() - lastMove > 900) showFrame(fi + 1); }, 750);
      } else {
        var el = vid();
        if (!el) {
          el = document.createElement("video");
          el.className = "pv"; el.muted = true; el.loop = true; el.playsInline = true;
          el.setAttribute("playsinline", ""); el.setAttribute("muted", ""); el.preload = "auto"; el.src = v.src;
          scr.insertBefore(el, $(".scr-tc", scr));
        }
        el.play().catch(function () {});
        cancelAnimationFrame(raf); loop();
      }
    }
    function stop() {
      if (!active) return;
      active = false; scr.classList.remove("pv-on");
      clearInterval(timer); cancelAnimationFrame(raf);
      var el = vid(); if (el) el.pause();
      var f = $("img.pv-frame", scr); if (f) f.remove();
    }
    function scrub(x) {
      if (!active) return;
      lastMove = Date.now();
      var el = vid();
      if (el && el.duration && !el.seeking) el.currentTime = x * el.duration;
      else if (frames) showFrame(Math.min(frames.length - 1, Math.floor(x * frames.length)));
    }
    scr._pv = { start: start, stop: stop, scrub: scrub };

    if (finePointer) {
      scr.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") start(); });
      scr.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        var r = scr.getBoundingClientRect(); scrub((e.clientX - r.left) / r.width);
      });
      scr.addEventListener("pointerleave", stop);
    } else if (!saveData && "IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) start(); else stop(); }); }, { threshold: .6 }).observe(scr);
    }
  }

  /* ---------- comparar: antes y después de color, o bruto contra corte final ---------- */
  function mediaHTML(src, poster, cls) {
    return isVideo(src)
      ? '<video class="' + cls + '" src="' + esc(src) + '"' + (poster ? ' poster="' + esc(poster) + '"' : "") + ' muted loop playsinline preload="metadata"></video>'
      : '<img class="' + cls + '" src="' + esc(src) + '" alt="" loading="lazy">';
  }
  function compareHTML(list) {
    list = Array.isArray(list) ? list : list ? [list] : [];
    return list.filter(function (c) { return c && c.antes && c.despues; }).map(function (c) {
      var ar = ' style="--ar:' + esc(c.ar || "16/9") + '"';
      if (c.tipo === "corte") {
        return '<div class="cmp cmp-cut" data-cmp="cut"><div class="cmp-head"><b>' + esc(c.titulo || "Del material en bruto a mi corte") + "</b>" +
          '<div class="seg" role="group" aria-label="Versión"><button type="button" aria-pressed="true" data-k="antes">' + esc(c.textoAntes || "En bruto") + "</button>" +
          '<button type="button" aria-pressed="false" data-k="despues">' + esc(c.textoDespues || "Mi corte") + "</button></div></div>" +
          '<div class="cmp-stage"' + ar + ' data-antes="' + esc(c.antes) + '" data-despues="' + esc(c.despues) + '">' +
          '<video src="' + esc(c.antes) + '"' + (c.poster ? ' poster="' + esc(c.poster) + '"' : "") + ' controls playsinline preload="metadata"></video></div></div>';
      }
      return '<div class="cmp cmp-color" data-cmp="color"><div class="cmp-head"><b>' + esc(c.titulo || "Antes y después de color") + "</b><small>Arrastra</small></div>" +
        '<div class="cmp-stage"' + ar + ">" + mediaHTML(c.despues, c.poster, "after") +
        '<div class="before">' + mediaHTML(c.antes, c.poster, "") + "</div>" +
        '<span class="tag l">' + esc(c.textoAntes || "Antes") + '</span><span class="tag r">' + esc(c.textoDespues || "Después") + "</span>" +
        '<span class="handle" aria-hidden="true"></span>' +
        '<input type="range" min="0" max="100" value="50" aria-label="Deslizar entre antes y después"></div></div>';
    }).join("");
  }
  function wireCompare(root) {
    $$('[data-cmp="color"]', root).forEach(function (box) {
      var stage = $(".cmp-stage", box), range = $("input", box);
      var set = function (v) { stage.style.setProperty("--x", v + "%"); };
      range.addEventListener("input", function () { set(range.value); });
      set(50);
      var vids = $$("video", stage);
      if (vids.length === 2) {
        var a = vids[0], b = vids[1];
        a.addEventListener("timeupdate", function () { if (Math.abs(a.currentTime - b.currentTime) > .12) b.currentTime = a.currentTime; });
        if ("IntersectionObserver" in window && !reduce) new IntersectionObserver(function (es) {
          es.forEach(function (e) { vids.forEach(function (v) { if (e.isIntersecting) v.play().catch(function () {}); else v.pause(); }); });
        }, { threshold: .4 }).observe(stage);
      }
    });
    $$('[data-cmp="cut"]', root).forEach(function (box) {
      var stage = $(".cmp-stage", box), v = $("video", stage);
      box.addEventListener("click", function (e) {
        var b = e.target.closest(".seg button"); if (!b || b.getAttribute("aria-pressed") === "true") return;
        $$(".seg button", box).forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        var playing = !v.paused;
        v.src = stage.dataset[b.dataset.k]; v.load();
        if (playing) v.play().catch(function () {});
        stage.classList.remove("swap"); void stage.offsetWidth; stage.classList.add("swap");
      });
    });
  }

  function playIn(scr, v, at) {
    if (scr._pv) scr._pv.stop();
    if (v.tipo === "youtube" && v.embed === false) {
      // YouTube no deja verlo fuera de su página: se avisa y se manda allá en el minuto exacto
      var t0 = Math.floor(at != null ? at : (v.inicio || 0));
      var m = Math.floor(t0 / 60), sg = t0 % 60;
      scr.innerHTML = '<img src="' + esc(posterOf(v)) + '" alt="">' +
        '<div class="yt-block"><p><b>Este video solo se puede ver en YouTube.</b> Tiene una canción con derechos de autor y YouTube no deja reproducirlo en otras páginas.</p>' +
        '<a class="btn primary sm" href="https://www.youtube.com/watch?v=' + esc(v.id) + "&t=" + t0 + 's" target="_blank" rel="noopener">Verlo en YouTube desde el ' + m + ":" + pad(sg) + " ↗</a></div>";
      return;
    }
    if (v.tipo === "youtube") {
      var start = at != null ? at : v.inicio;
      scr.innerHTML = '<iframe src="' + ytEmbed(v.id, start) + '" title="' + esc(v.titulo) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    } else {
      scr.innerHTML = (v.vertical ? '<img class="bgblur" src="' + esc(v.poster || "") + '" alt="">' : "") +
        '<video src="' + esc(v.src) + '" poster="' + esc(v.poster || "") + '" controls autoplay playsinline></video>';
      if (at) { var ve = $("video", scr); ve.addEventListener("loadedmetadata", function () { ve.currentTime = at; }, { once: true }); }
    }
    if (scr._onplay) scr._onplay(v);
  }

  /* ---------- API de YouTube (para mover el video desde la línea de tiempo) ---------- */
  var ytQueue = [], ytLoading = false;
  function withYT(fn) {
    if (window.YT && window.YT.Player) return fn(window.YT);
    ytQueue.push(fn);
    if (ytLoading) return; ytLoading = true;
    var prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () { if (prev) prev(); ytQueue.splice(0).forEach(function (f) { f(window.YT); }); };
    var sc = document.createElement("script"); sc.src = "https://www.youtube.com/iframe_api"; sc.async = true; document.head.appendChild(sc);
  }

  /* ---------- línea de tiempo funcional ----------
     Va debajo de cada video horizontal. Cada video es un clip. El cabezal se
     arrastra: antes de darle play recorre la vista previa; con el video
     andando, lo adelanta o lo devuelve de verdad (también en YouTube). */
  var FPS = 25;
  function tcode(sec) {
    sec = Math.max(0, sec || 0);
    var f = Math.floor((sec % 1) * FPS), s = Math.floor(sec);
    return pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60) + ":" + pad(f);
  }
  function Timeline(scr, vids, opts) {
    opts = opts || {};
    var box = document.createElement("div");
    box.className = "tlx" + (opts.cls ? " " + opts.cls : "");
    var dur = vids.map(function (v) { return v.dur || 0; });
    var v2 = opts.v2 ? '<div class="tlx-trk"><span class="tn">V2</span><div class="tlx-lane mg">' + vids.map(function () { return "<b>" + esc(opts.v2) + "</b>"; }).join("") + "</div></div>" : "";
    box.innerHTML = '<div class="tlx-top"><span class="tlx-name"></span><span class="tlx-hint">' + (finePointer ? "Arrastra el cabezal o toca un clip" : "Desliza el cabezal o toca un clip") + '</span><span class="tlx-tc">00:00:00:00</span></div>' +
      '<div class="tlx-body"><div class="tlx-ruler"></div>' + v2 +
      '<div class="tlx-trk"><span class="tn">V1</span><div class="tlx-lane clips">' + vids.map(function (v, i) {
        return '<button type="button" class="tlx-clip" data-v="' + i + '" aria-label="Clip ' + (i + 1) + ": " + esc(v.titulo) + '"><img src="' + esc(posterOf(v)) + '" alt="" loading="lazy"><span>' + esc(v.titulo) + "</span></button>";
      }).join("") + "</div></div>" +
      '<div class="tlx-trk"><span class="tn">A1</span><div class="tlx-lane wave"></div></div>' +
      '<div class="tlx-head" role="slider" tabindex="0" aria-label="Cabezal de reproducción" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div></div>';
    (opts.mount || scr.parentNode).insertBefore(box, opts.before || (opts.mount ? null : scr.nextSibling));
    var lane = $(".tlx-lane.clips", box), head = $(".tlx-head", box), tcEl = $(".tlx-tc", box), nameEl = $(".tlx-name", box);
    var clips = $$(".tlx-clip", box);
    var cur = 0, frac = 0, yt = null, raf = 0, idleT = 0;

    // duración real de los videos locales, para que cada clip mida lo que dura
    vids.forEach(function (v, i) {
      if (v.tipo !== "local" || dur[i]) return;
      var m = document.createElement("video"); m.preload = "metadata"; m.muted = true; m.src = v.src;
      m.addEventListener("loadedmetadata", function () { dur[i] = m.duration; layout(); m.removeAttribute("src"); m.load(); });
    });
    function layout() {
      var known = dur.filter(Boolean), avg = known.length ? known.reduce(function (a, b) { return a + b; }, 0) / known.length : 1;
      clips.forEach(function (c, i) { c.style.flexGrow = Math.max(.6, (dur[i] || avg) / avg).toFixed(3); });
      $$(".tlx-lane.mg b", box).forEach(function (b, i) { b.style.flexGrow = clips[i].style.flexGrow; });
      place();
    }
    function startOf(i) { return (vids[i].inicio || 0); }
    function lengthOf(i) { var d = dur[i]; return d ? Math.max(1, d - startOf(i)) : 0; }
    function place() {
      var c = clips[cur]; if (!c) return;
      var lr = lane.getBoundingClientRect(), br = $(".tlx-body", box).getBoundingClientRect(), cr = c.getBoundingClientRect();
      var x = cr.left - br.left + cr.width * frac;
      head.style.transform = "translateX(" + x.toFixed(1) + "px)";
      var g = (cr.left - lr.left + cr.width * frac) / lr.width;
      head.setAttribute("aria-valuenow", Math.round(g * 100));
      var L = lengthOf(cur);
      tcEl.textContent = L ? tcode(frac * L) + (opts.abs && startOf(cur) ? "" : "") : "--:--:--:--";
      nameEl.textContent = pad(cur + 1) + " · " + (vids[cur].titulo || "");
    }
    function playing() { return $("video[controls]", scr) || $("iframe", scr); }
    function select(i) {
      cur = i; frac = 0;
      clips.forEach(function (c, k) { c.classList.toggle("on", k === i); });
      stopYT(); setScreen(scr, vids[i]); place();
      if (opts.onSelect) opts.onSelect(i);
    }
    function seekFrac(f) {
      frac = Math.max(0, Math.min(1, f)); place();
      var L = lengthOf(cur), t = startOf(cur) + frac * (L || 0);
      var ve = $("video[controls]", scr);
      if (ve) { if (ve.duration) ve.currentTime = frac * ve.duration; return; }
      if (yt && yt.seekTo && L) { yt.seekTo(t, true); return; }
      if ($("iframe", scr)) return;
      // todavía no está andando: se recorre la vista previa
      if (scr._pv) { scr._pv.start(); scr._pv.scrub(frac); clearTimeout(idleT); idleT = setTimeout(function () { if (!scr.matches(":hover")) scr._pv.stop(); }, 1400); }
    }
    function fromX(clientX) {
      var lr = lane.getBoundingClientRect(), x = Math.max(lr.left, Math.min(lr.right - 1, clientX));
      for (var i = 0; i < clips.length; i++) {
        var r = clips[i].getBoundingClientRect();
        if (x >= r.left && x <= r.right + 4) return { i: i, f: (x - r.left) / r.width };
      }
      return { i: clips.length - 1, f: 1 };
    }
    // arrastrar el cabezal (o tocar cualquier punto de la línea)
    var dragging = false;
    function onDown(e) {
      if (e.button > 0) return;
      dragging = true; box.classList.add("drag");
      $(".tlx-body", box).setPointerCapture(e.pointerId);
      onMove(e);
    }
    function onMove(e) {
      if (!dragging) return;
      var p = fromX(e.clientX);
      if (p.i !== cur) { select(p.i); }
      seekFrac(p.f);
    }
    function onUp() { dragging = false; box.classList.remove("drag"); }
    var body = $(".tlx-body", box);
    body.addEventListener("pointerdown", onDown);
    body.addEventListener("pointermove", onMove);
    body.addEventListener("pointerup", onUp);
    body.addEventListener("pointercancel", onUp);
    head.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); seekFrac(frac + (e.key === "ArrowRight" ? .02 : -.02)); }
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); var b = $(".playbtn", scr); if (b) b.click(); }
    });
    // mientras el video anda, el cabezal lo sigue
    function follow() {
      cancelAnimationFrame(raf);
      (function f() {
        var ve = $("video[controls]", scr);
        if (!dragging) {
          if (ve && ve.duration) { dur[cur] = dur[cur] || ve.duration; frac = ve.currentTime / ve.duration; place(); }
          else if (yt && yt.getCurrentTime && yt.getDuration && yt.getDuration()) {
            dur[cur] = yt.getDuration(); var L = lengthOf(cur);
            frac = L ? (yt.getCurrentTime() - startOf(cur)) / L : 0; place();
          }
        }
        raf = playing() ? requestAnimationFrame(f) : 0;
      })();
    }
    function stopYT() { yt = null; cancelAnimationFrame(raf); }
    scr._onplay = function (v) {
      box.classList.add("live");
      var ifr = $("iframe", scr);
      if (ifr && location.protocol.indexOf("http") === 0) {
        ifr.id = ifr.id || "yt" + Math.random().toString(36).slice(2);
        withYT(function (YT) { try { yt = new YT.Player(ifr.id, { events: { onReady: function () { follow(); } } }); } catch (e) {} });
      }
      follow();
    };
    // tocar un clip ya lo escoge en pointerdown; con teclado, Enter sobre el clip
    lane.addEventListener("keydown", function (e) { var c = e.target.closest(".tlx-clip"); if (c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(+c.dataset.v); } });
    lane.addEventListener("click", function (e) { if (e.detail === 0) e.preventDefault(); });
    // si alguien toca otro video desde afuera
    window.addEventListener("resize", place);
    clips[0].classList.add("on");
    layout();
    var api = {
      select: select, seekFrac: seekFrac,
      seekAbs: function (t) { // ir a un segundo exacto del video actual (escaleta, cámaras)
        var v = vids[cur];
        if (yt && yt.seekTo) { yt.seekTo(t, true); return; }
        playIn(scr, v, t);
      },
      cur: function () { return cur; }, el: box
    };
    scr._tl = api;
    return api;
  }

  function renderProjects(list, mount, startIndex) {
    if (!mount || !list || !list.length) return;
    mount.innerHTML = list.map(function (p, i) {
      var v = p.videos || [];
      var horiz = v.length && !v.some(function (x) { return x.vertical; });
      var thumbs = v.length > 1 && !horiz ? '<div class="thumbs" role="tablist" aria-label="Videos de ' + esc(p.titulo) + '">' + v.map(function (x, j) {
        return '<button class="thumb' + (j === 0 ? " on" : "") + (x.vertical ? " vertical" : "") + '" type="button" role="tab" aria-selected="' + (j === 0) + '" data-v="' + j + '">' +
          '<img src="' + esc(posterOf(x)) + '" alt="" loading="lazy"><span>' + esc(x.titulo) + "</span></button>";
      }).join("") + "</div>" : "";
      var roles = (p.roles || []).map(function (r) { return '<span class="chip">' + esc(r) + "</span>"; }).join("");
      var res = (p.cifra || p.cifraTexto)
        ? '<div class="p-res" data-cur="res">' + (p.cifra ? '<span class="v">' + esc(p.cifra) + "</span>" : "") + '<span class="t">' + esc(p.cifraTexto) + "</span></div>"
        : "";
      var also = p.verTambien ? '<a class="see-also" href="' + esc(p.verTambien.href) + '">' + esc(p.verTambien.texto) + " →</a>" : "";
      var n = pad(startIndex + i + 1);
      // la línea que cuenta quién soy en este proyecto
      var scene = p.soy ? '<p class="scene reveal"><span class="scene-tag"><b class="rec"></b>Escena ' + n + " · " + esc(p.titulo.split(" · ")[0]) + "</span>" +
        '<span class="scene-line">Aquí soy <em>' + esc(p.soy) + "</em>.</span></p>" : "";
      // ficha técnica, como los créditos de una película
      var ficha = '<dl class="ficha">' +
        [["Cliente", p.cliente], ["Formato", p.formato], ["Mi rol", (p.roles || []).join(" · ")], ["Año", p.anio]]
          .filter(function (r) { return r[1]; })
          .map(function (r) { return "<div><dt>" + r[0] + "</dt><dd>" + esc(r[1]) + "</dd></div>"; }).join("") + "</dl>";
      var hice = p.hice && p.hice.length ? '<div class="hice"><p class="label">Lo que hice</p><ul>' + p.hice.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul></div>"
        : '<p class="desc">' + esc(p.descripcion || "") + "</p>";
      return '<article class="project reveal' + (p.soy ? " has-scene" : "") + '" id="p-' + esc(p.id) + '" data-i="' + i + '" data-of="' + esc(oficiosOf(p, "edicion")) + '">' + scene +
        '<div class="p-info glass"><div class="p-num"><b>' + n + '</b><span class="label">' + esc(p.anio) + "</span></div>" +
        "<h3>" + esc(p.titulo) + "</h3>" + (p.soy ? ficha : '<p class="meta">' + esc(p.cliente) + '</p><div class="roles" aria-label="Mi rol">' + roles + "</div>") +
        hice + res + caseHTML(p.caso) + also + "</div>" +
        '<div class="player"><div class="screen' + ((v[0] || {}).vertical ? " vertical" : "") + '">' + screenHTML(v[0]) + "</div>" + thumbs + compareHTML(p.comparar) + "</div></article>";
    }).join("");

    $$(".project", mount).forEach(function (art) {
      var p = list[+art.dataset.i], vs = p.videos || [], scr = $(".screen", art);
      var horiz = vs.length && !vs.some(function (x) { return x.vertical; });
      if (horiz) {
        var tl = Timeline(scr, vs, { mount: $(".player", art), before: $(".cmp", art) });
        attachPreview(scr, function () { return vs[tl.cur()]; });
      } else attachPreview(scr, function () { var on = $(".thumb.on", art); return vs[on ? +on.dataset.v : 0]; });
    });
    wireCompare(mount);

    mount.addEventListener("click", function (e) {
      var art = e.target.closest(".project"); if (!art) return;
      var p = list[+art.dataset.i];
      var t = e.target.closest(".thumb");
      if (t) {
        $$(".thumb", art).forEach(function (b) { var on = b === t; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
        var scr = $(".screen", art);
        setScreen(scr, p.videos[+t.dataset.v]);
        if (scr._pv && (!finePointer || scr.matches(":hover"))) scr._pv.start();
        return;
      }
      if (e.target.closest(".playbtn")) {
        var sc = $(".screen", art), on = $(".thumb.on", art);
        playIn(sc, p.videos[sc._tl ? sc._tl.cur() : on ? +on.dataset.v : 0]);
      }
    });
  }

  /* ---------- reels ---------- */
  function renderReels(list, mount, wrap) {
    if (!mount || !list || !list.length) return;
    wrap.hidden = false;
    $("#reels-n").textContent = list.length + " piezas";
    mount.innerHTML = list.map(function (r, i) {
      return '<button class="reel reveal" type="button" data-i="' + i + '" data-of="' + esc(oficiosOf(r, "edicion")) + '" aria-label="Ver ' + esc(r.titulo) + '">' +
        '<video muted loop playsinline preload="none" poster="' + esc(r.poster) + '" data-src="' + esc(r.src) + '"></video>' +
        (r.dur ? '<span class="dur">' + esc(r.dur) + "</span>" : "") +
        '<span class="cap"><small>' + esc(r.cliente || "") + "</small><b>" + esc(r.titulo) + "</b></span></button>";
    }).join("");

    function start(b) { var v = $("video", b); if (!v.src) v.src = v.dataset.src; v.play().catch(function () {}); b.classList.add("is-playing"); }
    function stop(b) { $("video", b).pause(); b.classList.remove("is-playing"); }
    var reels = $$(".reel", mount);
    if (finePointer && !reduce) {
      reels.forEach(function (b) {
        b.addEventListener("mouseenter", function () { start(b); });
        b.addEventListener("mouseleave", function () { stop(b); });
      });
    } else if (!reduce && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) start(e.target); else stop(e.target); });
      }, { threshold: .65 });
      reels.forEach(function (b) { io.observe(b); });
    }
    window.APP.reel = { start: start, stop: stop };

    mount.addEventListener("click", function (e) {
      var b = e.target.closest(".reel"); if (!b) return;
      openViewer(list.map(function (r) {
        return { kind: "video", src: r.src, poster: r.poster, title: r.titulo + (r.cliente ? " · " + r.cliente : "") };
      }), +b.dataset.i);
    });
  }

  /* ---------- gráfico ---------- */
  function pieceCard(g) {
    var n = (g.imagenes || g.paginas || []).length;
    var badge = g.modo === "libro" ? '<span class="count">Hojear · ' + n + " págs.</span>" : (n > 1 ? '<span class="count">' + n + " piezas</span>" : "");
    var ar = function (d) { return ' style="--ar:' + esc(g.ar || d) + '"'; };
    var img = function (src, alt) { return '<img src="' + esc(src) + '" alt="' + esc(alt || "") + '" loading="lazy">'; };
    if (g.mockup === "hablador") {
      var h = g.imagenes || [];
      return '<div class="card mock-table"' + ar("4/5") + '><div class="stand"><span class="shadow"></span><div class="tent">' +
        '<div class="face front">' + img(h[0], "Cara 1 del hablador") + '</div><div class="face back">' + img(h[1] || h[0], "Cara 2 del hablador") + "</div>" +
        "</div></div>" + badge + '<span class="hint">Mueve el cursor para girarlo</span></div>';
    }
    if (g.mockup === "menu") {
      var p = g.paginas || [];
      return '<div class="card mock-menu"' + ar("16/10") + ">" +
        img(p[5] || p[1]).replace("<img", '<img class="m3"') + img(p[3] || p[1]).replace("<img", '<img class="m2"') +
        img(p[0], "Portada de la carta").replace("<img", '<img class="m1"') + badge + "</div>";
    }
    if (g.mockup === "marca") {
      var m = g.imagenes || [];
      return '<div class="card mock-brand"' + ar("21/9") + '><div class="mb-wrap mb1">' + img(m[0], "Logo " + g.titulo) +
        '<span class="chips"><i style="--c:#28A8B5"></i><i style="--c:#FFBB12"></i><i style="--c:#D85B95"></i></span></div>' +
        '<div class="mb-wrap">' + img(m[5] || m[1]) + '</div><div class="mb-wrap">' + img(m[7] || m[2]) + "</div>" + badge + "</div>";
    }
    return '<div class="card"' + ar("4/5") + ">" + img(g.portada, g.titulo) + badge + "</div>";
  }

  function renderPieces(list, mount) {
    if (!mount) return;
    if (!list || !list.length) { mount.innerHTML = '<p class="empty">Piezas en preparación.</p>'; return; }
    mount.innerHTML = list.map(function (g, i) {
      return '<button class="piece reveal ' + esc(g.ancho || "") + '" type="button" data-i="' + i + '" data-of="' + esc(oficiosOf(g, "grafico")) + '" aria-label="Ver ' + esc(g.titulo) + '">' + pieceCard(g) +
        '<div class="pc"><b>' + esc(g.titulo) + "</b><small>" + esc(g.tipo || "") + "</small></div></button>";
    }).join("");
    mount.addEventListener("click", function (e) {
      var b = e.target.closest(".piece"); if (!b) return;
      var g = list[+b.dataset.i];
      if (g.modo === "libro") return openBook(g);
      openViewer((g.imagenes || [g.portada]).map(function (src) { return { kind: "image", src: src, title: g.titulo }; }), 0);
    });
    tilt($$(".piece", mount));
    $$(".mock-table", mount).forEach(function (c) {
      var t = $(".tent", c);
      c.addEventListener("mousemove", function (e) { var r = c.getBoundingClientRect(); turnTent(t, (e.clientX - r.left) / r.width); });
      c.addEventListener("mouseleave", function () { t.style.transform = ""; t.style.animation = ""; });
    });
  }
  function turnTent(t, x) { t.style.animation = "none"; t.style.transform = "rotateX(-8deg) rotateY(" + ((x - .5) * 300).toFixed(1) + "deg)"; }

  function tilt(nodes) {
    if (reduce || !finePointer) return;
    nodes.forEach(function (n) {
      var c = $(".card", n);
      if (!c || c.classList.contains("mock-table")) return;
      n.addEventListener("mousemove", function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.transform = "rotateX(" + ((.5 - y) * 8).toFixed(2) + "deg) rotateY(" + ((x - .5) * 10).toFixed(2) + "deg)";
        c.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
        c.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      });
      n.addEventListener("mouseleave", function () { c.style.transform = ""; });
    });
  }

  /* ---------- editorial ---------- */
  function renderBooks(list, mount) {
    if (!mount) return;
    if (!list || !list.length) { mount.innerHTML = '<p class="empty">Publicaciones en preparación.</p>'; return; }
    mount.innerHTML = list.map(function (b, i) {
      return '<button class="book reveal" type="button" data-i="' + i + '" data-of="' + esc(oficiosOf(b, "editorial")) + '" aria-label="Hojear ' + esc(b.titulo) + '">' +
        '<div class="cover" style="--ar:' + esc(b.ar || "3/4") + '"><img src="' + esc(b.portada) + '" alt="' + esc(b.titulo) + '" loading="lazy"></div>' +
        '<div class="bc"><small>' + esc(b.tipo || "") + " · " + (b.paginas || []).length + " págs.</small><b>" + esc(b.titulo) + "</b></div></button>";
    }).join("");
    mount.addEventListener("click", function (e) {
      var el = e.target.closest(".book"); if (el) openBook(list[+el.dataset.i]);
    });
  }

  /* ---------- sobre mí ---------- */
  function renderAbout(s) {
    if (!s) return;
    var put = function (sel, html, text) { var el = $(sel); if (!el) return; if (text) el.textContent = html; else el.innerHTML = html; };
    $$("[data-bio]").forEach(function (el) { el.textContent = s.bio || ""; });
    put("#bio", s.bio || "", true);
    put("#manifest", s.manifiesto || "", true);
    var colors = ["var(--teal)", "var(--petrol)", "var(--sand)"];
    put("#steps", (s.pasos || []).map(function (p, i) {
      return '<li class="step reveal" style="--c:' + colors[i % 3] + '"><span class="n">' + pad(i + 1) + "</span><h3>" + esc(p.verbo) + ".</h3><p>" + esc(p.texto) + "</p></li>";
    }).join(""));
    put("#trades", (s.oficios || []).map(function (o) { return '<span class="chip">' + esc(o) + "</span>"; }).join(""));
    $$("[data-intro], #intro").forEach(function (el) { el.textContent = s.intro || ""; });
    $$("[data-gancho]").forEach(function (el) { el.textContent = s.gancho || ""; });
    var og = $("#origen-lines");
    if (og && s.origen) {
      var k = 0;
      og.innerHTML = s.origen.map(function (l, i) {
        if (l === "corte") { k++; return '<li class="og-cut reveal" style="--i:' + i + '" aria-hidden="true"><span>Corte</span><i></i><em>00:00:0' + (k * 3) + ":" + pad(k * 7) + "</em></li>"; }
        return '<li class="og-line reveal" style="--i:' + i + '">' + esc(l) + "</li>";
      }).join("");
    }
    var man = $("#manifest"); if (man && !s.manifiesto) man.remove();
    var off = s.fueraDeCamara || [];
    if (off.length && $("#offcam")) { put("#offcam-list", off.map(function (o) { return '<span class="chip">' + esc(o) + "</span>"; }).join("")); $("#offcam").hidden = false; }
  }

  // línea de tiempo: cada hito es un clip sobre la pista
  function renderTray(list) {
    var ol = $("#tray"); if (!ol) return;
    if (!list || !list.length) { if ($("#trayectoria")) $("#trayectoria").hidden = true; return; }
    ol.innerHTML = list.map(function (t, i) {
      var tag = t.href ? "a" : "div", attr = t.href ? ' href="' + esc(t.href) + '"' : "";
      return '<li class="tr-item reveal" style="--i:' + i + '"><span class="tr-when">' + esc(t.cuando) + '</span><span class="tr-dot" aria-hidden="true"></span>' +
        "<" + tag + ' class="tr-clip"' + attr + "><b>" + esc(t.que) + "</b><span>" + esc(t.donde || "") + "</span>" + (t.href ? '<i aria-hidden="true">Ver →</i>' : "") + "</" + tag + "></li>";
    }).join("");
  }

  // cierre: lo que fui en cada proyecto, antes de "Ahora ya sabes quién soy"
  function renderRecap(list) {
    var ul = $("#recap"); if (!ul) return;
    var items = (list || []).filter(function (p) { return p.soy; });
    ul.innerHTML = items.map(function (p, i) {
      return '<li class="reveal" style="--i:' + i + '"><a href="' + esc(p.pagina || "#") + '"><span>' + esc(p.titulo.split(" · ")[0]) + "</span>" + esc(p.soy.charAt(0).toUpperCase() + p.soy.slice(1)) + ".</a></li>";
    }).join("");
  }

  function renderCredits(list) {
    var dl = $("#credits"); if (!dl) return;
    if (!list || !list.length) { dl.closest(".credits").hidden = true; return; }
    dl.innerHTML = list.map(function (c) { return "<div><dt>" + esc(c[0]) + "</dt><dd>" + esc(c[1]) + "</dd></div>"; }).join("");
  }

  /* ---------- visor (galería, video) y libro ---------- */
  var viewer = $("#viewer"), stage = $("#viewer-stage"), vTitle = $("#viewer-title"), vCount = $("#viewer-count");
  var vPrev = $("#viewer-prev"), vNext = $("#viewer-next");
  var vItems = [], vIndex = 0, vMode = "gallery", book = null, lastFocus = null;

  function openViewer(items, index) { vMode = "gallery"; vItems = items; vIndex = index || 0; show(); drawItem(); }
  function drawItem() {
    var it = vItems[vIndex];
    vTitle.textContent = it.title || "";
    vCount.textContent = vItems.length > 1 ? pad(vIndex + 1) + " / " + pad(vItems.length) : "";
    stage.innerHTML = it.kind === "video"
      ? '<video src="' + esc(it.src) + '" poster="' + esc(it.poster || "") + '" controls autoplay playsinline></video>'
      : '<img src="' + esc(it.src) + '" alt="' + esc(it.title || "") + '">';
    vPrev.hidden = vNext.hidden = vItems.length < 2;
  }
  // portada sola; páginas dobles solas; las demás de a dos
  function spreads(n, dobles) {
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
    vMode = "book";
    book = { data: b, single: window.innerWidth < 860, i: 0 };
    book.list = book.single ? b.paginas.map(function (_, i) { return [i]; }) : spreads(b.paginas.length, b.dobles);
    show(); drawSpread(0);
  }
  function drawSpread(dir) {
    var sp = book.list[book.i], b = book.data;
    vTitle.textContent = b.titulo;
    vCount.textContent = "Pág. " + sp.map(function (p) { return p + 1; }).join("–") + " / " + b.paginas.length;
    var wide = sp.length === 1 && (b.dobles || []).indexOf(sp[0]) > -1;
    stage.innerHTML = '<div class="flip"><div class="spread' + (sp.length === 1 ? " single" : "") + (wide ? " wide" : "") +
      (dir > 0 ? " turn-next" : dir < 0 ? " turn-prev" : "") + '">' +
      sp.map(function (p) { return '<img src="' + esc(b.paginas[p]) + '" alt="Página ' + (p + 1) + '">'; }).join("") +
      (sp.length === 2 ? '<span class="spine"></span>' : "") + "</div></div>";
    vPrev.hidden = book.i === 0;
    vNext.hidden = book.i === book.list.length - 1;
    var nx = book.list[book.i + 1];
    if (nx) nx.forEach(function (p) { new Image().src = b.paginas[p]; });
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
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "Tab") { // mantener el foco dentro del visor
      var f = $$("button:not([hidden]), video, iframe", viewer.querySelector(".viewer-box"));
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  var tx = null;
  stage.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    if (tx == null) return;
    var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    tx = null;
  });

  /* ---------- portada: roles que se escriben y capas que se encienden ---------- */
  (function typer() {
    var el = $("#typed"); if (!el) return;
    var words = ["Editor de video", "Director de fotografía", "Camarógrafo", "Colorista", "Motion graphics", "Diseñador gráfico", "Diseñador editorial", "Diseñador web", "Depende del proyecto…"].map(function (w) { return window.T ? T(w) : w; });
    var layerOf = [0, 1, 1, 2, 3, 4, 5, 6, -1]; // -1 = todas las capas
    var lis = $$("#lp li");
    function light(i) { lis.forEach(function (li) { li.classList.toggle("on", i === -1 || +li.dataset.l === i); }); }
    if (reduce) { el.textContent = words[words.length - 1]; light(-1); return; }
    var w = 0, c = 0, del = false;
    (function tick() {
      var word = words[w];
      if (!del && c === 0) light(layerOf[w]);
      if (!del) {
        el.textContent = word.slice(0, ++c);
        if (c === word.length) { del = true; return setTimeout(tick, w === words.length - 1 ? 2600 : 1300); }
      } else {
        el.textContent = word.slice(0, --c);
        if (c === 0) { del = false; w = (w + 1) % words.length; }
      }
      setTimeout(tick, del ? 28 : 55);
    })();
  })();

  /* ---------- portada: paralaje con el cursor ---------- */
  var hero = $(".hero");
  if (hero && !reduce && finePointer) {
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty("--px", ((e.clientX - r.left) / r.width - .5).toFixed(3));
      hero.style.setProperty("--py", ((e.clientY - r.top) / r.height - .5).toFixed(3));
    });
    hero.addEventListener("mouseleave", function () { hero.style.setProperty("--px", 0); hero.style.setProperty("--py", 0); });
  }

  /* ---------- scroll: código de tiempo, cabezal e isotipos de fondo ---------- */
  var tcEl = $("#timecode"), ph = $("#playhead"), decos = $$(".deco"), ticking = false;
  var TOTAL = 3 * 60 * 25; // el sitio "dura" 3 minutos a 25 fps
  function onScroll() {
    ticking = false;
    var max = root.scrollHeight - root.clientHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    var f = Math.round(p * TOTAL), s = Math.floor(f / 25);
    tcEl.textContent = "00:" + pad(Math.floor(s / 60)) + ":" + pad(s % 60) + ":" + pad(f % 25);
    ph.style.width = (p * 100).toFixed(2) + "%";
    if (!reduce) decos.forEach(function (d) {
      var r = d.parentNode.getBoundingClientRect();
      d.style.setProperty("--sy", (-r.top * (parseFloat(d.style.getPropertyValue("--d")) || .1)).toFixed(1));
    });
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- contacto ---------- */
  var C = D.contacto || {};
  var wa = $("#wa");
  function tr(x) { return window.T ? T(x) : x; }
  function waLink(msg) { return "https://wa.me/" + C.whatsapp + (msg ? "?text=" + encodeURIComponent(msg) : ""); }
  if (C.whatsapp) $$('a[href^="https://wa.me/"]').forEach(function (a) { a.href = waLink(tr(C.mensajeWhatsapp)); });
  if ($("#year")) $("#year").textContent = new Date().getFullYear();

  // "Arma tu pedido": tres toques y el mensaje de WhatsApp llega listo
  (function brief() {
    var B = C.brief, form = $("#brief");
    if (!form || !wa || !B || !C.whatsapp) return;
    var Q = [["que", "¿Qué necesitas?", true], ["cuando", "¿Para cuándo?", false], ["presupuesto", "¿Cuánto piensas invertir?", false]]
      .filter(function (q) { return B[q[0]] && B[q[0]].length; });
    $("#brief-qs").innerHTML = Q.map(function (q, n) {
      return '<fieldset class="bq"><legend><span>' + (n + 1) + "</span>" + q[1] + (q[2] ? " <small>Puedes marcar varias</small>" : "") + "</legend>" +
        '<div class="opts" data-k="' + q[0] + '"' + (q[2] ? " data-multi" : "") + ">" +
        B[q[0]].map(function (o) { return '<button type="button" class="opt" aria-pressed="false">' + esc(o) + "</button>"; }).join("") + "</div></fieldset>";
    }).join("");
    form.hidden = false;
    form.closest(".contact-card").classList.add("has-brief");
    var name = $("#brief-name"), out = $("#brief-msg"), label = $(".wa-label", wa);
    function picked(k) { return $$('.opts[data-k="' + k + '"] .opt[aria-pressed="true"]', form).map(function (b) { return b.textContent; }); }
    var en = window.I18N && I18N.lang === "en";
    function list(a) { return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + (en ? " and " : " y ") + a[a.length - 1]; }
    function build() {
      var que = picked("que"), cu = picked("cuando"), pr = picked("presupuesto"), who = name.value.trim();
      var any = que.length || cu.length || pr.length || who;
      var lines = [en ? "Hi Alex" + (who ? ", I'm " + who : "") + ". I saw your portfolio." : "Hola Alex" + (who ? ", soy " + who : "") + ". Vi tu portafolio."];
      if (que.length) lines.push((en ? "I need: " : "Necesito: ") + list(que).toLowerCase() + ".");
      if (cu.length) lines.push((en ? "Timing: " : "Para: ") + cu[0].toLowerCase() + ".");
      if (pr.length) lines.push((en ? "Budget: " + pr[0] : "Presupuesto: " + pr[0].toLowerCase()) + ".");
      var msg = any ? lines.join("\n") : tr(C.mensajeWhatsapp);
      wa.href = waLink(msg);
      out.textContent = msg;
      form.classList.toggle("ready", !!any);
      label.textContent = any ? "Enviar mi pedido por WhatsApp" : "Escríbeme por WhatsApp";
    }
    form.addEventListener("click", function (e) {
      var b = e.target.closest(".opt"); if (!b) return;
      var box = b.parentNode, on = b.getAttribute("aria-pressed") !== "true";
      if (!box.hasAttribute("data-multi")) $$(".opt", box).forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", on);
      build();
    });
    name.addEventListener("input", build);
    form.addEventListener("submit", function (e) { e.preventDefault(); wa.click(); });
    build();
  })();

  /* ---------- escenas: tarjetas que llevan a la página de cada proyecto ---------- */
  function sceneCover(p) {
    var v = (p.videos || [])[0] || {};
    if (p.portada) return '<img src="' + esc(p.portada) + '" alt="" loading="lazy">';
    if (p.set === "control") return '<img src="' + esc(posterOf(v)) + '" alt="" loading="lazy"><span class="bars strip" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><span class="onair"><b></b>Al aire</span>';
    return '<img src="' + esc(posterOf(v)) + '" alt="" loading="lazy">';
  }
  function renderScenes(list, mount) {
    if (!mount || !list) return;
    mount.innerHTML = list.map(function (p, i) {
      var v = (p.videos || [])[0] || {};
      var vid = v.tipo === "local" ? '<video muted loop playsinline preload="none" src="' + esc(v.src) + '"></video>' : "";
      return '<a class="scard reveal set-' + esc(p.set || "") + '" href="' + esc(p.pagina) + '" data-of="' + esc(oficiosOf(p, "edicion")) + '" style="--i:' + i + '">' +
        '<span class="sc-media">' + sceneCover(p) + vid + '<span class="sc-tag"><b class="rec"></b>Escena ' + pad(i + 1) + "</span></span>" +
        '<span class="sc-body"><b class="sc-title">' + esc(p.titulo) + '</b><span class="sc-soy">Aquí soy <em>' + esc(p.soy || "") + "</em>.</span>" +
        '<span class="sc-foot"><span>' + esc((p.roles || []).join(" · ")) + "</span>" + (p.cifra ? "<strong>" + esc(p.cifra) + " <small>" + esc(p.cifraTexto) + "</small></strong>" : "") + "</span>" +
        '<span class="sc-go">Entrar a la escena →</span></span></a>';
    }).join("");
    if (reduce) return;
    $$(".scard", mount).forEach(function (c) {
      var vid = $("video", c); if (!vid) return;
      var on = function () { vid.play().catch(function () {}); c.classList.add("playing"); };
      var off = function () { vid.pause(); c.classList.remove("playing"); };
      if (finePointer) { c.addEventListener("mouseenter", on); c.addEventListener("mouseleave", off); }
      else if (!saveData && "IntersectionObserver" in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) on(); else off(); }); }, { threshold: .7 }).observe(c);
    });
  }

  /* ---------- montaje ---------- */
  window.APP = { reduce: reduce, finePointer: finePointer, turnTent: turnTent };
  window.APP.u = {
    $: $, $$: $$, esc: esc, pad: pad, posterOf: posterOf, ytThumb: ytThumb, ytEmbed: ytEmbed, isVideo: isVideo, saveData: saveData,
    caseHTML: caseHTML, screenHTML: screenHTML, setScreen: setScreen, playIn: playIn, attachPreview: attachPreview,
    compareHTML: compareHTML, wireCompare: wireCompare, Timeline: Timeline, tcode: tcode, openViewer: openViewer, openBook: openBook, spreads: spreads, oficiosOf: oficiosOf
  };
  renderProjects(D.destacados, $("#destacados"), 0);
  renderScenes(D.destacados, $("#escenas"));
  if (D.videoclips && D.videoclips.length && $("#videoclips-wrap")) {
    $("#videoclips-wrap").hidden = false;
    renderProjects(D.videoclips, $("#videoclips"), (D.destacados || []).length);
  }
  renderReels(D.reels, $("#reels"), $("#reels-wrap"));
  renderPieces(D.grafico, $("#grafico-grid"));
  renderBooks(D.editorial, $("#editorial-grid"));
  renderAbout(D.sobre);
  renderTray(D.trayectoria);
  renderRecap(D.destacados);
  renderCredits(D.creditos);

  /* ---------- claqueta de entrada ----------
     El visitante da REC y el sitio "empieza a grabar". Si no toca nada,
     arranca solo a los 3,5 s. Solo sale una vez por visita. */
  window.APP.rolling = new Promise(function (resolve) {
    var pre = $("#pre");
    if (!pre || !root.classList.contains("pre-on")) { if (pre) pre.remove(); return resolve(); }
    var btn = $("#pre-rec"), tc = $("#pre-tc"), state = $(".pre-state em", pre), num = $("#pre-n", pre);
    var t0 = performance.now(), done = false, raf = 0;
    document.body.style.overflow = "hidden";
    (function tick(now) {
      var f = Math.floor((now - t0) / 40);
      tc.textContent = "00:00:" + pad(Math.floor(f / 25) % 60) + ":" + pad(f % 25);
      raf = requestAnimationFrame(tick);
    })(t0);
    setTimeout(function () { btn.focus({ preventScroll: true }); }, 50);
    var at = function (ms, fn) { setTimeout(fn, ms); };
    function go() {
      if (done) return; done = true;
      try { sessionStorage.setItem("ap-rec", "1"); } catch (e) {}
      // 1 · REC: el cuadro se pone rojo
      pre.classList.add("rolling"); state.textContent = "REC";
      // 2 · cuenta regresiva de película: 3, 2, 1
      at(380, function () { pre.classList.add("counting"); num.textContent = "3"; });
      at(800, function () { num.textContent = "2"; });
      at(1220, function () { num.textContent = "1"; });
      // 3 · destello blanco y el obturador se abre sobre la portada, que "se revela"
      at(1640, function () { pre.classList.add("flash"); });
      at(1760, function () {
        pre.classList.remove("flash", "counting"); pre.classList.add("opening");
        root.classList.add("revealing");
        root.classList.remove("pre-on"); document.body.style.overflow = "";
        requestAnimationFrame(function () { requestAnimationFrame(function () { pre.classList.add("go"); }); });
      });
      at(2600, function () { cancelAnimationFrame(raf); pre.remove(); resolve(); });
      at(4200, function () { root.classList.remove("revealing"); });
    }
    btn.addEventListener("click", go);
    document.addEventListener("keydown", function k(e) { if (e.key === "Enter" || e.key === " " || e.key === "Escape") { document.removeEventListener("keydown", k); e.preventDefault(); go(); } });
    pre.classList.add("auto");
    setTimeout(go, 3600);
  });

  /* ---------- la cámara de la portada ----------
     Cuatro controles reales: ISO (grano), diafragma (desenfoque del fondo),
     obturador (barrido) y balance de blancos (temperatura). Los tres primeros
     también mueven la exposición, como en una cámara de verdad. Se arrastran
     de lado como los valores en After Effects; con teclado, flechas. */
  (function lens() {
    var box = $("#lens"), hero = $(".hero");
    if (!box || !hero) return;
    var V = {
      iso: { v: [100, 200, 400, 800, 1600, 3200, 6400, 12800], d: 3, f: function (x) { return String(x); } },
      f:   { v: [1.4, 1.8, 2.8, 4, 5.6, 8, 11, 16], d: 2, f: function (x) { return "f/" + x; } },
      s:   { v: [8, 15, 30, 50, 125, 250, 500, 1000], d: 3, f: function (x) { return "1/" + x; } },
      wb:  { v: [3200, 4300, 5600, 6500, 7500], d: 2, f: function (x) { return x + "K"; } }
    };
    var state = {}, img = $(".hero-img"), blurG = $("#mblur-g"), needle = $("#vf-needle");
    var BLUR = { 1.4: 9, 1.8: 5 }, GRAIN = { 1600: .18, 3200: .32, 6400: .5, 12800: .7 }, MB = { 8: 7, 15: 3.5, 30: 1.2 };
    function apply() {
      var iso = V.iso.v[state.iso], f = V.f.v[state.f], s = V.s.v[state.s], wb = V.wb.v[state.wb];
      var ev = Math.log2(iso / 800) + 2 * Math.log2(2.8 / f) + Math.log2(50 / s);
      var exp = Math.max(.25, Math.min(2.2, Math.pow(2, ev * .42)));
      hero.style.setProperty("--exp", exp.toFixed(3));
      hero.style.setProperty("--dof", (BLUR[f] || 0) + "px");
      hero.style.setProperty("--grain", GRAIN[iso] || 0);
      hero.style.setProperty("--cool", wb < 5600 ? ((5600 - wb) / 2400 * .55).toFixed(3) : 0);
      hero.style.setProperty("--warm", wb > 5600 ? ((wb - 5600) / 1900 * .55).toFixed(3) : 0);
      hero.classList.toggle("over", ev >= 1.6);
      var mb = MB[s] || 0;
      if (blurG) blurG.setAttribute("stdDeviation", mb + " 0");
      if (img) img.style.filter = (mb ? "url(#mblur) " : "") + (exp !== 1 ? "brightness(" + exp.toFixed(3) + ")" : "");
      if (needle) needle.style.setProperty("--ev", Math.max(-2, Math.min(2, ev)).toFixed(2));
      var changed = Object.keys(V).some(function (k) { return state[k] !== V[k].d; });
      box.classList.toggle("changed", changed);
    }
    $$(".lv", box).forEach(function (lv) {
      var k = lv.dataset.k, def = V[k], out = $("output", lv), input = $("input", lv);
      input.min = 0; input.max = def.v.length - 1; input.step = 1; input.value = def.d;
      state[k] = def.d;
      function set(i, from) {
        i = Math.max(0, Math.min(def.v.length - 1, i));
        if (i === state[k] && from !== "init") return;
        state[k] = i; input.value = i; out.textContent = def.f(def.v[i]);
        input.setAttribute("aria-valuetext", def.f(def.v[i]));
        lv.classList.remove("bump"); void lv.offsetWidth; lv.classList.add("bump");
        apply(); box.classList.add("used");
      }
      lv._set = set;
      input.addEventListener("input", function () { set(+input.value); });
      // arrastrar de lado (mouse y dedo); un toque sin arrastrar sube un paso
      var x0 = 0, i0 = 0, moved = false, id = null;
      lv.addEventListener("pointerdown", function (e) {
        if (e.button > 0) return;
        e.preventDefault(); id = e.pointerId; lv.setPointerCapture(id);
        x0 = e.clientX; i0 = state[k]; moved = false; lv.classList.add("drag");
      });
      lv.addEventListener("pointermove", function (e) {
        if (e.pointerId !== id) return;
        var d = Math.round((e.clientX - x0) / 16);
        if (d) moved = true;
        set(i0 + d);
      });
      function end(e) {
        if (e.pointerId !== id) return;
        id = null; lv.classList.remove("drag");
        if (!moved) set(state[k] + 1 > def.v.length - 1 ? 0 : state[k] + 1);
        input.focus({ preventScroll: true });
      }
      lv.addEventListener("pointerup", end);
      lv.addEventListener("pointercancel", function (e) { if (e.pointerId === id) { id = null; lv.classList.remove("drag"); } });
      lv.addEventListener("click", function (e) { e.preventDefault(); });
    });
    $("#lens-auto").addEventListener("click", function () {
      $$(".lv", box).forEach(function (lv) { lv._set(V[lv.dataset.k].d); });
      box.classList.remove("used");
    });
    apply();
    window.APP.lens = { set: function (k, i) { var lv = $('.lv[data-k="' + k + '"]', box); if (lv) lv._set(i); }, state: state, V: V };
  })();

  /* ---------- filtro por oficio ----------
     Las capas de la portada y la barra "Ver por oficio" muestran solo el
     trabajo de ese oficio. El filtro queda en el enlace (?ver=camara),
     así puedes mandarle a un cliente solo lo que le interesa. */
  var filter = (function () {
    var bar = $("#fbar"), chips = $("#fbar-chips"), pill = $("#fpill"), lis = $$("#lp li[data-f]");
    var groups = ["#destacados", "#videoclips-wrap", "#reels-wrap", "#grafico", "#editorial"].map(function (s) { return $(s); }).filter(Boolean);
    var items = $$("[data-of]");
    var has = function (el, k) { return (" " + el.dataset.of + " ").indexOf(" " + k + " ") > -1; };
    var count = {};
    OFICIOS.forEach(function (o) { count[o[0]] = items.filter(function (el) { return has(el, o[0]); }).length; });
    var names = {}; OFICIOS.forEach(function (o) { names[o[0]] = o[1]; });
    var cur = "";

    if (chips) chips.innerHTML = '<button type="button" class="fchip" data-f="" aria-pressed="true">Todo<small>' + items.length + "</small></button>" +
      OFICIOS.filter(function (o) { return count[o[0]]; }).map(function (o) {
        return '<button type="button" class="fchip" data-f="' + o[0] + '" aria-pressed="false" style="--c:' + ({ edicion: "#2EA690", camara: "#5AA3AE", color: "#F29863", motion: "#D9674E", grafico: "#F2C572", editorial: "#2EA690", web: "#2A5159" }[o[0]]) + '">' + o[1] + "<small>" + count[o[0]] + "</small></button>";
      }).join("");
    lis.forEach(function (li) {
      var k = li.dataset.f, n = count[k] || 0;
      li.setAttribute("role", "button");
      if (n) { li.tabIndex = 0; li.setAttribute("aria-pressed", "false"); li.title = "Ver solo " + names[k] + " (" + n + ")"; }
      else { li.classList.add("empty"); li.setAttribute("aria-disabled", "true"); li.title = "Pronto"; }
    });

    function apply(k, scroll) {
      if (k && !count[k]) k = "";
      if (k === cur) k = "";      // tocar la misma capa la apaga
      var run = function () {
        cur = k;
        items.forEach(function (el) { el.classList.toggle("f-out", !!k && !has(el, k)); });
        groups.forEach(function (g) { g.classList.toggle("f-empty", !!k && !$("[data-of]:not(.f-out)", g)); });
        var av = $("#audiovisual"); if (av) av.classList.toggle("f-empty", !!k && !$("[data-of]:not(.f-out)", av));
        $$(".fchip", chips).forEach(function (c) {
          c.setAttribute("aria-pressed", c.dataset.f === k);
          if (c.dataset.f === k && chips.scrollWidth > chips.clientWidth) chips.scrollLeft = c.offsetLeft - chips.offsetLeft - 16;
        });
        lis.forEach(function (li) { var on = li.dataset.f === k; li.classList.toggle("picked", on); if (count[li.dataset.f]) li.setAttribute("aria-pressed", on); });
        root.classList.toggle("filtering", !!k);
        if (pill) { pill.hidden = !k; $("b", pill).textContent = k ? names[k] + " · " + count[k] : ""; }
        try { var u = new URL(location.href); if (k) u.searchParams.set("ver", k); else u.searchParams.delete("ver"); history.replaceState(null, "", u); } catch (e) {}
      };
      if (document.startViewTransition && !reduce && scroll !== "silent") document.startViewTransition(run); else run();
      if (scroll === true && bar) setTimeout(function () { bar.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); }, 30);
    }
    if (chips) chips.addEventListener("click", function (e) { var c = e.target.closest(".fchip"); if (c) apply(c.dataset.f, true); });
    lis.forEach(function (li) {
      var go = function () { if (count[li.dataset.f]) apply(li.dataset.f, true); };
      li.addEventListener("click", go);
      li.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
    if (pill) $("button", pill).addEventListener("click", function () { apply("", false); });
    // una cifra lleva a su caso aunque haya un filtro puesto
    $$(".stats a").forEach(function (a) { a.addEventListener("click", function () { var t = $(a.getAttribute("href")); if (t && t.classList.contains("f-out")) apply("", "silent"); }); });
    try { var q = new URLSearchParams(location.search).get("ver"); if (q) apply(q, "silent"); } catch (e) {}
    return { apply: apply, get: function () { return cur; } };
  })();

  /* ---------- atajos de editor ----------
     J y L: proyecto anterior / siguiente · K: reproducir o pausar
     1–5: saltar a cada sección · 0: quitar el filtro · ?: ver los atajos */
  (function keys() {
    var help = $("#keys"), hint = $("#kbd-hint"), hud = $("#hud"), hudT = 0;
    var SECS = ["sobre-mi", "audiovisual", "grafico", "editorial", "contacto"];
    var PAGES = ["sobre-mi.html", "audiovisual.html", "grafico.html", "editorial.html", "contacto.html"];
    var NAMES = { audiovisual: "Audiovisual", "reels-wrap": "Reels", grafico: "Gráfico", editorial: "Editorial", "sobre-mi": "Sobre mí", contacto: "Contacto" };
    function nameOf(el) {
      if (el.classList.contains("project")) return $("h3", el).textContent;
      if (el.classList.contains("scard")) return $(".sc-title", el).textContent;
      return el.dataset.name || NAMES[el.id] || "";
    }
    function flash(t) { if (!hud) return; hud.textContent = t; hud.classList.remove("show"); void hud.offsetWidth; hud.classList.add("show"); clearTimeout(hudT); hudT = setTimeout(function () { hud.classList.remove("show"); }, 900); }
    function shown(el) { return el && el.offsetParent !== null && !el.closest(".f-out, .f-empty"); }
    function stops() { return $$(".project, .scard, .stop, #reels-wrap").filter(shown); }
    var off = function () { return parseFloat(getComputedStyle(root).scrollPaddingTop) || 84; };
    function go(d) {
      var s = stops(), o = off(), t = null;
      if (d > 0) t = s.filter(function (el) { return el.getBoundingClientRect().top > o + 12; })[0];
      else { var b = s.filter(function (el) { return el.getBoundingClientRect().top < o - 12; }); t = b[b.length - 1]; }
      if (!t) return flash(d > 0 ? "Fin de la secuencia" : "Inicio");
      t.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      flash((d > 0 ? "L ▸ " : "◂ J ") + nameOf(t));
    }
    function centerProject() {
      var mid = innerHeight / 2, best = null, bd = 1e9;
      $$(".project").filter(shown).forEach(function (p) { var r = p.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; var d = Math.abs(r.top + r.height / 2 - mid); if (d < bd) { bd = d; best = p; } });
      return best;
    }
    function toggle() {
      if (window.APP.k && window.APP.k()) return;  // la página del proyecto maneja su propio video
      var p = centerProject(); if (!p) return flash("K · no hay video en pantalla");
      var scr = $(".screen", p), v = $("video[controls]", scr);
      if (v) { if (v.paused) { v.play(); flash("▶ Reproducir"); } else { v.pause(); flash("❚❚ Pausa"); } return; }
      if ($("iframe", scr)) return flash("Usa los controles del video");
      $(".playbtn", scr).click(); flash("▶ Reproducir");
    }
    function toggleHelp(force) {
      if (!help) return;
      var open = force == null ? help.hidden : force;
      help.hidden = !open;
      if (open) $("button", help).focus();
    }
    if (help) help.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) toggleHelp(false); });
    if (hint) hint.addEventListener("click", function () { toggleHelp(true); });
    document.addEventListener("keydown", function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey || (viewer && !viewer.hidden) || root.classList.contains("pre-on")) return;
      var t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      var k = e.key.toLowerCase();
      if (k === "escape" && help && !help.hidden) return toggleHelp(false);
      if (k === "?" || (k === "/" && e.shiftKey)) { e.preventDefault(); return toggleHelp(); }
      if (k === "l") return window.APP.jl ? window.APP.jl(1) : go(1);
      if (k === "j") return window.APP.jl ? window.APP.jl(-1) : go(-1);
      if (k === "k") return toggle();
      if (k === "0") { if (filter.get()) { filter.apply("", false); flash("Filtro quitado"); } return; }
      var n = +k;
      if (k === "h") { location.href = "index.html"; return; }
      if (n >= 1 && n <= PAGES.length) { flash(n + " · " + NAMES[SECS[n - 1]]); location.href = PAGES[n - 1]; }
    });
    // la pista de atajos aparece después de la portada, solo con mouse
    if (hint && finePointer) {
      if ($(".hero") && "IntersectionObserver" in window) new IntersectionObserver(function (es) { hint.classList.toggle("show", !es[0].isIntersecting); }).observe($(".hero"));
      else { var sh = function () { hint.classList.toggle("show", window.scrollY > 200); }; window.addEventListener("scroll", sh, { passive: true }); sh(); }
    }
  })();

  window.APP.filter = filter;

  // aparición al hacer scroll
  var rev = $$(".reveal");
  if (reduce || !("IntersectionObserver" in window)) rev.forEach(function (r) { r.classList.add("in"); });
  else {
    var rIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); rIO.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    rev.forEach(function (r) { rIO.observe(r); });
  }
})();
