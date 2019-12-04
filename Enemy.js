function Enemy(pos, vel, proj) {
	// General
	this.physics = new Physics(pos);
	this.duckPos = pos;
	this.projPos = proj;
	this.scrPos = createVector(2*w, 2*h);
	this.duckPos_raw = createVector(this.duckPos.x + h*0.04, h*0.9 - this.duckPos.y - h*0.05);  // duck position without height translate (plus adjust to middle of image)
	this.vel = vel;
	this.scr = 0;
	this.scrtxt = '';
	this.scrclr = '';
	this.scr_t0 = -2001;
	this.scoreDisplay = false;
	
	// Rat
	this.ratPos = [createVector(2*w, h*0.9), createVector(2*w, h*0.9), createVector(2*w, h*0.9), createVector(2*w, h*0.9), createVector(2*w, h*0.9)];
	
	// Met
	this.metPos = createVector(2*w, h*0.9);
	this.metMotion1 = new Array(120).fill(1);
	this.metMotion2 = new Array(90).fill(0.1);
	this.metMotion3 = new Array(120).fill(-1);
	this.metMotion4 = new Array(90).fill(-0.1);
	this.metMotion = ((this.metMotion1.concat(this.metMotion2)).concat(this.metMotion3)).concat(this.metMotion4);
	
	// Ball
	this.ballPos = createVector(3*w, h*0.91);
	this.ballType = floor(random(0, 3));
	this.ballPhysics = new Physics(this.ballPos);
	
	// Dust
	this.dustPos = [createVector(w*1.2, h*random(0.3, 0.6)), createVector(w*1.9, h*random(0.3, 0.6)), createVector(w*3.7, h*random(0.3, 0.6))];
	this.dustMove = [createVector(0, 0), createVector(0, 0), createVector(0, 0)];
	this.dustSize = 0.05;
	this.dust_idx = [floor(random(0, 5)), floor(random(0, 5)), floor(random(0, 5))];
	this.dustMotion = new Array(90).fill(0);
	this.dustMotion = this.dustMotion.concat(new Array(30).fill(1));
	this.dustGone = false;
	
	// Boomerang
	this.boomPos = createVector(0, 0);
	this.boomVec = createVector(0, 0);
	this.vel_i = createVector(0, 0);
	this.dist_i = 0;
	this.boomGenTime = 5;
	this.boomPhysics = new Physics(this.boomPos);
	this.boomReverse = false;
	this.boomReturned = true;
	
	// Wind
	this.wind_t0 = -5000;
}

Enemy.prototype.spawn = function() {
	var timing = spawnTime;
	if (admin) { timing = [1, 1, 1, 1, 1, 1]; }
	// Spawn Rat
	if (progress > timing[0]) {
		for (var i in this.ratPos) { this.spawnRat(i, setProb(0.0005*(1+3*i))); }
	}
	// Spawn Met
	if (progress > timing[1]) {
		this.spawnMet();
	}
	// Spawn Ball
	if (progress > timing[2]) {
		this.spawnBall(guideline=false);
	}
	// Spawn Dust
	if (progress > timing[3]) {
		for (var j in this.dustPos) { this.spawnDust(j, guideline=false); }
	}
	// Spawn Boomerang
	if (progress > timing[4]) {
		this.spawnBoomerang(guideline=false);
	}
	// Spawn Wind
	if (progress > timing[5]) {
		this.spawnWind(setProb(0.002)); // 0.002
	}
	// Score
	this.calcScore();
	this.displayScore();
}

