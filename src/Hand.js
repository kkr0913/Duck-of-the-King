// * * * * * * * * * * * * * * * * * //
// - - - - -   Hand Class  - - - - - //
// - - - Manage Item Throwings - - - //
// * * * * * * * * * * * * * * * * * //

function Hand(pos, vel, proj) {
	this.duckPos = pos;
	this.projPos = proj;
	this.vel = vel;
	this.handPos = createVector(0, -h*0.20);
	this.objPos = createVector(-w, 0);
	this.scrPos = createVector(2*w, 2*h);
	this.physics = new Physics(this.objPos);
	this.direction = 1;
	this.rand = 0;
	this.genTime = -h*floor(random(100, 200))/100;
	this.flicked = false;
	this.thrown = false;
	this.scoreDisplay = false;
	this.getGreenT = false;
	this.green_t0 = -5001;
	this.scr_t0 = -2001;
	this.scrtxt = '';
	this.scrclr = '';
	this.obj = '';
	this.objType = floor(random(0, 11));
	/*
	Rare: radioactive, heart
	Box: mcdonalds, kfc, random
	Food: apple, cherry, fish
	Edible: hamburger, pizza, chicken, fries, coke, eatenapple
	Garbage: shoe, can, trash, money
	*/
	this.rare = ['Radioactive', 'Heart'];
	this.box = ['Mcdonalds', 'Kfc', 'Randombox'];
	this.food = ['Apple', 'Cherry', 'Fish'];
	this.edible = ['Hamburger', 'Pizza', 'Chicken', 'Fries', 'Coke', 'Eatenapple'];
	this.garbage = ['Shoe', 'Can', 'Trash', 'Money'];
	this.random = ['Radioactive', 'Heart', 'Apple', 'Cherry', 'Fish', 'Shoe', 'Can', 'Trash', 'Money', 'Shoe', 'Can', 'Trash', 'Money', 'Shoe', 'Can', 'Trash', 'Money'];
	this.mcbox = ['Hamburger', 'Fries', 'Coke'];
	this.kfcbox = ['Chicken', 'Fries', 'Coke'];
	this.objects = [this.rare, this.box, this.box, this.food, this.food, this.edible, this.edible, this.edible, this.garbage, this.garbage, this.garbage];
	this.scores = ['?', '?', '?', 1000, 1000, 200, 200, 200, -100, -100, -100];
}

// * Throw Items * //
Hand.prototype.throw = function() {
	if (this.checkHit(this.objPos.x, h*0.9-this.objPos.y, h*0.05)) {
		if (this.obj == 'Mcdonalds') {
			this.obj = random(this.mcbox);
			this.objType = 5;
		}
		else if (this.obj == 'Kfc') {
			this.obj = random(this.kfcbox);
			this.objType = 5;
		}
		else if (this.obj == 'Randombox') {
			this.obj = random(this.random);
			for (var i in this.objects) {
				for(var j of this.objects[i]) {
					if (j == this.obj) {
						this.objType = i;
						break;
					}
				}
			}
		}
		else {
			this.objPos.x = -w;
		}
	}
	
	this.checkCollision(this.objPos.x, h*0.9-this.objPos.y, h*0.05);
	this.displayScore();
	this.greenWorld();
	this.reset();
	
	if ((this.vel.x > 0) && (this.duckPos.x > w*0.4)) { this.objPos.x -= this.vel.x; this.scrPos.x -= this.vel.x; if (this.flicked) {this.handPos.x -= this.vel.x; } }
	if (this.handPos.y < 0) { this.handPos.y += h*0.01; }
	if (round(this.handPos.y) == 0) { this.handPos.y = 1; this.flicked = true; this.thrown = true; }
	
	push();
	translate(this.handPos.x, this.handPos.y);
	if (this.flicked) { rotate(radians(-this.direction*20)); }
	imageMode(CORNERS);
	if (this.direction == 1) { image(hand0, 0, 0, h*0.30, h*0.20); }
	if (this.direction == -1) { image(hand1, 0, 0, -h*0.30, h*0.20); }
	pop();
	
	if (this.flicked) {
		// Throwing Force
		if (this.thrown) { this.thrown = false; this.objPos.set(new p5.Vector(this.handPos.x+this.direction*h*0.15, h*0.80)); this.physics.applyForce(new p5.Vector(this.direction*5, 20)); }
		// Gravity
		this.physics.gravity(s=0.5);
		// Normal Force
		if (this.objPos.y < h*0.03-10) { this.physics.vel.set(new p5.Vector(0, 0)); this.objPos.y = h*0.03-10; }
		// Display
		push();
		imageMode(CENTER);
		image(objJSON[this.obj][0], this.objPos.x, h*0.9-this.objPos.y)
		pop();
	}
}

