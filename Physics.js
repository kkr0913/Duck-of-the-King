function Physics(initialVec) {
	this.mass = 1;                                // mass
	this.g = -0.006;                              // gravitational acceleration
	this.mu = 0.05;                               // friction coefficient
  this.pos = initialVec;                        // position (set to initial position)
  this.vel = createVector(0, 0);                // velocity
  this.acc = createVector(0, 0);                // acceleration
	this.ratio = createVector(w*0.001, h*0.001);  // make the vector a multiple of width & height
}

Physics.prototype.update = function() {
	this.applyForce(new p5.Vector(0, 0));
}

Physics.prototype.constantForce = function() {
	this.gravity();
	this.normalForce();
	this.friction();
	// boundaries
	if (this.pos.x < 0) { this.pos.x = 0; this.vel.x *= 0; }
	if (this.pos.x > w*0.4) { this.pos.x = w*0.4; }
}

Physics.prototype.applyForce = function(force, bool=true) {
  var pos_vec = createVector(0, 0);
	var a = force.div(this.mass);
  this.acc.add(a);
	this.vel.add(this.acc);
  pos_vec.add(this.vel);
	pos_vec.x *= this.ratio.x;
	pos_vec.y *= this.ratio.y;
	if (bool) { this.pos.add(pos_vec); }
	if (!bool) { this.pos.x += pos_vec.x; }
  this.acc.set(0, 0);
}

Physics.prototype.removeForce = function() {
	this.vel.set(new p5.Vector(0, 0));
	this.acc.set(new p5.Vector(0, 0));
}
	
Physics.prototype.moveX = function(x) {
	var v = createVector(x, 0);
	v.x *= this.ratio.x;
	v.y *= this.ratio.y;
	if (abs(this.vel.x) <= w * 0.001) {	this.applyForce(v, false); }
	if (abs(this.vel.x) > w * 0.001) { this.vel.x = round(this.vel.x/abs(this.vel.x)) * w * 0.001; }
}

Physics.prototype.gravity = function(s=1) {
	var gravity = createVector(0, this.mass * this.g * this.pos.y * s);
	this.applyForce(gravity);
}

Physics.prototype.normalForce = function() {
  if (this.pos.y < 0) {
    this.vel.y *= 0;
    this.pos.y = 0;
  }
}

Physics.prototype.friction = function() {
  if ((!keyIsDown(LEFT_ARROW)) && (!(keyIsDown(RIGHT_ARROW)) && (!midair))) {
		var Ff = createVector(0, 0);
		Ff.x = (-this.mu) * this.vel.x;
		this.applyForce(Ff);
	}
}