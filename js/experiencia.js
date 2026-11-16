/* =============================================================================
   Experiencia de navegación: "una transmisión en vivo"
   (la identidad no cambia: mismos colores, tipos, vidrios e isotipo;
   cambia la forma de recorrer y mostrar las cosas)
   · Barra lateral de transmisión + menú a pantalla completa .... (todas)
   · Corte de edición al cambiar de página ........................ (todas)
   · Videos que se reproducen al pasar el mouse ................... (todas)
   · Presentación: «¿Quién soy?» se arma y se desarma ............ (inicio)
   · El programa: las 5 escenas pasan por un mismo cuadro ......... (inicio)
   · La sala de proyección: las escenas en un arco de pantallas ... (audiovisual)
   · Web: cada sitio en una ventana de navegador, con su ficha ...... (web)
   Todo respeta "reducir movimiento": sin animaciones, todo visible.
   ============================================================================= */
(function () {
  "use strict";
  var D = window.PORTFOLIO || {};
  var html = document.documentElement, body = document.body;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var T = window.T || function (x) { return x; };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var esc = function (x) { return String(x == null ? "" : x).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var page = body.dataset.page || "";
  var LIST = D.destacados || [];

  /* ---------- 1 · Escena actual en la barra lateral ---------- */
  var scene = $("#rail-scene");
  if (scene) {
    var names = { "inicio": "Escena 00 · Inicio", "sobre-mi": "El origen", "audiovisual": "Escenas", "grafico": "Gráfico", "editorial": "Editorial", "web": "Web", "contacto": "Próxima escena", "404": "Toma perdida" };
    var label = names[page] || "";
    if (page === "proyecto") {
      var id = body.dataset.id, i = LIST.findIndex(function (d) { return d.id === id; });
      if (i >= 0) label = "Escena " + pad(i + 1) + " · " + LIST[i].titulo.split(" · ")[0];
    }
    scene.textContent = label;
  }

  /* ---------- 2 · Menú a pantalla completa ---------- */
  var menu = $("#menu"), btn = $("#menu-btn"), closeB = $("#mnu-close");
  var prefs = $(".topbar .prefs"), prefsHome = prefs ? prefs.parentNode : null, prefsSlot = $("#mnu-prefs");
  var mq = window.matchMedia("(max-width: 900px)");
  function placePrefs() { if (!prefs) return; (mq.matches ? prefsSlot : prefsHome).appendChild(prefs); }
  if (prefs && prefsSlot) { placePrefs(); (mq.addEventListener ? mq.addEventListener("change", placePrefs) : mq.addListener(placePrefs)); }

  var lastFocus = null;
  function media(sec) {
    $$(".mnu-media > *", menu).forEach(function (m) {
      var on = m.dataset.for === sec; m.classList.toggle("on", on);
      if (m.tagName === "VIDEO") { if (on && !reduce) { var p = m.play(); if (p && p.catch) p.catch(function () {}); } else m.pause(); }
    });
  }
  var hideT;
  function openMenu() {
    if (!menu) return;
    clearTimeout(hideT);
    lastFocus = document.activeElement;
    menu.hidden = false; requestAnimationFrame(function () { menu.classList.add("open"); });
    html.classList.add("menu-open"); btn.setAttribute("aria-expanded", "true");
    var cur = $(".mnu-list a.on", menu) || $(".mnu-list a", menu);
    media(cur ? cur.dataset.sec : "inicio");
    setTimeout(function () { (cur || closeB).focus(); }, 60);
  }
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.classList.remove("open"); html.classList.remove("menu-open"); btn.setAttribute("aria-expanded", "false");
    hideT = setTimeout(function () { menu.hidden = true; media(""); }, reduce ? 0 : 420);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (menu && btn) {
    btn.addEventListener("click", function () { menu.hidden ? openMenu() : closeMenu(); });
    closeB.addEventListener("click", closeMenu);
    $$(".mnu-list a", menu).forEach(function (a) {
      a.addEventListener("mouseenter", function () { media(a.dataset.sec); });
      a.addEventListener("focus", function () { media(a.dataset.sec); });
    });
    document.addEventListener("keydown", function (e) {
      if (menu.hidden) return;
      if (e.key === "Escape") { e.preventDefault(); closeMenu(); }
      if (e.key === "Tab") { // el foco no sale del menú
        var f = $$("a, button", menu).filter(function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    }, true);
  }
  // la página actual también se marca en la lista (shell.js ya puso .on donde corresponde)
  if (page === "inicio") { var a0 = $('.mnu-list a[data-sec="inicio"]'); if (a0) { a0.classList.add("on"); a0.setAttribute("aria-current", "page"); } }

  /* ---------- 3 · Corte de edición entre páginas ---------- */
  var cut = $("#cut");
  if (cut) {
    if (html.classList.contains("cutting")) {
      try { sessionStorage.removeItem("ap-cut"); } catch (e) {}
      cut.classList.add("go", "still");
      html.classList.remove("cutting");
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        cut.classList.remove("still"); cut.classList.add("leave");
        setTimeout(function () { cut.classList.remove("go", "leave"); }, 700);
      }); });
    }
    document.addEventListener("click", function (e) {
      if (reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      var url; try { url = new URL(a.href, location.href); } catch (er) { return; }
      if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
      if (url.pathname === location.pathname && url.hash) return; // ancla en la misma página
      e.preventDefault();
      try { sessionStorage.setItem("ap-cut", "1"); } catch (er) {}
      closeMenu();
      cut.classList.add("go");
      setTimeout(function () { location.href = url.href; }, 420);
    });
    window.addEventListener("pageshow", function (e) { if (e.persisted) cut.classList.remove("go", "leave", "still"); });
  }

  /* ---------- 4 · Videos que se reproducen al pasar el mouse ---------- */
  var touch = window.matchMedia("(hover: none)").matches;
  function hoverPlay(v) {
    if (v._hp) return; v._hp = true; v.muted = true; v.playsInline = true;
    var play = function () { if (reduce) return; var p = v.play(); if (p && p.catch) p.catch(function () {}); };
    var stop = function () { v.pause(); };
    if (touch && "IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { es.forEach(function (en) { en.isIntersecting && en.intersectionRatio > .6 ? play() : stop(); }); }, { threshold: [0, .6, 1] }).observe(v);
    } else {
      var host = v.closest("a, .hp-host") || v;
      host.addEventListener("mouseenter", play); host.addEventListener("mouseleave", stop);
      host.addEventListener("focus", play); host.addEventListener("blur", stop);
    }
  }
  window.APP = window.APP || {}; window.APP.hoverPlay = hoverPlay;
  $$("video[data-hover]").forEach(hoverPlay);

  /* ---------- 5 · Presentación: «¿Quién soy?» se arma y se desarma ---------- */
  var title = $("[data-kin]");
  if (title) {
    var words = T(title.textContent.trim());
    var lastO = Math.max(words.lastIndexOf("o"), words.lastIndexOf("O"));
    var n = 0, out = words.split(" ").map(function (w, wi, arr) {
      var start = words.split(" ").slice(0, wi).join(" ").length + (wi ? 1 : 0);
      var chars = w.split("").map(function (ch, ci) {
        var abs = start + ci, k = n++;
        var dx = ((k % 5) - 2) * 26, dy = ((k * 37) % 7 - 3) * 22, rot = ((k * 53) % 9 - 4) * 3;
        var st = ' style="--i:' + k + ";--dx:" + dx + ";--dy:" + dy + ";--rot:" + rot + '"';
        if (abs === lastO) return '<span class="ch lens-o"' + st + '><svg viewBox="0 0 100 100"><circle class="r1" cx="50" cy="50" r="44"/><circle class="r2" cx="50" cy="50" r="31"/><g class="blades"><path d="M50 19 L58 37"/><path d="M77 35 L64 45"/><path d="M73 69 L57 63"/><path d="M41 80 L44 62"/><path d="M21 58 L37 51"/><path d="M28 27 L41 40"/></g><circle class="rec-dot" cx="80" cy="18" r="6"/></svg></span>';
        return '<span class="ch"' + st + ">" + esc(ch) + "</span>";
      }).join("");
      return '<span class="w">' + chars + "</span>";
    }).join(" ");
    title.setAttribute("aria-label", words);
    title.setAttribute("data-no-i18n", "");
    title.innerHTML = '<span class="kin-vis" aria-hidden="true">' + out + "</span>";
    var pin = $("#hero-pin"), hero = $(".hero-x");
    if (pin && hero && !reduce) {
      var tick = false;
      var upd = function () {
        tick = false;
        var r = pin.getBoundingClientRect(), span = pin.offsetHeight - innerHeight;
        var k = span > 0 ? clamp(-r.top / span, 0, 1) : 0;
        hero.style.setProperty("--k", k.toFixed(4));
        hero.classList.toggle("kin-moving", k > .02);
      };
      window.addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
      window.addEventListener("resize", upd); upd();
    } else if (pin) { pin.classList.add("static"); }
  }

  /* ---------- 6 · El programa: las 5 escenas pasan por un mismo cuadro ---------- */
  var slidesEl = $("#prog-slides");
  if (slidesEl && LIST.length) {
    var big = function (v) { return v.tipo === "youtube" ? "https://i.ytimg.com/vi/" + v.id + "/maxresdefault.jpg" : (v.poster || ""); };
    var small = function (v) { return v.tipo === "youtube" ? "https://i.ytimg.com/vi/" + v.id + "/hqdefault.jpg" : (v.poster || ""); };
    var N = LIST.length;
    var bg = $(".prg .prog-bg"), tl = $("#prog-tl"), numEl = $("#prog-n");
    var pinEl = $("#prog-pin"); if (pinEl) pinEl.style.setProperty("--n", N); var totEl = $("#prog-total"); if (totEl) totEl.textContent = pad(N);
    bg.innerHTML = LIST.map(function (d, i) { var v = (d.videos || [])[0] || {}; return '<img src="' + esc(small(v)) + '" alt="" data-i="' + i + '" loading="lazy">'; }).join("");
    slidesEl.innerHTML = LIST.map(function (d, i) {
      var v = (d.videos || [])[0] || {};
      var local = v.tipo === "local" && v.src;
      var vertical = local && v.vertical;
      var pic = local
        ? '<video src="' + esc(v.src) + '" poster="' + esc(v.poster || "") + '" muted loop playsinline preload="none"' + (vertical ? ' class="vert"' : "") + "></video>" + (vertical ? '<img class="fill" src="' + esc(v.poster || "") + '" alt="" loading="lazy">' : "")
        : '<img src="' + esc(big(v)) + '" alt="" loading="lazy" onerror="if(!this.dataset.f){this.dataset.f=1;this.src=\'' + esc(small(v)) + '\'}">';
      var ln = function (inner, cls) { return '<span class="ln' + (cls ? " " + cls : "") + '"><span>' + inner + "</span></span>"; };
      return '<article class="pslide" data-i="' + i + '">' +
        '<div class="pmeta">' +
          ln('<b class="pnum">' + pad(i + 1) + "</b>", "ln-num") +
          ln(esc(d.cliente || ""), "ln-cli label") +
          '<h3 class="ptitle">' + ln(esc(d.titulo)) + "</h3>" +
          ln("Aquí soy", "ln-lab label") +
          ln(esc(d.soy || ""), "ln-rol") +
          ln((d.roles || []).map(function (r) { return '<span class="chip">' + esc(r) + "</span>"; }).join(""), "ln-chips") +
          (d.cifra ? ln('<b class="pcifra">' + esc(d.cifra) + "</b> " + esc(d.cifraTexto || ""), "ln-cifra") : "") +
          ln('<a class="plink" href="' + esc(d.pagina) + '">Entrar a la escena →</a>', "ln-go") +
        "</div>" +
        '<a class="pframe hp-host" href="' + esc(d.pagina) + '" aria-label="' + esc(T("Ver") + " " + d.titulo) + '">' +
          '<span class="pframe-in">' + pic + "</span>" +
          '<span class="ptag"><b class="rec"></b>' + esc(T("Escena") + " " + pad(i + 1)) + "</span>" +
          '<span class="pyear">' + esc(d.anio || "") + "</span>" +
          '<i class="pc tl"></i><i class="pc tr"></i><i class="pc bl"></i><i class="pc br"></i>' +
        "</a>" +
      "</article>";
    }).join("");
    tl.innerHTML = '<div class="ptl-track">' + LIST.map(function (d, i) {
      return '<button type="button" class="ptl-clip" data-i="' + i + '"><span>' + esc(d.titulo.split(" · ")[0]) + "</span></button>";
    }).join("") + '<span class="ptl-head" aria-hidden="true"></span></div>';

    var slides = $$(".pslide", slidesEl), bgs = $$("img", bg), clips = $$(".ptl-clip", tl), head = $(".ptl-head", tl);
    var progPin = $("#prog-pin"), cur = -1;
    var setActive = function (i) {
      if (i === cur) return; cur = i;
      slides.forEach(function (s, j) {
        var on = j === i; s.classList.toggle("on", on); s.classList.toggle("past", j < i);
        $$("a", s).forEach(function (a) { a.tabIndex = on || reduce ? 0 : -1; });
        s.setAttribute("aria-hidden", on || reduce ? "false" : "true");
        var vid = $("video", s);
        if (vid) { if (on && !reduce && !(navigator.connection && navigator.connection.saveData)) { vid.preload = "auto"; var p = vid.play(); if (p && p.catch) p.catch(function () {}); } else vid.pause(); }
      });
      bgs.forEach(function (b, j) { b.classList.toggle("on", j === i); });
      clips.forEach(function (c, j) { c.classList.toggle("on", j === i); c.classList.toggle("done", j < i); });
      if (numEl) numEl.textContent = pad(i + 1);
    };
    if (reduce) {
      progPin.classList.add("static"); slides.forEach(function (s) { s.classList.add("on"); }); setActive(0);
    } else {
      var t2 = false;
      var upd2 = function () {
        t2 = false;
        var r = progPin.getBoundingClientRect(), span = progPin.offsetHeight - innerHeight;
        var p = span > 0 ? clamp(-r.top / span, 0, .9999) : 0;
        setActive(Math.floor(p * N));
        head.style.left = (p * 100).toFixed(2) + "%";
      };
      window.addEventListener("scroll", function () { if (!t2) { t2 = true; requestAnimationFrame(upd2); } }, { passive: true });
      window.addEventListener("resize", upd2); upd2();
      clips.forEach(function (c) {
        c.addEventListener("click", function () {
          var i = +c.dataset.i, span = progPin.offsetHeight - innerHeight;
          var y = progPin.getBoundingClientRect().top + window.scrollY + span * ((i + .5) / N);
          window.scrollTo({ top: y, behavior: "smooth" });
        });
      });
    }
  }

  /* ---------- 7 · Audiovisual: la sala de proyección ----------
     Las escenas en un arco de pantallas (referencia: Studio Mirage). La del
     centro va grande, con su título encima; las de los lados giran hacia
     adentro. Se avanza con los botones, las flechas del teclado, arrastrando
     o tocando una pantalla lateral. Los filtros por oficio dejan solo las
     escenas de ese oficio. La pantalla central corre su video si es local. */
  var esc0 = $("#escenas");
  if (page === "audiovisual" && esc0 && LIST.length) {
    var cards = $$(".scard", esc0);
    var sala = document.createElement("section");
    sala.className = "sala"; sala.setAttribute("aria-label", T("Escenas")); sala.setAttribute("aria-roledescription", "carrusel");
    var ROLE = function (d) { return (d.roles || []).map(function (r) { return T(r); }).join(" · "); };
    sala.innerHTML =
      '<div class="sala-stage">' +
      '<div class="sala-floor" aria-hidden="true"></div>' +
      LIST.map(function (d, i) {
        var v = (d.videos || [])[0] || {};
        var vid = v.tipo === "local" && !v.vertical ? '<video muted loop playsinline preload="none" src="' + esc(v.src) + '"></video>' : "";
        return '<a class="sala-scr" href="' + esc(d.pagina) + '" data-i="' + i + '" tabindex="-1" draggable="false"><img draggable="false" src="' + esc(d.sala || v.poster || "") + '" alt="" loading="' + (i < 3 ? "eager" : "lazy") + '">' + vid + '<span class="sala-shade" aria-hidden="true"></span></a>';
      }).join("") +
      LIST.map(function (d, i) {
        return '<div class="sala-tt" data-i="' + i + '" aria-hidden="true"><span class="sala-k">' + esc(T("Escena")) + " " + pad(i + 1) + " · " + esc(d.anio || "") + "</span><h2>" + esc(d.titulo) + "</h2><p>" + esc(T("Aquí soy")) + " " + esc(T(d.soy || "")) + ".</p></div>";
      }).join("") +
      "</div>" +
      '<div class="sala-top"><span class="label">' + esc(T("Capítulo 02 · Audiovisual")) + '</span><span class="sala-n" aria-hidden="true"><b id="sala-n">01</b> / <span id="sala-t">' + pad(LIST.length) + "</span></span></div>" +
      '<div class="sala-bot">' +
      '<button class="sala-nav prev" type="button"><small>← ' + esc(T("Anterior")) + '</small><b id="sala-pv"></b></button>' +
      '<div class="sala-mid"><p class="sala-meta" id="sala-meta"></p><a class="sala-go" id="sala-go" href="#">' + esc(T("Entrar a la escena")) + ' <i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 4v16l13-8z"/></svg></i></a></div>' +
      '<button class="sala-nav next" type="button"><small>' + esc(T("Siguiente")) + ' →</small><b id="sala-nx"></b></button>' +
      "</div>" +
      '<p class="sala-live" id="sala-live" aria-live="polite"></p>';
    var avSec = $("#audiovisual"); avSec.parentNode.insertBefore(sala, avSec); // a lo ancho, fuera del contenedor
    esc0.classList.add("sala-src"); // la grilla original queda oculta: la usan los filtros

    var scrs = $$(".sala-scr", sala), tts = $$(".sala-tt", sala), stageEl = $(".sala-stage", sala);
    var cur = 0, visible = LIST.map(function (_, i) { return i; });
    var nEl = $("#sala-n"), tEl = $("#sala-t"), pv = $("#sala-pv"), nx = $("#sala-nx"), meta = $("#sala-meta"), goEl = $("#sala-go"), live = $("#sala-live");
    var saveData = !!(navigator.connection && navigator.connection.saveData);
    var layout = function () {
      var w = scrs[0] ? scrs[0].offsetWidth : 800, n = visible.length, pos = visible.indexOf(cur);
      var step = w * (innerWidth <= 760 ? .9 : .78), depth = w * .42, turn = innerWidth <= 760 ? 18 : 34;
      scrs.forEach(function (el, i) {
        var k = visible.indexOf(i);
        if (k < 0) { el.classList.add("off"); el.style.transform = "translateZ(-2000px)"; return; }
        el.classList.remove("off");
        var d = k - pos; if (d > n / 2) d -= n; if (d < -n / 2) d += n;
        var a = Math.abs(d);
        el.style.transform = "translateX(" + (d * step).toFixed(1) + "px) translateZ(" + (-a * depth).toFixed(1) + "px) rotateY(" + (-d * turn) + "deg)";
        el.style.zIndex = 10 - a;
        el.classList.toggle("on", a === 0); el.classList.toggle("far", a > 2);
        el.setAttribute("aria-hidden", a === 0 ? "false" : "true");
        el.tabIndex = a === 0 ? 0 : -1;
        var v = $("video", el);
        if (v) { if (a === 0 && !reduce && !saveData) { v.preload = "auto"; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); el.classList.add("playing"); } else { v.pause(); el.classList.remove("playing"); } }
      });
      tts.forEach(function (t, i) { t.classList.toggle("on", i === cur); });
    };
    var go = function (i, quiet) {
      if (visible.indexOf(i) < 0) i = visible[0];
      cur = i;
      var d = LIST[i], n = visible.length, pos = visible.indexOf(i);
      var prev = LIST[visible[(pos - 1 + n) % n]], next = LIST[visible[(pos + 1) % n]];
      nEl.textContent = pad(pos + 1); tEl.textContent = pad(n);
      pv.textContent = prev.titulo; nx.textContent = next.titulo;
      meta.innerHTML = esc(ROLE(d)) + (d.cifra ? ' · <b>' + esc(d.cifra) + "</b> " + esc(T(d.cifraTexto || "")) : "");
      goEl.href = d.pagina;
      sala.classList.toggle("solo", n < 2);
      if (!quiet) live.textContent = T("Escena") + " " + pad(i + 1) + ": " + d.titulo;
      layout();
    };
    var step = function (dir) { var n = visible.length, pos = visible.indexOf(cur); go(visible[(pos + dir + n) % n]); };
    $(".sala-nav.prev", sala).addEventListener("click", function () { step(-1); });
    $(".sala-nav.next", sala).addEventListener("click", function () { step(1); });
    scrs.forEach(function (el, i) {
      el.addEventListener("click", function (e) { if (i !== cur) { e.preventDefault(); go(i); } });
    });
    // flechas del teclado mientras la sala está en pantalla
    var inView = false;
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { inView = es[0].isIntersecting; }, { threshold: .5 }).observe(sala); else inView = true;
    document.addEventListener("keydown", function (e) {
      if (!inView || e.metaKey || e.ctrlKey || e.altKey || /input|textarea|select/i.test((e.target.tagName || ""))) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    });
    // arrastrar con el mouse o el dedo
    var sx = null, moved = false;
    stageEl.addEventListener("pointerdown", function (e) { sx = e.clientX; moved = false; });
    stageEl.addEventListener("pointercancel", function () { sx = null; });
    stageEl.addEventListener("pointermove", function (e) { if (sx !== null && Math.abs(e.clientX - sx) > 12) moved = true; });
    stageEl.addEventListener("pointerup", function (e) { if (sx === null) return; var dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1); });
    stageEl.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    stageEl.addEventListener("dragstart", function (e) { e.preventDefault(); });
    // los filtros por oficio: solo las escenas de ese oficio
    var syncFilter = function () {
      var vis = []; cards.forEach(function (c, i) { if (!c.classList.contains("f-out")) vis.push(i); });
      visible = vis.length ? vis : LIST.map(function (_, i) { return i; });
      go(visible.indexOf(cur) >= 0 ? cur : visible[0], true);
    };
    var chipsEl = $("#fbar-chips");
    if (chipsEl) chipsEl.addEventListener("click", function () { [80, 450, 900].forEach(function (t) { setTimeout(syncFilter, t); }); });
    window.addEventListener("resize", layout);
    if (reduce) sala.classList.add("still");
    syncFilter();
  }

  /* ---------- 8 · Web: cada sitio en su ventana, con lo que hice y con qué ---------- */
  var websEl = $("#webs");
  if (page === "web" && websEl && D.web) {
    var GROUPS = [
      ["cero", "Hechas de cero", "Diseño y código míos, de principio a fin"],
      ["modificadas", "Páginas que sumé", "Sitios de otros: home, páginas y micrositios en WordPress + Elementor"]
    ];
    var host = function (u) { try { var x = new URL(u); return x.host.replace(/^www\./, "") + (x.pathname.length > 1 ? x.pathname.replace(/\/$/, "") : ""); } catch (e) { return u; } };
    var k = 0;
    websEl.innerHTML = GROUPS.map(function (g, gi) {
      var items = D.web.filter(function (w) { return w.grupo === g[0]; });
      if (!items.length) return "";
      return '<div class="wb-group"><header class="bhead reveal"><span class="kf"></span><h2>' + esc(T(g[1])) + '</h2><p class="label">' + esc(T(g[2])) + '</p><span class="tcode">' + pad(gi + 1) + "</span></header>" +
        items.map(function (w) {
          k++;
          var scr = w.img
            ? '<img src="' + esc(w.img) + '" alt="' + esc(T("Captura de") + " " + w.titulo) + '" loading="lazy">'
            : '<span class="wb-tile"><b>' + esc(w.titulo) + "</b><small>" + esc(T(w.tipo)) + "</small></span>";
          return '<article class="wb reveal">' +
            '<a class="wb-win" href="' + esc(w.url) + '" target="_blank" rel="noopener" aria-label="' + esc(T("Abrir") + " " + w.titulo + " " + T("en una pestaña nueva")) + '">' +
            '<span class="wb-bar" aria-hidden="true"><i></i><i></i><i></i><span class="wb-url">' + esc(host(w.url)) + '</span><span class="wb-go">' + esc(T("Abrir")) + ' ↗</span></span>' +
            '<span class="wb-scr">' + scr + "</span></a>" +
            '<div class="wb-meta"><p class="label"><span class="wb-n">' + pad(k) + "</span>" + esc(T(w.tipo)) + "</p><h3>" + esc(w.titulo) + "</h3>" +
            '<dl class="ficha"><div><dt>' + esc(T("Lo que hice")) + "</dt><dd>" + esc(T(w.hice)) + "</dd></div><div><dt>" + esc(T("Con qué")) + "</dt><dd>" + esc(T(w.con)) + "</dd></div>" +
            (w.anio ? "<div><dt>" + esc(T("Año")) + "</dt><dd>" + esc(w.anio) + "</dd></div>" : "") + "</dl>" +
            '<p class="wb-why">' + esc(T(w.funciona)) + "</p>" +
            '<a class="plink" href="' + esc(w.url) + '" target="_blank" rel="noopener">' + esc(T("Ver en vivo")) + " ↗</a></div></article>";
        }).join("") + "</div>";
    }).join("");
    var wr = $$(".reveal", websEl);
    if (reduce || !("IntersectionObserver" in window)) wr.forEach(function (r) { r.classList.add("in"); });
    else { var wio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); wio.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" }); wr.forEach(function (r) { wio.observe(r); }); }
  }

  /* ---------- 9 · La luz de set: una sola luz suave que sigue a la sección ----------
     Cada sección grande tiene su color (data-light="teal|sand|terra|petrol");
     si no lo declara, se alternan. La luz cambia de color y de lugar con calma. */
  (function () {
    var LIGHT = { teal: ["rgba(46,166,144,.22)", "rgba(42,81,89,.18)"], sand: ["rgba(242,197,114,.16)", "rgba(46,166,144,.1)"], terra: ["rgba(217,103,78,.18)", "rgba(242,152,99,.1)"], petrol: ["rgba(42,81,89,.32)", "rgba(46,166,144,.08)"] };
    var ORDER = ["teal", "sand", "petrol", "terra"];
    var POS = [["82%", "18%"], ["16%", "30%"], ["74%", "62%"], ["22%", "70%"]];
    var secs = $$("main > section, main > header, main > div, .sala, .cas, .remate, .nxt").filter(function (el) { return el.offsetHeight > 120; });
    if (!secs.length || !("IntersectionObserver" in window)) return;
    var apply = function (el) {
      var i = secs.indexOf(el), key = el.dataset.light || (el.matches(".cta,.remate,.tone-terra") ? "terra" : ORDER[i % ORDER.length]), c = LIGHT[key] || LIGHT.teal, p = POS[i % POS.length];
      var st = html.style; st.setProperty("--lc", c[0]); st.setProperty("--lc2", c[1]); st.setProperty("--lx", p[0]); st.setProperty("--ly", p[1]);
    };
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) apply(e.target); }); }, { rootMargin: "-45% 0px -45% 0px" });
    secs.forEach(function (el) { io.observe(el); });
    apply(secs[0]);
  })();
})();
