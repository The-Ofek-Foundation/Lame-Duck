var fishImages = getElemId('fish-images').children;
var wrapperTop;
var maxScore = 25;
var duck = getElemId('duck');
setElemData(duck, 'ratio', 1);
setElemData(duck, 'count', 0);
var count = 0;
var highScoreElem = getElemId('high-score');
var scoreElem = getElemId('score');

setInterval(function () {
	var elems = getElemsClass('fish');
	var e1, e2;
	if (Math.random() > 0.9)
	for (var i = 0; i < elems.length - 1; i++) {	// check overlapping fish
		e1 = elems[i];
		for (var a = i + 1; a < elems.length; a++) {
			e2 = elems[a];
			if (elemOverlap(e1, e2))
				if (canEat(e1, e2))
					eatElem(e1, e2);
				else if (canEat(e2, e1))
					eatElem(e2, e1);
		}
	}
	for (var i = 0; i < elems.length; i++) {	// check duck overlaps
		e1 = elems[i];
		resizeElem(e1, getElemData(e1, 'width') * 0.993, getElemData(e1, 'ratio'));
		if (elemOverlap(e1, duck))
			if (canEat(e1, duck))
				eatElem(e1, duck);
			else if (canEat(duck, e1))
				eatElem(duck, e1);
	}
	if (getElemData(duck, 'width') > 13)
		resizeElem(duck, getElemData(duck, 'width') * 0.997, getElemData(duck, 'ratio'));
}, 200);


function rotateDuck(rad) {
	setElemStyle(duck, 'transform', 'rotate(' + rad + 'rad)');
}

function resizeElemAbs(elem, width, height)	{
	setElemStyle(elem, {
		'width': width + 'px',
		'height': height + 'px',
		'z-index': parseInt((width + height) / 2) + 50,
	});
	setElemWidth(elem, width);
	setElemHeight(elem, height);
}

function getElementWidth(elem) {
	var width = getElemWidth(elem), height = getElemHeight(elem);
	return width >= height ? width:height;
}

function resizeElem(elem, width, ratio) {
	if (elem.id === 'duck') {
		setElemData(duck, 'width', width);
		if (ratio >= 1)
			resizeElemAbs(elem, width, width / ratio);
		else resizeElemAbs(elem, width * ratio, width);
		if (width > maxScore) {
			maxScore = width + 0.5 | 0;
			highScoreElem.innerHTML = maxScore;
		}
		scoreElem.innerHTML = parseInt(width + 0.5);
	} else {
		if (width * ratio < 6 || width / ratio < 6) {
			elem.remove();
			return;
		}
		if (ratio >= 1) {
			if (Math.abs(width - getElemWidth(elem)) > 1)
				resizeElemAbs(elem, width, width / ratio);
		} else if (Math.abs(width - getElemHeight(elem)) > 1)
			resizeElemAbs(elem, width * ratio, width);
		setElemData(elem, 'width', width);
	}
}

function calcDist(dx, dy) {
	xd2 = Math.pow(dx, 2);
	yd2 = Math.pow(dy, 2);
	return Math.sqrt(xd2 + yd2);
}

function getDuckSpeed() {
	return getElemWidth(duck) / 5.0;
}

function getFishSpeed(fish) {
	return (getElemWidth(fish) + getElemHeight(fish)) / 1.0;
}

function eatElem(hunter, prey)	{
	resizeElem(hunter, Math.sqrt(Math.pow(getElemData(hunter, 'width'), 2) +
		Math.pow(getElemData(prey, 'width'), 2)), getElemData(hunter, 'ratio'));
	if (prey.id === "duck")	{ // new game functionality
		setElemStyle(prey, 'display', 'none');
		setTimeout(function() {
			alert("Game Over!!!, Your Score: " + maxScore + "!!!");
			var fish = getElemsClass('fish');
			for (var i = 0; i < fish.length; i++)
				fish[i].remove();
			resizeElem(duck, 25, getElemData(duck, 'ratio'));
			setElemStyle(prey, 'display', 'initial');
		}, 10);
		maxScore = 25;
		highScoreElem.innerHTML = maxScore;
		scoreElem.innerHTML = getElemData(duck, 'width');
	} else prey.remove();
}

function canEat(hunter, prey)	{
	return getElemWidth(hunter) >= getElemWidth(prey) * 1.1 &&
		getElemHeight(hunter) >= getElemHeight(prey) * 1.1;
}

