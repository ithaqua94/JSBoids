/*
  Contains the rules for the birds - put into this separate file
      for organizational reasons

  Note: must source the vector.js file before sourcing this file

  All rule code based on Craig W. Reynolds pseudocode:
          http://www.vergenet.net/~conrad/boids/pseudocode.html
*/


// Rule1 - Attraction: seek to get the center of noticed mass
function attractionRule(bg, b) {
  if (bg === 'undefned' || b === 'undefined') {
    throw "Function requires two arguments."
  } else if (!(bg instanceof Array) || !(b instanceof Bird)) {
    throw "Function requires a bird array and a single Bird respectively."
  }

  var center = new Vector(0,0);
  var count = 0;
  for (var i = 0; i < bg.length; i++) {
    var distance = b.location.dist(bg[i].location);
    if (bg[i] != b && distance < b.attractDistance) {
      center.add(bg[i].location);
      count++;
    }
  }
  if (count > 0) center.div(count);
  return center;
}

// Rule2 - Aversion: keep min distance from other birds
function aversionRule(bg,b) {
  if (bg === 'undefned' || b === 'undefined') {
    throw "Function requires two arguments."
  } else if (!(bg instanceof Array) || !(b instanceof Bird)) {
    throw "Function requires a bird array and a single Bird respectively."
  }

  var aversion = new Vector(0,0);
  var count = 0;
  for (var i = 0; i < bg.length; i++) {
    var dist = bg[i].location.dist(b.location);
    if (bg[i] != b && dist < b.minimumDistance && dist > 0) {
      aversion.sub(bg[i].location.diff(b.location));
      count++;
    }
  }

  if(count > 0) aversion.div(count);

  return aversion;
}

// Rule3 - Alignment: try to match velocity vectors of surrounding birds
function alignmentRule(bg,b) {
  if (bg === 'undefned' || b === 'undefined') {
    throw "Function requires two arguments."
  } else if (!(bg instanceof Array) || !(b instanceof Bird)) {
    throw "Function requires a bird array and a single Bird respectively."
  }

  var groupVelocity = new Vector(0,0);
  var count = 0;
  for (var i = 0; i < bg.length; i++) {
    var distance = bg[i].location.dist(b.location);
    if(bg[i] != b && distance < b.alignDistance) {
      groupVelocity.add(bg[i].velocity);
      count++;
    }
  }

  if (count > 0) groupVelocity.div(count);
  return groupVelocity;
}
