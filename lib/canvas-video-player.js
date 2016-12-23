(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("CanvasVideoPlayer", [], factory);
	else if(typeof exports === 'object')
		exports["CanvasVideoPlayer"] = factory();
	else
		root["CanvasVideoPlayer"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var DEFAULT_OPTIONS = {
		framesPerSecond: 25,
		hideVideo: true,
		autoplay: false,
		audio: false,
		timelineActions: true,
		timelineSelector: false,
		timelinePasedSelector: false,
		resetOnLastFrame: true,
		loop: false
	};
	
	var CanvasVideoPlayer = function () {
		function CanvasVideoPlayer() {
			var _this = this;
	
			var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
			_classCallCheck(this, CanvasVideoPlayer);
	
			this._canvasClickHandler = function () {
				_this.playPause();
			};
	
			this._videoTimeUpdateHandler = function () {
				_this._drawFrame();
				_this._updateTimeLine();
			};
	
			this._videoCanPlayHandler = function () {
				_this._drawFrame();
			};
	
			this._timeLineClick = function (e) {
				var offset = e.clientX - CanvasVideoPlayer.getOffset(_this._canvas).left;
	
				_this.jumpTo(offset / _this._timeline.offsetWidth);
			};
	
			this._windowResizeHandler = function () {
				_this._setCanvasSize();
				_this._drawFrame();
			};
	
			this._options = _extends({}, DEFAULT_OPTIONS, options);
	
			this._video = document.querySelector(this._options.videoSelector);
			this._canvas = document.querySelector(this._options.canvasSelector);
			this._timeline = document.querySelector(this._options.timelineSelector);
			this._timelinePassed = document.querySelector(this._options.timelinePassedSelector);
	
			if (!this._options.videoSelector || !this._video) {
				return console.error('No "videoSelector" property, or the element is not found');
			}
	
			if (!this._options.canvasSelector || !this._canvas) {
				return console.error('No "canvasSelector" property, or the element is not found');
			}
	
			if (this._options.timelineSelector && !this._timeline) {
				return console.error('Element for the "timelineSelector" selector not found');
			}
	
			if (this._options.timelineSelector && !this._timelinePassed) {
				return console.error('Element for the "timelinePassed" not found');
			}
	
			if (this._options.audio) {
				this._setAudio();
			}
	
			this._ctx = this._canvas.getContext('2d');
	
			this._playing = false;
	
			this.init();
		}
	
		_createClass(CanvasVideoPlayer, [{
			key: '_setAudio',
			value: function _setAudio() {
				if (typeof this._options.audio === 'string') {
					this._audio = document.querySelector(this._options.audio);
	
					return !this._audio && console.error('Element for the "audio" not found');
				}
	
				this._audio = document.createElement('audio');
				this._audio.innerHTML = this._video.innerHTML;
				this._video.parentNode.insertBefore(this._audio, this._video);
				this._audio.load();
			}
		}, {
			key: 'init',
			value: function init() {
				this._video.load();
	
				this._setCanvasSize();
				this._bind();
				this._updateTimeLine();
	
				if (this._options.hideVideo) {
					this._video.style.display = 'none';
				}
	
				if (this._options.autoplay) {
					this.play();
				}
			}
		}, {
			key: 'destroy',
			value: function destroy() {
				this.pause();
	
				if (this._options.audio) {
					this._audio.parentNode.removeChild(this._audio);
				}
	
				this._unbind();
			}
		}, {
			key: 'jumpTo',
			value: function jumpTo(percentage) {
				this._video.currentTime = this._video.duration * percentage;
	
				if (this._options.audio) {
					this._audio.currentTime = this._audio.duration * percentage;
				}
			}
		}, {
			key: 'play',
			value: function play() {
				this._lastTime = Date.now();
				this._playing = true;
				this._loop();
	
				if (this._options.audio) {
					this._audio.currentTime = this._video.currentTime;
					this._audio.play();
				}
			}
		}, {
			key: 'pause',
			value: function pause() {
				this._playing = false;
	
				if (this._options.audio) {
					this._audio.pause();
				}
			}
		}, {
			key: 'playPause',
			value: function playPause() {
				if (this._playing) {
					this.pause();
				} else {
					this.play();
				}
			}
		}, {
			key: '_bind',
			value: function _bind() {
				window.addEventListener('resize', this._windowResizeHandler);
	
				this._canvas.addEventListener('click', this._canvasClickHandler);
	
				this._video.addEventListener('timeupdate', this._videoTimeUpdateHandler);
				this._video.addEventListener('canplay', this._videoCanPlayHandler);
	
				if (this._options.timelineActions) {
					this._timeline.addEventListener('click', this._timeLineClick);
				}
	
				if (this._video.readyState >= 2) {
					this._drawFrame();
				}
			}
		}, {
			key: '_unbind',
			value: function _unbind() {
				window.removeEventListener('resize', this._windowResizeHandler);
	
				this.canvas.removeEventListener('click', this._canvasClickHandler);
	
				this.video.removeEventListener('timeupdate', this._videoTimeUpdateHandler);
				this.video.removeEventListener('canplay', this._videoCanPlayHandler);
	
				if (this._options.timelineActions) {
					this._timeline.removeEventListener('click', this._timeLineClick);
				}
			}
		}, {
			key: '_setCanvasSize',
			value: function _setCanvasSize() {
				this._width = this._canvas.clientWidth;
				this._height = this._canvas.clientHeight;
	
				this._canvas.setAttribute('width', this._width);
				this._canvas.setAttribute('height', this._height);
			}
		}, {
			key: '_updateTimeLine',
			value: function _updateTimeLine() {
				if (this._options.timelineSelector) {
					var percentage = -100 + (this._video.currentTime || 0) / this._video.duration * 100;
	
					this._timelinePassed.style.webkitTransform = 'translateX(' + percentage + '%)';
					this._timelinePassed.style.transform = 'translateX(' + percentage + '%)';
				}
			}
		}, {
			key: '_loop',
			value: function _loop() {
				var _this2 = this;
	
				var time = Date.now();
				var elapsed = (time - this._lastTime) / 1000;
				var currentVideoTime = this._video.currentTime;
	
				if (elapsed >= 1 / this._options.framesPerSecond) {
					this._video.currentTime = currentVideoTime + elapsed;
					this._lastTime = time;
	
					if (this._audio && Math.abs(this._audio.currentTime - currentVideoTime) > 0.2) {
						this._audio.currentTime = currentVideoTime;
					}
				}
	
				if (currentVideoTime >= this._video.duration) {
					this._playing = false;
	
					if (this._options.resetOnLastFrame === true) {
						this._video.currentTime = 0;
					}
	
					if (this._options.loop === true) {
						this._video.currentTime = 0;
						this.play();
					}
				}
	
				if (this._playing) {
					this._animationFrame = requestAnimationFrame(function () {
						return _this2._loop();
					});
				} else {
					cancelAnimationFrame(this._animationFrame);
				}
			}
		}, {
			key: '_drawFrame',
			value: function _drawFrame() {
				this._ctx.drawImage(this._video, 0, 0, this._width, this._height);
			}
		}], [{
			key: 'getOffset',
			value: function getOffset(elem) {
				if (!elem) {
					return;
				}
	
				var rect = elem.getBoundingClientRect();
				var docElem = void 0;
				var doc = void 0;
	
				if (rect.width || rect.height || elem.getClientRects().length) {
					doc = elem.ownerDocument;
					docElem = doc.documentElement;
	
					return {
						top: rect.top + window.pageYOffset - docElem.clientTop,
						left: rect.left + window.pageXOffset - docElem.clientLeft
					};
				}
			}
		}]);
	
		return CanvasVideoPlayer;
	}();
	
	exports.default = CanvasVideoPlayer;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=canvas-video-player.js.map