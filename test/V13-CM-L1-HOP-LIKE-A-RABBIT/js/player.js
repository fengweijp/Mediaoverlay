var Player = (function(player, tracker, jquery, underscore){
	var $ = jquery;
	var _ = underscore;
	var _spinner = null;
	var _tracker = tracker;
	
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
	
	function playerStateChanged(state, stateObj) {
		//if(state.indexOf("clip") === 0) 
		//	console.log(state + " : " + stateObj.elementId);
		//else 
		//	console.log(state + " : " + stateObj.pageUrl);
			
		if(state == "page_end")
			endPlaying();
	}
	
	// initBook
	function initBook(fnOnLoad) {
		startSpinning();

		var promise = $.get("package.xml");
		
		promise.done(function(packageXml){
			var book = Mediaoverlay.parsePackage(packageXml);
			endSpinning();
			if(fnOnLoad)
				fnOnLoad(book);
		});
		
		promise.fail(function(){
			console.log("Loading package.xml failed!");
			endSpinning();
		});
	}
	
	// init page
	function initPage(pageSmil) {
		startSpinning();
		
		var promise = $.get(pageSmil);
		
		promise.done(function(smilPageXml){
			var page = Mediaoverlay.parseSmil(smilPageXml);
			
			_tracker.initialize(page);
			
			Mediaoverlay.player.initialize(page, function(){ // onready
				endSpinning();
				Mediaoverlay.player.onStateChanged(playerStateChanged);
				initPlayButton();
			});
		});
		
		promise.fail(function(){
			console.log("Loading " + smilPage + " failed!");
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

	return {
		initBook: initBook,
		initPage: initPage
	};
}(Player || {}, Tracker, $, _));