// * Reset * //
Hand.prototype.reset = function() {
	if (this.objPos.x >= -w*0.2) {
		return;
	}
	this.genTime = -h*floor(random(200, 500))/100;
	this.direction = random([-1, 1]);
	if (this.direction == 1) { this.rand = random(0, 0.5); }
	if (this.direction == -1) { this.rand = random(0.5, 1); }
	this.flicked = false;
	this.handPos.set(new p5.Vector(w*this.rand, this.genTime));
	this.objPos.set(new p5.Vector(2*w, 0));
	this.objType = floor(random(0, this.objects.length));
	this.obj = random(this.objects[this.objType]);
}

// * Check Collision with Duck * //
Hand.prototype.checkCollision = function(pos_x, pos_y, d) {
	if (dist(this.duckPos.x + h*0.04, h*0.9 - this.duckPos.y - h*0.05, pos_x, pos_y) < d) {
		if (this.obj == 'Radioactive') {
			greenworld = true;
			this.getGreenT = true;
			woww.play();
		}
		else if (this.obj == 'Heart') {
			if (mylife != 3) { mylife += 1; lifeup.play(); }
			else if (mylife == 3) {
				var scr1 = mult*5000;
				if (greenworld) { scr1 = mult*50000; }
				this.scrPos.set(new p5.Vector(this.objPos.x, h*0.9-this.objPos.y-h*0.05));
				this.scrtxt = str(scr1);
				this.scrclr = random(scoreColors);
				this.scoreDisplay = true;
				this.calcScore(scr1);
				coin.play();
			}
		}
		else if (typeof this.scores[this.objType] == 'number') {
			var scr2 = this.scores[this.objType];
			if (scr2 > 0) { scr2 = mult*scr2; }
			if (greenworld && (scr2 > 0)) { scr2 = 10*mult*this.scores[this.objType]; }
			this.scrPos.set(new p5.Vector(this.objPos.x, h*0.9-this.objPos.y-h*0.05));
			if (scr2 < 0) { this.scrtxt = random(['yuck', 'gross', 'disgusting', 'garbage', 'eww', 'ewwwww']); yuck.play(); }
			else { this.scrtxt = str(scr2); coin.play(); }
			this.scrclr = random(scoreColors);
			this.scoreDisplay = true;
			this.calcScore(scr2);
		}
		else { return; }
		this.objPos.x = -w;
		this.reset();
	}
}

// * Check Collision with Projectiles * //
Hand.prototype.checkHit = function(pos_x, pos_y, d) {
	if(!cooldown) {
		return false;
	}
	if (dist(this.projPos.x, h*0.9 - this.projPos.y, pos_x, pos_y) < d) {
		if (weapon != 3) { this.projPos.set(-2*w, -2*h); }
		hit = true;
		if (weapon == 0) { if (!popped.isPlaying()) { popped.play(); } }
		if (weapon == 1) { if (!stonehit.isPlaying()) { stonehit.play(); } }
		if (weapon == 2) { if (!pooped.isPlaying()) { pooped.play(); } }
		return true;
	}
	else {
		return false;
	}
}

// * Score Calculation * //
Hand.prototype.calcScore = function(score) {
	itemScore += score;
}

// * Earned Score Display * //
Hand.prototype.displayScore = function() {
	if (this.scoreDisplay) { this.scr_t0 = millis(); this.scoreDisplay = false; }
	if (millis() - this.scr_t0 < 2000) {
		push();
		textSize(height/30);
		fill(this.scrclr[0], this.scrclr[1], this.scrclr[2], map(millis()-this.scr_t0, 0, 2000, 255, 0));
		text(this.scrtxt, this.scrPos.x, this.scrPos.y-h*(millis()-this.scr_t0)/20000);
		pop();
	}
}

// * Radioactive Invincibility * //
Hand.prototype.greenWorld = function() {
	if (greenworld && this.getGreenT) { this.green_t0 = millis(); this.getGreenT = false; }
	if (millis() - this.green_t0 > 8000) {
		greenworld = false;
	}
}
