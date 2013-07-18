var XMLParser = (function (parser) {
	parser = {};
	parser.load = function(url){
		var domparser;
		if (typeof window.DOMParser != "undefined") {
			domparser = new window.DOMParser();
			return domparser.parseFromString(url, "text/xml");
		} else if (typeof window.ActiveXObject != "undefined" &&
			new window.ActiveXObject("Microsoft.XMLDOM")) {
			domparser = new window.ActiveXObject("Microsoft.XMLDOM");
			domparser.async = "false";
			return domparser.loadXML(url);
		} else {
			throw new Error("No XML parser found");
		}
		return xmldom;
	};
	
	return parser;
}(XMLParser || {}));
