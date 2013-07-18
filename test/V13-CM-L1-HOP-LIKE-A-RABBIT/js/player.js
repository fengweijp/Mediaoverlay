$(document).ready(function() {
	$("body").click(function(){
		$.get('pg01.smil', function(smilPage) {
			var page = Mediaoverlay.parseSmil(smilPage);
			Mediaoverlay.player.initialize(page, function(){ // onload
				Mediaoverlay.player.play();				
			});
		});
    });  
});
