const canvas = document.getElementById(`canvas`);
const blobs = Array.from(document.querySelectorAll(`.blob`));

// border-radius settings
const rMinMin = 20;// minimum value for random minimum border-radius
const rMinMax = 50;// maximum value for random minimum border-radius
const rMinRange = rMinMax - rMinMin;
const rMaxMin = 50;// minimum value for random maximum border-radius
const rMaxMax = 80;// maximum value for random maximum border-radius
// TODO these can be set to 100 - ...
const randomRange = rMaxMax - rMinMin;

// size settings
const szMin = 80;// minimum value for width or height
const szMax = 180;
const szRatioMax = 1.25;// max ratio for other dimension


// duration settings (msecs)
const timeoutInterval = 5;
const durMin = 100 * timeoutInterval;
const durMax = 500 * timeoutInterval;
const durRange = durMax - durMin;

let tickInterval;
let isRunning = true;


/**
* get a random radius between rMinMin and rMaxMax
* @returns {undefined}
*/
const getRandomValue = function(min, max) {
	return min + Math.round((max - min) * Math.random());
};


/**
* get object with sides
* @returns {undefined}
*/
const getSidesObject = function() {
	return [
		{ props: ['--tlh', '--trh'] },
		{ props: ['--trv', '--brv'] },
		{ props: ['--brh', '--blh'] },
		{ props: ['--tlv', '--blv'] }
	];
};



/**
* initialize animation settings for one side
* @returns {undefined}
*/
const initSideVars = function(side) {
	// randomize values for border radius and duration
	let rStart = side.rEnd;

	if (typeof rStart === 'undefined') {
		rStart = getRandomValue(rMinMin, rMaxMax);
	}

	const rEnd = getRandomValue(rMinMin, rMaxMax);
	const duration = getRandomValue(durMin, durMax);
	const time = 0;
	const r = rStart;
	const deltaPerMsec = (rEnd - rStart) / duration;
	const deltaPerTick = timeoutInterval * deltaPerMsec;
	const settings = {
		r,
		rStart,
		rEnd,
		duration,
		deltaPerTick,
		time
	};
	
	side = Object.assign(side, settings);
};


/**
* init a blobs width and height
* @returns {undefined}
*/
const initWidthAndHeight = function(blob) {
	
	let dimensions = ['--w', '--h'];
	if (Math.random() < 0.5) {
		dimensions = ['--h', '--w'];
	}
	dimensions[0] = getRandomValue(szMin, szMax);
	dimensions[1] = dimensions[0] * (1 + (szRatioMax -1) * Math.random());
	// blob.style.

};


/**
* init all vars for shape for single blob
* @returns {undefined}
*/
const initShapeVars = function(blob) {
	blob.sides = getSidesObject();
	blob.sides.forEach(initSideVars);
	initWidthAndHeight(blob);
};



/**
* initialize animation settings for each side
* @returns {undefined}
*/
const initAllSideVars = function() {
	blobs.forEach(initShapeVars);
};



/**
* do a tick in the animation
* @returns {undefined}
*/
const tick = function() {
	const customProps = [];
	blobs.forEach((blob) => {
		blob.sides.forEach((side) => {
			side.time += timeoutInterval;
			if (side.time <= side.duration) {
				side.r += side.deltaPerTick;
			} else {
				initSideVars(side);
			}

			customProps.push(`${side.props[0]}: ${side.r}%`);
			customProps.push(`${side.props[1]}: ${100 - side.r}%`);
		});
		
		blob.style = customProps.join('; ');
	});

	// new tick
	clearInterval(tickInterval);
	tickInterval = setTimeout(tick, timeoutInterval);
};


/**
* init pause link
* @returns {undefined}
*/
const initPause = function() {
	const link = document.getElementById('pause');
	if (link) {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			if (isRunning) {
				clearTimeout(tickInterval);
			} else {
				tick();
			}
			isRunning = !isRunning;
		});
	}
};



/**
* initialize all
* @returns {undefined}
*/
const init = function() {
	initAllSideVars();
	setTimeout(() => {
		canvas.classList.remove('canvas--is-hidden');
	});
	tick();
	initPause();
};


init();