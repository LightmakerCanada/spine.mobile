define(function(require,exports,module){
var $, Velocity;

$ = require('jquery');

Velocity = require('velocity');

$.fn.slideIn = function(options) {
  var distance, opacity;
  if (options == null) {
    options = {};
  }
  options.direction || (options.direction = 'right');
  distance = options.distance || 100;
  if (options.direction === 'left') {
    distance *= -1;
  }
  distance += "%";
  opacity = options.fade ? 0 : 1;
  Velocity(this, {
    translateX: distance,
    opacity: 0
  }, {
    duration: 0
  });
  return Velocity(this, {
    translateX: 0,
    opacity: 1
  }, options);
};

$.fn.slideOut = function(options) {
  var distance, opacity;
  if (options == null) {
    options = {};
  }
  options.direction || (options.direction = 'right');
  distance = options.distance || 100;
  if (options.direction === 'left') {
    distance *= -1;
  }
  distance += "%";
  opacity = options.fade ? 0 : 1;
  return Velocity(this, {
    translateX: distance,
    opacity: opacity
  }, options);
};

});