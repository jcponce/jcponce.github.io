// Open and close the sidebar on medium and small screens
function w3_open() {
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("myOverlay").style.display = "none";
}

// Change style of top container on scroll
const myTop = document.getElementById("myTop");
const myTitle = document.getElementById("myTitle");

window.onscroll = function () { myTopBar(), scrollFunction() };

function myTopBar() {
  if (myTop && myTitle) {
    if (document.body.scrollTop > 130 || document.documentElement.scrollTop > 130) {
      document.getElementById("myTop").classList.add("w3-card-4", "w3-animate-opacity");
      document.getElementById("myTitle").classList.add("w3-show-inline-block");
    } else {
      document.getElementById("myTitle").classList.remove("w3-show-inline-block");
      document.getElementById("myTop").classList.remove("w3-card-4", "w3-animate-opacity");
    }
  }
}

/* Button to the top */
// Get the button
let mybutton = document.getElementById("toTop");
let prevScrollpos = window.scrollY;

//window.onscroll = function () { scrollFunction() };

// When the user scrolls down 500px from the top of the document, show the button
function scrollFunction() {
  //let currentScrollPos = window.scrollY;
  //if (prevScrollpos > currentScrollPos) {
  mybutton.style.display = "none";
  //} else {
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    mybutton.style.display = "block";
  }
  //}
  //prevScrollpos = currentScrollPos;
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  let tocLinks = document.querySelectorAll('.toc-chapter a');
  tocLinks.forEach((link) => {
    link.classList.remove('active');
    link.classList.remove('highlight-list');
  });
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Accordions
function myAccordion(id) {
  let x = document.getElementById(id);
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
    x.previousElementSibling.className += " w3-theme";
  } else {
    x.className = x.className.replace("w3-show", "");
    x.previousElementSibling.className =
      x.previousElementSibling.className.replace(" w3-theme", "");
  }
}

// Highlight navbar
function myHighlightedNavBar(id) {
  let x = document.getElementById(id);
  if (x.className.indexOf("w3-grey") == -1) {
    x.className += " w3-grey";
    x.previousElementSibling.className += " w3-theme";
  } else {
    x.className = x.className.replace("w3-grey", "");
    x.previousElementSibling.className =
      x.previousElementSibling.className.replace(" w3-theme", "");
  }
}

/*---------------------------------------------------------------*/
// Toc for each chapter

window.addEventListener('scroll', function () {
  let sections = document.querySelectorAll('div[id^="section"]');
  let tocLinks = document.querySelectorAll('.toc-chapter a');
  let scrollPosition = window.scrollY;

  sections.forEach((section, index) => {
    let sectionTop = section.offsetTop - 100; // Adjust as needed
    let sectionBottom = sectionTop + section.clientHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      tocLinks.forEach((link) => {
        link.classList.remove('active');
        link.classList.remove('highlight-list');
      });
      tocLinks[index].classList.add('active');
      tocLinks[index].classList.add('highlight-list');
    }
  });
});

/*---------------------------------------------------------------*/

let darkModeIcon = document.getElementById("dark-mode-toggle");
let darkModeBar = document.getElementById("mySidebar");
let imageLogo = document.getElementById('myLogo');
let show;

if (darkModeIcon && darkModeBar && imageLogo) {
  if (window.matchMedia) {
    show = true;
    document.body.classList.toggle('dark-mode');
    darkModeBar.classList.toggle("dark-mode");
    darkModeIcon.innerHTML = '<i class="fa-solid fa-moon"></i>';
    imageLogo.src = 'imgs/my-logo-white.png';
  } else {
    show = false;
    darkModeIcon.innerHTML = '<i class="fa-solid fa-circle-half-stroke"></i>';
    
    imageLogo.src = 'imgs/my-logo-black.png';
  }
} else {
  document.body.classList.toggle('dark-mode');
}


function myDarkMode() {
  const x = document.body;
  const y = document.getElementById("mySidebar");

  x.classList.toggle("dark-mode");
  y.classList.toggle("dark-mode");

  const image = document.getElementById('myLogo');


  if (show == false) {
    show = true;
    image.src = 'imgs/my-logo-white.png';
  } else {
    show = false;
    image.src = 'imgs/my-logo-black.png';
  }

  //console.log(show);

  // Get the element containing the text
  var element = document.getElementById("dark-mode-toggle");

  // Toggle between "text01" and "text02"
  if (element.innerHTML.trim() === '<i class="fa-solid fa-moon"></i>') {
    element.innerHTML = '<i class="fa-solid fa-circle-half-stroke"></i>';
  } else {
    element.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
}

/* 
 
I need the following code to show modal with support message
 
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


/* The following is to scroll up to the "id" tag for hyperlinks */
// Function to handle smooth scrolling with offset
function scrollToElementWithOffset(selector, offset) {
  var target = document.querySelector(selector);
  if (target) {
    var targetPosition = target.getBoundingClientRect().top + window.scrollY - offset; // pageYOffset is deprecated :(
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// Adding event listeners to all links with the class 'scroll-link'
var links = document.querySelectorAll('a[href^="#"]');
links.forEach(function (link) {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    var targetId = this.getAttribute('href');
    scrollToElementWithOffset(targetId, 50); // 50px offset, I want it below the navbar
  });
});

