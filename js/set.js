/* =========================================================================
   INICIO · «El set» (v2)
   1 · Llegada: el escritorio de Alex de noche, en loop (humo, lámpara, REC).
   2 · Encender el PC: parpadeo, el isotipo en las dos pantallas.
   3 · Pantallas: izquierda = reproductor con el Play; derecha = recap de proyectos.
   4 · Play: dolly de 1 s directo a la pantalla izquierda (pantallas rastreadas cuadro a cuadro).
   5 · Edición en vivo: dentro del PC está abierto el editor; leader 3·2·1, el
       tráiler corre en el monitor de programa, los títulos son clips de la pista V2.
   6 · El monitor de programa llena la pantalla, destello, obturador y portada.
   Una vez por visita (ap-rec). «Saltar» o Esc entra directo. Sin «reducir movimiento».
   Las pantallas se dibujan como LUZ (modo trama): el humo pasa por delante y alumbran el cuarto.
   Medios en assets/set/ (escena generada con IA en Magnific; reemplazable por el set real).
   ========================================================================= */
(function () {
  "use strict";
  var root = document.documentElement, set = document.getElementById("set");
  window.APP = window.APP || {};
  window.APP.rolling = new Promise(function (resolve) {
    if (!set || !root.classList.contains("pre-on")) { if (set) set.remove(); return resolve(); }
    var T_ = function (x) { return (window.T || function (y) { return y; })(x); };
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // pantallas del dolly (12 cuadros de rastreo por segundo del video original; el de la web va 7× más rápido)
    var TRK = [[[0.2408,0.2681,0.4905,0.509],[0.4986,0.2625,0.7351,0.5054]],[[0.2397,0.2677,0.4909,0.5097],[0.499,0.2622,0.7352,0.5062]],[[0.2386,0.2673,0.4914,0.5103],[0.4994,0.2619,0.7353,0.507]],[[0.2375,0.267,0.4918,0.5111],[0.4998,0.2616,0.7355,0.5078]],[[0.2364,0.2666,0.4922,0.5118],[0.5002,0.2613,0.7357,0.5086]],[[0.2354,0.2662,0.4927,0.5125],[0.5007,0.261,0.736,0.5095]],[[0.2343,0.2659,0.4931,0.5133],[0.5011,0.2607,0.7363,0.5103]],[[0.2332,0.2655,0.4935,0.5141],[0.5015,0.2604,0.7367,0.5112]],[[0.2321,0.2651,0.494,0.5149],[0.502,0.2601,0.7372,0.5121]],[[0.231,0.2648,0.4944,0.5157],[0.5024,0.2598,0.7377,0.5131]],[[0.2299,0.2644,0.4948,0.5166],[0.5029,0.2595,0.7382,0.5141]],[[0.2288,0.264,0.4953,0.5175],[0.5033,0.2592,0.7388,0.515]],[[0.2276,0.2636,0.4957,0.5184],[0.5038,0.2588,0.7395,0.5161]],[[0.2265,0.2633,0.4962,0.5193],[0.5043,0.2585,0.7403,0.5171]],[[0.2253,0.2629,0.4966,0.5203],[0.5048,0.2582,0.7411,0.5182]],[[0.2241,0.2625,0.4971,0.5213],[0.5052,0.2578,0.742,0.5193]],[[0.2229,0.2621,0.4975,0.5223],[0.5058,0.2574,0.743,0.5204]],[[0.2217,0.2617,0.498,0.5234],[0.5063,0.2571,0.744,0.5216]],[[0.2205,0.2613,0.4985,0.5244],[0.5068,0.2567,0.7452,0.5228]],[[0.2192,0.2609,0.499,0.5256],[0.5073,0.2563,0.7464,0.5241]],[[0.2179,0.2605,0.4994,0.5267],[0.5079,0.2559,0.7477,0.5253]],[[0.2166,0.2601,0.4999,0.5279],[0.5084,0.2554,0.7491,0.5267]],[[0.2153,0.2596,0.5004,0.5291],[0.509,0.255,0.7506,0.528]],[[0.214,0.2592,0.501,0.5304],[0.5096,0.2545,0.7522,0.5294]],[[0.2126,0.2587,0.5015,0.5317],[0.5102,0.2541,0.7538,0.5308]],[[0.2112,0.2583,0.502,0.533],[0.5108,0.2536,0.7556,0.5323]],[[0.2097,0.2578,0.5026,0.5344],[0.5114,0.2531,0.7575,0.5338]],[[0.2083,0.2573,0.5031,0.5358],[0.512,0.2526,0.7595,0.5353]],[[0.2068,0.2568,0.5037,0.5372],[0.5127,0.2521,0.7616,0.5369]],[[0.2052,0.2563,0.5043,0.5387],[0.5133,0.2515,0.7638,0.5386]],[[0.2037,0.2557,0.5049,0.5402],[0.514,0.251,0.7661,0.5402]],[[0.2021,0.2552,0.5055,0.5418],[0.5147,0.2504,0.7685,0.542]],[[0.2004,0.2546,0.5061,0.5434],[0.5155,0.2498,0.771,0.5437]],[[0.1988,0.254,0.5068,0.5451],[0.5162,0.2491,0.7737,0.5455]],[[0.1971,0.2535,0.5074,0.5468],[0.5169,0.2485,0.7764,0.5474]],[[0.1953,0.2528,0.5081,0.5485],[0.5177,0.2478,0.7793,0.5493]],[[0.1935,0.2522,0.5088,0.5504],[0.5185,0.2471,0.7824,0.5513]],[[0.1916,0.2516,0.5095,0.5522],[0.5193,0.2464,0.7855,0.5533]],[[0.1898,0.2509,0.5103,0.5541],[0.5201,0.2457,0.7888,0.5553]],[[0.1878,0.2502,0.511,0.556],[0.521,0.2449,0.7922,0.5574]],[[0.1858,0.2495,0.5118,0.558],[0.5219,0.2441,0.7958,0.5596]],[[0.1838,0.2488,0.5126,0.5601],[0.5228,0.2433,0.7994,0.5618]],[[0.1817,0.248,0.5134,0.5622],[0.5237,0.2425,0.8033,0.5641]],[[0.1796,0.2472,0.5143,0.5644],[0.5246,0.2416,0.8073,0.5664]],[[0.1774,0.2464,0.5151,0.5666],[0.5256,0.2407,0.8114,0.5688]],[[0.1752,0.2456,0.516,0.5688],[0.5265,0.2398,0.8156,0.5712]],[[0.1729,0.2448,0.5169,0.5712],[0.5275,0.2389,0.8201,0.5737]],[[0.1705,0.2439,0.5179,0.5735],[0.5286,0.2379,0.8246,0.5763]],[[0.1681,0.243,0.5188,0.576],[0.5296,0.2369,0.8294,0.5789]],[[0.1657,0.2421,0.5198,0.5785],[0.5307,0.2359,0.8343,0.5816]],[[0.1631,0.2412,0.5208,0.581],[0.5318,0.2348,0.8393,0.5843]],[[0.1605,0.2402,0.5219,0.5836],[0.5329,0.2337,0.8445,0.5871]],[[0.1579,0.2392,0.5229,0.5863],[0.5341,0.2326,0.8499,0.59]],[[0.1552,0.2381,0.524,0.5891],[0.5353,0.2314,0.8555,0.5929]],[[0.1524,0.2371,0.5251,0.5919],[0.5365,0.2302,0.8612,0.5959]],[[0.1496,0.236,0.5263,0.5947],[0.5377,0.229,0.8671,0.5989]],[[0.1467,0.2349,0.5275,0.5977],[0.539,0.2277,0.8732,0.602]],[[0.1437,0.2337,0.5287,0.6007],[0.5403,0.2264,0.8794,0.6052]],[[0.1406,0.2325,0.5299,0.6037],[0.5416,0.2251,0.8858,0.6085]],[[0.1375,0.2313,0.5312,0.6069],[0.5429,0.2237,0.8924,0.6118]],[[0.1343,0.2301,0.5325,0.6101],[0.5443,0.2223,0.8992,0.6152]],[[0.1311,0.2288,0.5338,0.6133],[0.5457,0.2209,0.9062,0.6187]],[[0.1277,0.2275,0.5352,0.6167],[0.5472,0.2194,0.9134,0.6222]],[[0.1243,0.2261,0.5366,0.6201],[0.5486,0.2179,0.9208,0.6259]],[[0.1208,0.2247,0.5381,0.6236],[0.5501,0.2163,0.9284,0.6295]],[[0.1172,0.2233,0.5395,0.6272],[0.5517,0.2147,0.9361,0.6333]],[[0.1136,0.2219,0.541,0.6308],[0.5533,0.2131,0.9441,0.6371]],[[0.1098,0.2204,0.5426,0.6345],[0.5549,0.2114,0.9523,0.6411]],[[0.106,0.2188,0.5442,0.6383],[0.5565,0.2097,0.9607,0.6451]],[[0.1021,0.2172,0.5458,0.6421],[0.5582,0.2079,0.9692,0.6491]],[[0.0981,0.2156,0.5475,0.6461],[0.5599,0.2061,0.978,0.6533]],[[0.0941,0.214,0.5492,0.6501],[0.5616,0.2042,0.987,0.6575]],[[0.0899,0.2123,0.5509,0.6542],[0.5634,0.2024,0.9963,0.6618]],[[0.0857,0.2106,0.5527,0.6584],[0.5652,0.2004,1.0057,0.6662]],[[0.0813,0.2088,0.5545,0.6626],[0.5671,0.1984,1.0154,0.6707]],[[0.0769,0.207,0.5564,0.667],[0.5689,0.1964,1.0253,0.6752]],[[0.0723,0.2051,0.5583,0.6714],[0.5709,0.1943,1.0354,0.6799]],[[0.0677,0.2032,0.5602,0.6759],[0.5728,0.1922,1.0458,0.6846]],[[0.063,0.2013,0.5622,0.6805],[0.5748,0.19,1.0563,0.6894]],[[0.0582,0.1993,0.5643,0.6852],[0.5769,0.1878,1.0672,0.6943]],[[0.0533,0.1972,0.5663,0.6899],[0.5789,0.1855,1.0782,0.6993]],[[0.0483,0.1951,0.5685,0.6948],[0.5811,0.1832,1.0895,0.7044]],[[0.0432,0.193,0.5706,0.6997],[0.5832,0.1808,1.101,0.7095]],[[0.038,0.1908,0.5729,0.7048],[0.5854,0.1784,1.1128,0.7148]],[[0.0327,0.1886,0.5751,0.7099],[0.5877,0.1759,1.1248,0.7201]],[[0.0272,0.1863,0.5774,0.7151],[0.5899,0.1733,1.1371,0.7256]],[[0.0217,0.184,0.5798,0.7204],[0.5923,0.1708,1.1496,0.7311]],[[0.0161,0.1816,0.5822,0.7258],[0.5946,0.1681,1.1624,0.7368]],[[0.0104,0.1792,0.5847,0.7313],[0.597,0.1654,1.1754,0.7425]],[[0.0045,0.1767,0.5872,0.7369],[0.5995,0.1627,1.1887,0.7483]],[[-0.0014,0.1742,0.5897,0.7426],[0.602,0.1599,1.2022,0.7542]],[[-0.0075,0.1716,0.5923,0.7483],[0.6045,0.157,1.216,0.7602]],[[-0.0137,0.169,0.595,0.7542],[0.6071,0.1541,1.2301,0.7663]],[[-0.02,0.1663,0.5977,0.7602],[0.6097,0.1511,1.2445,0.7725]],[[-0.0264,0.1636,0.6005,0.7663],[0.6124,0.1481,1.2591,0.7788]],[[-0.0329,0.1608,0.6033,0.7724],[0.6151,0.145,1.274,0.7853]],[[-0.0396,0.1579,0.6062,0.7787],[0.6179,0.1418,1.2891,0.7918]]];
    var IW = 1440, IH = 814, ISO = "M117 384 Q106 384 111 374 L246 104 Q262 72 278 104 L331 230 C368 244 389 288 387 322 C385 362 357 389 319 389 C288 389 263 373 257 352 C254 340 262 333 271 341 C283 351 300 355 317 351 C337 345 345 323 341 300 C337 276 323 259 304 259 C279 259 259 285 247 318 C239 340 233 362 227 375 C200 383 150 384 117 384 Z";
    var $ = function (id) { return document.getElementById(id); };
    var cv = $("set-cv"), ctx = cv.getContext("2d"), amb = $("set-amb"), dol = $("set-dol"), scr = $("set-scr"), mont = $("set-mont");
    var hitPc = $("set-hit-pc"), hitPlay = $("set-hit-play"), ring = $("set-ring"), hintPc = $("set-hint-pc"), hintPlay = $("set-hint-play"), tag = $("set-tag"), hello = $("set-hello"), load = $("set-load"), flash = $("set-flash");
    var isoPath = new Path2D(ISO);
    var poster = new Image(); poster.src = "assets/set/ambiente.jpg";
    function play(v) { var r = v.play(); if (r && r.catch) r.catch(function () {}); }
    function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
    function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function tc(sec) { var f = Math.floor(sec * 25); return "00:" + pad(Math.floor(f / 1500) % 60) + ":" + pad(Math.floor(f / 25) % 60) + ":" + pad(f % 25); }
    document.body.style.overflow = "hidden";

    /* ---------- sonido: apagado por defecto, sutil ---------- */
    var sound = false, AC = null, buf = {}, room = null, roomGain = null;
    var SFX = { room: .5, power: .7, screens: .55, dolly: .6, play: .6, shutter: .55, hit: .6, riser: .5 };
    function ensureAudio() {
      if (AC) return; AC = new (window.AudioContext || window.webkitAudioContext)();
      Object.keys(SFX).forEach(function (k) { fetch("assets/set/sfx/" + k + ".mp3").then(function (r) { return r.arrayBuffer(); }).then(function (a) { return AC.decodeAudioData(a); }).then(function (b) { buf[k] = b; if (k === "room" && sound) startRoom(); }).catch(function () {}); });
    }
    function sfx(k, delay, len) {
      if (!sound || !AC || !buf[k]) return; var s = AC.createBufferSource(), g = AC.createGain(), t = AC.currentTime + (delay || 0);
      s.buffer = buf[k]; g.gain.value = SFX[k]; s.connect(g); g.connect(AC.destination); s.start(t);
      if (len) { g.gain.setValueAtTime(SFX[k], t + len * .6); g.gain.linearRampToValueAtTime(0, t + len); s.stop(t + len + .05); }
    }
    function startRoom() { if (room || !buf.room) return; room = AC.createBufferSource(); room.buffer = buf.room; room.loop = true; roomGain = AC.createGain(); roomGain.gain.value = 0; room.connect(roomGain); roomGain.connect(AC.destination); room.start(); roomGain.gain.linearRampToValueAtTime(SFX.room, AC.currentTime + 2.5); }
    function stopRoom(d) { if (!roomGain) return; roomGain.gain.linearRampToValueAtTime(0, AC.currentTime + (d || .6)); var r = room; room = null; roomGain = null; setTimeout(function () { try { r.stop(); } catch (e) {} }, (d || .6) * 1000 + 100); }
    function beep(f, d, v) { if (!sound || !AC) return; var o = AC.createOscillator(), g = AC.createGain(); o.type = "sine"; o.frequency.value = f; g.gain.value = v || .05; g.gain.exponentialRampToValueAtTime(.0001, AC.currentTime + d); o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + d); }
    $("set-snd").addEventListener("click", function () {
      sound = !sound; this.setAttribute("aria-pressed", sound);
      ensureAudio(); if (AC.state === "suspended") AC.resume();
      if (sound) startRoom(); else stopRoom();
    });

    /* ---------- encuadre ---------- */
    var W = 0, H = 0, dpr = 1;
    function resize() { dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    addEventListener("resize", resize); resize();
    function view() {
      var s, ox, oy;
      // horizontal: casi cover, pero siempre se ve al menos el 92 % del ancho (la cámara y el PC no se cortan)
      if (W / H >= 1) { s = Math.max(W / IW, Math.min(H / IH, W / (IW * .92))); ox = (W - IW * s) / 2; oy = (H - IH * s) / 2; }
      else { s = (H * .62) / IH; ox = W / 2 - IW * s * .43; oy = (H - IH * s) / 2; } // vertical: centrado en el monitor del Play
      return { s: s, ox: ox, oy: oy };
    }
    function toScreen(V, x, y) { return [x * IW * V.s + V.ox, y * IH * V.s + V.oy]; }

    /* ---------- pantallas como luz ---------- */
    var off = document.createElement("canvas"), octx = off.getContext("2d");
    var tiny = document.createElement("canvas"); tiny.width = 4; tiny.height = 3; var tctx = tiny.getContext("2d", { willReadFrequently: true });
    var avg = {}, avgTick = 0;
    function content(kind, w, h, extra) {
      var cw = Math.min(720, Math.max(2, Math.round(w))), ch = Math.max(1, Math.round(cw * h / w));
      if (off.width !== cw || off.height !== ch) { off.width = cw; off.height = ch; }
      octx.fillStyle = "#000"; octx.fillRect(0, 0, cw, ch);
      if (kind === "video" && extra.readyState >= 2) {
        var vw = extra.videoWidth, vh = extra.videoHeight, sc = Math.max(cw / vw, ch / vh), sw = cw / sc, sh = ch / sc;
        octx.filter = "saturate(.88) contrast(.94)";
        octx.drawImage(extra, (vw - sw) / 2, (vh - sh) / 2, sw, sh, 0, 0, cw, ch); octx.filter = "none";
      } else if (kind === "logo") {
        var sz = ch * .42; octx.save(); octx.translate(cw / 2 - sz * .5, ch / 2 - sz * .514); octx.scale(sz / 360, sz / 360); octx.translate(-70, -50); octx.fillStyle = "#F2C572"; octx.fill(isoPath); octx.restore();
      } else if (kind === "player") {
        var R = ch * .16 * (extra.hover ? 1.08 : 1), cx = cw / 2, cy = ch * .46;
        var g = octx.createRadialGradient(cx, cy, 0, cx, cy, ch * .6); g.addColorStop(0, "rgba(242,197,114,.16)"); g.addColorStop(1, "rgba(242,197,114,0)"); octx.fillStyle = g; octx.fillRect(0, 0, cw, ch);
        octx.fillStyle = "#F2C572"; octx.beginPath(); octx.arc(cx, cy, R, 0, Math.PI * 2); octx.fill();
        octx.fillStyle = "#0B1315"; octx.beginPath(); octx.moveTo(cx - R * .28, cy - R * .42); octx.lineTo(cx + R * .46, cy); octx.lineTo(cx - R * .28, cy + R * .42); octx.closePath(); octx.fill();
        octx.fillStyle = "rgba(244,241,234,.82)"; octx.font = "600 " + Math.max(8, ch * .055) + "px Figtree, system-ui"; octx.textAlign = "center";
        octx.fillText("ALEX PINO · REEL 2026", cx, ch * .8);
        octx.fillStyle = "rgba(244,241,234,.16)"; octx.fillRect(cw * .08, ch * .88, cw * .84, Math.max(1.5, ch * .008));
      }
      var vg = octx.createRadialGradient(cw / 2, ch / 2, ch * .2, cw / 2, ch / 2, cw * .62); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.28)"); octx.fillStyle = vg; octx.fillRect(0, 0, cw, ch);
    }
    function drawScreen(r, kind, a, glow, extra, id) {
      if (a <= 0) return null;
      var x = r[0] * IW, y = r[1] * IH, w = (r[2] - r[0]) * IW, h = (r[3] - r[1]) * IH, ins = Math.min(w, h) * .006;
      content(kind, w, h, extra || {});
      ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.globalAlpha = a * .97;
      ctx.drawImage(off, x + ins, y + ins, w - 2 * ins, h - 2 * ins);
      var sh = ctx.createLinearGradient(x, y, x + w, y + h); sh.addColorStop(0, "rgba(255,255,255,0)"); sh.addColorStop(.42, "rgba(255,255,255,.035)"); sh.addColorStop(.5, "rgba(255,255,255,.06)"); sh.addColorStop(.58, "rgba(255,255,255,.02)"); sh.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalAlpha = a; ctx.fillStyle = sh; ctx.fillRect(x + ins, y + ins, w - 2 * ins, h - 2 * ins);
      ctx.restore();
      if (avgTick % 6 === 0 || !avg[id]) { tctx.drawImage(off, 0, 0, 4, 3); var d = tctx.getImageData(0, 0, 4, 3).data, s = [0, 0, 0]; for (var i = 0; i < d.length; i += 4) { s[0] += d[i]; s[1] += d[i + 1]; s[2] += d[i + 2]; } avg[id] = [s[0] / 12, s[1] / 12, s[2] / 12]; }
      return { x: x, y: y, w: w, h: h, a: a * glow, c: avg[id] };
    }
    function spill(S) {
      if (!S || !S.c || S.a <= 0) return;
      var c = S.c, k = Math.min(1, (c[0] + c[1] + c[2]) / 300 + .25), cx = S.x + S.w / 2, cy = S.y + S.h * .62;
      ctx.save(); ctx.globalCompositeOperation = "screen";
      var g = ctx.createRadialGradient(cx, cy, S.h * .2, cx, cy, S.w * 1.25);
      g.addColorStop(0, "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + (.2 * S.a * k).toFixed(3) + ")"); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.fillRect(cx - S.w * 1.3, cy - S.w * 1.3, S.w * 2.6, S.w * 2.6); ctx.restore();
    }
    function place(el, V, r, p) { var a = toScreen(V, r[0], r[1]), b = toScreen(V, r[2], r[3]); el.style.left = (a[0] - (p || 0)) + "px"; el.style.top = (a[1] - (p || 0)) + "px"; el.style.width = (b[0] - a[0] + 2 * (p || 0)) + "px"; el.style.height = (b[1] - a[1] + 2 * (p || 0)) + "px"; }

    /* ---------- estado: idle → booting → ready → dolly → edit → out ---------- */
    var state = "idle", tBoot = 0, tState = performance.now(), mouse = { x: -1, y: -1 };
    var PC = [.855, .265, .99, .635], CAM = [0, .19, .2, .6], BOOKS = [.69, .02, .79, .16];
    addEventListener("pointermove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    function hoverTag(V) {
      if (state !== "idle" && state !== "ready") { tag.style.opacity = 0; return; }
      var u = (mouse.x - V.ox) / (IW * V.s), v = (mouse.y - V.oy) / (IH * V.s), t = "";
      function inR(r) { return u > r[0] && u < r[2] && v > r[1] && v < r[3]; }
      if (inR(CAM)) t = "Grabo"; else if (inR([TRK[0][0][0], TRK[0][0][1], TRK[0][1][2], TRK[0][1][3]])) t = "Edito"; else if (inR(BOOKS)) t = "Cuento";
      tag.textContent = t ? T_(t) : ""; tag.style.opacity = t ? 1 : 0; tag.style.left = (mouse.x + 16) + "px"; tag.style.top = (mouse.y + 16) + "px";
    }
    function powerOn() {
      if (state !== "idle") return; state = "booting"; tBoot = performance.now();
      sfx("power"); sfx("screens", .9);
      hitPc.hidden = true; ring.style.opacity = 0; hintPc.style.opacity = 0; hello.classList.add("gone");
      play(scr);
      setTimeout(function () { state = "ready"; tState = performance.now(); hitPlay.hidden = false; hitPlay.focus({ preventScroll: true }); }, 2400);
    }
    function goPlay() {
      if (state !== "ready") return; state = "dolly"; tState = performance.now();
      try { sessionStorage.setItem("ap-rec", "1"); } catch (e) {}
      sfx("play"); sfx("dolly", .02, 1.2);
      hitPlay.hidden = true; hintPlay.style.opacity = 0; tag.style.opacity = 0;
      dol.currentTime = 0; dol.playbackRate = 1.13; play(dol); // 1,13 s de video → 1 s
    }
    hitPc.addEventListener("click", powerOn); $("set-power").addEventListener("click", powerOn);
    hitPlay.addEventListener("click", goPlay);
    dol.addEventListener("ended", function () { if (state === "dolly") startEdit(); });

    /* ---------- Edición en vivo ---------- */
    var LEAD = 3, END = 13.8; // en segundos de la línea de tiempo; el montaje empieza en LEAD
    // segmentos del montaje (segundos del video): planos y títulos (pista V2)
    var SHOTS = [[.9, 2.2, "telecafe", "Por encima de la mesa"], [2.9, 4.2, "paisajes", "Paisajes Íntimos"], [4.9, 6.2, "austin", "Austin Marchese"], [6.9, 7.7, "lacepa", "La Cepa"], [7.7, 8.5, "pregon", "Pregón de la plaza"], [9.3, 10.8, "campo", "Por encima de la mesa"]];
    var TITLES = [[0, .9, "Alex Pino presenta", "s"], [2.2, 2.9, "Grabo."], [4.2, 4.9, "Edito."], [6.2, 6.9, "Cuento historias."], [8.5, 10.8, "¿Quién soy?", "b"]];
    var nle = $("nle"), v1 = $("nle-v1"), v2 = $("nle-v2"), ruler = $("nle-ruler"), head = $("nle-head"), lead = $("nle-lead"), leadN = $("nle-n"), ttl = $("nle-ttl"), nTc = $("nle-tc");
    function pct(t) { return (t / END * 100).toFixed(3) + "%"; }
    var html = '<span class="nle-clip lead" style="left:0;width:calc(' + pct(LEAD) + ' - 2px)"><em>Leader 3·2·1</em></span>';
    SHOTS.forEach(function (s, i) { html += '<span class="nle-clip" style="left:' + pct(LEAD + s[0]) + ';width:calc(' + pct(s[1] - s[0]) + ' - 2px);--i:' + (i + 1) + '"><img src="assets/set/clips/' + s[2] + '.jpg" alt=""><em>' + s[3] + "</em></span>"; });
    v1.innerHTML = html;
    v2.innerHTML = TITLES.map(function (t, i) { return '<span class="nle-clip ttl" style="left:' + pct(LEAD + t[0]) + ';width:calc(' + pct(t[1] - t[0]) + ' - 2px);--i:' + (i + 2) + '"><em>T · ' + T_(t[2]) + "</em></span>"; }).join("");
    ttl.innerHTML = TITLES.map(function (t) { return '<span class="' + (t[3] || "") + '">' + T_(t[2]) + "</span>"; }).join("");
    var ttlEls = ttl.children, rh = "";
    for (var r = 0; r <= 13; r++) rh += '<span style="left:' + pct(r) + '">' + tc(r).slice(3, 8) + "</span>";
    ruler.innerHTML = rh;
    var tEdit = 0, lastTitle = -1, lastN = 0, riser = false, montOn = false, outT = 0;
    function startEdit() {
      state = "edit"; tEdit = performance.now(); lastTitle = -1; lastN = 0; riser = false; montOn = false;
      set.classList.add("editing");
      try { mont.currentTime = 0; } catch (e) {}
    }
    function editTime() { return montOn ? LEAD + (mont.currentTime || 0) : (performance.now() - tEdit) / 1000; }
    function tickEdit() {
      var t = editTime();
      if (!montOn && t >= LEAD) { montOn = true; play(mont); }
      // leader 3·2·1
      var n = t < LEAD ? Math.ceil(LEAD - t) : 0;
      lead.classList.toggle("on", n > 0);
      if (n !== lastN) { lastN = n; if (n > 0) { leadN.textContent = n; leadN.classList.remove("tick"); void leadN.offsetWidth; leadN.classList.add("tick"); beep(1000, .12, .035); } }
      // títulos (pista V2), sincronizados con el montaje
      var m = t - LEAD, on = -1;
      if (m >= 0) for (var i = 0; i < TITLES.length; i++) if (m >= TITLES[i][0] && m < TITLES[i][1]) on = i;
      if (on !== lastTitle) { for (var j = 0; j < ttlEls.length; j++) ttlEls[j].classList.toggle("on", j === on); if (on >= 0) sfx("hit"); lastTitle = on; }
      if (!riser && m >= 7.7) { riser = true; sfx("riser"); }
      head.style.left = pct(Math.min(END, t));
      nTc.textContent = tc(t);
      if (t >= END && state === "edit") { state = "out"; outT = performance.now(); set.classList.add("exiting"); setTimeout(function () { finish(false); }, 650); }
    }

    /* ---------- salida a la portada ---------- */
    var done = false;
    function finish(fast) {
      if (done) return; done = true;
      try { sessionStorage.setItem("ap-rec", "1"); } catch (e) {}
      sfx("shutter"); stopRoom(1.2);
      root.classList.add("revealing");
      set.classList.add("opening");
      flash.style.opacity = fast ? 0 : .85;
      requestAnimationFrame(function () { requestAnimationFrame(function () { set.classList.add("go"); flash.style.opacity = 0; }); });
      setTimeout(function () {
        [amb, dol, scr, mont].forEach(function (v) { try { v.pause(); } catch (e) {} });
        root.classList.remove("pre-on"); document.body.style.overflow = ""; set.remove(); resolve();
      }, fast ? 700 : 1300);
      setTimeout(function () { root.classList.remove("revealing"); }, fast ? 2200 : 3000);
    }
    $("set-skip").addEventListener("click", function () { finish(true); });
    document.addEventListener("keydown", function k(e) {
      if (!document.body.contains(set)) { document.removeEventListener("keydown", k); return; }
      if (e.key === "Escape") finish(true);
    });

    /* ---------- carga ---------- */
    var need = [amb, dol, scr, mont], ready = 0;
    need.forEach(function (v) { v.addEventListener("canplay", function h() { v.removeEventListener("canplay", h); ready++; if (ready === need.length) load.style.opacity = 0; }); });
    play(amb);

    /* ---------- dibujo ---------- */
    function frame(now) {
      if (done && !document.body.contains(set)) return;
      var V = view(), sinceS = (now - tState) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = "#030405"; ctx.fillRect(0, 0, W, H);
      var z = 1, cx = W / 2, cy = H / 2, src = amb, fi = 0;
      if (state === "dolly" || state === "edit" || state === "out") { src = dol; fi = Math.min(TRK.length - 1, (dol.currentTime || 0) * 84); }
      // un solo movimiento directo a la pantalla izquierda
      if (state === "dolly" || state === "edit" || state === "out") {
        var k = state === "dolly" ? ease(clamp((dol.currentTime || 0) / (dol.duration || 1.13), 0, 1)) : 1;
        var i0 = Math.floor(fi), tt = fi - i0, P = TRK[i0][0], Q = TRK[Math.min(TRK.length - 1, i0 + 1)][0];
        var L = [P[0] + (Q[0] - P[0]) * tt, P[1] + (Q[1] - P[1]) * tt, P[2] + (Q[2] - P[2]) * tt, P[3] + (Q[3] - P[3]) * tt];
        var a = toScreen(V, L[0], L[1]), b = toScreen(V, L[2], L[3]);
        z = 1 + (Math.max(W / (b[0] - a[0]), H / (b[1] - a[1])) * 1.03 - 1) * k;
        cx = W / 2 + ((a[0] + b[0]) / 2 - W / 2) * k; cy = H / 2 + ((a[1] + b[1]) / 2 - H / 2) * k;
      }
      if (state !== "edit" && state !== "out") {
        ctx.setTransform(dpr * z, 0, 0, dpr * z, dpr * (W / 2 - cx * z), dpr * (H / 2 - cy * z));
        ctx.translate(V.ox, V.oy); ctx.scale(V.s, V.s);
        if (src.readyState >= 2) ctx.drawImage(src, 0, 0, IW, IH); else if (poster.complete && poster.naturalWidth) ctx.drawImage(poster, 0, 0, IW, IH);
        if (V.oy > 0) { var fg = ctx.createLinearGradient(0, 0, 0, IH); fg.addColorStop(0, "rgba(3,4,5,1)"); fg.addColorStop(.06, "rgba(3,4,5,0)"); fg.addColorStop(.94, "rgba(3,4,5,0)"); fg.addColorStop(1, "rgba(3,4,5,1)"); ctx.fillStyle = fg; ctx.fillRect(0, 0, IW, IH); }
        var j0 = Math.floor(fi), t2 = fi - j0, A = TRK[j0], B = TRK[Math.min(TRK.length - 1, j0 + 1)];
        var rr = function (q) { return [A[q][0] + (B[q][0] - A[q][0]) * t2, A[q][1] + (B[q][1] - A[q][1]) * t2, A[q][2] + (B[q][2] - A[q][2]) * t2, A[q][3] + (B[q][3] - A[q][3]) * t2]; };
        var Lr = rr(0), Rr = rr(1);
        avgTick++;
        if (state === "booting") {
          var bt = (now - tBoot) / 1000, fl = bt < .9 ? 0 : bt < 1.05 ? .6 : bt < 1.15 ? .1 : bt < 1.3 ? .9 : 1;
          spill(drawScreen(Lr, "logo", fl, fl, null, "L")); spill(drawScreen(Rr, "logo", fl, fl, null, "R"));
        } else if (state === "ready" || state === "dolly") {
          var fade = state === "ready" ? clamp(sinceS / .5, 0, 1) : 1, hov = false;
          if (state === "ready") { var p0 = toScreen(V, Lr[0], Lr[1]), p1 = toScreen(V, Lr[2], Lr[3]); hov = mouse.x > p0[0] && mouse.x < p1[0] && mouse.y > p0[1] && mouse.y < p1[1]; }
          var SL = drawScreen(Lr, "player", fade, state === "dolly" ? 1 - clamp((dol.currentTime || 0) / (dol.duration || 1.13), 0, 1) : 1, { hover: hov }, "L");
          var SR = drawScreen(Rr, "video", fade, 1, scr, "R");
          spill(SL); spill(SR);
        }
        // luz que sigue al cursor (muy sutil)
        if ((state === "idle" || state === "ready") && mouse.x >= 0 && !reduce) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = "soft-light";
          var gg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, Math.min(W, H) * .35); gg.addColorStop(0, "rgba(255,226,170,.35)"); gg.addColorStop(1, "rgba(255,226,170,0)");
          ctx.fillStyle = gg; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = "source-over";
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        if (state === "idle") {
          place(hitPc, V, PC, 8);
          var pcs = toScreen(V, .925, .31); ring.style.left = pcs[0] + "px"; ring.style.top = pcs[1] + "px";
          ring.style.opacity = (now - tState) > 1400 ? 1 : 0;
          var hp = toScreen(V, .925, .245); hintPc.style.left = (hp[0] - hintPc.offsetWidth / 2) + "px"; hintPc.style.top = (hp[1] - 6) + "px";
          hintPc.style.opacity = (now - tState) > 4200 ? 1 : 0;
        }
        if (state === "ready") {
          place(hitPlay, V, Lr, 0);
          var hq = toScreen(V, (Lr[0] + Lr[2]) / 2, Lr[1]); hintPlay.style.left = (hq[0] - hintPlay.offsetWidth / 2) + "px"; hintPlay.style.top = (hq[1] - 26) + "px";
          hintPlay.style.opacity = sinceS > 3.5 ? 1 : 0;
        }
        hoverTag(V);
      }
      if (state === "edit") tickEdit();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
})();
