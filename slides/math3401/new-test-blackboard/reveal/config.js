// Full list of configuration options available here:
		// https://github.com/hakimel/reveal.js#configuration
		Reveal.initialize({
			slideNumber: "c/t",

			history: true,
			center: true,
			transition: "linear",

			//controls: true,
			//progress: true,
			history: true,
			center: true,
			//mouseWheel: true,

			math: {
				//mathjax: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
				config: "TeX-AMS_HTML-full",
				TeX: {
					Macros: {
						R: "\\mathbb{R}",
						C: "\\mathbb{C}",
						N: "\\mathbb{N}",
						Z: "\\mathbb{Z}",
						Q: "\\mathbb{Q}",
						Re: "{\\mbox{Re}}",
						Im: "{\\mbox{Im}}",
						arg: "{\\mbox{arg}}",
						Arg: "{\\mbox{Arg}}",
						Log: "\\mbox{Log}",
						ra: "\\rightarrow",
						conj: ["{\\overline{#1}}", 1],
						set: ["\\left\\{#1 \\; ; \\; #2\\right\\}", 2]
					}
				}
			},

			menu: { // Menu works best with font-awesome installed: sudo apt-get install fonts-font-awesome
				themes: false,
				transitions: false,
				markers: true,
				hideMissingTitles: true,
				custom: [
					/*{
											title: 'Plugins',
											icon: '<i class="fa fa-external-link-alt"></i>',
											src: 'toc.html'
										},*/
					{
						title: 'About',
						icon: '<i class="fa fa-info"></i>',
						src: 'about.html'
					}
				]
			},
			theme: Reveal.getQueryHash().theme, // available themes are in /css/theme
			//transition: Reveal.getQueryHash().transition || 'default', // none/fade/slide/convex/concave/zoom

			// Optional libraries used to extend on reveal.js
			dependencies: [
				//{ src: 'https://rajgoel.github.io/reveal.js/lib/js/classList.js', condition: function() { return !document.body.classList; } },
				//{ src: 'https://rajgoel.github.io/reveal.js/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
				//{ src: 'https://rajgoel.github.io/reveal.js/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
				//{ src: 'https://rajgoel.github.io/reveal.js/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
				//					{ src: 'reveal.js-plugins/audio-slideshow/slideshow-recorder.js'},				
				//{ src: 'https://rajgoel.github.io/reveal.js-plugins/audio-slideshow/audio-slideshow.js'},
				{
					src: 'reveal/chalkboard/chalkboard.js'
				},
				{
					src: 'reveal/menu/menu.js'
				},
				{
					src: 'reveal/math/math.js'
				},
			],
			audio: {
				prefix: 'chalkboard/',
				suffix: '.ogg',
				defaultDuration: 5,
				//					textToSpeechURL: "http://api.voicerss.org/?key=[YOUR_KEY]&hl=en-gb&c=ogg&src=",
				advance: 500,
				autoplay: false,
				defaultText: true,
				playerOpacity: 0.2,
			},
			chalkboard: { // font-awesome.min.css must be available
				//src: "chalkboard/chalkboard.json",
				toggleChalkboardButton: {
					left: "80px"
				},
				toggleNotesButton: {
					left: "130px"
				},
				// 					pen:  [ 'crosshair', 'pointer' ]
				//					theme: "whiteboard",
				//					background: [ 'rgba(127,127,127,.1)' , 'reveal.js-plugins/chalkboard/img/whiteboard.png' ],
				// 					pen:  [ 'crosshair', 'pointer' ]
				//					pen: [ url('reveal.js-plugins/chalkboard/img/boardmarker.png), auto' , 'url(reveal.js-plugins/chalkboard/img/boardmarker.png), auto' ],
				//				        color: [ 'rgba(0,0,255,1)', 'rgba(0,0,255,0.5)' ],
				//				        draw: [ (RevealChalkboard) ?  RevealChalkboard.drawWithPen : null , (RevealChalkboard) ? RevealChalkboard.drawWithPen : null ],
			},
			keyboard: {
				67: function () {
					RevealChalkboard.toggleNotesCanvas()
				}, // toggle chalkboard when 'c' is pressed
				66: function () {
					RevealChalkboard.toggleChalkboard()
				}, // toggle chalkboard when 'b' is pressed
				46: function () {
					RevealChalkboard.clear()
				}, // clear chalkboard when 'DEL' is pressed
				8: function () {
					RevealChalkboard.reset()
				}, // reset all chalkboard data when 'BACKSPACE' is pressed
				68: function () {
					RevealChalkboard.download()
				}, // downlad chalkboard drawing when 'd' is pressed
				88: function () {
					RevealChalkboard.colorNext()
				}, // cycle colors forward when 'x' is pressed
				89: function () {
					RevealChalkboard.colorPrev()
				}, // cycle colors backward when 'y' is pressed
				//90: function () {
				//	RevealChalkboard.download();
				//}, // press 'z' to download zip containing audio files
				//				    84: function() { Recorder.fetchTTS(); } 	// press 't' to fetch TTS audio files
			},


			//plugins: [RevealMath]
		});

		function changeTheme(input) {
			var config = {};
			config.theme = input.value;
			RevealChalkboard.configure(config);
			input.blur();
		}