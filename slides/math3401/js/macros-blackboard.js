Reveal.initialize({
    slideNumber: "c/t",

    history: true,
    center: true,
    transition: "linear",

    math: {
      // mathjax: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js',
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
    plugins: [RevealMath],

    
    dependencies: [
      { src: 'js/chalkboard/chalkboard.js', async: true }
    ],


    chalkboard: { // font-awesome.min.css must be available
      
      toggleChalkboardButton: { left: "80px" },
      toggleNotesButton: { left: "130px" },
      
      //toggleChalkboard: { true },
// 					pen:  [ 'crosshair', 'pointer' ]
				//	theme: "whiteboard",
//					background: [ 'rgba(127,127,127,.1)' , 'reveal.js-plugins/chalkboard/img/whiteboard.png' ],
// 					pen:  [ 'crosshair', 'pointer' ]
//					pen: [ url('reveal.js-plugins/chalkboard/img/boardmarker.png), auto' , 'url(reveal.js-plugins/chalkboard/img/boardmarker.png), auto' ],
//				        color: [ 'rgba(0,0,255,1)', 'rgba(0,0,255,0.5)' ],
//				        draw: [ (RevealChalkboard) ?  RevealChalkboard.drawWithPen : null , (RevealChalkboard) ? RevealChalkboard.drawWithPen : null ],
    },
    keyboard: {
        67: function() { RevealChalkboard.toggleNotesCanvas() },	// toggle chalkboard when 'c' is pressed
        66: function() { RevealChalkboard.toggleChalkboard() },	// toggle chalkboard when 'b' is pressed
        46: function() { RevealChalkboard.clear() },	// clear chalkboard when 'DEL' is pressed
         8: function() { RevealChalkboard.reset() },	// reset all chalkboard data when 'BACKSPACE' is pressed
        68: function() { RevealChalkboard.download() },	// downlad chalkboard drawing when 'd' is pressed
        88: function() { RevealChalkboard.colorNext() },	// cycle colors forward when 'x' is pressed
        89: function() { RevealChalkboard.colorPrev() },	// cycle colors backward when 'y' is pressed
        90: function() { RevealChalkboard.download();  }, 	// press 'z' to download zip containing audio files
//				    84: function() { Recorder.fetchTTS(); } 	// press 't' to fetch TTS audio files
    }

    


/*
    keyboard: {
      67: function() { RevealChalkboard.toggleNotesCanvas() },	// toggle notes canvas when 'c' is pressed
      66: function() { RevealChalkboard.toggleChalkboard() },	// toggle chalkboard when 'b' is pressed
      46: function() { RevealChalkboard.clear() },			// clear chalkboard when 'DEL' is pressed
       8: function() { RevealChalkboard.reset() },			// reset chalkboard data on current slide when 'BACKSPACE' is pressed
      68: function() { RevealChalkboard.download() },		// downlad recorded chalkboard drawing when 'd' is pressed
      88: function() { RevealChalkboard.colorNext() },		// cycle colors forward when 'x' is pressed
      89: function() { RevealChalkboard.colorPrev() },		// cycle colors backward when 'y' is pressed
    },


     // Optional reveal.js plugins
   
*/

  });

  