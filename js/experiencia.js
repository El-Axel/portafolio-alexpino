/* =============================================================================
   Experiencia de navegación: "una transmisión en vivo"
   (la identidad no cambia: mismos colores, tipos, vidrios e isotipo;
   cambia la forma de recorrer y mostrar las cosas)
   · Barra lateral de transmisión + menú a pantalla completa .... (todas)
   · Corte de edición al cambiar de página ........................ (todas)
   · Videos que se reproducen al pasar el mouse ................... (todas)
   · Presentación: «¿Quién soy?» se arma y se desarma ............ (inicio)
   · El programa: las 5 escenas pasan por un mismo cuadro ......... (inicio)
   · El reel: una columna de escenas con su ficha a los lados ..... (audiovisual)
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

  /* ---------- 7 · Audiovisual: el reel (columna central + ficha a los lados) ----------
     La palabra ESCENAS queda fija detrás. La escena que pasa por el centro
     de la pantalla se enciende (su video corre en silencio) y su ficha se
     escribe a los lados. Los filtros por oficio siguen funcionando. */
  var esc0 = $("#escenas");
  if (page === "audiovisual" && esc0) {
    var cards = $$(".scard", esc0);
    var reel = document.createElement("div");
    reel.className = "reelv";
    esc0.parentNode.insertBefore(reel, esc0);
    reel.innerHTML = '<p class="reel-word" aria-hidden="true">' + esc(T("Escenas")) + '</p>' +
      '<aside class="rv-side rv-l" aria-hidden="true"><span class="rv-n" id="rv-n">01</span><span class="rv-k" id="rv-k"></span><span class="rv-y" id="rv-y"></span></aside>';
    reel.appendChild(esc0);
    reel.insertAdjacentHTML("beforeend", '<aside class="rv-side rv-r" aria-hidden="true"><span class="label">' + esc(T("Aquí soy")) + '</span><b class="rv-soy" id="rv-soy"></b><span class="rv-roles" id="rv-roles"></span><span class="rv-c" id="rv-c"></span><span class="rv-go">' + esc(T("Entrar a la escena →")) + '</span></aside>');
    esc0.classList.add("reel-col");
    if (!reduce) html.classList.add("snap-reel"); // la escena se acomoda sola en el centro
    // miniaturas de YouTube en alta
    cards.forEach(function (c) {
      var im = $(".sc-media > img", c);
      if (im && /i\.ytimg\.com\/vi\/[^/]+\/hqdefault/.test(im.src)) {
        var hq = im.src; im.onerror = function () { im.onerror = null; im.src = hq; };
        im.src = hq.replace("hqdefault", "maxresdefault");
      }
    });
    var rvN = $("#rv-n"), rvK = $("#rv-k"), rvY = $("#rv-y"), rvSoy = $("#rv-soy"), rvRoles = $("#rv-roles"), rvC = $("#rv-c");
    var cur = -1, sides = $$(".rv-side", reel);
    var fill = function (i) {
      var d = LIST[i]; if (!d) return;
      rvN.textContent = pad(i + 1);
      rvK.textContent = T(d.cliente || "");
      rvY.textContent = d.anio || "";
      rvSoy.textContent = T(d.soy || "");
      rvRoles.innerHTML = (d.roles || []).map(function (r) { return '<span class="chip">' + esc(T(r)) + "</span>"; }).join("");
      rvC.innerHTML = d.cifra ? "<b>" + esc(d.cifra) + "</b> " + esc(T(d.cifraTexto || "")) : "";
    };
    var activate = function (i) {
      if (i === cur) return;
      cur = i;
      cards.forEach(function (c, j) {
        var on = j === i; c.classList.toggle("on", on);
        var v = $("video", c);
        if (v && !window.matchMedia("(hover: hover)").matches) return; // en celular main.js ya las enciende al verlas
        if (v) { if (on && !reduce && !(navigator.connection && navigator.connection.saveData)) { v.preload = "auto"; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); c.classList.add("playing"); } else { v.pause(); c.classList.remove("playing"); } }
      });
      if (i < 0) return;
      if (reduce) { fill(i); return; }
      sides.forEach(function (s) { s.classList.add("swap"); });
      setTimeout(function () { fill(i); sides.forEach(function (s) { s.classList.remove("swap"); }); }, 220);
    };
    var pick = function () {
      var mid = innerHeight / 2, best = -1, bd = 1e9;
      cards.forEach(function (c, j) {
        if (c.classList.contains("f-out") || !c.offsetParent) return;
        var r = c.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bd) { bd = d; best = j; }
      });
      var rr = esc0.getBoundingClientRect();
      reel.classList.toggle("live", rr.top < innerHeight * .45 && rr.bottom > innerHeight * .55);
      activate(best);
    };
    var tk = false;
    window.addEventListener("scroll", function () { if (!tk) { tk = true; requestAnimationFrame(function () { tk = false; pick(); }); } }, { passive: true });
    window.addEventListener("resize", pick);
    // los filtros cambian qué escenas hay: volver a mirar
    var chipsEl = $("#fbar-chips");
    if (chipsEl) chipsEl.addEventListener("click", function () { setTimeout(pick, 60); setTimeout(pick, 500); });
    fill(0); pick();
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
})();
