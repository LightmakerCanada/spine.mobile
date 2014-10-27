define(function(require,exports,module){
var $, Animator, Spine, Stage, globalManager,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Spine = require('spine');

$ = Spine.$;

Animator = require('./animator');

globalManager = new Spine.Manager();

Stage = (function(_super) {
  __extends(Stage, _super);

  Stage.globalManager = function() {
    return globalManager;
  };

  Stage.globalStage = function() {
    return this.globalManager().controllers[0];
  };

  Stage.prototype.effectDefaults = {
    duration: 350,
    easing: 'cubic-bezier(.25, .1, .25, 1)'
  };

  Stage.prototype.effectOptions = function(options) {
    if (options == null) {
      options = {};
    }
    return $.extend({}, this.effectDefaults, options);
  };

  Stage.prototype.viewport = true;

  function Stage() {
    Stage.__super__.constructor.apply(this, arguments);
    this.el.addClass('stage');
    this.header = $('<header />');
    this.content = $('<article />');
    this.footer = $('<footer />');
    if (this.viewport) {
      this.content.addClass('viewport');
    }
    this.el.append(this.header, this.content, this.footer);
    if (this.global) {
      globalManager.add(this);
    }
  }

  Stage.prototype.append = function() {
    var e, elements, _ref;
    elements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    elements = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        e = elements[_i];
        _results.push(e.el || e);
      }
      return _results;
    })();
    return (_ref = this.content).append.apply(_ref, elements);
  };

  Stage.prototype.html = function() {
    this.content.html.apply(this.content, arguments);
    this.refreshElements();
    return this.content;
  };

  Stage.prototype.add = function() {
    var panels, _ref;
    panels = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this.manager || (this.manager = new Spine.Manager());
    (_ref = this.manager).add.apply(_ref, panels);
    return this.append.apply(this, panels);
  };

  Stage.prototype.activate = function(params) {
    var effect;
    if (params == null) {
      params = {};
    }
    effect = params.transition || params.trans;
    if (effect) {
      return this.effects[effect].apply(this);
    } else {
      return this.el.addClass('active');
    }
  };

  Stage.prototype.deactivate = function(params) {
    var effect;
    if (params == null) {
      params = {};
    }
    if (!this.isActive()) {
      return;
    }
    effect = params.transition || params.trans;
    if (effect) {
      return this.reverseEffects[effect].apply(this);
    } else {
      return this.el.removeClass('active');
    }
  };

  Stage.prototype.isActive = function() {
    return this.el.hasClass('active');
  };

  Stage.prototype.effects = {
    left: function() {
      this.el.addClass('active');
      return this.el.slideIn(this.effectOptions({
        direction: 'left'
      }));
    },
    right: function() {
      this.el.addClass('active');
      return this.el.slideIn(this.effectOptions({
        direction: 'right'
      }));
    }
  };

  Stage.prototype.reverseEffects = {
    left: function() {
      return this.el.slideOut(this.effectOptions({
        direction: 'right',
        complete: (function(_this) {
          return function() {
            return _this.el.removeClass('active');
          };
        })(this)
      }));
    },
    right: function() {
      return this.el.slideOut(this.effectOptions({
        direction: 'left',
        complete: (function(_this) {
          return function() {
            return _this.el.removeClass('active');
          };
        })(this)
      }));
    }
  };

  return Stage;

})(Spine.Controller);

Stage.Global = (function(_super) {
  __extends(Global, _super);

  function Global() {
    return Global.__super__.constructor.apply(this, arguments);
  }

  Global.prototype.global = true;

  return Global;

})(Stage);

(typeof module !== "undefined" && module !== null ? module.exports = Stage : void 0) || (this.Stage = Stage);

});