(function(){
	"use strict";
	var CONSENT_KEY = "dadomm_cookie_consent";
	var MAX_AGE_DAYS = 365;
	var GA_ID = "G-2TVC85N9QY";

	function getConsent(){
		try{
			var raw = localStorage.getItem(CONSENT_KEY);
			if(!raw) return null;
			var data = JSON.parse(raw);
			if(typeof data.timestamp !== "number") return null;
			var ageDays = (Date.now() - data.timestamp) / (1000*60*60*24);
			if(ageDays > MAX_AGE_DAYS) return null;
			return data;
		}catch(e){
			return null;
		}
	}

	function setConsent(analytics){
		try{
			localStorage.setItem(CONSENT_KEY, JSON.stringify({analytics: !!analytics, timestamp: Date.now()}));
		}catch(e){}
	}

	function loadAnalytics(){
		if(window.__dadommGaLoaded) return;
		window.__dadommGaLoaded = true;
		window.dataLayer = window.dataLayer || [];
		function gtag(){ window.dataLayer.push(arguments); }
		window.gtag = gtag;
		var s = document.createElement("script");
		s.async = true;
		s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
		document.head.appendChild(s);
		gtag("js", new Date());
		gtag("config", GA_ID);
	}

	var STRINGS = {
		en: {
			ariaLabel: "Cookie consent",
			text: 'We use cookies to run this site and, only with your consent, to understand how it is used. See our <a href="/cookies/">Cookie Policy</a> for details.',
			customize: "Customize",
			reject: "Reject",
			accept: "Accept All",
			essential: "Essential cookies",
			alwaysActive: "Always active",
			analytics: "Analytics cookies (Google Analytics)",
			save: "Save preferences"
		},
		es: {
			ariaLabel: "Consentimiento de cookies",
			text: 'Usamos cookies para que este sitio funcione y, solo con tu consentimiento, para entender cómo se usa. Consulta nuestra <a href="/es/cookies/">Política de Cookies</a> para más información.',
			customize: "Personalizar",
			reject: "Rechazar",
			accept: "Aceptar todo",
			essential: "Cookies esenciales",
			alwaysActive: "Siempre activas",
			analytics: "Cookies analíticas (Google Analytics)",
			save: "Guardar preferencias"
		}
	};

	function getLang(){
		var l = (document.documentElement.getAttribute("lang") || "en").slice(0, 2).toLowerCase();
		return STRINGS[l] ? l : "en";
	}

	function buildBanner(){
		var lang = getLang();
		var t = STRINGS[lang];
		var el = document.createElement("div");
		el.id = "cookie-consent-banner";
		el.setAttribute("role", "dialog");
		el.setAttribute("aria-live", "polite");
		el.setAttribute("aria-label", t.ariaLabel);
		el.innerHTML =
			'<div class="cc-inner">' +
				'<p class="cc-text">' + t.text + '</p>' +
				'<div class="cc-actions">' +
					'<button type="button" class="cc-btn" data-cc="customize">' + t.customize + '</button>' +
					'<button type="button" class="cc-btn" data-cc="reject">' + t.reject + '</button>' +
					'<button type="button" class="cc-btn" data-cc="accept">' + t.accept + '</button>' +
				'</div>' +
			'</div>' +
			'<div class="cc-panel" id="cc-panel">' +
				'<div class="cc-panel-row"><span>' + t.essential + '</span><span class="cc-panel-note">' + t.alwaysActive + '</span></div>' +
				'<div class="cc-panel-row"><label><input type="checkbox" id="cc-analytics-toggle"> ' + t.analytics + '</label></div>' +
				'<div class="cc-panel-actions"><button type="button" class="cc-btn" data-cc="save">' + t.save + '</button></div>' +
			'</div>';
		document.body.appendChild(el);
		return el;
	}

	function show(el){ el.classList.add("cc-visible"); }
	function hide(el){ el.classList.remove("cc-visible"); }

	function init(){
		var banner = buildBanner();
		var panel = banner.querySelector("#cc-panel");
		var toggle = banner.querySelector("#cc-analytics-toggle");

		banner.addEventListener("click", function(e){
			var action = e.target && e.target.getAttribute && e.target.getAttribute("data-cc");
			if(!action) return;
			if(action === "accept"){
				setConsent(true);
				loadAnalytics();
				hide(banner);
			}else if(action === "reject"){
				setConsent(false);
				hide(banner);
			}else if(action === "customize"){
				panel.classList.toggle("cc-panel-open");
			}else if(action === "save"){
				var allow = !!(toggle && toggle.checked);
				setConsent(allow);
				if(allow) loadAnalytics();
				hide(banner);
			}
		});

		var consent = getConsent();
		if(consent === null){
			show(banner);
		}else if(consent.analytics){
			loadAnalytics();
		}
	}

	if(document.readyState === "loading"){
		document.addEventListener("DOMContentLoaded", init);
	}else{
		init();
	}

	window.dadommCookieConsent = {
		reset: function(){
			try{ localStorage.removeItem(CONSENT_KEY); }catch(e){}
			location.reload();
		},
		get: getConsent
	};
})();
