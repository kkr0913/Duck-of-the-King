var json_url = 'https://api.myjson.com/bins/rbfo';
var scrJSON;
var scrJSON_copy;
var bg;
var game;
var w, h;
var string = '';
var option_idx = 0;
var card_idx = 0;
var sel_idx = 4;
var sel_t0 = -10000;
var cd_t0 = -10000;
var cd = 3000;
var weapon = 0;
var progress = 0;
var mult = 1;
var motion0, motion1, motion;
var mylife = 3;
var myrank = 100;
var alp_idx = 0;
var progScore = 0;
var itemScore = 0;
var killScore = 0;
var myscore = '000000';
var hiscore = '000000';
var rdy = false;
var admin = false;
var title = true;
var loading = false;
var help = false;
var card = false;
var selected = false;
var muted = false;
var jump = false;
var midair = false;
var attack = false;
var cooldown = false;
var hit = false;
var greenworld = false;
var inv = false;
var dead = false;
var gg = false;
var ee = false;
var rankUpdated = true;
var nameEntered = false;
var spawnTime = [1000, 1500, 2000, 3000, 5000, 8000];
var scoreColors = [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 153, 0], [255, 255, 59], [204, 0, 102], [102, 0, 204]];
var obsArray = ['Hydrant', 'Trashcan', 'Trafficcone', 'Phonebooth', 'Car', 'Lamppost', 'Construction'];
var objJSON = {};
var obsJSON = {};
var enmJSON = {};
// var scrJSON = { 1: [9999, 'AAA'], 2: [8888, 'AAA'], 3: [7777, 'AAA'], 4: [6666, 'AAA'], 5: [5555, 'AAA'], 6: [4444, 'AAA'], 7: [3333, 'AAA'], 8: [2222, 'AAA'], 9: [1111, 'AAA'], 10: [0, 'AAA'] }
var alpJSON = { 0: 65, 1: 65, 2: 65, 'name': 'AAA' }


