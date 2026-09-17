/* Google Analytics 4 for AllRosters, shared by every page. Load it in <head>, before anything that tracks.

   Consent, as described on /privacy:
   - Analytics runs by default. Ads storage is always denied: the site shows no ads.
   - Visitors in the EEA, the UK and Switzerland default to no analytics cookies (Google then sends
     only cookieless pings).
   - A browser sending Global Privacy Control, or anyone who turns analytics off in the scoreboard's
     settings, gets nothing: the Google tag isn't even loaded.
   - Nothing loads off allrosters.com, so local copies and preview deployments don't pollute reports.

   Usernames never reach Google: page addresses are sent without their ?user= value, and events
   describe what happened, never whose leagues. Pages call arTrack(name, params) and never gtag. */
(function(){
  var ID = "G-Q6NDEXXP11";
  var KEY = "ar_analytics";                       // "off" once someone opts out
  var EUROPE = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LI",
                "LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE","GB","CH"];

  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }

  var optedOut = false, debug = false;
  try{
    optedOut = localStorage.getItem(KEY) === "off";
    debug = localStorage.getItem("ar_analytics_debug") === "1";   // log events to the console; set it by hand
  }catch(e){}
  var gpc = navigator.globalPrivacyControl === true;
  var production = location.hostname === "allrosters.com";
  var demo = /[?&]demo=/.test(location.search);           // simulated scores are never measured
  var on = production && !optedOut && !gpc && !demo;

  if(on){
    var ads = {ad_storage:"denied", ad_user_data:"denied", ad_personalization:"denied"};
    gtag("consent", "default", Object.assign({analytics_storage:"granted"}, ads));
    gtag("consent", "default", Object.assign({analytics_storage:"denied", region:EUROPE}, ads));
    gtag("js", new Date());

    /* the address as the visitor saw it, minus anything that could identify them */
    var url = new URL(location.href);
    url.searchParams.delete("user");
    gtag("config", ID, {page_location: url.toString(), allow_google_signals:false, allow_ad_personalization_signals:false});

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
    document.head.appendChild(s);
  }

  if(debug) console.info("[analytics]", on ? "sending to " + ID : "not sending", {production:production, optedOut:optedOut, gpc:gpc, demo:demo});

  window.arTrack = function(name, params){
    if(debug) console.info("[analytics] event", name, params || {});
    if(on) gtag("event", name, params || {});
  };

  window.arAnalytics = {
    /* "on", "off" (turned off here) or "gpc" (the browser asked, and that can't be overridden here) */
    state: function(){ return gpc ? "gpc" : optedOut ? "off" : "on"; },
    set: function(enabled){
      optedOut = !enabled;
      try{ enabled ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, "off"); }catch(e){}
      if(!enabled){
        on = false;
        window["ga-disable-" + ID] = true;
        gtag("consent", "update", {analytics_storage:"denied"});
      }
      /* turning it back on takes effect on the next page load, when the tag loads fresh */
    }
  };
})();
