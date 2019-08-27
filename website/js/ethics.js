// JavaScript Document
/* cookie management
*/
ethics_on = "";

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value + "; path=/";
    //alert(c_name + "=" + c_value +"; path=/");
}

function checkCookie() {
    var ethics_approved = getCookie("ethics");
    if (ethics_approved != null && username != "") {
        alert("Welcome again " + username);
    }
    else {
        username = prompt("Please enter your name:", "");
        if (username != null && username != "") {
            setCookie("username", username, 365);
        }
    }
}


/* Creating the ethics div
 */
var ethics_text = "<h2>Consent form: Dynamic, interactive eLearning modules for student lecture preparation</h2><ul><li>I have read and understand the <a href=\"docs\\information_sheet.pdf\" target=\"new\">Information Sheet</a> for this project and agree to participate in this study.</li><li>I understand that my usage of the lecture-preparation resources for mobile devices may be tracked (in terms of platform used, time spent).</li><li>I understand that I am being asked to allow my marks and grades to be included in a data set to determine benefits of this method of teaching physics.</li><li>I give my permission for the information gathered as a result of my participation in this study to be used in publications, providing confidentiality is maintained.</li><li>I understand that there is no foreseeable risk associated with being involved in the study, above the risks of everyday living.</li><li>I understand that access to project data will be restricted to the research team. Physical security and password-protection will be used to protect data stored in computer systems, backup media and hard copy. If data or conclusions drawn from the data cannot be de-identified, such data will not be used.</li><li>I understand participation will not affect grades.</li><li>I also understand that my participation is voluntary and that I can withdraw from this study, without prejudice, at any time.</li><li>Additionally, I understand that I will be given a summary of the study on my request. To do this, I can get in touch with the researchers via any of the contact details provided.</li></ul>";
var ethics_d = $('<div/>', {
    id: 'ethics_wrap',
    class: 'ethics'
});
var ethics_button = $('<button/>', {
    text: 'Ok',
    id: 'ethics_done',
    click: function () {
        if ($("#ethics-ok").is(':checked')) {
            setCookie("ethics", "approved", 365);
            ga('send', 'event', 'ethics', "approved", "true");
            //_gaq.push(['_trackEvent', 'ethics', "approved", "true"]);
        } else {
            ga('send', 'event', 'ethics', "approved", "false");
            //_gaq.push(['_trackEvent', 'ethics', "approved", "false"]);
        }
        $("#ethics_wrap").detach();
    }
});
$(ethics_d).html("<p>" + ethics_text + "</p><input type=\"checkbox\" name=\"ethics-ok\" id=\"ethics-ok\" checked=\"checked\" /> <label for=\"ethics-ok\">I have read the information above, and agree to participate in this study.</label><br />").append(ethics_button);
/* display the ethics div if not already approved
 */
var ethics_approved = getCookie("ethics");
//debugger;

function checkEthics() {
    var ethics_approved = getCookie("ethics");
    if (ethics_approved != null && ethics_approved != "") {
        ga('send', 'event', 'ethics', "approved", "true");
        console.log("ethics approved");
    } else {
        console.log("no ethics");
        $("#content").append(ethics_d);
        console.log($("#content"));
    }
};