function elemOverlap(elema, elemb){
	var al = elema.offsetLeft;
	var ar = al + getElemWidth(elema);
	var bl = elemb.offsetLeft;
	var br = bl + getElemWidth(elemb);

	var at = elema.offsetTop;
	var ab = at + getElemHeight(elema);
	var bt = elemb.offsetTop;
	var bb = bt + getElemHeight(elemb);

	if (bl > ar || br < al) { return false; } //overlap not possible
	if (bt > ab || bb < at) { return false; } //overlap not possible

	return true;
}

function moveElem(elem, x, y, distance, speed, callback)	{
	$elem = $(elem);
	$elem.clearQueue();
	$elem.animate(
		{left: x + 'px', top: y + 'px'},
		{
			duration: distance * speed, easing: "linear", complete: function() {
			setElemStyle(elem, {
				'left': x + 'px',
				'top': y + 'px',
			});
			if (callback)
				callback(elem);
		},
		// step: function() {
			// elem.data('count', elem.data('count') + 1);
			// if (elem.data('count') % 10 === 0)
			//	 if (elem == duck)
			//		 resizeElem(elem, getElemWidth(elem) * 0.999, elem.data('ratio'));
			//	 else resizeElem(elem, getElemWidth(elem) * 0.9999, elem.data('ratio'));
		// }
	});
}

function moveDuck(x, y)	{
	x -= getElemWidth(duck) / 2.0;
	y -= getElemHeight(duck) / 2.0;
	var dx = x - duck.offsetLeft;
	var dy = y - duck.offsetTop;
	rotateDuck(Math.atan2(dy, dx));
	count++;
	if (count % 5 === 0)
		moveElem(duck, x, y, calcDist(dx, dy), getDuckSpeed());
}

function moveFish(fish) {
	var dx = -3 * getElemWidth(fish) + 6 * getElemWidth(fish) * Math.random();
	var dy = -3 * getElemHeight(fish) + 6 * getElemHeight(fish) * Math.random();
	var x = parseInt(getElemStyle(fish, 'left')) + dx;
	var y = parseInt(getElemStyle(fish, 'top')) + dy;
	if (x < 0)
		x = 0;
	else if (x > getElemWidth(contentWrapper) - getElemWidth(fish))
		x = getElemWidth(contentWrapper) - getElemWidth(fish);

	if (y < wrapperTop)
		y = wrapperTop;
	else if (y > getElemHeight(contentWrapper) - getElemHeight(fish))
		y = getElemHeight(contentWrapper) - getElemHeight(fish) - Math.abs(dy);
	moveElem(fish, x, y, calcDist(dx, dy), getFishSpeed(fish), moveFish);
}

function addFish() {
	var oldFish = fishImages[parseInt(Math.random() * fishImages.length)];
	var newFish = oldFish.cloneNode(true);
	var ratio = oldFish.width * 1.0 / oldFish.height;
	if (oldFish.height === 0) {
		setTimeout(addFish, 1000 + Math.random() * 3000);
		return;
	}
	setElemData(newFish, {
		'ratio': ratio,
		'count': 0,
	});
	resizeElem(newFish, getElemData(duck, 'width') / 2.0 +
		getElemData(duck, 'width') * Math.random(), ratio);
	setElemStyle(newFish, {
		'left': Math.random() * (getElemWidth(contentWrapper) -
			getElemWidth(newFish)) + "px",
		'top': Math.random() * (getElemHeight(contentWrapper) -
			getElemWidth(newFish) * ratio) + "px",
	});
	var conflict = false;
	var sibs = getElemsClass('fish');
	for (var i = 0; i < sibs.length; i++)
		if (sibs[i] !== newFish && elemOverlap(newFish, sibs[i])) {
			conflict = true;
			break;
		}
	if (!conflict && elemOverlap(newFish, duck))
		conflict = true;
	if (conflict && false)
		newFish.remove();
	else {
		addClassElem(newFish, 'fish');
		contentWrapper.appendChild(newFish);
		moveFish(newFish);
	}
	setTimeout(addFish, 1000 + Math.random() * 3000);
}

function pageReady() {
	resizeElem(duck, 25, getElemData(duck, 'ratio'));
	addFish();

	wrapperTop = contentWrapper.offsetTop;

	$(window).mousemove();
}

document.addEventListener('mousemove', function (evt) {
	moveDuck(evt.pageX, evt.pageY - wrapperTop);
})
