/* =========================================================================
   INICIO · «El set» (v2)
   1 · Llegada: el escritorio de Alex de noche, en loop (humo, lámpara, REC).
   2 · Encender el PC: parpadeo, el isotipo en las dos pantallas.
   3 · Pantallas: izquierda = reproductor con el Play; derecha = recap de proyectos.
   4 · Play: dolly de 1 s directo a la pantalla izquierda (pantallas rastreadas cuadro a cuadro).
   5 · Edición en vivo: dentro del PC está abierto el editor; leader 3·2·1, el
       tráiler (24,6 s, música opcional) corre en el monitor de programa, los títulos son clips de la pista V2.
   6 · Fundido a negro, el editor se disuelve y aparece el logo animado (contorno → relleno → nombre).
   7 · Destello, obturador y portada.
   Sale al entrar desde fuera del sitio y en cada recarga; no al volver al Inicio desde otra página del portafolio (gate en el <head> de index.html). «Saltar» o Esc entra directo. Sin «reducir movimiento».
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
    var TRK = [[[0.2417,0.2666,0.4917,0.5086],[0.4993,0.2617,0.725,0.5061]],[[0.2384,0.2666,0.4917,0.5089],[0.4998,0.2617,0.728,0.5064]],[[0.2368,0.2666,0.4918,0.5104],[0.5,0.2617,0.7297,0.5074]],[[0.2361,0.2666,0.4922,0.5114],[0.5,0.2617,0.7309,0.5083]],[[0.2354,0.2666,0.4924,0.5126],[0.5002,0.2617,0.7323,0.5089]],[[0.2347,0.2666,0.4925,0.5135],[0.5005,0.2614,0.7335,0.5095]],[[0.234,0.2663,0.4929,0.5141],[0.5009,0.2607,0.7347,0.5101]],[[0.2333,0.2657,0.4932,0.5157],[0.5012,0.2604,0.7361,0.5107]],[[0.2325,0.2654,0.4936,0.5169],[0.5016,0.2604,0.7377,0.5114]],[[0.2314,0.2654,0.4939,0.5178],[0.5021,0.2601,0.7394,0.5123]],[[0.2306,0.265,0.4944,0.5187],[0.5026,0.2595,0.741,0.5135]],[[0.2297,0.2644,0.495,0.5178],[0.503,0.2592,0.7425,0.5147]],[[0.2286,0.2641,0.4953,0.516],[0.5033,0.2592,0.7444,0.516]],[[0.2276,0.2638,0.4958,0.516],[0.5036,0.2589,0.7464,0.5172]],[[0.2264,0.2632,0.4964,0.5181],[0.5042,0.2583,0.7481,0.5184]],[[0.2252,0.2629,0.4967,0.5209],[0.5049,0.258,0.75,0.5197]],[[0.2241,0.2626,0.4972,0.5218],[0.5054,0.2577,0.7521,0.5206]],[[0.2229,0.262,0.4977,0.5215],[0.5057,0.2571,0.7543,0.5215]],[[0.2217,0.2617,0.4981,0.5221],[0.5062,0.2568,0.7566,0.523]],[[0.2205,0.2614,0.4986,0.5243],[0.5069,0.2564,0.7585,0.5243]],[[0.2189,0.2607,0.4993,0.527],[0.5078,0.2558,0.7589,0.5252]],[[0.2174,0.2601,0.4998,0.5289],[0.5087,0.2552,0.758,0.5267]],[[0.2158,0.2595,0.5002,0.5298],[0.5092,0.2546,0.7561,0.5283]],[[0.2141,0.2592,0.5007,0.5301],[0.5097,0.2543,0.7535,0.5295]],[[0.2127,0.2589,0.5014,0.5307],[0.5103,0.2541,0.7538,0.5308]],[[0.2115,0.2583,0.5021,0.5329],[0.5109,0.2536,0.7566,0.5321]],[[0.2097,0.258,0.5028,0.5353],[0.5117,0.2532,0.758,0.5333]],[[0.2078,0.2577,0.5033,0.5362],[0.5125,0.2528,0.7576,0.5347]],[[0.2062,0.2571,0.5036,0.5369],[0.5132,0.2521,0.7587,0.5365]],[[0.2049,0.2564,0.5042,0.5384],[0.5137,0.2515,0.7608,0.5384]],[[0.2033,0.2558,0.5049,0.5402],[0.5142,0.2509,0.7627,0.5402]],[[0.2016,0.2552,0.5056,0.5418],[0.5149,0.2503,0.7651,0.5421]],[[0.2,0.2546,0.5062,0.5433],[0.5156,0.2497,0.7665,0.5439]],[[0.1984,0.254,0.5069,0.5451],[0.5165,0.2491,0.7667,0.5458]],[[0.1965,0.2534,0.5076,0.547],[0.5174,0.2482,0.7681,0.5479]],[[0.1946,0.2528,0.5083,0.5488],[0.5181,0.2472,0.7708,0.5501]],[[0.1929,0.2521,0.509,0.5507],[0.5188,0.2466,0.7724,0.5516]],[[0.191,0.2515,0.5097,0.5525],[0.5194,0.246,0.774,0.5531]],[[0.1889,0.2506,0.5104,0.5544],[0.5201,0.2454,0.7767,0.5553]],[[0.187,0.2497,0.5113,0.5565],[0.521,0.2448,0.7797,0.5577]],[[0.1852,0.2491,0.5123,0.5587],[0.522,0.2442,0.7839,0.5602]],[[0.1835,0.2482,0.5132,0.5605],[0.5229,0.2432,0.7891,0.5623]],[[0.1814,0.2472,0.5139,0.5627],[0.5238,0.2423,0.7932,0.5642]],[[0.179,0.2466,0.5146,0.5651],[0.5248,0.2417,0.795,0.5663]],[[0.1769,0.246,0.5153,0.5676],[0.5259,0.2408,0.7991,0.5688]],[[0.1748,0.2454,0.5161,0.5697],[0.5269,0.2399,0.8087,0.5709]],[[0.1724,0.2445,0.5172,0.5716],[0.5278,0.2389,0.8186,0.5734]],[[0.17,0.2432,0.5182,0.5737],[0.5286,0.2377,0.8241,0.5768]],[[0.1674,0.242,0.5193,0.5762],[0.5297,0.2368,0.829,0.5795]],[[0.1648,0.2411,0.5203,0.5786],[0.5307,0.2359,0.8368,0.5817]],[[0.1623,0.2405,0.5214,0.5811],[0.5318,0.2346,0.8441,0.5845]],[[0.1602,0.2399,0.5222,0.5835],[0.5326,0.234,0.8488,0.5872]],[[0.158,0.2389,0.5231,0.5863],[0.5337,0.2334,0.8545,0.59]],[[0.1549,0.2374,0.5243,0.5894],[0.5352,0.2316,0.8668,0.5931]],[[0.1521,0.2362,0.5255,0.5921],[0.5365,0.2297,0.8766,0.5958]],[[0.1493,0.2356,0.5266,0.5949],[0.5373,0.2285,0.8797,0.5989]],[[0.146,0.2346,0.5276,0.598],[0.5387,0.2276,0.8835,0.6026]],[[0.1434,0.2334,0.5286,0.6007],[0.5401,0.227,0.8887,0.6057]],[[0.1408,0.2322,0.5299,0.6035],[0.5411,0.2257,0.8953,0.6081]],[[0.1377,0.2313,0.5311,0.6069],[0.5424,0.2239,0.9019,0.6109]],[[0.1345,0.2303,0.5321,0.6103],[0.5437,0.2224,0.9078,0.6143]],[[0.1313,0.2291,0.5333,0.6133],[0.5453,0.2211,0.9137,0.6179]],[[0.128,0.2282,0.5347,0.6167],[0.547,0.2199,0.9196,0.6216]],[[0.1248,0.2273,0.5361,0.6204],[0.5486,0.2184,0.9255,0.6253]],[[0.1212,0.2257,0.5375,0.6238],[0.55,0.2165,0.9318,0.629]],[[0.1172,0.2239,0.5389,0.6268],[0.5514,0.2147,0.9384,0.633]],[[0.1137,0.2224,0.5405,0.6302],[0.553,0.2128,0.9448,0.637]],[[0.1104,0.2211,0.5422,0.6339],[0.5549,0.2113,0.9512,0.641]],[[0.1068,0.2196,0.5437,0.6376],[0.5568,0.2098,0.958,0.6456]],[[0.1031,0.2178,0.5453,0.6416],[0.5583,0.2076,0.9651,0.6499]],[[0.0995,0.2162,0.547,0.6459],[0.5599,0.2055,0.9722,0.6539]],[[0.0955,0.215,0.5488,0.6499],[0.5618,0.2039,0.9793,0.6582]],[[0.0913,0.2135,0.5507,0.6536],[0.5639,0.2024,0.987,0.6622]],[[0.087,0.2113,0.5526,0.6576],[0.5657,0.2004,0.9981,0.6661]],[[0.0825,0.2092,0.5543,0.6619],[0.5673,0.1984,1.0128,0.6706]],[[0.078,0.2073,0.5563,0.6662],[0.5689,0.1964,1.0253,0.6753]],[[0.0734,0.2055,0.5583,0.6705],[0.5709,0.1943,1.0355,0.6799]],[[0.0686,0.2036,0.5604,0.6751],[0.5728,0.1921,1.0458,0.6846]],[[0.0632,0.2015,0.5623,0.6803],[0.5748,0.19,1.0564,0.6894]],[[0.0578,0.199,0.5642,0.6855],[0.5769,0.1877,1.0672,0.6943]],[[0.0524,0.1966,0.5665,0.6904],[0.5789,0.1855,1.0783,0.6993]],[[0.0467,0.1941,0.5689,0.6956],[0.5811,0.1831,1.0895,0.7044]],[[0.041,0.1916,0.5714,0.7012],[0.5832,0.1808,1.1011,0.7096]],[[0.0351,0.1892,0.5738,0.7067],[0.5854,0.1783,1.1128,0.7148]],[[0.0285,0.1864,0.5764,0.7128],[0.5877,0.1759,1.1249,0.7202]],[[0.0215,0.1834,0.5792,0.7196],[0.5899,0.1733,1.1371,0.7256]],[[0.0146,0.1803,0.5819,0.726],[0.5923,0.1707,1.1496,0.7311]],[[0.009,0.1779,0.5843,0.7312],[0.5946,0.1681,1.1624,0.7368]],[[0.005,0.1763,0.5863,0.7354],[0.597,0.1654,1.1755,0.7425]],[[-0.0,0.1744,0.5885,0.7403],[0.5995,0.1626,1.1887,0.7483]],[[-0.0063,0.1716,0.5912,0.7463],[0.602,0.1598,1.2023,0.7542]],[[-0.0128,0.1689,0.5939,0.7524],[0.6045,0.157,1.2161,0.7602]],[[-0.0193,0.166,0.5967,0.7585],[0.6071,0.1541,1.2302,0.7663]],[[-0.026,0.1631,0.5995,0.7648],[0.6098,0.1511,1.2445,0.7725]],[[-0.0328,0.1602,0.6024,0.7712],[0.6124,0.148,1.2591,0.7789]],[[-0.0398,0.1572,0.6054,0.7777],[0.6152,0.145,1.274,0.7853]],[[-0.0469,0.1541,0.6084,0.7843],[0.6179,0.1418,1.2891,0.7918]]];
    // pantallas medidas sobre el cuadro del loop (llegada, encendido y Play): exactas al píxel
    var STILL = [[0.2424,0.2666,0.4917,0.5123],[0.4993,0.2617,0.7243,0.5061]];
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
    var SFX = { room: .5, power: .7, screens: .55, dolly: .6, play: .6, shutter: .55, hit: .4, music: .6 };
    function ensureAudio() {
      if (AC) return; AC = new (window.AudioContext || window.webkitAudioContext)();
      Object.keys(SFX).forEach(function (k) { fetch("assets/set/sfx/" + k + ".mp3").then(function (r) { return r.arrayBuffer(); }).then(function (a) { return AC.decodeAudioData(a); }).then(function (b) { buf[k] = b; if (k === "room" && sound) startRoom(); if (k === "music" && sound) musicPlay(); }).catch(function () {}); });
    }
    function sfx(k, delay, len) {
      if (!sound || !AC || !buf[k]) return; var s = AC.createBufferSource(), g = AC.createGain(), t = AC.currentTime + (delay || 0);
      s.buffer = buf[k]; g.gain.value = SFX[k]; s.connect(g); g.connect(AC.destination); s.start(t);
      if (len) { g.gain.setValueAtTime(SFX[k], t + len * .6); g.gain.linearRampToValueAtTime(0, t + len); s.stop(t + len + .05); }
    }
    function startRoom() { if (room || !buf.room) return; room = AC.createBufferSource(); room.buffer = buf.room; room.loop = true; roomGain = AC.createGain(); roomGain.gain.value = 0; room.connect(roomGain); roomGain.connect(AC.destination); room.start(); roomGain.gain.linearRampToValueAtTime(SFX.room, AC.currentTime + 2.5); }
    function stopRoom(d) { if (!roomGain) return; roomGain.gain.linearRampToValueAtTime(0, AC.currentTime + (d || .6)); var r = room; room = null; roomGain = null; setTimeout(function () { try { r.stop(); } catch (e) {} }, (d || .6) * 1000 + 100); }
    function beep(f, d, v) { if (!sound || !AC) return; var o = AC.createOscillator(), g = AC.createGain(); o.type = "sine"; o.frequency.value = f; g.gain.value = v || .05; g.gain.exponentialRampToValueAtTime(.0001, AC.currentTime + d); o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + d); }
    /* música del tráiler: arranca con el montaje y se puede encender a mitad (entra en el segundo que va) */
    var mSrc = null, mGain = null;
    function musicPlay() {
      if (!sound || !AC || !buf.music || mSrc || (state !== "edit" && state !== "logo") || !montOn) return;
      var off = state === "logo" ? VID + (performance.now() - logoT) / 1000 : (mont.currentTime || 0);
      if (off > buf.music.duration - .5) return;
      mSrc = AC.createBufferSource(); mGain = AC.createGain(); mSrc.buffer = buf.music; mGain.gain.value = 0;
      mSrc.connect(mGain); mGain.connect(AC.destination); mSrc.start(0, Math.max(0, off));
      mGain.gain.linearRampToValueAtTime(SFX.music, AC.currentTime + .8);
    }
    function musicStop(d) {
      if (!mSrc) return; var s_ = mSrc, g = mGain; mSrc = null; mGain = null; d = d || .3;
      g.gain.cancelScheduledValues(AC.currentTime); g.gain.setValueAtTime(g.gain.value, AC.currentTime); g.gain.linearRampToValueAtTime(0, AC.currentTime + d);
      setTimeout(function () { try { s_.stop(); } catch (e) {} }, d * 1000 + 80);
    }
    $("set-snd").addEventListener("click", function () {
      sound = !sound; this.setAttribute("aria-pressed", sound);
      ensureAudio(); if (AC.state === "suspended") AC.resume();
      if (sound) { if (state !== "edit" && state !== "logo") startRoom(); musicPlay(); } else { stopRoom(); musicStop(.3); }
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
      if (state !== "idle") return; clearTimeout(autoT); state = "booting"; tBoot = performance.now();
      sfx("power"); sfx("screens", .9);
      hitPc.hidden = true; ring.style.opacity = 0; hintPc.style.opacity = 0; hello.classList.add("gone");
      play(scr);
      setTimeout(function () { state = "ready"; tState = performance.now(); hitPlay.hidden = false; hitPlay.focus({ preventScroll: true }); }, 2400);
    }
    function goPlay() {
      if (state !== "ready") return; state = "dolly"; tState = performance.now();
      try { sessionStorage.setItem("ap-rec", "1"); localStorage.setItem("ap-set", "1"); } catch (e) {}
      sfx("play"); sfx("dolly", .02, 1.2);
      hitPlay.hidden = true; hintPlay.style.opacity = 0; tag.style.opacity = 0;
      dol.currentTime = 0; dol.playbackRate = 1.13; play(dol); // 1,13 s de video → 1 s
    }
    hitPc.addEventListener("click", powerOn); $("set-power").addEventListener("click", powerOn);
    hitPlay.addEventListener("click", goPlay);
    dol.addEventListener("ended", function () { if (state === "dolly") startEdit(); });

    /* ---------- Edición en vivo ---------- */
    // tiempos en segundos. Tráiler (montaje.mp4) de VID s con fundidos a negro entre capítulos; el logo sale después.
    var LEAD = 1.8, PER = .6, VID = 24.64, END = LEAD + VID; // el montaje empieza en LEAD
    var BEATS = [[1.8, 4.56], [6.16, 9.52], [11.12, 14.32], [15.92, 20.44], [20.44, 24.64]]; // planos (empuje lento de cámara por plano)
    // segmentos del montaje (segundos del video): planos y títulos (pista V2)
    var SHOTS = [[1.8, 4.56, "telecafe", "Por encima de la mesa"], [6.16, 9.52, "paisajes", "Paisajes Íntimos"], [11.12, 14.32, "austin", "Austin Marchese"], [15.92, 18.2, "lacepa", "La Cepa"], [18.2, 20.44, "pregon", "Pregón de la plaza"], [20.44, 24.64, "campo", "Por encima de la mesa"]];
    var TITLES = [[.25, 1.65, "Alex Pino presenta", "s"], [4.7, 6.1, "Grabo."], [9.66, 11.06, "Edito."], [14.46, 15.86, "Cuento historias."], [21.3, 24.1, "¿Quién soy?", "b"]];
    var logoEl = $("set-logo"), logoSub = $("set-logo-sub"), logoT = 0, nle = $("nle"), v1 = $("nle-v1"), v2 = $("nle-v2"), ruler = $("nle-ruler"), head = $("nle-head"), lead = $("nle-lead"), leadN = $("nle-n"), ttl = $("nle-ttl"), nTc = $("nle-tc");
    function pct(t) { return (t / END * 100).toFixed(3) + "%"; }
    var html = '<span class="nle-clip lead" style="left:0;width:calc(' + pct(LEAD) + ' - 2px)"><em>Leader 3·2·1</em></span>';
    SHOTS.forEach(function (s, i) { html += '<span class="nle-clip" style="left:' + pct(LEAD + s[0]) + ';width:calc(' + pct(s[1] - s[0]) + ' - 2px);--i:' + (i + 1) + '"><img src="assets/set/clips/' + s[2] + '.jpg" alt=""><em>' + s[3] + "</em></span>"; });
    v1.innerHTML = html;
    v2.innerHTML = TITLES.map(function (t, i) { return '<span class="nle-clip ttl" style="left:' + pct(LEAD + t[0]) + ';width:calc(' + pct(t[1] - t[0]) + ' - 2px);--i:' + (i + 2) + '"><em>T · ' + T_(t[2]) + "</em></span>"; }).join("");
    ttl.innerHTML = TITLES.map(function (t) { return '<span class="' + (t[3] || "") + '">' + T_(t[2]) + "</span>"; }).join("");
    var ttlEls = ttl.children, rh = "";
    for (var r = 0; r <= END; r += 5) rh += '<span style="left:' + pct(r) + '">' + tc(r).slice(3, 8) + "</span>";
    ruler.innerHTML = rh;
    if (logoSub) logoSub.textContent = T_("Diseñador Crossmedia").toUpperCase();
    var tEdit = 0, lastTitle = -1, lastN = 0, montOn = false;
    function startEdit() {
      state = "edit"; tEdit = performance.now(); lastTitle = -1; lastN = 0; montOn = false;
      set.classList.add("editing"); stopRoom(.8);
      try { mont.currentTime = 0; } catch (e) {}
    }
    function editTime() { return montOn ? LEAD + (mont.currentTime || 0) : (performance.now() - tEdit) / 1000; }
    function tickEdit() {
      var t = editTime();
      if (!montOn && t >= LEAD) { montOn = true; play(mont); }
      if (montOn) musicPlay();
      // leader 3·2·1
      var n = t < LEAD ? Math.ceil((LEAD - t) / PER) : 0;
      lead.classList.toggle("on", n > 0);
      if (n !== lastN) { lastN = n; if (n > 0) { leadN.textContent = n; leadN.classList.remove("tick"); void leadN.offsetWidth; leadN.classList.add("tick"); beep(1000, .12, .035); } }
      // títulos (pista V2), sincronizados con el montaje
      var m = t - LEAD, on = -1;
      if (m >= 0) for (var i = 0; i < TITLES.length; i++) if (m >= TITLES[i][0] && m < TITLES[i][1]) on = i;
      if (on !== lastTitle) { for (var j = 0; j < ttlEls.length; j++) ttlEls[j].classList.toggle("on", j === on); if (on >= 0) sfx("hit"); lastTitle = on; }
      // empuje lento de cámara dentro de cada plano
      var z = 1;
      for (var q = 0; q < BEATS.length; q++) if (m >= BEATS[q][0] && m < BEATS[q][1]) z = 1 + .045 * ((m - BEATS[q][0]) / (BEATS[q][1] - BEATS[q][0]));
      mont.style.transform = z > 1 ? "scale(" + z.toFixed(4) + ")" : "";
      head.style.left = pct(Math.min(END, t));
      nTc.textContent = tc(t);
      if ((t >= END - .03 || mont.ended) && state === "edit") startLogo();
    }
    /* fundido a negro → el editor se disuelve → logo animado → obturador y portada */
    function startLogo() {
      state = "logo"; logoT = performance.now(); mont.style.transform = ""; musicPlay();
      set.classList.add("logo");
      setTimeout(function () { logoEl.classList.add("go"); }, 700);
      setTimeout(function () { finish(false); }, 700 + 4700);
    }

    /* ---------- salida a la portada ---------- */
    var done = false;
    function finish(fast) {
      if (done) return; done = true;
      try { sessionStorage.setItem("ap-rec", "1"); localStorage.setItem("ap-set", "1"); } catch (e) {}
      sfx("shutter"); stopRoom(1.2); musicStop(1.1);
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
    var autoT = setTimeout(powerOn, 1500);
    function early(e) { if (e && e.target && e.target.closest && e.target.closest(".set-bar")) return; powerOn(); }
    set.addEventListener("pointerdown", early); addEventListener("wheel", early, { passive: true }); addEventListener("keydown", function (e) { if (e.key !== "Escape" && e.key !== "Tab") early(e); });

    /* ---------- dibujo ---------- */
    function frame(now) {
      if (done && !document.body.contains(set)) return;
      var V = view(), sinceS = (now - tState) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = "#030405"; ctx.fillRect(0, 0, W, H);
      var z = 1, cx = W / 2, cy = H / 2, src = amb, fi = 0;
      if (state === "dolly" || state === "edit" || state === "logo") { src = dol; fi = Math.min(TRK.length - 1, (dol.currentTime || 0) * 84); }
      // un solo movimiento directo a la pantalla izquierda
      if (state === "dolly" || state === "edit" || state === "logo") {
        var k = state === "dolly" ? ease(clamp((dol.currentTime || 0) / (dol.duration || 1.13), 0, 1)) : 1;
        var i0 = Math.floor(fi), tt = fi - i0, P = TRK[i0][0], Q = TRK[Math.min(TRK.length - 1, i0 + 1)][0];
        var L = [P[0] + (Q[0] - P[0]) * tt, P[1] + (Q[1] - P[1]) * tt, P[2] + (Q[2] - P[2]) * tt, P[3] + (Q[3] - P[3]) * tt];
        var a = toScreen(V, L[0], L[1]), b = toScreen(V, L[2], L[3]);
        z = 1 + (Math.max(W / (b[0] - a[0]), H / (b[1] - a[1])) * 1.03 - 1) * k;
        cx = W / 2 + ((a[0] + b[0]) / 2 - W / 2) * k; cy = H / 2 + ((a[1] + b[1]) / 2 - H / 2) * k;
      }
      if (state !== "edit" && state !== "logo") {
        ctx.setTransform(dpr * z, 0, 0, dpr * z, dpr * (W / 2 - cx * z), dpr * (H / 2 - cy * z));
        ctx.translate(V.ox, V.oy); ctx.scale(V.s, V.s);
        if (src.readyState >= 2) ctx.drawImage(src, 0, 0, IW, IH); else if (poster.complete && poster.naturalWidth) ctx.drawImage(poster, 0, 0, IW, IH);
        if (V.oy > 0) { var fg = ctx.createLinearGradient(0, 0, 0, IH); fg.addColorStop(0, "rgba(3,4,5,1)"); fg.addColorStop(.06, "rgba(3,4,5,0)"); fg.addColorStop(.94, "rgba(3,4,5,0)"); fg.addColorStop(1, "rgba(3,4,5,1)"); ctx.fillStyle = fg; ctx.fillRect(0, 0, IW, IH); }
        var j0 = Math.floor(fi), t2 = fi - j0, A = TRK[j0], B = TRK[Math.min(TRK.length - 1, j0 + 1)];
        var rr = function (q) { return [A[q][0] + (B[q][0] - A[q][0]) * t2, A[q][1] + (B[q][1] - A[q][1]) * t2, A[q][2] + (B[q][2] - A[q][2]) * t2, A[q][3] + (B[q][3] - A[q][3]) * t2]; };
        var still = state === "idle" || state === "booting" || state === "ready";
        var Lr = still ? STILL[0] : rr(0), Rr = still ? STILL[1] : rr(1);
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
          var hp = toScreen(V, .925, .245); hintPc.style.left = clamp(hp[0] - hintPc.offsetWidth / 2, 12, W - hintPc.offsetWidth - 12) + "px"; hintPc.style.top = (hp[1] - 6) + "px";
          hintPc.style.opacity = (now - tState) > 4200 ? 1 : 0;
        }
        if (state === "ready") {
          place(hitPlay, V, Lr, 0);
          var hq = toScreen(V, (Lr[0] + Lr[2]) / 2, Lr[1]); hintPlay.style.left = clamp(hq[0] - hintPlay.offsetWidth / 2, 12, W - hintPlay.offsetWidth - 12) + "px"; hintPlay.style.top = (hq[1] - 26) + "px";
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
