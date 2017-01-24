var Vector = function(x,y) {
  if(x === 'undefined') x = 0;
  if(y === 'unedfined') y = 0;
  this.x = x;
  this.y = y;
}

Vector.prototype.add = function(vec) {
  this.x += vec.x;
  this.y += vec.y;
}
Vector.prototype.sum = function(vec) {
  return new Vector(this.x + vec.x, this.y + vec.y);
}

Vector.prototype.sub = function(vec) {
  this.x -= vec.x;
  this.y -= vec.y;
}
Vector.prototype.diff = function(vec) {
  return new Vector(this.x - vec.x, this.y - vec.y);
}

Vector.prototype.mult = function(val) {
  this.x *= val;
  this.y *= val;
}
Vector.prototype.product = function(val) {
  return new Vector(this.x * val, this.y * val);
}

Vector.prototype.div = function(val) {
  this.x /= val;
  this.y /= val;
}
Vector.prototype.quotient = function(val) {
  return new Vector(this.x / val, this.y / val);
}

Vector.prototype.limit = function(limit) {
  var mag = this.mag();
  if (mag != 0 && mag > limit) {
    this.x *= limit / mag;
    this.y *= limit / mag;
  }
}

Vector.prototype.dot = function(vec) {
  return this.x * vec.x + this.y * vec.y;
}

Vector.prototype.toText = function() {
  return "Vector - x: " + this.x + ", y: " + this.y;
}

Vector.prototype.normalize = function() {
  var mag = this.mag();
  if (mag != 0) {
    this.x /= mag;
    this.y /= mag;
  }
}

Vector.prototype.heading = function() {
  return Math.atan2(this.y, this.x);
}

Vector.prototype.mag = function() {
  return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
}

Vector.prototype.dist = function(vec) {
  return Math.sqrt(Math.pow(this.x - vec.x, 2) + Math.pow(this.y - vec.y, 2));
}

// Vector Functions

// All angle's are done with radians in this app
function vectorAngleBetween(vec1, vec2) {
  if (vec1 === 'undefned' || vec2 === 'undefined') {
    throw "Function requires two arguments."
  } else if (!(vec1 instanceof Vector) || !(vec2 instanceof Vector)) {
    throw "Function requires two vectors to work."
  }

  return Math.acos(vec1.dot(vec2) / (vec1.mag() * vec2.mag()));
}
