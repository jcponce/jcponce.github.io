/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.easeInOut = easeInOut;
exports.sinEaseInOut = sinEaseInOut;
exports.smallEaseInOut = smallEaseInOut;
exports.slurp = slurp;
exports.experp = experp;
exports.clampedSlurp = clampedSlurp;
exports.clamp = clamp;
exports.divideInterval = divideInterval;
exports.posMod = posMod;
exports.to2dIsometric = to2dIsometric;

var _matrixMultiplication = __webpack_require__(16);

var _matrixMultiplication2 = _interopRequireDefault(_matrixMultiplication);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function easeInOut(t) {
    var amt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

    var tPow = Math.pow(t, amt);
    return tPow / (tPow + Math.pow(1 - t, amt));
}

function sinEaseInOut(t) {
    return 0.5 - 0.5 * Math.cos(Math.PI * t);
}

function smallEaseInOut(t, a, b) {
    // maximum slope, during the constant part
    var m = 1 / (1 - a - b);

    // f0
    if (t < a) {
        return 0;
    }

    // f1
    if (t < b) {
        return m / 2 / (b - a) * (t - a) * (t - a);
    }

    // f2
    if (t < 1 - b) {
        return m * (t - b) + // constant line part
        m / 2 * (b - a); // maximum value of f1
    }

    // use symmetry powers
    return 1 - smallEaseInOut(1 - t, a, b);
}

function slurp(val1, val2, amt) {
    return (val2 - val1) * amt + val1;
}

function experp(val1, val2, amt) {
    return Math.exp(slurp(Math.log(val1), Math.log(val2), amt));
}

function clampedSlurp(val1, val2, amt) {
    if (amt < 0) {
        return val1;
    }
    if (amt > 1) {
        return val2;
    }
    return slurp(val1, val2, amt);
}

function clamp(amt, val1, val2) {
    if (amt < val1) {
        return val1;
    }
    if (amt > val2) {
        return val2;
    }
    return amt;
}

/**
 * Extracts a 0-1 interval from a section of a 0-1 interval
 *
 * For example, if min == 0.3 and max == 0.7, you get:
 *
 *           0.3  0.7
 *     t: 0 --+----+-- 1
 *           /      \
 *          /        \
 *         /          \
 *     -> 0 ---------- 1
 *
 * Useful for making sub animations.
 *
 * Doesn't do any clamping, so you might want to clamp yourself.
 */
function divideInterval(t, min, max) {
    return (t - min) / (max - min);
}

/**
 * Does a positive modulo
 * @param {number} a The thing being modulo'd
 * @param {number} b The divider thing
 * @returns {number} a % b
 */
function posMod(a, b) {
    var out = a % b;
    if (out < 0) {
        out += b;
    }
    return out;
}

