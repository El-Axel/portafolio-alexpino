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
  /* la cámara: una lista en la pantalla, la rueda elige, SET abre, MENU cierra */
  var links = menu ? $$(".mnu-list a", menu) : [], sel = 0, camRot = 0, recT = null;
  var wheel = $("#cam-wheel"), ring = $(".cam-ring", menu || document);
  function txt(a, s) { var x = $(s, a); return x ? x.textContent : ""; }
  function camSelect(i, focus) {
    if (!links.length) return;
    sel = (i + links.length) % links.length;
    links.forEach(function (a, k) { a.classList.toggle("cam-on", k === sel); });
    var a = links[sel];
    media(a.dataset.sec);
    $("#cam-n").textContent = txt(a, "em"); $("#cam-t").textContent = txt(a, "b"); $("#cam-s").textContent = txt(a, "small");
    $("#cam-pos").textContent = pad(sel + 1) + " / " + pad(links.length);
    if (focus) a.focus({ preventScroll: true });
  }
  function camStep(d) { camRot += d * 30; if (ring) ring.style.transform = "rotate(" + camRot + "deg)"; camSelect(sel + d, true); }
  function camGo() {
    if (!links.length || menu.classList.contains("is-rec")) return;
    var a = links[sel], same = false;
    try { same = new URL(a.href, location.href).pathname === location.pathname; } catch (er) {}
    if (same) { closeMenu(); return; }
    var m = $('.mnu-media > [data-for="' + a.dataset.sec + '"]', menu);
    $("#cam-ri").src = m ? (m.poster || m.currentSrc || m.src) : "";
    $("#cam-rn").textContent = $(".cam-pn", menu).textContent;
    $("#cam-rt").textContent = txt(a, "b");
    menu.classList.add("is-rec");
    recT = setTimeout(function () { a.click(); }, reduce ? 0 : 700);
  }
  var hideT;
  function openMenu() {
    if (!menu) return;
    clearTimeout(hideT); clearTimeout(recT); menu.classList.remove("is-rec");
    lastFocus = document.activeElement;
    menu.hidden = false; requestAnimationFrame(function () { menu.classList.add("open"); });
    html.classList.add("menu-open"); btn.setAttribute("aria-expanded", "true");
    var cur = links.indexOf($(".mnu-list a.on", menu));
    camSelect(cur < 0 ? 0 : cur, false);
    setTimeout(function () { if (links[sel]) links[sel].focus({ preventScroll: true }); }, 60);
  }
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.classList.remove("open"); html.classList.remove("menu-open"); btn.setAttribute("aria-expanded", "false");
    hideT = setTimeout(function () { menu.hidden = true; menu.classList.remove("is-rec"); media(""); }, reduce ? 0 : 420);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (menu && btn) {
    btn.addEventListener("click", function () { menu.hidden ? openMenu() : closeMenu(); });
    closeB.addEventListener("click", closeMenu);
    $("#cam-go").addEventListener("click", camGo);
    $("#cam-set").addEventListener("click", camGo);
    $$(".cam-k", menu).forEach(function (k) { k.addEventListener("click", function () { camStep(+k.dataset.step); }); });
    links.forEach(function (a, k) {
      a.addEventListener("mouseenter", function () { camSelect(k, false); });
      a.addEventListener("focus", function () { if (sel !== k) camSelect(k, false); });
    });
    // girar la rueda: arrastrando alrededor del centro o con la rueda del mouse
    var lastW = 0;
    $(".cam", menu).addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaY) < 4) return;
      e.preventDefault();
      var now = Date.now(); if (now - lastW < 200) return; lastW = now;
      camStep(e.deltaY > 0 ? 1 : -1);
    }, { passive: false });
    var drag = null;
    function ang(e) { var r = wheel.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; }
    wheel.addEventListener("pointerdown", function (e) {
      if (e.target.closest("button")) return;
      drag = { a: ang(e), acc: 0 }; wheel.setPointerCapture(e.pointerId); wheel.classList.add("grab");
    });
    wheel.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var a = ang(e), d = a - drag.a; if (d > 180) d -= 360; if (d < -180) d += 360;
      drag.a = a; drag.acc += d;
      if (Math.abs(drag.acc) >= 30) { camStep(drag.acc > 0 ? 1 : -1); drag.acc = 0; }
    });
    function endDrag() { drag = null; wheel.classList.remove("grab"); }
    wheel.addEventListener("pointerup", endDrag); wheel.addEventListener("pointercancel", endDrag);
    document.addEventListener("keydown", function (e) {
      if (menu.hidden) return;
      if (e.key === "Escape") { e.preventDefault(); closeMenu(); return; }
      if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); camStep(1); return; }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); camStep(-1); return; }
      if (e.key === "Tab") { // el foco no sale del menú
        var f = $$("a, button", menu).filter(function (x) { return x.offsetParent !== null && x.tabIndex >= 0; });
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
    var reset = function () {
      cut.classList.add("still"); cut.classList.remove("go", "leave");
      void cut.offsetWidth;
      requestAnimationFrame(function () { cut.classList.remove("still"); });
    };
    if (html.classList.contains("cutting")) {
      try { sessionStorage.removeItem("ap-cut"); } catch (e) {}
      cut.classList.add("go", "still");
      html.classList.remove("cutting");
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        cut.classList.remove("still"); cut.classList.add("leave");
        // al terminar, las franjas vuelven a su sitio SIN animación (antes cruzaban la pantalla otra vez)
        setTimeout(function () { reset(); }, 700);
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
    window.addEventListener("pageshow", function (e) { if (e.persisted) reset(); });
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
      // nombres propios: «tick»/«upd» ya existen más abajo en esta misma función y se pisaban
      var kTick = false;
      var kUpd = function () {
        kTick = false;
        var r = pin.getBoundingClientRect(), span = pin.offsetHeight - innerHeight;
        var k = span > 0 ? clamp(-r.top / span, 0, 1) : 0;
        hero.style.setProperty("--k", k.toFixed(4));
        hero.classList.toggle("kin-moving", k > .02);
      };
      window.addEventListener("scroll", function () { if (!kTick) { kTick = true; requestAnimationFrame(kUpd); } }, { passive: true });
      window.addEventListener("resize", kUpd); kUpd();
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
          ln('<a class="plink" href="audiovisual.html?e=' + (i + 1) + '">' + esc(T("Verla en la sala")) + ' →</a>', "ln-go") +
        "</div>" +
        '<a class="pframe hp-host" href="audiovisual.html?e=' + (i + 1) + '" aria-label="' + esc(T("Ver") + " " + d.titulo + " " + T("en la sala de proyección")) + '">' +
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
      if (!inView || html.classList.contains("menu-open") || e.metaKey || e.ctrlKey || e.altKey || /input|textarea|select/i.test((e.target.tagName || ""))) return;
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
    try { var eq = parseInt(new URLSearchParams(location.search).get("e"), 10); if (eq >= 1 && eq <= LIST.length) cur = eq - 1; } catch (e) {}
    syncFilter();
    if (cur > 0) setTimeout(function () { sala.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); }, 400);
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

  /* ---------- 10 · Recorrido lineal ----------
     La portada es un tráiler por capítulos (cada uno lleva a su página) y
     cada página termina con «Siguiente capítulo». Así el visitante sigue un
     orden: Inicio → Sobre mí → Audiovisual → Gráfico → Editorial → Web → Contacto. */
  var CHAPS = [
    ["index.html", "inicio", "00", "Inicio", "¿Quién soy?"],
    ["sobre-mi.html", "sobre-mi", "01", "Sobre mí", "El origen"],
    ["audiovisual.html", "audiovisual", "02", "Audiovisual", "Seis escenas"],
    ["grafico.html", "grafico", "03", "Gráfico", "Impresos que se tocan"],
    ["editorial.html", "editorial", "04", "Editorial", "Publicaciones para hojear"],
    ["web.html", "web", "05", "Web", "Sitios que se navegan"],
    ["contacto.html", "contacto", "06", "Contacto", "Próxima escena"]
  ];
  var chIdx = -1; CHAPS.forEach(function (c, i) { if (c[1] === page) chIdx = i; });
  var mainEl = $("main");
  if (chIdx >= 1 && chIdx < CHAPS.length - 1 && mainEl) {
    var nx2 = CHAPS[chIdx + 1];
    var old = $(".cta", mainEl); if (old && page === "sobre-mi") old.remove(); // el cierre propio se reemplaza por el capítulo siguiente
    mainEl.insertAdjacentHTML("beforeend",
      '<nav class="nextch wrap" aria-label="' + esc(T("Siguiente capítulo")) + '"><a href="' + nx2[0] + '">' +
      '<span class="label"><b class="rec"></b>' + esc(T("Siguiente capítulo")) + '</span>' +
      '<span class="nc-row"><em>' + nx2[2] + '</em><b>' + esc(T(nx2[3])) + '</b><i aria-hidden="true">→</i></span>' +
      '<small>' + esc(T(nx2[4])) + "</small></a>" +
      '<a class="nc-back" href="' + CHAPS[chIdx - 1][0] + '">← ' + esc(T("Capítulo anterior")) + ": " + esc(T(CHAPS[chIdx - 1][3])) + "</a></nav>");
  }

  // los adelantos de la portada (gráfico, editorial, web), armados con data.js
  var gEl = $("#gfx"), wtEl = $("#wtrav");
  // capítulo 03 · diseño gráfico «uno a uno»: una pieza grande a la vez; con el scroll se aparta como una hoja y entra la siguiente
  if (gEl && D.grafico) {
    var G = D.grafico.slice(0, 5), gBox = $("#gfx-box"), gInfo = $("#gfx-info"), gTh = $("#gfx-th");
    var gSrc = function (g) { return g.portada || (g.paginas || [])[0] || (g.imagenes || [])[0] || ""; };
    var gPieces = G.map(function (g, i) {
      var el = document.createElement("a"); el.className = "gp" + (i ? " in" : ""); el.href = "grafico.html";
      el.innerHTML = '<img src="' + esc(gSrc(g)) + '" alt="' + esc(g.titulo) + '" loading="lazy">';
      var im = el.firstChild, setW = function () { if (im.naturalWidth) el.style.setProperty("--ar", (im.naturalWidth / im.naturalHeight).toFixed(4)); };
      if (im.complete) setW(); else im.addEventListener("load", setW);
      gBox.appendChild(el); return el;
    });
    gTh.innerHTML = G.map(function (g) { return '<button type="button" style="background-image:url(\'' + esc(gSrc(g)) + '\')" aria-label="' + esc(g.titulo) + '"></button>'; }).join("");
    var gThumbs = $$("button", gTh), gCur = -1, gT = 0;
    var gSet = function (i) {
      if (i === gCur) return; gCur = i;
      gPieces.forEach(function (el, k) { el.classList.toggle("out", k < i); el.classList.toggle("in", k > i); el.style.transform = ""; el.tabIndex = k === i ? 0 : -1; });
      gThumbs.forEach(function (b, k) { b.classList.toggle("on", k === i); b.setAttribute("aria-current", k === i ? "true" : "false"); });
      gInfo.classList.add("swap"); clearTimeout(gT);
      gT = setTimeout(function () {
        var g = G[i];
        $(".gi-ct", gInfo).textContent = pad(i + 1) + " / " + pad(G.length); $(".gi-k", gInfo).textContent = T(g.tipo);
        $(".gi-t", gInfo).textContent = g.titulo; $(".gi-p", gInfo).textContent = T(g.texto || ""); gInfo.classList.remove("swap");
      }, reduce ? 0 : 260);
    };
    gSet(0);
    if (reduce) { gEl.classList.add("static"); gThumbs.forEach(function (b, k) { b.addEventListener("click", function () { gSet(k); }); }); }
    else {
      var gTick = false;
      var gUpd = function () { gTick = false; var r = gEl.getBoundingClientRect(), span = gEl.offsetHeight - innerHeight, p = span > 0 ? clamp(-r.top / span, 0, 1) : 0; gSet(Math.min(G.length - 1, Math.floor(p * G.length * .999))); };
      window.addEventListener("scroll", function () { if (!gTick) { gTick = true; requestAnimationFrame(gUpd); } }, { passive: true });
      window.addEventListener("resize", gUpd); gUpd();
      // las miniaturas llevan a su pieza
      gThumbs.forEach(function (b, k) { b.addEventListener("click", function () { var span = gEl.offsetHeight - innerHeight; window.scrollTo({ top: gEl.getBoundingClientRect().top + scrollY + span * (k + .5) / G.length, behavior: "smooth" }); }); });
      // la pieza se inclina con el mouse, como si la tuvieras en la mano
      gBox.addEventListener("pointermove", function (e) { if (e.pointerType !== "mouse") return; var r = gBox.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5, el = gPieces[gCur]; if (el) el.style.transform = "rotateY(" + (x * 14).toFixed(2) + "deg) rotateX(" + (-y * 10).toFixed(2) + "deg)"; });
      gBox.addEventListener("pointerleave", function () { var el = gPieces[gCur]; if (el) el.style.transform = ""; });
    }
  }
  // capítulo 04 · editorial «la mesa de revisión»: las publicaciones abiertas sobre una tabla de corte;
  // el scroll recorre la mesa y el cursor es un cuentahílos que agranda la página (copia de la mesa escalada dentro del lente)
  var mrEl = $("#mesar");
  if (mrEl && D.editorial) {
    var mrSt = $("#mr-st"), mrMat = $("#mr-mat"), mrLp = $("#mr-lp"), mrZin = $(".mr-zin", mrLp), mrRet = $(".mr-ret", mrLp);
    var mrZ = 2.6, mrW = 0, mrH = 0, mrL = 0, mrX = null, mrY = null, mrAuto = true, mrPX = 0, mrPY = 0;
    // páginas en orden; las dobles (una imagen = dos páginas) se parten en mitad izquierda y derecha
    var mrPubs = D.editorial.slice(0, 4).map(function (b) {
      var pg = b.paginas || [], dob = b.dobles || [], out = [{ u: b.portada || pg[0], h: "" }];
      for (var k = 1; k < pg.length; k++) { if (dob.indexOf(k) > -1) { out.push({ u: pg[k], h: "l" }); out.push({ u: pg[k], h: "r" }); } else out.push({ u: pg[k], h: "" }); }
      var ar = b.ar ? String(b.ar).split("/") : [3, 4];
      return { b: b, pg: out, ar: (+ar[0]) / (+ar[1] || 1) };
    });
    // dónde cae cada publicación (fracción de la mesa), qué doble muestra abierta y cuánto está girada
    var MR_LAY = [{ x: .04, y: .08, w: .44, r: -4, i: 5 }, { x: .5, y: .12, w: .44, r: 3.5, i: 1 }, { x: .06, y: .5, w: .44, r: 2.5, i: 5 }, { x: .53, y: .56, w: .4, r: -3, i: 9 }];
    var mrBg = function (o) { return "background-image:url('" + esc(o.u) + "');background-size:" + (o.h ? "200% 100%" : "cover") + ";background-position:" + (o.h === "l" ? "0 0" : o.h === "r" ? "100% 0" : "center"); };
    var mrBuild = function () {
      var sw = mrSt.clientWidth, sh = mrSt.clientHeight;
      // celular: la mesa más angosta y menos alta para que las publicaciones no queden sueltas
      if (sw < 700) { mrW = sw * 1.9; mrH = Math.max(sh * 1.15, mrW * 1.25); } else { mrW = Math.max(sw * 1.08, 760); mrH = Math.max(sh * 1.55, mrW * .78); }
      var cm = Math.max(mrW / 48, 14), h = "";
      mrMat.style.width = mrW + "px"; mrMat.style.height = mrH + "px";
      mrMat.style.setProperty("--cm", cm + "px"); mrMat.style.setProperty("--cm10", cm * 5 + "px");
      // regla de la tabla de corte cada 5 cm y su diagonal de 45°
      for (var x = 1; x * cm * 5 < mrW; x++) h += '<span class="ru" style="left:' + (x * cm * 5 + 3) + 'px;top:4px">' + x * 5 + "</span>";
      for (var y = 1; y * cm * 5 < mrH; y++) h += '<span class="ru" style="top:' + (y * cm * 5 + 3) + 'px;left:4px">' + y * 5 + "</span>";
      h += '<i class="dg" style="width:' + Math.hypot(mrW, mrH) + "px;transform:rotate(" + Math.atan2(mrH, mrW) + 'rad)"></i>';
      MR_LAY.forEach(function (o, k) {
        var P = mrPubs[k]; if (!P) return;
        var w = mrW * o.w, hh = w / (2 * P.ar), x0 = mrW * o.x, y0 = mrH * o.y, a = P.pg[o.i] || P.pg[1], b = P.pg[o.i + 1] || null;
        h += '<span class="mr-cv" style="left:' + (x0 + w * .62) + "px;top:" + (y0 - hh * .1) + "px;width:" + w / 2 + "px;height:" + hh + "px;transform:rotate(" + (o.r + 7) + "deg);" + mrBg(P.pg[0]) + '"></span>';
        h += '<a class="mr-it" href="editorial.html" aria-label="' + esc(P.b.titulo) + '" style="left:' + x0 + "px;top:" + y0 + "px;width:" + w + "px;height:" + hh + "px;transform:rotate(" + o.r + 'deg)"><span style="' + mrBg(a) + '"></span><span style="' + (b ? mrBg(b) : "") + '"></span></a>';
        h += '<span class="mr-tag" style="left:' + (x0 + w * .04) + "px;top:" + (y0 + hh + 10) + "px;transform:rotate(" + o.r * .6 + 'deg)">' + esc(P.b.titulo) + "<small>" + esc(P.b.tipo) + "</small></span>";
      });
      mrMat.innerHTML = h;
      // la copia que se ve dentro del lente
      mrZin.innerHTML = ""; var cl = mrMat.cloneNode(true); cl.removeAttribute("id");
      $$("a", cl).forEach(function (a) { a.tabIndex = -1; a.removeAttribute("aria-label"); });
      mrZin.appendChild(cl); mrZin.style.transform = "scale(" + mrZ + ")";
      mrL = Math.min(240, Math.max(140, sw * .2)); mrLp.style.setProperty("--L", mrL + "px");
      var n = mrL / 2, r = '<i style="left:50%;top:18%;width:1px;height:64%"></i><i style="top:50%;left:18%;height:1px;width:64%"></i>';
      for (var t = -6; t <= 6; t++) { var tl = t % 5 === 0 ? 10 : 5; r += '<i style="left:' + (n + t * mrL * .05) + "px;top:" + (n - tl) + 'px;width:1px;height:' + tl + 'px"></i>'; }
      mrRet.innerHTML = r;
    };
    var mrPlace = function () {
      if (mrAuto) { var o = MR_LAY[1]; mrX = mrW * (o.x + o.w * .3) + mrPX; mrY = mrH * (o.y + .12) + mrPY; } // en reposo, sobre Voces Libres
      mrLp.style.transform = "translate(" + (mrX - mrL / 2) + "px," + (mrY - mrL / 2) + "px)";
      var cl = mrZin.firstChild; if (cl) cl.style.transform = "translate(" + (mrL / 2 / mrZ - (mrX - mrPX)) + "px," + (mrL / 2 / mrZ - (mrY - mrPY)) + "px)";
    };
    var mrTick = false;
    var mrUpd = function () {
      mrTick = false;
      var p = .4;
      if (!reduce) { var r = mrEl.getBoundingClientRect(), span = mrEl.offsetHeight - innerHeight; p = span > 0 ? clamp(-r.top / span, 0, 1) : 0; }
      mrPX = -(mrW - mrSt.clientWidth) * p; mrPY = -(mrH - mrSt.clientHeight) * p;
      mrMat.style.transform = "translate(" + mrPX + "px," + mrPY + "px)";
      mrPlace();
    };
    var mrPoint = function (e) { var r = mrSt.getBoundingClientRect(); mrAuto = false; mrX = e.clientX - r.left; mrY = e.clientY - r.top; mrPlace(); };
    mrSt.addEventListener("pointermove", function (e) { if (e.pointerType === "mouse") mrPoint(e); });
    mrSt.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") mrPoint(e); });
    if (reduce) mrEl.classList.add("static");
    else window.addEventListener("scroll", function () { if (!mrTick) { mrTick = true; requestAnimationFrame(mrUpd); } }, { passive: true });
    window.addEventListener("resize", function () { mrBuild(); mrUpd(); });
    mrBuild(); mrUpd();
  }
  // capítulo 05 · travelling: la sección se fija y las ventanas pasan de derecha a izquierda;
  // la del centro se endereza y su captura baja sola, como si alguien la navegara
  if (wtEl && D.web) {
    var W = D.web, rail = $("#wt-rail"), wcap = $("#wt-cap");
    var whost = function (u) { try { var x = new URL(u); return x.host.replace(/^www\./, "") + (x.pathname.length > 1 ? x.pathname.replace(/\/$/, "") : ""); } catch (e) { return u; } };
    rail.innerHTML = W.map(function (w, i) {
      var src = w.larga || w.img;
      var body = src ? '<img src="' + esc(src) + '" alt="' + esc(T("Captura de") + " " + w.titulo) + '" loading="lazy">'
        : '<span class="wt-tile"><b>' + esc(w.titulo) + "</b><small>" + esc(T(w.tipo)) + "</small></span>";
      return '<a class="wt-win" href="web.html" style="--i:' + i + '"><span class="wb-bar" aria-hidden="true"><i></i><i></i><i></i><span class="wb-url">' + esc(whost(w.url)) + '</span></span><span class="wt-view">' + body + "</span></a>";
    }).join("");
    var wins = $$(".wt-win", rail), wNear = -1;
    var wtCap = function (i) {
      var w = W[i]; if (!w) return;
      wcap.innerHTML = '<span class="wt-n">' + pad(i + 1) + " / " + pad(W.length) + '</span><b>' + esc(w.titulo) + "</b><span>" + esc(T(w.tipo)) + '</span><em class="wt-chip' + (w.grupo === "cero" ? "" : " wp") + '">' + esc(T(w.grupo === "cero" ? "Hechas de cero" : "Páginas que sumé")) + "</em>";
    };
    var wtSet = function (p) {
      var c = p * (W.length - 1), near = Math.round(c);
      var span = wins[0] ? wins[0].offsetWidth * 1.08 : 400;
      wins.forEach(function (el, k) {
        var d = k - c, ad = Math.abs(d);
        el.style.transform = "translate(-50%,-50%) translate3d(" + (d * span).toFixed(1) + "px,0," + (-ad * 170).toFixed(1) + "px) rotateY(" + Math.max(-50, Math.min(50, -d * 34)).toFixed(2) + "deg)";
        el.style.opacity = Math.max(0, 1 - ad * .34).toFixed(3);
        el.style.zIndex = 100 - Math.round(ad * 10);
        el.style.setProperty("--sy", clamp(.5 - d * .85, 0, 1).toFixed(3)); // entra arriba, baja mientras cruza
        el.classList.toggle("on", k === near);
      });
      if (near !== wNear) { wNear = near; wtCap(near); }
    };
    if (reduce) { wtEl.classList.add("static"); wtCap(0); }
    else {
      var wtTick = false;
      var wtUpd = function () {
        wtTick = false;
        var r = wtEl.getBoundingClientRect(), span = wtEl.offsetHeight - innerHeight;
        wtSet(span > 0 ? clamp(-r.top / span, 0, 1) : 0);
      };
      window.addEventListener("scroll", function () { if (!wtTick) { wtTick = true; requestAnimationFrame(wtUpd); } }, { passive: true });
      window.addEventListener("resize", wtUpd); wtUpd();
    }
  }

  // --p de 0 a 1 mientras el elemento cruza la pantalla (los adelantos se arman con el scroll)
  var scrubs = $$("[data-scrub]"), words = $$("[data-words]");
  // la frase del capítulo 01: cada palabra se «enciende» al bajar
  words.forEach(function (h) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          T(n.textContent).split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
            var sp = document.createElement("span"); sp.className = "wd"; sp.textContent = w; frag.appendChild(sp);
          });
          n.parentNode.replaceChild(frag, n);
        }
      });
    };
    walk(h);
    h.setAttribute("aria-label", h.textContent.replace(/\s+/g, " ").trim());
  });
  if (reduce) { scrubs.forEach(function (el) { el.style.setProperty("--p", 1); }); words.forEach(function (h) { $$(".wd, .pill", h).forEach(function (w) { w.classList.add("on"); }); }); }
  else if (scrubs.length || words.length) {
    var tick = false;
    var upd = function () {
      tick = false; var vh = innerHeight;
      scrubs.forEach(function (el) {
        var r = el.getBoundingClientRect(), p = clamp((vh - r.top) / (vh * .55 + r.height * .5), 0, 1);
        el.style.setProperty("--p", p.toFixed(3));
      });
      words.forEach(function (h) {
        var r = h.getBoundingClientRect(), p = clamp((vh * .85 - r.top) / (r.height + vh * .35), 0, 1);
        var ws = $$(".wd, .pill", h), n = Math.round(p * ws.length);
        ws.forEach(function (w, i) { w.classList.toggle("on", i < n); });
      });
    };
    window.addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    window.addEventListener("resize", upd); upd();
  }

  // en la portada, la barra lateral dice en qué capítulo vas
  if (page === "inicio" && scene && "IntersectionObserver" in window) {
    var chs = $$("[data-chap]");
    var baseLabel = scene.textContent;
    var cio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) scene.textContent = T(e.target.dataset.chap); }); }, { rootMargin: "-45% 0px -45% 0px" });
    chs.forEach(function (c) { cio.observe(c); });
    var top = new IntersectionObserver(function (es) { if (es[0].isIntersecting) scene.textContent = baseLabel; }, { rootMargin: "-45% 0px -45% 0px" });
    var hp = $("#hero-pin"); if (hp) top.observe(hp);
  }
})();
