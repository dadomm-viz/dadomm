(function(){
	"use strict";
	function init(){
		var isMobile = window.matchMedia("(max-width: 767px)").matches;
		var videos = document.querySelectorAll(".hero-video[data-src-desktop]");
		for(var i=0;i<videos.length;i++){
			var v = videos[i];
			var mobileSrc = v.getAttribute("data-src-mobile");
			var src = (isMobile && mobileSrc) ? mobileSrc : v.getAttribute("data-src-desktop");
			if(!src) continue;
			v.src = src;
			v.load();
		}
	}
	if(document.readyState === "loading"){
		document.addEventListener("DOMContentLoaded", init);
	}else{
		init();
	}
})();
