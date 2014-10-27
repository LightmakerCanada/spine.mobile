define(function(require,exports,module){
var $, Animator, Panel, Stage,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

$ = Spine.$;

Stage = require('./stage');

Animator = require('./animator');

Panel = (function(_super) {
  __extends(Panel, _super);

  Panel.prototype.title = false;

  Panel.prototype.viewport = false;

  function Panel() {
    var _ref;
    Panel.__super__.constructor.apply(this, arguments);
    this.el.removeClass('stage').addClass('panel');
    this.header.append($('<h2 />'));
    if (this.title) {
      this.setTitle(this.title);
    }
    if (this.stage == null) {
      this.stage = Stage.globalStage();
    }
    if ((_ref = this.stage) != null) {
      _ref.add(this);
    }
  }

  Panel.prototype.setTitle = function(title) {
    if (title == null) {
      title = '';
    }
    return this.header.find('h2:first').html(title);
  };

  Panel.prototype.addButton = function(text, callback) {
    var button;
    if (typeof callback === 'string') {
      callback = this[callback];
    }
    button = $('<button />').text(text);
    button.tap(this.proxy(callback));
    this.header.append(button);
    return button;
  };

  Panel.prototype.activate = function(params) {
    var effect;
    if (params == null) {
      params = {};
    }
    effect = params.transition || params.trans;
    if (effect) {
      return this.effects[effect].apply(this);
    } else {
      this.content.add(this.header).show();
      return this.el.addClass('active');
    }
  };

  Panel.prototype.deactivate = function(params) {
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

  Panel.prototype.effects = {
    left: function() {
      this.el.addClass('active');
      this.content.slideIn(this.effectOptions({
        direction: 'left'
      }));
      return this.header.slideIn(this.effectOptions({
        direction: 'left',
        fade: true,
        distance: 50
      }));
    },
    right: function() {
      this.el.addClass('active');
      this.content.slideIn(this.effectOptions({
        direction: 'right'
      }));
      return this.header.slideIn(this.effectOptions({
        direction: 'right',
        fade: true,
        distance: 50
      }));
    }
  };

  Panel.prototype.reverseEffects = {
    left: function() {
      this.content.slideOut(this.effectOptions({
        direction: 'right',
        complete: (function(_this) {
          return function() {
            return _this.el.removeClass('active');
          };
        })(this)
      }));
      return this.header.slideOut(this.effectOptions({
        direction: 'right'
      }));
    },
    right: function() {
      this.content.slideOut(this.effectOptions({
        direction: 'left',
        complete: (function(_this) {
          return function() {
            return _this.el.removeClass('active');
          };
        })(this)
      }));
      return this.header.slideOut(this.effectOptions({
        direction: 'left',
        fade: true,
        distance: 50
      }));
    }
  };

  return Panel;

})(Stage);

(typeof module !== "undefined" && module !== null ? module.exports = Panel : void 0) || (this.Panel = Panel);

});