// Full list of configuration options available here:
		// https://github.com/hakimel/reveal.js#configuration
		Reveal.initialize({
			
			controls: true,
			history: true,
			slideNumber: "c/t",
			center: true,

			// Transition style
			transition: 'fade',

			// PDF exporting properties
			pdfSeparateFragments: false,
			pdfMaxPagesPerSlide: 1,

			// MathJax user-defined functions
			mathjax3: {
				mathjax: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js',
				config: "TeX-AMS_HTML-full",
				tex: {
					macros: {
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
						conj: ["{\\overline{#1}}", 1],
						abs: ["{\\left|#1\\right|}", 1],
						sabs: ["{\\left|#1\\right|}", 1],
						snorm: ["{\\|#1\\|}", 1],
						norm: ["{\\|#1\\|}", 1],
						pd: "\\boldsymbol{\\cdot}",
						epsilon: "\\varepsilon",
						vre: "\\varepsilon",
						Ra: "\\Rightarrow",
						bs: "\\blacksquare",
						nec: "{\\boxed{\\Rightarrow}}",
						suf: "{\\boxed{\\Leftarrow}}",
						coloneqq: "{\\,:=\\,}",
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


			chalkboard: { // font-awesome.min.css must be available
				//src: "chalkboard/chalkboard.json",
				boardmarkerWidth: 4,
				chalkWidth: 3,
				//storage: "chalkboard-demo",
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
				RevealMath.MathJax3, 
				RevealMenu, 
				RevealChalkboard, 
				RevealHighlight, 
				RevealZoom, 
				RevealSearch],
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
