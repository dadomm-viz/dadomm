(function(){
	"use strict";
	var LANG_KEY = "dadomm_lang";
	var html = document.documentElement;
	var currentLang = (html.getAttribute("lang") || "en").slice(0, 2).toLowerCase();
	var otherLang = currentLang === "es" ? "en" : "es";

	var altLinkEl = document.querySelector('link[rel="alternate"][hreflang="' + otherLang + '"]');
	var altUrl = altLinkEl ? altLinkEl.getAttribute("href") : null;

	var switchLinks = document.querySelectorAll(".lang-switch-link");
	for (var i = 0; i < switchLinks.length; i++) {
		switchLinks[i].addEventListener("click", function () {
			var target = this.getAttribute("data-lang") || otherLang;
			try { localStorage.setItem(LANG_KEY, target); } catch (e) {}
		});
	}

	try {
		var stored = localStorage.getItem(LANG_KEY);
		if (stored === null) {
			localStorage.setItem(LANG_KEY, currentLang);
		} else if (stored !== currentLang && stored === otherLang && altUrl) {
			location.replace(altUrl);
		}
	} catch (e) {}
})();