Enemy.prototype.checkCollision = function(mode, pos_l, pos_r, pos_t, pos_b) {
	if (inv || greenworld) { return; }
	
	// ('CENTER', pos_x, pos_y, radius, unused)
	if (mode == 'CENTER') {
		if (dist(this.duckPos.x + h*0.04, h*0.9 - this.duckPos.y - h*0.05, pos_l, pos_r) < pos_t) { dead = true; }
	}
	
	else if (mode == 'EDGE') {
	// Top
	if ((this.vel.y/abs(this.vel.y) == -1) && (this.duckPos.y < pos_t*0.95) && (this.duckPos.y > pos_b*1.05) && (this.duckPos.x + h*0.08 > pos_l*1.05) && (this.duckPos.x < pos_r*0.95)) { dead = true; }
	// Bottom
	if ((this.vel.y/abs(this.vel.y) == 1) && (this.duckPos.y + h*0.1 < pos_t*0.95) && (this.duckPos.y + h*0.1 > pos_b*1.05) && (this.duckPos.x + h*0.08 > pos_l*1.05) && (this.duckPos.x < pos_r*0.95)) { dead = true; }
	// Left
	if ((this.vel.x/abs(this.vel.x) == 1) && (this.duckPos.y < pos_t*0.95) && (this.duckPos.y + h*0.1 > pos_b*1.05) && (this.duckPos.x + h*0.08 > pos_l*1.05) && (this.duckPos.x + h*0.08 <= pos_l*1.06)) { dead = true; }
	// Right
	if ((this.vel.x/abs(this.vel.x) == -1) && (this.duckPos.y < pos_t*0.95) && (this.duckPos.y + h*0.1 > pos_b*1.05) && (this.duckPos.x < pos_r*0.95) && (this.duckPos.x >= pos_r*0.94)) { dead = true; }
	}
	
	else {
		console.log("Invalid Argument: Enemy.checkCollision('CENTER' or 'EDGE', float, float, float, float)");
		return;
	}
}

Enemy.prototype.checkHit = function(pos_x, pos_y, d, score) {
	if(!cooldown) {
		return false;
	}
	if (dist(this.projPos.x, h*0.9 - this.projPos.y, pos_x, pos_y) < d) {
		if (weapon != 3) { this.projPos.set(-2*w, -2*h); }
		this.scrPos.set(new p5.Vector(pos_x, pos_y));
		if (greenworld) { this.scr = 10*score; this.scrtxt = str(10*score); }
		else { this.scr = score; this.scrtxt = str(score); }
		this.scrclr = random(scoreColors);
		this.scoreDisplay = true;
		hit = true;
		if (weapon == 0) { if (!popped.isPlaying()) { popped.play(); } }
		if (weapon == 1) { if (!stonehit.isPlaying()) { stonehit.play(); } }
		if (weapon == 2) { if (!pooped.isPlaying()) { pooped.play(); } }
		coin.play();
		return true;
	}
	else {
		return false;
	}
}

Enemy.prototype.calcScore = function() {
	killScore += this.scr;
	this.scr = 0;
}

Enemy.prototype.displayScore = function() {
	if (this.scoreDisplay) { this.scr_t0 = millis(); this.scoreDisplay = false; }
	if (millis() - this.scr_t0 < 2000) {
		push();
		textSize(36);
		fill(this.scrclr[0], this.scrclr[1], this.scrclr[2], map(millis()-this.scr_t0, 0, 2000, 255, 0));
		text(this.scrtxt, this.scrPos.x, this.scrPos.y-h*(millis()-this.scr_t0)/20000);
		pop();
	}
}


// * * * Rat * * * //
Enemy.prototype.spawnRat = function(i, resetBool) {
	this.ratPos[i].x += 1;
	if ((this.vel.x > 0) && (this.duckPos.x > w*0.4)) { this.ratPos[i].x += this.vel.x; }
	if (!motion[(2*frameCount)%motion.length]) { image(enmJSON.Rat[0], w-this.ratPos[i].x, this.ratPos[i].y-enmJSON.Rat[3]+10); }
	if (motion[(2*frameCount)%motion.length]) { image(enmJSON.Rat[1], w-this.ratPos[i].x, this.ratPos[i].y-enmJSON.Rat[3]+10); }
	if (resetBool && (this.ratPos[i].x - enmJSON.Rat[2] >= w)) { this.ratPos[i].set(new p5.Vector(0, h*0.9)); }
	if (this.checkHit(w-this.ratPos[i].x+enmJSON.Rat[2]/2, this.ratPos[i].y-enmJSON.Rat[3]/2+5, h*0.04, mult*100)) { this.ratPos[i].x = 2*w; }
	this.checkCollision('EDGE', w-this.ratPos[i].x, w-this.ratPos[i].x+enmJSON.Rat[2], enmJSON.Rat[3], 0);
}


