/* GDT Daily — section-rail scroll-spy
   No transitions, no animation; matches V's "instant hover" preference. */
(function () {
  "use strict";

  var rail = document.querySelector(".section-rail");
  if (!rail) return;

  var chips = Array.prototype.slice.call(rail.querySelectorAll(".rail-chip"));
  var sections = Array.prototype.slice.call(document.querySelectorAll(".curr-section"));
  if (!chips.length || !sections.length) return;

  var chipBySection = {};
  chips.forEach(function (c) {
    var id = c.getAttribute("data-section");
    if (id) chipBySection[id] = c;
  });

  function setActive(sid) {
    chips.forEach(function (c) {
      var on = c.getAttribute("data-section") === sid;
      c.classList.toggle("is-active", on);
    });
    // Auto-scroll the active chip into view horizontally (mobile rail).
    var active = chipBySection[sid];
    if (active && rail.scrollWidth > rail.clientWidth) {
      var rRect = rail.getBoundingClientRect();
      var aRect = active.getBoundingClientRect();
      if (aRect.left < rRect.left || aRect.right > rRect.right) {
        rail.scrollLeft += (aRect.left - rRect.left) - (rRect.width / 2 - aRect.width / 2);
      }
    }
  }

  if (!("IntersectionObserver" in window)) {
    // Graceful no-op fallback.
    return;
  }

  var visible = {};
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var sid = e.target.getAttribute("data-section");
      if (!sid) return;
      if (e.isIntersecting) {
        visible[sid] = e.intersectionRatio;
      } else {
        delete visible[sid];
      }
    });

    var bestSid = null;
    var bestRatio = -1;
    Object.keys(visible).forEach(function (sid) {
      if (visible[sid] > bestRatio) {
        bestRatio = visible[sid];
        bestSid = sid;
      }
    });
    if (bestSid) setActive(bestSid);
  }, {
    rootMargin: "-30% 0px -55% 0px",
    threshold: [0, 0.25, 0.5, 0.75, 1]
  });

  sections.forEach(function (s) { io.observe(s); });
})();
