module_main = new function(){
    this.paper = new Object();
    this.Xaxis = new Object();
    this.Yaxis = new Object();
    this.prob_line = new Object();
    this.hBar = new Object();
    this.hText = new Object();
    this.tBar = new Object();
    this.tText = new Object();
    this.proportion_line = new Object();
    this.xBound_text = new Object();
    this.width = 0;
    this.height = 0;
    this.prob = 0.5;
    this.count = 0;
    this.len = 0;
    this.times = 15;
    this.intervalID = 0;
    this.timer_delay = 500;
    this.plot_width = 365;
    this.plot_height = 315;
    this.plot_x = 130;
    this.plot_y = 160;
    this.hbar_top = 75;
    this.Xscale = 10;
    this.hProp = new Array();
    this.toss = function(prob){
        if (this.len % 15 == 0) {
        	$("#nickels").empty();
	    }

        this.count++;
        this.len++;
        var r = Math.random();
        var img;
        if(r <= prob) {
            Xmas.push(1);
            img = "head";
        } else {
            Xmas.push(0);
            img = "tail";
        }
        this.hProp.push(get_mean_X());
        
	    $("#nickels").append('<img class="nickel" src="' + img + '.png" width="27" height="27" border="0" />');
    }
    this.create_plot = function (){
    	/*
        this.hBar = this.paper.rect(20, 30, 40, (this.height - 60) / 2);
        this.hBar.attr("fill", "#009");
        this.hBar.attr("stroke", "#000");
        //hBar.hide();
        this.tBar = this.paper.rect(20, 30 + (this.height - 60) / 2, 40, (this.height - 60) / 2);
        this.tBar.attr("fill", "#090");
        this.tBar.attr("stroke", "#000");
        //tBar.hide();
		*/
		
		// LTWH
        this.hBar = this.paper.rect(20, this.hbar_top, (this.width - 40), 40);
        this.hBar.attr("fill", "#fff");
        this.hBar.attr("stroke", "#000");
        
        this.tBar = this.paper.rect((this.width - 20), this.hbar_top, 0, 40);
        this.tBar.attr("fill", "#fff");
        this.tBar.attr("stroke", "#000");
        
        this.Yaxis = this.paper.path("M" + this.plot_x + " " + this.plot_y + "L" + this.plot_x + " " + (this.plot_y + this.plot_height));
        this.Yaxis.attr("stroke", "#333");
        this.Xaxis = this.paper.path("M" + this.plot_x + " " + (this.plot_y + this.plot_height) + "L" + (this.plot_x + this.plot_width) + " " + (this.plot_y + this.plot_height));
        this.Xaxis.attr("stroke", "#333");
        
        this.hText = this.paper.text(20, this.hbar_top - 15, "Heads = 0/0");
        this.hText.attr("font-size", "18");
        this.hText.attr("text-anchor", "start");
        this.hText.attr("fill", "#009");
        this.hText.attr("font-family", "Arial");
        this.hText.attr("font-weight", "bold");
        
        
        this.tText = this.paper.text(this.width - 20, this.hbar_top + 55, "Tails = 0/0");
        this.tText.attr("font-size", "18");
        this.tText.attr("text-anchor", "end");
        this.tText.attr("fill", "#090");
        this.tText.attr("font-family", "Arial");
        this.tText.attr("font-weight", "bold");

        this.ylabel1 = this.paper.text(this.plot_x - 50, this.plot_y+120, "Proportion");
        this.ylabel1.attr("text-anchor", "end");
        this.ylabel1.attr("font-size", "14");
        this.ylabel1.attr("font-family", "Arial");

        this.ylabel1 = this.paper.text(this.plot_x - 50, this.plot_y+138, "Heads");
        this.ylabel1.attr("text-anchor", "end");
        this.ylabel1.attr("font-size", "14");
        this.ylabel1.attr("font-family", "Arial");
        
        this.xBound_text = this.paper.text(this.plot_x + this.plot_width, this.plot_y + this.plot_height + 15, this.Xscale);
        this.xBound_text.attr("font-size", "14");
        this.xBound_text.attr("fill", "#333");
        this.xBound_text.attr("font-family", "Arial");
        
        this.proportion_line = this.paper.path("M0 0L0 0");
        this.proportion_line.attr("stroke", "#3b60ff");
        this.proportion_line.attr("stroke-width", 4);
        this.proportion_line.hide();
        
        this.prob_line = this.paper.path("M0 0L0 0");
        this.prob_line.attr("stroke", "#15a315");
        this.prob_line.attr("stroke-width", 3);
        this.prob_line.hide();
        for(var i = 0; i <= 10; i++){
            var x0 = this.plot_x - 5;
            var x1 = this.plot_x + 5;
            var y =  (this.plot_y + this.plot_height) - Math.round(this.plot_height * i / 10);
            var line = this.paper.path("M" + x0 + " " + y + "L" + x1 + " " + y);
            line.attr("stroke", "#333");
            var text = this.paper.text(x0 - 10, y, i / 10);
            text.attr("font-size", "14");
            text.attr("fill", "#333");
            text.attr("font-family", "Arial");
            text.attr("text-anchor", "end");
        }
        for(i = 0; i <= 1; i++){
            var y0 = this.plot_y + this.plot_height - 5;
            var y1 = this.plot_y + this.plot_height + 5;
            var x =  this.plot_x + Math.round(this.plot_width * i);
            var line = this.paper.path("M" + x + " " + y0 + "L" + x + " " + y1);
            line.attr("stroke", "#333");
            /*var text = this.paper.text(x, y1 + 10, this.times * i);
            text.attr("font-size", "14");
            text.attr("fill", "#292929");
            text.attr("font-family", "Arial");*/
        }
        
    };
    this.get_coeff_x  = function (){
        return this.plot_width / this.Xscale;
    };
    
    this.update_plot = function(){
        if(this.len > this.Xscale){
            this.Xscale += Math.round(this.Xscale * 0.2);
            this.update_bound_text();
        }
        var text = "Heads = " + get_sum_X() + "/" + this.len + " = " + (Math.round(get_mean_X() * 10000) / 10000).toFixed(3);
        this.hText.attr("text", text);
        text = "Tails = " + (this.len - get_sum_X()) + "/" + this.len + " = " + (Math.round((this.len - get_sum_X()) / this.len * 10000) / 10000).toFixed(3);
        this.tText.attr("text", text);
        
        var path;
        if (this.hProp[0] == 1) {
        	path = "M" + this.plot_x + " " + (this.plot_y);
        } else {
        	path = "M" + this.plot_x + " " + (this.plot_y + this.plot_height);
        }
        var coeff = this.get_coeff_x();
        for(var i = 1; i < this.hProp.length; i++)
            path += "L" + (this.plot_x + Math.round(i * coeff)) + " " + 
            ((this.plot_y + this.plot_height) - Math.round(this.plot_height * this.hProp[i]));
        this.proportion_line.attr("path", path);
        
        this.hBar.attr("width", Math.round((this.width - 40) * this.hProp[this.len - 1]));
        this.hBar.attr("fill", "#009");
        this.tBar.attr("x", 20 + Math.round((this.width - 40) * this.hProp[this.len - 1]));
        this.tBar.attr("width", Math.round((this.width - 40) * (1 - this.hProp[this.len - 1])));
        this.tBar.attr("fill", "#090");
      
    }
    
    this.update_pline = function(){
        if($("#trueProb").is(':checked')){
            var y = ((this.plot_y + this.plot_height) - Math.round(this.plot_height * this.prob));
            this.prob_line.attr("path", "M" + this.plot_x + " " + y + "L" 
                + (this.plot_x + this.plot_width) + " " + y);
            this.prob_line.show();
        } else 
            this.prob_line.hide();
    }
    
    this.update_bound_text = function(){
        this.xBound_text.attr("text", this.Xscale);
    }
    
    this.timer = function(){
        if(this.count < this.times){
            this.toss(this.prob);
            this.update_plot();
        } else {
            this.count = 0;
            clearInterval(this.intervalID);
            this.intervalID = 0;
        }
    } 
    this.reset = function(){
        
        this.paper.clear();
        this.create_plot();
        this.update_pline();
        this.Xscale = 10;
        this.hProp = new Array();
        Xmas = new Array();
        this.len = 0;
        this.count = 0;
    }
    this.initialize = function (){
        this.width = $("#notepad").width();
        this.height = $("#notepad").height();
        this.paper = Raphael(document.getElementById("notepad"), this.width, this.height);
        this.create_plot();
        $("#tTimes").val(this.times);
        $("#pHead").val(this.prob);
        $("#s_button").click(function(){
            if(module_main.intervalID == 0){
                module_main.intervalID = setInterval('module_main.timer()', module_main.timer_delay);

            	// first toss happens right away
            	module_main.timer();

                module_main.proportion_line.show();
            }
        });
        $("#c_button").click(function(){
            if(module_main.intervalID != 0){
                clearInterval(module_main.intervalID);
                module_main.intervalID = 0;
            }
            module_main.reset();
        });

        $(function() {
            $( "#prob_heads_slider" ).slider({
                range: "min",
                value: 50,
                min: 0,
                max: 100,
                slide: function( event, ui ) {
                	$( "#prob_heads" ).val((ui.value / 100).toFixed(2));
                    module_main.prob = $( "#prob_heads" ).val();
		            module_main.update_pline();
                }                
            });
            $("#prob_heads").val(.50);
        });

        $(function() {
            $( "#num_trials_slider" ).slider({
                range: "min",
                value: 5,
                min: 1,
                max: 9,
                slide: function( event, ui ) {
                    if(ui.value == 1) $( "#num_trials" ).val(1);
                    if(ui.value == 2) $( "#num_trials" ).val(2);
                    if(ui.value == 3) $( "#num_trials" ).val(5);
                    if(ui.value == 4) $( "#num_trials" ).val(10);
                    if(ui.value == 5) $( "#num_trials" ).val(15);
                    if(ui.value == 6) $( "#num_trials" ).val(25);
                    if(ui.value == 7) $( "#num_trials" ).val(50);
                    if(ui.value == 8) $( "#num_trials" ).val(100);
                    if(ui.value == 9) $( "#num_trials" ).val(200);
                    module_main.times = $( "#num_trials" ).val() * 1;

					// set timer_delay based on number of tosses
					if (module_main.times == 1) {
						module_main.timer_delay = 5;
					} else if (module_main.times <= 20) {
						module_main.timer_delay = 500;
					} else if (module_main.times <= 50) {
						module_main.timer_delay = 250;
					} else if (module_main.times <= 100) {
						module_main.timer_delay = 100;
					} else {
						module_main.timer_delay = 50;
					}
                }                
            });
            $("#num_trials").val(module_main.times);
        });

        $("#trueProb").click(function(){
            module_main.update_pline();
        });
    }
}

$(window).load(function(){
    module_main.initialize();
});
