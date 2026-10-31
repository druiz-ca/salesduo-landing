// Contador propio de visitas (panel Pulso). Sin cookies ni identificadores:
// solo página, dominio de origen, UTM y móvil/escritorio. No necesita consentimiento.
(function () {
  if (location.hostname === 'localhost' || navigator.webdriver) return;
  if (/bot|crawl|spider|preview|headless|lighthouse/i.test(navigator.userAgent)) return;

  var params = new URLSearchParams(location.search);
  var ref = '';
  try {
    var host = document.referrer ? new URL(document.referrer).hostname : '';
    if (host && host !== location.hostname) ref = host;
  } catch (e) {}

  fetch('https://inittfoncokipzshcqzl.supabase.co/rest/v1/rpc/registrar_visita', {
    method: 'POST',
    keepalive: true,
    headers: {
      'Content-Type': 'application/json',
      apikey: 'sb_publishable__MC5FEC14vG4Je_R3Xm-mg_Shf6GzAu'
    },
    body: JSON.stringify({
      p_path: location.pathname,
      p_referrer: ref,
      p_utm_source: params.get('utm_source') || '',
      p_utm_campaign: params.get('utm_campaign') || '',
      p_dispositivo: matchMedia('(max-width: 768px)').matches ? 'movil' : 'escritorio'
    })
  }).catch(function () {});
})();
