root = if typeof module != 'undefined' then module else null
root = if typeof window != 'undefined' then window else root

root.App =
  mount: (_element, location) ->

    getID = ()  -> (location.hash.split('#')[1] || '');
    root.onhashchange = () -> refresh()

    refresh = () ->
      id = getID()
      return unless id.length

      rand = Math.floor(Math.random() * 0x100000000).toString 16

      script = document.createElement 'script'
      script.src = "../build/#{id}.js?#{rand}"
      _element.appendChild script

    refresh()