function preload() {
	scrJSON = loadJSON(json_url, function() {
		scrJSON_copy = scrJSON;
		rdy = true;
		if (rdy) { resetJSON(); }
	});
	
	// Font
	arcadeFont = loadFont('ARCADECLASSIC.otf');
	
	// Sound
	intro = loadSound('intro.mp3');
	flip = loadSound('flip.mp3');
	main = loadSound('main.mp3');
	rank = loadSound('rank.mp3');
	menu1 = loadSound('menu1.mp3');
	menu2 = loadSound('menu2.mp3');
	trans = loadSound('trans.mp3');
	mariojump = loadSound('mariojump.mp3');
	ouch = loadSound('ouch.mp3');
	yuck = loadSound('yuck.mp3');
	woww = loadSound('woww.mp3');
	coin = loadSound('coin.mp3');
	lifeup = loadSound('lifeup.mp3');
	over = loadSound('over.mp3');
	alp = loadSound('alp.mp3');
	enter = loadSound('enter.mp3');
	bubble = loadSound('bubble.mp3');
	popped = loadSound('pop.mp3');
	swish = loadSound('swish.mp3');
	stonehit = loadSound('stonehit.mp3');
	poop = loadSound('poop.mp3');
	pooped = loadSound('pooped.mp3');
	quack = loadSound('quack.mp3');
	
	// Image (general)
	c = loadImage('c.png');
	mutedIcon = loadImage('muted.png');
	unmutedIcon = loadImage('unmuted.png');
	nyu = loadImage('nyu.png');
	bg = loadImage('bg.png');
	brick = loadImage('brick.png');
	bricksquare = loadImage('bricksquare.png');
	cloud = loadImage('cloud.png');
	card0 = loadImage('card0.png');
	card1 = loadImage('card1.png');
	card2 = loadImage('card2.png');
	card3 = loadImage('card3.png');
	card4 = loadImage('card4.png');
	icon1 = loadImage('icon1.png');
	icon2 = loadImage('icon2.png');
	icon3 = loadImage('icon3.png');
	icon4 = loadImage('icon4.png');
	life = loadImage('life.png');
	duck = loadImage('duck.png');
	duck_walk1 = loadImage('duck_walk1.png');
	duck_walk2 = loadImage('duck_walk2.png');
	duck_fly1 = loadImage('duck_fly1.png');
	duck_fly2 = loadImage('duck_fly2.png');
	dead_duck1 = loadImage('dead_duck1.png');
	dead_duck2 = loadImage('dead_duck2.png');
	weapon1 = loadImage('weapon1.png');
	weapon2 = loadImage('weapon2.png');
	weapon3 = loadImage('weapon3.png');
	weapon4 = loadImage('weapon4.png');
	weapon1_pop = loadImage('weapon1_pop.png');
	hand0 = loadImage('hand0.png');
	hand1 = loadImage('hand1.png');
	
	// Image (items)
	radioactive = loadImage('radioactive.png');
	heart = loadImage('heart.png');
	mcdonalds = loadImage('mcdonalds.png');
	kfc = loadImage('kfc.png');
	randombox = loadImage('randombox.png');
	apple = loadImage('apple.png');
	cherry = loadImage('cherry.png');
	fish = loadImage('fish.png');
	hamburger = loadImage('hamburger.png');
	pizza = loadImage('pizza.png');
	chicken = loadImage('chicken.png');
	fries = loadImage('fries.png');
	coke = loadImage('coke.png');
	eatenapple = loadImage('eatenapple.png');
	shoe = loadImage('shoe.png');
	can = loadImage('can.png');
	trash = loadImage('trash.png');
	money = loadImage('money.png');
	
	// Image (obstacles)
	hydrant = loadImage('hydrant.png');
	trashcan = loadImage('trashcan.png');
	trafficcone = loadImage('trafficcone.png');
	phonebooth = loadImage('phonebooth.png');
	car = loadImage('car.png');
	lamppost = loadImage('lamppost.png');
	construction1 = loadImage('construction1.png');
	construction2 = loadImage('construction2.png');
	
	// Image (enemies)
	rat1 = loadImage('rat1.png');
	rat2 = loadImage('rat2.png');
	dust1 = loadImage('dust1.png');
	dust2 = loadImage('dust2.png');
	dust3 = loadImage('dust3.png');
	dust4 = loadImage('dust4.png');
	dust5 = loadImage('dust5.png');
	met0 = loadImage('met0.png');
	met1 = loadImage('met1.png');
	met2 = loadImage('met2.png');
	met0_rev = loadImage('met0_rev.png');
	met1_rev = loadImage('met1_rev.png');
	met2_rev = loadImage('met2_rev.png');
	soccerball = loadImage('soccerball.png');
	basketball = loadImage('basketball.png');
	bowlingball = loadImage('bowlingball.png');
	boomerang = loadImage('boomerang.png');
	wind = loadImage('wind.png');
}


