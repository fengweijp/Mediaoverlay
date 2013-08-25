var PhonicsHighlight = (function(phonicsHighlight, jquery, underscore){
	var $ = jquery;
	var _ = underscore;
	
	function highlight() {
		var selection = document.getSelection();
		var range = selection.getRangeAt(0);
		var clickedChar;
		
		if(range.startContainer === range.endContainer && 
			range.startOffset === range.endOffset /*caret type, no selection*/){
			clickedChar = range.startContainer.textContent[range.startOffset];
			console.log(clickedChar);
			$(".page").removeHighlight();
			$(".page .text").highlight(clickedChar);
		}
	}
	
	function initialize(){
		if(Mediaoverlay.getURLParam("phonics")) {
			$("span").click(function(){
				if(!Mediaoverlay.player.isPlaying())
					highlight();
			});
		}
	}
	
	
	function replaceAll(expression, org, dest){  
		return expression.split(org).join(dest);  
	} 	
	function is_all_ws(node){
		return !(/[^\t\n\r ]/.test(node.data));
	}
	function is_ignorable(node)	{
		return (node.nodeType == 8) || // comment
			( (node.nodeType == 3) && is_all_ws(node) ); // white space
	}	
	
	$(document).ready(function() {
		initialize();
	});
	
	return phonicsHighlight;
}(PhonicsHighlight || {}, $, _));

    
