// Based on w3schools example
// Modified by ilent2 2017
//
// TODO: It would be nice to load the contents of the script from file

function showCode(evt, language) {
    // Declare all variables
    var i, tabcontent, tablinks, tabdownload;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("codetabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Are we hiding the current tab
    if (evt.currentTarget.classList.contains("active")) {

      // Remove the active class
      evt.currentTarget.classList.remove("active");

      // Disable the download button
      tabdownload = document.getElementsByClassName("codetabdownload")[0];
      tabdownload.disabled = true;
      tabdownload.style.visibility = "hidden";

      return;
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("codetablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(language).style.display = "block";
    evt.currentTarget.className += " active";

    // Enable the download button
    tabdownload = document.getElementsByClassName("codetabdownload")[0];
    tabdownload.disabled = false;
    tabdownload.style.visibility = "visible";
}

function downloadCode(evt) {

  // Run the download transaction by clicking the associated link
  tabcontent = document.getElementsByClassName("codetabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    if (tabcontent[i].style.display != "none") {
      var links = tabcontent[i].getElementsByTagName("a");
      for (j = 0; j < links.length; ++j) {
        links[j].click();
      }
    }
  }
}

