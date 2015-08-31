var App = function() {
	this.el = {
		window: $(window),
		html: $('html'),
		video: $('.js-video'),
		videoWrapper: $('.js-video-wrapper'),
		canvas: $('.js-canvas'),
		timeline: $('.js-timeline'),
		timelinePassed: $('.js-timeline-passed'),
	};

	this.nativeVideo = this.el.video.get(0);

	this.bind();
};

App.prototype.bind = function() {
	var self = this;

	FastClick.attach(document.body);

	// Updates timeline while video is playing
	this.el.video.on('timeupdate', function() {
		self.updateTimeline();
	});

	// Click on the video seek video
	this.el.timeline.click(function(e) {
		var offset = e.clientX - self.el.videoWrapper.offset().left;
		var percentage = offset / self.el.timeline.width();
		self.jumpTo(percentage);
	});
};

App.prototype.playPause = function() {
	if (useCanvas) {
		this.canvasVideo.playPause();
		return;
	}

	if (this.nativeVideo.paused) {
		this.nativeVideo.play();
	}
	else {
		this.nativeVideo.pause();
	}
};

App.prototype.updateTimeline = function() {
	var percentage = (this.nativeVideo.currentTime * 100 / this.nativeVideo.duration).toFixed(2);
	this.el.timelinePassed.css('width', percentage + '%');
};

App.prototype.jumpTo = function(percentage) {
	this.nativeVideo.currentTime = this.nativeVideo.duration * percentage;
};

$(document).ready(function(){
	window.app = new App();
});