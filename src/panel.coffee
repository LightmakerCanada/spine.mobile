$        = Spine.$
Stage    = require('./stage')
Animator = require('./animator')


class Panel extends Stage
  title: false
  viewport: false

  constructor: ->
    super
    @el.removeClass('stage').addClass('panel')
    @header.append($('<h2 />'))
    @setTitle(@title) if @title
    @stage ?= Stage.globalStage()
    @stage?.add(@)

  setTitle: (title = '') ->
    @header.find('h2:first').html(title)

  addButton: (text, callback) ->
    callback = @[callback] if typeof callback is 'string'
    button = $('<button />').text(text)
    button.tap(@proxy(callback))
    @header.append(button)
    button

  activate: (params = {}) ->
    effect = params.transition or params.trans
    if effect
      @effects[effect].apply(this)
    else
      @content.add(@header).show()
      @el.addClass('active')

  deactivate: (params = {}) ->
    return unless @isActive()
    effect = params.transition or params.trans
    if effect
      @reverseEffects[effect].apply(this)
    else
      @el.removeClass('active')

  effects:
    left: ->
      @el.addClass('active')
      @content.slideIn(@effectOptions(direction: 'left'))
      @header.slideIn(@effectOptions(direction: 'left', fade: true, distance: 50))

    right: ->
      @el.addClass('active')
      @content.slideIn(@effectOptions(direction: 'right'))
      @header.slideIn(@effectOptions(direction: 'right', fade: true, distance: 50))

  reverseEffects:
    left: ->
      @content.slideOut(@effectOptions(direction: 'right', complete: => @.el.removeClass 'active'))
      @header.slideOut(@effectOptions(direction: 'right'))

    right: ->
      @content.slideOut(@effectOptions(direction: 'left', complete: => @.el.removeClass 'active'))
      @header.slideOut(@effectOptions(direction: 'left', fade: true, distance: 50))


(module?.exports = Panel) or @Panel = Panel