// * * * Met * * * //
Enemy.prototype.spawnMet = function() {
	this.metPos.x += round(this.metMotion[frameCount % this.metMotion.length]);
	if ((this.vel.x > 0) && (this.duckPos.x > w*0.4)) { this.metPos.x += this.vel.x; }

	if (this.metMotion[frameCount % this.metMotion.length] == 0.1) { image(enmJSON.Met[0][0], w-this.metPos.x, this.metPos.y-enmJSON.Met[3]+10); }
	if (this.metMotion[frameCount % this.metMotion.length] == -0.1) { image(enmJSON.Met[0][3], w-this.metPos.x, this.metPos.y-enmJSON.Met[3]+10); }
	if (this.metMotion[frameCount % this.metMotion.length] == 1) {
		if (!motion[frameCount%motion.length]) { image(enmJSON.Met[0][1], w-this.metPos.x, this.metPos.y-enmJSON.Met[2]+10); }
		if (motion[frameCount%motion.length]) { image(enmJSON.Met[0][2], w-this.metPos.x, this.metPos.y-enmJSON.Met[2]+10); }
	}
	if (this.metMotion[frameCount % this.metMotion.length] == -1) {
		if (!motion[frameCount%motion.length]) { image(enmJSON.Met[0][4], w-this.metPos.x, this.metPos.y-enmJSON.Met[2]+10); }
		if (motion[frameCount%motion.length]) { image(enmJSON.Met[0][5], w-this.metPos.x, this.metPos.y-enmJSON.Met[2]+10); }
	}
	
	if (this.metPos.x > w*1.2) {
		this.metPos.set(new p5.Vector(w*random(-0.2, -1.0), h*0.9));
	}
	if (round(this.metMotion[frameCount % this.metMotion.length]) != 0) {
		if (this.checkHit(w-this.metPos.x+enmJSON.Met[1]/2, this.metPos.y-enmJSON.Met[2]/2+5, h*0.04, mult*300)) { this.metPos.x = 2*w; }
	}
	this.checkCollision('EDGE', w-this.metPos.x, w-this.metPos.x+enmJSON.Met[1], enmJSON.Met[2], 0);
}


// * * * Ball * * * //
Enemy.prototype.spawnBall = function(guideline) {
	this.ballPos.x += 1;
	if ((this.vel.x > 0) && (this.duckPos.x > w*0.4)) { this.ballPos.x += this.vel.x; }
	if (this.ballPos.x > -w*0.05) {
		if (this.ballType == 0) { this.ballPos.x += 9; this.ballPos.y = h*0.9-h*0.4*sin(PI*this.ballPos.x/(w*1.1)); }                                       // Soccer ball
		if (this.ballType == 1) { this.ballPos.x += 4; this.ballPos.y = h*0.9-(h*0.4*(w-this.ballPos.x)/w+h*0.1)*abs(sin(PI*this.ballPos.x/(w*0.2))); }     // Basketball
		if (this.ballType == 2) { this.ballPhysics.applyForce(new p5.Vector((this.ballPos.x+w*0.05)*0.0003, 0)); }                                          // Bowling ball
	}
	if (this.ballPos.x > 2*w) {
		this.ballPhysics.removeForce();
		this.ballPos.set(w*random(-0.7, -0.2), h*0.91);
		this.ballType = floor(random(0, 3));
	}
	
	push();
	translate(w-this.ballPos.x, this.ballPos.y-h*0.06);
	rotate(radians(-((this.ballPhysics.vel.x/30+5)*frameCount)%360));
	imageMode(CENTER);
	image(enmJSON.Ball[0][this.ballType], 0, 0);
	pop();
	if (guideline) {
		push();
		stroke(128);
		strokeWeight(2);
		line(w-this.ballPos.x, this.ballPos.y-enmJSON.Ball[2]/2, this.duckPos.x+h*0.04, h*0.9-(this.duckPos.y+h*0.05));
		pop();
	}
	
	this.checkCollision('CENTER', w-this.ballPos.x, this.ballPos.y-enmJSON.Ball[2]/2, h*0.1, 0);
}


