//adaptiveUI.js is a simple use of the devicemotion events of mobile device browsers

//it's a proof of concept for determining physical contexts based on the devices movements
//and then adapting a UI based on this
  
//for example, when we detect that the device is shaking, we adapt the UI to make buttons easier to hit

var adaptiveUI = {
	//adaptiveUI object 
	//use this to respond to device motion
	
	changeCallback: null, //set a callback function which is called when the state is changed
	
	motionInterval: 500, 
	//set the interval in ms that you want to check for shaking over 
	//devicemotion events fire hundreds of times a second, and provcessing each one will chew battery life
	
	lastMotionEvent: 0, // as yet we've had none, keeps track of when we had the last motion event
	
	remainInState: 5000,
	//when a change in state is detected (e.g. from shaking to non shaking or the other way)
	//how long before we respond to this change (in ms)
	
	lastStateChange: 0, // time the state was last changed from shaking to non-shaking or the other way 
	
	isShaking: 0,	// is the device currently shaking. A number from 0 to 1. 0 is confident not shaking, 1 confident shaking, 
					// fractions are degree of confidence it is shaking  

	isDriving: 0,	// is the device currently being driven. A number from 0 to 1. 0 is confident not driving, 1 confident driving, 
					// fractions are degree of confidence  

	isInCradle: 0,	// is the device currently in a cradle. A number from 0 to 1. 0 is confident not in cradle, 1 confident it is, 
					// fractions are degree of confidence  

	isLyingFlat: 0,	// is the device currently lying flat on a surface. A number from 0 to 1. 0 is confident not lying flat, 1 confident it is, 
					// fractions are degree of confidence
					
	isWalking: 0,	// is the device currently walking. A number from 0 to 1. 0 is confident not walking, 1 confident it is, 
					// fractions are degree of confidence

	isRunning: 0,	// is the device currently walking. A number from 0 to 1. 0 is confident not walking, 1 confident it is, 
					// fractions are degree of confidence
					
	
	start: function(callback){
		//start the adaptiveUI, passing  callback function to be called when a state change occurs
		adaptiveUI.changeCallback = callback
		window.addEventListener('devicemotion', adaptiveUI.motionHandler, false)
	},
	
	stop: function(){
		//start the adaptiveUI	
		window.removeEventListener('devicemotion', adaptiveUI.motionHandler, false)		
	},
	
	isInMotion: function(acX, acY, acZ){
		
		//algorithm shamlessly ripped off from 
		//http://stackoverflow.com/questions/8310250/how-to-count-steps-using-an-accelerometer

		var threshold = 1.2; //vary this up and down to be more or less tolerant of shaking
		var deviceIsInMotion = 0;
		
		if ((acX > threshold) || (acX < threshold * -1)) {
			deviceIsInMotion = 1
		}
		if ((acY > threshold) || (acY < threshold * -1)) {
			deviceIsInMotion = 1
		}
		if ((acZ > threshold) || (acZ < threshold * -1)) {
			deviceIsInMotion = 1
		}

		return deviceIsInMotion		
	},
	
	motionHandler: function (motionData){
		//an event handler for the deviceOrientation event
		var today = new Date();
		var isShaking = false;
		
		if((today.getTime() - adaptiveUI.lastMotionEvent) > adaptiveUI.motionInterval){	
			//we don't need to check for motion based events all that frequently
			//devicemotion fires hundreds of times a second, so we can save batter life by checking less frequently


			adaptiveUI.isShaking = adaptiveUI.isInMotion(motionData.acceleration.x, motionData.acceleration.y, motionData.acceleration.z)
			//we can provide other detectors here
			
			//we know whether the device is shaking, but do we change the state yet?
			//check how long since we changed the state, and if this exceeds adaptiveUI.remainInState then change it
			
			if((today.getTime() - adaptiveUI.lastStateChange) > adaptiveUI.remainInState){	
				
				adaptiveUI.lastStateChange = today.getTime()
				//record when this state change ocurred
				
				if (adaptiveUI.changeCallback) {
					adaptiveUI.changeCallback.call()
					//if there's a callback function, call it
				}	
			}			
			
			adaptiveUI.lastMotionEvent = today.getTime()

		}
	}

}
