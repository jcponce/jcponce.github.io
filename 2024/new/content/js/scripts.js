 // Dark mode function
 const darkModeToggle = document.getElementById('dark-mode-toggle')
 darkModeToggle.addEventListener('click', () => {
     document.body.classList.toggle('latex-dark')
 })

/* 
 *  I need the following code to show modal with support message
*/

// Get the modal
let modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
//btn.onclick = function() {
//  modal.style.display = "block";
//}

/* 
  The follwing function is to include an HTML file in the slides
  Source: https://www.w3schools.com/howto/howto_html_include.asp
*/
function showMessage() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
  clearInterval(myInterval);
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    clearInterval(myInterval);
  }

}

let myInterval = setInterval(function () {
  showMessage();
}, 1800000);
// 3000 3 seconds
// 8000 8 seconds
// 30000 30 seconds
// 60000 1 min
// 120000 2 min
// 300000 5 mins
// 600000 10 mins
// 1200000 20 mins
// 1800000 30 mins


function includeHTML() {
  let z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
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
          elmnt.removeAttribute("w3-include-html");
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


// Button to the top
// Get the button
let mybutton = document.getElementById("toTop");
let prevScrollpos = window.scrollY;

window.onscroll = function() {scrollFunction()};

// When the user scrolls down 500px from the top of the document, show the button
function scrollFunction() {
  let currentScrollPos = window.scrollY;
  if (prevScrollpos > currentScrollPos) {
    mybutton.style.display = "none";
  } else {
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
      mybutton.style.display = "block";
    }
  }
  prevScrollpos = currentScrollPos;
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

includeHTML(); 