// * * * Dust * * * //
Enemy.prototype.spawnDust = function(i, guideline) {
	var idx = (frameCount+15*i)%this.dustMotion.length;
	if (idx == 89) { this.dustMove[i].set(createVector(random(-0.005, 0.005), random(-0.005, 0.005))); }
	if ((this.vel.x > 0) && (this.duckPos.x > w*0.4)) { this.dustPos[i].x -= this.vel.x; }
	if (this.dustPos[i].x < -h*0.2) { this.dustGone = true; }
	
	push();
	if (!this.dustMotion[idx]) { this.dustSize = enmJSON.Dust[1]; }
	if (this.dustMotion[idx]) { this.dustPos[i].x += h*this.dustMove[i].x; this.dustPos[i].y += h*this.dustMove[i].y; this.dustSize = enmJSON.Dust[2]; }
	if (this.dustPos[i].y >= h*0.9) { this.dustPos[i].y = h*0.9; this.dustMove[i].y = -abs(this.dustMove[i].y)*1.5; }
	if (this.dustPos[i].y <= 0) { this.dustPos[i].y = 0; this.dustMove[i].y = abs(this.dustMove[i].y)*1.5; }
	imageMode(CENTER);
	image(enmJSON.Dust[0][this.dust_idx[i]], this.dustPos[i].x, this.dustPos[i].y, this.dustSize, this.dustSize);
	pop();
	if (guideline) {
		push();
		stroke(128);
		strokeWeight(2);
		line(this.dustPos[i].x, this.dustPos[i].y, this.duckPos.x+h*0.04, h*0.9-(this.duckPos.y+h*0.05));
		pop();
	}
	
	this.dustReset(i);
	this.checkCollision('CENTER', this.dustPos[i].x, this.dustPos[i].y, this.dustSize*0.6, 0);
}

Enemy.prototype.dustReset = function(i) {
	if (!this.dustGone) { return; }
	this.dustPos[i].set(new p5.Vector(w*random(1.2, 2.0), h*random(0.3, 0.6)));
	this.dust_idx[i] = floor(random(0, 5));
	this.dustGone = false;
}


// * * * Boomerang * * * //
Enemy.prototype.spawnBoomerang = function(guideline) {
	this.boomReset();
	this.boomPhysics.update();
	this.boomPhysics.applyForce(this.boomVec);
	var d = dist(this.boomPos.x, this.boomPos.y, this.duckPos_raw.x, this.duckPos_raw.y);
	if (!this.boomReverse && (d / this.dist_i >= 0.05)) {
		this.boomPhysics.vel.x = this.vel_i.x * d / this.dist_i;
		this.boomPhysics.vel.y = this.vel_i.y * d / this.dist_i;
	} 
	if (d / this.dist_i < 0.05) {
		this.boomReverse = true;
		this.boomPhysics.vel.x = -1 * this.vel_i.x * d / this.dist_i;
		this.boomPhysics.vel.y = -1 * this.vel_i.y * d / this.dist_i;
	}
	if (d / this.dist_i > this.boomGenTime) { this.boomReturned = true; }
	
	if ((this.vel.x > 0) && (this.duckPos.x > w*0.4)) { this.boomPos.x -= this.vel.x; this.duckPos_raw.x -= this.vel.x; }
	
	this.checkCollision('CENTER', this.boomPos.x, this.boomPos.y, h*0.05, 0);
	this.boomDisplay(guideline);
}

