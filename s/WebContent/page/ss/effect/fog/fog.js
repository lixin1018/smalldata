function Fog(){
	var that = this;
	that.containerId;
    that.particles;
    that.particleCount;
    that.maxVelocity;
    that.targetFPS;
    that.mainDiv;
    that.canvasWidth;
    that.canvasHeight;
    that.borderTop;
    that.borderBottom;
    that.imageObj;
    that.context;
    that.backImg;
    	
	this.init = function(p){
		that.containerId = p.containerId;
		
	    // fork of 
	    // http://jsfiddle.net/jonnyc/Ujz4P/5/
	    //
	    // Create an array to store our particles
	    that.particles = [];
	    // The amount of particles to render
	    that.particleCount = 5;
	    // The maximum velocity in each direction
	    that.maxVelocity = 2;
	    // The target frames per second (how often do we want to update / redraw the scene)
	    that.targetFPS = 50;
	    // Set the dimensions of the canvas as variables so they can be used.
	    that.mainDiv = $("#" + that.containerId)[0]; 
	    that.canvasWidth = $(that.mainDiv).width();
	    that.canvasHeight = $(that.mainDiv).height();
	    // borders for particles on top and bottom
	    that.borderTop = 0.01 * that.canvasHeight;
	    that.borderBottom = 0.99 * that.canvasHeight;
	    // Create an image object (only need one instance)
	    that.imageObj = new Image();
	    // Once the image has been downloaded then set the image on all of the particles
	    that.imageObj.onload = function() {
	      	that.particles.forEach(function(particle) {
	        	particle.setImage(that.imageObj);
	      	});
	    };
	    // Once the callback is arranged then set the source of the image
	    that.imageObj.src = "../../effect/fog/smoke.png";
	    
	    // The canvas context if it is defined.
	    that.context = null;
	    
	    // Initialize the scene       
		that.initView();
		
		that.backImg = $("#" + that.containerId).find(".fogBackground")[0];
		// If the context is set then we can draw the scene (if not then the browser does not support canvas)
		if (that.context) {
			setInterval(function() {
				// Update the scene befoe drawing
				that.update();
				// Draw the scene
				that.draw();
			}, 1000 / that.targetFPS);
		}
	}

    // A function to generate a random number between 2 values
    this.generateRandom = function(min, max) {
      	return Math.random() * (max - min) + min;
    }
    // Initialise the scene and set the context if possible
    that.initView = function() {
      	that.mainDiv = $("#" + that.containerId)[0]; 
      	var canvas = $("#" + that.containerId).find(".fogCanvas")[0]; 
      	canvas.width = $(that.mainDiv).width();
      	canvas.height = $(that.mainDiv).height();
      	if (canvas.getContext) {
        	// Set the context variable so it can be re-used
        	that.context = canvas.getContext('2d');
        	// Create the particles and set their initial positions and velocities
        	for (var i = 0; i < that.particleCount; ++i) {
         		var particle = new FogParticle({
         			context: that.context, 
         			canvasWidth: that.canvasWidth,
    				borderTop: that.borderTop,
    				borderBottom: that.borderBottom
     			});
         		// Set the position to be inside the canvas bounds
         		particle.setPosition(that.generateRandom(0, that.canvasWidth), that.generateRandom(that.borderTop, that.borderBottom));
         		// Set the initial velocity to be either random and either negative or positive
         		particle.setVelocity(that.generateRandom(-that.maxVelocity, that.maxVelocity), that.generateRandom(-that.maxVelocity, that.maxVelocity));
         		that.particles.push(particle);
        	}
      	} 
      	else {
        	alert("Please use a modern browser");
      	}
    }
    
    // The function to draw the scene
    this.draw = function() {
      	//  background image
      	that.context.globalAlpha = 1;
		that.context.globalCompositeOperation = 'source-over';
      	that.context.drawImage(that.backImg, 0, 0, that.canvasWidth, that.canvasHeight);
		that.context.globalAlpha = 0.9;      
		that.context.globalCompositeOperation = 'soft-lights';
      	// Fog layer
      	// Go through all of the particles and draw them.
      	that.particles.forEach(function(particle) {
        	particle.draw();
      	});
    }
    
    // Update the scene
    this.update = function() {
      	that.particles.forEach(function(particle) {
        	particle.update();
      	});
    }
}

// A function to create a particle object.
function FogParticle(p) {
	this.context = p.context;
	
  	// Set the initial x and y positions
  	this.x = 0;
  	this.y = 0;
  	
  	// Set the initial velocity
 	this.xVelocity = 0;
  	this.yVelocity = 0;
  	
  	// Set the radius
  	this.radius = 5;
  	
  	// Store the context which will be used to draw the particle
  	this.context = p.context;
  	
  	this.canvasWidth = p.canvasWidth;
  	
  	this.borderBottom = p.borderBottom;
  	this.borderTop = p.borderTop;
  	
  	// The function to draw the particle on the canvas.
  	this.draw = function() {
    	// If an image is set draw it
		if (this.image) {
     		this.context.drawImage(this.image, this.x - 128, this.y - 128);
     		// If the image is being rendered do not draw the circle so break out of the draw function             
     		return;
    	}
        // Draw the circle as before, with the addition of using the position and the radius from this object.
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = "rgba(0, 255, 255, 0.1)";
        this.context.fill();
        this.context.closePath();
	};
	// Update the particle.
	this.update = function() {
		// Update the position of the particle with the addition of the velocity.
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        // Check if has crossed the right edge
        if (this.x >= this.canvasWidth) {
         	this.xVelocity = -this.xVelocity;
         	this.x = this.canvasWidth;
        }
        // Check if has crossed the left edge
        else if (this.x <= 0) {
         	this.xVelocity = -this.xVelocity;
         	this.x = 0;
        }
        // Check if has crossed the bottom edge
        if (this.y >= this.borderBottom) {
         	this.yVelocity = -this.yVelocity;
         	this.y = this.borderBottom;
        }
        // Check if has crossed the top edge
        else if (this.y <= this.borderTop) {
         	this.yVelocity = -this.yVelocity;
         	this.y = this.borderTop;
        }
	};
	// A function to set the position of the particle.
	this.setPosition = function(x, y) {
      	this.x = x;
		this.y = y;
	};
	// Function to set the velocity.
	this.setVelocity = function(x, y) {
        this.xVelocity = x;
        this.yVelocity = y;
	};
	this.setImage = function(image) {
		this.image = image;
	};
}