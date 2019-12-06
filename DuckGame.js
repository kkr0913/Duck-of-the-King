// * * * * * * * * * * * * * * * * * * //
// - - - - -  DuckGame Class - - - - - //
// - - - Manage the Entire Game - - -  //
// * * * * * * * * * * * * * * * * * * //

function DuckGame() {
  this.pos = createVector(0, 0);
	this.bgPos = createVector(0, 0);
	this.gndPos = createVector(0, 0);
	this.projPos = createVector(0, 0);
	this.proj_i0 = 1;
	this.proj_x0 = 0;
	this.proj_y0 = 0;
	this.lookingAt = 1;
	this.dead_h0 = 0;
	this.dead_t0 = -1001;
	this.inv_t0 = -3001;
	this.option = ['GAME   START', 'HOW   TO   PLAY', 'BACK   TO   TITLE'];
	this.physics = new Physics(this.pos);
	this.projPhysics = new Physics(this.projPos);
	this.hand = new Hand(this.physics.pos, this.physics.vel, this.projPos);
	this.obstacle1 = new Obstacle(this.physics.pos, this.physics.vel, this.projPos, this.hand.objPos, this.hand.physics.vel);
	this.obstacle2 = new Obstacle(this.physics.pos, this.physics.vel, this.projPos, this.hand.objPos, this.hand.physics.vel);
	this.enemy = new Enemy(this.physics.pos, this.physics.vel, this.projPos);
}

// * * * Title Screen * * * //
DuckGame.prototype.titleScreen = function() {	
	var title_txt = "Duck of the King";
	push();
	fill('#FFEB3B');
	stroke('#FF9900');
	strokeWeight(10);
	textSize(round(width/12));
	var txt_w = 0;
	var n = 0;
	for (var i in title_txt) {
		var txt_h = 0;
		var t;
		if (n % 2 == 0) {
			t = (millis()*0.002) % (7*PI);
			if (2*floor(t/PI) == n) { txt_h = abs(height*0.05*sin(t)); }
		}
		if (n % 2 == 1) {
			t = (millis()*0.002-PI/2) % (7*PI);
			if (2*floor(t/PI)+1 == n) { txt_h = abs(height*0.05*sin(t)); }
		}
		if (title_txt[i] == ' ') { txt_h = 0; }
		if (title_txt[i] != ' ') { n += 1 }
		text(title_txt[i], (width-textWidth(title_txt)-3*textWidth('  '))*0.5+txt_w, height*0.25-txt_h);
		if (title_txt[i] == ' ') { txt_w += textWidth(title_txt[i]) + textWidth('  '); }
		else { txt_w += textWidth(title_txt[i]); }
	}
	
	fill(255);
	stroke(0);
	strokeWeight(3);
	textSize(round(width/24));
	if (!motion[floor(0.5*frameCount)%motion.length]) { text('Press  Any  Button', 0, height*0.1, width, height*0.9); }
	
	noStroke();
	textSize(44);
	text('1996   kyurae   corp', 0, height*0.75, width, h*0.05);
	text('licenced   by', 0, height*0.75+h*0.05, width, h*0.05);
	text('New   York   Univ   DMUY  1133   Inc', 0, height*0.75+h*0.1, width, h*0.05);
	translate((width-textWidth('1996   kyurae   corp'))/2-c.width*2, height*0.75+h*0.01);
	image(c, 0, 0);
	pop();
}

