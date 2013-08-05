var Mediaoverlay = (function(Mediaoverlay, xmlParser, jquery, underscore){
	// dependencies
	var XMLParser = xmlParser;
	var $ = jquery;
	var _ = underscore;

	function parseSmil(smilPage) {
		var _xmldoc = XMLParser.load(smilPage, 'text/xml');
		var _bodyElement = $("body", _xmldoc.documentElement);
		var _pageUrl = _bodyElement.attr('epub:textref');
		var _activeClass = _bodyElement.attr('activeclass');
		var _audioFile = _bodyElement.attr('src');
		var _pageBegin = _bodyElement.attr('clipBegin');
		var _pageEnd = _bodyElement.attr('clipEnd');
		
		var _pars = _.map($("par", _xmldoc.documentElement), function(par){
			var textNode = $("text", par);
			var audioNode = $('audio', par);
			return {
				elementId: textNode.attr('src').split('#')[1],
				clipBegin: audioNode.attr('clipBegin'),
				clipEnd: audioNode.attr('clipEnd')
			};
		});
		
		return {
			activeClass: _activeClass,
			pageUrl: _pageUrl,
			audioFile: _audioFile,
			pageBegin: _pageBegin,
			pageEnd: _pageEnd,
			pars: _pars
		};
	}
	
	Mediaoverlay.parsePackage = function(packageXml){
		var _xmldoc = XMLParser.load(packageXml, 'text/xml');
		var _spineElement = $("spine", _xmldoc.documentElement);
		var _ret = [];
		var _page;
		var _smilPage;
		_.forEach(_spineElement.children, function(item){
			_page = item.attr('href');
			_smilPage = item.attr('mediaoverlay-href');
			ret.push({
				pageUrl: _page,
				smilUrl: _smilPage
			})
		});

		return _ret;
	};
	
	Mediaoverlay.parseSmil = parseSmil;
	
	Mediaoverlay.player = (function(){
		var _page;
		var _audioElement;
		var _canPlay;
		var _intervalId;
		var _currentPar;
		var _onStateChanged;

		function notify(state, stateObj) {
			if(state.indexOf("clip_begin") === 0) 
				$("#" + stateObj.elementId).addClass(_page.activeClass);
			else if(state.indexOf("clip_end") === 0)
				$("#" + stateObj.elementId).removeClass(_page.activeClass);
				
			if(_onStateChanged)
				_onStateChanged(state, stateObj);
		}
		
		function initialize(page, onload) {
			// save page
			_page = page;
			_currentPar = null;

			//_audioElement = new Audio();
			_audioElement = document.createElement('audio');
			_audioElement.setAttribute("src", page.audioFile);
			_audioElement.load();
			_audioElement.addEventListener("load", onloadListener(onload));
		}
		
		function onStateChanged(fnOnStateChanged){
			_onStateChanged = fnOnStateChanged;
		}

		function onloadListener(onload) {
			_canPlay = true;
			_audioElement.removeEventListener("load", onloadListener);
			
			if(_.isFunction(onload)) _.delay(onload, 1000, [_page]);
		}
		
		function clean() {
			if (_intervalId != null) clearInterval(_intervalId);
			_audioElement = null;
		}

		function isPlaying() {
			if(!_audioElement)
				return false;
			
			return _canPlay && !_audioElement.paused;
		}
		
		function pause() {
			if(_audioElement)
				_audioElement.pause();
		}
		
		function resume() {
			if(_audioElement)
				_audioElement.play();
		}
		
		function play() {
			if(_canPlay) {
				startClipTimer();
				_audioElement.currentTime = _page.pageBegin;
				_audioElement.play();
				notifyPageBegin(_page);
			}
		}

		function stop() {
			if(_audioElement) {
				_audioElement.pause();
				_audioElement.currentTime = 0;
				if (_intervalId != null) clearInterval(_intervalId);
				notifyClipEnd(_currentPar);
			}
		}
		
		function notifyPageBegin(page){
			notify("page_begin", page);
		}

		function notifyPageEnd(page){
			notify("page_end", page);
		}
		
		function notifyClipPlaying(par) {
			notify("clip_playing", par);
		}
		
		function notifyClipBegin(par) {
			notify("clip_begin", par);
		}
		
		function notifyClipEnd(par) {
			notify("clip_end", par);
		}
		
		function startClipTimer() {
			// cancel the old timer, if any
			if (_intervalId != null) {
				clearInterval(_intervalId);
			}
			
			// we're using setInterval instead of monitoring the timeupdate event because 
			// timeupdate fires, at best, every 200ms, which messes up playback of short phrases.
			// (and this is for when the tab is active; otherwise it fires about every second)
			_intervalId = setInterval(function() {
				var i, par;
				
				if(_audioElement.currentTime > _page.pageEnd){
					if (_intervalId != null) clearInterval(_intervalId);
					stop();
					notifyClipEnd(_currentPar);
					notifyPageEnd(_page);
					return;
				}
				
				for(i=0; i<_page.pars.length; i++) {
					par = _page.pars[i];
					if( _audioElement.currentTime >= par.clipBegin && 
						_audioElement.currentTime <= par.clipEnd) {
						
						if(_currentPar && _currentPar != par && _audioElement.currentTime > _currentPar.clipEnd) {
							notifyClipEnd(_currentPar);
						}

						if(_currentPar != par && _audioElement.currentTime <= par.clipEnd) {
							notifyClipBegin(par);
						}

						if(isPlaying()) {
							notifyClipPlaying(par);
						}

						_currentPar = par;
						break;
					}
				}
			}, 25);   
		}
		
		return {
			initialize: initialize,
			resume: resume,
			pause: pause,
			isPlaying: isPlaying,
			play: play,
			stop: stop,
			onStateChanged: onStateChanged
		};
	}()); // player
	
	return Mediaoverlay;
}(Mediaoverlay || {}, XMLParser, $, _));

