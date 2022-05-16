module.exports = (present, mathbox) ->
  {three} = mathbox

  if window == top
    window.onkeydown = (e) ->
      switch e.keyCode
        when 37, 38 then present[0].set 'index', present[0].get('index') - 1
        when 39, 40 then present[0].set 'index', present[0].get('index') + 1
        else return

  window.onmessage = (e) ->
    {data} = e
    if data.type == 'slideshow'
      present.set 'index', data.i + 1

  three.on 'mathbox/progress', (e) ->
    i = present[0].get('index')

    if e.total == e.current and i <= 2
      for j in [i...2]
        window.parent.postMessage {type: 'slideshow', method: 'next'}, '*'
  