function setup() {
	// updateJSON('https://api.myjson.com/bins/rbfo', scrJSON);
	createCanvas(windowWidth, windowHeight);
	frameRate(60);
	pixelDensity(0.4);
	textAlign(CENTER, CENTER);
	textSize(60);
	textFont(arcadeFont);
	noStroke();
	
	// Set Game Screen Width & Height
	w = width - height*0.1;
	h = height*0.84;
	
	// Array for Motion Timing
	motion0 = new Array(10).fill(0);
	motion1 = new Array(10).fill(1);
	motion = motion0.concat(motion1);
	
	// Update JSON (items)
	objJSON.Radioactive = [radioactive, h*0.06, h*0.08];
	objJSON.Heart = [heart, h*0.06, h*0.05];
	objJSON.Mcdonalds = [mcdonalds, h*0.06, h*0.06];
	objJSON.Kfc = [kfc, h*0.06, h*0.06];
	objJSON.Randombox = [randombox, h*0.06, h*0.06];
	objJSON.Apple = [apple, h*0.05, h*0.06];
	objJSON.Cherry = [cherry, h*0.06, h*0.06];
	objJSON.Fish = [fish, h*0.06, h*0.04];
	objJSON.Hamburger = [hamburger, h*0.06, h*0.05];
	objJSON.Pizza = [pizza, h*0.06, h*0.04];
	objJSON.Chicken = [chicken, h*0.06, h*0.04];
	objJSON.Fries = [fries, h*0.05, h*0.06];
	objJSON.Coke = [coke, h*0.03, h*0.06];
	objJSON.Eatenapple = [eatenapple, h*0.05, h*0.06];
	objJSON.Shoe = [shoe, h*0.05, h*0.06];
	objJSON.Can = [can, h*0.06, h*0.06];
	objJSON.Trash = [trash, h*0.06, h*0.06];
	objJSON.Money = [money, h*0.06, h*0.04];
	
	// Update JSON (obstacles)
	obsJSON.Hydrant = [hydrant, h*0.06, h*0.12];
	obsJSON.Trashcan = [trashcan, h*0.12, h*0.18];
	obsJSON.Trafficcone = [trafficcone, h*0.10, h*0.14];
	obsJSON.Phonebooth = [phonebooth, h*0.20, h*0.34];
	obsJSON.Car = [car, h*0.50, h*0.18];
	obsJSON.Lamppost = [lamppost, h*0.12, h*0.47];
	obsJSON.Construction = [construction1, h*0.6, h*0.1, h*0.1375];
	
	// Update JSON (enemies)
	enmJSON.Rat = [rat1, rat2, h*0.10, h*0.05];
	enmJSON.Dust = [[dust1, dust2, dust3, dust4, dust5], h*0.08, h*0.12];
	enmJSON.Met = [[met0, met1, met2, met0_rev, met1_rev, met2_rev], h*0.05, h*0.05, h*0.03];
	enmJSON.Ball = [[soccerball, basketball, bowlingball], h*0.12, h*0.12];
	enmJSON.Boom = [boomerang, h*0.05, h*0.05];
	enmJSON.Wind = [wind, h*0.45, h*0.30];
	
	// Resize Images (general)
	c.resize(h*0.04, h*0.04);
	mutedIcon.resize(height*0.05, height*0.05);
	unmutedIcon.resize(height*0.05, height*0.05);
	nyu.resize(height*0.8, height*0.8);
	bg.resize(w+2, h);
	brick.resize(w+2, h*0.1+5);
	cloud.resize(h*0.4, h*0.15);
	card0.resize(h*0.31, h*0.50);
	card1.resize(h*0.31, h*0.50);
	card2.resize(h*0.31, h*0.50);
	card3.resize(h*0.31, h*0.50);
	card4.resize(h*0.31, h*0.50);
	life.resize(h*0.06, h*0.05);
	duck.resize(h*0.08, h*0.1);
	duck_walk1.resize(h*0.08, h*0.1);
	duck_walk2.resize(h*0.08, h*0.1);
	duck_fly1.resize(h*0.08, h*0.1);
	duck_fly2.resize(h*0.08, h*0.1);
	dead_duck1.resize(h*0.08, h*0.1);
	dead_duck2.resize(h*0.08, h*0.1);
	weapon1.resize(h*0.03, h*0.03);
	weapon2.resize(h*0.03, h*0.03);
	weapon3.resize(h*0.03, h*0.03);
	weapon4.resize(h*0.11, h*0.20);
	weapon1_pop.resize(h*0.034, h*0.034);
	hand0.resize(h*0.30, h*0.20);
	hand1.resize(h*0.30, h*0.20);
	
	// Resize Images (items)
	radioactive.resize(objJSON.Radioactive[1], objJSON.Radioactive[2]);
	heart.resize(objJSON.Heart[1], objJSON.Heart[2]);
	mcdonalds.resize(objJSON.Mcdonalds[1], objJSON.Mcdonalds[2]);
	kfc.resize(objJSON.Kfc[1], objJSON.Kfc[2]);
	randombox.resize(objJSON.Randombox[1], objJSON.Randombox[2]);
	apple.resize(objJSON.Apple[1], objJSON.Apple[2]);
	cherry.resize(objJSON.Cherry[1], objJSON.Cherry[2]);
	fish.resize(objJSON.Fish[1], objJSON.Fish[2]);
	hamburger.resize(objJSON.Hamburger[1], objJSON.Hamburger[2]);
	pizza.resize(objJSON.Pizza[1], objJSON.Pizza[2]);
	chicken.resize(objJSON.Chicken[1], objJSON.Chicken[2]);
	fries.resize(objJSON.Fries[1], objJSON.Fries[2]);
	coke.resize(objJSON.Coke[1], objJSON.Coke[2]);
	eatenapple.resize(objJSON.Eatenapple[1], objJSON.Eatenapple[2]);
	shoe.resize(objJSON.Shoe[1], objJSON.Shoe[2]);
	can.resize(objJSON.Can[1], objJSON.Can[2]);
	trash.resize(objJSON.Trash[1], objJSON.Trash[2]);
	money.resize(objJSON.Money[1], objJSON.Money[2]);
	
	// Resize Images (obstacles)
	hydrant.resize(obsJSON.Hydrant[1], obsJSON.Hydrant[2]);
	trashcan.resize(obsJSON.Trashcan[1], obsJSON.Trashcan[2]);
	trafficcone.resize(obsJSON.Trafficcone[1], obsJSON.Trafficcone[2]);
	phonebooth.resize(obsJSON.Phonebooth[1], obsJSON.Phonebooth[2]);
	car.resize(obsJSON.Car[1], obsJSON.Car[2]);
	lamppost.resize(obsJSON.Lamppost[1], obsJSON.Lamppost[2]);
	construction1.resize(obsJSON.Construction[1], obsJSON.Construction[3]);
	construction2.resize(h*0.6, h*0.6);
	
	// Resize Images (enemies)
	rat1.resize(enmJSON.Rat[2], enmJSON.Rat[3]);
	rat2.resize(enmJSON.Rat[2], enmJSON.Rat[3]);
	dust1.resize(enmJSON.Dust[1], enmJSON.Dust[1]);
	dust2.resize(enmJSON.Dust[1], enmJSON.Dust[1]);
	dust3.resize(enmJSON.Dust[1], enmJSON.Dust[1]);
	dust4.resize(enmJSON.Dust[1], enmJSON.Dust[1]);
	dust5.resize(enmJSON.Dust[1], enmJSON.Dust[1]);
	met0.resize(enmJSON.Met[1], enmJSON.Met[3]);
	met1.resize(enmJSON.Met[1], enmJSON.Met[2]);
	met2.resize(enmJSON.Met[1], enmJSON.Met[2]);
	met0_rev.resize(enmJSON.Met[1], enmJSON.Met[3]);
	met1_rev.resize(enmJSON.Met[1], enmJSON.Met[2]);
	met2_rev.resize(enmJSON.Met[1], enmJSON.Met[2]);
	soccerball.resize(enmJSON.Ball[1], enmJSON.Ball[2]);
	basketball.resize(enmJSON.Ball[1], enmJSON.Ball[2]);
	bowlingball.resize(enmJSON.Ball[1], enmJSON.Ball[2]);
	boomerang.resize(enmJSON.Boom[1], enmJSON.Boom[2]);
	wind.resize(enmJSON.Wind[1], enmJSON.Wind[2]);
	
	game = new DuckGame();
}