// * * * Loading Screen * * * //
DuckGame.prototype.loadingScreen = function() {
	push();
	stroke(0);
	strokeWeight(7);
	rect(width*0.2, height*0.2, width*0.6, height*0.6);
	imageMode(CORNERS);
	image(bricksquare, width*0.2, height*0.2, width*0.8, height*0.8);
	imageMode(CORNER);
	var fc = (frameCount*0.002) % (2.4-h*0.16/width-h*0.16/height);
	if (fc < 0.6-h*0.08/width) { translate(width*0.2+width*fc, height*0.2-h*0.1); }
	else if (fc < 1.2-h*0.08/width-h*0.08/height) { translate(width*0.8+h*0.1, height*0.2+height*(fc-0.6+h*0.08/width)); rotate(PI/2); }
	else if (fc < 1.8-h*0.16/width-h*0.08/height) { translate(width*0.8-width*(fc-1.2+h*0.08/width+h*0.08/height), height*0.8+h*0.1); rotate(PI); }
	else if (fc < 2.4-h*0.16/width-h*0.16/height) { translate(width*0.2-h*0.1, height*0.8-height*(fc-1.8+h*0.16/width+h*0.08/height)); rotate(3*PI/2); }
	if (!motion[(2*frameCount)%motion.length]) { image(duck_walk1, 0, 0); }
	if (motion[(2*frameCount)%motion.length]) { image(duck_walk2, 0, 0); }
	pop();
	
	push();
	var colors = ['#FFCC99', '#FF9933'];
	for (var i in this.option) {
		var txt = this.option[i];
		fill(255);
		if (i == option_idx) {
			fill(colors[motion[(2*frameCount)%motion.length]]);
			txt = '! ' + txt + '  !';
		}
		text(txt, 0, height*0.5-textAscent()*3.75+textAscent()*3*i, width, textAscent()*1.5);
	}
	pop();
}

// * * * Select Screen * * * //
DuckGame.prototype.selectScreen = function() {
	background(0);
	var colors = ['#FFCC99', '#FF9933'];
	push();
	fill(colors[motion[(2*frameCount)%motion.length]]);
	textSize(100);
	text('select   weapon', 0, 0, width, height*0.4);
	pop();
	for (var i = 0; i < 3; i++) {
		push();
		translate(width*0.4-h*0.465+i*(width*0.1+h*0.31), height*0.4);
		noFill();
		noStroke();
		if (i == card_idx) { fill(255, 255, 153); stroke(255, 255, 153); strokeWeight(5); }
		if (i != sel_idx) {
			rect(0, 0, h*0.31, h*0.5);
			image(card0, 0, 0);
		}
		if (i == sel_idx) {
			translate(h*0.155, 0);
			if ((millis()-sel_t0)*0.001 <= 1) { scale(1-(millis()-sel_t0)*0.001, 1); image(card0, -h*0.155, 0); }
			if ((millis()-sel_t0)*0.001 >= 4) { selected = false; card = false; }
			else if ((millis()-sel_t0)*0.001 >= 2) { scale(1, 1); image([card1, card2, card3, card4][weapon], -h*0.155, 0); }
			else if ((millis()-sel_t0)*0.001 > 1) { scale((millis()-sel_t0)*0.001-1, 1); image([card1, card2, card3, card4][weapon], -h*0.155, 0); }
		}
		pop();
	}
}

