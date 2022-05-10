(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var root;

root = typeof module !== 'undefined' ? module : null;

root = typeof window !== 'undefined' ? window : root;

root.App = {
  mount: function(_element, location) {
    var getID, refresh;
    getID = function() {
      return location.hash.split('#')[1] || '';
    };
    root.onhashchange = function() {
      return refresh();
    };
    refresh = function() {
      var id, rand, script;
      id = getID();
      if (!id.length) {
        return;
      }
      rand = Math.floor(Math.random() * 0x100000000).toString(16);
      script = document.createElement('script');
      script.src = "../build/" + id + ".js?" + rand;
      return _element.appendChild(script);
    };
    return refresh();
  }
};



},{}]},{},[1]);
