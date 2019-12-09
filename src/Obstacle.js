// * * * * * * * * * * *  * * * * * * * * //
// - - - - - - Obstacle Class - - - - - - //
// - - - Manage Obstacle Generation - - - //
// * * * * * * * * *  * * * * * * * * * * //

function Obstacle(pos, vel, proj, obj, objvel) {
	this.duckPos = pos;
	this.projPos = proj;
	this.objPos = obj;
	this.objVel = objvel;
	this.pos = createVector(2*w, h*0.9);
	this.vel = vel;
	this.obs = '';
	this.obsW = 0;
	this.obsH = 0;
	this.genBool = 0;
}

// * Generate Obstacle * //
Obstacle.prototype.generate = function() {
	if (abs(map(this.vel.x, 0, w*0.001, 0, 100)) > 80) { this.genBool = setProb(random(0.001, 0.002)); }
	if (this.genBool) { this.reset(); }
	
	this.display();
	this.checkCollision1(w-this.pos.x, w-this.pos.x+this.obsW, h*0.9-this.pos.y+this.obsH-10, h*0.9-this.pos.y);
	this.checkCollision2(this.projPos, w-this.pos.x, w-this.pos.x+this.obsW, h*0.9-this.pos.y+this.obsH-10, h*0.9-this.pos.y);
	this.checkCollision3(this.objPos, w-this.pos.x, w-this.pos.x+this.obsW, h*0.9-this.pos.y+this.obsH-10);
}

// * Display Obstacle * //
Obstacle.prototype.display = function() {
	if ((this.vel.x > 0) && (this.duckPos.x > w*0.4)) { this.pos.x += this.vel.x; }
	if (this.obs == '') { return; }
	if (this.obs == 'Construction') {
		image(construction2, w-this.pos.x, this.pos.y-this.obsH+12-h*0.6);
	}
	image(obsJSON[this.obs][0], w-this.pos.x, this.pos.y-this.obsH+10);
}

// * Reset Obstacle * //
Obstacle.prototype.reset = function() {
	if (this.pos.x - this.obsW >= w) {
		this.obs = random(obsArray);
		this.obsW = obsJSON[this.obs][1];
		this.obsH = obsJSON[this.obs][2];
		if (this.obs == 'Construction') { this.pos.set(new p5.Vector(0, h*0.45)); }
		else { this.pos.set(new p5.Vector(0, h*0.9)); }
	}
}

// * Check Collision with Duck * //
Obstacle.prototype.checkCollision1 = function(pos_l, pos_r, pos_t, pos_b) {
	// Top
	if ((this.vel.y/abs(this.vel.y) == -1) && (this.duckPos.y <= pos_t) && (this.duckPos.y >= pos_b) && (this.duckPos.x + h*0.08 > pos_l) && (this.duckPos.x < pos_r)) {
		this.duckPos.y = pos_t; this.vel.y *= 0; midair = false; }
	// Bottom
	else if ((this.vel.y/abs(this.vel.y) == 1) && (this.duckPos.y + h*0.1 <= pos_t) && (this.duckPos.y + h*0.1 >= pos_b) && (this.duckPos.x + h*0.08 > pos_l*1.05) && (this.duckPos.x < pos_r*0.95)) {
		this.duckPos.y = pos_b - h*0.1; this.vel.y *= 0; }
	else {
		if ((this.vel.x/abs(this.vel.x) == 1) && (this.duckPos.y < pos_t) && (this.duckPos.y + h*0.1 > pos_b) && (this.duckPos.x + h*0.08 >= pos_l) && (this.duckPos.x + h*0.08 <= pos_l*1.05)) {
			this.duckPos.x = pos_l - h*0.08; this.vel.x *= 0; }
		// Right
		if ((this.vel.x/abs(this.vel.x) == -1) && (this.duckPos.y < pos_t) && (this.duckPos.y + h*0.1 > pos_b) && (this.duckPos.x <= pos_r) && (this.duckPos.x >= pos_r*0.95)) {
			this.duckPos.x = pos_r; this.vel.x = -0.00000001; }
	}
}

// * Check Collision with Projectiles * //
Obstacle.prototype.checkCollision2 = function(vec, pos_l, pos_r, pos_t, pos_b) {
	if(!cooldown) {
		return false;
	}
	
	if (weapon == 3) { return; }
	// Left
	if ((vec.y < pos_t-h*0.015) && (vec.y > pos_b+h*0.015) && (vec.x >= pos_l-h*0.015) && (vec.x <= pos_l)) {
		vec.set(-2*w, -2*h);
		hit = true;
		if (weapon == 0) { if (!popped.isPlaying()) { popped.play(); } }
		if (weapon == 1) { if (!stonehit.isPlaying()) { stonehit.play(); } }
		if (weapon == 2) { if (!pooped.isPlaying()) { pooped.play(); } }
	}
	// Right
	if ((vec.y < pos_t-h*0.015) && (vec.y > pos_b+h*0.015) && (vec.x <= pos_r+h*0.015) && (vec.x >= pos_r)) {
		vec.set(-2*w, -2*h);
		hit = true;
		if (weapon == 0) { if (!popped.isPlaying()) { popped.play(); } }
		if (weapon == 1) { if (!stonehit.isPlaying()) { stonehit.play(); } }
		if (weapon == 2) { if (!pooped.isPlaying()) { pooped.play(); } }
	}
	// Top
	if ((vec.y <= pos_t-h*0.015) && (vec.y >= pos_b+h*0.015) && (vec.x > pos_l) && (vec.x < pos_r)) {
		vec.set(-2*w, -2*h);
		hit = true;
		if (weapon == 0) { if (!popped.isPlaying()) { popped.play(); } }
		if (weapon == 1) { if (!stonehit.isPlaying()) { stonehit.play(); } }
		if (weapon == 2) { if (!pooped.isPlaying()) { pooped.play(); } }
	}
}

// * Check Collision with Items * //
Obstacle.prototype.checkCollision3 = function(vec, pos_l, pos_r, pos_t) {
	// Top
	if ((vec.y <= pos_t+h*0.03-10) && (vec.x > pos_l) && (vec.x < pos_r)) { vec.y = pos_t+h*0.03-10; this.objVel.set(new p5.Vector(0, 0)); }
	else {
		// Left
		if ((vec.y < pos_t) && (vec.x >= pos_l) && (vec.x <= pos_l*1.05)) { vec.x = pos_l - h*0.015; }
		// Right
		if ((vec.y < pos_t) && (vec.x <= pos_r) && (vec.x >= pos_r*0.95)) { vec.x = pos_r + h*0.015; }
	}
}