// * * * Score Screen * * * //
DuckGame.prototype.scoreScreen = function() {
	background(0);
	push();
	imageMode(CENTER);
	if (ee) { image(nyu, width*0.5, height*0.5); }
	noFill();
	stroke(255);
	strokeWeight(3);
	rect(width*0.2, height*0.05, width*0.6, height*0.9);
	rectMode(CENTER);
	fill(0);
	noStroke();
	rect(width*0.5, height*0.05, textWidth('score          ' + myscore)*1.2, textAscent());
	rectMode(CORNER);
	fill(255, 255, 0);
	textAlign(RIGHT, CENTER);
	text('score     ', 0, 0, width*0.5, height*0.1);
	fill(255);
	textAlign(LEFT, CENTER);
	text('     ' + myscore, width*0.5, 0, width*0.5, height*0.1);
	textAlign(CENTER, TOP);
	text("! Ranking  !", 0, height*0.15, width, textAscent()*2);
	textAlign(RIGHT, TOP);
	text('No', 0, height*0.15+textAscent()*2, width*0.35, textAscent()*1.5);
	textAlign(CENTER, TOP);
	text('Score', width*0.35, height*0.15+textAscent()*2, width*0.3, textAscent()*1.5);
	textAlign(LEFT, TOP);
	text('Name', width*0.65, height*0.15+textAscent()*2, width*0.35, textAscent()*1.5);
	if (!rankUpdated) {
		this.updateRank();
		rankUpdated = true;
	}
	for (var k = 1; k < 11; k++) {
		var colors = ['#FFCC99', '#FF9933'];
		if (k == myrank) {
			if (!nameEntered) { fill(0, 0, 255); }
			if (nameEntered) { fill(colors[motion[(4*frameCount)%motion.length]]); }
		}
		else { fill(255); }
		textAlign(RIGHT, TOP);
		text(str(k), 0, height*0.15+textAscent()*3.5+textAscent()*1.2*(k-1), width*0.35, textAscent()*1.2);
		textAlign(CENTER, TOP);
		text(nf(scrJSON[k][0], 6), width*0.35, height*0.15+textAscent()*3.5+textAscent()*1.2*(k-1), width*0.3, textAscent()*1.2);
		textAlign(LEFT, TOP);
		if (k == myrank) {
			for (var idx = 0; idx < 3; idx++) {
				if (nameEntered) { fill(colors[motion[(4*frameCount)%motion.length]]); }
				else if(idx == alp_idx) { fill(0, 0, 255); }
				else { fill(255); }
				text(char(alpJSON[idx]), width*0.65+textWidth('X')*idx, height*0.15+textAscent()*3.5+textAscent()*1.2*(k-1), width*0.35, textAscent()*1.2);
			}
		}
		else { text(scrJSON[k][1], width*0.65, height*0.15+textAscent()*3.5+textAscent()*1.2*(k-1), width*0.35, textAscent()*1.2); }
	}
	if (nameEntered && (myrank <= 10)) { scrJSON_copy[myrank] = [int(myscore), alpJSON.name]; updateJSON(json_url, scrJSON_copy); }
	pop();
}

// * * * Game Over * * * //
DuckGame.prototype.gameOver = function() {
	if (mylife == 0) {
		push();
		fill(255);
		stroke(0);
		strokeWeight(5);
		textSize(100);
		text("g  a  m  e\no  v  e  r", 0, 0, w, h*0.8);
		pop();
		this.physics.removeForce();
		this.pos.set(this.pos.copy());
		this.pos.y = 2*h;
		var dead_h = h*0.8-h*0.2*sin((millis()-this.dead_t0)*0.002)-this.dead_h0;
		var deadImg = dead_duck1;
		if ((millis()-this.dead_t0)*0.002 >= 0.5*PI) { deadImg = dead_duck2; }
		if ((millis()-this.dead_t0)*0.002 >= 1.5*PI) { dead_h = h; }
		if ((millis()-this.dead_t0)*0.002 >= 2.0*PI && !over.isPlaying()) { gg = true; rankUpdated = false; }
		image(deadImg, this.pos.x, dead_h);
	}
}

// * * * Score Calculation * * * //
DuckGame.prototype.calcScore = function() {
	for (i = spawnTime.length-1; i >= 0; i--) { if (progress >= spawnTime[i]) { mult = i+1; break; } }
	// if (greenworld) { myscore = progress + itemScore + killScore; }
	myscore = floor(progScore/10) + itemScore + killScore;
	if (myscore < 0) { progScore = 0; itemScore = 0; killScore = 0; myscore = 0; }
	if (int(myscore) >= 999999) { myscore = 999999; }
	if (admin) { myscore = 0; }
	myscore = nf(myscore, 6);
	hiscore = nf(scrJSON[1][0], 6);
}