function draw() {
	if (!rdy) { return; }
	
	background(0, 191, 255);
	
	// Play Music
	game.music();
	
	if (title || loading) {
		image(cloud, (width*(0.12+frameCount*0.001))%(width+h*0.4)-h*0.4, height*0.12);
		image(cloud, (width*(0.7+frameCount*0.0005))%(width+h*0.4)-h*0.4, height*0.05);
		image(cloud, (width*(0.9+frameCount*0.0008))%(width+h*0.4)-h*0.4, height*0.5);
		image(cloud, (width*(0.06+frameCount*0.0012))%(width+h*0.4)-h*0.4, height*0.62);
		image(cloud, (width*(0.5+frameCount*0.0016))%(width+h*0.4)-h*0.4, height*0.8);
	}
	
	// Title Screen
	if (title) {
		game.titleScreen();
		return;
	}
	
	// Loading Screen
	if (loading) {
		game.loadingScreen();
		if (help) {
			background(0, 191, 255);
			push();
			noFill();
			stroke(255);
			strokeWeight(3);
			rect(width*0.2, height*0.08, width*0.6, height*0.32);
			rect(width*0.2, height*0.50, width*0.6, height*0.43);
			fill(0, 191, 255);
			noStroke();
			rect(width*0.4, height*0.03, width*0.2, height*0.1);
			rect(width*0.4, height*0.45, width*0.2, height*0.1);
			fill('#FFEB3B');
			stroke('#FF9900');
			textSize(60);
			text('general', width*0.4, height*0.03, width*0.2, height*0.1);
			text('game   play', width*0.4, height*0.45, width*0.2, height*0.1);
			fill(255);
			noStroke();
			textSize(40);
			text("arrow   keys   to   toggle   options", 0, height*0.13, width, height*0.07);
			text("space   key   to   select   option", 0, height*0.2, width, height*0.07);
			text("m   key   or   click   icon   to   mute", 0, height*0.27, width, height*0.07);
			text("left   or   right   key   to   move", 0, height*0.58, width, height*0.07);
			text("press   space   key   to   jump", 0, height*0.65, width, height*0.07);
			text("hold   space   key   to   glide", 0, height*0.72, width, height*0.07);
			text("x   key   to   attack", 0, height*0.79, width, height*0.07);
			pop();
		}
		return;
	}
	
	// Card Select Screen
	if (card) {
		game.selectScreen();
		return;
	}
	
	if (gg) {
		game.scoreScreen();
		return;
	}
	
	// Start Game
	game.start();
	
	// Top Screen
	translate(-height*0.05, -height*0.11);
	push();
	fill(0);
	rect(0, -height*0.01, width, height*0.07);
	imageMode(CORNERS);
	fill(255, 255, 0);
	textSize(height*0.05);
	textAlign(LEFT, CENTER);
	text("Life", width*0.03, 0, width*0.95, height*0.06);
	for (var n = 1; n <= mylife; n++) { image(life, width*0.11+h*0.06*(n-1), height*0.015, width*0.11+h*0.06*n, height*0.015+h*0.05); }
	text("Item", width*0.24, 0, width*0.76, height*0.06);
	image([icon1, icon2, icon3, icon4][weapon], width*0.32, height*0.005, width*0.32+height*0.05, height*0.055);
	rectMode(CORNERS);
	fill(0, 128);
	var frac = 0;
	if (cd > 3000) { frac = 0; }
	else { frac = 15 - floor(cd/200); }
	rect(width*0.32+height*0.05*0.08, height*0.005+height*0.05*(0.92-0.056*frac), width*0.32+height*0.05*0.92, height*0.005+height*0.05*0.92);
	fill(255, 255, 0);
	text("Score", width*0.42, 0, width*0.58, height*0.06);
	fill(255);
	text(myscore, width*0.53, 0, width*0.43, height*0.06);
	fill(255, 0, 0);
	text("High Score", width*0.7, 0, width*0.3, height*0.06);
	textAlign(RIGHT, CENTER);
	fill(12, 187, 143);
	text(hiscore, 0, 0, width*0.98, height*0.06);
	pop();
	
	// Frame
	push();
	translate(0, height*0.06);
	fill(76, 0, 153);
	rect(0, 0, height*0.05, height*0.94);
	rect(width-height*0.05, 0, height*0.05, height*0.94);
	rect(0, 0, width, height*0.05);
	rect(0, height*0.89, width, height*0.05);
	if (muted) { image(mutedIcon, width-height*0.05, 5); }
	if (!muted) { image(unmutedIcon, width-height*0.05, 5); }
	pop();
}


