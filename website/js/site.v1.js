//main js file for creating ui, handling ajax requests

$.fn.scrollTo = function () {
    var elem = this;
    var container = $("html,body");
    $('html, body').animate({
        scrollTop: elem.offset().top // - container.offset().top + container.scrollTop()
    }, 600);
    return this;
};


//dom ready handler, main init method
$(function () {

    initUI('body');


    //lecture link within a course
    $("#main-body ").on("click", "#course-nav a", function (e) {
        var href = $(this).attr('href');
        if (href !== "/") {
            e.preventDefault();
            $.bbq.pushState({ course: currentState.course, lecture: $(this).attr('href') }, 0);
            return false;
        }
    });

    //course link from main page
    $("#course-links a").on("click", function (e) {
        e.preventDefault();
        $.bbq.pushState({ course: $(this).attr('href'), lecture: 'introduction' }, 0);
        return false;
    });

    //cancel full navigation for bookmark links within a page
    $('body').on('click', 'a', function (e) {
        var link = $(this).attr('href');
        if (link.charAt(0) === '#') {
            e.preventDefault();
            $(link).scrollTo();
            return false;
        }
    });

    //hashchange listener loads pages via ajax
    $(window).bind('hashchange', function () {
        var newState = $.bbq.getState();
        if (newState !== currentState) {
            if (typeof newState.course === "undefined") {
                if (currentState.course !== undefined)  //history back
                    location.reload();
                else { //home page
                    ga('set', 'page', '/index.html');
                    ga('send', 'pageview');
                }
            }
            else {
                loadCorrectPage(newState);
            }
            currentState = newState;
        }
    }).trigger("hashchange");
});

var currentState = {};

function loadCorrectPage(state) {
    //if course is new, load course nav, else load specific lecture
    if (state.course != currentState.course)
        loadCourseNav(state.course);
    else if (state.lecture !== currentState.lecture) {
        loadLecture(state.lecture);
    }
}

function loadCourseNav(course) {
    var main = $("#main-body");
    main.addClass("loading").load(course + "/header.html", function () {
        if (currentState.lecture === "")
            currentState.lecture = "introduction";
        loadLecture(currentState.lecture);
        main.removeClass("loading");
        initUI("#main-body");
    });
}

function loadLecture(lecture) {
    var main = $("#lecture-content");
    var url = currentState.course + "/" + lecture + ".html";
    ga('set', 'page', '/' + url);
    ga('send', 'pageview');

    main.addClass("loading").load(url, function () {
        main.removeClass("loading");
        initUI("#lecture-content");
    });
    // check if ethics is approved
    checkEthics();
}

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
    $("video").bind("play", function (e) {
        trackVideoEvent(e, $(this));
    }).bind("pause", function (e) {
        trackVideoEvent(e, $(this));
    }).bind("stop", function (e) {
        trackVideoEvent(e, $(this));
    });

    function trackVideoEvent(e, elem) {
        ga('send', 'event', 'Videos', e.type, elem.find("source").attr("src"));
    }

    // scroll to lecture title
    if (element === "#lecture-content") {
        if (currentState.lecture != "introduction")
            $('#lecture-content').scrollTo();
    }



}

