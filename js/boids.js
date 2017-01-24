// Boids flocking simulation
// Simulates the flocking of birds or fishes in a 2d environment
// Designed using the 3 rule method which use the sums of several rules to
//  determine the "birds" velocity and then adds this to their location

// Referenced mschristenser's code to create the drawing canvas properly:
//      https://github.com/mschristensen/BoidsCanvas/blob/master/boids-canvas.js
// All other code referenced from my Java version, if you'd like to see a copy
//  of my Java source code email me at: mikeandike2013@gmail.com
// The vector.js (class) file is requirement for this application to properly
//  give vector math a stand in this environment


var Boids = function(div) {
  this.parentDiv = div;
  this.parentDiv.size = {
    'width': this.parentDiv.offsetWidth,
    'height': this.parentDiv.offsetHeight
  }

  this.init();
}

Boids.prototype.init = function() {
  this.bgDiv = document.createElement('div');
  this.parentDiv.appendChild(this.bgDiv);
  this.bgDiv.setAttribute("style",
    'position: absolute; top: 0;left: 0;bottom: 0;right: 0;'+
    'z-index: 1;background: #333333;');

  this.canvas = document.createElement('canvas');
  this.parentDiv.appendChild(this.canvas);
  this.context = this.canvas.getContext('2d');
  this.canvas.width = this.parentDiv.size.width;
  this.canvas.height = this.parentDiv.size.height;
  this.parentDiv.setAttribute("style",'position:relative;');
  this.canvas.setAttribute("style",'z-index: 5;position: relative;');

  // for dynamic canvas container sizes - in my demo apps this will not occur
  window.addEventListener('resize', function() {
    if(this.parentDiv.offsetWidth === this.canvas.width &&
       this.parentDiv.offsetHeight === this.canvas.height) {
         return false;
    }

    this.canvas.width = this.parentDiv.size.width = this.parentDiv.offsetWidth;
    this.canvas.height = this.parentDiv.size.height = this.parentDiv.offsetHeight;

    this.initialiseBoids();
  }.bind(this));

  this.initialiseBoids();
  requestAnimationFrame(this.update.bind(this));
}

Boids.prototype.initialiseBoids = function() {
  this.birds = [];
  this.fpsInt = 1000 / 60;
  this.then = Date.now();
  this.startTime = this.then;
  this.elapsed = 0;

  for (var i = 0; i < 80; i++) {
    var location = new Vector(Math.floor(Math.random()*(this.canvas.width)),
                              Math.floor(Math.random()*(this.canvas.height)));
    var maxSpeed = 5;
    var maxTurn = (60 * Math.PI) / 180;
    var velocity = new Vector(1,0);
    this.birds.push(new Bird(this,location,velocity));
  }
}

Boids.prototype.update = function() {
  this.now = Date.now();
  this.elapsed = this.now - this.then;
  if (this.elapsed > this.fpsInt) {
    this.then = this.now - (this.elapsed % this.fpsInt);

    // Clears canvas
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    //this.context.globalAlpha = 1;

    // Update and draw
    for (var i = 0; i < this.birds.length; i++) {
      this.birds[i].update();
      this.birds[i].draw();
    }
  }

  // Requests browser to get new canvas frame using specified function
  // (i.e. recursively updating)
  requestAnimationFrame(this.update.bind(this));

}


var Bird = function(parent, location, velocity) {
  // Dynamic settings
  this.included = false;
  this.selected = false;
  this.selectView = false;
  this.location = new Vector(location.x, location.y);
  this.velocity = new Vector(velocity.x, velocity.y);
  this.acceleration = new Vector(0, 0);
  this.debugTick = 0;

  // Static settings
  this.parent = parent;
  this.maxSpeed = 4;
  this.minSpeed = 4;
  this.maxAccel = 0.4;
  this.maxTurn = 60 * (Math.PI / 180);
  this.sightDistance = 150.0;
  this.attractDistance = 125;
  this.minimumDistance = 30;
  this.alignDistance = 100;
  this.peripheryAngle = 120 * (Math.PI / 180);

  this.outlineColor = "#FFFFFF";
  this.fillColor = "#FFFFFF";
  this.sleectedColor = "#FF0000";
  this.viewedColor = "#FF00FF";
}

Bird.prototype.draw = function() {
  var context = this.parent.context;
  if (this.debugTick < 1) {
    this.debugTick++;
  }
  // rotates and restores context to prevent messing with other
  context.save();
  context.beginPath();
  context.strokeStyle = this.outlineColor;
  context.fillStyle = this.fillColor;
  context.translate(this.location.x,this.location.y);
  context.rotate(this.velocity.heading() + Math.PI / 2);
  context.moveTo(0,-6);
  context.lineTo(-3,6);
  context.lineTo(3,6);
  context.closePath();
  context.stroke();
  context.fill();
  context.restore();
}

// Update velocities and location with rules
Bird.prototype.update = function() {
//  this.location.add(this.velocity);

  // birdgroup
  var bg = boids.birds;
  //viewable()
  var rule1 = attractionRule(bg,this);
  var rule2 = aversionRule(bg,this);
  var rule3 = alignmentRule(bg,this);
  var drift = new Vector(0.4,0.5);


  // Balance rules
  rule1 = this.balanceRule(rule1);
  rule2 = this.balanceRule(rule2);
  rule3 = this.balanceRule(rule3);

  // Weight rules
  rule1.mult(1.7);
  rule2.mult(2.5);
  rule3.mult(1.3);

  this.acceleration.add(rule1);
  this.acceleration.add(rule2);
  this.acceleration.add(rule3);
  this.acceleration.add(drift);

  var prevVelo = this.velocity;

  this.velocity.add(this.acceleration);
  this.velocity.limit(this.maxSpeed); // prevent extreme changes

  var anglediff = this.velocity.heading() - prevVelo.heading();
  if(Math.abs(anglediff) > this.maxTurn) {
    var newaccel = new Vector(0,0);
    var newangle = 0.0;
    if(angleDiff > 0) {
      newangle = prevAngle - maxTurn;
    } else {
      newangle = prevAngle + maxTurn;
    }
    newaccel.x = acceleration.mag() * Math.cos(newangle);
    newaccel.y = acceleration.mag() * Math.sin(newangle);
    acceleration = newaccel;
  }

  // update loc
  this.location.add(this.velocity);
  if (this.location.x < 0) this.location.x = this.parent.canvas.width;
  if (this.location.y < 0) this.location.y = this.parent.canvas.height;
  if (this.location.x > this.parent.canvas.width) this.location.x = 0;
  if (this.location.y > this.parent.canvas.height) this.location.y = 0;

  // reset
  this.acceleration.mult(0);
}

Bird.prototype.viewable = function() {
  var bg = boids.birds;
  for (var i = 0; i < bg.length; i++) {
    birds[i].included = false;
    if (this == bg[i]) continue;

    var dist = vectorDist(this.location, bg[i].location);
    if (dist <= 0 || dist > sightDistance) continue;

    var lineBetween = vectorSub(bg[i].location,this.location);
    var angle = vectorAngleBetween(lineBetween, this.velocity);

    if(angle < peripheryAngle) bg[i].included = true;
    if (selected) {
      if(bg[i].included) {
        bg[i].selectView = true;
      } else {
        bg[i].selectView = false;
      }
    }
  }
}

Bird.prototype.balanceRule = function(rule) {
  rule.normalize();
  rule.mult(this.maxSpeed);
  rule.sub(this.velocity);
  rule.limit(this.maxAccel);
  return rule;
}