// - - - Mouse Click Event - - - //
function mouseClicked() {
	if (title || loading || card || gg ||(mouseX < width - height*0.05) || (mouseY < height*0.06 + 5) || (mouseY > height*0.11 + 5)) {
		return;
	}
	// muted = !muted;
	// if (muted) { main.volume(0); }
	// if (!muted) { main.volume(1); }
}


// - - - Key Press Event - - - //
function keyPressed() {
	if ((keyCode >= 65) && (keyCode <= 90)) {
		if (string.length < 7) { string += key.toLowerCase(); }
	}
	if (keyCode === ENTER) {
		if (!admin) {
			if (string == 'rlarbfo') { admin = true; }
		}
		if (admin) {
			if (string == 'reset') { game.reset(); }
			if (string == 'die') { game.physics.removeForce(); mylife = 0; game.dead_t0 = millis(); game.dead_h0 = game.pos.y; over.play(); }
			if (string == 'gg') { gg = true; rankUpdated = false; }
			if (string == 'dulk') { greenworld = true; game.hand.getGreenT = true; woww.play(); }
			if (string == 'ouch') { game.inv_t0 = millis(); ouch.play(); }
		}
		string = '';
	}
	
	if (title) {
		if (keyCode === ENTER) { return; }
		title = false;
		loading = true;
		trans.play();
	}
	else if (loading) {
		if ((key === "ArrowUp") && (option_idx != 0) && !help) { option_idx -= 1; menu1.play(); }
		if ((key === "ArrowDown") && (option_idx != 2) && !help) { option_idx += 1; menu1.play(); }
		if (keyCode === 32) {
			if (help) { help = false; option_idx = 0; trans.play(); }
			else {
				trans.play();
				if (option_idx == 0) { loading = false; card = true; }
				if (option_idx == 1) { help = true; }
				if (option_idx == 2) { title = true; loading = false; option_idx = 0; }
			}
		}
	}
	else if (card) {
		if ((key === "ArrowLeft") && (card_idx != 0) && !selected) { card_idx -= 1; menu2.play(); }
		if ((key === "ArrowRight") && (card_idx != 2) && !selected) { card_idx += 1; menu2.play(); }
		if ((keyCode === 32) && !selected) {
			sel_t0 = millis();
			weapon = floor(random(0, 4));
			sel_idx = card_idx;
			selected = true;
			flip.play();
		}
	}
	else if (gg) {
		if (!nameEntered) {
			if (key === "ArrowLeft") { if (alp_idx == 0) { alp_idx = 0; } else { alp_idx -= 1; alp.play(); } }
			if (key === "ArrowRight") { if (alp_idx == 2) { alp_idx = 2; } else { alp_idx += 1; alp.play(); } }
			if (key === "ArrowUp") { if (alpJSON[alp_idx] == 90) { alpJSON[alp_idx] = 65; } else { alpJSON[alp_idx] += 1; alp.play(); } }
			if (key === "ArrowDown") { if (alpJSON[alp_idx] == 65) { alpJSON[alp_idx] = 90; } else { alpJSON[alp_idx] -= 1; alp.play(); } }
			if (keyCode === 32) {
				alpJSON.name = char(alpJSON[0]) + char(alpJSON[1]) + char(alpJSON[2]);
				nameEntered = true;
				if (alpJSON.name == 'NYU') { ee = true; }
				enter.play();
			}
		}
		else if (ee) {
			game.reset();
		}
		else {
			game.reset();
		}
	}
	else {
		if ((keyCode === 32) && (!midair)) { jump = true;  midair = true; mariojump.play(); }
		if (((key === 'x') || (key === 'X')) && !cooldown) {
			cd_t0 = millis();
			attack = true;
			cooldown = true;
			hit = false;
			if (weapon == 0) { bubble.play(); }
			if (weapon == 1) { swish.play(); }
			if (weapon == 2) { poop.play(); }
			if (weapon == 3) { quack.play(); }
		}
		if (admin && ((key === 'z') || (key === 'Z')) && !cooldown) { if (weapon == 3) { weapon = 0; } else { weapon += 1; } }
	}
}


