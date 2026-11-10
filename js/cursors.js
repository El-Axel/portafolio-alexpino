/* ==========================================================================
   Cursores colaborativos
   Idea: como en un archivo compartido de diseño, aparecen cursores con el
   nombre de un oficio (Diseño, Edición, Color, Cámara…) y "terminan" partes
   del sitio: dibujan la caja del título, acomodan un clip en la línea de
   tiempo, ponen los títulos en su lugar, encuadran la foto, giran el hablador.
   Todos los cursores son Alex: cada uno es un rol distinto.

   - Cada escena corre una sola vez, cuando su parte entra en pantalla.
   - Con "reducir movimiento" no corre nada y el sitio se ve terminado.
   - Para apagarlo todo: borra la línea <script src="js/cursors.js"> del index.
   ========================================================================== */
(function () {
  "use strict";

  var APP = window.APP || {};
  var layer = document.getElementById("cursors");
  if (!layer || APP.reduce || !("IntersectionObserver" in window) || !window.requestAnimationFrame) return;

  var root = document.documentElement;
  root.classList.add("cur-on");
  var desktop = window.matchMedia("(min-width: 901px)").matches;

  /* ---------- oficios (nombre y color de cada cursor) ---------- */
  var ROLE = {
    diseno:  { name: "Diseño",  color: "#F2C572" },
    edicion: { name: "Edición", color: "#2EA690" },
    color:   { name: "Color",   color: "#F29863" },
    motion:  { name: "Motion",  color: "#D9674E", light: true },
    camara:  { name: "Cámara",  color: "#5AA3AE" },
    editorial: { name: "Editorial", color: "#2A5159", light: true },
    alex:    { name: "Alex",    color: "#F2C572" }
  };

  /* ---------- utilidades ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var wait = function (ms) { return new Promise(function (res) { setTimeout(res, ms); }); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var visible = function (el) { if (!el) return false; var r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  // punto de un elemento en coordenadas de página (ax, ay de 0 a 1)
  function pt(el, ax, ay) {
    var r = el.getBoundingClientRect();
    return { x: r.left + window.scrollX + r.width * (ax == null ? .5 : ax), y: r.top + window.scrollY + r.height * (ay == null ? .5 : ay) };
  }
  // corre fn una sola vez cuando el elemento se ve lo suficiente
  function once(el, fn, threshold) {
    if (!el) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); fn(e.target); } });
    }, { threshold: threshold || .55 });
    io.observe(el);
  }
  var fmt = new Intl.NumberFormat("es-CO");

  /* ---------- el cursor ---------- */
  var ARROW = '<svg viewBox="0 0 24 24"><path d="M3.5 2.5 L3.5 19.5 L8.3 15.2 L11.6 22 L14.6 20.6 L11.4 13.9 L17.8 13.6 Z" stroke-linejoin="round"/></svg>';

  function Cursor(role) {
    var r = ROLE[role] || ROLE.alex;
    this.el = document.createElement("div");
    this.el.className = "cur";
    this.el.style.setProperty("--c", r.color);
    this.el.innerHTML = '<span class="ring"></span>' + ARROW + '<span class="tag' + (r.light ? " dark" : "") + '">' + r.name + "</span>";
    this.tag = this.el.querySelector(".tag");
    layer.appendChild(this.el);
    this.x = 0; this.y = 0;
  }
  Cursor.prototype.place = function (p) {
    p = { x: Math.min(p.x, window.scrollX + document.documentElement.clientWidth - 24), y: p.y };
    this.x = p.x; this.y = p.y;
    this.el.style.transform = "translate3d(" + p.x.toFixed(1) + "px," + p.y.toFixed(1) + "px,0)";
    return this;
  };
  Cursor.prototype.show = function () { var s = this; requestAnimationFrame(function () { s.el.classList.add("show"); }); return wait(260); };
  Cursor.prototype.hide = function () { var s = this; s.el.classList.remove("show"); return wait(380).then(function () { s.el.remove(); }); };
  Cursor.prototype.say = function (t) { this.tag.textContent = t; return this; };
  Cursor.prototype.tint = function (c) { this.el.style.setProperty("--c", c); return this; };
  Cursor.prototype.down = function () { this.el.classList.add("down"); return wait(110); };
  Cursor.prototype.up = function () { this.el.classList.remove("down"); return wait(90); };
  Cursor.prototype.click = function () {
    var s = this;
    s.el.classList.remove("click"); void s.el.offsetWidth; s.el.classList.add("click");
    return s.down().then(function () { return s.up(); });
  };
  // movimiento con curva y aceleración; "to" puede ser una función (se recalcula en cada cuadro)
  Cursor.prototype.move = function (to, opts) {
    opts = opts || {};
    var s = this, from = { x: s.x, y: s.y };
    var target = typeof to === "function" ? to : function () { return to; };
    var end0 = target();
    var dist = Math.hypot(end0.x - from.x, end0.y - from.y);
    var dur = opts.dur || clamp(380 + dist * .55, 420, 1150);
    var bend = (opts.bend == null ? (Math.random() < .5 ? -1 : 1) * .16 : opts.bend);
    return new Promise(function (res) {
      var t0 = performance.now();
      (function frame(now) {
        var t = clamp((now - t0) / dur, 0, 1), k = ease(t);
        var end = target();
        var mx = (from.x + end.x) / 2 - (end.y - from.y) * bend, my = (from.y + end.y) / 2 + (end.x - from.x) * bend;
        var x = (1 - k) * (1 - k) * from.x + 2 * (1 - k) * k * mx + k * k * end.x;
        var y = (1 - k) * (1 - k) * from.y + 2 * (1 - k) * k * my + k * k * end.y;
        s.place({ x: x, y: y });
        if (opts.onStep) opts.onStep(k);
        if (t < 1) requestAnimationFrame(frame); else res();
      })(t0);
    });
  };
  // aparece cerca del objetivo, desde una dirección
  function spawn(role, near, dx, dy) {
    var c = new Cursor(role);
    var x = near.x + (dx == null ? 160 : dx);
    c.place({ x: clamp(x, window.scrollX + 8, window.scrollX + document.documentElement.clientWidth - 110), y: near.y + (dy == null ? 90 : dy) });
    return c;
  }

  /* ---------- marco de selección que se dibuja ---------- */
  function drawBox(color) {
    var b = document.createElement("div");
    b.className = "cur-box"; b.style.setProperty("--c", color);
    layer.appendChild(b);
    return {
      set: function (a, z) {
        var x = Math.min(a.x, z.x), y = Math.min(a.y, z.y), w = Math.abs(z.x - a.x), h = Math.abs(z.y - a.y);
        b.style.cssText += ";left:" + x + "px;top:" + y + "px;width:" + w + "px;height:" + h + "px";
        b.dataset.size = Math.round(w) + " × " + Math.round(h);
      },
      remove: function () { b.style.transition = "opacity .35s"; b.style.opacity = "0"; return wait(360).then(function () { b.remove(); }); }
    };
  }

  /* ======================================================================
     ESCENAS
     ====================================================================== */

  /* 1 · Portada: Diseño dibuja la caja del título y subraya "proyecto";
         Edición acomoda un clip en la línea de tiempo y enciende una capa. */
  var heroSel = $('[data-cur="hero-sel"]'), heroUw = $('[data-cur="hero-uw"] path'), heroClip = $('[data-cur="hero-clip"]');
  var CLIP_OFF = { x: 34, y: -24 };
  if (heroClip && visible(heroClip)) heroClip.style.transform = "translate(" + CLIP_OFF.x + "px," + CLIP_OFF.y + "px) rotate(-3deg)";
  if (heroUw) heroUw.style.strokeDashoffset = "240";

  function sceneHeroDesign() {
    if (!heroSel) return Promise.resolve();
    var a = pt(heroSel, 0, 0);
    var c = spawn("diseno", a, -120, 150);
    return c.show()
      .then(function () { return c.move(function () { return pt(heroSel, 0, 0); }); })
      .then(function () { return c.down(); })
      .then(function () {
        return c.move(function () { return pt(heroSel, 1, 1); }, {
          dur: 900, bend: .05,
          onStep: function (k) { heroSel.style.clipPath = "inset(0 " + ((1 - k) * 100).toFixed(1) + "% " + ((1 - k) * 100).toFixed(1) + "% 0)"; }
        });
      })
      .then(function () { heroSel.style.clipPath = "inset(-20px)"; heroSel.classList.add("done"); return c.up(); })
      .then(function () { return wait(250); })
      .then(function () { return heroUw ? c.move(function () { return pt(heroUw.closest(".uw"), 0, 1.05); }) : null; })
      .then(function () { return heroUw ? c.down() : null; })
      .then(function () {
        if (!heroUw) return;
        return c.move(function () { return pt(heroUw.closest(".uw"), 1, 1.05); }, {
          dur: 650, bend: -.04,
          onStep: function (k) { heroUw.style.strokeDashoffset = (240 * (1 - k)).toFixed(1); }
        });
      })
      .then(function () { return c.up(); })
      .then(function () { return c.move({ x: c.x + 140, y: c.y + 110 }, { dur: 700 }); })
      .then(function () { return c.hide(); });
  }

  function sceneHeroEdit() {
    if (!heroClip || !visible(heroClip)) return Promise.resolve();
    var start = pt(heroClip);
    var c = spawn("edicion", start, 180, -60);
    var layer2 = $('#lp li[data-f="camara"]');
    return wait(900).then(function () { return c.show(); })
      .then(function () { return c.move(function () { return pt(heroClip, .45, .5); }); })
      .then(function () { return c.down(); })
      .then(function () {
        var from = pt(heroClip, .45, .5);
        var to = { x: from.x - CLIP_OFF.x, y: from.y - CLIP_OFF.y };
        return c.move(to, {
          dur: 620, bend: .02,
          onStep: function (k) {
            heroClip.style.transform = "translate(" + (CLIP_OFF.x * (1 - k)).toFixed(1) + "px," + (CLIP_OFF.y * (1 - k)).toFixed(1) + "px) rotate(" + (-3 * (1 - k)).toFixed(2) + "deg)";
          }
        });
      })
      .then(function () { heroClip.style.transform = ""; heroClip.classList.add("snap"); return c.up(); })
      .then(function () {
        if (!layer2 || !visible(layer2)) return;
        c.say("Toca una capa").tint(ROLE.camara.color);
        return c.move(function () { return pt(layer2, .3, .5); }).then(function () { return c.click(); })
          .then(function () { layer2.classList.add("on"); return wait(1100); });
      })
      .then(function () { return c.move({ x: c.x + 120, y: c.y + 140 }, { dur: 650 }); })
      .then(function () { return c.hide(); });
  }

  /* 1b · Cámara: abre el diafragma para enseñar que los controles se pueden tocar. */
  function sceneLens() {
    var lv = $('#lens .lv[data-k="f"]');
    if (!lv || !visible(lv) || !APP.lens || window.scrollY > innerHeight * .5 || $("#lens").classList.contains("used")) return;
    var c = spawn("camara", pt(lv), 90, -120);
    return c.show()
      .then(function () { return c.move(function () { return pt(lv, .6, .55); }); })
      .then(function () { c.say("Abre el diafragma"); return c.down(); })
      .then(function () {
        var from = pt(lv, .6, .55);
        return c.move({ x: from.x - 40, y: from.y }, { dur: 900, bend: 0, onStep: function (k) { APP.lens.set("f", k < .5 ? 1 : 0); } });
      })
      .then(function () { return c.up(); })
      .then(function () { c.say("Ahora juega tú"); return wait(1600); })
      .then(function () { APP.lens.set("f", 2); $("#lens").classList.remove("used"); return c.move({ x: c.x + 80, y: c.y + 110 }, { dur: 600 }); })
      .then(function () { return c.hide(); });
  }

  /* 2 · Cifras: Motion hace clic en cada número y lo anima desde cero. */
  function countUp(el, to, format, ms) {
    return new Promise(function (res) {
      var t0 = performance.now();
      (function f(now) {
        var k = ease(clamp((now - t0) / ms, 0, 1)), v = Math.round(to * k);
        el.textContent = format === "pct" ? "+" + v + " %" : fmt.format(v);
        if (k < 1) requestAnimationFrame(f); else res();
      })(t0);
    });
  }
  var counters = $$(".stats [data-count]");
  counters.forEach(function (el) { el.textContent = el.dataset.fmt === "pct" ? "+0 %" : "0"; });
  function sceneStats() {
    if (!counters.length) return;
    var c = spawn("motion", pt(counters[0], 0, 1), -60, 120);
    var chain = c.show();
    counters.forEach(function (el) {
      chain = chain
        .then(function () { return c.move(function () { return pt(el, .6, .7); }); })
        .then(function () { return c.click(); })
        .then(function () { countUp(el, +el.dataset.count, el.dataset.fmt, 1100); return wait(500); });
    });
    return chain.then(function () { return wait(700); })
      .then(function () { return c.move({ x: c.x + 100, y: c.y + 120 }, { dur: 600 }); })
      .then(function () { return c.hide(); });
  }

  /* 3 · Encabezados: un cursor arrastra el título a su lugar y pone el keyframe. */
  var heads = $$(".bhead");
  heads.forEach(function (h) { h.classList.add("cur-pending", "kf-pending"); });
  function sceneHead(h, i) {
    var h2 = $("h2", h), kf = $(".kf", h);
    var role = ["diseno", "edicion", "color", "camara"][i % 4];
    var p = pt(h2, .5, .55);
    var c = spawn(role, p, 150, 70);
    return wait(250).then(function () { return c.show(); })
      .then(function () { return c.move(function () { return pt(h2, .5, .55); }); })
      .then(function () { return c.down(); })
      .then(function () {
        var from = { x: c.x, y: c.y };
        h.classList.remove("cur-pending");
        return c.move({ x: from.x + 26, y: from.y }, { dur: 500, bend: 0 });
      })
      .then(function () { h.classList.add("cur-placed"); return c.up(); })
      .then(function () { return c.move(function () { return pt(kf); }, { dur: 520 }); })
      .then(function () { return c.click(); })
      .then(function () { h.classList.remove("kf-pending"); return wait(350); })
      .then(function () { return c.move({ x: c.x - 40, y: c.y + 110 }, { dur: 520 }); })
      .then(function () { return c.hide(); });
  }

  /* 4 · Resultado de cada caso: Edición dibuja una caja de selección encima. */
  function sceneResult(res) {
    var a = pt(res, 0, 0), z = pt(res, 1, 1);
    a.x -= 6; a.y -= 4; z.x += 6; z.y += 4;
    var c = spawn("edicion", a, -110, -40), box;
    return c.show()
      .then(function () { return c.move(a); })
      .then(function () { return c.down(); })
      .then(function () {
        box = drawBox(ROLE.edicion.color);
        return c.move(z, { dur: 700, bend: .03, onStep: function () { box.set(a, { x: c.x, y: c.y }); } });
      })
      .then(function () { return c.up(); })
      .then(function () { return wait(900); })
      .then(function () { box.remove(); return c.move({ x: c.x + 90, y: c.y + 90 }, { dur: 520 }); })
      .then(function () { return c.hide(); });
  }

  /* 4b · Vista previa: Edición recorre el video con el cursor, como en el editor. */
  function scenePreview(scr) {
    if (!scr._pv) return;
    var c = spawn("edicion", pt(scr, .15, .6), -120, 80);
    return c.show()
      .then(function () { return c.move(function () { return pt(scr, .12, .62); }); })
      .then(function () { scr._pv.start(); c.say("Recorre el video"); return wait(500); })
      .then(function () {
        return c.move(function () { return pt(scr, .88, .62); }, { dur: 2200, bend: 0, onStep: function (k) { scr._pv.scrub(.12 + .76 * k); } });
      })
      .then(function () { return wait(500); })
      .then(function () { scr._pv.stop(); return c.move({ x: c.x + 90, y: c.y + 120 }, { dur: 600 }); })
      .then(function () { return c.hide(); });
  }

  /* 5 · Reels: Edición pasa el cursor por un reel para mostrar que se reproduce. */
  function sceneReels(grid) {
    var reels = $$(".reel", grid);
    if (!reels.length || !APP.reel) return;
    var r = reels[1] || reels[0];
    var c = spawn("edicion", pt(r), 140, -80);
    return c.show()
      .then(function () { return c.move(function () { return pt(r, .5, .45); }); })
      .then(function () { c.say("Pásale el cursor"); APP.reel.start(r); return wait(2600); })
      .then(function () { APP.reel.stop(r); return c.move({ x: c.x + 120, y: c.y + 120 }, { dur: 600 }); })
      .then(function () { return c.hide(); });
  }

  /* 6 · Gráfico: Diseño gira el hablador; Color toma los colores de la marca;
         Diseño abre la carta. */
  function sceneTent(card) {
    var tent = $(".tent", card);
    if (!tent || !APP.turnTent) return;
    var c = spawn("diseno", pt(card, .3, .55), -130, 60);
    return c.show()
      .then(function () { return c.move(function () { return pt(card, .3, .55); }); })
      .then(function () { c.say("Gíralo"); return c.down(); })
      .then(function () {
        var from = pt(card, .3, .55), to = pt(card, .82, .55);
        return c.move(to, { dur: 1300, bend: .02, onStep: function (k) { APP.turnTent(tent, .3 + .52 * k); } });
      })
      .then(function () { return c.up(); })
      .then(function () { return wait(500); })
      .then(function () { tent.style.transform = ""; tent.style.animation = ""; return c.move({ x: c.x + 60, y: c.y + 130 }, { dur: 600 }); })
      .then(function () { return c.hide(); });
  }
  function sceneChips(chips) {
    var dots = $$("i", chips);
    if (!dots.length) return;
    var c = spawn("color", pt(dots[0]), 120, 100), chain = c.show();
    dots.forEach(function (d) {
      chain = chain.then(function () { return c.move(function () { return pt(d, .55, .6); }, { dur: 480 }); })
        .then(function () { return c.click(); })
        .then(function () {
          dots.forEach(function (x) { x.classList.toggle("picked", x === d); });
          c.tint(getComputedStyle(d).getPropertyValue("--c").trim() || ROLE.color.color);
          return wait(320);
        });
    });
    return chain.then(function () { dots.forEach(function (x) { x.classList.remove("picked"); }); return c.move({ x: c.x + 120, y: c.y + 80 }, { dur: 600 }); })
      .then(function () { return c.hide(); });
  }
  function sceneMenu(card) {
    var c = spawn("diseno", pt(card, .3, .5), -120, -70);
    return c.show()
      .then(function () { return c.move(function () { return pt(card, .32, .5); }); })
      .then(function () { card.classList.add("fan"); c.say("Hojéala"); return wait(1500); })
      .then(function () { card.classList.remove("fan"); return c.move({ x: c.x - 80, y: c.y + 130 }, { dur: 600 }); })
      .then(function () { return c.hide(); });
  }

  /* 7 · Editorial: un cursor levanta la tapa de una publicación. */
  function sceneBook(book) {
    var cover = $(".cover", book);
    var c = spawn("editorial", pt(cover, .7, .4), 150, 40);
    return c.show()
      .then(function () { return c.move(function () { return pt(cover, .72, .42); }); })
      .then(function () { book.classList.add("peek"); c.say("Hojéalo"); return wait(1400); })
      .then(function () { book.classList.remove("peek"); return c.move({ x: c.x + 110, y: c.y + 110 }, { dur: 600 }); })
      .then(function () { return c.hide(); });
  }

  /* 8 · Sobre mí: Cámara encuadra el retrato (de plano cerrado a plano medio). */
  var portrait = $('[data-cur="portrait"]');
  if (portrait) portrait.classList.add("cur-pending");
  function scenePortrait() {
    var frame = $(".frame", portrait), img = $("img", frame);
    var c = spawn("camara", pt(frame, 0, 0), -110, -60);
    return c.show()
      .then(function () { return c.move(function () { return pt(frame, .04, .03); }); })
      .then(function () { portrait.classList.add("cropping"); return c.down(); })
      .then(function () {
        img.style.transition = "none";
        return c.move(function () { return pt(frame, .97, .97); }, {
          dur: 1100, bend: .02,
          onStep: function (k) { var s = 1.35 - .35 * k; img.style.transform = "scale(" + s.toFixed(3) + ") translate(" + (6 * (1 - k)).toFixed(2) + "%," + (4 * (1 - k)).toFixed(2) + "%)"; }
        });
      })
      .then(function () { portrait.classList.remove("cur-pending"); img.style.transform = ""; img.style.transition = ""; c.say("Encuadre listo"); return c.up(); })
      .then(function () { return wait(700); })
      .then(function () { portrait.classList.remove("cropping"); return c.move({ x: c.x + 90, y: c.y + 60 }, { dur: 520 }); })
      .then(function () { return c.hide(); });
  }

  /* 9 · Contacto: el último cursor le deja el turno al visitante. */
  function sceneContact(form) {
    var btn = $("#wa"), opt = $(".opt", form);
    var c = spawn("alex", pt(opt || btn), 180, 120);
    var chain = c.show();
    if (opt) chain = chain
      .then(function () { return c.move(function () { return pt(opt, .6, .65); }); })
      .then(function () { opt.classList.add("is-hover"); c.say("Arma tu pedido"); return wait(1300); })
      .then(function () { opt.classList.remove("is-hover"); });
    return chain
      .then(function () { return c.move(function () { return pt(btn, .62, .62); }); })
      .then(function () { btn.classList.add("is-hover"); c.say("Tu turno"); return wait(1500); })
      .then(function () { btn.classList.remove("is-hover"); return c.move({ x: c.x + 110, y: c.y + 90 }, { dur: 600 }); })
      .then(function () { return c.hide(); });
  }

  /* ======================================================================
     PROGRAMACIÓN: cada escena se dispara al ver su parte
     ====================================================================== */
  function start() {
    // portada (ya está en pantalla al cargar)
    wait(500).then(function () {
      sceneHeroDesign(); sceneHeroEdit();
      return wait(5200);
    }).then(sceneLens);

    once($(".stats"), sceneStats, .6);
    heads.forEach(function (h, i) { once(h, function () { sceneHead(h, i); }, .8); });

    $$(".project .p-res").forEach(function (r) {
      if ($(".v", r)) once(r, sceneResult, .9);
    });
    if (desktop) once($("#reels"), sceneReels, .5);
    var firstScreen = $(".project .screen");
    if (desktop && firstScreen) once(firstScreen, scenePreview, .7);

    $$(".mock-table").forEach(function (m) { once(m, sceneTent, .7); });
    $$(".mock-brand .chips").forEach(function (ch) { once(ch, sceneChips, 1); });
    if (desktop) $$(".mock-menu").forEach(function (m) { once(m, sceneMenu, .7); });
    var firstBook = $(".book");
    if (firstBook) once(firstBook, sceneBook, .8);
    if (portrait) once(portrait, scenePortrait, .55);
    var brief = $("#brief");
    if (brief && !brief.hidden) once(brief, sceneContact, .45);
    else if ($("#wa")) once($("#wa"), function () { sceneContact($("#wa")); }, 1);
  }

  // espera a que el visitante le dé REC en la claqueta
  function boot() { (APP.rolling || Promise.resolve()).then(start); }
  if (document.readyState === "complete") boot();
  else window.addEventListener("load", boot);
})();
