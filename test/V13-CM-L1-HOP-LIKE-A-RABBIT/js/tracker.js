var Tracker = (function(tracker, jquery, underscore){
	var $ = jquery;
	var _ = underscore;
	var _pars = [];
	var _smilPage;
	
	function countElement(element) {
		var currentId = element.getAttribute("id");
		var parIndex = element.getAttribute("parindex");
		var currentPar;
		if(element.classList.contains("mediaoverlay-active")) {
			currentPar = _.find(_pars, function(par){
				return par.id == currentId && par.index == parIndex;
			});
			
			if(currentPar)
				currentPar.count++;
				
			return true;
		}
		
		return false;
	}
	
	function initialize(smilPage){
		if(Mediaoverlay.getURLParam("debug")) {
			var log = function(){
				var output = "";
				_.each(_pars, function(par){
					var parOutput = "<div>";
					parOutput += par.id + " - " + par.text + "[" + par.index + "]" +　" : " + par.count;
					parOutput += "</div>";
					output += parOutput;
				});

				$("#trackerlog").html(output);
			}
	
			var e = $("<div id='trackerlog' style='position:fixed;left:0px;top:30px;padding:5px;width:300px;overflow:auto;height:700px;'>" +
					  "</div>");
			$('body').append(e); 

			setInterval(log, 2000);
		}

		_smilPage = smilPage;
		_.each(_smilPage.pars, function(par, index){
			_pars.push({
				id: par.elementId,
				index: index,
				text: $("#" + par.elementId).html(),
				count: 0
			});
		});

		var element = $(".page").get(0);

		if ('ontouchstart' in document.documentElement) {
			_.each(["touchstart", "touchmove", "touchend", "touchcancel"], function(evt) {
				element.addEventListener(evt, function(e){
					var el = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
					console.log(evt);
					console.log(el);
					countElement(el)
					if(Mediaoverlay.player.isPlaying())
						e.preventDefault();
				}, false);
			});
		}
		else {
			_.each(["mousedown", "mousemove"], function(evt) {
				element.addEventListener(evt, function(e){
					console.log(evt);
					console.log(e.target);
					countElement(e.target)
				}, false);
			});
		}
	}
	
	return {
		initialize: initialize
	};
}(Tracker || {}, $, _));

    
