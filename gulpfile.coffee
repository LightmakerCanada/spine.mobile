bump       = require 'gulp-bump'
changelog  = require 'conventional-changelog'
coffee     = require 'gulp-coffee'
coffeelint = require 'gulp-coffeelint'
fs         = require 'fs'
git        = require 'gulp-git'
gulp       = require 'gulp'
notify     = require 'gulp-notify'
sourcemaps = require 'gulp-sourcemaps'
util       = require 'gulp-util'
wrap       = require 'gulp-wrap'


# Paths.
PATHS =
  src:
    coffee : './src/**/*.coffee'
    js     : './lib/**/*.js'
  dest:
    js  : './lib'
    amd : './amd'


# Default task.
gulp.task 'default', ['coffee', 'watch']


# Compile all CoffeeScript.
gulp.task 'coffee', ['coffeelint', 'coffee-src', 'wrap-define']


# Lint CoffeeScript.
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


# Wraps modules for RequireJS compatibility.
gulp.task 'wrap-define', ['coffee-src'], (cb)->
  gulp.src PATHS.src.js
    .pipe wrap 'define(function(require,exports,module){\n<%= contents %>\n});'
    .pipe gulp.dest PATHS.dest.amd


# Recompile files when they change.
gulp.task 'watch', ->
  gulp.watch [
    PATHS.src.coffee
  ], ['coffee']


# Bump version number.
gulp.task 'bump-version', ->
  gulp.src PATHS.src.config
    .pipe bump type: options.type
    .pipe gulp.dest './'


# Update the changelog.
gulp.task 'changelog', ['bump-version'], (done)->
  pkg = require './package.json'
  opt =
    repository : pkg.repository.url
    version    : pkg.version
    file       : PATHS.src.changelog
    log        : util.log
  changelog opt, (err, log)->
    return done err if err
    fs.writeFile 'CHANGELOG.md', log, done


# Bump version, update changelog, and commit changes.
gulp.task 'bump', ['bump-version', 'changelog'], ->
  pkg = require './package.json'
  gulp.src PATHS.src.config.concat [PATHS.src.changelog]
    .pipe git.commit "chore: bump version to v#{pkg.version}"


# Tag the current commit as a release.
gulp.task 'tag', ['bump'], ->
  pkg = require './package.json'
  git.tag pkg.version, "Release v#{pkg.version}", (err)-> throw err if err


# Do a release.
gulp.task 'release', ['bump', 'tag']
