var Tracker = (function(tracker, jquery, underscore){
	var $ = jquery;
	var _ = underscore;
	var _chunks = [];
	
	function initialize(){
		var e = $("<div id='trackerlog' style='position:fixed;left:0px;top:30px;padding:5px;width:250px;overflow:auto;height:800px;'>" +
				  "</div>");
		$('body').append(e); 
		
		$(".text span").each(function(){
			var self = $(this);
			_chunks.push({
				id: self.attr("id"),
				text: self.html(),
				count: 0
			});
		});
		
		$("#trackerlog").mousedown(function(e){
			if(e.which == 3) { // right click
				clearlog();
			}
		});

		$("span").mousemove(function(e){
			var currentId = $(this).attr("id");
			var currentChunk;
			if($(this).hasClass("mediaoverlay-active")) {
				currentChunk = _.find(_chunks, function(chunk){
					return chunk.id == currentId;
				});
				currentChunk.count++;
			}
		});  
		
		setInterval(log, 1000);
	}
	
	function log(){
		var output = "";
		_.each(_chunks, function(chunk){
			var chunkOutput = "<div>";
			chunkOutput += chunk.id + " - " + chunk.text + " : " + chunk.count;
			chunkOutput += "</div>";
			output += chunkOutput;
		});

		$("#trackerlog").html(output);
	}
	
	function clearlog() {
		$("#trackerlog").html("");
	}
	
	$(document).ready(function() {
		initialize();
	});
	
	return tracker;
}(Tracker || {}, $, _));

    
