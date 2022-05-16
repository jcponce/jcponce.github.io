controls = (els, slideshow) ->

  prev = els.querySelector '.prev'
  next = els.querySelector '.next'

  if prev and next
    prev.onclick = slideshow.prev
    next.onclick = slideshow.next

  offline = location.href.match /offline/

  WIDTH  = 1280
  HEIGHT = 720
  FOOTER = if offline then 0 else 60 + 100

  window.onmessage = (e) ->
    d = e.data
    if d?.type == 'slideshow' and d?.method?
      slideshow[d.method]?()

  setSpeed = (e) ->
    speed = if e.shiftKey then .2 else 1
    for iframe in document.querySelectorAll('iframe')
      iframe.contentWindow?.postMessage {type: 'speed', speed}, '*'

  window.onkeydown = (e) ->
    setSpeed e
    switch e.keyCode
      when 33, 37, 38 then slideshow.prev()
      when 34, 39, 40 then slideshow.next()
      #else console.log 'keyCode', e.keyCode
  window.onkeyup = (e) -> setSpeed e

  slides  = document.querySelector '.slides'
  squeeze = document.querySelector '.squeeze'

  ping = () ->
    {style} = slides

    doc = document.documentElement

    width  = Math.min doc.clientWidth,  window.innerWidth
    height = Math.min doc.clientHeight, window.innerHeight

    ratio = width / WIDTH
    ratio = Math.min ratio, (height - FOOTER) / HEIGHT
    ratio = Math.min 1, ratio

    margin = Math.max 0, (height - HEIGHT * ratio - FOOTER) / 2

    transform = "scale(#{ratio},#{ratio})"
    transform = "translate(-50%, 0) #{transform}"
    style.WebkitTransform = style.transform = transform
    style.WebkitTransformOrigin = style.transformOrigin = "50% 0%"

    {style} = squeeze
    style.height = (HEIGHT * ratio) + 'px'
    style.marginTop = margin + 'px'

  window.onresize = ping
  ping()

module.exports = controls