// * * * Life Deduction * * * //
DuckGame.prototype.calcLife = function() {
	if (dead && (mylife > 0) && !inv && !greenworld && !admin) {
		mylife -= 1;
		if (mylife != 0) { this.inv_t0 = millis(); ouch.play(); }
		if (mylife == 0) { this.dead_t0 = millis(); this.dead_h0 = this.pos.y; over.play(); }
		this.physics.removeForce();
		dead = false;
	}
	if ((millis()-this.inv_t0 < 500) && (mylife > 0)) { this.pos.set(new p5.Vector(0, h*0.8)); this.physics.removeForce(); midair = true; }
	if ((millis()-this.inv_t0 <= 3000) && (mylife > 0)) { inv = true; }
	else if (millis()-this.inv_t0 > 3000) { inv = false; }
}

// * * * Rank Update * * * //
DuckGame.prototype.updateRank = function() {
	for (var i = 1; i < 11; i++) {
		if (int(myscore) > scrJSON_copy[i][0]) {
			for (var j = 9; j >= i; j--) {
				scrJSON_copy[j+1] = [scrJSON_copy[j][0], scrJSON_copy[j][1]];
			}
			scrJSON_copy[i] = [int(myscore), alpJSON.name];
			myrank = i;
			break;
		}
	}
	if (myrank > 10) { nameEntered = true; }
	if (myrank <= 10) { updateJSON(json_url, scrJSON_copy); }
}

// * * * Duck Movement * * * //
DuckGame.prototype.move = function() {
	// Constance Forces (Gravity, Normal Force, Friction)
	this.physics.constantForce();
	
	// Move Left/Right
	if (!greenworld) {
		if (keyIsDown(LEFT_ARROW) && (mylife > 0)) { this.physics.moveX(-0.02); this.lookingAt = -1; }
  	if (keyIsDown(RIGHT_ARROW) && (mylife > 0)) { this.physics.moveX(0.02); this.lookingAt = 1; }
	}
	if (greenworld) {
		if (keyIsDown(RIGHT_ARROW) && !gg) { this.physics.moveX(-0.02); this.lookingAt = -1; }
  	if (keyIsDown(LEFT_ARROW) && !gg) { this.physics.moveX(0.02); this.lookingAt = 1; }
	}
	if ((this.physics.vel.x > 0) && (this.physics.pos.x > w*0.4)) {
		this.bgPos.x -= this.physics.vel.x * 0.5;
		this.gndPos.x -= this.physics.vel.x;
		this.projPos.x -= this.physics.vel.x;
		progress += 1;
		if (greenworld) { progScore += 10; }
		else { progScore += 1; }
	}
	
	// Jump & Glide
	if (jump) { jump = false; var jumpF = createVector(0, 50); this.physics.applyForce(jumpF); }
	if (this.pos.y == 0) { midair = false; }
	if (keyIsDown(32) && (this.physics.vel.y < 0)) { this.physics.vel.y *= 0.5; }
}

