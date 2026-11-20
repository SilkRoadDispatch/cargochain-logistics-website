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
      if (form.dataset.sending === "true") return;
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
      form.dataset.sending = "true";
      form.setAttribute("aria-busy", "true");
      var controller = new AbortController();
      var timeout = setTimeout(function () { controller.abort(); }, 20000);
      fetch(CONFIG.formEndpoint, {
        signal: controller.signal,
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
        .then(function () {
          clearTimeout(timeout);
          form.dataset.sending = "false";
          form.removeAttribute("aria-busy");
          if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label; }
        });
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
