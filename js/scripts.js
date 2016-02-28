var WIDTH = 640, HEIGHT = 480, pi = Math.PI;
var LeftArrow = 37, UpArrow = 38, RightArrow = 39,  DownArrow = 40;

var canvas, ctx, keystate;
var player, dots;

function circleCollide(c1x,c1y,c1r,c2x,c2y,c2r) {
	var dx = c1x-c2x;
	var dy = c1y-c2y;
	var distance = Math.sqrt(dx*dx + dy*dy);
	if (distance<c1r+c2r) {
		return true;
	}
}

player = {
	x: null,
	y: null,
	radius: 11, 

	update: function() {
		if (keystate[UpArrow]) this.y -= 7;
		if (keystate[DownArrow]) this.y += 7;
		if (keystate[LeftArrow]) this.x -= 7;
		if (keystate[RightArrow]) this.x += 7;
	},
	draw: function() {
		ctx.save();
		ctx.fillStyle='#000';
		ctx.beginPath();
		ctx.arc(player.x,player.y,player.radius,0,2*pi);
		ctx.fill();
		ctx.restore();
	},
	eat: function(food) {
		console.log('eating '+food.radius+' units of food!');
		player.radius+=food.radius;
	}
};

function Dot(x1,y1,radius1,color1,id1) {
	this.x = x1;
	this.y = y1;
	this.radius = radius1;
	this.color = color1;
	this.id = id1;
	this.init = function(x1,y1,r1,c1) {
		x=x1;
		y=y1;
		radius=r1;
		color=c1;
	};
	this.update = function() {
		if (circleCollide(this.x,this.y,this.radius,player.x,player.y,player.radius)) {
			player.eat(this);
			this.delete();
		}
	};
	this.draw = function() {
		ctx.save();
		ctx.fillStyle=this.color;
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.radius,0,2*pi);
		ctx.fill();
		ctx.restore();
	};
	this.delete = function() {
		dots[this.id] = new Dot(Math.random()*WIDTH,Math.random()*HEIGHT,2+Math.random()*5,'#f00',this.id);
	}

	return this;
}

dots = [];

function main() {
	canvas = document.createElement("canvas");
	canvas.width 	= WIDTH;
	canvas.height 	= HEIGHT;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);

	keystate = {};
	document.addEventListener("keydown", function(e) {
		keystate[e.keyCode] = true;
	});
	document.addEventListener("keyup", function(e) {
		delete keystate[e.keyCode];
	});
	init();

	function loop() {
		update();
		draw();

		window.requestAnimationFrame(loop, canvas);
	}
	window.requestAnimationFrame(loop, canvas);
}

function init() {
	player.x = (WIDTH-player.radius)/2;
	player.y = (HEIGHT-player.radius)/2;

	dots[0] = new Dot(Math.random()*WIDTH,Math.random()*HEIGHT,2+Math.random()*5,'#f00',0);
	dots[1] = new Dot(Math.random()*WIDTH,Math.random()*HEIGHT,2+Math.random()*5,'#f00',1);

	ctx.fillStyle="#FFF"
}

function update() {
	player.update();
	for (var key in dots) {
		dots[key].update();
	}
}

function draw() {
	ctx.fillRect(0,0,WIDTH,HEIGHT);
	player.draw();

	for (var key in dots) {
		dots[key].draw();
	}
}

main();