// * * * Duck Weapon * * * //
DuckGame.prototype.weapon = function() {
	cd = millis() - cd_t0;
	if (cd > 3000) { cooldown = false; }
	if (!cooldown) {
		if (this.lookingAt == 1) {
			if (weapon == 0) { this.projPos.set(this.pos.copy().x+h*0.08, this.pos.copy().y+h*0.05); }
			if (weapon == 1) { this.projPos.set(this.pos.copy().x+h*0.04, this.pos.copy().y+h*0.05); }
			if (weapon == 2) { this.projPos.set(this.pos.copy().x+h*0.02, this.pos.copy().y+h*0.03); }
			if (weapon == 3) { this.projPos.set(this.pos.copy().x+h*0.09, this.pos.copy().y+h*0.05); }
		}
		if (this.lookingAt == -1) {
			if (weapon == 0) { this.projPos.set(this.pos.copy().x, this.pos.copy().y+h*0.05); }
			if (weapon == 1) { this.projPos.set(this.pos.copy().x+h*0.04, this.pos.copy().y+h*0.05); }
			if (weapon == 2) { this.projPos.set(this.pos.copy().x+h*0.06, this.pos.copy().y+h*0.03); }
			if (weapon == 3) { this.projPos.set(this.pos.copy().x-h*0.01, this.pos.copy().y+h*0.05); }
		}
		this.proj_x0 = this.projPos.x;
		this.proj_y0 = this.projPos.y;
		this.proj_i0 = this.lookingAt;
		this.projPhysics.removeForce();
		return;
	}
	
	if (weapon == 0) {
		this.projPos.x += this.proj_i0*w*0.001;
		if (cd < 1500) { this.projPos.x += this.proj_i0*w*0.001; }
		else if (cd < 3000) { this.projPos.x += this.proj_i0*w*0.0002; this.projPos.y = this.proj_y0 + h*0.002*sin(cd*0.1); }
	}
	if (weapon == 1) {
		this.projPhysics.gravity();
		if (this.projPos.y < h*0.01) { this.projPhysics.pos.y = h*0.01; this.projPhysics.vel.y *= 0; this.projPhysics.vel.x *= 0.9; }
		if (attack) { this.projPhysics.applyForce(new p5.Vector(this.lookingAt*8, 0)); }
	}
	if (weapon == 2) {
		this.projPhysics.gravity(0.5);
		if (this.projPos.y < h*0.01) { this.projPhysics.pos.y = h*0.01; this.projPhysics.vel.y *= 0; this.projPhysics.vel.x *= 0.5; }
		if (attack) { this.projPhysics.applyForce(new p5.Vector(this.physics.vel.x, 0)); }
	}
	if (weapon == 3) {
		if (cd < 500) {
			if (this.lookingAt == 1) { this.projPos.x = this.pos.x + h*0.09 + ((w*cd*0.0001) % (h*0.1)); }
			if (this.lookingAt == -1) { this.projPos.x = this.pos.x - h*0.01 - ((w*cd*0.0001) % (h*0.1)); }
			this.projPos.y = this.proj_y0 + abs(this.projPos.x - this.proj_x0)*sin(cd*10);
		}
		else { this.projPos.set(new p5.Vector(2*w, 2*h)); }
	}
	attack = false;
}

// * * * Display * * * //
DuckGame.prototype.display = function() {
	// Background
	push();
	translate((this.bgPos.x % (2*w)) + w, 0);
	image(bg, 0, 0);
	pop();
	push();
	translate(((this.bgPos.x-w) % (2*w)) + w, 0);
	image(bg, 0, 0);
	pop();
	push();
	fill(128, 128);
	textSize(200);
	if (admin) { text('rlarbfo     mode', 0, 0, w, h*0.9); }
	pop();
	
	// Ground
	push();
	translate((this.gndPos.x % (2*w)) + w, h*0.9);
	image(brick, 0, 0);
	pop();
	push();
	translate(((this.gndPos.x-w) % (2*w)) + w, h*0.9);
	image(brick, 0, 0);
	pop();
	
	// Duck
	var velRatio = abs(map(this.physics.vel.x, 0, w*0.001, 0, 5));
	push();
	translate(this.pos.x, h*0.9-this.pos.y);
	if (inv) {
		if (!motion[(5*frameCount)%motion.length]) { tint(255, 153, 51); }
		if (motion[(5*frameCount)%motion.length]) { tint(255, 255, 0); }
	}
	else if (greenworld) {
		if (!motion[(5*frameCount)%motion.length]) { tint(0, 255, 0); }
		if (motion[(5*frameCount)%motion.length]) { tint(0, 204, 0); }
	}
	else { noTint(); }
	if (this.lookingAt == -1) {
		scale(-1, 1);
		translate(-h*0.08, 0);
	}
	if (!midair) {
		if (velRatio < 0.5) { image(duck, 0, 1-h*0.1); }
		else {
			if (!motion[(round(velRatio)*frameCount)%motion.length]) { image(duck_walk1, 0, 1-h*0.1); }
			if (motion[(round(velRatio)*frameCount)%motion.length]) { image(duck_walk2, 0, 1-h*0.1); }
		}
	}
	if (midair) {
		if (keyIsDown(32) && (this.physics.vel.y < 0)) {
			if (!motion[frameCount%motion.length]) { image(duck_fly1, 0, 1-h*0.1); }
			if (motion[frameCount%motion.length]) { image(duck_fly2, 0, 1-h*0.1); }
		}
		else { image(duck_fly1, 0, 1-h*0.1); }
	}
	pop();
	
	// Projectile
	var weaponImg = [weapon1, weapon2, weapon3, weapon4][weapon];
	if ((weapon == 0) && (cd > 2800)) {
		weaponImg = weapon1_pop;
		if ((cd < 3000) && !hit && !popped.isPlaying()) { popped.play(); } }
	if (cooldown) {
		push();
		imageMode(CENTER);
		if (weapon != 3) {
			image(weaponImg, this.projPos.x, h*0.9-this.projPos.y);
		}
		if (weapon == 3) {
			translate(this.pos.x+h*0.04, h*0.9-this.pos.y-h*0.05);
			scale(this.lookingAt, 1);
			translate(h*0.01+h*0.11, 0);
			tint(255, 224);
			var s = 1;
			var offset = h*0.011;
			if (!motion[frameCount%motion.length]) { s = 1.2; offset = h*0.011; }
			if (motion[frameCount%motion.length]) { s = 0.8; offset = -h*0.011; }
			if (cd < 500) { image(weaponImg, offset, 0, h*0.11*s, h*0.20); }
		}
		pop();
	}
}