// - - - Set Probability - - - //
function setProb(p) {
	// 0 <= p <= 1
	if ((p < 0) || (p > 1)) {
		console.log('Invalid Argument: SetProb(' + str(p) + ')');
		return;
	}
	
	var rand = random();
	var result;
	if (rand <= p) { result = 1; }
	if (rand > p) { result = 0; }
	
	return result;
}


// - - - Update External JSON with jQuery - - - //
function updateJSON(url, json) {
	var obj = json;
	var data = JSON.stringify(obj);
	$.ajax(
		{
			url:url,
			type:"PUT",
			data: data,
			contentType:"application/json; charset=utf-8",
			dataType:"json",
			success: function(data, textStatus, jqXHR){
			}
		}
	);
}


// - - - Check JSON - - - //
function resetJSON() {
	var bool = false;
	var initial_scores = { 1: [9999, 'AAA'], 2: [8888, 'AAA'], 3: [7777, 'AAA'], 4: [6666, 'AAA'], 5: [5555, 'AAA'], 6: [4444, 'AAA'], 7: [3333, 'AAA'], 8: [2222, 'AAA'], 9: [1111, 'AAA'], 10: [0, 'AAA'] };
	
	for (var i = 1; i < 11; i++) {
    if ((Object.keys(scrJSON).length != 10) || (typeof scrJSON[i] == 'undefined') || (typeof scrJSON[i][0] != 'number') || (typeof scrJSON[i][1] != 'string')) {
	    bool = true;
			break;
		}
		else if ((str(scrJSON[i][0]).length > 6) || (scrJSON[i][1].length != 3)) {
			bool = true;
			break;
		}
	}
	
	if (bool) { updateJSON(json_url, initial_scores); console.log('JSON has been corrupted. Resetting JSON to initial value'); }
}