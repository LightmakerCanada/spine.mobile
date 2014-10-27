coffee         = require 'gulp-coffee'
coffeelint     = require 'gulp-coffeelint'
defineModule   = require 'gulp-define-module'
gulp           = require 'gulp'
notify         = require 'gulp-notify'
parseArgs      = require 'minimist'
rename         = require 'gulp-rename'
rjs            = require 'requirejs'
sourcemaps     = require 'gulp-sourcemaps'
util           = require 'gulp-util'

# Globals.
PATHS =
  src:
    coffee  : './src/**/*.coffee'
  dest:
    js		: './lib'

# Default task.
gulp.task 'default', ['coffee', 'watch']

# Compile all CoffeeScript.
gulp.task 'coffee', ['coffee-src']

# Coffeelint.
gulp.task 'coffeelint', ->
  message = (file)->
    return unless file.coffeelint.errorCount or file.coffeelint.warningCount
    """
      CoffeeLint found #{file.coffeelint.errorCount} errors
      and #{file.coffeelint.warningCount} warnings
    """
  gulp.src [PATHS.src.coffee]
    .pipe coffeelint './coffeelint.json'
    .pipe notify message: message
    .pipe coffeelint.reporter()
    .pipe coffeelint.reporter 'fail'


# Compile source CoffeeScript.
gulp.task 'coffee-src', ->
  gulp.src PATHS.src.coffee
    .pipe sourcemaps.init()
    .pipe coffee(bare: yes).on 'error', util.log
    .pipe gulp.dest PATHS.dest.js

# Recompile files when they change.
gulp.task 'watch', ->
  gulp.watch [
    PATHS.src.coffee
  ], ['coffee']