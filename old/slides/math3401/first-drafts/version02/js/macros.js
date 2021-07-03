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
    plugins: [RevealMath]
  });

  