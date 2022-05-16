(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var k, klass, mathbox, ref, suffix, three, types;

window.mathbox = (ref = mathBox({
  plugins: ['core', 'mathbox', 'controls', 'cursor'],
  controls: {
    klass: THREE.OrbitControls
  },
  camera: {
    fov: 60
  }
}), mathbox = ref.mathbox, three = ref.three, ref);

document.body.classList.add('sandbox');

mathbox.set({
  scale: 720,
  focus: 3
});

three.renderer.setClearColor(new THREE.Color(0xFFFFFF), 1);

three.camera.position.set(0, 0, 3);

types = (function() {
  var ref1, results;
  ref1 = MathBox.Primitives.Types.Classes;
  results = [];
  for (k in ref1) {
    klass = ref1[k];
    suffix = klass.model === MathBox.Model.Group ? ' /' : '';
    results.push("<" + k + suffix + ">");
  }
  return results;
})();

types.sort();

console.info("MathBox Sandbox - Use `mathbox.inspect()` to see the tree, `view = view.tag()` to spawn a `<tag>` inside another one, starting with `mathbox`.");

console.log("Available: " + types.join("  "));



},{}]},{},[1]);