Enemy.prototype.boomDisplay = function(guideline) {
	push();
	imageMode(CENTER);
	fill('red');
	translate(this.boomPos.x, this.boomPos.y);
	rotate(radians(-30*frameCount%360));
	image(enmJSON.Boom[0], 0, 0);
	pop();
	if (guideline) {
		push();
		stroke(128);
		strokeWeight(2);
		line(this.boomPos.x, this.boomPos.y, this.duckPos_raw.x, this.duckPos_raw.y);
		pop();
	}
}

Enemy.prototype.boomReset = function() {
	if (this.boomReturned) {
		this.boomPhysics.removeForce();
		var rand = floor(random(0, 15)) / 10;
		var boomSpeed = random(0.005, 0.01);
		this.duckPos_raw.set(new p5.Vector(this.duckPos.x + h*0.04, h*0.9 - this.duckPos.y - h*0.05));
		this.boomPos.set(new p5.Vector(w*(1-floor(rand))*rand + w*floor(rand) + h*0.05, h*0.6*floor(rand)*(rand-1)/0.4 - h*0.1 + h*0.05));
		var vec1 = p5.Vector.sub(this.duckPos_raw, this.boomPos);
		vec1.x *= boomSpeed;
		vec1.y *= boomSpeed * w/h;
		var vec2 = vec1.copy();
		vec2.mult(-0.01);
		this.boomVec.set(vec2);
		this.dist_i = dist(this.boomPos.x, this.boomPos.y, this.duckPos_raw.x, this.duckPos_raw.y);
		this.boomPhysics.applyForce(vec1);
		this.vel_i.set(this.boomPhysics.vel.copy());
		this.boomGenTime = random(5, 50);
		this.boomReverse = false;
		this.boomReturned = false;
	}
}


// * * * Wind * * * //
Enemy.prototype.spawnWind = function(blow) {
	if (blow) { this.wind_t0 = millis(); blow = false; }
	push();
	if (millis() - this.wind_t0 < 4000) {
		if (this.vel.x > 0) { this.vel.x *= 0.99; }
		this.physics.applyForce(new p5.Vector(-0.001, 0));
		tint(255, 200);
		imageMode(CORNERS);
		if (!motion[frameCount % motion.length]) {
			image(enmJSON.Wind[0], w*0.70, h*0.05, w*0.70+enmJSON.Wind[1], h*0.05+enmJSON.Wind[2]);
			image(enmJSON.Wind[0], w*0.50-0.2*enmJSON.Wind[1], h*0.28, w*0.50+enmJSON.Wind[1], h*0.28+enmJSON.Wind[2]);
			image(enmJSON.Wind[0], w*0.65, h*0.58, w*0.65+enmJSON.Wind[1], h*0.58+enmJSON.Wind[2]);
		}
		if (motion[frameCount % motion.length]) {
			image(enmJSON.Wind[0], w*0.70-0.2*enmJSON.Wind[1], h*0.05, w*0.70+enmJSON.Wind[1], h*0.05+enmJSON.Wind[2]);
			image(enmJSON.Wind[0], w*0.50, h*0.28, w*0.50+enmJSON.Wind[1], h*0.28+enmJSON.Wind[2]);
			image(enmJSON.Wind[0], w*0.65-0.2*enmJSON.Wind[1], h*0.58, w*0.65+enmJSON.Wind[1], h*0.58+enmJSON.Wind[2]);
		}
	} else { this.physics.removeForce(); }
	this.vel.add(this.physics.vel);
	pop();
}