// JS file for running the links (ajax?) on the SciMS site
// Copyright (C) 2017 The University of Queensland
// Written by Isaac Lenton, 2017
// Based on bbq code by unknown author.

/** Create the end tag for a page from the current state object. */
function urlFromState(state) {
  if (state === null) return "index.html";

  if (state.lecture !== undefined && state.course !== undefined)
    return "index.html#course=" + state.course
        + "&lecture=" + state.lecture;

  if (state.course !== undefined)
    return "index.html#course=" + state.course;

  return "index.html";
}

/** Creates a state object from the given url. */
function stateFromUrl(url) {
  var hash = url.split('#')[1];
  if (hash === undefined) return {};

  var parts = hash.split('&');
  var state = {};

  for (var i = 0; i < parts.length; ++i) {
    var seg = parts[i].split('=');
    state[seg[0]] = seg[1];
  }

  return state;
}

/** Generate a title string from the current state. */
function titleFromState(state) {
  if (state.lecture !== undefined) return "SciMS: " + state.lecture;
  if (state.course !== undefined) return "SciMS: " + state.course;
  return "SciMS";
}

/** Push the given state to the history. */
function pushState(state) {
  window.history.pushState(state,
      titleFromState(state), urlFromState(state));
}

/** Replace the current state in the history. */
function replaceState(state) {
  window.history.replaceState(state,
      titleFromState(state), urlFromState(state));
}

/** Load the SciMS page. */
function loadPageFromState(state) {

  var currentState = window.history.state;

  if (state === undefined) {
    replaceState({});
    return;
  }

  // Do we need to load the course navigation
  if (currentState === null || state.course !== currentState.course)
    loadCourseNav(state);

  // Do we need to load a lecture
  if (currentState === null || state.lecture !== currentState.lecture)
    loadLecture(state);

  // Set the current window state the reflect the loaded state
  replaceState(state);
}

function loadCourseNav(state) {

  var main = $("#main-body");

  // If there is no course, go to the home page
  if (state.course === null) {
    main.addClass("loading").load("index.html", function() {
      main.removeClass("loading");
      initUI("#main-body");
    });
    return;
  }

  // Otherwise, load the given page
  main.addClass("loading").load(state.course + "/header.html", function() {
    main.removeClass("loading");
    initUI("#main-body");
  });
}

function loadLecture(state) {

  // If there is no course, there is no lecture
  if (state.course === null) return;

  var main = $("#lecture-content");

  // If there is no lecture, load the course introduction page
  if (state.lecture === null || state.lecture === ""
      || state.lecture === "introduction")
  {
    main.addClass("loading").load(
        state.course + "/" + "introduction.html", function () {
      main.removeClass("loading");
      initUI("#lecture-content");
    });
    return;
  }

  // Send the page url for google analytics
  //var url = state.course + "/" + state.lecture + ".html";
  //ga('set', 'page', '/' + url);
  //ga('send', 'pageview');

  // Load the lecture content
  main.addClass("loading").load(
      state.course + "/" + state.lecture + ".html", function () {
    main.removeClass("loading");
    initUI("#lecture-content");
  });

  // Check if ethics is approved
  checkEthics();
}

$(function () {

  // Load the body of the page
  initUI('body');

  // If the internal state doesn't match the url, change to url state
  var urlState = stateFromUrl(window.location.href);
  if (urlFromState(window.history.state) !== urlFromState(urlState)) {
    loadPageFromState(state);
  }

  // If we don't have a current state, go to the home page
  if (window.history.state === null) {
    replaceState({});
  }

  // Register event for the course links
  $("#course-links a").on("click", function (e) {

    // Disable the default link behaviour (is there a better way?)
    e.preventDefault();

    // Push the current state
    pushState(window.history.state);

    // Load the page and update the current state
    var state = { course: $(this).attr('href'),
        lecture: 'introduction',
        hasLoaded: false };
    loadPageFromState(event.state);

    return false;
  });

  // Register event for the lectures within a course
  $("#main-body ").on("click", "#course-nav a", function (e) {

    // Disable the default link behaviour (is there a better way?)
    e.preventDefault();

    // Push the current state
    pushState(window.history.state);

    // Load the page and update the current state
    var state = { course: window.history.state,
        lecture: $(this).attr('href'),
        hasLoaded: false };
    loadPageFromState(event.state);

    return false;
  });

  //cancel full navigation for bookmark links within a page
  // TODO: Do we need this, is it useful or deprecated?
  // From site.v2.js
  //$('body').on('click', 'a', function (e) {
  //    var link = $(this).attr('href');
  //    if (link.charAt(0) === '#') {
  //        e.preventDefault();
  //        $(link).scrollTo();
  //        return false;
  //    }
  //});

  // Change the state when the user clicks back/forward
  window.onpopstate = function(event) {
    loadPageFromState(event.state);
  };

});

var scrollTransition = 400;

$.fn.scrollTo = function () {
    var elem = this;
    var container = $("html,body");
    $('html, body').animate({
        scrollTop: elem.offset().top // - container.offset().top + container.scrollTop()
    }, scrollTransition);
    return this;
};

// This function is from site.v2.js
function initUI(element) {

    //collapse sections on smaller screens
    var browserWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0;
    if (browserWidth < 486) {
        $('#lecture-content > div').each(function (i, e) {
            var div = $(e);
            div.children('h2')
                .css({ "cursor": "pointer" })
                .siblings().wrapAll("<div class='body' style='overflow:hidden;'></div>").end()
                .click(function (e) {
                    var elem = $(this);
                    var body = div.children('div.body');
                    ga('send', 'event', 'PageSections', body.is(':visible') ? "hide" : "show", elem.text());
                    body.slideToggle();
                });
            div.children('div.body').hide();
        });
    }

    //track answers to questions
    $("input[type='radio']").change(function () {
        var elem = $(this);
        ga('send', 'event', 'Questions', elem.val(), elem.attr("name"));
    });

    //track answers to questions
    $("input[type='checkbox']").change(function () {
        var elem = $(this);
        ga('send', 'event', 'SummaryCheck', elem.is(':checked'), elem.attr("name"));
    });

    //track video interaction
    $("video").on("play", function (e) {
        trackVideoEvent(e, $(this));
    }).on("pause", function (e) {
        trackVideoEvent(e, $(this));
    }).on("stop", function (e) {
        trackVideoEvent(e, $(this));
    });

    function trackVideoEvent(e, elem) {
        ga('send', 'event', 'Videos', e.type, elem.find("source").attr("src"));
    }

    // Rerun MathJax to typeset equations in this lecture
    MathJax.Hub.Typeset();

    var currentState = window.history.state;

    // Only scroll when we have not loaded the page before (no refresh scroll)
    if (element === "#lecture-content" && currentState.hasLoaded !== true) {


      if (currentState.lecture === "introduction") {

        // Scroll to the top of page if we are opening a course
        $('html, body').animate({ scrollTop: "0px" }, scrollTransition);

      } else {

        // scroll to lecture title
        $('#lecture-content').scrollTo();
      }

      currentState.hasLoaded = true;
      replaceState(currentState);
    }
}

