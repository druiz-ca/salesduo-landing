// Banner de cookies. Google Analytics y Microsoft Clarity solo se cargan
// cuando la persona pulsa "Aceptar" (consentimiento previo, guía de cookies
// de la AEPD). La decisión se guarda en localStorage; el enlace
// "Configurar cookies" del pie (data-cookie-settings) vuelve a abrir el banner.
(function () {
  var KEY = "sd-cookie-consent"; // "granted" | "denied"
  var GA_ID = "G-Z1P8M6Y2HE";
  var CLARITY_ID = "wc8pd2tonl";
  var PRIVACY_URL = "https://app.salesduo.es/legal/privacidad";
  var loaded = false;

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }

  function loadAnalytics() {
    if (loaded) return;
    loaded = true;

    var ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(ga);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);

    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
  }

  // Al retirar el consentimiento se borran las cookies que ya dejaron.
  function clearAnalyticsCookies() {
    var host = location.hostname.replace(/^www\./, "");
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (/^(_ga|_gid|_gat|_clck|_clsk|CLID|MUID)/.test(name)) {
        ["", "; domain=" + host, "; domain=." + host].forEach(function (d) {
          document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + d;
        });
      }
    });
  }

  var css =
    "#sd-cookies{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;" +
    "background:#0c1018;border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:20px;" +
    "box-shadow:0 10px 40px rgba(0,0,0,0.5);font-family:'DM Sans',system-ui,sans-serif;color:#fff;" +
    "font-size:0.875rem;line-height:1.5;font-weight:300}" +
    "#sd-cookies p{margin:0 0 14px}" +
    "#sd-cookies a{color:#00d4ff;text-decoration:underline;text-underline-offset:2px}" +
    "#sd-cookies .sd-row{display:flex;gap:10px;flex-wrap:wrap}" +
    "#sd-cookies button{flex:1;min-width:120px;padding:0.7rem 1.2rem;border-radius:50px;font:600 0.875rem 'DM Sans',system-ui,sans-serif;cursor:pointer;" +
    "border:1px solid #00d4ff;transition:opacity .2s}" +
    "#sd-cookies button:hover{opacity:.85}" +
    "#sd-cookies .sd-accept{background:#00d4ff;color:#060810}" +
    "#sd-cookies .sd-reject{background:transparent;color:#00d4ff}";

  function showBanner() {
    if (document.getElementById("sd-cookies")) return;
    if (!document.getElementById("sd-cookies-css")) {
      var style = document.createElement("style");
      style.id = "sd-cookies-css";
      style.textContent = css;
      document.head.appendChild(style);
    }
    var box = document.createElement("div");
    box.id = "sd-cookies";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Preferencias de cookies");
    box.innerHTML =
      "<p>Usamos cookies de analítica (Google Analytics y Microsoft Clarity) para saber cuántas personas visitan la web y mejorarla. " +
      "Solo las activamos si aceptas. <a href='" + PRIVACY_URL + "' target='_blank' rel='noopener'>Más información</a></p>" +
      "<div class='sd-row'><button type='button' class='sd-reject'>Rechazar</button>" +
      "<button type='button' class='sd-accept'>Aceptar</button></div>";
    box.querySelector(".sd-accept").addEventListener("click", function () {
      save("granted");
      box.remove();
      loadAnalytics();
    });
    box.querySelector(".sd-reject").addEventListener("click", function () {
      var wasGranted = read() === "granted";
      save("denied");
      box.remove();
      clearAnalyticsCookies();
      // Los scripts ya cargados siguen en memoria: recargar los quita.
      if (wasGranted) location.reload();
    });
    document.body.appendChild(box);
  }

  function init() {
    var choice = read();
    if (choice === "granted") loadAnalytics();
    else if (choice !== "denied") showBanner();

    document.addEventListener("click", function (e) {
      var link = e.target.closest && e.target.closest("[data-cookie-settings]");
      if (!link) return;
      e.preventDefault();
      showBanner();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
