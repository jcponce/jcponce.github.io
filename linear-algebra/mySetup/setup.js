        // Full list of configuration options available here:
		// https://github.com/hakimel/reveal.js#configuration
		Reveal.initialize({

			// Display presentation control arrows
			controls: true,

			// Push each slide change to the browser history.  Implies `hash: true`
			history: true,
			
			// Display the page number of the current slide
			slideNumber: "c/t",

			// Vertical centering of slides
			center: true,

			// Global override for preloading lazy-loaded iframes
			//preloadIframes: true,

			// Enables touch navigation on devices with touch input
  			touch: false,

			// Transition style
			transition: 'fade',

			// PDF exporting properties
			pdfSeparateFragments: false,
			pdfMaxPagesPerSlide: 1,

			// MathJax user-defined functions
			mathjax2: {
				//mathjax: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
				config: "TeX-AMS_HTML-full",
				TeX: {
					Macros: {
						R: "\\mathbb{R}",
						C: "\\mathbb{C}",
						N: "\\mathbb{N}",
						Z: "\\mathbb{Z}",
						Q: "\\mathbb{Q}",
						r: "{\\mathbf{r}}",
						i: "{\\mathbf{i}}",
						j: "{\\mathbf{j}}",
						k: "{\\mathbf{k}}",
						u: "{\\mathbf{u}}",
						v: "{\\mathbf{v}}",
						w: "{\\mathbf{w}}",
						bfu: "{\\mathbf{u}}",
						bfv: "{\\mathbf{v}}",
						bfw: "{\\mathbf{w}}",
						bfe: "{\\mathbf{e}}",
						n: "{\\mathbf{n}}",
						F: "{\\mathbf{F}}",
						BF: "{\\mathbb{F}}",
						T: "{\\mathbf{T}}",
						div: "{\\mbox{div}}\\,",
						nec: "{\\boxed{\\Rightarrow}}",
						suf: "{\\boxed{\\Leftarrow}}",
						curl: "{\\mbox{curl}}\\,",
						Re: "{\\mbox{Re}}\\,",
						Im: "{\\mbox{Im}}\\,",
						arg: "{\\mbox{arg}}\\,",
						Arg: "{\\mbox{Arg}}\\,",
						Log: "\\mbox{Log}\\,",
						Int: "\\mbox{Int}\\,",
						ra: "\\rightarrow",
						Ra: "\\Rightarrow",
						ds: "\\displaystyle",
						res: "\\mbox{res}\\,",
						arcosh: "\\mbox{arcosh}\\,",
						arsinh: "\\mbox{arsinh}\\,",
						artanh: "\\mbox{artanh}\\,",
						dup: "{\\hspace{1pt}\\text{d}}",
						mat: ["{\\left(\\begin{array}{#1} #2\\end{array}\\right)}", 2],
						dif: ["{\\frac{\\text{d}\\hspace{1pt}#1}{\\text{d}\\hspace{1pt}#2}}", 2],
						conj: ["{\\overline{#1}}", 1],
						abs: ["{\\left|#1\\right|}", 1],
						sabs: ["{\\left|#1\\right|}", 1],
						snorm: ["{\\|#1\\|}", 1],
						norm: ["{\\|#1\\|}", 1],
						epsilon: "\\varepsilon",
						pd: "\\boldsymbol{\\cdot}",
						ddy: "{\\ddot{y}}",//\newcommand{\ddy}{\ddot{y}}
						dy: "{\\dot{y}}",//\newcommand{\dy}{\dot{y}}
						bs: "\\blacksquare",
						//cdot: "{\\textstyle \\,\\bullet\\,}",
						//cdot: "{\\scriptstyle \\,\\bullet\\,}",
					}
				}
			},
			menu: { // Menu works best with font-awesome installed: sudo apt-get install fonts-font-awesome
				themes: [
					{ name: 'Black', theme: 'revealjs/dist/theme/black.css' },
					{ name: 'White', theme: 'revealjs/dist/theme/white.css' },
					{ name: 'Night', theme: 'revealjs/dist/theme/night.css' },
					{ name: 'Simple', theme: 'revealjs/dist/theme/simple.css' },
				],
				transitions: false,
				markers: true,
				hideMissingTitles: true,
				custom: [{
					title: 'Info',
					icon: '<i class="fa fa-info"></i>',
					src: 'about.html'
				}]
			},


			chalkboard: { 
				// -> font-awesome.min.css must be available
				//src: "chalkboard/chalkboard.json",
				//storage: "chalkboard-demo",
				boardmarkerWidth: 4,
				chalkWidth: 3,
				grid: { color: 'rgb(50,50,10,0.5)', distance: 80, width: 1},
				//grid: false,
				chalkEffect: 0.4,
				colorButtons: 5
			},

			customcontrols: {
				controls: [
			  {
					  id: 'toggle-overview',
					  title: 'Toggle overview (O)',
					  icon: '<i class="fa fa-th"></i>',
					  action: 'Reveal.toggleOverview();'
					},
					{ icon: '<i class="fa fa-pen-square"></i>',
					  title: 'Toggle chalkboard (B)',
					  action: 'RevealChalkboard.toggleChalkboard();'
					},
					{ icon: '<i class="fa fa-pen"></i>',
					  title: 'Toggle notes canvas (C)',
					  action: 'RevealChalkboard.toggleNotesCanvas();'
					}
				]
			},
			// ...
			plugins: [
				RevealCustomControls, 
				RevealMath.MathJax2, 
				RevealMenu, 
				RevealChalkboard, 
				RevealHighlight, 
				RevealZoom, 
				RevealSearch
			],
		});

		


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
