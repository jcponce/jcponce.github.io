// Full list of configuration options available here:
		// https://github.com/hakimel/reveal.js#configuration
		Reveal.initialize({
			slideNumber: "c/t",

			history: true,
			center: true,
			transition: "linear",
			history: true,
			center: true,
			
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
					{
						title: 'Info',
						icon: '<i class="fa fa-info"></i>',
						src: 'about.html'
					}
				]
			},
			theme: Reveal.getQueryHash().theme, // available themes are in /css/theme
			//transition: Reveal.getQueryHash().transition || 'default', // none/fade/slide/convex/concave/zoom

			// Optional libraries used to extend on reveal.js
			dependencies: [
				{
					src: 'reveal/chalkboard/chalkboard.js'
				},
				{
					src: 'reveal/menu/menu.js'
				},
				{
					src: 'reveal/math/math.js'
				}
			],

			chalkboard: { // font-awesome.min.css must be available
				//src: "chalkboard/chalkboard.json",
				toggleChalkboardButton: {
					left: "80px"
				},
				toggleNotesButton: {
					left: "130px"
				}
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
				88: function () {
					RevealChalkboard.colorNext()
				}, // cycle colors forward when 'x' is pressed
				89: function () {
					RevealChalkboard.colorPrev()
				}, // cycle colors backward when 'y' is pressed
				//90: function () {
				//	RevealChalkboard.download();
				//}, // press 'z' to download zip containing audio files
				68: function () {
					RevealChalkboard.download()
				} // downlad chalkboard drawing when 'd' is pressed
			},
			//plugins: [RevealMath]
		});

		//function changeTheme(input) {
		//	var config = {};
		//	config.theme = input.value;
		//	RevealChalkboard.configure(config);
		//	input.blur();
		//}