$         = require 'jquery'
Velocity  = require 'velocity'

# animation functions
$.fn.slideIn = (options = {})->
  options.direction or= 'right'
  distance = options.distance or 100
  distance *= -1 if options.direction is 'left'
  distance += "%"
  opacity = if options.fade then 0 else 1
  Velocity this, {translateX:distance, opacity:0}, {duration:0}
  Velocity this, {translateX:0, opacity:1}, options

$.fn.slideOut = (options = {})->
  options.direction or= 'right'
  distance = options.distance or 100
  distance *= -1 if options.direction is 'left'
  distance += "%"
  opacity = if options.fade then 0 else 1
  Velocity this, {translateX:distance, opacity:opacity}, options