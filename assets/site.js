/* Cargochain Logistics — site behavior */
(function () {
  "use strict";

  // Progressive motion: reveal once, respect reduced-motion preferences.
  var motion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motion && !motion.matches && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("reveal-enter");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".audience-card, .operations-board, .section-head, .section-heading-row, .tms-panel, .service-list article, .step").forEach(function (element, index) {
      element.style.setProperty("--reveal-delay", (index % 3) * 70 + "ms");
      revealObserver.observe(element);
    });
  }

  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    function closeMenu() {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (event) { if (event.target.closest("a")) closeMenu(); });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("open")) { closeMenu(); toggle.focus(); }
    });
    document.addEventListener("click", function (event) {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Native POST keeps provider CAPTCHA enabled, including without JavaScript.
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    var button = form.querySelector("[type=submit]");
    var label = button ? button.textContent : "";
    form.addEventListener("submit", function (event) {
      if (form.dataset.sending === "true" || form.elements._honey.value || !form.reportValidity()) {
        event.preventDefault();
        return;
      }
      form.dataset.sending = "true";
      if (button) { button.disabled = true; button.textContent = "Opening security check…"; }
      // Receipt is confirmed by the provider only after its security check.
    });
    window.addEventListener("pageshow", function () {
      delete form.dataset.sending;
      if (button) { button.disabled = false; button.textContent = label; }
    });
  });

  // Tabs
  document.querySelectorAll("[role=tablist]").forEach(function (list) {
    var tabs = list.querySelectorAll("[role=tab]");
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
    }
    function syncHash() {
      var target = Array.from(tabs).find(function (tab) { return "#" + tab.getAttribute("aria-controls") === location.hash; });
      if (target) select(target);
    }
    tabs.forEach(function (t, index) {
      t.addEventListener("click", function () {
        select(t);
        history.replaceState(null, "", "#" + t.getAttribute("aria-controls"));
      });
      t.addEventListener("keydown", function (event) {
        var next;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); tabs[next].click(); tabs[next].focus(); }
      });
    });
    window.addEventListener("hashchange", syncHash);
    syncHash();
  });

  // Owner-operator earnings calculator
  var calc = document.getElementById("calc");
  if (calc) {
    var fmt = function (n) { return (n < 0 ? "-$" : "$") + Math.abs(Math.round(n)).toLocaleString("en-US"); };
    var val = function (id) {
      var number = Number(document.getElementById(id).value);
      return Number.isFinite(number) ? Math.max(0, number) : 0;
    };
    var run = function () {
      var miles = val("c-miles"), rpm = val("c-rpm"), ins = val("c-ins"), fact = val("c-fact") / 100;
      var mpg = Math.max(1, val("c-mpg")), fuel = val("c-fuel"), fixed = val("c-fixed");
      var gross = miles * rpm;
      var fee = gross * 0.12;
      var factCost = gross * fact;
      var fuelCost = ((miles + val("c-empty")) / mpg) * fuel;
      var net = gross - fee - factCost - ins - fuelCost - fixed;
      document.getElementById("o-gross").textContent = fmt(gross);
      document.getElementById("o-fee").textContent = "-" + fmt(fee);
      document.getElementById("o-fact").textContent = factCost ? "-" + fmt(factCost) : "$0";
      document.getElementById("o-ins").textContent = "-" + fmt(ins);
      document.getElementById("o-fuel").textContent = "-" + fmt(fuelCost);
      document.getElementById("o-fixed").textContent = "-" + fmt(fixed);
      document.getElementById("o-net").textContent = fmt(net);
      document.getElementById("o-year").textContent = fmt(net * 48);
    };
    calc.addEventListener("input", run);
    run();
  }
})();
