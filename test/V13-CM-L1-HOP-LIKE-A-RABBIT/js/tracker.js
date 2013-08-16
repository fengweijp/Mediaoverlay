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

		var el = $("body").get(0);
		
		el.addEventListener("touchstart", function(e){
			console.log("touchstart");
			var ret = countElement(e.target);
			if( ret && navigator.userAgent.match(/Android/i) ) {
				e.preventDefault();
			}			
		}, false);

		el.addEventListener("touchmove", function(e){
			console.log("touchmove");
			var ret = countElement(e.target);
			if( ret && navigator.userAgent.match(/Android/i) ) {
				e.preventDefault();
			}			
				
		}, false);

		el.addEventListener("touchend", function(e){
			console.log("touchend");
			var ret = countElement(e.target);
			if( ret && navigator.userAgent.match(/Android/i) ) {
				e.preventDefault();
			}			
		}, false);
		
		el.addEventListener("mousedown", function(e){
			console.log("mousedown");
			countElement(e.target);
		}, false);

		el.addEventListener("mousemove", function(e){
			console.log("mousemove");
			countElement(e.target);
		}, false);
	}
	
	return {
		initialize: initialize
	};
}(Tracker || {}, $, _));

    