// * * * Music * * * //
DuckGame.prototype.music = function() {
	if ((title || loading)) { main.stop(); rank.stop(); if (!intro.isPlaying()) { intro.loop(); } }
	else if (card) { intro.stop(); }
	else if (!gg && !title) { if (!main.isPlaying()) { main.loop(); } }
	else if (gg) { main.stop(); if (!rank.isPlaying()) { rank.loop(); } }
}

// * * * Start * * * //
DuckGame.prototype.start = function() {
	translate(height*0.05, height*0.11);
	this.move();
	this.weapon();
	this.display();
	this.calcScore();
	this.calcLife();
	this.hand.throw();
	this.obstacle1.generate();
	this.obstacle2.generate();
	this.enemy.spawn();
	this.gameOver();
}

// * * * Reset Game * * * //
DuckGame.prototype.reset = function() {
	admin = false;
	title = true;
	gg = false;
	ee = false;
	nameEntered = false;
	card_idx = 0;
	sel_idx = 4;
	alp_idx = 0;
	myrank = 100;
	mylife = 3;
	progress = 0;
	progScore = 0;
	itemScore = 0;
	killScore = 0;
	alpJSON[0] = 65;
	alpJSON[1] = 65;
	alpJSON[2] = 65;
	alpJSON.name = 'AAA';
	string = '';
	this.pos.set(new p5.Vector(0, 0));
	this.hand.objPos.set(new p5.Vector(-w, 0));
	this.obstacle1.pos.set(new p5.Vector(2*w, h*0.9));
	this.obstacle2.pos.set(new p5.Vector(2*w, h*0.9));
	for (var i = 0; i < 5; i++) { this.enemy.ratPos[i].set(new p5.Vector(2*w, h*0.9)); }
	this.enemy.metPos.set(new p5.Vector(2*w, h*0.9));
	this.enemy.ballPos.set(new p5.Vector(3*w, h*0.91));
	this.enemy.dustPos[0].set(new p5.Vector(w*1.2, h*random(0.3, 0.6)));
	this.enemy.dustPos[1].set(new p5.Vector(w*1.9, h*random(0.3, 0.6)));
	this.enemy.dustPos[2].set(new p5.Vector(w*3.7, h*random(0.3, 0.6)));
	this.enemy.boomReturned = true;
	this.physics.removeForce();
}