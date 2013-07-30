var Player = (function(player, jquery, underscore){
	var $ = jquery;
	var _ = underscore;
	var _spinner = null;
	
	// spinning
	function startSpinning(){
	}
	function endSpinning(){
	}
	function isSpinning(){
		return false;
	}
	
	// playing
	function startPlaying() {
		if(Mediaoverlay.player) {
			Mediaoverlay.player.play();
			$("#js-btn-play").html("Stop");
		}
	}
	function endPlaying() {
		if(Mediaoverlay.player) {
			Mediaoverlay.player.stop();
			$("#js-btn-play").html("Play");
		}
	}
	function isPlaying(){
		return $("#js-btn-play").html() == "Stop";
	}
	
	// init page
	function initPage() {
		startSpinning();
		
		var promise = $.get('pg01.smil');
		
		promise.done(function(smilPage){
			var page = Mediaoverlay.parseSmil(smilPage);
			Mediaoverlay.player.initialize(page, function(){ // onload
				endSpinning();
				initPlayButton();
			});
		});
		
		promise.fail(function(){
			endSpinning();
		});
	}
	
	// init button
	function initPlayButton(){
		var e = $("<div class='navbar navbar-fixed-top'>" +
					"<button id='js-btn-play' class='btn-success has-spinner'>" + 
					  "Play" + 
					"</button>" +
				  "</div>");
		$('body').append(e); 
		
		$("#js-btn-play").click(function(){
			if(isPlaying())
				endPlaying();
			else
				startPlaying();
		});		
	}

	$(document).ready(function() {
		initPage();
	});
	
	return player;
}(Player || {}, $, _));

