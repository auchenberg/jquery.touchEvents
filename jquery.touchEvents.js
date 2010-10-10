/**
	
	jQuery plugin to expose touch restures from iPhone, iPod Touch and iPad via custom events.
	
	Based on jQuery TouchWipe extension by Andreas Waltl, netCU Internetagentur (http://www.netcu.de).
* 
* @author Kenneth Auchenberg (http://kenneth.io)
* @version 1.0

*/
(function ($) {
	$.fn.touchEvents = function (settings) {
		var config = {
			min_move_x: 20,
			min_move_y: 20,
			preventDefaultEvents: true
		};

		if (settings) $.extend(config, settings);

		this.each(function () {
			var elmItem = $(this);
			var startX, startY;
			var isMoving = false;
			var isGesture = false;

			function cancelTouch() {
				this.removeEventListener('touchmove', onTouchMove);
				startX = null;
				startY = null;
				isMoving = false;
			}

			function onTouchMove(e) {
				if (e.touches.length > 1) return; // only deal with touch move

				if (config.preventDefaultEvents) {
					e.preventDefault();
				}
				if (isMoving) {
					var x = e.touches[0].pageX;
					var y = e.touches[0].pageY;
					var dx = startX - x;
					var dy = startY - y;
					if (Math.abs(dx) >= config.min_move_x) {
						cancelTouch();
						if (dx > 0) {
							elmItem.trigger('touchSwipeLeft', e);
						}
						else {
							elmItem.trigger('touchSwipeRight', e);
						}
					}
					if (Math.abs(dy) >= config.min_move_y) {
						cancelTouch();
						if (dy > 0) {
							elmItem.trigger('touchSwipeUp', e);
						}
						else {
							elmItem.trigger('touchSwipeDown', e);
						}
					}
				}
			}

			function onTouchStart(e) {
				if (e.touches.length == 1) {
					startX = e.touches[0].pageX;
					startY = e.touches[0].pageY;
					isMoving = true;
					this.addEventListener('touchmove', onTouchMove, false);
				}
			}

			function onGestureEnd(e) {
				isGesture = false;
				e.preventDefault();

				if (e.rotation < 5 || e.rotation > -5) {
					elmItem.trigger('touchRotated', e);
				}

				if (e.scale > 1) {
					elmItem.trigger('touchPinchOpen', e);
				}

				if (e.scale < 1) {
					elmItem.trigger('touchPinchClose', e);
				}
			}

			function onGestureStart(e) {
				isGesture = true;
			}

			function onGestureChange(e) {
				if (e.rotation < 10 || e.rotation > -10) {
					elmItem.trigger('touchRotate', e);
				}
			}

			this.addEventListener('touchstart', onTouchStart, false);
			this.addEventListener('gesturestart', onGestureStart, false);
			this.addEventListener('gestureend', onGestureEnd, false);
			this.addEventListener('gesturechange', onGestureChange, false);
		});

		return this;
	};

})(jQuery);
