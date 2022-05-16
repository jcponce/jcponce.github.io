#!/bin/bash
browserify -t coffeeify --extension=".coffee" controller/index.coffee > build/controller.js
browserify -t coffeeify --extension=".coffee" iframe/index.coffee > build/iframe.js

browserify -t coffeeify --extension=".coffee" iframe/gralgebra.coffee > build/gralgebra.js
browserify -t coffeeify --extension=".coffee" iframe/fourier.coffee > build/fourier.js
