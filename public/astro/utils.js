"use strict";


// Sine of angles in degrees
function sind(x) {
	return Math.sin(Math.toRadians(x));
}

// Cosine of angles in degrees
function cosd(x) {
	return Math.cos(Math.toRadians(x));
}

// Tangent of angles in degrees
function tand(x) {
	return Math.tan(Math.toRadians(x));
}

// Normalize large angles
// Degrees
function norm360Deg(x) {
	while (x < 0) {
		x += 360;
	}
	return x % 360;
}

// Radians
function norm2PiRad(x) {
	while (x < 0) {
		x += (2 * Math.PI);
	}
	return x % (2 * Math.PI);
}

// Cosine of normalized angle (in radians)
function cost(x) {
	return Math.cos(norm2PiRad(x));
}

exports.sind = sind;
exports.cosd = cosd;
exports.tand = tand;
exports.norm360Deg = norm360Deg;
exports.norm2PiRad = norm2PiRad;
exports.cost = cost;