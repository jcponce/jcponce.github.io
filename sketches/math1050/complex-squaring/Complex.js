/*
Originally written by Jeffrey Ventrella (http://ventrella.com/)
 
Original code: http://ventrella.com/ComplexSquaring/

Adapted by Juan Carlos Ponce Campuzano 2019
*/
var canvasID = document.getElementById( 'Canvas' );
var canvas = canvasID.getContext( '2d' );

//------------------
function Complex()
{	
	//--------------------------------
	// CONSTANTS
	//--------------------------------
	var MILLISECONDS_PER_UPDATE = 33;
	var NUM_POINTS       = 400;
	var WINDOW_SIZE      = 600;
	var SCALE            = 170;
	var LEFT_MARGIN      = 20;
	var MULT_RADIUS      = 6.0;
    var RADIUS           = 3.5;
    var START_DELAY      = 30;
    var INTERP_DURATION  = 30;
	var BUTTON_WIDTH     = 50;
	var BUTTON_HEIGHT    = 30;
	var BUTTON_MARGIN    = 5;
	var PI2              = Math.PI * 2.0;
	var WINDOW_MID       = WINDOW_SIZE / 2;
	var BACKGROUND_COLOR = "rgb( 240, 240, 240 )";
	var GRAPH_COLOR      = "rgb(  0, 0, 0 )";
	var DOT_COLOR        = "rgb( 10, 100, 150 )";
	var MULT_COLOR       = "rgb( 255,  50,  50 )";
	var TEXT_COLOR       = "rgb( 0, 0, 0 )";
	
	var BUTTON_FULL_RANDOMIZE      = 0;
	var BUTTON_DISK_RANDOMIZE      = 1;
	var BUTTON_CIRCLE_RANDOMIZE    = 2;
	var BUTTON_REAL_RANDOMIZE      = 3;
	var BUTTON_IMAGINARY_RANDOMIZE = 4;
	var BUTTON_CORNERS_RANDOMIZE   = 5;
	var BUTTON_MULTIPLY            = 6;
	var BUTTON_SQUARE	           = 7;
	var NUM_BUTTONS                = 8;

	//--------------------------------
	// variables
	//--------------------------------
	function Button()
	{
		this.x	= 0;
		this.y  = 0;
		this.w	= 0;
		this.h	= 0;
	}	
	
	function ComplexNumber()
	{
		this.x = 0.0;
		this.y = 0.0;
	}		
	
    var mouseX = 0;
    var mouseY = 0;
    var multX  = 1.0;
    var multY  = 0.0;
	var startClock = 0;
	var animationClock = 0;
	var currentNum  = new Array( ComplexNumber ); 
	var previousNum = new Array( ComplexNumber ); 
	var interpNum   = new Array( ComplexNumber ); 
	var draggingMultiplier = false;
	var mouseOverMultiplier = false;
	
	var button = new Array( Button  );
	
    for (var i=0; i<NUM_POINTS; i++)
    {
        currentNum [i] = new ComplexNumber();
        previousNum[i] = new ComplexNumber();
        interpNum  [i] = new ComplexNumber();
    }	
    
	var mouseDown  = false;
	var mouseX     = 0;
	var mouseY     = 0;
	var lastMouseX = 0;
	var lastMouseY = 0;

    //------------------------------------------------------------
	// start up the timer
	//------------------------------------------------------------
    this.timer = setTimeout( "complex.update()", MILLISECONDS_PER_UPDATE );		
	
	

	//----------------------------------
	this.createButtons = function() 
	{
        var left = LEFT_MARGIN;

	    for (var b=0; b<NUM_BUTTONS; b++)
		{
    	    button[b] = new Button();
            button[b].w = BUTTON_WIDTH;
            button[b].h = BUTTON_HEIGHT;
            button[b].x = left;
        }

        button[ BUTTON_SQUARE ].w = 110;
	    button[ BUTTON_SQUARE ].y = 60;

        var yy = 140;
        var s = BUTTON_HEIGHT + 7;
        
	              button[ BUTTON_FULL_RANDOMIZE      ].y = yy;
        yy += s;  button[ BUTTON_DISK_RANDOMIZE      ].y = yy;
	    yy += s;  button[ BUTTON_CIRCLE_RANDOMIZE    ].y = yy;
	    yy += s;  button[ BUTTON_REAL_RANDOMIZE      ].y = yy;
	    yy += s;  button[ BUTTON_IMAGINARY_RANDOMIZE ].y = yy;
	    yy += s;  button[ BUTTON_CORNERS_RANDOMIZE   ].y = yy;
	    yy += s;  button[ BUTTON_MULTIPLY            ].y = yy;
	}

	
	//------------------------
	this.update = function()
	{
	    if ( startClock < START_DELAY )
	    {
    	    startClock ++;
    	    
    	    if ( startClock == START_DELAY )
    	    {
        	    this.startSquare();
    	    }
	    }
	    
	    if ( animationClock < INTERP_DURATION )
	    {
       	    animationClock ++;
    	    
            var f = animationClock / INTERP_DURATION;
            var w = 0.5 - 0.5 * Math.cos( f * Math.PI );

            for (var i=0; i<NUM_POINTS; i++)
            {
                interpNum[i].x = previousNum[i].x + ( currentNum[i].x - previousNum[i].x ) * w;
                interpNum[i].y = previousNum[i].y + ( currentNum[i].y - previousNum[i].y ) * w;
	        }
	        
            if ( animationClock == INTERP_DURATION )
	        {
	            this.reset();
	        }	        
	    }
	    
	    
		//---------------------------
		// render everything...
		//---------------------------
		this.render();
        
		//---------------------------
		// trigger next update...
		//---------------------------
        this.timer = setTimeout( "complex.update()", MILLISECONDS_PER_UPDATE );
	}
	
	

	//----------------------------
    this.reset = function()
    {	
        for (var i=0; i<NUM_POINTS; i++)
        {
            previousNum[i].x = currentNum[i].x;
            previousNum[i].y = currentNum[i].y;
        }
	}
	
	
	//----------------------------
    this.randomize = function( mode )
    {
        animationClock = INTERP_DURATION;
        
        for (var i=0; i<NUM_POINTS; i++)
        {
            if ( mode == BUTTON_FULL_RANDOMIZE )
            {
                var range = 3.5;
                currentNum[i].x = -range / 2.0 + Math.random() * range;
                currentNum[i].y = -range / 2.0 + Math.random() * range;
            }
            else if ( mode == BUTTON_REAL_RANDOMIZE )
            {
                var range = 3.5;
                currentNum[i].x = -range / 2.0 + Math.random() * range;
                currentNum[i].y = 0.0;
            }
            else if ( mode == BUTTON_IMAGINARY_RANDOMIZE )
            {
                var range = 3.5;
                currentNum[i].x = 0.0;
                currentNum[i].y = -range / 2.0 + Math.random() * range;
            }
            else if ( mode == BUTTON_CIRCLE_RANDOMIZE )
            {            
                var angle = Math.random() * PI2;
                currentNum[i].x = Math.sin( angle );
                currentNum[i].y = Math.cos( angle );
            }            
            else if ( mode == BUTTON_DISK_RANDOMIZE )
            {            
                var f = i / NUM_POINTS;
                
                var angle = Math.random() * PI2;
                var radius = Math.sqrt(f);
                currentNum[i].x = radius * Math.sin( angle );
                currentNum[i].y = radius * Math.cos( angle );
            }            
            else if ( mode == BUTTON_CORNERS_RANDOMIZE )
            {         
                currentNum[i].x = 0.0;
                currentNum[i].y = 0.0;
                
                     if (( i >= NUM_POINTS * 0.00 ) && ( i <= NUM_POINTS * 0.25 )) { currentNum[i].x =  1.0; }
                else if (( i >= NUM_POINTS * 0.25 ) && ( i <= NUM_POINTS * 0.50 )) { currentNum[i].x = -1.0; }
                else if (( i >= NUM_POINTS * 0.50 ) && ( i <= NUM_POINTS * 0.75 )) { currentNum[i].y =  1.0; }
                else if (( i >= NUM_POINTS * 0.75 ) && ( i <= NUM_POINTS * 1.00 )) { currentNum[i].y = -1.0; }            

                var range = 0.1;
                var jitterX = -range / 2.0 + Math.random() * range;
                var jitterY = -range / 2.0 + Math.random() * range;
                
                var d = Math.sqrt( jitterX * jitterX + jitterY * jitterY );
                if ( d > range / 2.0 )
                {
                    jitterX = 0.0;
                    jitterY = 0.0;
                }
                
                currentNum[i].x += jitterX;
                currentNum[i].y += jitterY;
            }            
            
            previousNum[i].x = currentNum[i].x;
            previousNum[i].y = currentNum[i].y;

            interpNum[i].x = currentNum[i].x;
            interpNum[i].y = currentNum[i].y;
        }	            
    }


	//-------------------------------------------
    this.getMagnitude = function( number )
    {
        var xx = number.x * number.x;
        var yy = number.y * number.y;
        
        return Math.sqrt( xx*xx + yy*yy );
    }
    

	//----------------------------
    this.startSquare = function()
    {
        animationClock = 0;

        for (var i=0; i<NUM_POINTS; i++)
        {
            currentNum[i] = this.squareIt( currentNum[i] );
        }
    }

	//--------------------------------
	this.squareIt = function( number )
	{
	    squared = new ComplexNumber();
	 
	    squared.x = ( number.x * number.x ) - ( number.y * number.y ); 
	    squared.y = ( number.x * number.y ) + ( number.x * number.y ); 
	    
	    return squared;
    }

    
	//-------------------------
	this.render = function()
	{
		//-------------------------------------------
		// clear the screen
		//-------------------------------------------
		canvas.fillStyle = BACKGROUND_COLOR;		
		canvas.fillRect( 0, 0, WINDOW_SIZE, WINDOW_SIZE );
		
		//-------------------------------------------
		// draw the graph
		//-------------------------------------------
		canvas.lineWidth = 2;
        canvas.strokeStyle = GRAPH_COLOR;
        canvas.beginPath();
        canvas.arc( WINDOW_MID, WINDOW_MID, SCALE, 0, 2 * Math.PI );
        canvas.stroke();
        
        canvas.beginPath();
        canvas.moveTo( WINDOW_MID - SCALE, WINDOW_MID );            
        canvas.lineTo( WINDOW_MID + SCALE, WINDOW_MID );
        canvas.stroke();
        canvas.closePath();	 

        canvas.beginPath();
        canvas.moveTo( WINDOW_MID, WINDOW_MID - SCALE );            
        canvas.lineTo( WINDOW_MID, WINDOW_MID + SCALE );
        canvas.stroke();
        canvas.closePath();	 
        
        canvas.font = ( 20 ) + "px Times";
        canvas.fillStyle = TEXT_COLOR; 
        canvas.fillText( "1",  WINDOW_MID + SCALE + 10, WINDOW_MID - 20 );
        canvas.fillText( "-1", WINDOW_MID - SCALE - 26, WINDOW_MID - 20 );
        canvas.fillText( "i",  WINDOW_MID - 5,          WINDOW_MID - SCALE - 30 );
        canvas.fillText( "-i", WINDOW_MID - 10,         WINDOW_MID + SCALE + 10 );
                
		//-------------------------------------------
		// draw the dots
		//-------------------------------------------
        canvas.fillStyle = DOT_COLOR;	
        for (var i=0; i<NUM_POINTS; i++)
        {
            var x = WINDOW_MID + interpNum[i].x * SCALE;
            var y = WINDOW_MID + interpNum[i].y * SCALE;
            canvas.beginPath();
            canvas.arc( x, y, RADIUS, 0, 2 * Math.PI );
            canvas.fill();
            canvas.lineWidth = 0.7;
            canvas.strokeStyle = "rgb(230, 230, 230 )";
            canvas.stroke();
            canvas.closePath();     
        }  
        
		//-------------------------------------------
		// draw the multiplier
		//-------------------------------------------
        canvas.fillStyle = MULT_COLOR;	
        var mx = WINDOW_MID + multX * SCALE;
        var my = WINDOW_MID + multY * SCALE;
        canvas.beginPath();
        canvas.arc( mx, my, MULT_RADIUS, 0, 2 * Math.PI );
        canvas.fill();
        canvas.closePath();   
        
        if ( mouseOverMultiplier )
        {
            canvas.strokeStyle = "rgb(250, 100, 100 )";	
            canvas.beginPath();
            canvas.arc( mx, my, 20.0, 0, 2 * Math.PI );
            canvas.stroke();
            canvas.closePath();   
        }
        

		//-------------------------------------------
		// draw the title
		//-------------------------------------------
        //canvas.font = ( 20 ) + "px Arial";
        //canvas.fillStyle = TEXT_COLOR; 
        //canvas.fillText( "Squaring Complex Numbers", LEFT_MARGIN, 20 );  

        // "randomize"
        canvas.font = ( 15 ) + "px Arial";
        canvas.fillStyle = "rgb( 20, 20, 20 )"; 
        canvas.fillText( "Randomize", LEFT_MARGIN, 120 );  

		//-------------------------------------------
		// draw the buttons....
		//-------------------------------------------
        this.renderButtons();
        
		//-------------------------------------------
		// draw a frame around everything....
		//-------------------------------------------
		canvas.lineWidth = 1;
		canvas.strokeStyle = "rgb( 200, 200, 200 )"; 		
		canvas.strokeRect( 1, 1, WINDOW_SIZE-2, WINDOW_SIZE-2 );
	}
	
	

	//------------------------------
	this.renderButtons = function()
	{
		for (var b=0; b<NUM_BUTTONS; b++)
		{
		    if ( b == BUTTON_MULTIPLY )
		    {
                canvas.fillStyle = MULT_COLOR;	
                var mx = button[b].x + 50;
                var my = button[b].y + button[b].h * 0.4;
                canvas.beginPath();
                canvas.arc( mx, my, MULT_RADIUS, 0, 2 * Math.PI );
                canvas.fill();
                canvas.closePath(); 		    
		    }
		    else
		    {
                canvas.fillStyle = "rgb( 70, 80, 90 )"; 			
                canvas.fillRect( button[b].x, button[b].y, button[b].w, button[b].h );
        
                canvas.strokeStyle = "rgb( 120, 140, 160 )"; 			
                canvas.strokeRect( button[b].x, button[b].y, button[b].w, button[b].h );
                
                canvas.fillStyle    = "rgb( 220, 220, 220 )"; 
                canvas.font         = '15px sans-serif';
                canvas.textBaseline = 'top';
			}
			
            canvas.fillStyle = "rgb( 220, 220, 220 )"; 			


			     if ( b == BUTTON_FULL_RANDOMIZE      ) {	canvas.fillText  ('Full',         button[b].x + 5, button[b].y + 5 ); }
			else if ( b == BUTTON_CIRCLE_RANDOMIZE    ) {	canvas.fillText  ('Circle',       button[b].x + 5, button[b].y + 5 ); }
			else if ( b == BUTTON_REAL_RANDOMIZE      ) {	canvas.fillText  ('Re',         button[b].x + 5, button[b].y + 5 ); }
			else if ( b == BUTTON_IMAGINARY_RANDOMIZE ) {	canvas.fillText  ('Im',    button[b].x + 5, button[b].y + 5 ); }
			else if ( b == BUTTON_DISK_RANDOMIZE      ) {	canvas.fillText  ('Disk',         button[b].x + 5, button[b].y + 5 ); }
			else if ( b == BUTTON_CORNERS_RANDOMIZE   ) {	canvas.fillText  ('4 cnrs',    button[b].x + 5, button[b].y + 5 ); }
			else if ( b == BUTTON_SQUARE              ) {	canvas.fillText  ('Square them!', button[b].x + 5, button[b].y + 5 ); }
			else if ( b == BUTTON_MULTIPLY ) 
			{
              canvas.fillStyle = "rgb( 20, 20, 20 )"; 	
			    canvas.fillText('drag',        button[b].x + 5, button[b].y + 5 ); 
			    canvas.fillText('to multiply', button[b].x + 5, button[b].y + 20 ); 
			}
		}
	}
	

	//---------------------------------------
	this.resize = function( width, height )
	{
	}
	
	//--------------------------------
	this.mouseDown = function( x, y )
	{
        var mx = WINDOW_MID + multX * SCALE;
        var my = WINDOW_MID + multY * SCALE;

		if (( x > mx - 20 )
		&&  ( x < mx + 20 )
		&&  ( y > my - 20 )
		&&  ( y < my + 20 ))
	    {
    	    draggingMultiplier = true;
	    }

        for (var b=0; b<NUM_BUTTONS; b++)
		{		
			if (( x > button[b].x )
			&&  ( x < button[b].x + button[b].w )
			&&  ( y > button[b].y )
			&&  ( y < button[b].y + button[b].h ))
			{
                if ( b == BUTTON_MULTIPLY )
		    	{
		    	    mouseOverMultiplier = true;
		    	}		
		    	else
		    	{
    		    	this.randomize(b);
	    		    multX = 1.0;
    			    multY = 0.0;
    			    
                    if ( b == BUTTON_SQUARE )
                    {
                        if ( animationClock >= INTERP_DURATION )
                        {
                            this.startSquare();
                        }
		    	    }    			    
		    	}
		    }
	    }
	}
	

	//-------------------------------
	this.multiply = function()
	{    	    
        for (var i=0; i<NUM_POINTS; i++)
        {
    	  interpNum[i].x = ( previousNum[i].x * multX ) - ( previousNum[i].y * multY ); 
	      interpNum[i].y = ( previousNum[i].x * multY ) + ( previousNum[i].y * multX ); 
	      
	      currentNum[i].x = interpNum[i].x;
	      currentNum[i].y = interpNum[i].y;
        }	        
	}
	
	
	//-------------------------------
	this.mouseMove = function( x, y )
	{	
        var mx = WINDOW_MID + multX * SCALE;
        var my = WINDOW_MID + multY * SCALE;

		if (( x > mx - 20 )
		&&  ( x < mx + 20 )
		&&  ( y > my - 20 )
		&&  ( y < my + 20 ))
	    {
    	    mouseOverMultiplier = true;
	    }
	    else
	    {
    	    mouseOverMultiplier = false;
	    }
	
	    if ( draggingMultiplier )
	    {
            var xf = -0.5 + x / WINDOW_SIZE;
            var yf = -0.5 + y / WINDOW_SIZE;
            multX = xf * ( WINDOW_SIZE / SCALE );
            multY = yf * ( WINDOW_SIZE / SCALE );
	    
    	    this.multiply();
	    }
	}
	
	
	//-------------------------------
	this.mouseUp = function( x, y )
	{
    	mouseOverMultiplier = false;
    	
    	if ( draggingMultiplier )
    	{
    	    draggingMultiplier = false;
	        this.reset();
	        
	        multX = 1.0;
	        multY = 0.0;
	    }
	}
	
	//--------------------------------------------------------
	// Let's start things rolling
	//--------------------------------------------------------

    //----------------------
    // randomize numbers
    //----------------------
    this.randomize( BUTTON_DISK_RANDOMIZE );
    this.createButtons();
    
    animationClock = INTERP_DURATION;
}



//--------------------------------
document.onmousedown = function(e) 
{
    mouseX = e.pageX - canvasID.offsetLeft;
    mouseY = e.pageY - canvasID.offsetTop;
  
    complex.mouseDown( mouseX, mouseY );
}

//---------------------------------
document.onmousemove = function(e) 
{
    mouseX = e.pageX - canvasID.offsetLeft;
    mouseY = e.pageY - canvasID.offsetTop;

    complex.mouseMove( mouseX, mouseY );
}

//-------------------------------
document.onmouseup = function(e) 
{
    mouseX = e.pageX - canvasID.offsetLeft;
    mouseY = e.pageY - canvasID.offsetTop;

    complex.mouseUp( mouseX, mouseY );
}


