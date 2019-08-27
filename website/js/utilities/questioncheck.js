function validate(qtext) {
	var radios;
	var i;
	var right;
	var numbercorrect=0;
	
	radios = document.getElementById(qtext).getElementsByTagName("input");
	
	right = false;
	for(i = 0; i < radios.length; i++) {
		if(radios[i].value == "right" && radios[i].checked == true) {
//			right = true;
			numbercorrect++;
		}
	}
	
// 	if (right) {
// 		alert("You answered correctly");
// 	} else {
// 		alert("Wrong answer");
// 	}

	alert("You answered " + numbercorrect + " question(s) correctly.");
}
