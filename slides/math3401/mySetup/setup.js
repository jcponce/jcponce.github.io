Reveal.initialize({
	
	history: true,
	slideNumber: "c/t",
	center: true,

	// Transition style
	transition: 'fade',

	// PDF exporting properties
	pdfSeparateFragments: false,
	pdfMaxPagesPerSlide: 1,

	// MathJax user-defined functions
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
				Re: "{\\mbox{Re}}\\,",
				Im: "{\\mbox{Im}}\\,",
				arg: "{\\mbox{arg}}\\,",
				Arg: "{\\mbox{Arg}}\\,",
				Log: "\\mbox{Log}\\,",
				Int: "\\mbox{Int}\\,",
				ra: "\\rightarrow",
				ds: "\\displaystyle",
				res: "\\mbox{res}\\,",
				conj: ["{\\overline{#1}}", 1]
			}
		}
	},

	plugins: [RevealMath, RevealHighlight, RevealMenu],

	menu: { // Menu works best with font-awesome installed: sudo apt-get install fonts-font-awesome
		// Uncomment the following two lines, if you don't want to show the menu to toggle themes
		//themes: true,
		//themesPath: 'dist/theme/',
		transitions: false,
		markers: true,
		hideMissingTitles: true,
		custom: [{
			title: 'Info',
			icon: '<i class="fa fa-info"></i>',
			src: 'about.html'
		}]
	},

	// ...

	chalkboard: {
		// optionally load pre-recorded chalkboard drawing from file
		//src: "chalkboard.json",
		boardmarkerWidth: 4,
		chalkWidth: 4,
		toggleChalkboardButton: {
			left: "80px"
		},
		toggleNotesButton: {
			left: "130px"
		}
	},

	dependencies: [
		// Here I need to add the third party plugins
		// The plugin Menu is now available for reveal.js 4.0.2
		// {
		// 	src: 'plugin/menu/menu.js'
		// },
		{
			src: 'plugin/chalkboard/chalkboard.js'
		},
	],

	keyboard: {
		67: function () {
			RevealChalkboard.toggleNotesCanvas()
		}, // toggle notes canvas when 'c' is pressed
		66: function () {
			RevealChalkboard.toggleChalkboard()
		}, // toggle chalkboard when 'b' is pressed
		46: function () {
			RevealChalkboard.clear()
		}, // clear chalkboard when 'DEL' is pressed
		8: function () {
			RevealChalkboard.reset()
		}, // reset chalkboard data on current slide when 'BACKSPACE' is pressed
		//68: function () {
		//	RevealChalkboard.download()
		//}, // downlad recorded chalkboard drawing when 'd' is pressed
		88: function () {
			RevealChalkboard.colorNext()
		}, // cycle colors forward when 'x' is pressed
		89: function () {
			RevealChalkboard.colorPrev()
		}, // cycle colors backward when 'y' is pressed
	},
	// ...
});

// This function allows you to toggle themes, I don't need it now :)
// toggleMenu = () => {
//   let menu = Reveal.getPlugin('menu');
//	 if (menu) menu.toggle();
//  };

// Reveal.getPlugins(); // Not required now for v.4.0.2

/* 
The follwing function is to include an HTML file in the slides
Source: https://www.w3schools.com/howto/howto_html_include.asp
*/

function includeHTML() {
	let z, i, elmnt, file, xhttp;
	/*loop through a collection of all HTML elements:*/
	z = document.getElementsByTagName("*");
	for (i = 0; i < z.length; i++) {
		elmnt = z[i];
		/*search for elements with a certain atrribute:*/
		file = elmnt.getAttribute("include-html");
		if (file) {
			/*make an HTTP request using the attribute value as the file name:*/
			xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function () {
				if (this.readyState == 4) {
					if (this.status == 200) {
						elmnt.innerHTML = this.responseText;
					}
					if (this.status == 404) {
						elmnt.innerHTML = "Page not found.";
					}
					/*remove the attribute, and call this function once more:*/
					elmnt.removeAttribute("include-html");
					includeHTML();
				}
			}
			xhttp.open("GET", file, true);
			xhttp.send();
			/*exit the function:*/
			return;
		}
	}
};