// TODO? Redesign so this generates a function?
function to2dIsometric(x, y, z) {
    var xzAngle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var yAngle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    var mul = (0, _matrixMultiplication2.default)()(3);
    // s/o to wikipedia for these rotation matrices
    var xzRotateMatrix = [Math.cos(xzAngle), 0, -Math.sin(xzAngle), 0, 1, 0, Math.sin(xzAngle), 0, Math.cos(xzAngle)];
    var yRotateMatrix = [1, 0, 0, 0, Math.cos(yAngle), Math.sin(yAngle), 0, -Math.sin(yAngle), Math.cos(yAngle)];
    var transformMatrix = mul(yRotateMatrix, xzRotateMatrix);

    var transformed = mul(transformMatrix, [x, y, z]);
    // Just return the x and y
    return { x: transformed[0], y: transformed[1] };
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _controllerUtil = __webpack_require__(5);

var _controller = __webpack_require__(4);

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CanvasController = function (_Controller) {
	_inherits(CanvasController, _Controller);

	function CanvasController(id) {
		var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
		var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

		_classCallCheck(this, CanvasController);

		var _this = _possibleConstructorReturn(this, (CanvasController.__proto__ || Object.getPrototypeOf(CanvasController)).call(this));

		_this.id = id;
		_this.canvas = document.getElementById(id);
		if (width == null) {
			width = _this.canvas.width;
		}
		if (height == null) {
			height = _this.canvas.height;
		}

		/** @type {CanvasRenderingContext2D} */
		_this.context = _this.canvas.getContext('2d');
		_this.width = width;
		_this.height = height;
		return _this;
	}

	_createClass(CanvasController, [{
		key: "isOnScreen",
		value: function isOnScreen() {
			return (0, _controllerUtil.elementInView)(this.canvas);
		}
	}, {
		key: "getScrollPosition",
		value: function getScrollPosition() {
			return (0, _controllerUtil.getScrollPosition)(this.canvas);
		}
	}, {
		key: "clear",
		value: function clear() {
			// Clear the previous frame
			this.context.resetTransform();
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}]);

	return CanvasController;
}(_controller2.default);

exports.default = CanvasController;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.palette = undefined;
exports.rgb = rgb;
exports.grey = grey;

var _util = __webpack_require__(0);

function rgb(r, g, b) {
	return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function grey(whiteAmt) {
	whiteAmt = (0, _util.clamp)(whiteAmt, 0, 1);
	var whiteRgb = Math.floor(255 * whiteAmt);
	return rgb(whiteRgb, whiteRgb, whiteRgb);
}

var palette = exports.palette = {
	black: '#333',
	blue: '#4657d7',
	cyan: '#57a7cc',
	pink: '#e91e63',
	orange: '#ed7656'
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getWave = getWave;
exports.normaliseWave = normaliseWave;
exports.getWaveFunction = getWaveFunction;
exports.squareWave = squareWave;
exports.renderWave = renderWave;

var _util = __webpack_require__(0);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Generates a wave from a function in the range [0, 1)
function getWave(fn) {
    var numSamples = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 128;

    var points = [];
    for (var i = 0; i < numSamples; i++) {
        var amt = i / numSamples;
        points.push(fn(amt));
    }
    return points;
}

/**
 * @param {Array<number>} wave
 * @returns {Array<number>} Normalised wave (in the range -1 to 1)
 */
function normaliseWave(wave) {
    var min = Math.min.apply(Math, _toConsumableArray(wave));
    var max = Math.max.apply(Math, _toConsumableArray(wave));
    return wave.map(function (sample) {
        return (0, _util.slurp)(-1, 1, (sample - min) / (max - min));
    });
}

/**
 * Creates a function that gives the value of a wave at a certain point. Does some interpolation.
 * @param {Array<number>} wave 
 * @returns {function(number):number} A wave function (mainly to be used by the playSoundWave thing)
 */
function getWaveFunction(wave) {
    return function (t) {
        t %= 1;
        if (t < 0) {
            t++;
        }
        var index = Math.floor(wave.length * t);
        var nextIndex = (index + 1) % wave.length;
        // The remainder from doing the divide
        var extra = wave.length * t % 1;

        return (0, _util.slurp)(wave[index], wave[nextIndex], extra);
    };
}

function squareWave(t) {
    // Do ya own normalising ya dangus
    return t < 0.5 ? -1 : 1;
}

function renderWave(_ref) {
    var context = _ref.context,
        wave = _ref.wave,
        width = _ref.width,
        _ref$yPosition = _ref.yPosition,
        yPosition = _ref$yPosition === undefined ? 0 : _ref$yPosition,
        yMultiple = _ref.yMultiple,
        _ref$startXAmt = _ref.startXAmt,
        startXAmt = _ref$startXAmt === undefined ? 0 : _ref$startXAmt,
        _ref$type = _ref.type,
        type = _ref$type === undefined ? 'wave' : _ref$type;

    var startI = 0;
    // (I think the wavelength of the wave can be configured by changing the 1 here)
    var step = 1 / wave.length;
    // TODO: Skip drawing the start things that are already defined.
    for (var xAmt = startXAmt, i = startI; xAmt <= 1 + step; xAmt += step, i++) {
        var index = i % wave.length;

        var x = width * xAmt;
        var y = yPosition + yMultiple * wave[index];

        if (type == 'wave') {
            if (i == 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        } else if (type == 'samples') {
            context.beginPath();
            context.arc(x, y, 2, 0, 2 * Math.PI);
            context.fill();
        }
    }
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controller = function () {
    function Controller() {
        _classCallCheck(this, Controller);
    }

    _createClass(Controller, [{
        key: "update",
        value: function update(dt, mousePosition) {
            // nothing.
        }
    }, {
        key: "isOnScreen",
        value: function isOnScreen() {
            return true;
        }
    }, {
        key: "render",
        value: function render() {
            // nothing.
        }
    }]);

    return Controller;
}();

exports.default = Controller;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getScrollPosition = getScrollPosition;
exports.elementInView = elementInView;
function getScrollPosition(elem) {
    var boundingRect = elem.getBoundingClientRect();
    var centerY = (boundingRect.top + boundingRect.bottom) / 2;
    var windowHeight = window.innerHeight || document.documentElement.clientHeight;
    return centerY / windowHeight;
}

function elementInView(elem) {
    // Thanks stack overflow https://stackoverflow.com/a/7557433
    var boundingRect = elem.getBoundingClientRect();

    return boundingRect.bottom >= 0 && boundingRect.top <= (window.innerHeight || document.documentElement.clientHeight) && boundingRect.right >= 0 && boundingRect.left <= (window.innerWidth || document.documentElement.clientWidth);
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFourierData = getFourierData;
exports.getRealFourierData = getRealFourierData;
exports.resample2dData = resample2dData;

var _fft = __webpack_require__(21);

var _fft2 = _interopRequireDefault(_fft);

var _util = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Do the fourier thing using a bunch of complex points
 * 
 * @param {Array<Number>} points Array of points, alternative with re, im pairs. Length must be a power of 2 
 */
function getFourierData(points) {
    if (points.length == 0) {
        return [];
    }
    var numPoints = points.length / 2;
    var fft = new _fft2.default(numPoints);

    var out = fft.createComplexArray();
    fft.transform(out, points);

    // Transform into an API of points I find friendlier.
    var fftData = [];
    for (var i = 0; i < numPoints; i++) {
        // to reorder the frequencies a little nicer, we pick from the front and back altermatively
        var j = i % 2 == 0 ? i / 2 : numPoints - (i + 1) / 2;
        var x = out[2 * j];
        var y = out[2 * j + 1];
        var freq = (j + numPoints / 2) % numPoints - numPoints / 2;
        fftData.push({
            freq: freq,
            // a little expensive
            amplitude: Math.sqrt(x * x + y * y) / numPoints,
            // a lottle expensive :(
            phase: Math.atan2(y, x)
        });
    }
    // fftData.sort((a, b) => b.amplitude - a.amplitude);
    return fftData;
}

/**
 * 
 * @param {Array<Number>} points Array of values of some wave. Must be a power of 2.
 */
function getRealFourierData(points) {
    if (points.length == 0) {
        return [];
    }
    var numPoints = points.length;
    var fft = new _fft2.default(numPoints);

    var formatedPoints = fft.createComplexArray();
    fft.toComplexArray(points, formatedPoints);

    var out = fft.createComplexArray();
    fft.transform(out, formatedPoints);

    // Transform into an API of points I find friendlier.
    var fftData = [];
    // We only have to read the first half of this because of symmetry things.
    for (var i = 0; i < numPoints / 2; i++) {
        var x = out[2 * i];
        var y = out[2 * i + 1];
        var freq = i;
        fftData.push({
            freq: freq,
            // a little expensive
            // Also we gotta multiply this by 2 to account for the other side that
            amplitude: 2 * Math.sqrt(x * x + y * y) / numPoints,
            // a lottle expensive :(
            phase: Math.atan2(y, x)
        });
    }
    // fftData.sort((a, b) => b.amplitude - a.amplitude);
    return fftData;
}

/**
 * Transforms a list of x, y points into input appropriate for a fourier transform.
 */
function resample2dData(points, numSamples) {
    if (points.length == 0) {
        // Can't resample if we don't have ANY points
        return [];
    }
    var newPoints = [];
    for (var i = 0; i < numSamples; i++) {
        var position = points.length * (i / numSamples);
        var index = Math.floor(position);
        var nextIndex = (index + 1) % points.length;
        var amt = position - index;
        newPoints.push(
        /* x */(0, _util.slurp)(points[index].x, points[nextIndex].x, amt),
        /* y */(0, _util.slurp)(points[index].y, points[nextIndex].y, amt));
    }
    return newPoints;
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvasController = __webpack_require__(1);

var _canvasController2 = _interopRequireDefault(_canvasController);

var _util = __webpack_require__(0);

var _color = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var transitionFactor = 1 / 18;

var ComplexSinusoidController = function (_CanvasController) {
    _inherits(ComplexSinusoidController, _CanvasController);

    function ComplexSinusoidController(id, width, height) {
        _classCallCheck(this, ComplexSinusoidController);

        var _this = _possibleConstructorReturn(this, (ComplexSinusoidController.__proto__ || Object.getPrototypeOf(ComplexSinusoidController)).call(this, id, width, height));

        _this.animAmt = 0;
        // Functions so that they can be overridden elsewhere.
        _this.xzAngleFn = function () {
            return _this.xzAngle;
        };
        _this.yAngleFn = function () {
            return 0;
        };
        _this.radius = 0.2 * _this.height;
        _this.length = 0.7 * _this.width;
        _this.xzAngle = 0;
        return _this;
    }

    _createClass(ComplexSinusoidController, [{
        key: "update",
        value: function update(dt, mousePosition) {
            var period = 7;
            this.animAmt += dt / period;
            this.animAmt %= 1;

            var pos = this.getScrollPosition();
            var desiredAngle = 0;
            if (pos < 0.6) {
                desiredAngle = Math.PI / 2;
            }
            this.xzAngle += transitionFactor * (desiredAngle - this.xzAngle);
        }
    }, {
        key: "render",
        value: function render() {
            this.clear();
            this.renderWave();
        }
    }, {
        key: "renderWave",
        value: function renderWave() {
            this.context.translate(this.context.canvas.width / 2, this.context.canvas.height / 2);
            this.context.beginPath();
            this.context.strokeStyle = _color.palette.blue;
            this.context.lineWidth = 2;

            var xzAngle = this.xzAngleFn(this.animAmt);
            var yAngle = this.yAngleFn(this.animAmt);
            for (var i = 0; i < 100; i++) {
                var amt = i / 99;
                var x = this.length * (amt - 0.5);
                var y = this.radius * Math.sin(2 * Math.PI * (3 * amt - 4 * this.animAmt));
                var z = this.radius * Math.cos(2 * Math.PI * (3 * amt - 4 * this.animAmt));

                var points = (0, _util.to2dIsometric)(x, y, z, xzAngle, yAngle);
                if (amt == 0) {
                    this.context.arc(points.x, points.y, 3, 0, 2 * Math.PI);
                }
                if (i == 0) {
                    this.context.moveTo(points.x, points.y);
                } else {
                    this.context.lineTo(points.x, points.y);
                }
            }

            this.context.stroke();
        }
    }]);

    return ComplexSinusoidController;
}(_canvasController2.default);

exports.default = ComplexSinusoidController;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.renderBoundingCube = renderBoundingCube;

var _util = __webpack_require__(0);

function renderBoundingCube(context, minX, maxX, minY, maxY, minZ, maxZ, xzAngle, yAngle) {
    var xs = [minX, maxX];
    var ys = [minY, maxY];
    var zs = [minZ, maxZ];

    context.beginPath();
    context.globalAlpha = 0.1;

    var permutations = [[0, 0], [0, 1], [1, 0], [1, 1]];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = permutations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ref = _step.value;

            var _ref2 = _slicedToArray(_ref, 2);

            var p1 = _ref2[0];
            var p2 = _ref2[1];

            // edges along x axis
            line3d(context, xs[0], ys[p1], zs[p2], xs[1], ys[p1], zs[p2], xzAngle, yAngle);
            // along y axis
            line3d(context, xs[p1], ys[0], zs[p2], xs[p1], ys[1], zs[p2], xzAngle, yAngle);
            // along z axis
            line3d(context, xs[p1], ys[p2], zs[0], xs[p1], ys[p2], zs[1], xzAngle, yAngle);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    context.stroke();
    context.globalAlpha = 1;
}

function line3d(context, x1, y1, z1, x2, y2, z2, xzAngle, yAngle) {
    var startPoint = (0, _util.to2dIsometric)(x1, y1, z1, xzAngle, yAngle);
    var endPoint = (0, _util.to2dIsometric)(x2, y2, z2, xzAngle, yAngle);
    context.moveTo(startPoint.x, startPoint.y);
    context.lineTo(endPoint.x, endPoint.y);
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _controllerUtil = __webpack_require__(5);

var _util = __webpack_require__(0);

var _controller = __webpack_require__(4);

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ImageSwapController = function (_Controller) {
    _inherits(ImageSwapController, _Controller);

    function ImageSwapController(id) {
        _classCallCheck(this, ImageSwapController);

        var _this = _possibleConstructorReturn(this, (ImageSwapController.__proto__ || Object.getPrototypeOf(ImageSwapController)).call(this));

        _this.id = id;
        _this.imageSrcs = [];

        _this.img = document.getElementById(id);
        _this.index = 0;

        _this.minY = 0.2;
        _this.maxY = 0.8;

        _this.scrollFocus = _this.img;
        return _this;
    }

    _createClass(ImageSwapController, [{
        key: "update",
        value: function update() {
            if (this.imageSrcs.length == 0) {
                return;
            }
            var pos = 1 - (0, _controllerUtil.getScrollPosition)(this.scrollFocus);
            var posAmt = (0, _util.clamp)((0, _util.divideInterval)(pos, this.minY, this.maxY), 0, 1);
            this.index = (0, _util.clamp)(Math.floor(this.imageSrcs.length * posAmt), 0, this.imageSrcs.length - 1);

            this.img.src = this.imageSrcs[this.index];
        }
    }, {
        key: "isOnScreen",
        value: function isOnScreen() {
            return (0, _controllerUtil.elementInView)(this.scrollFocus);
        }
    }]);

    return ImageSwapController;
}(_controller2.default);

exports.default = ImageSwapController;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loopLikeAJpeg = loopLikeAJpeg;
exports.range = range;
/**
 * Returns a bunch of x-y coordiantes in the order that jpegs are broken up.
 * 
 * Jpegs loop in a zig-zag type pattern from the top left corner to the bottom right.
 * That's what this does.
 * 
 * @param {Number} size How big the square matrix thing that we're loopig through is.
 */
function loopLikeAJpeg(size) {
    var flip_dir = false;
    var coordinates = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = range(size)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var i = _step.value;

            var r = range(i + 1);
            if (flip_dir) {
                r.reverse();
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = r[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var j = _step3.value;

                    // Start at the right edge (0, i), and go upwards to the right.
                    coordinates.push([0 + j, i - j]);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            flip_dir = !flip_dir;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = range(1, size)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _i = _step2.value;

            var r = range(size - _i);
            if (flip_dir) {
                r.reverse();
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = r[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _j = _step4.value;

                    // Start the the bottom edge (i, size-1) and go upwards to the right.
                    coordinates.push([_i + _j, size - 1 - _j]);
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            flip_dir = !flip_dir;
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return coordinates;
}

// Exported just for testing.
function range(min) {
    var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (max == null) {
        max = min;
        min = 0;
    }
    // Neat little trick from 
    // https://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-a-range-within-the-supp
    return Array.from(Array(max - min).keys()).map(function (el) {
        return el + min;
    });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.baseFrequency = exports.SAMPLE_RATE = undefined;
exports.playSoundWave = playSoundWave;

var _util = __webpack_require__(0);

var _waveThings = __webpack_require__(3);

var SAMPLE_RATE = exports.SAMPLE_RATE = 44100;
var baseFrequency = exports.baseFrequency = 220;

/**
 * 
 * @param {function(number):number|Array<number>} wave 
 */
function playSoundWave(wave) {
    if (wave.length == 0) {
        // Do nothing if we have a nothing-lengthed wave.
        return;
    }
    var baseVolume = 0.8;
    var decay = 3;
    if (wave.constructor === Array) {
        // transform our wave array into a function we can call
        wave = (0, _waveThings.getWaveFunction)((0, _waveThings.normaliseWave)(wave));
    }

    var audioContext = new AudioContext();
    var buffer = audioContext.createBuffer(1, SAMPLE_RATE, SAMPLE_RATE);

    var channel = buffer.getChannelData(0);
    for (var i = 0; i < buffer.length; i++) {
        // Where we are in the sound, in seconds.
        var t = i / SAMPLE_RATE;
        // The waves are visually at a very low frequency, we need to bump that up a bunch
        channel[i] += wave(baseFrequency * t);
    }
    var source = audioContext.createBufferSource();
    source.buffer = buffer;

    var gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(baseVolume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + decay);

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    source.start();
    source.stop(audioContext.currentTime + decay);
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderLabel = renderLabel;
/**
 * Draws a label, keeping it within the bounds of the canvas.
 * @param {CanvasRenderingContext2D} context Rendering context
 * @param {string} text Text to display
 * @param {number} x X coord of what the label is pointing to
 * @param {number} y Y coord of what the label is pointing to
 * @param {number} labelDist Distance between the label and the thing the label's labelling
 * @param {string} color Color of the label
 */
function renderLabel(context, text, x, y, labelDist, color, minX, maxX) {
    var textPadding = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 5;

    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = color;
    context.fillStyle = color;

    var lines = text.split('\n');

    var textWidth = 0;
    context.font = '16px "Open Sans", sans-serif';
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var line = _step.value;

            var textMetrics = context.measureText(line);
            if (textMetrics.width > textWidth) {
                textWidth = textMetrics.width;
            }
        }
        // Just hard code this because measuring it is more complicated
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    var textHeight = 20;

    // For the moment, set it to what it would be if it was facing the right
    var labelX = x + labelDist;
    var labelY = 0;
    var textX = 0;
    var textY = 0;

    if (labelX + textWidth + textPadding < maxX) {
        // slanting to the right
        labelX = x + labelDist;
        labelY = y - labelDist;
        textX = labelX + textPadding;
        textY = labelY - textPadding;
    } else {
        // slanting to the left
        labelX = x - labelDist;
        labelY = y - labelDist;
        textX = labelX - textWidth - textPadding;
        textY = labelY - textPadding;
    }
    for (var i = 0; i < lines.length; i++) {
        var _line = lines[i];
        var lineOffset = textHeight * (lines.length - 1 - i);
        context.fillText(_line, textX, textY - lineOffset);
    }

    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(labelX, labelY);
    context.stroke();
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dataLength = exports.data = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _circle = __webpack_require__(39);

var _circle2 = _interopRequireDefault(_circle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var data500 = [[46907.15070237851, 0.002, 2.5392475096073284], [16301.223228538258, 0.006, -3.029102700566724], [11068.29780225054, 0.004, 2.8611729233220355], [10788.388408232371, 0.012, 1.4015830156492102], [9364.721337497775, 0.008, -2.246129592130187], [8226.12395305788, -0.004, 1.4163751985313011], [7711.3419287159295, -0.002, 2.7765809408368347], [6866.4524976516395, -0.008, 2.1373962619357263], [6558.837965422872, -0.012, -0.8666683800178686], [6532.107597433332, 0.01, -2.7866200337070817], [5425.2979638389015, -0.006, 2.0295952070098737], [3712.3480565971904, -0.014, 2.2020127700830447], [3696.881326873199, 0.014, -1.4769489195291858], [2717.4268313041694, -0.016, 1.1661352333610462], [2685.6879162179416, -0.018000000000000002, -1.4301916656888842], [2396.7724289196008, 0.018000000000000002, -1.938258712732489], [2173.1745325077245, -0.022, -2.408814763212893], [1920.2582702395464, -0.02, 2.5874841891973537], [1602.1347373757797, 0.02, -0.7821046713226858], [1393.905214965102, 0.026000000000000002, -1.9795502276779917], [1333.6464285513343, -0.01, -1.3048133542260647], [1155.429701293995, 0.022, 2.6301687240089975], [1020.0253796051335, -0.026000000000000002, -1.6346161876418328], [870.1051274675666, -0.028, -2.8133115840183973], [786.8519383564552, -0.03, 0.8763644990260443], [775.2555097476887, 0.03, 1.291031393329353], [691.90348968366, -0.024, 0.48371554837891934], [644.4436538557993, 0.046, -2.146924261824758], [560.4765825778605, 0.034, -2.164310128954773], [556.3507898442693, 0.016, -1.237654406727246], [554.2968837991153, 0.038, 2.090401508434924], [536.9215311854408, 0.052000000000000005, -1.6085755635747983], [491.73816248851114, -0.036000000000000004, 2.610045871730714], [479.20359029629304, 0.028, 1.0790191141333154], [412.54736028859116, -0.04, -2.7115309731859623], [399.1047723200872, -0.032, 2.059425816984405], [373.1699813494269, 0.032, 0.1617441498250398], [350.26981140719903, -0.048, -1.7813511297864402], [318.31067435962143, 0.054, 2.333438924715679], [294.69878876270127, 0.05, -2.8826699827201283], [289.86446062918367, 0.062, -1.2825073494773749], [286.765376813422, -0.044, -0.21705180437840965], [284.8131512010388, 0.048, 1.3927230981374168], [282.4247546073945, 0.042, -2.3696150006863106], [272.46062136944494, 0.024, -1.593261430408801], [271.9986575129024, -0.034, 2.4988177568859253], [258.4943115932245, 0.04, 1.1193483643155797], [240.32002354944603, -0.056, 0.5114248434922891], [227.31255343487774, -0.058, -2.4589747278269027], [224.60430715740318, -0.064, 2.4739355658878126], [212.5423024230878, -0.038, 0.2705070771220832], [185.25544075634673, 0.056, 0.35980691271986825], [176.16671966347482, -0.054, -1.7835244206534278], [165.54099040197298, 0.058, 1.4328481134658613], [164.63056130340564, 0.07200000000000001, -2.0346826499463315], [161.73413219167156, -0.046, 1.2090830388428047], [160.49183169537002, 0.074, 1.558828438419231], [155.4750434412828, 0.036000000000000004, -1.9134577133482782], [150.74156294465243, -0.074, 1.3421528625393055], [148.77389380330564, 0.044, 0.5501429519440298], [143.28332599968215, 0.07, 2.075189355914331], [139.6310506493838, -0.06, 2.063642175367188], [138.79436292571262, 0.066, 2.2720107239863143], [133.01904094499022, -0.05, 2.8668367528514853], [132.18790677345342, 0.078, -3.076884821055131], [129.76781002531314, 0.08600000000000001, 1.424811465258173], [119.60357085037673, -0.066, -2.1551009712750973], [119.51215305781032, 0.088, -1.4435096433631922], [112.95315882288168, -0.052000000000000005, -2.6133939533984636], [107.65001185149836, -0.1, 1.383774652459546], [105.80078935909211, -0.08600000000000001, -1.5244829117953655], [97.22705286428638, -0.042, 0.8070667620403219], [95.4089883030525, -0.112, -1.4821682065386075], [94.1352339908572, 0.096, -2.8537190743425125], [91.28124770352012, -0.098, -1.7916821880771379], [90.96843873830643, -0.094, 2.275666795351655], [90.58087745423272, 0.09, -2.0838850688577124], [89.64894782737254, -0.108, -2.942965029263414], [88.55251410067964, 0.122, 3.0968411939199334], [77.62653890375356, -0.068, -3.0599729426376205], [75.24465060216517, 0.092, -0.4642923896325076], [74.93005705584937, 0.098, 0.6708725801192154], [74.67133472976438, 0.076, -0.06371585104392338], [70.41262666290393, -0.07200000000000001, -1.0537898574251854], [68.88092481163254, -0.092, -2.8432670074807254], [68.82399721697999, -0.076, 0.42251362423062516], [68.32980503322362, 0.13, 0.4410999699525029], [68.25662077414708, -0.07, -0.33227257403345445], [66.29233532518165, -0.088, 1.294144824738236], [66.26754683659713, 0.10200000000000001, 0.3096763187386672], [64.13198918635067, -0.08, -1.133727838038703], [63.49399165208018, -0.10400000000000001, 2.0358967920391002], [62.89266714862323, -0.11, 1.3308858079181365], [61.83336658435731, -0.078, 2.7413661074381905], [61.13840412026524, 0.08, -2.8379798965118685], [60.726260095820145, 0.11, 3.081230639448951], [56.58062658022927, 0.1, 2.596369544570918], [56.49830886018777, 0.068, -0.7764647524804048], [55.98388946484871, -0.106, 0.6212811236814328], [55.39672701074099, 0.114, -2.7091415474205958], [54.38854382272228, 0.082, -2.425887074500422], [51.69935125090771, 0.108, -0.9204307479539787], [51.00769732584507, -0.082, 2.1815035888702257], [48.76230993473804, -0.062, -0.7617800404768663], [48.553663574175694, 0.136, -1.898333939944696], [48.05109410254169, -0.154, -2.1067855570305807], [47.02808917449337, 0.124, -0.6775690766507981], [46.96046066091242, -0.09, -1.5721960065787244], [46.66198357620065, 0.14, 2.8232340921921053], [45.510236429328366, 0.14400000000000002, 0.6186283113073996], [44.20721867876503, -0.114, 2.447906998399911], [44.20268097368798, 0.168, -2.346392329649515], [40.386283551363825, 0.084, -0.9367411234578522], [39.9805498305494, 0.132, -2.4244386101974427], [39.52388834986413, 0.134, 0.38308808696809526], [39.426304662170814, -0.146, 0.6489764973152875], [39.39928423282227, 0.12, -0.962559055254391], [38.750550028865675, 0.06, -1.5825224382785947], [38.13900640201545, -0.134, -2.8326891628485615], [37.375830187272655, -0.122, -2.3691139933626726], [35.55446394331202, -0.11800000000000001, -0.041186096657782126], [35.44311139969532, 0.166, 1.7152750316151248], [35.233240130719885, -0.116, -0.09202323618239301], [35.084597125544995, 0.17, 0.3598680625513782], [34.72550698901998, 0.164, -1.3053273930978766], [33.873757631505335, 0.14200000000000002, 2.7298214628105937], [33.84787433644754, 0.152, -2.9929731499850964], [33.234523598931894, -0.126, 2.8968940603777042], [32.963591714406824, 0.128, -1.931706982355626], [32.90394480875257, 0.064, -0.009028489985424697], [32.41123113522608, -0.132, 1.2937392165082338], [32.2911408513418, 0.2, -1.6587834276779658], [31.16571226643879, -0.12, 1.7353025531105806], [30.267777856422892, 0.138, 0.02345868047596972], [30.098607031732712, -0.128, -1.5273665817982383], [29.807937697950802, -0.14200000000000002, -0.24777815192763786], [29.095661512276276, -0.138, 2.9354095904560173], [26.94175228580391, -0.194, 2.857981101738909], [26.71200967319392, 0.17200000000000001, 1.8000605351311292], [26.517220322096655, -0.192, -0.2543893099265589], [26.236987824856413, 0.158, -2.304224110968231], [25.97810359860219, 0.154, -1.4598050414704764], [25.857056997102205, -0.10200000000000001, -1.876239502161634], [25.349683354247606, -0.162, 0.9067584033722129], [25.028232977620718, 0.15, -0.49631224109038036], [24.96169710738585, 0.126, 1.7566369017738448], [23.56944841345149, -0.24, -2.606553465497348], [23.327133967362276, -0.14400000000000002, 2.6607301672968475], [23.26640008286091, 0.226, -2.3206226178706646], [22.363090821479172, -0.136, 1.5342015630084493], [22.226652481801995, -0.17, 2.5235866355383645], [22.113898125030136, 0.16, 1.2110555504699214], [21.834163589469558, 0.146, -2.682547298729719], [21.660443945835862, -0.158, -1.3096960442311325], [21.32855672189188, 0.182, -2.1962243449988543], [21.257438197040504, 0.186, 1.8591788936815878], [21.25092806907633, -0.096, -0.8309509386396571], [21.07174007329418, -0.178, 1.8501891006858622], [20.586695562587497, 0.202, 0.7584190410997556], [20.545347320195145, 0.198, 1.6362437937936827], [20.396608875985308, 0.196, -0.9734739763067952], [20.2394932244031, 0.176, -0.015655431573798947], [20.089431685694954, 0.194, -2.1123973704482144], [19.811942081771516, 0.252, -2.4315785122042333], [19.505421697799612, -0.2, 3.0620215759796805], [19.394406117980875, -0.214, -2.0879680614500575], [18.95895751678744, 0.184, -2.892949314950828], [18.705661008693024, -0.164, -3.1121443833838445], [18.67016182499107, -0.13, -2.835467480028931], [18.49835277251892, -0.196, 2.4650924915124675], [18.441742221271518, 0.192, 0.6385079222916736], [18.389430541185558, 0.218, 0.5830797763402109], [18.26252199530254, -0.198, -1.2743682441011446], [17.468066887353412, -0.212, 0.8116023286124648], [17.446236298909454, -0.152, 2.4680723695681026], [17.43118053308523, -0.156, 1.5694266076093262], [17.27472366306585, 0.10400000000000001, 2.3384668155077697], [17.109336491484466, 0.212, 1.7900798651950496], [17.04315653760007, -0.16, -2.5876942747749165], [17.01601342794025, 0.292, 0.1407757496678064], [16.940106635699557, -0.23600000000000002, 2.394211697655626], [16.711119427380726, -0.242, 1.5188213574526082], [16.657940621634562, 0.268, -1.8687573861416487], [16.652669050769084, -0.15, 1.5316280440106418], [16.57971602190191, 0.11800000000000001, 0.4139573239943992], [16.566775845913426, -0.084, -3.0031823366181882], [16.227476148127703, -0.234, -0.7999895371271639], [16.015357555081614, 0.162, -0.9384805139771693], [15.62542103992904, 0.112, 1.086331963186151], [15.584777220106616, -0.17200000000000001, -1.37353973298188], [15.403421995728564, 0.22, -2.1033243390073646], [15.314737431782683, 0.326, -2.1086394409975022], [14.806024952248217, 0.3, -2.1094817179753482], [14.58242799518957, -0.268, 1.784128719839911], [14.269768896964615, -0.25, 1.7805188764379187], [14.265814265057692, -0.28200000000000003, 2.2501175218415024], [14.124133932373718, 0.17400000000000002, -1.9887739655136554], [14.068815140957955, 0.178, -2.4099822228851053], [13.995177107431289, -0.232, 2.1603002226385555], [13.857270684219943, -0.186, -0.8806400285868405], [13.830478991491484, 0.306, -0.8093670654751545], [13.821601630859652, 0.272, 2.2959337663645583], [13.573277123703422, 0.156, -0.5489869566825283], [13.347614975899308, 0.264, -0.7994920791355725], [13.04429371590161, 0.244, 1.276809121836848], [13.023609296381998, -0.20600000000000002, 1.1792658184011617], [12.899435284558487, -0.17400000000000002, 1.0116281794502726], [12.823495290428907, 0.266, 0.8846013641403121], [12.812737510205315, -0.21, 1.9302395123893656], [12.772494736232536, -0.23800000000000002, 0.9366439923628491], [12.262569229237632, 0.258, -2.652206864296608], [11.911541020327524, 0.29, -2.690695647708631], [11.890920073375986, 0.368, -1.3086126033610372], [11.660970297279434, 0.242, -1.300099591700617], [11.635065315292909, -0.218, 0.19617773252791504], [11.435483210703264, -0.176, 2.8407602128576066], [11.31804157557604, 0.294, -2.5002108101381886], [11.259765155751115, 0.334, 1.0598577342800806], [11.234021963756785, 0.19, -1.442064927811938], [11.225197204477789, 0.106, -2.417323372606883], [11.159926498967092, 0.26, 0.7673617925024636], [11.131861920506857, 0.332, -1.4737014850609196], [10.958356880972673, 0.274, -0.9920935885085959], [10.930842231842776, 0.20800000000000002, -2.8835996284253294], [10.695594550892281, -0.252, -0.2611423493814168], [10.624145936064865, -0.124, 1.0538290078666166], [10.62174495435024, 0.362, -2.4023951693714234], [10.6200992880936, -0.182, -2.9451455409334275], [10.61802240405125, -0.278, 0.5292779510009017], [10.605596439272665, -0.168, 2.2643561440404847], [10.602522412873551, 0.28400000000000003, -2.6936341297821844], [10.592410781025425, 0.308, 1.2563564319095073], [10.590402796651091, 0.328, 0.5674519621170621], [10.582445995499691, 0.302, 0.6069196371592275], [10.559587356521162, 0.276, 1.2499450493152795], [10.443027705098956, -0.222, 2.7387098437459167], [10.318836813037912, 0.47400000000000003, -1.6703857165361808], [10.148941972881902, 0.214, -2.5471013690034283], [10.13540598262645, -0.226, -2.759147127644095], [10.007900725457274, -0.292, -1.0511673475153869], [9.88355001632031, 0.36, 1.146399067796783], [9.802642997679644, 0.296, -1.4398517261647357], [9.787959136839893, 0.246, 2.9554395401197424], [9.747768560358463, -0.14, 2.229149773181515], [9.734710079113333, -0.19, 2.3710088695341347], [9.72680064433604, 0.358, -1.70577445185955], [9.680490490508351, 0.338, -0.51694489249507], [9.626833349862311, 0.188, -2.123594746306415], [9.621868844749786, 0.342, -1.4584576257759991], [9.585697837399168, -0.302, -2.0949210615824785], [9.296283754537985, -0.26, -1.244558433303913], [9.231392488756477, -0.216, 1.815229501526981], [9.194557658180216, -0.23, -0.8053640232484965], [9.133882794846937, 0.20600000000000002, -0.3125375483610092], [8.994391215206829, 0.298, 1.3674341096921654], [8.96298671701239, -0.20800000000000002, -2.9357288811151703], [8.812846820736361, 0.392, 1.171400505221154], [8.79172402485982, 0.222, -1.0500258714380664], [8.584224808450825, -0.262, 1.665912101394742], [8.580843747576795, -0.266, -1.981021973806216], [8.522658380915441, -0.228, -2.2477833239023988], [8.454342072539214, 0.28200000000000003, 0.9690782558008666], [8.448093839956119, 0.34, 2.0843799985279126], [8.446456832236672, 0.366, 1.7509639710451423], [8.441492326372842, 0.148, -2.735250036738737], [8.256095362850756, 0.21, -1.592501197956974], [8.239524760561338, -0.418, 1.5529464931176775], [8.183704370393942, -0.294, 2.1146521976104387], [8.160013917917922, -0.27, -2.4198626638059464], [8.149294950486444, 0.304, 2.3661667147312007], [8.030703379481924, 0.248, -0.7377235320425307], [7.931832457870448, -0.28400000000000003, -0.34227260387176545], [7.902713283235399, 0.318, 0.5828443396632468], [7.81370463556628, -0.5, -1.6055909518804719], [7.81220451687529, 0.18, 0.45076175988643424], [7.4610759240811575, 0.32, 3.041033468434298], [7.444038818665853, -0.304, 1.0749373274976568], [7.4386945304163055, 0.224, -0.5605492728766731], [7.3758417809238646, -0.392, 0.7166149474859227], [7.372893051834245, 0.316, -2.366768061469762], [7.338474440130283, 0.094, 1.2756221250960802], [7.271024357487818, 0.25, 0.8471713382641961], [7.246589077804108, 0.494, -2.9031533108255347], [7.246505004890941, 0.23600000000000002, 0.22850769051883157], [7.206187072494993, -0.248, -0.19232976065612697], [7.180204746147821, 0.454, -0.76862396681697], [7.151679570541557, 0.28, -0.7379612742306574], [7.127268223977705, 0.336, -1.798023178041542], [7.028121746451263, 0.27, -0.435904762867191], [6.997129956090457, 0.232, -1.8793094297313626], [6.97634095559191, 0.388, -2.996757802553761], [6.927245865088033, 0.324, 1.155315923670349], [6.901993102218537, 0.216, -2.9616905966329408], [6.865636385941763, 0.312, -0.6919294281969159], [6.825254901184599, 0.314, 2.3313113782514114], [6.500750709252352, 0.374, -0.41118474109800335], [6.474000382083674, 0.278, -3.096987741967822], [6.432241312331033, 0.448, -1.6654292123179533], [6.3360800280848135, -0.388, -1.3754460833947728], [6.324167692243549, -0.47800000000000004, -0.11475994949103202], [6.2897982954522345, 0.488, 1.7904949884703283], [6.246399116214145, -0.188, 0.4302336887257249], [6.219257250341353, -0.354, 1.3074121114023658], [6.210868744928709, 0.364, -0.4823921953918683], [6.144495239278641, -0.276, 2.6117261599685766], [6.131698018815698, -0.444, 2.094157066183747], [6.0862314621818685, -0.308, 2.9479527338435814], [6.076707362963102, 0.376, 1.7528971263516129], [6.033074686791371, -0.41000000000000003, 1.3585276577366647], [6.016048045407306, -0.312, 2.073184186517633], [6.010528658416818, -0.38, 1.4009456245882856], [5.9617589773827975, -0.20400000000000001, 1.2417174641349376], [5.953443782984559, -0.18, -0.035979049767538185], [5.927468151460201, -0.374, 2.290631520172579], [5.866960143494524, -0.244, -1.0680397237313364], [5.852971196851098, 0.468, -2.2855247113394723], [5.753245781233218, -0.486, 1.4875907045753118], [5.67886057844591, -0.32, -0.6021589041411256], [5.674515530717132, 0.458, -2.780024085101856], [5.672879065337478, 0.40800000000000003, 1.3451873226559474], [5.670095518136501, -0.254, -3.0098040689126093], [5.62805672145689, -0.492, 0.4999950064781163], [5.528138529634587, 0.34600000000000003, 2.3926531150331147], [5.505460509256074, -0.274, -0.23331115863323731], [5.497106317435004, 0.436, -0.8024706844691742], [5.484966257414633, 0.33, 2.5326081177776207], [5.458261729863652, 0.47600000000000003, 1.2302052085043385], [5.414599326878921, -0.29, 0.8681012388857803], [5.4114441266541276, 0.406, -1.6535968074791434], [5.356695392642811, 0.452, 2.3603957377679516], [5.334755244677254, 0.47000000000000003, 0.16700331598599258], [5.297309889029627, -0.47600000000000003, 2.349484560841735], [5.2838563027022545, 0.47800000000000004, 1.9264266626423845], [5.2832608338552705, -0.48, 3.0682781494132882], [5.220349684030491, 0.394, -2.1991940431628776], [5.207936209806022, -0.438, 2.8992395833657114], [5.198842460209888, 0.496, 0.03194112362695705], [5.185356139715628, 0.466, 1.1272292436509228], [5.173731310128793, -0.35000000000000003, 1.5704109158553101], [5.155122093680127, -0.386, 1.5511969613051233], [5.136621727855052, 0.38, -0.17448629619667502], [5.098002185805636, -0.41200000000000003, 2.5320069713639497], [5.061882112021998, 0.354, 0.09476195106246987], [5.035905031473146, -0.224, 0.1154164824222697], [5.028389120862996, 0.47200000000000003, 1.292467370486832], [5.024412059490657, -0.34400000000000003, 2.52926684282135], [5.006945832340475, -0.362, -0.8698253809430749], [4.97371158606798, 0.49, -0.895618890971061], [4.973585364062482, 0.35000000000000003, 1.0222430272614418], [4.965158893463864, 0.24, 2.3322390185664017], [4.952065684569319, -0.4, 1.803478288601391], [4.886800867258782, 0.434, 1.4653593315178195], [4.876800367131826, 0.4, -1.8331547812814641], [4.8683921324525254, 0.23, 0.6014682637050368], [4.8590145871829185, -0.166, 2.689514219631569], [4.840475851196096, 0.464, -1.3505311913390126], [4.812359091933792, 0.446, 1.663120551496429], [4.805643245976179, 0.48, -0.7490352346443875], [4.763947866564614, -0.338, 2.74357447291524], [4.755605166840988, -0.332, -3.0059421059810565], [4.684503235758406, -0.372, -0.5289743225272219], [4.684225291806065, -0.446, -0.26047111109488313], [4.672040420309316, -0.336, 0.354328136557043], [4.641263488458092, 0.23800000000000002, -1.1789847392939081], [4.6163475630672, 0.426, -2.563081466598402], [4.614643964773754, 0.28600000000000003, -0.07646319491830393], [4.602469076639851, 0.498, 1.5623436611211605], [4.569468539785619, -0.43, 2.8877962843867526], [4.53790450178883, 0.31, -1.5531461008589156], [4.530373760992701, -0.33, 0.00048163376783087427], [4.494343258787191, -0.366, 0.46471095449763594], [4.492566943675703, -0.428, 0.8387247777826011], [4.4910154920551255, 0.254, 1.9666771555651164], [4.448269335001955, 0.424, 0.544399213833112], [4.352592746004044, -0.452, -0.3815669916439417], [4.32863113294651, 0.46, 0.7322756820881619], [4.326289577033418, -0.34800000000000003, 1.0408275279004746], [4.3247567227045485, -0.424, 0.1490554079314495], [4.322309662742445, 0.45, 0.877271342564586], [4.312050325660534, 0.41400000000000003, 2.252180846826927], [4.287935987282451, -0.378, -1.157294713284987], [4.28672066698252, -0.458, -1.1849494364123714], [4.282563620427257, 0.432, -2.0602717133274986], [4.2700852168475505, 0.34400000000000003, 1.32980622863743], [4.1731648648158854, -0.322, 0.8696382312005733], [4.166167119942408, 0.34800000000000003, 0.04084491257126028], [4.158280158751655, -0.404, -2.7313045963976195], [4.108899223586955, 0.352, -2.1956193542591667], [4.092515535248041, 0.428, -0.5082797656312817], [4.087538399015721, 0.262, -2.159424563145499], [4.083310058374314, -0.28800000000000003, -3.060259500239784], [4.063428387563185, 0.444, 0.04076125381241572], [4.0380143291410215, 0.442, -1.0031990059204896], [3.978926719749461, -0.324, 0.9913299679384596], [3.966030577217352, -0.34600000000000003, -0.7582185164286795], [3.9454970219185914, -0.148, -1.1478181335979531], [3.9066405990115953, -0.436, 0.5544983408036681], [3.9064464369513185, 0.382, 2.2806683716453002], [3.8991353767780477, -0.394, -2.429698447257421], [3.865732653720633, -0.406, 0.7143864338859268], [3.856712791331925, 0.322, -1.1952266506641525], [3.835998513501081, 0.404, 0.5138367677067226], [3.765298276853097, -0.398, -0.07601447926412103], [3.7351761466373743, -0.464, -0.7857731857053484], [3.6704996698553183, -0.246, -2.9008888791680802], [3.6234956427010427, 0.398, 0.6895566760647328], [3.579264439806301, 0.228, 2.4714692326909073], [3.525370708356332, -0.326, -3.0859832447373554], [3.5232765667047614, -0.184, -0.12073009551279044], [3.5162868610135782, -0.41600000000000004, -0.48340789126652645], [3.4949877024868132, -0.36, 0.2948251673592018], [3.4808732202557917, -0.306, 1.5128418118947586], [3.4633655740339466, 0.396, -0.3940358662300267], [3.430616799575084, -0.432, -1.2677376611208329], [3.409120293631234, -0.358, -2.884599988012897], [3.3892437031585607, 0.234, 0.8841795817358854], [3.379534718517689, -0.382, 0.8723656657110669], [3.3687533588510545, 0.356, 2.58515724836702], [3.352355008143619, -0.256, 0.5293996350341421], [3.3379997489365674, 0.386, 0.6220174975158207], [3.31610583251992, -0.298, -2.0260566179670203], [3.309195751574333, 0.41200000000000003, -0.2327484762031752], [3.2894646552616438, -0.484, -0.5385682913629001], [3.281404225195535, -0.456, 1.8500915796141344], [3.2631006184378837, 0.418, 0.8955534008389957], [3.2473276861597693, 0.492, 0.6322393011286375], [3.2334707281433253, -0.3, 2.2710385860172173], [3.2057964505437644, -0.498, 1.441303613965232], [3.2015074252762115, 0.378, -0.9394390299613027], [3.1974811883159946, 0.116, -0.6871523615246413], [3.1666507282938143, -0.31, 0.8401634573538429], [3.152676767379547, -0.264, 1.7348674490661797], [3.1402432424682187, -0.368, 3.034598655561818], [3.1344842054604465, 0.37, 1.2470113389452504], [3.110706059775874, -0.40800000000000003, -1.1208787310496813], [3.092416757199537, -0.47200000000000003, 0.36259002247646005], [3.0511942109172914, -0.318, 1.4608110260230256], [3.0233400609537524, 0.372, 2.4561398903701392], [2.9894116595885447, 0.41000000000000003, -0.7592198745379212], [2.9798002857176886, 0.44, 1.7998662740724334], [2.974183113263985, -0.37, 2.571278162352844], [2.9630107231038134, -0.202, -3.0014195839973157], [2.926987254596423, -0.314, 2.5382771428709976], [2.91045193892003, -0.352, -1.1974798426419042], [2.9096904215333033, 0.422, -0.8799280255598667], [2.865634612221004, -0.448, 2.745143296845354], [2.8469267594310574, 0.456, 2.0262662699698706], [2.7956807664822634, 0.28800000000000003, 1.0357976000180151], [2.789181746811964, -0.272, 2.616865943025525], [2.7486404356930687, -0.296, 0.8150063019192568], [2.733582786519939, -0.316, -0.7756549124226098], [2.667261380050648, -0.39, 0.918130629829657], [2.6667674432645425, 0.384, -1.5420340418906298], [2.657144017988947, -0.45, 2.160123784958223], [2.6474898901941737, -0.482, 0.6803560896884868], [2.6283689781150965, -0.422, 1.7546253268868242], [2.554690430571855, -0.47400000000000003, -1.7905400380457963], [2.541836814061943, -0.488, -1.6949708643382027], [2.5040214969556467, 0.20400000000000001, 1.6241153038998797], [2.4661454715168065, 0.41600000000000004, -0.5511932911710413], [2.450994387966624, -0.454, 1.342841223698668], [2.4430757314353144, -0.42, -1.5515234368315514], [2.4276380032482354, -0.376, 2.2510994781744844], [2.4078193820144858, 0.484, 2.3985952167780855], [2.398933574660912, -0.466, 1.258136237580244], [2.253881698427287, -0.442, -1.7354699458632155], [2.2502074741813405, 0.482, 0.7761527484560078], [2.191150875231849, -0.28, 2.0458862970311085], [2.161619852127543, 0.42, 2.1284716897481477], [2.1509015789383747, -0.47000000000000003, 2.984329020081122], [2.1373649692616894, 0.402, 0.5243763948622746], [2.137327672256816, -0.364, 2.9534603175672247], [2.104253552318465, -0.46, 1.247348564815156], [2.091373739480286, -0.28600000000000003, 2.2190593873897426], [2.070708922464281, -0.44, 0.16024254898167323], [1.8842653179604762, 0.39, -1.2354972092666616], [1.6993961359481653, -0.384, 3.0879042560414587], [1.6373022505374089, -0.496, 1.118178591291593], [1.5816334515773336, 0.486, -0.8014002259130226], [1.5327272955573334, -0.494, -1.8377472331591371], [1.456590982288479, 0.462, 1.9691555430159102], [1.4555045321838544, -0.34, 1.2672170063174222], [1.3664577904374573, -0.334, -2.2152413150382553], [1.35541403717245, -0.402, -1.6840174233029301], [1.325820043505718, -0.356, 1.2065279902457209], [1.3192478803645662, -0.22, 2.7539287112872852], [1.3113948490170262, 0.256, 0.1465957603443097], [1.179307862980703, -0.434, -0.8680153091309171], [1.1584525233340635, -0.328, -2.8367200211641475], [1.1490898969995043, -0.41400000000000003, -1.5532738200472056], [1.1441538888184057, -0.468, -1.0055735437172089], [1.0562684832409592, -0.342, 1.9041485632436537], [0.9580828921364182, -0.258, -1.7600293095180397], [0.9216289245863719, 0.438, -0.3481803384188148], [0.8104692841217193, -0.426, -2.3968138486410226], [0.5698152727979012, -0.49, -0.4804836406019927], [0.4410929144166147, -0.396, 0.8949578114409901], [0.31360953216485377, 0.43, -2.460741547111953], [0.2586490601102764, -0.462, 0.8908666839877156]];

var data = exports.data = data500;
var dataLength = exports.dataLength = 500;

var CircleThing = function () {
    function CircleThing() {
        _classCallCheck(this, CircleThing);

        this.pathLength = 0;
        this.totalPathLength = 0;
        this.alpha = 1;

        this.circles = [];
        this.drawnPoints = [];

        for (var i = 0; i < data.length; i++) {
            var datum = data[i];
            var newCircle = new _circle2.default(
            /* size= */
            datum[0] / dataLength,
            /* rotation= */
            datum[2],
            /* frequency= */
            datum[1]);
            if (i > 0) {
                newCircle.parent = this.circles[i - 1];
                newCircle.moveToParent();
            }
            this.totalPathLength += newCircle.length;
            this.circles.push(newCircle);
        }
    }

    _createClass(CircleThing, [{
        key: 'getDrawPosition',
        value: function getDrawPosition() {
            var remainingPathLength = this.pathLength;
            var circle = void 0;
            for (var i = 0; i < this.circles.length; i++) {
                circle = this.circles[i];
                remainingPathLength -= circle.length;
                if (remainingPathLength <= 0) {
                    return circle.getDrawPosition(remainingPathLength + circle.length);
                }
            }
            return circle.end;
        }
    }, {
        key: 'drawMore',
        value: function drawMore() {
            var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;

            this.pathLength += length;
        }
    }, {
        key: 'rotateAll',
        value: function rotateAll(deltaT) {
            for (var i = 0; i < this.circles.length; i++) {
                this.circles[i].update(deltaT);
            }
        }

        // Add a draw point. Ignores how far the circles themselves are in the process of being drawn.

    }, {
        key: 'addDrawPoint',
        value: function addDrawPoint() {
            if (this.drawnPoints.length > dataLength) {
                return;
            }
            this.drawnPoints.push({
                x: this.circles[this.circles.length - 1].endX,
                y: this.circles[this.circles.length - 1].endY
            });
        }
    }, {
        key: 'reset',
        value: function reset() {
            for (var i = 0; i < this.circles.length; i++) {
                this.circles[i].reset();
            }
        }
    }, {
        key: 'render',
        value: function render(context, xOffset, yOffset, scale) {
            // Draw all the circles
            var remainingPathLength = this.pathLength;
            context.strokeStyle = 'black';
            context.globalAlpha = this.alpha;
            for (var i = 0; i < this.circles.length; i++) {
                var circle = this.circles[i];
                circle.renderAmt(context, xOffset, yOffset, scale, remainingPathLength);

                remainingPathLength -= circle.length;
                if (remainingPathLength < 0) {
                    break;
                }
            }
            context.globalAlpha = 1;

            if (this.drawnPoints.length > 0) {
                context.beginPath();
                context.moveTo(scale * (this.drawnPoints[0].x + xOffset), scale * (this.drawnPoints[0].y + yOffset));
                for (var _i = 1; _i < this.drawnPoints.length; _i++) {
                    context.lineTo(scale * (this.drawnPoints[_i].x + xOffset), scale * (this.drawnPoints[_i].y + yOffset));
                }
                context.stroke();
            }
        }
    }]);

    return CircleThing;
}();

exports.default = CircleThing;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _drawController = __webpack_require__(15);

var _drawController2 = _interopRequireDefault(_drawController);

var _epicyclesController = __webpack_require__(20);

var _epicyclesController2 = _interopRequireDefault(_epicyclesController);

var _complexSinusoidController = __webpack_require__(7);

var _complexSinusoidController2 = _interopRequireDefault(_complexSinusoidController);

var _conductor = __webpack_require__(22);

var _conductor2 = _interopRequireDefault(_conductor);

var _titlePoints = __webpack_require__(23);

var _waveController = __webpack_require__(24);

var _waveController2 = _interopRequireDefault(_waveController);

var _waveSplitController = __webpack_require__(25);

var _waveSplitController2 = _interopRequireDefault(_waveSplitController);

var _waveThings = __webpack_require__(3);

var _skewedSinusoidController = __webpack_require__(26);

var _skewedSinusoidController2 = _interopRequireDefault(_skewedSinusoidController);

var _waveDrawController = __webpack_require__(27);

var _waveDrawController2 = _interopRequireDefault(_waveDrawController);

var _rangeController = __webpack_require__(28);

var _rangeController2 = _interopRequireDefault(_rangeController);

var _peaceHandPoints = __webpack_require__(29);

var _skewedPathController = __webpack_require__(30);

var _skewedPathController2 = _interopRequireDefault(_skewedPathController);

var _mePoints = __webpack_require__(31);

var _imageSwapController = __webpack_require__(9);

var _imageSwapController2 = _interopRequireDefault(_imageSwapController);

var _jpeg = __webpack_require__(10);

var _imageBuildUpController = __webpack_require__(32);

var _imageBuildUpController2 = _interopRequireDefault(_imageBuildUpController);

var _jpegCompressorController = __webpack_require__(33);

var _jpegCompressorController2 = _interopRequireDefault(_jpegCompressorController);

var _synth = __webpack_require__(11);

var _waveSamplesController = __webpack_require__(35);

var _waveSamplesController2 = _interopRequireDefault(_waveSamplesController);

var _headingController = __webpack_require__(36);

var _headingController2 = _interopRequireDefault(_headingController);

var _waveFrequenciesController = __webpack_require__(37);

var _waveFrequenciesController2 = _interopRequireDefault(_waveFrequenciesController);

var _selfDrawController = __webpack_require__(38);

var _selfDrawController2 = _interopRequireDefault(_selfDrawController);

var _imageMultController = __webpack_require__(41);

var _imageMultController2 = _interopRequireDefault(_imageMultController);

var _controllerUtil = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var conductor = null;

function init() {

	var controllers = [];

	if (hasElement('header-background')) {
		var controller = new _headingController2.default('header-background');
		controllers.push(controller);
	}

	if (hasElement('self-draw')) {
		var _controller = new _selfDrawController2.default('self-draw');
		controllers.push(_controller);
	}

	var comboWave = (0, _waveThings.getWave)(function (t) {
		return Math.sin(2 * Math.PI * t) + 0.5 * Math.sin(6 * Math.PI * t);
	}, 128);
	if (hasElement('combo-sine-wave')) {
		var _controller2 = new _waveController2.default('combo-sine-wave');
		// Here we stretch out the wave to make it look nicer. Kind of lazy but w/e.
		_controller2.setPath(comboWave.map(function (t) {
			return 2 * t;
		}));
		controllers.push(_controller2);
	}
	if (hasElement('combo-sine-wave-split')) {
		var _controller3 = new _waveSplitController2.default('combo-sine-wave-split');
		_controller3.setPath(comboWave);
		_controller3.fadeFrequencies = false;
		controllers.push(_controller3);
	}

	if (hasElement('together-button')) {
		var button = document.getElementById('together-button');
		button.addEventListener('click', function () {
			return (0, _synth.playSoundWave)(function (t) {
				return Math.sin(2 * Math.PI * t) + 0.5 * Math.sin(6 * Math.PI * t);
			});
		});
	}
	if (hasElement('split-button-1')) {
		var _button = document.getElementById('split-button-1');
		_button.addEventListener('click', function () {
			return (0, _synth.playSoundWave)(function (t) {
				return 0.5 * Math.sin(6 * Math.PI * t);
			});
		});
	}
	if (hasElement('split-button-2')) {
		var _button2 = document.getElementById('split-button-2');
		_button2.addEventListener('click', function () {
			return (0, _synth.playSoundWave)(function (t) {
				return Math.sin(2 * Math.PI * t);
			});
		});
	}

	if (hasElement('square-wave')) {
		var _controller4 = new _waveController2.default('square-wave');
		_controller4.setPath((0, _waveThings.getWave)(_waveThings.squareWave, 128));
		controllers.push(_controller4);
	}

	var squareWaveSplitController = void 0;
	if (hasElement('square-wave-split')) {
		squareWaveSplitController = new _waveSplitController2.default('square-wave-split');
		squareWaveSplitController.setPath((0, _waveThings.getWave)(_waveThings.squareWave, 256));
		controllers.push(squareWaveSplitController);
	}

	var squareWaveBuildUpController = void 0;
	if (hasElement('square-wave-build-up')) {
		squareWaveBuildUpController = new _waveSplitController2.default('square-wave-build-up');
		squareWaveBuildUpController.setPath((0, _waveThings.getWave)(_waveThings.squareWave, 128));
		squareWaveBuildUpController.splitAnim = false;
		controllers.push(squareWaveBuildUpController);
	}
	if (hasElement('square-wave-build-up-slider')) {
		var slider = new _rangeController2.default('square-wave-build-up-slider');
		if (squareWaveBuildUpController) {
			slider.onValueChange.push(function (val) {
				return squareWaveBuildUpController.fourierAmt = val;
			});
		}
		controllers.push(slider);
	}
	if (hasElement('square-wave-button')) {
		var _button3 = document.getElementById('square-wave-button');
		if (squareWaveBuildUpController) {
			_button3.addEventListener('click', function () {
				return (0, _synth.playSoundWave)(squareWaveBuildUpController.partialWave);
			});
		}
	}

	var waveDrawController = void 0,
	    waveDrawSliderController = void 0,
	    waveDrawButton = void 0,
	    waveDrawSplitController = void 0;
	if (hasElement('wave-draw')) {
		waveDrawController = new _waveDrawController2.default('wave-draw');
		controllers.push(waveDrawController);
	}
	if (hasElement('wave-draw-instruction')) {
		var instruction = document.getElementById('wave-draw-instruction');
		if (waveDrawController) {
			waveDrawController.onDrawingStart.push(function () {
				return instruction.classList.add('hidden');
			});
		}
	}
	if (hasElement('wave-draw-slider')) {
		waveDrawSliderController = new _rangeController2.default('wave-draw-slider');
		waveDrawSliderController.animate = false;
		controllers.push(waveDrawSliderController);
	}
	if (hasElement('wave-draw-split')) {
		waveDrawSplitController = new _waveSplitController2.default('wave-draw-split');
		if (waveDrawController != null) {
			waveDrawController.onDrawingStart.push(function () {
				waveDrawSplitController.splitAnim = true;
				waveDrawSplitController.setPath([]);
			});
			waveDrawController.onDrawingEnd.push(function () {
				waveDrawSplitController.splitAnim = true;
				waveDrawSplitController.setPath(waveDrawController.normPath);
			});
			// Reset the slider back to 1 when the wave changes to draw the full wave.
			if (waveDrawSliderController) {
				waveDrawController.onDrawingStart.push(function () {
					return waveDrawSliderController.slider.value = 1;
				});
				waveDrawController.onDrawingEnd.push(function () {
					return waveDrawSliderController.slider.value = 1;
				});
			}
		}
		if (waveDrawSliderController != null) {
			waveDrawSliderController.onValueChange.push(function (val) {
				waveDrawSplitController.fourierAmt = val;
				waveDrawSplitController.splitAnim = false;
			});
		}
		controllers.push(waveDrawSplitController);
	}
	if (hasElement('wave-draw-button')) {
		var _button4 = document.getElementById('wave-draw-button');
		if (_button4) {
			_button4.addEventListener('click', function () {
				return (0, _synth.playSoundWave)(waveDrawSplitController.partialWave);
			});
		}
	}

	if (hasElement('wave-samples')) {
		var waveSamplesController = new _waveSamplesController2.default('wave-samples');
		// Initially set it to the square wave
		waveSamplesController.setWave((0, _waveThings.getWave)(_waveThings.squareWave, 256));
		if (waveDrawController) {
			waveDrawController.onDrawingEnd.push(function () {
				// Map from [0, 1] to [-1, 1]
				waveSamplesController.setWave(waveDrawController.normPath);
			});
		}
		controllers.push(waveSamplesController);
	}
	if (hasElement('wave-frequencies')) {
		var waveFrequenciesController = new _waveFrequenciesController2.default('wave-frequencies');
		// Intially use the frequencies from the square wave
		if (squareWaveSplitController) {
			waveFrequenciesController.setFourierData(squareWaveSplitController.fourierData);
		}
		if (waveDrawSplitController) {
			waveDrawSplitController.onFourierChange.push(function () {
				// Map from [0, 1] to [-1, 1]
				waveFrequenciesController.setFourierData(waveDrawSplitController.fourierData);
			});
		}
		controllers.push(waveFrequenciesController);
	}

	if (hasElement('complex-sinusoid')) {
		var _controller5 = new _skewedSinusoidController2.default('complex-sinusoid');
		controllers.push(_controller5);
	}
	if (hasElement('complex-sinusoid-turn')) {
		var _controller6 = new _complexSinusoidController2.default('complex-sinusoid-turn');
		controllers.push(_controller6);
	}

	var adjustedPeaceHandPoints = _peaceHandPoints.peaceHandPoints.map(function (p) {
		return { x: p.x * 1.5 - 170, y: p.y * 1.5 - 50 };
	});
	if (hasElement('peace-epicycles')) {
		var _controller7 = new _epicyclesController2.default('peace-epicycles');
		_controller7.setPath(adjustedPeaceHandPoints, -1, 0.05);
		controllers.push(_controller7);
	}
	if (hasElement('peace-3d')) {
		var _controller8 = new _skewedPathController2.default('peace-3d');
		_controller8.setPath(adjustedPeaceHandPoints, -1, 0.05);
		controllers.push(_controller8);
	}
	var peaceBuildUpSlider = void 0;
	if (hasElement('peace-build-up-slider')) {
		peaceBuildUpSlider = new _rangeController2.default('peace-build-up-slider');
		controllers.push(peaceBuildUpSlider);
	}
	if (hasElement('peace-build-up')) {
		var _controller9 = new _epicyclesController2.default('peace-build-up');
		_controller9.setPath(adjustedPeaceHandPoints, -1, 0.05);
		if (peaceBuildUpSlider) {
			peaceBuildUpSlider.onValueChange.push(function (val) {
				return _controller9.setFourierAmt(val);
			});
		}
		controllers.push(_controller9);
	}

	var drawZone = void 0,
	    circleZoneSlider = void 0;
	if (hasElement('draw-zone')) {
		drawZone = new _drawController2.default('draw-zone');
		controllers.push(drawZone);
	}
	if (hasElement('draw-zone-instruction')) {
		var _instruction = document.getElementById('draw-zone-instruction');
		if (drawZone) {
			drawZone.onDrawingStart.push(function () {
				return _instruction.classList.add('hidden');
			});
		}
	}
	if (hasElement('draw-zone-undo-button')) {
		var undoButton = document.getElementById('draw-zone-undo-button');
		if (drawZone) {
			undoButton.addEventListener('click', function () {
				return drawZone.undo();
			});
		}
	}
	if (hasElement('circle-zone-slider')) {
		circleZoneSlider = new _rangeController2.default('circle-zone-slider');
		circleZoneSlider.animate = false;
		controllers.push(circleZoneSlider);
	}
	if (hasElement('circle-zone')) {
		var epicycles = new _epicyclesController2.default('circle-zone');
		epicycles.animatePathAmt = false;
		if (drawZone) {
			drawZone.onDrawingStart.push(function () {
				return epicycles.setPath([]);
			});
			drawZone.onDrawingEnd.push(function () {
				return epicycles.setPath(drawZone.path, 1024);
			});
			// Reset the slider back to 1 to draw the full shape when it changes.
			if (circleZoneSlider) {
				drawZone.onDrawingStart.push(function () {
					circleZoneSlider.slider.value = 1;
					epicycles.setFourierAmt(1);
				});
			}
		}
		if (circleZoneSlider) {
			circleZoneSlider.onValueChange.push(function (val) {
				return epicycles.setFourierAmt(val);
			});
		}
		controllers.push(epicycles);
	}

	if (hasElement('fourier-title')) {
		var fourierTitle = new _epicyclesController2.default('fourier-title');
		fourierTitle.setPath(_titlePoints.titlePoints.map(function (p) {
			return {
				x: p.x * 0.9,
				y: p.y * 0.9 - 40 };
		}));
		fourierTitle.period = 15;
		controllers.push(fourierTitle);
	}

	if (hasElement('img-x-component')) {
		var _controller10 = new _imageSwapController2.default('img-x-component');
		var imageSrcs = [];
		for (var i = 1; i < 8; i++) {
			imageSrcs.push('img/components-0-' + i + '.png');
		}
		_controller10.imageSrcs = imageSrcs;
		controllers.push(_controller10);
	}
	if (hasElement('img-y-component')) {
		var _controller11 = new _imageSwapController2.default('img-y-component');
		var _imageSrcs = [];
		for (var _i = 1; _i < 8; _i++) {
			_imageSrcs.push('img/components-' + _i + '-0.png');
		}
		_controller11.imageSrcs = _imageSrcs;
		controllers.push(_controller11);
	}

	var imgMultXController = void 0,
	    imgMultYController = void 0;
	if (hasElement('img-mult-x-component')) {
		imgMultXController = new _imageSwapController2.default('img-mult-x-component');
		var _imageSrcs2 = [];
		for (var _i2 = 1; _i2 < 8; _i2++) {
			_imageSrcs2.push('img/components-0-' + _i2 + '.png');
		}
		imgMultXController.imageSrcs = _imageSrcs2;
		imgMultXController.maxY = 0.5;
		controllers.push(imgMultXController);
	}
	if (hasElement('img-mult-y-component')) {
		imgMultYController = new _imageSwapController2.default('img-mult-y-component');
		var _imageSrcs3 = [];
		for (var _i3 = 1; _i3 < 8; _i3++) {
			_imageSrcs3.push('img/components-' + _i3 + '-0.png');
		}
		imgMultYController.imageSrcs = _imageSrcs3;
		imgMultYController.minY = 0.5;
		controllers.push(imgMultYController);
	}
	if (hasElement('img-x-y-component')) {
		var _controller12 = new _imageMultController2.default('img-x-y-component', imgMultXController, imgMultYController);
		controllers.push(_controller12);
	}

	var letterBuildUpController = void 0;
	if (hasElement('letter-buildup-letter')) {
		letterBuildUpController = new _imageSwapController2.default('letter-buildup-letter');
		var _imageSrcs4 = [];
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = (0, _jpeg.loopLikeAJpeg)(8)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var _ref = _step.value;

				var _ref2 = _slicedToArray(_ref, 2);

				var y = _ref2[0];
				var x = _ref2[1];

				_imageSrcs4.push('img/img-buildup-' + x + '-' + y + '.png');
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		letterBuildUpController.imageSrcs = _imageSrcs4;
		letterBuildUpController.scrollFocus = document.querySelector('#letter-buildup');
		letterBuildUpController.minY = 0.2;
		letterBuildUpController.maxY = 0.6;
		controllers.push(letterBuildUpController);
	}
	if (hasElement('letter-buildup-components')) {
		var _controller13 = new _imageBuildUpController2.default('letter-buildup-components', letterBuildUpController);
		controllers.push(_controller13);
	}
	if (hasElement('jpeg-example')) {
		var _controller14 = new _jpegCompressorController2.default('jpeg-example');
		controllers.push(_controller14);
	}

	if (hasElement('its-meee')) {
		var _controller15 = new _epicyclesController2.default('its-meee');
		_controller15.setPath(_mePoints.mePoints, 256, 0.1);
		controllers.push(_controller15);
	}

	if (hasElement('email-text')) {
		var emailElement = document.getElementById('email-text');
		// Add my email using js so that non-js scrapers can't just get it
		var email = 'fourier' + '@' + 'jezzamon.com';
		var emailText = ' email me at <a href="mailto:' + email + '">' + email + '</a>, or';
		emailElement.innerHTML = emailText;
	}

	conductor = new _conductor2.default(controllers);
	conductor.start();
}

function hasElement(id) {
	return document.getElementById(id) != null;
}

/**
 * Configure the canvases to be able to handle screens with higher dpi.
 * 
 * We can only call this once because after that, the width has changed!
 */
function updateCanvasSizes() {
	var pixelRatio = window.devicePixelRatio || 1;
	var canvases = document.getElementsByTagName("canvas");
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = canvases[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var canvas = _step2.value;

			var width = canvas.width;
			var height = canvas.height;
			canvas.width = width * pixelRatio;
			canvas.height = height * pixelRatio;
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2.return) {
				_iterator2.return();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}
}

// updateCanvasSizes();
init();

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvasController = __webpack_require__(1);

var _canvasController2 = _interopRequireDefault(_canvasController);

var _color = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var maxDrawDist = 3;

var DrawController = function (_CanvasController) {
    _inherits(DrawController, _CanvasController);

    function DrawController(id, width, height) {
        _classCallCheck(this, DrawController);

        // [ {x, y} ]
        var _this = _possibleConstructorReturn(this, (DrawController.__proto__ || Object.getPrototypeOf(DrawController)).call(this, id, width, height));

        _this.points = [];
        _this.pathEndIndex = 0;
        _this.curUndoIndex = 0;
        // Lengths of the paths after we've undone to certain points
        _this.undoIndexes = [0];
        _this.drawing = false;
        _this.onDrawingStart = [];
        _this.onDrawingEnd = [];

        _this.canvas.addEventListener('mousedown', function () {
            return _this.startDrawing();
        });
        _this.canvas.addEventListener('touchstart', function () {
            return _this.startDrawing();
        });

        document.addEventListener('mouseup', function () {
            return _this.stopDrawing();
        });
        document.addEventListener('touchend', function () {
            return _this.stopDrawing();
        });

        // Prevent scrolling while we're drawing here
        _this.canvas.addEventListener('touchmove', function (evt) {
            return evt.preventDefault();
        }, { passive: false });

        document.addEventListener('keydown', function (evt) {
            return _this.checkKeys(evt);
        });
        return _this;
    }

    _createClass(DrawController, [{
        key: "setPoints",
        value: function setPoints(points) {
            this.points = points;
            this.stopDrawing();
        }

        /**
         * @param {KeyboardEvent} evt 
         */

    }, {
        key: "checkKeys",
        value: function checkKeys(evt) {
            switch (evt.key.toLowerCase()) {
                case 'z':
                    this.undo();
                    break;
                case 'y':
                    this.redo();
                    break;
                case 'p':
                    // "print"
                    console.log(this.path);
                    break;
            }
        }
    }, {
        key: "startDrawing",
        value: function startDrawing() {
            this.drawing = true;

            // clear the redo cache
            this.points = this.path;
            this.undoIndexes = this.undoIndexes.slice(0, this.curUndoIndex + 1);

            this.onDrawingStart.forEach(function (fn) {
                return fn();
            });
        }
    }, {
        key: "stopDrawing",
        value: function stopDrawing() {
            if (!this.drawing) {
                return;
            }
            this.drawing = false;

            this.curUndoIndex++;
            this.undoIndexes.push(this.points.length);
            this.pathEndIndex = this.undoIndexes[this.curUndoIndex];

            this.onDrawingEnd.forEach(function (fn) {
                return fn();
            });
        }
    }, {
        key: "undo",
        value: function undo() {
            var newIndex = this.curUndoIndex - 1;
            if (newIndex < 0) {
                newIndex = 0;
            }
            if (newIndex != this.curUndoIndex) {
                this.curUndoIndex = newIndex;
                this.pathEndIndex = this.undoIndexes[this.curUndoIndex];

                this.onDrawingEnd.forEach(function (fn) {
                    return fn();
                });
            }
        }
    }, {
        key: "redo",
        value: function redo() {
            var newIndex = this.curUndoIndex + 1;
            if (newIndex > this.undoIndexes.length - 1) {
                newIndex = this.undoIndexes.length - 1;
            }
            if (newIndex != this.curUndoIndex) {
                this.curUndoIndex = newIndex;
                this.pathEndIndex = this.undoIndexes[this.curUndoIndex];

                this.onDrawingEnd.forEach(function (fn) {
                    return fn();
                });
            }
        }
    }, {
        key: "update",
        value: function update(dt, mousePosition) {
            if (!mousePosition || !this.drawing) {
                return;
            }

            var canvasPosition = this.canvas.getBoundingClientRect();
            // we have to account for the border here too
            var actualWidth = canvasPosition.right - canvasPosition.left - 2;
            // 500 being the 'default' width
            var scale = 500 / actualWidth;
            var point = {
                x: scale * (mousePosition.x - canvasPosition.x),
                y: scale * (mousePosition.y - canvasPosition.y)
            };
            if (this.points.length == 0) {
                this.points.push(point);
                this.pathEndIndex = this.points.length;
            } else {
                // only add it if it's far enough away from the last thing
                // TODO: Switch to using the undo point
                var lastPoint = this.points[this.points.length - 1];
                var dx = point.x - lastPoint.x;
                var dy = point.y - lastPoint.y;
                var sqDist = dx * dx + dy * dy;
                if (sqDist > maxDrawDist * maxDrawDist) {
                    this.points.push(point);
                    this.pathEndIndex = this.points.length;
                }
            }
        }
    }, {
        key: "render",
        value: function render() {
            this.clear();

            this.drawPoints(this.path);
        }
    }, {
        key: "drawPoints",
        value: function drawPoints(path) {
            this.context.beginPath();
            this.context.strokeStyle = _color.palette.pink;
            this.context.lineWidth = 2;
            for (var i = 0; i < path.length; i++) {
                if (i == 0) {
                    this.context.moveTo(path[i].x, path[i].y);
                } else {
                    this.context.lineTo(path[i].x, path[i].y);
                }
            }
            this.context.closePath();
            this.context.stroke();
        }
    }, {
        key: "path",
        get: function get() {
            return this.points.slice(0, this.pathEndIndex);
        }
    }]);

    return DrawController;
}(_canvasController2.default);

exports.default = DrawController;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var no = __webpack_require__(17);
var staticProps = __webpack_require__(18);

var pkg = __webpack_require__(19);

/**
 * Prepend package name to error message
 */

function msg(str) {
  return pkg.name + ': ' + str;
}

var error = {};

staticProps(error)({
  leftMatrixNotCompatible: msg('Cannot multiply matrix at left side'),
  rightMatrixNotCompatible: msg('Cannot multiply matrix at right side')
});

var matrixToArrayIndex = function matrixToArrayIndex(i, j, numCols) {
  return j + i * numCols;
};

/**
 * Multiply two matrices, row by column.
 *
 * @param {Number} customOperator
 * @param {Function} [customOperator.addition]
 * @param {Function} [customOperator.multiplication]
 *
 * @returns {Function} operator
 */

function matrixMultiplication(customOperator) {
  // operators

  if (no(customOperator)) customOperator = {};

  var add = customOperator.addition;
  var mul = customOperator.multiplication;

  // Default to operators over Reals.
  if (no(add)) add = function add(a, b) {
    return a + b;
  };
  if (no(mul)) mul = function mul(a, b) {
    return a * b;
  };

  /**
   * @param {Number} middle
   *
   * @returns {Function} mul
   */

  return function (middle) {
    /**
     * @param {Array} leftMatrix
     * @param {Array} rightMatrix
     *
     * @returns {Array} matrix
     */

    return function (leftMatrix, rightMatrix) {
      // Compatibilty check.

      var cols = rightMatrix.length / middle; // right num cols
      var rows = leftMatrix.length / middle; // left num rows

      var colsIsNotInteger = Math.floor(cols) !== cols;
      var rowsIsNotInteger = Math.floor(rows) !== rows;

      if (colsIsNotInteger) throw new TypeError(error.rightMatrixNotCompatible);
      if (rowsIsNotInteger) throw new TypeError(error.leftMatrixNotCompatible);

      // Compute result data.

      var data = [];

      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          var leftIndex = matrixToArrayIndex(i, 0, middle);
          var rightIndex = matrixToArrayIndex(0, j, cols);

          var rightElement = rightMatrix[rightIndex];
          var leftElement = leftMatrix[leftIndex];

          var element = mul(leftElement, rightElement);

          for (var k = 1; k < middle; k++) {
            leftIndex = matrixToArrayIndex(i, k, middle);
            rightIndex = matrixToArrayIndex(k, j, cols);

            rightElement = rightMatrix[rightIndex];
            leftElement = leftMatrix[leftIndex];

            element = add(element, mul(rightElement, leftElement));
          }

          data.push(element);
        }
      }

      return data;
    };
  };
}

staticProps(matrixMultiplication)({ error: error });

module.exports = matrixMultiplication;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (x) {
  return x == null || typeof x == 'number' && isNaN(x) || x.length < 1 && typeof x != 'function' || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) == 'object' && Object.keys(x).length < 1;
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @param {Object} obj
 * @returns {Function}
 */
function staticProps(obj) {
  /**
   * @param {Object} props
   * @param {Boolean} [enumerable]
   */
  return function (props, enumerable) {
    var staticProps = {};
    for (var propName in props) {
      var staticProp = {
        configurable: false,
        enumerable: enumerable
      };
      var prop = props[propName];
      if (typeof prop === 'function') {
        staticProp.get = prop;
      } else {
        staticProp.value = prop;
        staticProp.writable = false;
      }
      staticProps[propName] = staticProp;
    }
    Object.defineProperties(obj, staticProps);
  };
}
module.exports = exports.default = staticProps;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = {"_args":[["matrix-multiplication@0.5.2","/Users/jeremy/Documents/Websites/fourier"]],"_from":"matrix-multiplication@0.5.2","_id":"matrix-multiplication@0.5.2","_inBundle":false,"_integrity":"sha512-rr3Adfxn9cktAn8zYAkYiDbFZFkFflwjm9oSm5drBIQJPjFoqUlT9nq7aMwXpr+Nr4uurQKgxy+9pfk5X2YmYA==","_location":"/matrix-multiplication","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"matrix-multiplication@0.5.2","name":"matrix-multiplication","escapedName":"matrix-multiplication","rawSpec":"0.5.2","saveSpec":null,"fetchSpec":"0.5.2"},"_requiredBy":["/"],"_resolved":"https://registry.npmjs.org/matrix-multiplication/-/matrix-multiplication-0.5.2.tgz","_spec":"0.5.2","_where":"/Users/jeremy/Documents/Websites/fourier","author":{"name":"Gianluca Casati","url":"http://g14n.info"},"bugs":{"url":"https://github.com/fibo/matrix-multiplication/issues"},"dependencies":{"not-defined":"^2.0.1","static-props":"^1.1.1"},"description":"implements row by column multiplication","devDependencies":{"pre-commit":"^1.2.2","standa":"^1.0.2","tape":"^4.8.0"},"homepage":"http://g14n.info/matrix-multiplication","keywords":["algebra"],"license":"MIT","main":"matrix-multiplication.js","name":"matrix-multiplication","pre-commit":["lint","test","check-deps"],"repository":{"type":"git","url":"git://github.com/fibo/matrix-multiplication.git"},"scripts":{"check-deps":"npm outdated","lint":"standa","postversion":"git push origin v${npm_package_version}; npm publish; git push origin master","test":"NODE_PATH=. tape test.js"},"version":"0.5.2"}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvasController = __webpack_require__(1);

var _canvasController2 = _interopRequireDefault(_canvasController);

var _justfourierthings = __webpack_require__(6);

var _util = __webpack_require__(0);

var _color = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EpicyclesController = function (_CanvasController) {
    _inherits(EpicyclesController, _CanvasController);

    function EpicyclesController(id, width, height) {
        _classCallCheck(this, EpicyclesController);

        var _this = _possibleConstructorReturn(this, (EpicyclesController.__proto__ || Object.getPrototypeOf(EpicyclesController)).call(this, id, width, height));

        _this.animate = true;

        // [ {freq, amplitude, phase } ]
        _this.fourierData = [];
        // [ {x, y} ]
        _this.fourierPath = [];
        _this.numPoints = 0;
        // What percentage of the path to draw
        _this.pathAmt = 1;
        _this.animatePathAmt = true;

        _this.animAmt = 0;
        _this.niceAnimAmt = 0;
        _this.period = 5;

        _this.fourierAmt = 1;

        _this.pathDirty = false;
        return _this;
    }

    _createClass(EpicyclesController, [{
        key: "setPath",
        value: function setPath(path) {
            var numPoints = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
            var minAmplitude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.01;

            if (numPoints < 0) {
                numPoints = path.length;
            }
            this.numPoints = numPoints;
            this.animAmt = 0;
            this.niceAnimAmt = 0;
            this.fourierPath = [];
            // Get the fourier data, also filter out the really small terms.
            this.fourierData = (0, _justfourierthings.getFourierData)((0, _justfourierthings.resample2dData)(path, this.numPoints)).filter(function (f) {
                return f.amplitude > minAmplitude;
            });
            this.fourierData.sort(function (a, b) {
                return b.amplitude - a.amplitude;
            });
            console.log(this.fourierData.length + '/' + numPoints);
        }
    }, {
        key: "setFourierAmt",
        value: function setFourierAmt(amt) {
            this.fourierAmt = amt;
            this.pathDirty = true;
        }
    }, {
        key: "recalculatePath",
        value: function recalculatePath() {
            // then render everything.
            for (var i = 0; i < this.numPoints; i++) {
                this.niceAnimAmt += 1 / this.numPoints;
                this.addToPath();
            }
            this.niceAnimAmt -= 1;
        }
    }, {
        key: "update",
        value: function update(dt, mousePosition) {
            if (this.pathDirty) {
                this.recalculatePath();
                this.pathDirty = false;
            }

            if (!this.animate) {
                return;
            }
            this.animAmt += dt / this.period % 1;

            while (this.animAmt > 1) {
                this.animAmt--;
                this.niceAnimAmt--;
            }

            if (this.animatePathAmt) {
                var transitionFactor = 1 / 10;
                var pos = this.getScrollPosition();
                var desiredPathAmt = 0;
                if (pos < 0.8) {
                    desiredPathAmt = 1;
                }
                this.pathAmt += transitionFactor * (desiredPathAmt - this.pathAmt);
                if (this.pathAmt >= 0.99) {
                    this.pathAmt = 1;
                }
            }

            // some max iterations to stop it from hanging
            for (var i = 0; i < 20; i++) {
                if (this.niceAnimAmt >= this.animAmt) {
                    break;
                }
                this.niceAnimAmt += 1 / this.numPoints;
                this.addToPath();
            }
        }
    }, {
        key: "addToPath",
        value: function addToPath() {
            if (this.fourierData.length == 0) {
                return;
            }
            var runningX = 0;
            var runningY = 0;
            var numFouriers = Math.round((0, _util.slurp)(2, this.fourierData.length, this.fourierAmt));
            for (var i = 0; i < numFouriers; i++) {
                var amplitude = this.fourierData[i].amplitude;
                var angle = 2 * Math.PI * this.fourierData[i].freq * this.niceAnimAmt + this.fourierData[i].phase;
                runningX += amplitude * Math.cos(angle);
                runningY += amplitude * Math.sin(angle);
            }

            this.fourierPath.push({ x: runningX, y: runningY });
            while (this.fourierPath.length > this.numPoints * this.pathAmt && this.fourierPath.length > 0) {
                this.fourierPath.shift();
            }
        }
    }, {
        key: "render",
        value: function render() {
            this.clear();

            this.renderPath(this.fourierPath);
            this.renderCircles();
        }
    }, {
        key: "renderPath",
        value: function renderPath(path) {
            for (var i = 0; i < path.length - 1; i++) {
                this.context.beginPath();
                this.context.strokeStyle = _color.palette.blue;
                this.context.lineWidth = 2;
                this.context.moveTo(path[i].x, path[i].y);
                this.context.lineTo(path[i + 1].x, path[i + 1].y);
                this.context.stroke();
            }
        }
    }, {
        key: "renderCircles",
        value: function renderCircles() {
            if (this.fourierData.length == 0) {
                return;
            }
            var runningX = 0;
            var runningY = 0;
            var numFouriers = Math.round((0, _util.slurp)(2, this.fourierData.length, this.fourierAmt));
            for (var i = 0; i < numFouriers; i++) {
                var amplitude = this.fourierData[i].amplitude;
                var angle = 2 * Math.PI * this.fourierData[i].freq * this.animAmt + this.fourierData[i].phase;
                runningX += amplitude * Math.cos(angle);
                runningY += amplitude * Math.sin(angle);
                if (i == 0) {
                    continue; // we skip the first one because we just don't care about rendering the constant term
                }
                if (amplitude < 0.5) {
                    continue; // skip the really tiny ones
                }
                this.context.beginPath();
                this.context.strokeStyle = _color.palette.cyan;
                this.context.globalAlpha = 0.7;
                this.context.lineWidth = 1;
                this.context.moveTo(runningX, runningY);
                this.context.arc(runningX, runningY, amplitude, angle - Math.PI, angle + Math.PI);
                this.context.stroke();
            }
            this.context.globalAlpha = 1;
        }
    }]);

    return EpicyclesController;
}(_canvasController2.default);

exports.default = EpicyclesController;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function FFT(size) {
  this.size = size | 0;
  if (this.size <= 1 || (this.size & this.size - 1) !== 0) throw new Error('FFT size must be a power of two and bigger than 1');

  this._csize = size << 1;

  // NOTE: Use of `var` is intentional for old V8 versions
  var table = new Array(this.size * 2);
  for (var i = 0; i < table.length; i += 2) {
    var angle = Math.PI * i / this.size;
    table[i] = Math.cos(angle);
    table[i + 1] = -Math.sin(angle);
  }
  this.table = table;

  // Find size's power of two
  var power = 0;
  for (var t = 1; this.size > t; t <<= 1) {
    power++;
  } // Calculate initial step's width:
  //   * If we are full radix-4 - it is 2x smaller to give inital len=8
  //   * Otherwise it is the same as `power` to give len=4
  this._width = power % 2 === 0 ? power - 1 : power;

  // Pre-compute bit-reversal patterns
  this._bitrev = new Array(1 << this._width);
  for (var j = 0; j < this._bitrev.length; j++) {
    this._bitrev[j] = 0;
    for (var shift = 0; shift < this._width; shift += 2) {
      var revShift = this._width - shift - 2;
      this._bitrev[j] |= (j >>> shift & 3) << revShift;
    }
  }

  this._out = null;
  this._data = null;
  this._inv = 0;
}
module.exports = FFT;

FFT.prototype.fromComplexArray = function fromComplexArray(complex, storage) {
  var res = storage || new Array(complex.length >>> 1);
  for (var i = 0; i < complex.length; i += 2) {
    res[i >>> 1] = complex[i];
  }return res;
};

FFT.prototype.createComplexArray = function createComplexArray() {
  var res = new Array(this._csize);
  for (var i = 0; i < res.length; i++) {
    res[i] = 0;
  }return res;
};

FFT.prototype.toComplexArray = function toComplexArray(input, storage) {
  var res = storage || this.createComplexArray();
  for (var i = 0; i < res.length; i += 2) {
    res[i] = input[i >>> 1];
    res[i + 1] = 0;
  }
  return res;
};

FFT.prototype.completeSpectrum = function completeSpectrum(spectrum) {
  var size = this._csize;
  var half = size >>> 1;
  for (var i = 2; i < half; i += 2) {
    spectrum[size - i] = spectrum[i];
    spectrum[size - i + 1] = -spectrum[i + 1];
  }
};

FFT.prototype.transform = function transform(out, data) {
  if (out === data) throw new Error('Input and output buffers must be different');

  this._out = out;
  this._data = data;
  this._inv = 0;
  this._transform4();
  this._out = null;
  this._data = null;
};

FFT.prototype.realTransform = function realTransform(out, data) {
  if (out === data) throw new Error('Input and output buffers must be different');

  this._out = out;
  this._data = data;
  this._inv = 0;
  this._realTransform4();
  this._out = null;
  this._data = null;
};

FFT.prototype.inverseTransform = function inverseTransform(out, data) {
  if (out === data) throw new Error('Input and output buffers must be different');

  this._out = out;
  this._data = data;
  this._inv = 1;
  this._transform4();
  for (var i = 0; i < out.length; i++) {
    out[i] /= this.size;
  }this._out = null;
  this._data = null;
};

// radix-4 implementation
//
// NOTE: Uses of `var` are intentional for older V8 version that do not
// support both `let compound assignments` and `const phi`
FFT.prototype._transform4 = function _transform4() {
  var out = this._out;
  var size = this._csize;

  // Initial step (permute and transform)
  var width = this._width;
  var step = 1 << width;
  var len = size / step << 1;

  var outOff;
  var t;
  var bitrev = this._bitrev;
  if (len === 4) {
    for (outOff = 0, t = 0; outOff < size; outOff += len, t++) {
      var off = bitrev[t];
      this._singleTransform2(outOff, off, step);
    }
  } else {
    // len === 8
    for (outOff = 0, t = 0; outOff < size; outOff += len, t++) {
      var _off = bitrev[t];
      this._singleTransform4(outOff, _off, step);
    }
  }

  // Loop through steps in decreasing order
  var inv = this._inv ? -1 : 1;
  var table = this.table;
  for (step >>= 2; step >= 2; step >>= 2) {
    len = size / step << 1;
    var quarterLen = len >>> 2;

    // Loop through offsets in the data
    for (outOff = 0; outOff < size; outOff += len) {
      // Full case
      var limit = outOff + quarterLen;
      for (var i = outOff, k = 0; i < limit; i += 2, k += step) {
        var A = i;
        var B = A + quarterLen;
        var C = B + quarterLen;
        var D = C + quarterLen;

        // Original values
        var Ar = out[A];
        var Ai = out[A + 1];
        var Br = out[B];
        var Bi = out[B + 1];
        var Cr = out[C];
        var Ci = out[C + 1];
        var Dr = out[D];
        var Di = out[D + 1];

        // Middle values
        var MAr = Ar;
        var MAi = Ai;

        var tableBr = table[k];
        var tableBi = inv * table[k + 1];
        var MBr = Br * tableBr - Bi * tableBi;
        var MBi = Br * tableBi + Bi * tableBr;

        var tableCr = table[2 * k];
        var tableCi = inv * table[2 * k + 1];
        var MCr = Cr * tableCr - Ci * tableCi;
        var MCi = Cr * tableCi + Ci * tableCr;

        var tableDr = table[3 * k];
        var tableDi = inv * table[3 * k + 1];
        var MDr = Dr * tableDr - Di * tableDi;
        var MDi = Dr * tableDi + Di * tableDr;

        // Pre-Final values
        var T0r = MAr + MCr;
        var T0i = MAi + MCi;
        var T1r = MAr - MCr;
        var T1i = MAi - MCi;
        var T2r = MBr + MDr;
        var T2i = MBi + MDi;
        var T3r = inv * (MBr - MDr);
        var T3i = inv * (MBi - MDi);

        // Final values
        var FAr = T0r + T2r;
        var FAi = T0i + T2i;

        var FCr = T0r - T2r;
        var FCi = T0i - T2i;

        var FBr = T1r + T3i;
        var FBi = T1i - T3r;

        var FDr = T1r - T3i;
        var FDi = T1i + T3r;

        out[A] = FAr;
        out[A + 1] = FAi;
        out[B] = FBr;
        out[B + 1] = FBi;
        out[C] = FCr;
        out[C + 1] = FCi;
        out[D] = FDr;
        out[D + 1] = FDi;
      }
    }
  }
};

// radix-2 implementation
//
// NOTE: Only called for len=4
FFT.prototype._singleTransform2 = function _singleTransform2(outOff, off, step) {
  var out = this._out;
  var data = this._data;

  var evenR = data[off];
  var evenI = data[off + 1];
  var oddR = data[off + step];
  var oddI = data[off + step + 1];

  var leftR = evenR + oddR;
  var leftI = evenI + oddI;
  var rightR = evenR - oddR;
  var rightI = evenI - oddI;

  out[outOff] = leftR;
  out[outOff + 1] = leftI;
  out[outOff + 2] = rightR;
  out[outOff + 3] = rightI;
};

// radix-4
//
// NOTE: Only called for len=8
FFT.prototype._singleTransform4 = function _singleTransform4(outOff, off, step) {
  var out = this._out;
  var data = this._data;
  var inv = this._inv ? -1 : 1;
  var step2 = step * 2;
  var step3 = step * 3;

  // Original values
  var Ar = data[off];
  var Ai = data[off + 1];
  var Br = data[off + step];
  var Bi = data[off + step + 1];
  var Cr = data[off + step2];
  var Ci = data[off + step2 + 1];
  var Dr = data[off + step3];
  var Di = data[off + step3 + 1];

  // Pre-Final values
  var T0r = Ar + Cr;
  var T0i = Ai + Ci;
  var T1r = Ar - Cr;
  var T1i = Ai - Ci;
  var T2r = Br + Dr;
  var T2i = Bi + Di;
  var T3r = inv * (Br - Dr);
  var T3i = inv * (Bi - Di);

  // Final values
  var FAr = T0r + T2r;
  var FAi = T0i + T2i;

  var FBr = T1r + T3i;
  var FBi = T1i - T3r;

  var FCr = T0r - T2r;
  var FCi = T0i - T2i;

  var FDr = T1r - T3i;
  var FDi = T1i + T3r;

  out[outOff] = FAr;
  out[outOff + 1] = FAi;
  out[outOff + 2] = FBr;
  out[outOff + 3] = FBi;
  out[outOff + 4] = FCr;
  out[outOff + 5] = FCi;
  out[outOff + 6] = FDr;
  out[outOff + 7] = FDi;
};

// Real input radix-4 implementation
FFT.prototype._realTransform4 = function _realTransform4() {
  var out = this._out;
  var size = this._csize;

  // Initial step (permute and transform)
  var width = this._width;
  var step = 1 << width;
  var len = size / step << 1;

  var outOff;
  var t;
  var bitrev = this._bitrev;
  if (len === 4) {
    for (outOff = 0, t = 0; outOff < size; outOff += len, t++) {
      var off = bitrev[t];
      this._singleRealTransform2(outOff, off >>> 1, step >>> 1);
    }
  } else {
    // len === 8
    for (outOff = 0, t = 0; outOff < size; outOff += len, t++) {
      var _off2 = bitrev[t];
      this._singleRealTransform4(outOff, _off2 >>> 1, step >>> 1);
    }
  }

  // Loop through steps in decreasing order
  var inv = this._inv ? -1 : 1;
  var table = this.table;
  for (step >>= 2; step >= 2; step >>= 2) {
    len = size / step << 1;
    var halfLen = len >>> 1;
    var quarterLen = halfLen >>> 1;
    var hquarterLen = quarterLen >>> 1;

    // Loop through offsets in the data
    for (outOff = 0; outOff < size; outOff += len) {
      for (var i = 0, k = 0; i <= hquarterLen; i += 2, k += step) {
        var A = outOff + i;
        var B = A + quarterLen;
        var C = B + quarterLen;
        var D = C + quarterLen;

        // Original values
        var Ar = out[A];
        var Ai = out[A + 1];
        var Br = out[B];
        var Bi = out[B + 1];
        var Cr = out[C];
        var Ci = out[C + 1];
        var Dr = out[D];
        var Di = out[D + 1];

        // Middle values
        var MAr = Ar;
        var MAi = Ai;

        var tableBr = table[k];
        var tableBi = inv * table[k + 1];
        var MBr = Br * tableBr - Bi * tableBi;
        var MBi = Br * tableBi + Bi * tableBr;

        var tableCr = table[2 * k];
        var tableCi = inv * table[2 * k + 1];
        var MCr = Cr * tableCr - Ci * tableCi;
        var MCi = Cr * tableCi + Ci * tableCr;

        var tableDr = table[3 * k];
        var tableDi = inv * table[3 * k + 1];
        var MDr = Dr * tableDr - Di * tableDi;
        var MDi = Dr * tableDi + Di * tableDr;

        // Pre-Final values
        var T0r = MAr + MCr;
        var T0i = MAi + MCi;
        var T1r = MAr - MCr;
        var T1i = MAi - MCi;
        var T2r = MBr + MDr;
        var T2i = MBi + MDi;
        var T3r = inv * (MBr - MDr);
        var T3i = inv * (MBi - MDi);

        // Final values
        var FAr = T0r + T2r;
        var FAi = T0i + T2i;

        var FBr = T1r + T3i;
        var FBi = T1i - T3r;

        out[A] = FAr;
        out[A + 1] = FAi;
        out[B] = FBr;
        out[B + 1] = FBi;

        // Output final middle point
        if (i === 0) {
          var FCr = T0r - T2r;
          var FCi = T0i - T2i;
          out[C] = FCr;
          out[C + 1] = FCi;
          continue;
        }

        // Do not overwrite ourselves
        if (i === hquarterLen) continue;

        // In the flipped case:
        // MAi = -MAi
        // MBr=-MBi, MBi=-MBr
        // MCr=-MCr
        // MDr=MDi, MDi=MDr
        var ST0r = T1r;
        var ST0i = -T1i;
        var ST1r = T0r;
        var ST1i = -T0i;
        var ST2r = -inv * T3i;
        var ST2i = -inv * T3r;
        var ST3r = -inv * T2i;
        var ST3i = -inv * T2r;

        var SFAr = ST0r + ST2r;
        var SFAi = ST0i + ST2i;

        var SFBr = ST1r + ST3i;
        var SFBi = ST1i - ST3r;

        var SA = outOff + quarterLen - i;
        var SB = outOff + halfLen - i;

        out[SA] = SFAr;
        out[SA + 1] = SFAi;
        out[SB] = SFBr;
        out[SB + 1] = SFBi;
      }
    }
  }
};

// radix-2 implementation
//
// NOTE: Only called for len=4
FFT.prototype._singleRealTransform2 = function _singleRealTransform2(outOff, off, step) {
  var out = this._out;
  var data = this._data;

  var evenR = data[off];
  var oddR = data[off + step];

  var leftR = evenR + oddR;
  var rightR = evenR - oddR;

  out[outOff] = leftR;
  out[outOff + 1] = 0;
  out[outOff + 2] = rightR;
  out[outOff + 3] = 0;
};

// radix-4
//
// NOTE: Only called for len=8
FFT.prototype._singleRealTransform4 = function _singleRealTransform4(outOff, off, step) {
  var out = this._out;
  var data = this._data;
  var inv = this._inv ? -1 : 1;
  var step2 = step * 2;
  var step3 = step * 3;

  // Original values
  var Ar = data[off];
  var Br = data[off + step];
  var Cr = data[off + step2];
  var Dr = data[off + step3];

  // Pre-Final values
  var T0r = Ar + Cr;
  var T1r = Ar - Cr;
  var T2r = Br + Dr;
  var T3r = inv * (Br - Dr);

  // Final values
  var FAr = T0r + T2r;

  var FBr = T1r;
  var FBi = -T3r;

  var FCr = T0r - T2r;

  var FDr = T1r;
  var FDi = T3r;

  out[outOff] = FAr;
  out[outOff + 1] = 0;
  out[outOff + 2] = FBr;
  out[outOff + 3] = FBi;
  out[outOff + 4] = FCr;
  out[outOff + 5] = 0;
  out[outOff + 6] = FDr;
  out[outOff + 7] = FDi;
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Conductor = function () {
	function Conductor(controllers) {
		var _this = this;

		_classCallCheck(this, Conductor);

		this.lastTime = Date.now();
		this.mousePosition = null;
		this.controllers = controllers.slice();
		this.updatingControllers = [];

		// We can handle these all the same really.
		document.addEventListener('mousemove', function (evt) {
			return _this.updateMousePosition(evt);
		});
		document.addEventListener('mousedown', function (evt) {
			return _this.updateMousePosition(evt);
		});
		document.addEventListener('mouseup', function (evt) {
			return _this.updateMousePosition(evt);
		});

		document.addEventListener('touchmove', function (evt) {
			return _this.updateTouchPosition(evt);
		});
		document.addEventListener('touchstart', function (evt) {
			return _this.updateTouchPosition(evt);
		});
		document.addEventListener('touchend', function (evt) {
			return _this.updateTouchPosition(evt);
		});

		window.addEventListener('resize', function (evt) {
			return _this.onResize(evt);
		});
	}

	_createClass(Conductor, [{
		key: 'start',
		value: function start() {
			var _this2 = this;

			// Kick off the update loop
			window.requestAnimationFrame(function () {
				return _this2.everyFrame();
			});
		}
	}, {
		key: 'onResize',
		value: function onResize(evt) {
			this.controllers.forEach(function (controller) {
				if (typeof controller.onResize === 'function') {
					controller.onResize();
				}
			});
		}
	}, {
		key: 'everyFrame',
		value: function everyFrame() {
			var _this3 = this;

			this.update();
			this.render();
			requestAnimationFrame(function () {
				return _this3.everyFrame();
			});
		}
	}, {
		key: 'update',
		value: function update() {
			var _this4 = this;

			var curTime = Date.now();
			var dt = (curTime - this.lastTime) / 1000;

			this.updatingControllers = [];

			this.controllers.forEach(function (controller) {
				if (controller.isOnScreen()) {
					controller.update(dt, _this4.mousePosition);
					_this4.updatingControllers.push(controller);
				}
			});

			this.lastTime = curTime;

			var debug = document.getElementById('debug-content');
			if (debug) {
				debug.innerHTML = this.updatingControllers.map(function (c) {
					return c.id;
				}).join('<br>') + '<br>';
			}
		}
	}, {
		key: 'render',
		value: function render() {
			this.controllers.forEach(function (controller) {
				if (controller.isOnScreen()) {
					controller.render();
				}
			});
		}
	}, {
		key: 'updateMousePosition',
		value: function updateMousePosition(evt) {
			this.mousePosition = { x: evt.clientX, y: evt.clientY };
		}
	}, {
		key: 'updateTouchPosition',
		value: function updateTouchPosition(evt) {
			if (evt.touches.length > 0) {
				this.mousePosition = { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
			}
		}
	}]);

	return Conductor;
}();

exports.default = Conductor;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var titlePoints = exports.titlePoints = [{ x: 10.3, y: 179.8 }, { x: 15.6, y: 179.8 }, { x: 20.9, y: 179.8 }, { x: 26.1, y: 179.8 }, { x: 31.4, y: 179.8 }, { x: 36.6, y: 179.8 }, { x: 41.9, y: 179.8 }, { x: 47.1, y: 179.8 }, { x: 48.5, y: 176.0 }, { x: 48.5, y: 170.7 }, { x: 48.5, y: 165.5 }, { x: 48.5, y: 160.2 }, { x: 48.5, y: 155.0 }, { x: 48.5, y: 149.7 }, { x: 48.5, y: 144.5 }, { x: 48.5, y: 139.2 }, { x: 48.5, y: 134.0 }, { x: 48.5, y: 128.7 }, { x: 48.5, y: 123.5 }, { x: 48.5, y: 118.2 }, { x: 48.5, y: 113.0 }, { x: 48.5, y: 107.7 }, { x: 48.5, y: 102.5 }, { x: 50.1, y: 98.9 }, { x: 55.4, y: 98.9 }, { x: 60.6, y: 98.9 }, { x: 65.9, y: 98.9 }, { x: 71.1, y: 98.9 }, { x: 76.4, y: 98.8 }, { x: 81.6, y: 98.8 }, { x: 82.7, y: 103.0 }, { x: 82.7, y: 108.3 }, { x: 79.3, y: 110.1 }, { x: 74.1, y: 110.1 }, { x: 68.8, y: 110.1 }, { x: 64.9, y: 111.5 }, { x: 64.9, y: 116.8 }, { x: 64.9, y: 122.0 }, { x: 64.9, y: 127.3 }, { x: 65.5, y: 132 }, { x: 70.7, y: 132 }, { x: 76.0, y: 132 }, { x: 80.0, y: 133.2 }, { x: 80.0, y: 138.4 }, { x: 79.8, y: 143.5 }, { x: 74.5, y: 143.5 }, { x: 69.3, y: 143.5 }, { x: 64.9, y: 144.3 }, { x: 64.9, y: 149.6 }, { x: 64.9, y: 154.8 }, { x: 64.9, y: 160.1 }, { x: 64.9, y: 165.3 }, { x: 64.9, y: 170.6 }, { x: 64.9, y: 175.8 }, { x: 66.1, y: 179.8 }, { x: 71.4, y: 179.8 }, { x: 76.6, y: 179.8 }, { x: 81.9, y: 179.8 }, { x: 87.1, y: 179.8 }, { x: 92.4, y: 179.8 }, { x: 97.6, y: 179.8 }, { x: 102.9, y: 179.8 }, { x: 108.1, y: 179.8 }, { x: 113.4, y: 179.8 }, { x: 118.6, y: 179.8 }, { x: 123.9, y: 179.8 }, { x: 120.2, y: 178.2 }, { x: 116.0, y: 175.0 }, { x: 113.0, y: 170.7 }, { x: 111.2, y: 165.8 }, { x: 110.2, y: 160.7 }, { x: 109.8, y: 155.4 }, { x: 109.8, y: 150.2 }, { x: 109.8, y: 144.9 }, { x: 109.8, y: 139.7 }, { x: 109.8, y: 134.4 }, { x: 109.8, y: 129.2 }, { x: 109.8, y: 123.9 }, { x: 110.1, y: 118.7 }, { x: 111.0, y: 113.5 }, { x: 112.7, y: 108.5 }, { x: 115.6, y: 104.2 }, { x: 119.6, y: 100.9 }, { x: 124.5, y: 98.9 }, { x: 129.6, y: 98.0 }, { x: 134.9, y: 97.9 }, { x: 140.1, y: 98.3 }, { x: 145.2, y: 99.7 }, { x: 149.7, y: 102.3 }, { x: 153.3, y: 106.1 }, { x: 155.6, y: 110.8 }, { x: 156.9, y: 115.9 }, { x: 157.5, y: 121.1 }, { x: 157.6, y: 126.4 }, { x: 157.6, y: 131.6 }, { x: 157.6, y: 136.9 }, { x: 157.6, y: 142.1 }, { x: 157.6, y: 147.4 }, { x: 157.6, y: 152.6 }, { x: 157.5, y: 157.9 }, { x: 156.9, y: 163.1 }, { x: 155.5, y: 168.1 }, { x: 153.1, y: 172.8 }, { x: 149.5, y: 176.6 }, { x: 145.0, y: 179.2 }, { x: 145.9, y: 179.8 }, { x: 151.1, y: 179.8 }, { x: 156.4, y: 179.8 }, { x: 161.6, y: 179.8 }, { x: 166.9, y: 179.8 }, { x: 172.1, y: 179.8 }, { x: 177.4, y: 179.8 }, { x: 182.6, y: 179.8 }, { x: 187.9, y: 179.8 }, { x: 193.1, y: 179.8 }, { x: 198.4, y: 179.8 }, { x: 200.4, y: 179.3 }, { x: 195.8, y: 176.9 }, { x: 192.2, y: 173.1 }, { x: 189.9, y: 168.4 }, { x: 188.7, y: 163.3 }, { x: 188.1, y: 158.1 }, { x: 188.0, y: 152.9 }, { x: 188.0, y: 147.6 }, { x: 188.0, y: 142.4 }, { x: 188.0, y: 137.1 }, { x: 188.0, y: 131.9 }, { x: 188.0, y: 126.6 }, { x: 188.0, y: 121.4 }, { x: 188.0, y: 116.1 }, { x: 188.0, y: 110.9 }, { x: 188.0, y: 105.6 }, { x: 188.0, y: 100.3 }, { x: 191.8, y: 98.9 }, { x: 197.0, y: 98.9 }, { x: 202.3, y: 98.9 }, { x: 204.2, y: 102.2 }, { x: 204.2, y: 107.4 }, { x: 204.2, y: 112.7 }, { x: 204.2, y: 117.9 }, { x: 204.2, y: 123.2 }, { x: 204.2, y: 128.4 }, { x: 204.2, y: 133.7 }, { x: 204.2, y: 138.9 }, { x: 204.2, y: 144.2 }, { x: 204.2, y: 149.4 }, { x: 204.2, y: 154.7 }, { x: 204.3, y: 159.9 }, { x: 205.4, y: 165.1 }, { x: 208.9, y: 168.6 }, { x: 214.1, y: 168.5 }, { x: 217.5, y: 164.8 }, { x: 218.5, y: 159.7 }, { x: 218.6, y: 154.4 }, { x: 218.6, y: 149.2 }, { x: 218.6, y: 143.9 }, { x: 218.6, y: 138.7 }, { x: 218.6, y: 133.4 }, { x: 218.6, y: 128.2 }, { x: 218.6, y: 122.9 }, { x: 218.6, y: 117.7 }, { x: 218.6, y: 112.4 }, { x: 218.6, y: 107.2 }, { x: 218.6, y: 101.9 }, { x: 220.8, y: 98.9 }, { x: 226.0, y: 98.9 }, { x: 231.3, y: 98.9 }, { x: 234.9, y: 100.5 }, { x: 234.9, y: 105.7 }, { x: 234.9, y: 111.0 }, { x: 234.9, y: 116.2 }, { x: 234.9, y: 121.5 }, { x: 234.9, y: 126.7 }, { x: 234.9, y: 132.0 }, { x: 234.9, y: 137.2 }, { x: 234.9, y: 142.5 }, { x: 234.9, y: 147.7 }, { x: 234.9, y: 153.0 }, { x: 234.8, y: 158.2 }, { x: 234.2, y: 163.5 }, { x: 233.0, y: 168.6 }, { x: 230.6, y: 173.2 }, { x: 227.0, y: 177.0 }, { x: 222.3, y: 179.4 }, { x: 224.6, y: 179.8 }, { x: 229.8, y: 179.8 }, { x: 235.1, y: 179.8 }, { x: 240.3, y: 179.8 }, { x: 245.6, y: 179.8 }, { x: 250.8, y: 179.8 }, { x: 256.1, y: 179.8 }, { x: 261.3, y: 179.8 }, { x: 266.6, y: 179.8 }, { x: 271.8, y: 179.8 }, { x: 277.1, y: 179.8 }, { x: 282.3, y: 179.8 }, { x: 287.6, y: 179.8 }, { x: 292.8, y: 179.8 }, { x: 298.0, y: 179.8 }, { x: 296.7, y: 174.7 }, { x: 295.4, y: 169.6 }, { x: 294.2, y: 164.5 }, { x: 292.9, y: 159.4 }, { x: 291.6, y: 154.3 }, { x: 290.3, y: 149.2 }, { x: 289.0, y: 144.1 }, { x: 284.5, y: 143.1 }, { x: 282.8, y: 146.7 }, { x: 282.8, y: 151.9 }, { x: 282.8, y: 157.2 }, { x: 282.8, y: 162.4 }, { x: 282.8, y: 167.7 }, { x: 282.8, y: 172.9 }, { x: 282.8, y: 178.2 }, { x: 277.8, y: 178.5 }, { x: 272.6, y: 178.5 }, { x: 267.3, y: 178.5 }, { x: 266.4, y: 174.1 }, { x: 266.4, y: 168.9 }, { x: 266.4, y: 163.6 }, { x: 266.4, y: 158.4 }, { x: 266.4, y: 153.1 }, { x: 266.4, y: 147.9 }, { x: 266.4, y: 142.6 }, { x: 266.4, y: 137.4 }, { x: 266.4, y: 132.1 }, { x: 266.4, y: 126.9 }, { x: 266.4, y: 121.6 }, { x: 266.4, y: 116.4 }, { x: 266.4, y: 111.1 }, { x: 266.4, y: 105.9 }, { x: 266.4, y: 100.6 }, { x: 269.9, y: 98.9 }, { x: 275.1, y: 98.9 }, { x: 280.4, y: 98.9 }, { x: 285.6, y: 98.9 }, { x: 290.9, y: 98.9 }, { x: 296.1, y: 99.5 }, { x: 301.2, y: 100.7 }, { x: 306.0, y: 102.9 }, { x: 309.9, y: 106.4 }, { x: 312.3, y: 111.0 }, { x: 313.5, y: 116.1 }, { x: 313.7, y: 121.3 }, { x: 313.3, y: 126.6 }, { x: 312.0, y: 131.7 }, { x: 309.5, y: 136.2 }, { x: 305.4, y: 139.5 }, { x: 304.6, y: 143.6 }, { x: 306.0, y: 148.6 }, { x: 307.5, y: 153.7 }, { x: 308.9, y: 158.7 }, { x: 310.3, y: 163.8 }, { x: 311.8, y: 168.8 }, { x: 313.2, y: 173.9 }, { x: 314.6, y: 178.9 }, { x: 319.2, y: 179.8 }, { x: 324.5, y: 179.8 }, { x: 329.7, y: 179.8 }, { x: 335.0, y: 179.8 }, { x: 340.2, y: 179.8 }, { x: 344.9, y: 179.3 }, { x: 344.9, y: 174.0 }, { x: 344.9, y: 168.8 }, { x: 344.9, y: 163.5 }, { x: 344.9, y: 158.3 }, { x: 344.9, y: 153.0 }, { x: 344.9, y: 147.8 }, { x: 344.9, y: 142.5 }, { x: 344.9, y: 137.3 }, { x: 344.9, y: 132.0 }, { x: 344.9, y: 126.8 }, { x: 344.9, y: 121.5 }, { x: 344.9, y: 116.3 }, { x: 344.9, y: 111.0 }, { x: 344.9, y: 105.8 }, { x: 344.9, y: 100.5 }, { x: 348.5, y: 98.9 }, { x: 353.7, y: 98.9 }, { x: 359.0, y: 98.9 }, { x: 361.3, y: 101.8 }, { x: 361.3, y: 107.0 }, { x: 361.3, y: 112.3 }, { x: 361.3, y: 117.5 }, { x: 361.3, y: 122.8 }, { x: 361.3, y: 128.0 }, { x: 361.3, y: 133.3 }, { x: 361.3, y: 138.6 }, { x: 361.3, y: 143.8 }, { x: 361.3, y: 149.1 }, { x: 361.3, y: 154.3 }, { x: 361.3, y: 159.6 }, { x: 361.3, y: 164.8 }, { x: 361.3, y: 170.1 }, { x: 361.3, y: 175.3 }, { x: 362.0, y: 179.8 }, { x: 367.3, y: 179.8 }, { x: 372.5, y: 179.8 }, { x: 377.8, y: 179.8 }, { x: 383.0, y: 179.8 }, { x: 388.3, y: 179.8 }, { x: 393.5, y: 179.8 }, { x: 393.6, y: 174.7 }, { x: 393.6, y: 169.4 }, { x: 393.6, y: 164.2 }, { x: 393.6, y: 158.9 }, { x: 393.6, y: 153.7 }, { x: 393.6, y: 148.4 }, { x: 393.6, y: 143.2 }, { x: 393.6, y: 137.9 }, { x: 393.6, y: 132.7 }, { x: 393.6, y: 127.4 }, { x: 393.6, y: 122.2 }, { x: 393.6, y: 116.9 }, { x: 393.6, y: 111.7 }, { x: 393.6, y: 106.4 }, { x: 393.6, y: 101.2 }, { x: 396.5, y: 98.9 }, { x: 401.8, y: 98.9 }, { x: 407.1, y: 98.9 }, { x: 412.3, y: 98.9 }, { x: 417.6, y: 98.9 }, { x: 422.8, y: 98.8 }, { x: 428.1, y: 98.8 }, { x: 428.9, y: 103.3 }, { x: 428.9, y: 108.5 }, { x: 425.4, y: 110.3 }, { x: 420.1, y: 110.3 }, { x: 414.9, y: 110.3 }, { x: 410.0, y: 110.6 }, { x: 410.0, y: 115.9 }, { x: 410.0, y: 121.1 }, { x: 410.0, y: 126.4 }, { x: 410.0, y: 131.6 }, { x: 415.1, y: 131.8 }, { x: 420.4, y: 131.8 }, { x: 424.6, y: 132.8 }, { x: 424.6, y: 138.0 }, { x: 424.6, y: 143.3 }, { x: 419.3, y: 143.3 }, { x: 414.1, y: 143.3 }, { x: 410.0, y: 144.4 }, { x: 410.0, y: 149.7 }, { x: 410.0, y: 154.9 }, { x: 410.0, y: 160.2 }, { x: 410.0, y: 165.4 }, { x: 412.0, y: 168.6 }, { x: 417.3, y: 168.6 }, { x: 422.5, y: 168.6 }, { x: 427.8, y: 168.6 }, { x: 429.1, y: 172.6 }, { x: 429.1, y: 177.9 }, { x: 432.4, y: 179.8 }, { x: 437.6, y: 179.8 }, { x: 442.9, y: 179.8 }, { x: 448.1, y: 179.8 }, { x: 453.4, y: 179.8 }, { x: 458.6, y: 179.8 }, { x: 463.9, y: 179.8 }, { x: 469.1, y: 179.8 }, { x: 474.4, y: 179.8 }, { x: 479.6, y: 179.8 }, { x: 484.9, y: 179.8 }, { x: 488.9, y: 178.9 }, { x: 487.6, y: 173.8 }, { x: 486.3, y: 168.7 }, { x: 485.0, y: 163.6 }, { x: 483.7, y: 158.5 }, { x: 482.5, y: 153.4 }, { x: 481.2, y: 148.3 }, { x: 479.9, y: 143.2 }, { x: 474.7, y: 143.1 }, { x: 473.9, y: 147.6 }, { x: 473.9, y: 152.9 }, { x: 473.9, y: 158.1 }, { x: 473.9, y: 163.4 }, { x: 473.9, y: 168.6 }, { x: 473.9, y: 173.9 }, { x: 473.2, y: 178.5 }, { x: 468.0, y: 178.5 }, { x: 462.7, y: 178.5 }, { x: 457.5, y: 178.4 }, { x: 457.5, y: 173.2 }, { x: 457.5, y: 167.9 }, { x: 457.5, y: 162.7 }, { x: 457.5, y: 157.4 }, { x: 457.5, y: 152.2 }, { x: 457.5, y: 146.9 }, { x: 457.5, y: 141.7 }, { x: 457.5, y: 136.4 }, { x: 457.5, y: 131.2 }, { x: 457.5, y: 125.9 }, { x: 457.5, y: 120.7 }, { x: 457.5, y: 115.4 }, { x: 457.5, y: 110.2 }, { x: 457.5, y: 104.9 }, { x: 457.5, y: 99.7 }, { x: 461.9, y: 98.9 }, { x: 467.2, y: 98.9 }, { x: 472.4, y: 98.9 }, { x: 477.7, y: 98.9 }, { x: 482.9, y: 99.0 }, { x: 488.1, y: 99.7 }, { x: 493.2, y: 101.0 }, { x: 497.9, y: 103.4 }, { x: 501.5, y: 107.1 }, { x: 503.7, y: 111.9 }, { x: 504.7, y: 117.0 }, { x: 504.8, y: 122.3 }, { x: 504.2, y: 127.5 }, { x: 502.8, y: 132.5 }, { x: 499.9, y: 136.9 }, { x: 495.7, y: 139.9 }, { x: 496.0, y: 144.5 }, { x: 497.4, y: 149.5 }, { x: 498.8, y: 154.6 }, { x: 500.3, y: 159.6 }, { x: 501.7, y: 164.7 }, { x: 503.1, y: 169.7 }, { x: 504.6, y: 174.8 }, { x: 506.0, y: 179.8 }, { x: 511.3, y: 179.8 }, { x: 516.5, y: 179.8 }, { x: 521.8, y: 179.8 }, { x: 527.0, y: 179.8 }, { x: 532.3, y: 179.8 }, { x: 537.5, y: 179.8 }, { x: 542.8, y: 179.8 }, { x: 543.7, y: 184.2 }, { x: 543.7, y: 189.5 }, { x: 543.7, y: 194.7 }, { x: 543.7, y: 200.0 }, { x: 543.7, y: 205.2 }, { x: 543.7, y: 210.5 }, { x: 543.7, y: 215.7 }, { x: 541.7, y: 219.1 }, { x: 536.5, y: 219.1 }, { x: 531.2, y: 219.1 }, { x: 535.8, y: 221.3 }, { x: 539.3, y: 225.2 }, { x: 541.6, y: 229.9 }, { x: 543.0, y: 235.0 }, { x: 543.6, y: 240.2 }, { x: 538.8, y: 241.3 }, { x: 533.6, y: 242.0 }, { x: 529.3, y: 241.7 }, { x: 528.8, y: 236.5 }, { x: 526.9, y: 231.7 }, { x: 522.1, y: 230.2 }, { x: 518.1, y: 233.2 }, { x: 517.3, y: 238.4 }, { x: 518.7, y: 243.4 }, { x: 522.0, y: 247.5 }, { x: 525.9, y: 251.0 }, { x: 529.8, y: 254.5 }, { x: 533.8, y: 258.0 }, { x: 537.4, y: 261.7 }, { x: 540.6, y: 265.9 }, { x: 543.2, y: 270.5 }, { x: 544.7, y: 275.5 }, { x: 545.1, y: 280.7 }, { x: 544.6, y: 285.9 }, { x: 542.9, y: 290.8 }, { x: 539.8, y: 295.1 }, { x: 535.7, y: 298.3 }, { x: 530.8, y: 300.3 }, { x: 525.6, y: 301.1 }, { x: 520.4, y: 301.0 }, { x: 515.3, y: 299.9 }, { x: 510.5, y: 297.7 }, { x: 506.7, y: 294.1 }, { x: 504.0, y: 289.6 }, { x: 502.4, y: 284.6 }, { x: 501.6, y: 279.4 }, { x: 503.1, y: 275.7 }, { x: 508.3, y: 274.8 }, { x: 513.5, y: 273.9 }, { x: 515.7, y: 276.7 }, { x: 516.5, y: 281.8 }, { x: 518.8, y: 286.5 }, { x: 523.5, y: 288.5 }, { x: 528.0, y: 286.4 }, { x: 529.0, y: 281.3 }, { x: 528.1, y: 276.2 }, { x: 525.4, y: 271.7 }, { x: 521.7, y: 267.9 }, { x: 517.8, y: 264.4 }, { x: 513.8, y: 261.0 }, { x: 509.9, y: 257.5 }, { x: 506.4, y: 253.6 }, { x: 503.6, y: 249.2 }, { x: 502.0, y: 244.2 }, { x: 501.5, y: 239.0 }, { x: 501.9, y: 233.7 }, { x: 503.4, y: 228.7 }, { x: 506.3, y: 224.4 }, { x: 510.4, y: 221.1 }, { x: 515.2, y: 219.1 }, { x: 510.3, y: 219.1 }, { x: 505.1, y: 219.1 }, { x: 499.8, y: 219.1 }, { x: 494.6, y: 219.1 }, { x: 490.0, y: 219.7 }, { x: 490.1, y: 224.9 }, { x: 490.2, y: 230.2 }, { x: 490.3, y: 235.4 }, { x: 490.4, y: 240.7 }, { x: 490.4, y: 245.9 }, { x: 490.5, y: 251.2 }, { x: 490.6, y: 256.4 }, { x: 490.7, y: 261.7 }, { x: 490.8, y: 266.9 }, { x: 490.9, y: 272.2 }, { x: 491.0, y: 277.4 }, { x: 491.1, y: 282.7 }, { x: 491.2, y: 287.9 }, { x: 491.3, y: 293.2 }, { x: 491.4, y: 298.4 }, { x: 487.8, y: 300.1 }, { x: 482.6, y: 300.1 }, { x: 479.4, y: 297.9 }, { x: 479.3, y: 292.7 }, { x: 479.2, y: 287.4 }, { x: 479.0, y: 282.2 }, { x: 478.9, y: 276.9 }, { x: 478.8, y: 271.7 }, { x: 478.7, y: 266.4 }, { x: 478.5, y: 261.2 }, { x: 478.4, y: 255.9 }, { x: 478.3, y: 250.7 }, { x: 478.2, y: 245.4 }, { x: 477.2, y: 249.9 }, { x: 476.3, y: 255.0 }, { x: 475.3, y: 260.2 }, { x: 474.3, y: 265.3 }, { x: 473.3, y: 270.5 }, { x: 472.4, y: 275.7 }, { x: 471.4, y: 280.8 }, { x: 470.4, y: 286.0 }, { x: 469.4, y: 291.1 }, { x: 468.5, y: 296.3 }, { x: 466.3, y: 300.1 }, { x: 461.1, y: 300.1 }, { x: 457.2, y: 298.3 }, { x: 456.2, y: 293.2 }, { x: 455.2, y: 288.0 }, { x: 454.2, y: 282.9 }, { x: 453.2, y: 277.7 }, { x: 452.2, y: 272.6 }, { x: 451.2, y: 267.4 }, { x: 450.2, y: 262.3 }, { x: 449.2, y: 257.1 }, { x: 448.2, y: 251.9 }, { x: 447.2, y: 246.8 }, { x: 446.8, y: 247.9 }, { x: 446.7, y: 253.2 }, { x: 446.6, y: 258.4 }, { x: 446.4, y: 263.7 }, { x: 446.3, y: 268.9 }, { x: 446.2, y: 274.2 }, { x: 446.1, y: 279.4 }, { x: 446.0, y: 284.7 }, { x: 445.9, y: 289.9 }, { x: 445.8, y: 295.2 }, { x: 445.3, y: 300.1 }, { x: 440.0, y: 300.1 }, { x: 434.8, y: 300.1 }, { x: 433.6, y: 296.0 }, { x: 433.7, y: 290.8 }, { x: 433.8, y: 285.5 }, { x: 433.9, y: 280.3 }, { x: 434.0, y: 275.0 }, { x: 434.1, y: 269.8 }, { x: 434.2, y: 264.5 }, { x: 434.3, y: 259.3 }, { x: 434.3, y: 254.0 }, { x: 434.4, y: 248.8 }, { x: 434.5, y: 243.5 }, { x: 434.6, y: 238.3 }, { x: 434.7, y: 233.0 }, { x: 434.8, y: 227.8 }, { x: 434.9, y: 222.5 }, { x: 433.2, y: 219.1 }, { x: 427.9, y: 219.1 }, { x: 422.6, y: 219.1 }, { x: 417.4, y: 219.1 }, { x: 412.1, y: 219.1 }, { x: 406.9, y: 219.1 }, { x: 401.6, y: 219.1 }, { x: 399.9, y: 219.1 }, { x: 405.1, y: 219.7 }, { x: 410.2, y: 220.9 }, { x: 415.0, y: 223.0 }, { x: 419.0, y: 226.5 }, { x: 421.4, y: 231.0 }, { x: 422.6, y: 236.2 }, { x: 422.8, y: 241.4 }, { x: 422.4, y: 246.6 }, { x: 421.2, y: 251.7 }, { x: 418.7, y: 256.3 }, { x: 414.7, y: 259.6 }, { x: 413.7, y: 263.6 }, { x: 415.2, y: 268.7 }, { x: 416.6, y: 273.7 }, { x: 418.0, y: 278.8 }, { x: 419.5, y: 283.8 }, { x: 420.9, y: 288.9 }, { x: 422.3, y: 294.0 }, { x: 423.8, y: 299.0 }, { x: 419.9, y: 300.1 }, { x: 414.6, y: 300.1 }, { x: 409.4, y: 300.1 }, { x: 406.4, y: 297.1 }, { x: 405.1, y: 292.0 }, { x: 403.9, y: 286.9 }, { x: 402.6, y: 281.8 }, { x: 401.3, y: 276.7 }, { x: 400.0, y: 271.7 }, { x: 398.8, y: 266.6 }, { x: 396.0, y: 263.3 }, { x: 392, y: 264.5 }, { x: 392, y: 269.8 }, { x: 392, y: 275.0 }, { x: 392, y: 280.3 }, { x: 392, y: 285.6 }, { x: 392, y: 290.8 }, { x: 392, y: 296.1 }, { x: 390.7, y: 300.1 }, { x: 385.4, y: 300.1 }, { x: 380.2, y: 300.1 }, { x: 375.6, y: 299.4 }, { x: 375.6, y: 294.2 }, { x: 375.6, y: 288.9 }, { x: 375.6, y: 283.7 }, { x: 375.6, y: 278.4 }, { x: 375.6, y: 273.2 }, { x: 375.6, y: 267.9 }, { x: 375.6, y: 262.7 }, { x: 375.6, y: 257.4 }, { x: 375.6, y: 252.2 }, { x: 375.6, y: 246.9 }, { x: 375.6, y: 241.7 }, { x: 375.6, y: 236.4 }, { x: 375.6, y: 231.2 }, { x: 375.6, y: 225.9 }, { x: 375.6, y: 220.7 }, { x: 371.9, y: 219.1 }, { x: 366.7, y: 219.1 }, { x: 361.4, y: 219.1 }, { x: 356.2, y: 219.1 }, { x: 350.9, y: 219.1 }, { x: 353.1, y: 220.3 }, { x: 357.5, y: 223.1 }, { x: 360.8, y: 227.2 }, { x: 362.9, y: 232.0 }, { x: 364.1, y: 237.1 }, { x: 364.5, y: 242.4 }, { x: 364.6, y: 247.6 }, { x: 364.6, y: 252.9 }, { x: 364.6, y: 258.1 }, { x: 364.6, y: 263.4 }, { x: 364.6, y: 268.6 }, { x: 364.6, y: 273.9 }, { x: 364.4, y: 279.1 }, { x: 363.6, y: 284.3 }, { x: 362.0, y: 289.3 }, { x: 359.4, y: 293.9 }, { x: 355.6, y: 297.5 }, { x: 350.9, y: 299.7 }, { x: 345.8, y: 300.8 }, { x: 340.5, y: 301.1 }, { x: 335.3, y: 300.8 }, { x: 330.2, y: 299.7 }, { x: 325.5, y: 297.4 }, { x: 321.7, y: 293.7 }, { x: 319.2, y: 289.2 }, { x: 317.7, y: 284.1 }, { x: 316.9, y: 278.9 }, { x: 316.7, y: 273.7 }, { x: 316.7, y: 268.4 }, { x: 316.7, y: 263.2 }, { x: 316.7, y: 257.9 }, { x: 316.7, y: 252.7 }, { x: 316.7, y: 247.4 }, { x: 316.8, y: 242.2 }, { x: 317.3, y: 237.0 }, { x: 318.4, y: 231.8 }, { x: 320.6, y: 227.1 }, { x: 323.9, y: 223.0 }, { x: 328.3, y: 220.2 }, { x: 330.2, y: 219.1 }, { x: 324.9, y: 219.1 }, { x: 319.7, y: 219.1 }, { x: 314.4, y: 219.1 }, { x: 309.7, y: 219.5 }, { x: 309.7, y: 224.8 }, { x: 309.7, y: 230.1 }, { x: 304.7, y: 230.3 }, { x: 299.4, y: 230.3 }, { x: 294.2, y: 230.3 }, { x: 291.8, y: 233.3 }, { x: 291.8, y: 238.5 }, { x: 291.8, y: 243.8 }, { x: 291.8, y: 249.0 }, { x: 294.0, y: 252.1 }, { x: 299.2, y: 252.1 }, { x: 304.5, y: 252.1 }, { x: 307, y: 254.9 }, { x: 307, y: 260.2 }, { x: 305.2, y: 263.7 }, { x: 299.9, y: 263.7 }, { x: 294.7, y: 263.7 }, { x: 291.8, y: 266.1 }, { x: 291.8, y: 271.3 }, { x: 291.8, y: 276.6 }, { x: 291.8, y: 281.8 }, { x: 291.8, y: 287.1 }, { x: 291.8, y: 292.3 }, { x: 291.8, y: 297.6 }, { x: 289.1, y: 300.1 }, { x: 283.8, y: 300.1 }, { x: 278.6, y: 300.1 }, { x: 275.5, y: 297.9 }, { x: 275.5, y: 292.7 }, { x: 275.5, y: 287.4 }, { x: 275.5, y: 282.2 }, { x: 275.5, y: 276.9 }, { x: 275.5, y: 271.6 }, { x: 275.5, y: 266.4 }, { x: 275.5, y: 261.1 }, { x: 275.5, y: 255.9 }, { x: 275.5, y: 250.6 }, { x: 275.5, y: 245.4 }, { x: 275.5, y: 240.1 }, { x: 275.5, y: 234.9 }, { x: 275.5, y: 229.6 }, { x: 275.5, y: 224.4 }, { x: 275.5, y: 219.1 }, { x: 270.3, y: 219.1 }, { x: 265.0, y: 219.1 }, { x: 259.8, y: 219.1 }, { x: 254.5, y: 219.1 }, { x: 256.0, y: 220.4 }, { x: 259.9, y: 223.8 }, { x: 262.5, y: 228.3 }, { x: 264.2, y: 233.3 }, { x: 265.1, y: 238.5 }, { x: 262.1, y: 241.0 }, { x: 256.9, y: 241.8 }, { x: 251.7, y: 242.5 }, { x: 250.6, y: 238.2 }, { x: 249.5, y: 233.1 }, { x: 245.4, y: 230.2 }, { x: 240.6, y: 231.8 }, { x: 238.9, y: 236.7 }, { x: 239.6, y: 241.8 }, { x: 242.4, y: 246.2 }, { x: 246.2, y: 249.9 }, { x: 250.1, y: 253.4 }, { x: 254.1, y: 256.8 }, { x: 257.9, y: 260.4 }, { x: 261.2, y: 264.5 }, { x: 264.1, y: 268.9 }, { x: 265.9, y: 273.8 }, { x: 266.7, y: 279.0 }, { x: 266.5, y: 284.2 }, { x: 265.2, y: 289.3 }, { x: 262.5, y: 293.8 }, { x: 258.7, y: 297.4 }, { x: 254.1, y: 299.8 }, { x: 249.0, y: 301.0 }, { x: 243.7, y: 301.1 }, { x: 238.5, y: 300.4 }, { x: 233.6, y: 298.5 }, { x: 229.4, y: 295.4 }, { x: 226.4, y: 291.1 }, { x: 224.5, y: 286.3 }, { x: 223.4, y: 281.1 }, { x: 223.0, y: 275.9 }, { x: 228.2, y: 275.1 }, { x: 233.4, y: 274.2 }, { x: 237.2, y: 275.0 }, { x: 237.8, y: 280.2 }, { x: 239.4, y: 285.1 }, { x: 243.4, y: 288.3 }, { x: 248.4, y: 287.6 }, { x: 250.6, y: 283.0 }, { x: 250.2, y: 277.8 }, { x: 248.0, y: 273.0 }, { x: 244.6, y: 269.1 }, { x: 240.7, y: 265.5 }, { x: 236.7, y: 262.1 }, { x: 232.8, y: 258.6 }, { x: 229.1, y: 254.9 }, { x: 226.0, y: 250.7 }, { x: 224.0, y: 245.9 }, { x: 223.1, y: 240.7 }, { x: 223.2, y: 235.4 }, { x: 224.4, y: 230.3 }, { x: 226.8, y: 225.7 }, { x: 230.6, y: 222.1 }, { x: 235.2, y: 219.6 }, { x: 233.5, y: 219.1 }, { x: 228.3, y: 219.1 }, { x: 223.0, y: 219.1 }, { x: 217.8, y: 219.1 }, { x: 212.8, y: 219.3 }, { x: 212.8, y: 224.5 }, { x: 212.8, y: 229.8 }, { x: 212.8, y: 235.0 }, { x: 212.8, y: 240.3 }, { x: 212.8, y: 245.5 }, { x: 212.8, y: 250.8 }, { x: 212.8, y: 256.0 }, { x: 212.8, y: 261.3 }, { x: 212.8, y: 266.5 }, { x: 212.8, y: 271.8 }, { x: 212.8, y: 277.0 }, { x: 212.8, y: 282.3 }, { x: 212.8, y: 287.5 }, { x: 212.8, y: 292.8 }, { x: 212.8, y: 298.0 }, { x: 209.5, y: 300.1 }, { x: 204.3, y: 300.1 }, { x: 200.7, y: 297.6 }, { x: 198.7, y: 292.7 }, { x: 196.7, y: 287.9 }, { x: 194.8, y: 283.0 }, { x: 192.8, y: 278.1 }, { x: 190.9, y: 273.2 }, { x: 188.9, y: 268.4 }, { x: 187.0, y: 263.5 }, { x: 185.0, y: 258.6 }, { x: 183.6, y: 256.9 }, { x: 183.6, y: 262.1 }, { x: 183.6, y: 267.4 }, { x: 183.6, y: 272.6 }, { x: 183.6, y: 277.9 }, { x: 183.6, y: 283.1 }, { x: 183.6, y: 288.4 }, { x: 183.6, y: 293.6 }, { x: 183.6, y: 298.9 }, { x: 179.6, y: 300.1 }, { x: 174.3, y: 300.1 }, { x: 169.6, y: 299.6 }, { x: 169.6, y: 294.3 }, { x: 169.6, y: 289.1 }, { x: 169.6, y: 283.8 }, { x: 169.6, y: 278.6 }, { x: 169.6, y: 273.3 }, { x: 169.6, y: 268.0 }, { x: 169.6, y: 262.8 }, { x: 169.6, y: 257.5 }, { x: 169.6, y: 252.3 }, { x: 169.6, y: 247.0 }, { x: 169.6, y: 241.8 }, { x: 169.6, y: 236.5 }, { x: 169.6, y: 231.3 }, { x: 169.6, y: 226.0 }, { x: 169.6, y: 220.8 }, { x: 166.0, y: 219.1 }, { x: 160.8, y: 219.1 }, { x: 155.5, y: 219.1 }, { x: 150.3, y: 219.1 }, { x: 145.9, y: 219.8 }, { x: 146.9, y: 224.9 }, { x: 147.9, y: 230.1 }, { x: 148.9, y: 235.2 }, { x: 149.9, y: 240.4 }, { x: 150.9, y: 245.5 }, { x: 151.8, y: 250.7 }, { x: 152.8, y: 255.9 }, { x: 153.8, y: 261.0 }, { x: 154.8, y: 266.2 }, { x: 155.8, y: 271.3 }, { x: 156.8, y: 276.5 }, { x: 157.8, y: 281.6 }, { x: 158.8, y: 286.8 }, { x: 159.8, y: 292.0 }, { x: 160.8, y: 297.1 }, { x: 159.1, y: 300.1 }, { x: 153.8, y: 300.1 }, { x: 148.6, y: 300.1 }, { x: 145.7, y: 297.3 }, { x: 144.8, y: 292.1 }, { x: 143.9, y: 286.9 }, { x: 142.6, y: 282.2 }, { x: 137.4, y: 282.2 }, { x: 132.1, y: 282.2 }, { x: 129.8, y: 285.7 }, { x: 128.9, y: 290.8 }, { x: 128.0, y: 296.0 }, { x: 126.1, y: 300.1 }, { x: 120.8, y: 300.1 }, { x: 115.6, y: 300.1 }, { x: 112.0, y: 298.7 }, { x: 113.0, y: 293.5 }, { x: 114.0, y: 288.3 }, { x: 115.0, y: 283.2 }, { x: 116.0, y: 278.0 }, { x: 117.0, y: 272.9 }, { x: 118.0, y: 267.7 }, { x: 119.0, y: 262.6 }, { x: 120.0, y: 257.4 }, { x: 121.0, y: 252.3 }, { x: 122.0, y: 247.1 }, { x: 123.0, y: 241.9 }, { x: 124.0, y: 236.8 }, { x: 125.0, y: 231.6 }, { x: 126.0, y: 226.5 }, { x: 127.0, y: 221.3 }, { x: 124.5, y: 219.1 }, { x: 119.3, y: 219.1 }, { x: 114.0, y: 219.1 }, { x: 108.8, y: 219.1 }, { x: 103.5, y: 219.1 }, { x: 98.3, y: 219.1 }, { x: 93.0, y: 219.1 }, { x: 87.8, y: 219.1 }, { x: 82.5, y: 219.1 }, { x: 82.8, y: 219.2 }, { x: 88.1, y: 219.8 }, { x: 93.1, y: 221.2 }, { x: 97.8, y: 223.6 }, { x: 101.5, y: 227.3 }, { x: 103.7, y: 232.0 }, { x: 104.6, y: 237.2 }, { x: 104.7, y: 242.4 }, { x: 104.2, y: 247.7 }, { x: 102.8, y: 252.7 }, { x: 99.9, y: 257.1 }, { x: 95.7, y: 260.1 }, { x: 95.9, y: 264.6 }, { x: 97.3, y: 269.7 }, { x: 98.8, y: 274.7 }, { x: 100.2, y: 279.8 }, { x: 101.6, y: 284.8 }, { x: 103.1, y: 289.9 }, { x: 104.5, y: 294.9 }, { x: 105.9, y: 300.0 }, { x: 100.7, y: 300.1 }, { x: 95.5, y: 300.1 }, { x: 90.2, y: 300.1 }, { x: 88.1, y: 296.1 }, { x: 86.8, y: 291.0 }, { x: 85.5, y: 285.9 }, { x: 84.2, y: 280.8 }, { x: 83.0, y: 275.7 }, { x: 81.7, y: 270.6 }, { x: 80.4, y: 265.6 }, { x: 76.9, y: 263.3 }, { x: 73.9, y: 265.6 }, { x: 73.9, y: 270.8 }, { x: 73.9, y: 276.1 }, { x: 73.9, y: 281.3 }, { x: 73.9, y: 286.6 }, { x: 73.9, y: 291.8 }, { x: 73.9, y: 297.1 }, { x: 71.6, y: 300.1 }, { x: 66.3, y: 300.1 }, { x: 61.1, y: 300.1 }, { x: 57.5, y: 298.4 }, { x: 57.5, y: 293.1 }, { x: 57.5, y: 287.9 }, { x: 57.5, y: 282.6 }, { x: 57.5, y: 277.4 }, { x: 57.5, y: 272.1 }, { x: 57.5, y: 266.9 }, { x: 57.5, y: 261.6 }, { x: 57.5, y: 256.4 }, { x: 57.5, y: 251.1 }, { x: 57.5, y: 245.9 }, { x: 57.5, y: 240.6 }, { x: 57.5, y: 235.4 }, { x: 57.5, y: 230.1 }, { x: 57.5, y: 224.9 }, { x: 57.5, y: 219.6 }, { x: 52.8, y: 219.1 }, { x: 50.2, y: 221.7 }, { x: 50.2, y: 226.9 }, { x: 49.2, y: 231.3 }, { x: 44.0, y: 231.3 }, { x: 38.7, y: 231.3 }, { x: 37.9, y: 235.6 }, { x: 37.9, y: 240.9 }, { x: 37.9, y: 246.1 }, { x: 37.9, y: 251.4 }, { x: 37.9, y: 256.6 }, { x: 37.9, y: 261.9 }, { x: 37.9, y: 267.1 }, { x: 37.9, y: 272.4 }, { x: 37.9, y: 277.6 }, { x: 37.9, y: 282.9 }, { x: 37.9, y: 288.1 }, { x: 37.9, y: 293.4 }, { x: 37.9, y: 298.7 }, { x: 34.0, y: 300.1 }, { x: 28.7, y: 300.1 }, { x: 23.5, y: 300.1 }, { x: 21.2, y: 297.0 }, { x: 21.2, y: 291.8 }, { x: 21.2, y: 286.5 }, { x: 21.2, y: 281.3 }, { x: 21.3, y: 276.0 }, { x: 21.3, y: 270.8 }, { x: 21.3, y: 265.5 }, { x: 21.3, y: 260.3 }, { x: 21.3, y: 255.0 }, { x: 21.3, y: 249.8 }, { x: 21.3, y: 244.5 }, { x: 21.3, y: 239.3 }, { x: 21.3, y: 234.0 }, { x: 18.8, y: 231.3 }, { x: 13.5, y: 231.3 }, { x: 8.8, y: 230.8 }, { x: 8.8, y: 225.5 }, { x: 8.8, y: 220.3 }, { x: 8.8, y: 215.0 }, { x: 8.8, y: 209.8 }, { x: 8.8, y: 204.5 }, { x: 8.8, y: 199.3 }, { x: 8.8, y: 194.0 }, { x: 8.8, y: 188.8 }, { x: 8.8, y: 183.5 }];

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvasController = __webpack_require__(1);

var _canvasController2 = _interopRequireDefault(_canvasController);

var _color = __webpack_require__(2);

var _waveThings = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WaveSplitController = function (_CanvasController) {
    _inherits(WaveSplitController, _CanvasController);

    function WaveSplitController(id, width, height) {
        _classCallCheck(this, WaveSplitController);

        var _this = _possibleConstructorReturn(this, (WaveSplitController.__proto__ || Object.getPrototypeOf(WaveSplitController)).call(this, id, width, height));

        _this.animAmt = 0;
        _this.wavePoints = [];
        return _this;
    }

    _createClass(WaveSplitController, [{
        key: "setPath",
        value: function setPath(path) {
            this.wavePoints = path;
        }
    }, {
        key: "update",
        value: function update(dt, mousePosition) {
            var period = 7;
            this.animAmt += dt / period;
            this.animAmt %= 1;
        }
    }, {
        key: "render",
        value: function render() {
            this.clear();
            this.renderWave();
        }
    }, {
        key: "renderWave",
        value: function renderWave() {
            if (this.wavePoints.length == 0) {
                return;
            }
            this.context.strokeStyle = _color.palette.blue;
            this.context.lineWidth = 2;

            var waveHeight = 0.2 * 0.5 * this.height;
            var wavePos = 0.5 * this.context.canvas.height;

            var startXAmt = -this.animAmt;

            this.context.beginPath();
            (0, _waveThings.renderWave)({
                context: this.context,
                width: this.width,
                wave: this.wavePoints,
                yPosition: wavePos,
                yMultiple: waveHeight,
                startXAmt: startXAmt
            });
            this.context.stroke();
        }
    }]);

    return WaveSplitController;
}(_canvasController2.default);

exports.default = WaveSplitController;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvasController = __webpack_require__(1);

var _canvasController2 = _interopRequireDefault(_canvasController);

var _util = __webpack_require__(0);

var _justfourierthings = __webpack_require__(6);

var _color = __webpack_require__(2);

var _waveThings = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var transitionFactor = 1 / 15;

var WaveSplitController = function (_CanvasController) {
    _inherits(WaveSplitController, _CanvasController);

    function WaveSplitController(id, width, height) {
        _classCallCheck(this, WaveSplitController);

        var _this = _possibleConstructorReturn(this, (WaveSplitController.__proto__ || Object.getPrototypeOf(WaveSplitController)).call(this, id, width, height));

        _this.animAmt = 0;
        _this.wavePoints = [];
        _this.partialWave = [];
        _this.fourierPoints = [];

        _this.onFourierChange = [];

        _this.waveTop = 0;
        _this.waveBottom = 0;
        _this.totalHeight = 0;
        _this.fadeFrequencies = true;
        _this.splitAnim = true;
        // How many of the waves to draw
        _this.fourierAmt = 1;
        return _this;
    }

    _createClass(WaveSplitController, [{
        key: "setPath",
        value: function setPath(path) {
            var _this2 = this;

            // Update the wave points. For the sake of removing the constant term in the FFT,
            // Set the mean to be 0.
            var pathAverage = path.reduce(function (a, b) {
                return a + b;
            }, 0) / path.length;
            this.wavePoints = path.map(function (p) {
                return p - pathAverage;
            });
            // Calculate fourier points, and drop the small things.
            this.fourierData = (0, _justfourierthings.getRealFourierData)(this.wavePoints).filter(function (f) {
                return f.amplitude > 0.001;
            });
            this.fourierData.sort(function (a, b) {
                return b.amplitude - a.amplitude;
            });

            // Calculate the heights of the main wave and all the sine things
            this.waveTop = Math.min.apply(Math, _toConsumableArray(this.wavePoints));
            this.waveBottom = Math.max.apply(Math, _toConsumableArray(this.wavePoints));

            // Total height. Start with the main wave...
            this.totalHeight = this.waveBottom - this.waveTop;
            // Then add all the sine thingos
            this.fourierData.forEach(function (el) {
                return _this2.totalHeight += 2 * el.amplitude;
            });

            // reset the animation too
            this.animAmt = 0;
            this.splitAmt = 0;

            this.onFourierChange.forEach(function (fn) {
                return fn();
            });
        }
    }, {
        key: "update",
        value: function update(dt, mousePosition) {
            var period = 7;
            this.animAmt += dt / period;
            this.animAmt %= 1;

            var pos = this.getScrollPosition();
            var desiredSplitAmt = 0;
            if (pos < 0.7) {
                desiredSplitAmt = 1;
            }
            this.splitAmt += transitionFactor * (desiredSplitAmt - this.splitAmt);
        }
    }, {
        key: "render",
        value: function render() {
            this.clear();
            this.renderWaves();
        }
    }, {
        key: "renderWaves",
        value: function renderWaves() {
            if (this.wavePoints.length == 0) {
                return;
            }
            this.context.strokeStyle = _color.palette.cyan;
            this.context.lineWidth = 2;

            var numBabies = Math.min(50, this.fourierData.length);
            var top = 0.1 * this.context.canvas.height;
            var bottom = 0.9 * this.context.canvas.height;
            // TODO: also incorporate into the frequencies to scale that too?
            var sizeMultiple = (bottom - top) / this.totalHeight;
            var spacingMultiplier = 0.8;

            // Running thing that says where to draw each wave.
            var curWavePos = 0;

            var startXAmt = -this.animAmt;

            var splitAmt = 1;
            var fadeAmt = 1;
            if (this.splitAnim) {
                splitAmt = this.splitAmt;
                fadeAmt = splitAmt;
            }

            // Actually, we're going to skip drawing the main wave here and draw it later.
            curWavePos += this.waveBottom - this.waveTop;

            // Draw its little babies.
            // Also sum up their values to draw the partial wave.

            this.partialWave = this.wavePoints.slice().fill(0);
            var renderedBabies = Math.round((0, _util.slurp)(1, numBabies, this.fourierAmt));
            for (var babe = 0; babe < renderedBabies; babe++) {
                var babeAmt = babe / (numBabies - 1);
                var waveData = this.fourierData[babe];
                curWavePos += waveData.amplitude;
                var wavePosition = (0, _util.slurp)(-this.waveTop, curWavePos, splitAmt);

                // lets generate this wave hey
                // TODO: cache this?
                var wave = this.wavePoints.slice();
                for (var i = 0; i < this.wavePoints.length; i++) {
                    var iAmt = i / this.wavePoints.length;
                    var fullWaveAmt = this.wavePoints[i];
                    var sineAmt = waveData.amplitude * Math.cos(2 * Math.PI * waveData.freq * iAmt + waveData.phase);
                    wave[i] = (0, _util.slurp)(fullWaveAmt, sineAmt, splitAmt);

                    // While we're here, update the partial wave
                    this.partialWave[i] += wave[i];
                }

                this.context.beginPath();
                this.context.globalAlpha = fadeAmt;
                if (this.fadeFrequencies) {
                    this.context.globalAlpha *= 1 - babeAmt;
                }
                (0, _waveThings.renderWave)({
                    context: this.context,
                    width: this.width,
                    wave: wave,
                    yPosition: top + sizeMultiple * wavePosition,
                    yMultiple: sizeMultiple * spacingMultiplier,
                    startXAmt: startXAmt
                });
                this.context.stroke();
                this.context.globalAlpha = 1;

                curWavePos += waveData.amplitude;
            }

            curWavePos = 0;
            curWavePos -= this.waveTop;
            if (this.fourierAmt == 1) {
                // Eh just make it the full wave.
                this.partialWave = this.wavePoints;
            }

            // Now, lets go back and draw the main wave
            // Draw the main boy
            this.context.strokeStyle = _color.palette.blue;
            this.context.lineWidth = 2;
            this.context.beginPath();
            (0, _waveThings.renderWave)({
                context: this.context,
                width: this.width,
                wave: this.partialWave,
                yPosition: top + sizeMultiple * curWavePos,
                yMultiple: sizeMultiple * spacingMultiplier,
                startXAmt: startXAmt
            });
            this.context.stroke();
        }
    }]);

    return WaveSplitController;
}(_canvasController2.default);

exports.default = WaveSplitController;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
       value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvasController = __webpack_require__(1);

var _canvasController2 = _interopRequireDefault(_canvasController);

var _util = __webpack_require__(0);

var _complexSinusoidController = __webpack_require__(7);

var _complexSinusoidController2 = _interopRequireDefault(_complexSinusoidController);

var _renderCube = __webpack_require__(8);

var _color = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SkewedSinusoidController = function (_CanvasController) {
       _inherits(SkewedSinusoidController, _CanvasController);

       function SkewedSinusoidController(id, width, height) {
              _classCallCheck(this, SkewedSinusoidController);

              var _this = _possibleConstructorReturn(this, (SkewedSinusoidController.__proto__ || Object.getPrototypeOf(SkewedSinusoidController)).call(this, id, width, height));

              _this.xzAngle = Math.PI / 4;
              _this.yAngle = -Math.PI / 6;

              _this.sinusoidController = new _complexSinusoidController2.default(id, width, height);
              _this.sinusoidController.xzAngleFn = function () {
                     return _this.xzAngle;
              };
              _this.sinusoidController.yAngleFn = function () {
                     return _this.yAngle;
              };
              return _this;
       }

       _createClass(SkewedSinusoidController, [{
              key: "update",
              value: function update(dt, mousePosition) {
                     this.sinusoidController.update(dt, mousePosition);

                     var pos = this.getScrollPosition();
                     var spinAmt = Math.PI / 8;
                     this.xzAngle = Math.PI / 4 + (0, _util.slurp)(-spinAmt, spinAmt, pos);
              }
       }, {
              key: "render",
              value: function render() {
                     this.clear();
                     this.sinusoidController.renderWave();

                     var halfHeight = this.sinusoidController.radius;
                     var halfWidth = 0.5 * this.sinusoidController.length;
                     var halfDepth = this.sinusoidController.radius;
                     this.context.lineWidth = 1;
                     this.context.strokeStyle = _color.palette.black;
                     (0, _renderCube.renderBoundingCube)(this.context, -halfWidth, halfWidth, -halfHeight, halfHeight, -halfDepth, halfDepth, this.xzAngle, this.yAngle);
              }
       }]);

       return SkewedSinusoidController;
}(_canvasController2.default);

exports.default = SkewedSinusoidController;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvasController = __webpack_require__(1);

var _canvasController2 = _interopRequireDefault(_canvasController);

var _util = __webpack_require__(0);

var _color = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WaveDrawController = function (_CanvasController) {
    _inherits(WaveDrawController, _CanvasController);

    function WaveDrawController(id, width, height) {
        _classCallCheck(this, WaveDrawController);

        // just a list
        var _this = _possibleConstructorReturn(this, (WaveDrawController.__proto__ || Object.getPrototypeOf(WaveDrawController)).call(this, id, width, height));

        _this.wavePoints = new Array(128).fill(_this.height / 2);

        _this.drawing = false;
        _this.onDrawingStart = [];
        _this.onDrawingEnd = [];
        _this.lastMousePoint = null;

        _this.canvas.addEventListener('mousedown', function () {
            return _this.startDrawing();
        });
        _this.canvas.addEventListener('touchstart', function () {
            return _this.startDrawing();
        });

        document.addEventListener('mouseup', function () {
            return _this.stopDrawing();
        });
        document.addEventListener('touchend', function () {
            return _this.stopDrawing();
        });

        // Prevent scrolling while we're drawing here
        _this.canvas.addEventListener('touchmove', function (evt) {
            return evt.preventDefault();
        }, { passive: false });
        return _this;
    }

    _createClass(WaveDrawController, [{
        key: "startDrawing",
        value: function startDrawing() {
            this.drawing = true;
            this.lastMousePoint = null;

            this.onDrawingStart.forEach(function (fn) {
                return fn();
            });
        }
    }, {
        key: "stopDrawing",
        value: function stopDrawing() {
            if (this.drawing) {
                this.drawing = false;
                this.lastMousePoint = null;

                this.onDrawingEnd.forEach(function (fn) {
                    return fn();
                });
            }
        }
    }, {
        key: "update",
        value: function update(dt, mousePosition) {
            if (!mousePosition || !this.drawing) {
                return;
            }

            var canvasPosition = this.canvas.getBoundingClientRect();
            // we have to account for the border here too
            var actualWidth = canvasPosition.right - canvasPosition.left - 2;
            // 500 being the 'default' width
            var scale = 500 / actualWidth;
            var mousePoint = {
                x: scale * (mousePosition.x - canvasPosition.x),
                y: scale * (mousePosition.y - canvasPosition.y)
            };
            if (this.lastMousePoint == null) {
                this.lastMousePoint = mousePoint;
            }

            var xDiff = Math.abs(mousePoint.x - this.lastMousePoint.x);
            var pointsGap = this.width / this.wavePoints.length;
            var lerpPoints = 2 * Math.ceil(xDiff / pointsGap) + 1;
            for (var i = 0; i < lerpPoints; i++) {
                var amt = (i - 1) / lerpPoints;

                var index = this.getNearestIndex((0, _util.slurp)(this.lastMousePoint.x, mousePoint.x, amt));
                this.wavePoints[index] = (0, _util.slurp)(this.lastMousePoint.y, mousePoint.y, amt);
            }

            this.lastMousePoint = mousePoint;
        }

        /**
         * Gets the nearest index in the wave array to the x coord on the screen
         * @param {Number} x 
         */

    }, {
        key: "getNearestIndex",
        value: function getNearestIndex(x) {
            var xAmt = x / this.width;
            var pos = Math.round(this.wavePoints.length * xAmt) % this.wavePoints.length;
            if (pos < 0) {
                pos += this.wavePoints.length;
            }
            return pos;
        }
    }, {
        key: "render",
        value: function render() {
            this.clear();

            this.renderWave();
        }
    }, {
        key: "renderWave",
        value: function renderWave() {
            this.context.beginPath();
            this.context.lineWidth = 2;
            this.context.strokeStyle = _color.palette.pink;
            for (var i = 0; i <= this.wavePoints.length; i++) {
                var index = i % this.wavePoints.length;
                var amt = i / this.wavePoints.length;

                var x = this.width * amt;
                var y = this.wavePoints[index];

                if (i == 0) {
                    this.context.moveTo(x, y);
                } else {
                    this.context.lineTo(x, y);
                }
            }
            this.context.stroke();
        }
    }, {
        key: "normPath",
        get: function get() {
            var _this2 = this;

            return this.wavePoints.map(function (el) {
                return el / _this2.height;
            });
        }
    }]);

    return WaveDrawController;
}(_canvasController2.default);

exports.default = WaveDrawController;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = __webpack_require__(0);

var _controller = __webpack_require__(4);

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RangeController = function (_Controller) {
    _inherits(RangeController, _Controller);

    function RangeController(id) {
        _classCallCheck(this, RangeController);

        var _this = _possibleConstructorReturn(this, (RangeController.__proto__ || Object.getPrototypeOf(RangeController)).call(this));

        _this.id = id;
        _this.slider = document.getElementById(id);

        _this.onValueChange = [];

        _this.holdValueCount = 0;
        /**
         * How long to pause on the value the person set before continuing
         */
        _this.holdValueLength = 10;
        _this.heldValue = 0;

        _this.resumeCount = 0;
        /**
         * Time to transition back to being controller automatically
         */
        _this.resumeLength = 2;

        _this.animate = true;
        _this.animAmt = 0;
        _this.period = 10;

        _this.slider.oninput = function () {
            return _this.holdValue();
        };
        return _this;
    }

    _createClass(RangeController, [{
        key: "update",
        value: function update(dt, mousePosition) {
            var _this2 = this;

            if (!this.animate) {
                return;
            }
            if (this.holdValueCount > 0) {
                this.holdValueCount -= dt;
                // Just set it back to zero to be clean about it.
                if (this.holdValueCount <= 0) {
                    this.holdValueCount = 0;
                }
                // we're going to return here so we don't mangle the value of the slider
                return;
            } else if (this.resumeCount > 0) {
                this.resumeCount -= dt;
                if (this.resumeCount <= 0) {
                    this.resumeCount = 0;
                }
            }

            // Goes from 0 to 1 as stuff resumes.
            var resumeAmt = 1 - this.resumeCount / this.resumeLength;
            var easedResumeAmt = (0, _util.easeInOut)(resumeAmt, 3);
            // Multiply by the resume amt to slow it down
            this.animAmt += easedResumeAmt * dt / this.period;
            this.animAmt %= 1;

            var sinePos = 0.5 * Math.cos(2 * Math.PI * this.animAmt) + 0.5;
            this.slider.value = sinePos;
            this.onValueChange.forEach(function (fn) {
                return fn(_this2.slider.value);
            });
        }
    }, {
        key: "holdValue",
        value: function holdValue() {
            var _this3 = this;

            this.holdValueCount = this.holdValueLength;
            this.resumeCount = this.resumeLength;
            this.heldValue = this.slider.value;
            // Calculate what the anim amt should be.
            this.animAmt = Math.acos(2 * this.heldValue - 1) / (2 * Math.PI);

            this.onValueChange.forEach(function (fn) {
                return fn(_this3.slider.value);
            });
        }
    }]);

    return RangeController;
}(_controller2.default);

exports.default = RangeController;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var peaceHandPoints = exports.peaceHandPoints = [{ x: 196.9, y: 228.8 }, { x: 196.7, y: 225.2 }, { x: 196.6, y: 221.6 }, { x: 196.3, y: 218.0 }, { x: 195.9, y: 214.3 }, { x: 195.5, y: 210.7 }, { x: 195.1, y: 207.1 }, { x: 194.7, y: 203.5 }, { x: 194.3, y: 199.9 }, { x: 194.3, y: 196.3 }, { x: 195.1, y: 192.7 }, { x: 196.7, y: 189.5 }, { x: 198.9, y: 186.6 }, { x: 201.7, y: 184.3 }, { x: 204.9, y: 182.6 }, { x: 208.4, y: 181.6 }, { x: 212.0, y: 181.3 }, { x: 215.6, y: 181.7 }, { x: 219.0, y: 182.9 }, { x: 221.9, y: 184.3 }, { x: 224.7, y: 186.6 }, { x: 226.9, y: 189.5 }, { x: 228.2, y: 192.0 }, { x: 227.8, y: 188.4 }, { x: 227.4, y: 184.7 }, { x: 227.0, y: 181.1 }, { x: 227.0, y: 177.5 }, { x: 227.9, y: 174.0 }, { x: 229.5, y: 170.7 }, { x: 231.7, y: 167.9 }, { x: 234.5, y: 165.5 }, { x: 237.6, y: 163.8 }, { x: 241.1, y: 162.8 }, { x: 244.8, y: 162.5 }, { x: 248.4, y: 162.9 }, { x: 251.8, y: 164.0 }, { x: 254.9, y: 165.8 }, { x: 257.6, y: 168.3 }, { x: 259.1, y: 169.3 }, { x: 258.4, y: 165.7 }, { x: 257.7, y: 162.2 }, { x: 257.1, y: 158.6 }, { x: 256.4, y: 155.0 }, { x: 255.7, y: 151.4 }, { x: 255.1, y: 147.9 }, { x: 254.4, y: 144.3 }, { x: 253.7, y: 140.7 }, { x: 253.1, y: 137.2 }, { x: 252.4, y: 133.6 }, { x: 251.8, y: 130.0 }, { x: 251.1, y: 126.5 }, { x: 250.4, y: 122.9 }, { x: 249.8, y: 119.3 }, { x: 249.1, y: 115.7 }, { x: 248.4, y: 112.2 }, { x: 247.8, y: 108.6 }, { x: 247.1, y: 105.0 }, { x: 246.4, y: 101.5 }, { x: 245.8, y: 97.9 }, { x: 245.7, y: 94.3 }, { x: 246.5, y: 90.7 }, { x: 248.1, y: 87.5 }, { x: 250.3, y: 84.6 }, { x: 253.1, y: 82.2 }, { x: 256.3, y: 80.5 }, { x: 259.7, y: 79.6 }, { x: 263.2, y: 79.2 }, { x: 265.9, y: 79.2 }, { x: 269.4, y: 80.1 }, { x: 272.6, y: 81.7 }, { x: 275.4, y: 84.1 }, { x: 277.6, y: 87.0 }, { x: 279.1, y: 90.2 }, { x: 280.1, y: 93.7 }, { x: 280.7, y: 97.3 }, { x: 281.4, y: 100.9 }, { x: 282.1, y: 104.4 }, { x: 282.8, y: 108.0 }, { x: 283.4, y: 111.6 }, { x: 284.1, y: 115.1 }, { x: 284.8, y: 118.7 }, { x: 285.5, y: 122.3 }, { x: 286.1, y: 125.8 }, { x: 286.8, y: 129.4 }, { x: 287.5, y: 133.0 }, { x: 288.2, y: 136.6 }, { x: 288.8, y: 140.1 }, { x: 289.5, y: 143.7 }, { x: 290.2, y: 147.3 }, { x: 290.9, y: 150.8 }, { x: 291.5, y: 154.4 }, { x: 292.2, y: 158.0 }, { x: 292.9, y: 161.5 }, { x: 293.6, y: 165.1 }, { x: 294.3, y: 168.7 }, { x: 294.9, y: 172.2 }, { x: 295.6, y: 175.8 }, { x: 296.3, y: 179.4 }, { x: 297.0, y: 182.9 }, { x: 297.6, y: 186.5 }, { x: 298.3, y: 190.1 }, { x: 299.1, y: 187.5 }, { x: 299.9, y: 184.0 }, { x: 300.8, y: 180.4 }, { x: 301.6, y: 176.9 }, { x: 302.4, y: 173.3 }, { x: 303.2, y: 169.8 }, { x: 304.1, y: 166.3 }, { x: 304.9, y: 162.7 }, { x: 305.7, y: 159.2 }, { x: 306.5, y: 155.7 }, { x: 307.3, y: 152.1 }, { x: 308.2, y: 148.6 }, { x: 309.0, y: 145.0 }, { x: 309.8, y: 141.5 }, { x: 310.6, y: 138.0 }, { x: 311.5, y: 134.4 }, { x: 312.3, y: 130.9 }, { x: 313.1, y: 127.4 }, { x: 313.9, y: 123.8 }, { x: 314.8, y: 120.3 }, { x: 315.6, y: 116.8 }, { x: 316.4, y: 113.2 }, { x: 317.2, y: 109.7 }, { x: 318.0, y: 106.1 }, { x: 318.9, y: 102.6 }, { x: 319.7, y: 99.1 }, { x: 320.5, y: 95.5 }, { x: 321.5, y: 92.0 }, { x: 323.1, y: 88.8 }, { x: 325.5, y: 86.1 }, { x: 328.4, y: 83.9 }, { x: 331.6, y: 82.3 }, { x: 335.2, y: 81.4 }, { x: 338.8, y: 81.2 }, { x: 342.4, y: 81.8 }, { x: 345.7, y: 83.1 }, { x: 348.7, y: 84.6 }, { x: 351.6, y: 86.9 }, { x: 353.8, y: 89.7 }, { x: 355.2, y: 93.1 }, { x: 355.7, y: 96.7 }, { x: 355.6, y: 100.3 }, { x: 354.9, y: 103.9 }, { x: 354.1, y: 107.4 }, { x: 353.3, y: 110.9 }, { x: 352.4, y: 114.5 }, { x: 351.6, y: 118.0 }, { x: 350.8, y: 121.5 }, { x: 350.0, y: 125.1 }, { x: 349.2, y: 128.6 }, { x: 348.3, y: 132.2 }, { x: 347.5, y: 135.7 }, { x: 346.7, y: 139.2 }, { x: 345.9, y: 142.8 }, { x: 345.0, y: 146.3 }, { x: 344.2, y: 149.8 }, { x: 343.4, y: 153.4 }, { x: 342.6, y: 156.9 }, { x: 341.8, y: 160.5 }, { x: 340.9, y: 164.0 }, { x: 340.1, y: 167.5 }, { x: 339.3, y: 171.1 }, { x: 338.5, y: 174.6 }, { x: 337.7, y: 178.1 }, { x: 336.8, y: 181.7 }, { x: 336.0, y: 185.2 }, { x: 335.2, y: 188.8 }, { x: 334.4, y: 192.3 }, { x: 333.5, y: 195.8 }, { x: 332.7, y: 199.4 }, { x: 331.9, y: 202.9 }, { x: 331.1, y: 206.4 }, { x: 332.7, y: 208.8 }, { x: 335.9, y: 210.6 }, { x: 338.9, y: 212.6 }, { x: 341.6, y: 215.0 }, { x: 343.8, y: 217.9 }, { x: 345.6, y: 221.1 }, { x: 347.0, y: 224.4 }, { x: 348.2, y: 227.8 }, { x: 349.2, y: 231.3 }, { x: 350.0, y: 234.9 }, { x: 350.7, y: 238.4 }, { x: 351.1, y: 242.0 }, { x: 351.4, y: 245.6 }, { x: 351.5, y: 249.3 }, { x: 351.3, y: 252.9 }, { x: 350.9, y: 256.5 }, { x: 350.2, y: 260.1 }, { x: 349.2, y: 263.6 }, { x: 348.0, y: 267.0 }, { x: 346.8, y: 270.4 }, { x: 345.4, y: 273.8 }, { x: 343.9, y: 277.1 }, { x: 342.5, y: 280.4 }, { x: 341.0, y: 283.7 }, { x: 339.4, y: 287.0 }, { x: 336.9, y: 289.5 }, { x: 334.7, y: 292.5 }, { x: 332.5, y: 295.3 }, { x: 330.1, y: 298.0 }, { x: 327.5, y: 300.6 }, { x: 324.8, y: 303.0 }, { x: 322.0, y: 305.3 }, { x: 319.1, y: 307.5 }, { x: 316.0, y: 309.4 }, { x: 312.9, y: 311.2 }, { x: 309.6, y: 312.9 }, { x: 306.3, y: 314.4 }, { x: 302.9, y: 315.7 }, { x: 299.5, y: 316.8 }, { x: 296.0, y: 317.8 }, { x: 292.5, y: 318.7 }, { x: 288.9, y: 319.4 }, { x: 285.3, y: 320.0 }, { x: 281.7, y: 320.4 }, { x: 278.1, y: 320.7 }, { x: 274.5, y: 320.9 }, { x: 270.8, y: 321.0 }, { x: 267.2, y: 320.8 }, { x: 263.6, y: 320.6 }, { x: 260.0, y: 320.2 }, { x: 256.4, y: 319.6 }, { x: 252.8, y: 318.8 }, { x: 249.3, y: 318.0 }, { x: 245.8, y: 316.9 }, { x: 242.4, y: 315.7 }, { x: 239.0, y: 314.4 }, { x: 235.7, y: 312.9 }, { x: 232.5, y: 311.3 }, { x: 229.3, y: 309.5 }, { x: 226.3, y: 307.5 }, { x: 223.3, y: 305.4 }, { x: 220.6, y: 303.0 }, { x: 217.9, y: 300.5 }, { x: 215.5, y: 297.8 }, { x: 213.3, y: 294.9 }, { x: 211.3, y: 291.9 }, { x: 209.5, y: 288.7 }, { x: 207.9, y: 285.5 }, { x: 206.5, y: 282.1 }, { x: 205.2, y: 278.8 }, { x: 204.0, y: 275.3 }, { x: 202.9, y: 271.9 }, { x: 202.0, y: 268.4 }, { x: 201.1, y: 264.8 }, { x: 200.3, y: 261.3 }, { x: 199.6, y: 257.7 }, { x: 199.0, y: 254.1 }, { x: 198.4, y: 250.6 }, { x: 198.0, y: 247.0 }, { x: 197.6, y: 243.3 }, { x: 197.4, y: 239.7 }, { x: 197.3, y: 236.1 }, { x: 197.1, y: 232.5 }];

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvasController = __webpack_require__(1);

var _canvasController2 = _interopRequireDefault(_canvasController);

var _util = __webpack_require__(0);

var _renderCube = __webpack_require__(8);

var _color = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SkewedPathController = function (_CanvasController) {
    _inherits(SkewedPathController, _CanvasController);

    function SkewedPathController(id, width, height) {
        _classCallCheck(this, SkewedPathController);

        // Somehow in creating this it became backwards from what I was thinking so I just flipped the angle
        var _this = _possibleConstructorReturn(this, (SkewedPathController.__proto__ || Object.getPrototypeOf(SkewedPathController)).call(this, id, width, height));

        _this.xzAngle = -3 * Math.PI / 4;
        _this.yAngle = -Math.PI / 6;

        _this.path = [];
        _this.length = 0.7 * _this.width;
        _this.minX = -0.5 * _this.length;
        _this.maxX = 0.5 * _this.length;
        _this.minY = 0;
        _this.maxY = 0;
        _this.minZ = 0;
        _this.maxZ = 0;

        _this.animAmt = 0;
        _this.period = 4;
        return _this;
    }

    _createClass(SkewedPathController, [{
        key: "setPath",
        value: function setPath(path) {
            var _this2 = this;

            this.path = path.map(function (p) {
                return { x: p.x - _this2.width / 2, y: p.y - _this2.height / 2 };
            });
            this.minY = Math.min.apply(Math, _toConsumableArray(this.path.map(function (p) {
                return p.y;
            })));
            this.maxY = Math.max.apply(Math, _toConsumableArray(this.path.map(function (p) {
                return p.y;
            })));
            this.minZ = Math.min.apply(Math, _toConsumableArray(this.path.map(function (p) {
                return p.x;
            })));
            this.maxZ = Math.max.apply(Math, _toConsumableArray(this.path.map(function (p) {
                return p.x;
            })));
        }
    }, {
        key: "update",
        value: function update(dt, mousePosition) {
            this.animAmt += dt / this.period;
            this.animAmt %= 1;

            var pos = this.getScrollPosition();
            var spinAmt = Math.PI / 8;
            this.xzAngle = -0.75 * Math.PI + (0, _util.slurp)(-spinAmt, spinAmt, pos);
        }
    }, {
        key: "render",
        value: function render() {
            this.clear();
            // Render points
            this.context.translate(this.context.canvas.width / 2, this.context.canvas.height / 2);

            this.context.strokeStyle = _color.palette.blue;
            this.context.lineWidth = 2;
            this.renderPath(this.minX, this.maxX);

            this.context.globalAlpha = 0.2;
            this.context.strokeStyle = _color.palette.blue;
            this.context.lineWidth = 2;
            this.renderPath(this.maxX, this.maxX);
            this.context.globalAlpha = 1;

            // Gimme that bounding box
            this.context.lineWidth = 1;
            this.context.strokeStyle = _color.palette.black;
            (0, _renderCube.renderBoundingCube)(this.context, this.minX, this.maxX, this.minY, this.maxY, this.minZ, this.maxZ, this.xzAngle, this.yAngle);
        }
    }, {
        key: "renderPath",
        value: function renderPath(minX, maxX) {
            var startXAmt = -this.animAmt;
            var startI = 0;
            // The wavelength relative to the bounding box can be configured by the constant here.
            var step = 0.5 / this.path.length;
            while (startXAmt < 0) {
                startXAmt += step;
                startI++;
            }

            this.context.beginPath();
            for (var xAmt = startXAmt, i = startI; xAmt <= 1 + step; xAmt += step, i++) {
                var index = i % this.path.length;

                var x = (0, _util.slurp)(minX, maxX, xAmt);
                var pathPoint = this.path[index];
                var screenPoint = (0, _util.to2dIsometric)(x, pathPoint.y, pathPoint.x, this.xzAngle, this.yAngle);

                if (i == 0) {
                    this.context.moveTo(screenPoint.x, screenPoint.y);
                } else {
                    this.context.lineTo(screenPoint.x, screenPoint.y);
                }
            }
            this.context.stroke();
        }
    }]);

    return SkewedPathController;
}(_canvasController2.default);

exports.default = SkewedPathController;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var mePoints = exports.mePoints = [{ "x": 114, "y": 210.25 }, { "x": 122, "y": 208.25 }, { "x": 130, "y": 206.25 }, { "x": 138, "y": 206.25 }, { "x": 146, "y": 206.25 }, { "x": 154, "y": 202.25 }, { "x": 164, "y": 202.25 }, { "x": 174, "y": 204.25 }, { "x": 182, "y": 206.25 }, { "x": 188, "y": 208.25 }, { "x": 194, "y": 210.25 }, { "x": 200, "y": 212.25 }, { "x": 206, "y": 216.25 }, { "x": 210, "y": 222.25 }, { "x": 212, "y": 228.25 }, { "x": 214, "y": 234.25 }, { "x": 216, "y": 240.25 }, { "x": 216, "y": 248.25 }, { "x": 216, "y": 240.25 }, { "x": 212, "y": 234.25 }, { "x": 206, "y": 230.25 }, { "x": 200, "y": 228.25 }, { "x": 194, "y": 226.25 }, { "x": 186, "y": 226.25 }, { "x": 180, "y": 228.25 }, { "x": 174, "y": 234.25 }, { "x": 170, "y": 240.25 }, { "x": 170, "y": 250.25 }, { "x": 170, "y": 258.25 }, { "x": 172, "y": 264.25 }, { "x": 178, "y": 270.25 }, { "x": 184, "y": 268.25 }, { "x": 188, "y": 262.25 }, { "x": 190, "y": 256.25 }, { "x": 192, "y": 250.25 }, { "x": 190, "y": 242.25 }, { "x": 186, "y": 236.25 }, { "x": 180, "y": 234.25 }, { "x": 172, "y": 234.25 }, { "x": 164, "y": 234.25 }, { "x": 158, "y": 236.25 }, { "x": 150, "y": 238.25 }, { "x": 144, "y": 242.25 }, { "x": 140, "y": 248.25 }, { "x": 144, "y": 242.25 }, { "x": 150, "y": 240.25 }, { "x": 156, "y": 234.25 }, { "x": 162, "y": 232.25 }, { "x": 168, "y": 228.25 }, { "x": 174, "y": 226.25 }, { "x": 180, "y": 224.25 }, { "x": 186, "y": 220.25 }, { "x": 192, "y": 218.25 }, { "x": 198, "y": 216.25 }, { "x": 206, "y": 216.25 }, { "x": 214, "y": 218.25 }, { "x": 216, "y": 224.25 }, { "x": 222, "y": 226.25 }, { "x": 230, "y": 226.25 }, { "x": 238, "y": 226.25 }, { "x": 246, "y": 226.25 }, { "x": 254, "y": 226.25 }, { "x": 260, "y": 224.25 }, { "x": 266, "y": 220.25 }, { "x": 272, "y": 216.25 }, { "x": 278, "y": 214.25 }, { "x": 284, "y": 212.25 }, { "x": 290, "y": 208.25 }, { "x": 296, "y": 206.25 }, { "x": 304, "y": 206.25 }, { "x": 312, "y": 206.25 }, { "x": 320, "y": 206.25 }, { "x": 326, "y": 208.25 }, { "x": 332, "y": 212.25 }, { "x": 336, "y": 218.25 }, { "x": 340, "y": 224.25 }, { "x": 344, "y": 230.25 }, { "x": 344, "y": 238.25 }, { "x": 342, "y": 230.25 }, { "x": 340, "y": 224.25 }, { "x": 334, "y": 220.25 }, { "x": 328, "y": 216.25 }, { "x": 320, "y": 216.25 }, { "x": 314, "y": 220.25 }, { "x": 310, "y": 226.25 }, { "x": 306, "y": 234.25 }, { "x": 306, "y": 242.25 }, { "x": 306, "y": 250.25 }, { "x": 308, "y": 256.25 }, { "x": 316, "y": 256.25 }, { "x": 320, "y": 250.25 }, { "x": 322, "y": 242.25 }, { "x": 322, "y": 234.25 }, { "x": 322, "y": 226.25 }, { "x": 320, "y": 220.25 }, { "x": 314, "y": 218.25 }, { "x": 306, "y": 218.25 }, { "x": 300, "y": 222.25 }, { "x": 294, "y": 226.25 }, { "x": 288, "y": 230.25 }, { "x": 282, "y": 236.25 }, { "x": 280, "y": 242.25 }, { "x": 286, "y": 238.25 }, { "x": 292, "y": 232.25 }, { "x": 296, "y": 226.25 }, { "x": 300, "y": 220.25 }, { "x": 306, "y": 218.25 }, { "x": 314, "y": 214.25 }, { "x": 320, "y": 210.25 }, { "x": 326, "y": 208.25 }, { "x": 334, "y": 208.25 }, { "x": 342, "y": 208.25 }, { "x": 350, "y": 208.25 }, { "x": 356, "y": 210.25 }, { "x": 362, "y": 212.25 }, { "x": 362, "y": 220.25 }, { "x": 362, "y": 228.25 }, { "x": 360, "y": 234.25 }, { "x": 358, "y": 240.25 }, { "x": 356, "y": 246.25 }, { "x": 354, "y": 252.25 }, { "x": 352, "y": 258.25 }, { "x": 350, "y": 264.25 }, { "x": 348, "y": 270.25 }, { "x": 344, "y": 276.25 }, { "x": 338, "y": 280.25 }, { "x": 332, "y": 282.25 }, { "x": 326, "y": 284.25 }, { "x": 320, "y": 286.25 }, { "x": 312, "y": 286.25 }, { "x": 304, "y": 286.25 }, { "x": 296, "y": 286.25 }, { "x": 288, "y": 286.25 }, { "x": 282, "y": 284.25 }, { "x": 276, "y": 278.25 }, { "x": 272, "y": 272.25 }, { "x": 266, "y": 268.25 }, { "x": 264, "y": 262.25 }, { "x": 262, "y": 254.25 }, { "x": 262, "y": 246.25 }, { "x": 258, "y": 240.25 }, { "x": 252, "y": 236.25 }, { "x": 250, "y": 242.25 }, { "x": 250, "y": 250.25 }, { "x": 250, "y": 258.25 }, { "x": 250, "y": 266.25 }, { "x": 250, "y": 274.25 }, { "x": 252, "y": 280.25 }, { "x": 258, "y": 282.25 }, { "x": 260, "y": 288.25 }, { "x": 262, "y": 294.25 }, { "x": 264, "y": 300.25 }, { "x": 264, "y": 308.25 }, { "x": 264, "y": 316.25 }, { "x": 262, "y": 322.25 }, { "x": 254, "y": 322.25 }, { "x": 254, "y": 330.25 }, { "x": 254, "y": 338.25 }, { "x": 252, "y": 344.25 }, { "x": 250, "y": 350.25 }, { "x": 258, "y": 352.25 }, { "x": 266, "y": 352.25 }, { "x": 274, "y": 352.25 }, { "x": 282, "y": 352.25 }, { "x": 288, "y": 350.25 }, { "x": 294, "y": 352.25 }, { "x": 302, "y": 352.25 }, { "x": 300, "y": 358.25 }, { "x": 294, "y": 360.25 }, { "x": 288, "y": 362.25 }, { "x": 282, "y": 364.25 }, { "x": 274, "y": 364.25 }, { "x": 266, "y": 364.25 }, { "x": 258, "y": 364.25 }, { "x": 250, "y": 364.25 }, { "x": 242, "y": 364.25 }, { "x": 234, "y": 364.25 }, { "x": 226, "y": 364.25 }, { "x": 218, "y": 364.25 }, { "x": 212, "y": 362.25 }, { "x": 206, "y": 360.25 }, { "x": 200, "y": 358.25 }, { "x": 198, "y": 352.25 }, { "x": 206, "y": 352.25 }, { "x": 214, "y": 352.25 }, { "x": 222, "y": 354.25 }, { "x": 230, "y": 354.25 }, { "x": 238, "y": 354.25 }, { "x": 246, "y": 354.25 }, { "x": 252, "y": 352.25 }, { "x": 252, "y": 344.25 }, { "x": 252, "y": 336.25 }, { "x": 252, "y": 328.25 }, { "x": 250, "y": 322.25 }, { "x": 244, "y": 324.25 }, { "x": 238, "y": 320.25 }, { "x": 236, "y": 314.25 }, { "x": 234, "y": 308.25 }, { "x": 234, "y": 300.25 }, { "x": 238, "y": 294.25 }, { "x": 242, "y": 288.25 }, { "x": 246, "y": 282.25 }, { "x": 248, "y": 276.25 }, { "x": 248, "y": 268.25 }, { "x": 248, "y": 260.25 }, { "x": 248, "y": 252.25 }, { "x": 248, "y": 244.25 }, { "x": 242, "y": 242.25 }, { "x": 236, "y": 240.25 }, { "x": 230, "y": 236.25 }, { "x": 224, "y": 232.25 }, { "x": 224, "y": 242.25 }, { "x": 222, "y": 248.25 }, { "x": 220, "y": 254.25 }, { "x": 218, "y": 262.25 }, { "x": 216, "y": 268.25 }, { "x": 212, "y": 274.25 }, { "x": 206, "y": 280.25 }, { "x": 202, "y": 286.25 }, { "x": 196, "y": 290.25 }, { "x": 190, "y": 292.25 }, { "x": 184, "y": 294.25 }, { "x": 178, "y": 296.25 }, { "x": 170, "y": 296.25 }, { "x": 162, "y": 296.25 }, { "x": 154, "y": 296.25 }, { "x": 148, "y": 292.25 }, { "x": 142, "y": 286.25 }, { "x": 136, "y": 282.25 }, { "x": 132, "y": 276.25 }, { "x": 128, "y": 270.25 }, { "x": 124, "y": 264.25 }, { "x": 122, "y": 258.25 }, { "x": 122, "y": 250.25 }, { "x": 120, "y": 244.25 }, { "x": 118, "y": 238.25 }, { "x": 118, "y": 230.25 }, { "x": 118, "y": 222.25 }, { "x": 124, "y": 218.25 }, { "x": 130, "y": 214.25 }, { "x": 136, "y": 210.25 }, { "x": 142, "y": 208.25 }, { "x": 150, "y": 208.25 }, { "x": 156, "y": 206.25 }, { "x": 174, "y": 204.25 }, { "x": 182, "y": 204.25 }, { "x": 190, "y": 202.25 }, { "x": 196, "y": 200.25 }, { "x": 202, "y": 198.25 }, { "x": 210, "y": 198.25 }, { "x": 218, "y": 198.25 }, { "x": 224, "y": 196.25 }, { "x": 232, "y": 196.25 }, { "x": 240, "y": 196.25 }, { "x": 248, "y": 196.25 }, { "x": 256, "y": 196.25 }, { "x": 264, "y": 196.25 }, { "x": 270, "y": 198.25 }, { "x": 276, "y": 200.25 }, { "x": 284, "y": 200.25 }, { "x": 290, "y": 204.25 }, { "x": 298, "y": 204.25 }, { "x": 304, "y": 206.25 }, { "x": 310, "y": 204.25 }, { "x": 318, "y": 204.25 }, { "x": 326, "y": 204.25 }, { "x": 332, "y": 206.25 }, { "x": 340, "y": 206.25 }, { "x": 346, "y": 208.25 }, { "x": 354, "y": 208.25 }, { "x": 360, "y": 210.25 }, { "x": 366, "y": 220.25 }, { "x": 374, "y": 220.25 }, { "x": 380, "y": 222.25 }, { "x": 386, "y": 224.25 }, { "x": 388, "y": 230.25 }, { "x": 388, "y": 238.25 }, { "x": 388, "y": 246.25 }, { "x": 388, "y": 254.25 }, { "x": 386, "y": 260.25 }, { "x": 382, "y": 266.25 }, { "x": 378, "y": 272.25 }, { "x": 372, "y": 276.25 }, { "x": 368, "y": 282.25 }, { "x": 362, "y": 284.25 }, { "x": 358, "y": 290.25 }, { "x": 352, "y": 292.25 }, { "x": 350, "y": 300.25 }, { "x": 350, "y": 308.25 }, { "x": 348, "y": 314.25 }, { "x": 346, "y": 320.25 }, { "x": 344, "y": 328.25 }, { "x": 344, "y": 338.25 }, { "x": 344, "y": 346.25 }, { "x": 342, "y": 354.25 }, { "x": 342, "y": 362.25 }, { "x": 342, "y": 370.25 }, { "x": 340, "y": 378.25 }, { "x": 334, "y": 382.25 }, { "x": 328, "y": 386.25 }, { "x": 322, "y": 392.25 }, { "x": 316, "y": 398.25 }, { "x": 310, "y": 402.25 }, { "x": 304, "y": 406.25 }, { "x": 298, "y": 408.25 }, { "x": 292, "y": 410.25 }, { "x": 286, "y": 412.25 }, { "x": 280, "y": 416.25 }, { "x": 274, "y": 422.25 }, { "x": 268, "y": 424.25 }, { "x": 262, "y": 428.25 }, { "x": 256, "y": 430.25 }, { "x": 246, "y": 430.25 }, { "x": 238, "y": 430.25 }, { "x": 232, "y": 428.25 }, { "x": 226, "y": 426.25 }, { "x": 220, "y": 424.25 }, { "x": 214, "y": 418.25 }, { "x": 208, "y": 416.25 }, { "x": 200, "y": 412.25 }, { "x": 194, "y": 408.25 }, { "x": 188, "y": 406.25 }, { "x": 182, "y": 402.25 }, { "x": 176, "y": 396.25 }, { "x": 170, "y": 392.25 }, { "x": 164, "y": 388.25 }, { "x": 158, "y": 384.25 }, { "x": 154, "y": 378.25 }, { "x": 148, "y": 374.25 }, { "x": 142, "y": 372.25 }, { "x": 136, "y": 368.25 }, { "x": 134, "y": 362.25 }, { "x": 134, "y": 354.25 }, { "x": 134, "y": 346.25 }, { "x": 134, "y": 338.25 }, { "x": 134, "y": 330.25 }, { "x": 134, "y": 322.25 }, { "x": 132, "y": 316.25 }, { "x": 132, "y": 308.25 }, { "x": 132, "y": 300.25 }, { "x": 132, "y": 292.25 }, { "x": 132, "y": 284.25 }, { "x": 130, "y": 278.25 }, { "x": 132, "y": 284.25 }, { "x": 118, "y": 284.25 }, { "x": 112, "y": 282.25 }, { "x": 106, "y": 278.25 }, { "x": 104, "y": 272.25 }, { "x": 102, "y": 266.25 }, { "x": 98, "y": 258.25 }, { "x": 98, "y": 250.25 }, { "x": 98, "y": 242.25 }, { "x": 100, "y": 236.25 }, { "x": 104, "y": 230.25 }, { "x": 110, "y": 226.25 }, { "x": 116, "y": 224.25 }, { "x": 114, "y": 232.25 }, { "x": 108, "y": 236.25 }, { "x": 102, "y": 242.25 }, { "x": 96, "y": 248.25 }, { "x": 90, "y": 254.25 }, { "x": 86, "y": 260.25 }, { "x": 88, "y": 254.25 }, { "x": 90, "y": 248.25 }, { "x": 94, "y": 242.25 }, { "x": 96, "y": 234.25 }, { "x": 88, "y": 238.25 }, { "x": 82, "y": 240.25 }, { "x": 76, "y": 242.25 }, { "x": 70, "y": 244.25 }, { "x": 64, "y": 246.25 }, { "x": 62, "y": 240.25 }, { "x": 68, "y": 236.25 }, { "x": 74, "y": 232.25 }, { "x": 80, "y": 228.25 }, { "x": 86, "y": 224.25 }, { "x": 92, "y": 220.25 }, { "x": 98, "y": 218.25 }, { "x": 106, "y": 214.25 }, { "x": 100, "y": 212.25 }, { "x": 94, "y": 210.25 }, { "x": 88, "y": 202.25 }, { "x": 82, "y": 194.25 }, { "x": 80, "y": 188.25 }, { "x": 82, "y": 180.25 }, { "x": 88, "y": 174.25 }, { "x": 94, "y": 172.25 }, { "x": 100, "y": 170.25 }, { "x": 108, "y": 170.25 }, { "x": 116, "y": 170.25 }, { "x": 122, "y": 172.25 }, { "x": 122, "y": 162.25 }, { "x": 126, "y": 154.25 }, { "x": 128, "y": 148.25 }, { "x": 134, "y": 142.25 }, { "x": 136, "y": 136.25 }, { "x": 140, "y": 130.25 }, { "x": 146, "y": 124.25 }, { "x": 150, "y": 118.25 }, { "x": 154, "y": 112.25 }, { "x": 160, "y": 108.25 }, { "x": 168, "y": 102.25 }, { "x": 176, "y": 96.25 }, { "x": 182, "y": 92.25 }, { "x": 188, "y": 88.25 }, { "x": 198, "y": 86.25 }, { "x": 208, "y": 84.25 }, { "x": 216, "y": 84.25 }, { "x": 226, "y": 84.25 }, { "x": 236, "y": 84.25 }, { "x": 246, "y": 84.25 }, { "x": 254, "y": 84.25 }, { "x": 262, "y": 84.25 }, { "x": 270, "y": 84.25 }, { "x": 280, "y": 84.25 }, { "x": 290, "y": 84.25 }, { "x": 298, "y": 86.25 }, { "x": 304, "y": 88.25 }, { "x": 310, "y": 90.25 }, { "x": 316, "y": 96.25 }, { "x": 320, "y": 102.25 }, { "x": 328, "y": 108.25 }, { "x": 334, "y": 114.25 }, { "x": 340, "y": 122.25 }, { "x": 346, "y": 128.25 }, { "x": 352, "y": 136.25 }, { "x": 358, "y": 144.25 }, { "x": 360, "y": 150.25 }, { "x": 362, "y": 156.25 }, { "x": 366, "y": 162.25 }, { "x": 368, "y": 168.25 }, { "x": 370, "y": 174.25 }, { "x": 372, "y": 180.25 }, { "x": 372, "y": 188.25 }, { "x": 372, "y": 196.25 }, { "x": 372, "y": 204.25 }, { "x": 366, "y": 210.25 }, { "x": 364, "y": 198.25 }, { "x": 362, "y": 192.25 }, { "x": 358, "y": 186.25 }, { "x": 356, "y": 180.25 }, { "x": 352, "y": 174.25 }, { "x": 346, "y": 170.25 }, { "x": 340, "y": 162.25 }, { "x": 336, "y": 156.25 }, { "x": 330, "y": 150.25 }, { "x": 326, "y": 144.25 }, { "x": 320, "y": 140.25 }, { "x": 314, "y": 138.25 }, { "x": 308, "y": 136.25 }, { "x": 300, "y": 134.25 }, { "x": 290, "y": 132.25 }, { "x": 284, "y": 130.25 }, { "x": 278, "y": 128.25 }, { "x": 270, "y": 128.25 }, { "x": 262, "y": 128.25 }, { "x": 254, "y": 128.25 }, { "x": 246, "y": 128.25 }, { "x": 236, "y": 130.25 }, { "x": 226, "y": 132.25 }, { "x": 218, "y": 132.25 }, { "x": 210, "y": 132.25 }, { "x": 198, "y": 132.25 }, { "x": 192, "y": 134.25 }, { "x": 188, "y": 140.25 }, { "x": 182, "y": 144.25 }, { "x": 176, "y": 150.25 }, { "x": 168, "y": 156.25 }, { "x": 162, "y": 160.25 }, { "x": 156, "y": 162.25 }, { "x": 152, "y": 168.25 }, { "x": 146, "y": 172.25 }, { "x": 140, "y": 178.25 }, { "x": 134, "y": 182.25 }, { "x": 128, "y": 186.25 }, { "x": 124, "y": 192.25 }, { "x": 120, "y": 198.25 }, { "x": 118, "y": 204.25 }, { "x": 114, "y": 210.25 }, { "x": 112, "y": 218.25 }];

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jpeg = __webpack_require__(10);

var _controller = __webpack_require__(4);

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ImageBuildUpController = function (_Controller) {
    _inherits(ImageBuildUpController, _Controller);

    function ImageBuildUpController(id, imageSwapController) {
        _classCallCheck(this, ImageBuildUpController);

        var _this = _possibleConstructorReturn(this, (ImageBuildUpController.__proto__ || Object.getPrototypeOf(ImageBuildUpController)).call(this));

        _this.container = document.getElementById(id);
        _this.swapController = imageSwapController;
        return _this;
    }

    _createClass(ImageBuildUpController, [{
        key: "update",
        value: function update() {
            var jpegRange = (0, _jpeg.loopLikeAJpeg)(8);
            for (var i = 0; i < this.container.children.length; i++) {
                var _jpegRange$i = _slicedToArray(jpegRange[i], 2),
                    y = _jpegRange$i[0],
                    x = _jpegRange$i[1];

                var index = 8 * y + x;
                var component = this.container.children[index];
                if (i <= this.swapController.index) {
                    component.classList.remove('hidden');
                } else {
                    component.classList.add('hidden');
                }
            }
        }
    }]);

    return ImageBuildUpController;
}(_controller2.default);

exports.default = ImageBuildUpController;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _controllerUtil = __webpack_require__(5);

var _util = __webpack_require__(0);

var _browserImageCompression = __webpack_require__(34);

var _browserImageCompression2 = _interopRequireDefault(_browserImageCompression);

var _controller = __webpack_require__(4);

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var originalImageSrc = "img/cat.png";

var JpegCompressorController = function (_Controller) {
    _inherits(JpegCompressorController, _Controller);

    function JpegCompressorController(id) {
        _classCallCheck(this, JpegCompressorController);

        var _this = _possibleConstructorReturn(this, (JpegCompressorController.__proto__ || Object.getPrototypeOf(JpegCompressorController)).call(this));

        _this.id = id;
        _this.imageSrcs = [];

        var div = document.getElementById(id);
        _this.img = div.getElementsByTagName('img')[0];

        _this.baseImage = null;
        _this.canvas = null;
        _this.context = null;

        // TODO: Just write my own loadImage function instead of using this library.
        _browserImageCompression2.default.loadImage(originalImageSrc).then(function (img) {
            _this.baseImage = img;
            _this.canvas = document.createElement('canvas');
            _this.canvas.width = img.width;
            _this.canvas.height = img.height;
            _this.context = _this.canvas.getContext('2d');
        });
        return _this;
    }

    _createClass(JpegCompressorController, [{
        key: "update",
        value: function update() {
            if (!this.baseImage) {
                return;
            }
            var pos = 1 - (0, _controllerUtil.getScrollPosition)(this.img);
            var posAmt = (0, _util.clamp)((0, _util.divideInterval)(pos, 0.4, 0.7), 0, 1);
            posAmt *= posAmt;

            this.context.drawImage(this.baseImage, 0, 0);
            var dataUrl = this.canvas.toDataURL('image/jpeg', posAmt);
            this.img.src = dataUrl;
        }
    }, {
        key: "isOnScreen",
        value: function isOnScreen() {
            return (0, _controllerUtil.elementInView)(this.img);
        }
    }]);

    return JpegCompressorController;
}(_controller2.default);

exports.default = JpegCompressorController;

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
function getDataUrlFromFile(t){return new Promise(function(e,n){var r=new FileReader;r.readAsDataURL(t),r.onload=function(){e(r.result)},r.onerror=n})}function getFilefromDataUrl(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Date.now();return new Promise(function(r){for(var i=t.split(","),a=i[0].match(/:(.*?);/)[1],o=atob(i[1]),h=o.length,l=new Uint8Array(h);h--;)l[h]=o.charCodeAt(h);var u=void 0;try{u=new File([l],e,{type:a})}catch(t){(u=new Blob([l],{type:a})).name=e,u.lastModified=n}r(u)})}function loadImage(t){return new Promise(function(e,n){var r=new Image;r.onload=function(){e(r)},r.onerror=n,r.src=t})}function drawImageInCanvas(t,e){var n=document.createElement("canvas"),r=n.getContext("2d");return Number.isInteger(e)&&(t.width>e||t.height>e)?t.width>t.height?(n.width=e,n.height=t.height/t.width*e):(n.width=t.width/t.height*e,n.height=e):(n.width=t.width,n.height=t.height),r.drawImage(t,0,0,n.width,n.height),n}function imageCompression(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:Number.POSITIVE_INFINITY,n=arguments[2];return new Promise(function(r,i){var a,o,h,l,u,d=void 0,c=void 0,s=void 0;return t instanceof Blob||t instanceof File?/^image/.test(t.type)?(d=5,a=1024*e*1024,getDataUrlFromFile(t).then(function(e){try{return o=e,loadImage(o).then(function(e){try{return h=e,l=drawImageInCanvas(h,n),c=.9,getFilefromDataUrl(l.toDataURL(t.type,c),t.name,t.lastModified).then(function(e){try{var n=function(){return r(s)};if(s=e,"image/png"===t.type){var o,g=function e(){if(d--&&s.size>a){var n=void 0;return l.width*=.9,l.height*=.9,(u=l.getContext("2d")).drawImage(h,0,0,l.width,l.height),n=l.toDataURL(t.type,c),getFilefromDataUrl(n,t.name,t.lastModified).then(function(t){try{return s=t,e}catch(t){return i(t)}}.bind(this),i)}return[1]},f=function(){return n.call(this)};return(o=function(t){for(;t;){if(t.then)return void t.then(o,i);try{if(t.pop){if(t.length)return t.pop()?f.call(this):t;t=g}else t=t.call(this)}catch(t){return i(t)}}}.bind(this))(g)}var m,v=function e(){if(d--&&s.size>a){var n=void 0;return c*=.9,n=l.toDataURL(t.type,c),getFilefromDataUrl(n,t.name,t.lastModified).then(function(t){try{return s=t,e}catch(t){return i(t)}}.bind(this),i)}return[1]},w=function(){return n.call(this)};return(m=function(t){for(;t;){if(t.then)return void t.then(m,i);try{if(t.pop){if(t.length)return t.pop()?w.call(this):t;t=v}else t=t.call(this)}catch(t){return i(t)}}}.bind(this))(v)}catch(t){return i(t)}}.bind(this),i)}catch(t){return i(t)}}.bind(this),i)}catch(t){return i(t)}}.bind(this),i)):i(new Error("The file given is not an image")):i(new Error("The file given is not an instance of Blob or File"))}.bind(this))}imageCompression.drawImageInCanvas=drawImageInCanvas,imageCompression.getDataUrlFromFile=getDataUrlFromFile,imageCompression.getFilefromDataUrl=getFilefromDataUrl,imageCompression.loadImage=loadImage;/* harmony default export */ __webpack_exports__["default"] = (imageCompression);
//# sourceMappingURL=browser-image-compression.mjs.map


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvasController = __webpack_require__(1);

var _canvasController2 = _interopRequireDefault(_canvasController);

var _color = __webpack_require__(2);

var _waveThings = __webpack_require__(3);

var _util = __webpack_require__(0);

var _renderLabel2 = __webpack_require__(12);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WaveSamplesController = function (_CanvasController) {
    _inherits(WaveSamplesController, _CanvasController);

    function WaveSamplesController(id, width, height) {
        _classCallCheck(this, WaveSamplesController);

        var _this = _possibleConstructorReturn(this, (WaveSamplesController.__proto__ || Object.getPrototypeOf(WaveSamplesController)).call(this, id, width, height));

        _this.wave = new Array(128).fill(0);

        _this.sampleAmt = 0;
        _this.waveShiftAmt = 0;

        _this.yPos = _this.height / 2;
        _this.yMultiple = _this.height / 4;
        return _this;
    }

    /**
     * @param {Array<number>} wave 
     */


    _createClass(WaveSamplesController, [{
        key: "setWave",
        value: function setWave(wave) {
            // lets filter a lot of the samples to make it easier to debug
            // ? maybe just do this to make it easier to see?
            this.wave = wave.filter(function (v, i) {
                return i % 4 === 0;
            });
            // normalise this bad boi
            this.wave = (0, _waveThings.normaliseWave)(this.wave);
        }
    }, {
        key: "update",
        value: function update(dt, mousePosition) {
            var pos = 1 - this.getScrollPosition();
            this.sampleAmt = (0, _util.divideInterval)(pos, 0.2, 0.6);
            this.waveShiftAmt = (0, _util.slurp)(0.1, -0.1, pos);
        }
    }, {
        key: "render",
        value: function render() {
            this.clear();

            if (this.wave == null) {
                return;
            }

            this.renderWave();
            this.renderLabel();
        }
    }, {
        key: "renderWave",
        value: function renderWave() {
            this.context.beginPath();
            this.context.lineWidth = 1;
            this.context.strokeStyle = _color.palette.blue;
            this.context.fillStyle = _color.palette.blue;
            this.context.globalAlpha = 0.5;
            // Render the line...
            (0, _waveThings.renderWave)({
                context: this.context,
                width: this.width,
                wave: this.wave,
                startXAmt: this.waveShiftAmt - 1,
                yPosition: this.yPos,
                yMultiple: this.yMultiple,
                type: 'wave'
            });
            this.context.stroke();

            this.context.globalAlpha = 1;
            // Then render the samples
            (0, _waveThings.renderWave)({
                context: this.context,
                width: this.width,
                wave: this.wave,
                startXAmt: this.waveShiftAmt - 1,
                yPosition: this.yPos,
                yMultiple: this.yMultiple,
                type: 'samples'
            });
        }
    }, {
        key: "renderLabel",
        value: function renderLabel() {
            // What point from the wave to use
            var sampleIndex = Math.floor(this.wave.length * this.sampleAmt);
            var waveValue = this.wave[(0, _util.posMod)(sampleIndex, this.wave.length)];

            var waveAmt = sampleIndex / this.wave.length;

            var x = this.width * (waveAmt + this.waveShiftAmt);
            var y = this.yPos + this.yMultiple * waveValue;

            // draw li'l circle (?)
            this.context.beginPath();
            this.context.arc(x, y, 2, 0, 2 * Math.PI);
            this.context.stroke();

            var label = "time = " + waveAmt.toFixed(2) + "\nvalue = " + -waveValue.toFixed(2);
            (0, _renderLabel2.renderLabel)(this.context, label, x, y, 0.1 * this.height, _color.palette.cyan, 0, this.width);
        }
    }]);

    return WaveSamplesController;
}(_canvasController2.default);

exports.default = WaveSamplesController;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvasController = __webpack_require__(1);

var _canvasController2 = _interopRequireDefault(_canvasController);

var _color = __webpack_require__(2);

var _waveThings = __webpack_require__(3);

var _util = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HeadingController = function (_CanvasController) {
    _inherits(HeadingController, _CanvasController);

    function HeadingController(id, width, height) {
        _classCallCheck(this, HeadingController);

        var _this = _possibleConstructorReturn(this, (HeadingController.__proto__ || Object.getPrototypeOf(HeadingController)).call(this, id, width, height));

        _this.animAmt = 0;
        _this.mousePos = null;

        _this.onResize();
        return _this;
    }

    _createClass(HeadingController, [{
        key: "onResize",
        value: function onResize() {
            var boundingBox = this.canvas.getBoundingClientRect();
            // Resize our canvas
            this.canvas.width = boundingBox.width;
            this.canvas.height = boundingBox.height;
            this.width = boundingBox.width;
            this.height = boundingBox.height;
        }
    }, {
        key: "update",
        value: function update(dt, mousePosition) {
            this.animAmt += dt;
            if (mousePosition) {
                this.mousePos = Object.assign({}, mousePosition);
            }
        }
    }, {
        key: "render",
        value: function render() {
            this.clear();

            this.context.beginPath();
            this.context.strokeStyle = _color.palette.orange;
            this.context.lineWidth = 2;

            var numLines = 4;
            for (var j = 0; j < numLines; j++) {
                var waveHeight = this.height / numLines;
                var waveTop = (j + 0) * waveHeight;
                var waveMiddle = (j + 0.5) * waveHeight;
                var waveBottom = (j + 1) * waveHeight;

                var freq = 2 * Math.pow(2, numLines - 1 - j);
                var speed = 0.05 + 0.02 * j;

                for (var i = 0; i <= this.width; i += 3) {
                    // some some arbitray mapping to real world things
                    var t = i / 500;
                    var x = i;
                    if (this.mousePos) {
                        var xDiff = this.mousePos.x - x;
                        var yDiff = this.mousePos.y - waveMiddle;
                        var stretchAmt = 0.5 * gaussianLike(yDiff, waveHeight);
                        t = stretch(t, xDiff / 500, 0.2, stretchAmt);
                    }
                    t += speed * this.animAmt;
                    var waveAmt = 0.5 + 0.5 * Math.sin(2 * Math.PI * freq * t);

                    var y = (0, _util.slurp)(waveTop, waveBottom, (0, _util.slurp)(0.1, 0.9, waveAmt));

                    if (i == 0) {
                        this.context.moveTo(x, y);
                    } else {
                        this.context.lineTo(x, y);
                    }
                }
            }
            this.context.stroke();
            this.context.globalAlpha = 1;
        }
    }]);

    return HeadingController;
}(_canvasController2.default);

exports.default = HeadingController;


function gaussianLike(x, width) {
    // A gaussian type thing. It equals 1 at 0 (instead of having a total area of 1)
    return Math.exp(-0.5 * (x * x) / (width * width));
}

function stretch(t, diff, width, strength) {
    var stretchAmt = strength * diff * gaussianLike(diff, width);
    return t + stretchAmt;
}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvasController = __webpack_require__(1);

var _canvasController2 = _interopRequireDefault(_canvasController);

var _color = __webpack_require__(2);

var _waveThings = __webpack_require__(3);

var _util = __webpack_require__(0);

var _renderLabel2 = __webpack_require__(12);

var _synth = __webpack_require__(11);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WaveFrequenciesController = function (_CanvasController) {
    _inherits(WaveFrequenciesController, _CanvasController);

    function WaveFrequenciesController(id, width, height) {
        _classCallCheck(this, WaveFrequenciesController);

        var _this = _possibleConstructorReturn(this, (WaveFrequenciesController.__proto__ || Object.getPrototypeOf(WaveFrequenciesController)).call(this, id, width, height));

        _this.fourierData = [];
        _this.totalHeight = 0;

        _this.selectedIndex = 0;

        _this.waveSpacingMultiple = 0.7;
        _this.waveTopAmt = 0.2;
        _this.waveBottomAmt = 0.9;
        _this.waveHeightAmt = _this.waveBottomAmt - _this.waveTopAmt;
        return _this;
    }

    _createClass(WaveFrequenciesController, [{
        key: "setFourierData",
        value: function setFourierData(fourierData) {
            var _this2 = this;

            this.fourierData = fourierData.slice();
            // Sort by frequency this time
            this.fourierData.sort(function (a, b) {
                return a.freq - b.freq;
            });

            // Only just the first few to make it look nicer
            this.fourierData = this.fourierData.slice(0, 20);

            this.totalHeight = 0;
            this.fourierData.forEach(function (el) {
                return _this2.totalHeight += 2 * el.amplitude;
            });
        }
    }, {
        key: "update",
        value: function update(dt, mousePosition) {
            var pos = 1 - this.getScrollPosition();
            var fourierAmt = (0, _util.divideInterval)(pos, 0.2, 0.6);

            var unclampedIndex = Math.floor(this.fourierData.length * fourierAmt);
            this.selectedIndex = (0, _util.clamp)(unclampedIndex, 0, this.fourierData.length - 1);
        }
    }, {
        key: "render",
        value: function render() {
            this.clear();

            this.renderWaves();
            this.renderLabel();
        }
    }, {
        key: "renderWaves",
        value: function renderWaves() {
            var _this3 = this;

            var waveSpacingMultiple = 0.7;

            var waveTop = 0;

            var _loop = function _loop(i) {
                var waveData = _this3.fourierData[i];
                var wave = (0, _waveThings.getWave)(function (t) {
                    return waveData.amplitude * Math.cos(2 * Math.PI * waveData.freq * t + waveData.phase);
                });
                var yPositionAmt = 1 / _this3.totalHeight * (waveTop + waveData.amplitude);
                var yPosition = _this3.height * (0, _util.slurp)(_this3.waveTopAmt, _this3.waveBottomAmt, yPositionAmt);

                _this3.context.beginPath();
                _this3.context.lineWidth = 2;
                _this3.context.strokeStyle = _color.palette.blue;
                if (i != _this3.selectedIndex) {
                    _this3.context.globalAlpha = 0.1;
                }
                (0, _waveThings.renderWave)({
                    context: _this3.context,
                    wave: wave,
                    width: _this3.width,
                    yPosition: yPosition,
                    yMultiple: _this3.waveHeightAmt * waveSpacingMultiple * (_this3.height / _this3.totalHeight)
                });
                _this3.context.stroke();
                _this3.context.globalAlpha = 1;

                waveTop += 2 * waveData.amplitude;
            };

            for (var i = 0; i < this.fourierData.length; i++) {
                _loop(i);
            }
        }
    }, {
        key: "renderLabel",
        value: function renderLabel() {
            if (this.fourierData.length == 0) {
                return;
            }
            var waveData = this.fourierData[this.selectedIndex];
            var xAmt = 0.2;
            var x = this.width * xAmt;
            var waveValue = waveData.amplitude * Math.cos(2 * Math.PI * waveData.freq * xAmt + waveData.phase);
            var waveTop = 0;
            for (var i = 0; i < this.selectedIndex; i++) {
                waveTop += 2 * this.fourierData[i].amplitude;
            }
            var yAmt = 1 / this.totalHeight * (waveTop + waveData.amplitude + this.waveSpacingMultiple * waveValue);
            var y = this.height * (0, _util.slurp)(this.waveTopAmt, this.waveBottomAmt, yAmt);

            var freqString = (_synth.baseFrequency * waveData.freq).toFixed(0);
            var ampString = toScientificNotation(waveData.amplitude);
            var text = "frequency = " + freqString + " Hz\namplitude = " + ampString;
            (0, _renderLabel2.renderLabel)(this.context, text, x, y, 0.1 * this.height, _color.palette.cyan, 0, this.width);
        }
    }]);

    return WaveFrequenciesController;
}(_canvasController2.default);

/**
 * Returns a nicely formatted number
 * @param {number} number 
 */


exports.default = WaveFrequenciesController;
function toScientificNotation(number) {
    // because I'm lazy and don't want to do this by tweaking the size when drawing on the canvas.
    var superscripts = {
        '-': '⁻',
        '0': '⁰',
        '1': '¹',
        '2': '²',
        '3': '³',
        '4': '⁴',
        '5': '⁵',
        '6': '⁶',
        '7': '⁷',
        '8': '⁸',
        '9': '⁹'
    };

    var _number$toExponential = number.toExponential(2).replace('+', '').split('e'),
        _number$toExponential2 = _slicedToArray(_number$toExponential, 2),
        significand = _number$toExponential2[0],
        exponent = _number$toExponential2[1];

    var superscriptExponent = '';
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = exponent[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var digit = _step.value;

            superscriptExponent += superscripts[digit];
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return significand + '×10' + superscriptExponent;
}

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _circleThing = __webpack_require__(13);

var _circleThing2 = _interopRequireDefault(_circleThing);

var _pencil = __webpack_require__(40);

var _pencil2 = _interopRequireDefault(_pencil);

var _canvasController = __webpack_require__(1);

var _canvasController2 = _interopRequireDefault(_canvasController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var State = Object.freeze({
    handDrawing: 1,
    handMovingAway: 2,
    circlesDrawing: 3,
    circlesFading: 4,
    windowMove: 5
});

var maxSubFrames = 20;
var fps = 60;
var handMoveTime = fps * 0.8;
var circleFadeTime = 3 * fps * 0.8;
var windowMoveTime = fps;

var SelfDrawController = function (_CanvasController) {
    _inherits(SelfDrawController, _CanvasController);

    function SelfDrawController(id, width, height) {
        _classCallCheck(this, SelfDrawController);

        var _this = _possibleConstructorReturn(this, (SelfDrawController.__proto__ || Object.getPrototypeOf(SelfDrawController)).call(this, id, width, height));

        _this.circleThing = new _circleThing2.default();
        _this.pencil = new _pencil2.default();

        _this.state = State.handDrawing;
        _this.animCount = 0;

        _this.simulatedTime = 0;
        _this.elapsedTime = 0;
        return _this;
    }

    _createClass(SelfDrawController, [{
        key: 'update',
        value: function update(dt, mousePosition) {
            if (dt > maxSubFrames / fps) {
                // Limit this for the case where the user navigates away and then comes back.
                dt = maxSubFrames / fps;
            }

            this.elapsedTime += dt;
            while (this.simulatedTime < this.elapsedTime) {
                this.subUpdate();
                this.simulatedTime += 1 / fps;
            }
        }
    }, {
        key: 'subUpdate',
        value: function subUpdate() {
            switch (this.state) {
                case State.handDrawing:
                    {

                        this.circleThing.drawMore(0.7 * this.circleThing.totalPathLength / _circleThing.dataLength);
                        var drawPoint = this.circleThing.getDrawPosition();
                        this.pencil.x = drawPoint.x;
                        this.pencil.y = drawPoint.y;

                        if (this.circleThing.pathLength > this.circleThing.totalPathLength) {
                            this.state = State.handMovingAway;
                            this.animCount = 0;
                        }

                        break;
                    }
                case State.handMovingAway:
                    {

                        var _drawPoint = this.circleThing.getDrawPosition();
                        this.animCount++;
                        var amt = this.animCount / handMoveTime;
                        amt = easeInOut(amt, 2);
                        this.pencil.alpha = 1 - amt;
                        this.pencil.x = slurp(_drawPoint.x, -500, amt);
                        this.pencil.y = slurp(_drawPoint.y, -100, amt);

                        if (this.animCount > handMoveTime) {
                            this.state = State.circlesDrawing;
                            this.animCount = 0;
                            this.pencil.alpha = 1;
                        }

                        break;
                    }
                case State.circlesDrawing:
                    {

                        this.circleThing.addDrawPoint();
                        this.circleThing.rotateAll(1);
                        this.circleThing.alpha = 1;
                        this.animCount++;

                        if (this.circleThing.drawnPoints.length > _circleThing.dataLength) {
                            this.state = State.circlesFading;
                            this.circleThing.drawnPoints = [];
                            this.pencil.moveToCirclePosition();

                            this.animCount = 0;
                        }

                        break;
                    }
                case State.circlesFading:
                    {

                        this.circleThing.rotateAll(1);
                        this.animCount++;
                        var _amt = this.animCount / circleFadeTime;
                        _amt = easeInOut(_amt, 2);
                        this.circleThing.alpha = 1 - _amt;

                        if (this.animCount > circleFadeTime) {
                            this.state = State.windowMove;
                            this.animCount = 0;
                            this.circleThing.pathLength = 0;
                            this.circleThing.reset();
                            this.circleThing.alpha = 1;

                            this.pencil.x = this.pencil.circlePosX;
                            this.pencil.y = this.pencil.circlePosY;
                        }

                        break;
                    }
                case State.windowMove:
                    {

                        this.animCount++;
                        var _amt2 = this.animCount / windowMoveTime;
                        _amt2 = easeInOut(_amt2, 2);
                        this.pencil.x = slurp(this.pencil.circlePosX, 0, _amt2);
                        this.pencil.y = slurp(this.pencil.circlePosY, 0, _amt2);

                        if (this.animCount > windowMoveTime) {
                            this.animCount = 0;
                            this.state = State.handDrawing;
                        }

                        break;
                    }
            }
        }
    }, {
        key: 'render',
        value: function render() {
            this.clear();

            var context = this.context;
            var xOffset = 0.66 * this.width;
            var yOffset = 0.5 * this.height;
            var scale = 1;
            switch (this.state) {
                case State.handDrawing:

                    this.circleThing.render(context, xOffset, yOffset, scale);
                    this.pencil.render(context, xOffset, yOffset, scale);

                    break;
                case State.handMovingAway:

                    this.circleThing.render(context, xOffset, yOffset, scale);
                    this.pencil.render(context, xOffset, yOffset, scale);

                    break;
                case State.circlesDrawing:

                    this.circleThing.render(context, xOffset, yOffset, scale);

                    break;
                case State.circlesFading:

                    this.pencil.render(context, xOffset, yOffset, scale);
                    this.circleThing.render(context, xOffset, yOffset, scale);

                    break;

                case State.windowMove:

                    this.pencil.render(context, xOffset, yOffset, scale);

                    break;
            }
        }
    }]);

    return SelfDrawController;
}(_canvasController2.default);

exports.default = SelfDrawController;


function easeInOut(t) {
    var amt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

    var tPow = Math.pow(t, amt);
    return tPow / (tPow + Math.pow(1 - t, amt));
}

function slurp(val1, val2, amt) {
    return (val2 - val1) * amt + val1;
}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Circle = function () {
    function Circle(size, rotation, frequency) {
        var parent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

        _classCallCheck(this, Circle);

        this.size = size;
        this.startRotation = rotation;
        this.rotation = rotation;
        this.frequency = frequency;
        this.parent = parent;
        this.x = 0;
        this.y = 0;
    }

    _createClass(Circle, [{
        key: "moveToParent",
        value: function moveToParent() {
            this.x = this.parent.endX;
            this.y = this.parent.endY;
        }
    }, {
        key: "reset",
        value: function reset() {
            this.rotation = this.startRotation;
            if (this.parent != null) {
                this.moveToParent();
            }
        }
    }, {
        key: "update",
        value: function update(deltaT) {
            // TODO: Some delta T
            this.rotation += 2 * Math.PI * this.frequency * deltaT;
            if (this.parent != null) {
                this.moveToParent();
            }
        }
    }, {
        key: "render",
        value: function render(context, xOffset, yOffset, scale) {
            context.beginPath();
            context.arc(scale * (this.x + xOffset), scale * (this.y + yOffset), scale * this.size, 0, 2 * Math.PI);
            context.moveTo(scale * (this.x + xOffset), scale * (this.y + yOffset));
            context.lineTo(scale * (this.endX + xOffset), scale * (this.endY + yOffset));
            context.stroke();
        }
    }, {
        key: "renderAmt",
        value: function renderAmt(context, xOffset, yOffset, scale, amt) {
            if (amt < 0) {
                // useless
                return;
            }
            context.beginPath();

            // Draw radius
            var radiusAmt = amt / this.size;
            if (radiusAmt > 1) {
                radiusAmt = 1;
            }
            context.moveTo(scale * (this.x + xOffset), scale * (this.y + yOffset));
            context.lineTo(scale * (this.x + this.size * radiusAmt * Math.cos(this.rotation) + xOffset), scale * (this.y + this.size * radiusAmt * Math.sin(this.rotation) + yOffset));
            amt -= this.size;
            context.stroke();

            // Draw arc
            var arcAmt = amt / (2 * Math.PI * this.size);
            // But also only draw if we have enough to draw
            if (arcAmt < 0) {
                // That's ok. That's fine.
                return;
            }

            if (arcAmt > 1) {
                arcAmt = 1;
            }
            context.beginPath();
            context.arc(scale * (this.x + xOffset), scale * (this.y + yOffset), scale * this.size, this.rotation, this.rotation + 2 * Math.PI * arcAmt);
            context.stroke();
        }
    }, {
        key: "getDrawPosition",
        value: function getDrawPosition(amt) {
            var radiusAmt = amt / this.size;
            if (radiusAmt <= 1) {
                return {
                    x: this.x + this.size * radiusAmt * Math.cos(this.rotation),
                    y: this.y + this.size * radiusAmt * Math.sin(this.rotation)
                };
            }
            amt -= this.size;
            var arcAmt = amt / (2 * Math.PI * this.size);
            return {
                x: this.x + this.size * Math.cos(this.rotation + 2 * Math.PI * arcAmt),
                y: this.y + this.size * Math.sin(this.rotation + 2 * Math.PI * arcAmt)
            };
        }
    }, {
        key: "endX",
        get: function get() {
            return this.x + this.size * Math.cos(this.rotation);
        }
    }, {
        key: "endY",
        get: function get() {
            return this.y + this.size * Math.sin(this.rotation);
        }
    }, {
        key: "end",
        get: function get() {
            return {
                x: this.endX,
                y: this.endY
            };
        }
    }, {
        key: "length",
        get: function get() {
            // Circumference of circle + radius
            return 2 * Math.PI * this.size + this.size;
        }
    }]);

    return Circle;
}();

exports.default = Circle;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _circleThing = __webpack_require__(13);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var points = [];
var extremeX_X = 0;
var extremeX_Y = 0;
for (var i = 0; i < _circleThing.dataLength; i++) {
    var sumX = 0;
    var sumY = 0;
    for (var j = 0; j < _circleThing.data.length; j++) {
        var size = _circleThing.data[j][0];
        var frequency = _circleThing.data[j][1];
        var phase = _circleThing.data[j][2];
        sumX += size * Math.cos(2 * Math.PI * i * frequency + phase);
        sumY += size * Math.sin(2 * Math.PI * i * frequency + phase);
    }
    sumX /= _circleThing.dataLength;
    sumY /= _circleThing.dataLength;

    if (sumX > extremeX_X) {
        extremeX_X = sumX;
        extremeX_Y = sumY;
    }
    points.push({ x: sumX, y: sumY });
}
// console.log(points);

var Pencil = function () {
    function Pencil() {
        _classCallCheck(this, Pencil);

        this.x = 0;
        this.y = 0;
        this.alpha = 1;
    }

    _createClass(Pencil, [{
        key: 'render',
        value: function render(context, xOffset, yOffset, scale) {
            context.beginPath();
            context.globalAlpha = this.alpha;
            context.strokeStyle = 'black';
            context.fillStyle = 'white';
            context.moveTo(scale * (this.x + points[0].x - extremeX_X + xOffset), scale * (this.y + points[0].y - extremeX_Y + yOffset));
            for (var _i = 1; _i < points.length; _i++) {
                context.lineTo(scale * (this.x + points[_i].x - extremeX_X + xOffset), scale * (this.y + points[_i].y - extremeX_Y + yOffset));
            }
            context.closePath();
            context.fill();
            context.stroke();
            context.globalAlpha = 1;
        }
    }, {
        key: 'moveToCirclePosition',


        // After being drawn, it needs to be in this position.
        value: function moveToCirclePosition() {
            this.x = extremeX_X;
            this.y = extremeX_Y;
        }
    }, {
        key: 'circlePosX',
        get: function get() {
            return extremeX_X;
        }
    }, {
        key: 'circlePosY',
        get: function get() {
            return extremeX_Y;
        }
    }]);

    return Pencil;
}();

exports.default = Pencil;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _controllerUtil = __webpack_require__(5);

var _util = __webpack_require__(0);

var _controller = __webpack_require__(4);

var _controller2 = _interopRequireDefault(_controller);

var _imageSwapController = __webpack_require__(9);

var _imageSwapController2 = _interopRequireDefault(_imageSwapController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ImageMultController = function (_Controller) {
    _inherits(ImageMultController, _Controller);

    /**
     * @param {string} id 
     * @param {!ImageSwapController} multXController 
     * @param {!ImageSwapController} multYController 
     */
    function ImageMultController(id, multXController, multYController) {
        _classCallCheck(this, ImageMultController);

        var _this = _possibleConstructorReturn(this, (ImageMultController.__proto__ || Object.getPrototypeOf(ImageMultController)).call(this));

        _this.id = id;
        _this.imageSrcs = [];

        _this.img = document.getElementById(id);
        _this.index = 0;

        _this.multXController = multXController;
        _this.multYController = multYController;
        return _this;
    }

    _createClass(ImageMultController, [{
        key: "update",
        value: function update() {
            if (this.multXController == null || this.multYController == null) {
                return;
            }
            this.xIndex = this.multXController.index + 1;
            this.yIndex = this.multYController.index + 1;

            this.img.src = "img/components-" + this.yIndex + "-" + this.xIndex + ".png";
        }
    }, {
        key: "isOnScreen",
        value: function isOnScreen() {
            return (0, _controllerUtil.elementInView)(this.img);
        }
    }]);

    return ImageMultController;
}(_controller2.default);

exports.default = ImageMultController;

/***/ })
/******/ ]);
//# sourceMappingURL=main.bundle.js.map