var Tracker = (function(tracker, jquery, underscore){
	var $ = jquery;
	var _ = underscore;
	var _pars = [];
	var _smilPage;
	
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
	
			var e = $("<div id='trackerlog' style='position:fixed;left:0px;top:30px;padding:5px;width:250px;overflow:auto;height:800px;'>" +
					  "</div>");
			$('body').append(e); 

			setInterval(log, 2000);
		}

		_smilPage = smilPage;
		_.each(_smilPage.pars, function(par, index){
			_pars.push({
				id: par.elementId,
				index: index,
				count: 0
			});
		});

		$("span").mousemove(function(e){
			var currentId = $(this).attr("id");
			var parIndex = $(this).attr("parindex");
			var currentPar;
			if($(this).hasClass("mediaoverlay-active")) {
				currentPar = _.find(_pars, function(par){
					return par.id == currentId && par.index == parIndex;
				});
				
				if(currentPar)
					currentPar.count++;
			}
		});  
	}
	
	return {
		initialize: initialize
	};
}(Tracker || {}, $, _));

    
