const DEFAULT_OPTIONS = {
	framesPerSecond: 25,
	hideVideo: true,
	autoplay: false,
	audio: false,
	timelineActions: true,
	timelineSelector: false,
	timelinePasedSelector: false,
	resetOnLastFrame: true,
	loop: false,
};

export default class CanvasVideoPlayer {
	constructor(options = {}) {
		this._options = Object.assign({}, DEFAULT_OPTIONS, options);

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

	_setAudio() {
		if (typeof this._options.audio === 'string') {
			this._audio = document.querySelector(this._options.audio);

			return !this._audio && console.error('Element for the "audio" not found');
		}

		this._audio = document.createElement('audio');
		this._audio.innerHTML = this._video.innerHTML;
		this._video.parentNode.insertBefore(this._audio, this._video);
		this._audio.load();
	}

	init() {
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

	destroy() {
		this.pause();

		if (this._options.audio) {
			this._audio.parentNode.removeChild(this._audio);
		}

		this._unbind();
	}

	jumpTo(percentage) {
		this._video.currentTime = this._video.duration * percentage;

		if (this._options.audio) {
			this._audio.currentTime = this._audio.duration * percentage;
		}
	};

	play() {
		this._lastTime = Date.now();
		this._playing = true;
		this._loop();

		if (this._options.audio) {
			this._audio.currentTime = this._video.currentTime;
			this._audio.play();
		}
	}

	pause() {
		this._playing = false;

		if (this._options.audio) {
			this._audio.pause();
		}
	}

	playPause() {
		if (this._playing) {
			this.pause();
		} else {
			this.play();
		}
	}

	_bind() {
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

	_unbind() {
		window.removeEventListener('resize', this._windowResizeHandler);

		this.canvas.removeEventListener('click', this._canvasClickHandler);

		this.video.removeEventListener('timeupdate', this._videoTimeUpdateHandler);
		this.video.removeEventListener('canplay', this._videoCanPlayHandler);

		if (this._options.timelineActions) {
			this._timeline.removeEventListener('click', this._timeLineClick);
		}
	}

	_setCanvasSize() {
		this._width = this._canvas.clientWidth;
		this._height = this._canvas.clientHeight;

		this._canvas.setAttribute('width', this._width);
		this._canvas.setAttribute('height', this._height);
	}

	_updateTimeLine() {
		if (this._options.timelineSelector) {
			const percentage = -100 + (this._video.currentTime || 0) / this._video.duration * 100;

			this._timelinePassed.style.webkitTransform = `translateX(${percentage}%)`;
			this._timelinePassed.style.transform = `translateX(${percentage}%)`;
		}
	}

	_loop() {
		const time = Date.now();
		const elapsed = (time - this._lastTime) / 1000;
		const currentVideoTime = this._video.currentTime;

		if (elapsed >= (1 / this._options.framesPerSecond)) {
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
			this._animationFrame = requestAnimationFrame(() => this._loop());
		} else {
			cancelAnimationFrame(this._animationFrame);
		}
	}

	_drawFrame() {
		this._ctx.drawImage(this._video, 0, 0, this._width, this._height);
	}

	_canvasClickHandler = () => {
		this.playPause();
	};

	_videoTimeUpdateHandler = () => {
		this._drawFrame();
		this._updateTimeLine();
	};

	_videoCanPlayHandler = () => {
		this._drawFrame();
	};

	_timeLineClick = e => {
		const offset = e.clientX - CanvasVideoPlayer.getOffset(this._canvas).left;

		this.jumpTo(offset / this._timeline.offsetWidth);
	};

	_windowResizeHandler = () => {
		this._setCanvasSize();
		this._drawFrame();
	};

	static getOffset(elem) {
		if (!elem) {
			return;
		}

		const rect = elem.getBoundingClientRect();
		let docElem;
		let doc;

		if (rect.width || rect.height || elem.getClientRects().length) {
			doc = elem.ownerDocument;
			docElem = doc.documentElement;

			return {
				top: rect.top + window.pageYOffset - docElem.clientTop,
				left: rect.left + window.pageXOffset - docElem.clientLeft,
			};
		}
	}
}
