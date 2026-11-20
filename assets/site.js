/* Cargochain Logistics — site behavior */
(function () {
  "use strict";

  // ===== SETTINGS =====
  // Every form is emailed to `email` through FormSubmit (formsubmit.co, free, no account).
  // If formEndpoint is emptied, forms fall back to opening the visitor's email app.
  var CONFIG = {
    formEndpoint: "https://formsubmit.co/ajax/info@cargochainlogistics.com",
    email: "info@cargochainlogistics.com"
  };
  // ==========================================

  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Forms
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    function show(kind, msg) {
      if (!status) return;
      status.className = "form-status " + kind;
      status.textContent = msg;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var data = new FormData(form);
      if (data.get("_gotcha")) return; // bot honeypot
      data.delete("_gotcha");
      var subject = "Website: " + form.getAttribute("data-form");
      data.append("_subject", subject);
      var btn = form.querySelector("[type=submit]");

      if (!CONFIG.formEndpoint) {
        var lines = [];
        data.forEach(function (v, k) { if (k.charAt(0) !== "_") lines.push(k + ": " + v); });
        window.location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(lines.join("\n"));
        show("ok", "Your email app should open with your answers filled in. Just hit send.");
        return;
      }

      // Flatten to JSON; checkbox groups become one comma-separated value.
      var payload = {};
      data.forEach(function (v, k) { payload[k] = payload[k] ? payload[k] + ", " + v : v; });
      payload._template = "table";
      payload._captcha = "false";
      payload["Submitted from"] = location.href;

      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending…"; }
      fetch(CONFIG.formEndpoint, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json", Accept: "application/json" }
      })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (!res.ok || String(res.j.success) !== "true") throw new Error(res.j.message || "failed");
          form.reset();
          show("ok", form.getAttribute("data-success") || "Thanks! We received it and will contact you within one business day.");
          if (window.gtag) window.gtag("event", "generate_lead", { form: form.getAttribute("data-form") });
        })
        .catch(function () {
          show("err", "Sorry, that didn't go through. Please call (513) 572-7202 or email " + CONFIG.email + ".");
        })
        .then(function () { if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label; } });
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
    tabs.forEach(function (t) { t.addEventListener("click", function () { select(t); }); });
    if (location.hash) {
      var target = list.querySelector('[aria-controls="' + location.hash.slice(1) + '"]');
      if (target) select(target);
    }
  });

  // Owner-operator earnings calculator
  var calc = document.getElementById("calc");
  if (calc) {
    var fmt = function (n) { return (n < 0 ? "-$" : "$") + Math.abs(Math.round(n)).toLocaleString("en-US"); };
    var val = function (id) { return parseFloat(document.getElementById(id).value) || 0; };
    var run = function () {
      var miles = val("c-miles"), rpm = val("c-rpm"), ins = val("c-ins"), fact = val("c-fact") / 100;
      var mpg = val("c-mpg") || 1, fuel = val("c-fuel"), fixed = val("c-fixed");
      var gross = miles * rpm;
      var fee = gross * 0.12;
      var factCost = gross * fact;
      var fuelCost = (miles / mpg) * fuel;
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
