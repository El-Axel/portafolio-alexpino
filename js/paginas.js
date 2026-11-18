/* ==========================================================================
   Sobre mí: los tres verbos con sus pruebas y el "casting" de papeles
   ========================================================================== */
(function () {
  "use strict";
  var D = window.PORTFOLIO || {}, APP = window.APP || {}, U = APP.u;
  if (!U) return;
  var $ = U.$, $$ = U.$$, esc = U.esc, pad = U.pad;
  var S = D.sobre || {}, P = D.destacados || [];
  var byId = {}; P.forEach(function (p, i) { p._n = i + 1; byId[p.id] = p; });

  // Departamentos: Grabo. Edito. Cuento. — cada verbo con las escenas donde se ve (como en los créditos)
  var verbs = $("#verbs");
  if (verbs) {
    var colors = ["var(--teal)", "var(--sand)", "var(--peach)"];
    verbs.innerHTML = (S.pasos || []).map(function (v, i) {
      var pr = (v.pruebas || []).map(function (id) { return byId[id]; }).filter(Boolean);
      return '<article class="cr-dep reveal" style="--c:' + colors[i % 3] + ';--i:' + i + '"><h3>' + esc(v.verbo) + ".</h3><p>" + esc(v.texto) + "</p>" +
        (pr.length ? '<p class="cr-k">En escena</p><p class="cr-in">' + pr.map(function (p) {
          return '<a href="' + esc(p.pagina) + '">' + esc(p.titulo.split(" · ")[0]) + "</a>";
        }).join(" · ") + ' <i aria-hidden="true">→</i></p>' : "") + "</article>";
    }).join("");
  }
  // el enlace del CV sale de data.js
  var cvA = $("#cv-dl"); if (cvA && S.cv) cvA.href = S.cv;

  // Depende del proyecto: un papel por escena, como en un casting
  var cast = $("#casting");
  if (cast && P.length) {
    cast.innerHTML = '<div class="cast-tabs" role="tablist" aria-label="Proyectos">' + P.map(function (p, i) {
      return '<button type="button" role="tab" class="ct' + (i === 0 ? " on" : "") + '" aria-selected="' + (i === 0) + '" data-i="' + i + '"><small>Escena ' + pad(i + 1) + "</small>" + esc(p.titulo.split(" · ")[0]) + "</button>";
    }).join("") + '</div><div class="cast-panel" role="tabpanel" aria-live="polite"></div>';
    var panel = $(".cast-panel", cast), cur = 0, timer = 0;
    function show(i) {
      cur = i; var p = P[i];
      $$(".ct", cast).forEach(function (b) { var on = +b.dataset.i === i; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
      panel.innerHTML = '<p class="cp-q">¿Quién soy en ' + esc(p.titulo.split(" · ")[0]) + "?</p>" +
        '<p class="cp-a">Soy <em>' + esc(p.soy || "") + "</em>.</p>" +
        '<p class="cp-roles">' + (p.roles || []).map(function (r) { return '<span class="chip">' + esc(r) + "</span>"; }).join("") + "</p>" +
        '<a class="see-also" href="' + esc(p.pagina) + '">Entrar a la escena →</a>';
      panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
    }
    cast.addEventListener("click", function (e) { var b = e.target.closest(".ct"); if (b) { clearInterval(timer); show(+b.dataset.i); } });
    show(0);
    if (!APP.reduce) {
      timer = setInterval(function () { show((cur + 1) % P.length); }, 4200);
      cast.addEventListener("mouseenter", function () { clearInterval(timer); });
      cast.addEventListener("focusin", function () { clearInterval(timer); });
    }
  }

  var rev = $$("#verbs .reveal");
  if (APP.reduce || !("IntersectionObserver" in window)) rev.forEach(function (r) { r.classList.add("in"); });
  else { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" }); rev.forEach(function (r) { io.observe(r); }); }
})();
