function checkaims(qtext) {
	var checks;
	var i;
	var right;
	var numbercorrect=0;
	
	checks = document.getElementById(qtext).getElementsByTagName("input");
	
	allchecked = true;
	for(i = 0; i < checks.length; i++) {
		if(checks[i].checked != true) {
			allchecked = false;
		}
	}
	
 	if (allchecked) {
 		alert("Well done - hope to see you at the lecture!!");
 	}
}
