"use strict";
/**
 * @author OliverLD
 * Adapted in ES6 from Henning Umland's original code.
 */

if (Math.toRadians === undefined) {
	Math.toRadians = (deg) => {
		return deg * (Math.PI / 180);
	};
}

if (Math.toDegrees === undefined) {
	Math.toDegrees = (rad) => {
		return rad * (180 / Math.PI);
	};
}

let Utils = require('./utils.js');

let Earth = require('./earth.js');
let Venus = require('./venus.js');
let Mars = require('./mars.js');
let Jupiter = require('./jupiter.js');
let Saturn = require('./saturn.js');

// Global Variables
let T, T2, T3, T4, T5, TE, TE2, TE3, TE4, TE5, Tau, Tau2, Tau3, Tau4, Tau5, deltaT;
let eps0, eps, deltaPsi, deltaEps;
let Le, Be, Re;
let kappa, pi0, e;
let lambdaSun, RASun, DECSun, GHASun, SDSun, HPSun, EoT, EoE, EoEout, Lsun_true, Lsun_prime;
let dES, dayFraction, GHAAmean;
let RAVenus, DECVenus, GHAVenus, SDVenus, HPVenus;
let RAMars, DECMars, GHAMars, SDMars, HPMars;
let RAJupiter, DECJupiter, GHAJupiter, SDJupiter, HPJupiter;
let RASaturn, DECSaturn, GHASaturn, SDSaturn, HPSaturn;
let RAMoon, DECMoon, GHAMoon, SDMoon, HPMoon;
let RAPol, DECPol, GHAPol;
let OoE, tOoE, LDist;
let JD0h, JD, JDE, lambdaMapp, SidTm, GHAAtrue, SidTa;
let moonPhaseAngle = 0, moonPhase = "", DoW = "", illumMoon, illumVenus, illumMars, illumJupiter, illumSaturn;

// Main function
function calculate(year, month, day, hour, minute, second, delta_t) {
	calculateJulianDate(year, month, day, hour, minute, second, delta_t);
	calculateNutation();
	calculateAberration();
	calculateAries();
	calculateSun();
	calculateVenus();
	calculateMars();
	calculateJupiter();
	calculateSaturn();
	calculateMoon();
	calculatePolaris();
	calculateMoonPhase();
	calculateWeekDay();
	return gatherOutput();
}

function isLeapYear(year) {
	let ly = false;
	if (year / 4 - Math.floor(year / 4) === 0) {
		ly = true;
	}
	if (year / 100 - Math.floor(year / 100) === 0) {
		ly = false;
	}
	if (year / 400 - Math.floor(year / 400) === 0) {
		ly = true;
	}
	return ly;
}

// Input data conversion and reworking
function calculateJulianDate(year, month, day, hour, minute, second, delta_t) {

	dayFraction = (hour + minute / 60 + second / 3600) / 24;
	if (dayFraction < 0 || dayFraction > 1) {
		throw new Error("Time out of range! Restart calculation.");
	}
	deltaT = delta_t;

	// Calculating Julian date, century, and millennium

	// Julian date (UT1)
	if (month <= 2) {
		year -= 1;
		month += 12;
	}
	let A = Math.floor(year / 100);
	let B = 2 - A + Math.floor(A / 4);
	JD0h = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;

	JD = JD0h + dayFraction;

	// Julian centuries (UT1) from 2000 January 0.5
	T = (JD - 2451545) / 36525;
	T2 = T * T;
	T3 = T * T2;
	T4 = T * T3;
	T5 = T * T4;

	// Julian ephemeris date (TDT)
	JDE = JD + deltaT / 86400;

	// Julian centuries (TDT) from 2000 January 0.5
	TE = (JDE - 2451545) / 36525;
	TE2 = TE * TE;
	TE3 = TE * TE2;
	TE4 = TE * TE3;
	TE5 = TE * TE4;

	// Julian millenniums (TDT) from 2000 January 0.5
	Tau = 0.1 * TE;
	Tau2 = Tau * Tau;
	Tau3 = Tau * Tau2;
	Tau4 = Tau * Tau3;
	Tau5 = Tau * Tau4;
}


// Output Hour Angle
function outHA(x) {
	let GHAdeg = Math.floor(x);
	let GHAmin = Math.floor(60 * (x - GHAdeg));
	let GHAsec = Math.round(3600 * (x - GHAdeg - GHAmin / 60));
	if (GHAsec === 60) {
		GHAsec = 0;
		GHAmin += 1;
	}

	if (GHAmin === 60) {
		GHAmin = 0;
		GHAdeg += 1;
	}

	if (GHAdeg === 0) {
		GHAdeg = "000";
	} else if (GHAdeg < 10) {
		GHAdeg = "00" + GHAdeg;
	} else if (GHAdeg < 100) {
		GHAdeg = "0" + GHAdeg;
	}
	if (GHAmin === 0) {
		GHAmin = "00";
	} else if (GHAmin < 10) {
		GHAmin = "0" + GHAmin;
	}
	if (GHAsec < 10) {
		GHAsec = "0" + GHAsec;
	}
	return GHAdeg + "°" + " " + GHAmin + "'" + " " + GHAsec + "''";
}

// Output Right Ascension
function outRA(x) {
	let t = x / 15;
	let RAh = Math.floor(t);
	let RAmin = Math.floor(60 * (t - RAh));
	let RAsec = Math.round(10 * (3600 * (t - RAh - RAmin / 60))) / 10;
	if (RAsec === 60) {
		RAsec = 0;
		RAmin += 1;
	}
	if (RAmin === 60) {
		RAmin = 0;
		RAh += 1;
	}
	if (RAh === 0) {
		RAh = "00";
	} else if (RAh < 10) {
		RAh = "0" + RAh;
	}
	if (RAmin === 0) {
		RAmin = "00";
	} else if (RAmin < 10) {
		RAmin = "0" + RAmin;
	}
	if (RAsec < 10) {
		RAsec = "0" + RAsec;
	}
	return RAh + "h" + " " + RAmin + "m" + " " + RAsec + "s";
}

// Output Obliquity of Ecliptic
function outECL(x) {
	let ECLdeg = Math.floor(x);
	let ECLmin = Math.floor(60 * (x - ECLdeg));
	let ECLsec = Math.round(3600000 * (x - ECLdeg - ECLmin / 60)) / 1000;
	if (ECLsec === 60) {
		ECLsec = 0;
		ECLmin += 1;
	}
	if (ECLmin === 60) {
		ECLmin = 0;
		ECLdeg += 1;
	}
	if (ECLmin === 0) {
		ECLmin = "00";
	} else if (ECLmin < 10) {
		ECLmin = "0" + ECLmin;
	}
	if (ECLsec < 10) {
		ECLsec = "0" + ECLsec;
	}
	return ECLdeg + "°" + " " + ECLmin + "'" + " " + ECLsec + "''";
}

// Output Sidereal Time
function outSideralTime(x) {
	let GMSTdecimal = x / 15;
	let GMSTh = Math.floor(GMSTdecimal);
	let GMSTmdecimal = 60 * (GMSTdecimal - GMSTh);
	let GMSTm = Math.floor(GMSTmdecimal);
	let GMSTsdecimal = 60 * (GMSTmdecimal - GMSTm);
	let GMSTs = Math.round(1000 * GMSTsdecimal) / 1000;
	if (GMSTs - Math.floor(GMSTs) === 0) {
		GMSTs += ".000";
	} else if (10 * GMSTs - Math.floor(10 * GMSTs) === 0) {
		GMSTs += "00";
	} else if (100 * GMSTs - Math.floor(100 * GMSTs) === 0) {
		GMSTs += "0";
	}
	return GMSTh + "h" + " " + GMSTm + "m" + " " + GMSTs + "s";
}

// Output Declination
function outDec(x) {
	let name = "N", signDEC = 0;
	if (x < 0) {
		signDEC = -1;
		name = "S";
	} else {
		signDEC = 1;
		name = "N";
	}
	let DEC = Math.abs(x);
	let DECdeg = Math.floor(DEC);
	let DECmin = Math.floor(60 * (DEC - DECdeg));
	let DECsec = Math.round(3600 * (DEC - DECdeg - DECmin / 60));
	if (DECsec === 60) {
		DECsec = 0;
		DECmin += 1;
	}
	if (DECmin === 60) {
		DECmin = 0;
		DECdeg += 1;
	}
	if (DECdeg === 0) {
		DECdeg = "00";
	} else if (DECdeg < 10) {
		DECdeg = "0" + DECdeg;
	}
	if (DECmin === 0) {
		DECmin = "00";
	} else if (DECmin < 10) {
		DECmin = "0" + DECmin;
	}
	if (DECsec < 10) {
		DECsec = "0" + DECsec;
	}
	return name + "   " + DECdeg + "°" + " " + DECmin + "'" + " " + DECsec + "''";
}

// Output SD and HP
function outSdHp(x) {
	x = Math.round(10 * x) / 10;
	if (x - Math.floor(x) === 0) {
		x += ".0";
	}
	return x + "''";
}

// Astronomical functions
// Nutation, obliquity of the ecliptic
function calculateNutation() {
	// IAU 1980 calculateNutation theory:

	// Mean anomaly of the Moon
	let Mm = 134.962981389 + 198.867398056 * TE + Utils.norm360Deg(477000 * TE) + 0.008697222222 * TE2 + TE3 / 56250;

	// Mean anomaly of the Sun
	let M = 357.527723333 + 359.05034 * TE + Utils.norm360Deg(35640 * TE) - 0.0001602777778 * TE2 - TE3 / 300000;

	// Mean distance of the Moon from ascending node
	let F = 93.271910277 + 82.017538055 * TE + Utils.norm360Deg(483120 * TE) - 0.0036825 * TE2 + TE3 / 327272.7273;

	// Mean elongation of the Moon
	let D = 297.850363055 + 307.11148 * TE + Utils.norm360Deg(444960 * TE) - 0.001914166667 * TE2 + TE3 / 189473.6842;

	// Longitude of the ascending node of the Moon
	let omega = 125.044522222 - 134.136260833 * TE - Utils.norm360Deg(1800 * TE) + 0.002070833333 * TE2 + TE3 / 450000;

	// Periodic terms for calculateNutation
	let nut = new Array(106);
	nut[0] = " 0 0 0 0 1-171996-174.2 92025 8.9 ";
	nut[1] = " 0 0 2-2 2 -13187  -1.6  5736-3.1 ";
	nut[2] = " 0 0 2 0 2  -2274  -0.2   977-0.5 ";
	nut[3] = " 0 0 0 0 2   2062   0.2  -895 0.5 ";
	nut[4] = " 0-1 0 0 0  -1426   3.4    54-0.1 ";
	nut[5] = " 1 0 0 0 0    712   0.1    -7 0.0 ";
	nut[6] = " 0 1 2-2 2   -517   1.2   224-0.6 ";
	nut[7] = " 0 0 2 0 1   -386  -0.4   200 0.0 ";
	nut[8] = " 1 0 2 0 2   -301   0.0   129-0.1 ";
	nut[9] = " 0-1 2-2 2    217  -0.5   -95 0.3 ";
	nut[10] = "-1 0 0 2 0    158   0.0    -1 0.0 ";
	nut[11] = " 0 0 2-2 1    129   0.1   -70 0.0 ";
	nut[12] = "-1 0 2 0 2    123   0.0   -53 0.0 ";
	nut[13] = " 1 0 0 0 1     63   0.1   -33 0.0 ";
	nut[14] = " 0 0 0 2 0     63   0.0    -2 0.0 ";
	nut[15] = "-1 0 2 2 2    -59   0.0    26 0.0 ";
	nut[16] = "-1 0 0 0 1    -58  -0.1    32 0.0 ";
	nut[17] = " 1 0 2 0 1    -51   0.0    27 0.0 ";
	nut[18] = "-2 0 0 2 0    -48   0.0     1 0.0 ";
	nut[19] = "-2 0 2 0 1     46   0.0   -24 0.0 ";
	nut[20] = " 0 0 2 2 2    -38   0.0    16 0.0 ";
	nut[21] = " 2 0 2 0 2    -31   0.0    13 0.0 ";
	nut[22] = " 2 0 0 0 0     29   0.0    -1 0.0 ";
	nut[23] = " 1 0 2-2 2     29   0.0   -12 0.0 ";
	nut[24] = " 0 0 2 0 0     26   0.0    -1 0.0 ";
	nut[25] = " 0 0 2-2 0    -22   0.0     0 0.0 ";
	nut[26] = "-1 0 2 0 1     21   0.0   -10 0.0 ";
	nut[27] = " 0 2 0 0 0     17  -0.1     0 0.0 ";
	nut[28] = " 0 2 2-2 2    -16   0.1     7 0.0 ";
	nut[29] = "-1 0 0 2 1     16   0.0    -8 0.0 ";
	nut[30] = " 0 1 0 0 1    -15   0.0     9 0.0 ";
	nut[31] = " 1 0 0-2 1    -13   0.0     7 0.0 ";
	nut[32] = " 0-1 0 0 1    -12   0.0     6 0.0 ";
	nut[33] = " 2 0-2 0 0     11   0.0     0 0.0 ";
	nut[34] = "-1 0 2 2 1    -10   0.0     5 0.0 ";
	nut[35] = " 1 0 2 2 2     -8   0.0     3 0.0 ";
	nut[36] = " 0-1 2 0 2     -7   0.0     3 0.0 ";
	nut[37] = " 0 0 2 2 1     -7   0.0     3 0.0 ";
	nut[38] = " 1 1 0-2 0     -7   0.0     0 0.0 ";
	nut[39] = " 0 1 2 0 2      7   0.0    -3 0.0 ";
	nut[40] = "-2 0 0 2 1     -6   0.0     3 0.0 ";
	nut[41] = " 0 0 0 2 1     -6   0.0     3 0.0 ";
	nut[42] = " 2 0 2-2 2      6   0.0    -3 0.0 ";
	nut[43] = " 1 0 0 2 0      6   0.0     0 0.0 ";
	nut[44] = " 1 0 2-2 1      6   0.0    -3 0.0 ";
	nut[45] = " 0 0 0-2 1     -5   0.0     3 0.0 ";
	nut[46] = " 0-1 2-2 1     -5   0.0     3 0.0 ";
	nut[47] = " 2 0 2 0 1     -5   0.0     3 0.0 ";
	nut[48] = " 1-1 0 0 0      5   0.0     0 0.0 ";
	nut[49] = " 1 0 0-1 0     -4   0.0     0 0.0 ";
	nut[50] = " 0 0 0 1 0     -4   0.0     0 0.0 ";
	nut[51] = " 0 1 0-2 0     -4   0.0     0 0.0 ";
	nut[52] = " 1 0-2 0 0      4   0.0     0 0.0 ";
	nut[53] = " 2 0 0-2 1      4   0.0    -2 0.0 ";
	nut[54] = " 0 1 2-2 1      4   0.0    -2 0.0 ";
	nut[55] = " 1 1 0 0 0     -3   0.0     0 0.0 ";
	nut[56] = " 1-1 0-1 0     -3   0.0     0 0.0 ";
	nut[57] = "-1-1 2 2 2     -3   0.0     1 0.0 ";
	nut[58] = " 0-1 2 2 2     -3   0.0     1 0.0 ";
	nut[59] = " 1-1 2 0 2     -3   0.0     1 0.0 ";
	nut[60] = " 3 0 2 0 2     -3   0.0     1 0.0 ";
	nut[61] = "-2 0 2 0 2     -3   0.0     1 0.0 ";
	nut[62] = " 1 0 2 0 0      3   0.0     0 0.0 ";
	nut[63] = "-1 0 2 4 2     -2   0.0     1 0.0 ";
	nut[64] = " 1 0 0 0 2     -2   0.0     1 0.0 ";
	nut[65] = "-1 0 2-2 1     -2   0.0     1 0.0 ";
	nut[66] = " 0-2 2-2 1     -2   0.0     1 0.0 ";
	nut[67] = "-2 0 0 0 1     -2   0.0     1 0.0 ";
	nut[68] = " 2 0 0 0 1      2   0.0    -1 0.0 ";
	nut[69] = " 3 0 0 0 0      2   0.0     0 0.0 ";
	nut[70] = " 1 1 2 0 2      2   0.0    -1 0.0 ";
	nut[71] = " 0 0 2 1 2      2   0.0    -1 0.0 ";
	nut[72] = " 1 0 0 2 1     -1   0.0     0 0.0 ";
	nut[73] = " 1 0 2 2 1     -1   0.0     1 0.0 ";
	nut[74] = " 1 1 0-2 1     -1   0.0     0 0.0 ";
	nut[75] = " 0 1 0 2 0     -1   0.0     0 0.0 ";
	nut[76] = " 0 1 2-2 0     -1   0.0     0 0.0 ";
	nut[77] = " 0 1-2 2 0     -1   0.0     0 0.0 ";
	nut[78] = " 1 0-2 2 0     -1   0.0     0 0.0 ";
	nut[79] = " 1 0-2-2 0     -1   0.0     0 0.0 ";
	nut[80] = " 1 0 2-2 0     -1   0.0     0 0.0 ";
	nut[81] = " 1 0 0-4 0     -1   0.0     0 0.0 ";
	nut[82] = " 2 0 0-4 0     -1   0.0     0 0.0 ";
	nut[83] = " 0 0 2 4 2     -1   0.0     0 0.0 ";
	nut[84] = " 0 0 2-1 2     -1   0.0     0 0.0 ";
	nut[85] = "-2 0 2 4 2     -1   0.0     1 0.0 ";
	nut[86] = " 2 0 2 2 2     -1   0.0     0 0.0 ";
	nut[87] = " 0-1 2 0 1     -1   0.0     0 0.0 ";
	nut[88] = " 0 0-2 0 1     -1   0.0     0 0.0 ";
	nut[89] = " 0 0 4-2 2      1   0.0     0 0.0 ";
	nut[90] = " 0 1 0 0 2      1   0.0     0 0.0 ";
	nut[91] = " 1 1 2-2 2      1   0.0    -1 0.0 ";
	nut[92] = " 3 0 2-2 2      1   0.0     0 0.0 ";
	nut[93] = "-2 0 2 2 2      1   0.0    -1 0.0 ";
	nut[94] = "-1 0 0 0 2      1   0.0    -1 0.0 ";
	nut[95] = " 0 0-2 2 1      1   0.0     0 0.0 ";
	nut[96] = " 0 1 2 0 1      1   0.0     0 0.0 ";
	nut[97] = "-1 0 4 0 2      1   0.0     0 0.0 ";
	nut[98] = " 2 1 0-2 0      1   0.0     0 0.0 ";
	nut[99] = " 2 0 0 2 0      1   0.0     0 0.0 ";
	nut[100] = " 2 0 2-2 1      1   0.0    -1 0.0 ";
	nut[101] = " 2 0-2 0 1      1   0.0     0 0.0 ";
	nut[102] = " 1-1 0-2 0      1   0.0     0 0.0 ";
	nut[103] = "-1 0 0 1 1      1   0.0     0 0.0 ";
	nut[104] = "-1-1 0 2 1      1   0.0     0 0.0 ";
	nut[105] = " 0 1 0 1 0      1   0.0     0 0.0 ";

	// Reading periodic terms
	let fMm, fM, fF, fD, f_omega, dp = 0, de = 0, x;

	x = 0;
	while (x < 106) {
		fMm = eval(nut[x].substring(0, 2));
		fM = eval(nut[x].substring(2, 4));
		fF = eval(nut[x].substring(4, 6));
		fD = eval(nut[x].substring(6, 8));
		f_omega = eval(nut[x].substring(8, 10));
		dp += (eval(nut[x].substring(10, 17)) + TE * eval(nut[x].substring(17, 23))) * Utils.sind(fD * D + fM * M + fMm * Mm + fF * F + f_omega * omega);
		de += (eval(nut[x].substring(23, 29)) + TE * eval(nut[x].substring(29, 33))) * Utils.cosd(fD * D + fM * M + fMm * Mm + fF * F + f_omega * omega);
		x++;
	}


	// Corrections (Herring, 1987)
	let corr = new Array(4);
	corr[0] = " 0 0 0 0 1-725 417 213 224 ";
	corr[1] = " 0 1 0 0 0 523  61 208 -24 ";
	corr[2] = " 0 0 2-2 2 102-118 -41 -47 ";
	corr[3] = " 0 0 2 0 2 -81   0  32   0 ";

	x = 0;
	while (x < 4) {
		fMm = eval(corr[x].substring(0, 2));
		fM = eval(corr[x].substring(2, 4));
		fF = eval(corr[x].substring(4, 6));
		fD = eval(corr[x].substring(6, 8));
		f_omega = eval(corr[x].substring(8, 10));
		dp += 0.1 * (eval(corr[x].substring(10, 14)) * Utils.sind(fD * D + fM * M + fMm * Mm + fF * F + f_omega * omega) + eval(corr[x].substring(14, 18)) * Utils.cosd(fD * D + fM * M + fMm * Mm + fF * F + f_omega * omega));
		de += 0.1 * (eval(corr[x].substring(18, 22)) * Utils.cosd(fD * D + fM * M + fMm * Mm + fF * F + f_omega * omega) + eval(corr[x].substring(22, 26)) * Utils.sind(fD * D + fM * M + fMm * Mm + fF * F + f_omega * omega));
		x++;
	}


	// calculateNutation in longitude
	deltaPsi = dp / 36000000;

	// calculateNutation in obliquity
	deltaEps = de / 36000000;

	// Mean obliquity of the ecliptic
	eps0 = (84381.448 - 46.815 * TE - 0.00059 * TE2 + 0.001813 * TE3) / 3600;

	// True obliquity of the ecliptic
	eps = eps0 + deltaEps;
}

// aberration
function calculateAberration() {
	kappa = Math.toRadians(20.49552 / 3600);
	pi0 = Math.toRadians(102.93735 + 1.71953 * TE + 0.00046 * TE2);
	e = 0.016708617 - 0.000042037 * TE - 0.0000001236 * TE2;
}

// GHA Aries, GAST, GMST, equation of the equinoxes
function calculateAries() {
	// Mean GHA Aries
	GHAAmean = Utils.norm360Deg(280.46061837 + 360.98564736629 * (JD - 2451545) + 0.000387933 * T2 - T3 / 38710000);

	// GMST
	SidTm = outSideralTime(GHAAmean);

	// True GHA Aries
	GHAAtrue = Utils.norm360Deg(GHAAmean + deltaPsi * Utils.cosd(eps));

	// GAST
	SidTa = outSideralTime(GHAAtrue);

	// Equation of the equinoxes
	EoE = 240 * deltaPsi * Utils.cosd(eps);
	EoEout = Math.round(1000 * EoE) / 1000;
	// EoEout = " " + EoEout + "s";
}

// Calculations for the Sun
function calculateSun() {
	// Mean longitude of the Sun
	let Lsun_mean = Utils.norm360Deg(280.4664567 + 360007.6982779 * Tau + 0.03032028 * Tau2 + Tau3 / 49931 - Tau4 / 15299 - Tau5 / 1988000);

	// Heliocentric longitude of the Earth
	Le = Earth.lEarth(Tau);

	// Geocentric longitude of the Sun
	Lsun_true = Utils.norm360Deg(Le + 180 - 0.000025);

	// Heliocentric latitude of Earth
	Be = Earth.bEarth(Tau);

	// Geocentric latitude of the Sun
	let beta = Utils.norm360Deg(-Be);

	// Corrections
	Lsun_prime = Utils.norm360Deg(Le + 180 - 1.397 * TE - 0.00031 * TE2);

	beta = beta + 0.000011 * (Utils.cosd(Lsun_prime) - Utils.sind(Lsun_prime));

	// Distance Earth-Sun
	Re = Earth.rEarth(Tau);
	dES = 149597870.691 * Re;

	// Apparent longitude of the Sun
	lambdaSun = Utils.norm360Deg(Lsun_true + deltaPsi - 0.005691611 / Re);

	// Right ascension of the Sun, apparent
	RASun = Math.toDegrees(Utils.norm2PiRad(Math.atan2((Utils.sind(lambdaSun) * Utils.cosd(eps) - Utils.tand(beta) * Utils.sind(eps)), Utils.cosd(lambdaSun))));

	// Declination of the Sun, apparent
	DECSun = Math.toDegrees(Math.asin(Utils.sind(beta) * Utils.cosd(eps) + Utils.cosd(beta) * Utils.sind(eps) * Utils.sind(lambdaSun)));

	// GHA of the Sun
	GHASun = Utils.norm360Deg(GHAAtrue - RASun);

	// Semidiameter of the Sun
	SDSun = 959.63 / Re;

	//Horizontal parallax of the Sun
	HPSun = 8.794 / Re;

	// Equation of time
	// EoT = 4*(Lsun_mean-0.0057183-0.0008-RASun+deltaPsi*Utils.cosd(eps));
	EoT = 4 * GHASun + 720 - 1440 * dayFraction;
	if (EoT > 20) {
		EoT -= 1440;
	}
	if (EoT < -20) {
		EoT += 1440;
	}
}

// Calculations for Venus
function calculateVenus() {
	// Heliocentric spherical coordinates
	let L = Venus.lVenus(Tau);
	let B = Venus.bVenus(Tau);
	let R = Venus.rVenus(Tau);

	// Rectangular coordinates
	let x = R * Utils.cosd(B) * Utils.cosd(L) - Re * Utils.cosd(Be) * Utils.cosd(Le);
	let y = R * Utils.cosd(B) * Utils.sind(L) - Re * Utils.cosd(Be) * Utils.sind(Le);
	let z = R * Utils.sind(B) - Re * Utils.sind(Be);

	// Geocentric spherical coordinates
	let lambda = Math.atan2(y, x);
	let beta = Math.atan(z / Math.sqrt(x * x + y * y));

	// Distance from Earth / light time
	let d = Math.sqrt(x * x + y * y + z * z);
	let lt = 0.0057755183 * d;

	// Time correction
	let Tau_corr = (JDE - lt - 2451545) / 365250;

	// Coordinates corrected for light time
	L = Venus.lVenus(Tau_corr);
	B = Venus.bVenus(Tau_corr);
	R = Venus.rVenus(Tau_corr);
	x = R * Utils.cosd(B) * Utils.cosd(L) - Re * Utils.cosd(Be) * Utils.cosd(Le);
	y = R * Utils.cosd(B) * Utils.sind(L) - Re * Utils.cosd(Be) * Utils.sind(Le);
	z = R * Utils.sind(B) - Re * Utils.sind(Be);

	lambda = Math.atan2(y, x);
	beta = Math.atan(z / Math.sqrt(x * x + y * y));

	// aberration
	let dlambda = (e * kappa * Math.cos(pi0 - lambda) - kappa * Math.cos(Math.toRadians(Lsun_true) - lambda)) / Math.cos(beta);
	let dbeta = -kappa * Math.sin(beta) * (Math.sin(Math.toRadians(Lsun_true) - lambda) - e * Math.sin(pi0 - lambda));

	lambda += dlambda;
	beta += dbeta;

	// FK5
	let lambda_prime = lambda - Math.toRadians(1.397) * TE - Math.toRadians(0.00031) * TE2;

	dlambda = Math.toRadians(-0.09033) / 3600 + Math.toRadians(0.03916) / 3600 * (Math.cos(lambda_prime) + Math.sin(lambda_prime)) * Math.tan(beta);
	dbeta = Math.toRadians(0.03916) / 3600 * (Math.cos(lambda_prime) - Math.sin(lambda_prime));

	lambda += dlambda;
	beta += dbeta;

	// calculateNutation in longitude
	lambda += Math.toRadians(deltaPsi);

	// Right ascension, apparent
	RAVenus = Math.toDegrees(Utils.norm2PiRad(Math.atan2((Math.sin(lambda) * Utils.cosd(eps) - Math.tan(beta) * Utils.sind(eps)), Math.cos(lambda))));

	// Declination of Venus, apparent
	DECVenus = Math.toDegrees(Math.asin(Math.sin(beta) * Utils.cosd(eps) + Math.cos(beta) * Utils.sind(eps) * Math.sin(lambda)));

	// GHA of Venus
	GHAVenus = Utils.norm360Deg(GHAAtrue - RAVenus);

	// Semi-diameter of Venus (including cloud layer)
	SDVenus = 8.41 / d;

	// Horizontal parallax of Venus
	HPVenus = 8.794 / d;

	// Illumination of the planet's disk
	let k = 100 * (1 + ((R - Re * Utils.cosd(B) * Utils.cosd(L - Le)) / d)) / 2;
	illumVenus = Math.round(10 * k) / 10;
}

// Calculations for Mars
function calculateMars() {
	// Heliocentric coordinates
	let L = Mars.lMars(Tau);
	let B = Mars.bMars(Tau);
	let R = Mars.rMars(Tau);

	// Rectangular coordinates
	let x = R * Utils.cosd(B) * Utils.cosd(L) - Re * Utils.cosd(Be) * Utils.cosd(Le);
	let y = R * Utils.cosd(B) * Utils.sind(L) - Re * Utils.cosd(Be) * Utils.sind(Le);
	let z = R * Utils.sind(B) - Re * Utils.sind(Be);

	// Geocentric coordinates
	let lambda = Math.atan2(y, x);
	let beta = Math.atan(z / Math.sqrt(x * x + y * y));

	// Distance from earth / light time
	let d = Math.sqrt(x * x + y * y + z * z);
	let lt = 0.0057755183 * d;

	// Time correction
	let Tau_corr = (JDE - lt - 2451545) / 365250;

	// Coordinates corrected for light time
	L = Mars.lMars(Tau_corr);
	B = Mars.bMars(Tau_corr);
	R = Mars.rMars(Tau_corr);
	x = R * Utils.cosd(B) * Utils.cosd(L) - Re * Utils.cosd(Be) * Utils.cosd(Le);
	y = R * Utils.cosd(B) * Utils.sind(L) - Re * Utils.cosd(Be) * Utils.sind(Le);
	z = R * Utils.sind(B) - Re * Utils.sind(Be);

	lambda = Math.atan2(y, x);
	beta = Math.atan(z / Math.sqrt(x * x + y * y));

	// aberration
	let dlambda = (e * kappa * Math.cos(pi0 - lambda) - kappa * Math.cos(Math.toRadians(Lsun_true) - lambda)) / Math.cos(beta);
	let dbeta = -kappa * Math.sin(beta) * (Math.sin(Math.toRadians(Lsun_true) - lambda) - e * Math.sin(pi0 - lambda));

	lambda += dlambda;
	beta += dbeta;

	// FK5
	let lambda_prime = lambda - Math.toRadians(1.397) * TE -  Math.toRadians(0.00031) * TE2;

	dlambda =  Math.toRadians(-0.09033) / 3600 +  Math.toRadians(0.03916) / 3600 * (Math.cos(lambda_prime) + Math.sin(lambda_prime)) * Math.tan(beta);
	dbeta =  Math.toRadians(0.03916) / 3600 * (Math.cos(lambda_prime) - Math.sin(lambda_prime));

	lambda += dlambda;
	beta += dbeta;

	// calculateNutation in longitude
	lambda +=  Math.toRadians(deltaPsi);

	// Right ascension, apparent
	RAMars = Math.toDegrees(Utils.norm2PiRad(Math.atan2((Math.sin(lambda) * Utils.cosd(eps) - Math.tan(beta) * Utils.sind(eps)), Math.cos(lambda))));

	// Declination of Mars, apparent
	DECMars = Math.toDegrees(Math.asin(Math.sin(beta) * Utils.cosd(eps) + Math.cos(beta) * Utils.sind(eps) * Math.sin(lambda)));

//GHA of Mars
	GHAMars = Utils.norm360Deg(GHAAtrue - RAMars);

	// Semi-diameter of Mars
	SDMars = 4.68 / d;

	// Horizontal parallax of Mars
	HPMars = 8.794 / d;

	// Illumination of the planet's disk
	let k = 100 * (1 + ((R - Re * Utils.cosd(B) * Utils.cosd(L - Le)) / d)) / 2;
	illumMars = Math.round(10 * k) / 10;
}

// Calculations for Jupiter
function calculateJupiter() {
	// Heliocentric coordinates
	let L = Jupiter.lJupiter(Tau);
	let B = Jupiter.bJupiter(Tau);
	let R = Jupiter.rJupiter(Tau);

	// Rectangular coordinates
	let x = R * Utils.cosd(B) * Utils.cosd(L) - Re * Utils.cosd(Be) * Utils.cosd(Le);
	let y = R * Utils.cosd(B) * Utils.sind(L) - Re * Utils.cosd(Be) * Utils.sind(Le);
	let z = R * Utils.sind(B) - Re * Utils.sind(Be);

	// Geocentric coordinates
	let lambda = Math.atan2(y, x);
	let beta = Math.atan(z / Math.sqrt(x * x + y * y));

	// Distance from earth / light time
	let d = Math.sqrt(x * x + y * y + z * z);
	let lt = 0.0057755183 * d;

	// Time correction
	let Tau_corr = (JDE - lt - 2451545) / 365250;

	// Coordinates corrected for light time
	L = Jupiter.lJupiter(Tau_corr);
	B = Jupiter.bJupiter(Tau_corr);
	R = Jupiter.rJupiter(Tau_corr);
	x = R * Utils.cosd(B) * Utils.cosd(L) - Re * Utils.cosd(Be) * Utils.cosd(Le);
	y = R * Utils.cosd(B) * Utils.sind(L) - Re * Utils.cosd(Be) * Utils.sind(Le);
	z = R * Utils.sind(B) - Re * Utils.sind(Be);

	lambda = Math.atan2(y, x);
	beta = Math.atan(z / Math.sqrt(x * x + y * y));

	// aberration
	let dlambda = (e * kappa * Math.cos(pi0 - lambda) - kappa * Math.cos( Math.toRadians(Lsun_true) - lambda)) / Math.cos(beta);
	let dbeta = -kappa * Math.sin(beta) * (Math.sin( Math.toRadians(Lsun_true) - lambda) - e * Math.sin(pi0 - lambda));

	lambda += dlambda;
	beta += dbeta;

	// FK5
	let lambda_prime = lambda -  Math.toRadians(1.397) * TE -  Math.toRadians(0.00031) * TE2;

	dlambda =  Math.toRadians(-0.09033) / 3600 +  Math.toRadians(0.03916) / 3600 * (Math.cos(lambda_prime) + Math.sin(lambda_prime)) * Math.tan(beta);
	dbeta =  Math.toRadians(0.03916) / 3600 * (Math.cos(lambda_prime) - Math.sin(lambda_prime));

	lambda += dlambda;
	beta += dbeta;

	// calculateNutation in longitude
	lambda +=  Math.toRadians(deltaPsi);

	// Right ascension, apparent
	RAJupiter = Math.toDegrees(Utils.norm2PiRad(Math.atan2((Math.sin(lambda) * Utils.cosd(eps) - Math.tan(beta) * Utils.sind(eps)), Math.cos(lambda))));

	// Declination of Jupiter, apparent
	DECJupiter = Math.toDegrees(Math.asin(Math.sin(beta) * Utils.cosd(eps) + Math.cos(beta) * Utils.sind(eps) * Math.sin(lambda)));

	// GHA of Jupiter
	GHAJupiter = Utils.norm360Deg(GHAAtrue - RAJupiter);

	// Semi-diameter of Jupiter (equatorial)
	SDJupiter = 98.44 / d;

	// Horizontal parallax of Jupiter
	HPJupiter = 8.794 / d;

	// Illumination of the planet's disk
	let k = 100 * (1 + ((R - Re * Utils.cosd(B) * Utils.cosd(L - Le)) / d)) / 2;
	illumJupiter = Math.round(10 * k) / 10;
}

// Calculations for Saturn
function calculateSaturn() {
	// Heliocentric coordinates
	let L = Saturn.lSaturn(Tau);
	let B = Saturn.bSaturn(Tau);
	let R = Saturn.rSaturn(Tau);

	// Rectangular coordinates
	let x = R * Utils.cosd(B) * Utils.cosd(L) - Re * Utils.cosd(Be) * Utils.cosd(Le);
	let y = R * Utils.cosd(B) * Utils.sind(L) - Re * Utils.cosd(Be) * Utils.sind(Le);
	let z = R * Utils.sind(B) - Re * Utils.sind(Be);

	// Geocentric coordinates
	let lambda = Math.atan2(y, x);
	let beta = Math.atan(z / Math.sqrt(x * x + y * y));

	// Distance from earth / light time
	let d = Math.sqrt(x * x + y * y + z * z);
	let lt = 0.0057755183 * d;

	// Time correction
	let Tau_corr = (JDE - lt - 2451545) / 365250;

	// Coordinates corrected for light time
	L = Saturn.lSaturn(Tau_corr);
	B = Saturn.bSaturn(Tau_corr);
	R = Saturn.rSaturn(Tau_corr);
	x = R * Utils.cosd(B) * Utils.cosd(L) - Re * Utils.cosd(Be) * Utils.cosd(Le);
	y = R * Utils.cosd(B) * Utils.sind(L) - Re * Utils.cosd(Be) * Utils.sind(Le);
	z = R * Utils.sind(B) - Re * Utils.sind(Be);

	lambda = Math.atan2(y, x);
	beta = Math.atan(z / Math.sqrt(x * x + y * y));

	// aberration
	let dlambda = (e * kappa * Math.cos(pi0 - lambda) - kappa * Math.cos( Math.toRadians(Lsun_true) - lambda)) / Math.cos(beta);
	let dbeta = -kappa * Math.sin(beta) * (Math.sin( Math.toRadians(Lsun_true) - lambda) - e * Math.sin(pi0 - lambda));

	lambda += dlambda;
	beta += dbeta;

	// FK5
	let lambda_prime = lambda -  Math.toRadians(1.397) * TE -  Math.toRadians(0.00031) * TE2;
	dlambda =  Math.toRadians(-0.09033) / 3600 +  Math.toRadians(0.03916) / 3600 * (Math.cos(lambda_prime) + Math.sin(lambda_prime)) * Math.tan(beta);
	dbeta =  Math.toRadians(0.03916) / 3600 * (Math.cos(lambda_prime) - Math.sin(lambda_prime));

	lambda += dlambda;
	beta += dbeta;

	// calculateNutation in longitude
	lambda +=  Math.toRadians(deltaPsi);

	// Right ascension, apparent
	RASaturn = Math.toDegrees(Utils.norm2PiRad(Math.atan2((Math.sin(lambda) * Utils.cosd(eps) - Math.tan(beta) * Utils.sind(eps)), Math.cos(lambda))));

	// Declination of Saturn, apparent
	DECSaturn = Math.toDegrees(Math.asin(Math.sin(beta) * Utils.cosd(eps) + Math.cos(beta) * Utils.sind(eps) * Math.sin(lambda)));

	// GHA of Saturn
	GHASaturn = Utils.norm360Deg(GHAAtrue - RASaturn);

	// Semi-diameter of Saturn (equatorial)
	SDSaturn = 82.73 / d;

	// Horizontal parallax of Saturn
	HPSaturn = 8.794 / d;

	// Illumination of the planet's disk
	let k = 100 * (1 + ((R - Re * Utils.cosd(B) * Utils.cosd(L - Le)) / d)) / 2;
	illumSaturn = Math.round(10 * k) / 10;
}

// Calculations for the moon
function calculateMoon() {
	// Mean longitude of the moon
	let Lmm = Utils.norm360Deg(218.3164591 + 481267.88134236 * TE - 0.0013268 * TE2 + TE3 / 538841 - TE4 / 65194000);

	// Mean elongation of the moon
	let D = Utils.norm360Deg(297.8502042 + 445267.1115168 * TE - 0.00163 * TE2 + TE3 / 545868 - TE4 / 113065000);

	// Mean anomaly of the sun
	let Msm = Utils.norm360Deg(357.5291092 + 35999.0502909 * TE - 0.0001536 * TE2 + TE3 / 24490000);

	// Mean anomaly of the moon
	let Mmm = Utils.norm360Deg(134.9634114 + 477198.8676313 * TE + 0.008997 * TE2 + TE3 / 69699 - TE4 / 14712000);

	// Mean distance of the moon from ascending node
	let F = Utils.norm360Deg(93.2720993 + 483202.0175273 * TE - 0.0034029 * TE2 - TE3 / 3526000 + TE4 / 863310000);

	// Corrections
	let A1 = Utils.norm360Deg(119.75 + 131.849 * TE);
	let A2 = Utils.norm360Deg(53.09 + 479264.29 * TE);
	let A3 = Utils.norm360Deg(313.45 + 481266.484 * TE);
	let fE = 1 - 0.002516 * TE - 0.0000074 * TE2;
	let fE2 = fE * fE;

// Periodic terms for the moon:

	//Longitude and distance
	let ld = new Array(60);
	ld[0] = "0 0 1 0 6288774 -20905355 ";
	ld[1] = "2 0-1 0 1274027  -3699111 ";
	ld[2] = "2 0 0 0  658314  -2955968 ";
	ld[3] = "0 0 2 0  213618   -569925 ";
	ld[4] = "0 1 0 0 -185116     48888 ";
	ld[5] = "0 0 0 2 -114332     -3149 ";
	ld[6] = "2 0-2 0   58793    246158 ";
	ld[7] = "2-1-1 0   57066   -152138 ";
	ld[8] = "2 0 1 0   53322   -170733 ";
	ld[9] = "2-1 0 0   45758   -204586 ";
	ld[10] = "0 1-1 0  -40923   -129620 ";
	ld[11] = "1 0 0 0  -34720    108743 ";
	ld[12] = "0 1 1 0  -30383    104755 ";
	ld[13] = "2 0 0-2   15327     10321 ";
	ld[14] = "0 0 1 2  -12528         0 ";
	ld[15] = "0 0 1-2   10980     79661 ";
	ld[16] = "4 0-1 0   10675    -34782 ";
	ld[17] = "0 0 3 0   10034    -23210 ";
	ld[18] = "4 0-2 0    8548    -21636 ";
	ld[19] = "2 1-1 0   -7888     24208 ";
	ld[20] = "2 1 0 0   -6766     30824 ";
	ld[21] = "1 0-1 0   -5163     -8379 ";
	ld[22] = "1 1 0 0    4987    -16675 ";
	ld[23] = "2-1 1 0    4036    -12831 ";
	ld[24] = "2 0 2 0    3994    -10445 ";
	ld[25] = "4 0 0 0    3861    -11650 ";
	ld[26] = "2 0-3 0    3665     14403 ";
	ld[27] = "0 1-2 0   -2689     -7003 ";
	ld[28] = "2 0-1 2   -2602         0 ";
	ld[29] = "2-1-2 0    2390     10056 ";
	ld[30] = "1 0 1 0   -2348      6322 ";
	ld[31] = "2-2 0 0    2236     -9884 ";
	ld[32] = "0 1 2 0   -2120      5751 ";
	ld[33] = "0 2 0 0   -2069         0 ";
	ld[34] = "2-2-1 0    2048     -4950 ";
	ld[35] = "2 0 1-2   -1773      4130 ";
	ld[36] = "2 0 0 2   -1595         0 ";
	ld[37] = "4-1-1 0    1215     -3958 ";
	ld[38] = "0 0 2 2   -1110         0 ";
	ld[39] = "3 0-1 0    -892      3258 ";
	ld[40] = "2 1 1 0    -810      2616 ";
	ld[41] = "4-1-2 0     759     -1897 ";
	ld[42] = "0 2-1 0    -713     -2117 ";
	ld[43] = "2 2-1 0    -700      2354 ";
	ld[44] = "2 1-2 0     691         0 ";
	ld[45] = "2-1 0-2     596         0 ";
	ld[46] = "4 0 1 0     549     -1423 ";
	ld[47] = "0 0 4 0     537     -1117 ";
	ld[48] = "4-1 0 0     520     -1571 ";
	ld[49] = "1 0-2 0    -487     -1739 ";
	ld[50] = "2 1 0-2    -399         0 ";
	ld[51] = "0 0 2-2    -381     -4421 ";
	ld[52] = "1 1 1 0     351         0 ";
	ld[53] = "3 0-2 0    -340         0 ";
	ld[54] = "4 0-3 0     330         0 ";
	ld[55] = "2-1 2 0     327         0 ";
	ld[56] = "0 2 1 0    -323      1165 ";
	ld[57] = "1 1-1 0     299         0 ";
	ld[58] = "2 0 3 0     294         0 ";
	ld[59] = "2 0-1-2       0      8752 ";

	let lat = new Array(60);
	lat[0] = "0 0 0 1 5128122 ";
	lat[1] = "0 0 1 1  280602 ";
	lat[2] = "0 0 1-1  277693 ";
	lat[3] = "2 0 0-1  173237 ";
	lat[4] = "2 0-1 1   55413 ";
	lat[5] = "2 0-1-1   46271 ";
	lat[6] = "2 0 0 1   32573 ";
	lat[7] = "0 0 2 1   17198 ";
	lat[8] = "2 0 1-1    9266 ";
	lat[9] = "0 0 2-1    8822 ";
	lat[10] = "2-1 0-1    8216 ";
	lat[11] = "2 0-2-1    4324 ";
	lat[12] = "2 0 1 1    4200 ";
	lat[13] = "2 1 0-1   -3359 ";
	lat[14] = "2-1-1 1    2463 ";
	lat[15] = "2-1 0 1    2211 ";
	lat[16] = "2-1-1-1    2065 ";
	lat[17] = "0 1-1-1   -1870 ";
	lat[18] = "4 0-1-1    1828 ";
	lat[19] = "0 1 0 1   -1794 ";
	lat[20] = "0 0 0 3   -1749 ";
	lat[21] = "0 1-1 1   -1565 ";
	lat[22] = "1 0 0 1   -1491 ";
	lat[23] = "0 1 1 1   -1475 ";
	lat[24] = "0 1 1-1   -1410 ";
	lat[25] = "0 1 0-1   -1344 ";
	lat[26] = "1 0 0-1   -1335 ";
	lat[27] = "0 0 3 1    1107 ";
	lat[28] = "4 0 0-1    1021 ";
	lat[29] = "4 0-1 1     833 ";
	lat[30] = "0 0 1-3     777 ";
	lat[31] = "4 0-2 1     671 ";
	lat[32] = "2 0 0-3     607 ";
	lat[33] = "2 0 2-1     596 ";
	lat[34] = "2-1 1-1     491 ";
	lat[35] = "2 0-2 1    -451 ";
	lat[36] = "0 0 3-1     439 ";
	lat[37] = "2 0 2 1     422 ";
	lat[38] = "2 0-3-1     421 ";
	lat[39] = "2 1-1 1    -366 ";
	lat[40] = "2 1 0 1    -351 ";
	lat[41] = "4 0 0 1     331 ";
	lat[42] = "2-1 1 1     315 ";
	lat[43] = "2-2 0-1     302 ";
	lat[44] = "0 0 1 3    -283 ";
	lat[45] = "2 1 1-1    -229 ";
	lat[46] = "1 1 0-1     223 ";
	lat[47] = "1 1 0 1     223 ";
	lat[48] = "0 1-2-1    -220 ";
	lat[49] = "2 1-1-1    -220 ";
	lat[50] = "1 0 1 1    -185 ";
	lat[51] = "2-1-2-1     181 ";
	lat[52] = "0 1 2 1    -177 ";
	lat[53] = "4 0-2-1     176 ";
	lat[54] = "4-1-1-1     166 ";
	lat[55] = "1 0 1-1    -164 ";
	lat[56] = "4 0 1-1     132 ";
	lat[57] = "1 0-1-1    -119 ";
	lat[58] = "4-1 0-1     115 ";
	lat[59] = "2-2 0 1     107 ";

	//Reading periodic terms
	let fD, fD2, fM, fM2, fMm, fMm2, fF, fF2, coeffs, coeffs2, coeffc, f, f2, sumL = 0, sumR = 0, sumB = 0, x = 0;

	while (x < lat.length) {
		fD = eval(ld[x].substring(0, 1));
		fM = eval(ld[x].substring(1, 3));
		fMm = eval(ld[x].substring(3, 5));
		fF = eval(ld[x].substring(5, 7));
		coeffs = eval(ld[x].substring(8, 15));
		coeffc = eval(ld[x].substring(16, 25));
		if (fM === 1 || fM === -1) {
			f = fE;
		} else if (fM === 2 || fM === -2) {
			f = fE2;
		} else {
			f = 1;
		}
		sumL += f * coeffs * Utils.sind(fD * D + fM * Msm + fMm * Mmm + fF * F);
		sumR += f * coeffc * Utils.cosd(fD * D + fM * Msm + fMm * Mmm + fF * F);
		fD2 = eval(lat[x].substring(0, 1));
		fM2 = eval(lat[x].substring(1, 3));
		fMm2 = eval(lat[x].substring(3, 5));
		fF2 = eval(lat[x].substring(5, 7));
		coeffs2 = eval(lat[x].substring(8, 15));
		if (fM2 === 1 || fM2 === -1) {
			f2 = fE;
		} else if (fM2 === 2 || fM2 === -2) {
			f2 = fE2;
		} else {
			f2 = 1;
		}
		sumB += f2 * coeffs2 * Utils.sind(fD2 * D + fM2 * Msm + fMm2 * Mmm + fF2 * F);
		x++;
	}

	// Corrections
	sumL = sumL + 3958 * Utils.sind(A1) + 1962 * Utils.sind(Lmm - F) + 318 * Utils.sind(A2);
	sumB = sumB - 2235 * Utils.sind(Lmm) + 382 * Utils.sind(A3) + 175 * Utils.sind(A1 - F) + 175 * Utils.sind(A1 + F) + 127 * Utils.sind(Lmm - Mmm) - 115 * Utils.sind(Lmm + Mmm);

	// Longitude of the moon
	let lambdaMm = Utils.norm360Deg(Lmm + sumL / 1000000);

	// Latitude of the moon
	let betaM = sumB / 1000000;

	// Distance earth-moon
	let dEM = 385000.56 + sumR / 1000;

	// Apparent longitude of the moon
	lambdaMapp = lambdaMm + deltaPsi;

	// Right ascension of the moon, apparent
	RAMoon = Math.toDegrees(Utils.norm2PiRad(Math.atan2((Utils.sind(lambdaMapp) * Utils.cosd(eps) - Utils.tand(betaM) * Utils.sind(eps)), Utils.cosd(lambdaMapp))));

	// Declination of the moon
	DECMoon = Math.toDegrees(Math.asin(Utils.sind(betaM) * Utils.cosd(eps) + Utils.cosd(betaM) * Utils.sind(eps) * Utils.sind(lambdaMapp)));

	// GHA of the moon
	GHAMoon = Utils.norm360Deg(GHAAtrue - RAMoon);

	// Horizontal parallax of the moon
	HPMoon = Math.toDegrees(3600 * Math.asin(6378.14 / dEM));

	// Semi-diameter of the moon
	SDMoon = Math.toDegrees(3600 * Math.asin(1738 / dEM));

	// Geocentric angular distance between moon and sun
	LDist = Math.toDegrees(Math.acos(Utils.sind(DECMoon) * Utils.sind(DECSun) + Utils.cosd(DECMoon) * Utils.cosd(DECSun) * Utils.cosd(RAMoon - RASun)));

	//Phase angle
	let i = Math.atan2(dES * Utils.sind(LDist), (dEM - dES * Utils.cosd(LDist)));

	//Illumination of the moon's disk
	let k = 100 * (1 + Math.cos(i)) / 2;
	illumMoon = Math.round(10 * k) / 10;
}

// Ephemerides of Polaris
function calculatePolaris() {
	// Equatorial coordinates of Polaris at 2000.0 (mean equinox and equator 2000.0)
	let RApol0 = 37.95293333;
	let DECpol0 = 89.26408889;

	// Proper motion per year
	let dRApol = 2.98155 / 3600;
	let dDECpol = -0.0152 / 3600;

	// Equatorial coordinates at Julian Date T (mean equinox and equator 2000.0)
	let RApol1 = RApol0 + 100 * TE * dRApol;
	let DECpol1 = DECpol0 + 100 * TE * dDECpol;

	// Mean obliquity of ecliptic at 2000.0 in degrees
	let eps0_2000 = 23.439291111;

	// Transformation to ecliptic coordinates in radians (mean equinox and equator 2000.0)
	let lambdapol1 = Math.atan2((Utils.sind(RApol1) * Utils.cosd(eps0_2000) + Utils.tand(DECpol1) * Utils.sind(eps0_2000)), Utils.cosd(RApol1));
	let betapol1 = Math.asin(Utils.sind(DECpol1) * Utils.cosd(eps0_2000) - Utils.cosd(DECpol1) * Utils.sind(eps0_2000) * Utils.sind(RApol1));

	// Precession
	let eta =  Math.toRadians(47.0029 * TE - 0.03302 * TE2 + 0.00006 * TE3) / 3600;
	let PI0 =  Math.toRadians(174.876384 - (869.8089 * TE + 0.03536 * TE2) / 3600);
	let p0 =  Math.toRadians(5029.0966 * TE + 1.11113 * TE2 - 0.0000006 * TE3) / 3600;

	let A1 = Math.cos(eta) * Math.cos(betapol1) * Math.sin(PI0 - lambdapol1) - Math.sin(eta) * Math.sin(betapol1);
	let B1 = Math.cos(betapol1) * Math.cos(PI0 - lambdapol1);
	let C1 = Math.cos(eta) * Math.sin(betapol1) + Math.sin(eta) * Math.cos(betapol1) * Math.sin(PI0 - lambdapol1);
	let lambdapol2 = p0 + PI0 - Math.atan2(A1, B1);
	let betapol2 = Math.asin(C1);

	// calculateNutation in longitude
	lambdapol2 +=  Math.toRadians(deltaPsi);

	// aberration
	let dlambdapol = (e * kappa * Math.cos(pi0 - lambdapol2) - kappa * Math.cos( Math.toRadians(Lsun_true) - lambdapol2)) / Math.cos(betapol2);
	let dbetapol = -kappa * Math.sin(betapol2) * (Math.sin( Math.toRadians(Lsun_true) - lambdapol2) - e * Math.sin(pi0 - lambdapol2));

	lambdapol2 += dlambdapol;
	betapol2 += dbetapol;

	// Transformation back to equatorial coordinates in radians
	let RApol2 = Math.atan2((Math.sin(lambdapol2) * Utils.cosd(eps) - Math.tan(betapol2) * Utils.sind(eps)), Math.cos(lambdapol2));
	let DECpol2 = Math.asin(Math.sin(betapol2) * Utils.cosd(eps) + Math.cos(betapol2) * Utils.sind(eps) * Math.sin(lambdapol2));

	// Finals
	GHAPol = GHAAtrue - Math.toDegrees(RApol2);
	GHAPol = Utils.norm360Deg(GHAPol);
	RAPol = Math.toDegrees(RApol2);
	DECPol = Math.toDegrees(DECpol2);
}

// Calculation of the phase of the Moon
function calculateMoonPhase() {
	let x = lambdaMapp - lambdaSun;
	x = Utils.norm360Deg(x);
	x = Math.round(10 * x) / 10;
	moonPhaseAngle = x;
	if (x === 0) {
		moonPhase = " New";
	}
	if (x > 0 && x < 90) {
		moonPhase = " +cre";
	}
	if (x === 90) {
		moonPhase = " FQ";
	}
	if (x > 90 && x < 180) {
		moonPhase = " +gib";
	}
	if (x === 180) {
		moonPhase = " Full";
	}
	if (x > 180 && x < 270) {
		moonPhase = " -gib";
	}
	if (x === 270) {
		moonPhase = " LQ";
	}
	if (x > 270 && x < 360) {
		moonPhase = " -cre";
	}
}

// Day of the week
function calculateWeekDay() {
	JD0h += 1.5;
	let res = JD0h - 7 * Math.floor(JD0h / 7);
	if (res === 0) {
		DoW = "SUN";
	}
	if (res === 1) {
		DoW = "MON";
	}
	if (res === 2) {
		DoW = "TUE";
	}
	if (res === 3) {
		DoW = "WED";
	}
	if (res === 4) {
		DoW = "THU";
	}
	if (res === 5) {
		DoW = "FRI";
	}
	if (res === 6) {
		DoW = "SAT";
	}
}

// Data output
function gatherOutput() {
	// Sun
	let fmtGHASun = outHA(GHASun);
	let fmtRASun = outRA(RASun);
	let fmtDECSun = outDec(DECSun);
	let fmtSDSun = outSdHp(SDSun);
	let fmtHPSun = outSdHp(HPSun);

	// Venus
	let fmtGHAVenus = outHA(GHAVenus);
	let fmtRAVenus = outRA(RAVenus);
	let fmtDECVenus = outDec(DECVenus);
	let fmtSDVenus = outSdHp(SDVenus);
	let fmtHPVenus = outSdHp(HPVenus);
	let fmt_illum_venus = " " + illumVenus + "%";

	// Mars
	let fmtGHAMars = outHA(GHAMars);
	let fmtRAMars = outRA(RAMars);
	let fmtDECMars = outDec(DECMars);
	let fmtSDMars = outSdHp(SDMars);
	let fmtHPMars = outSdHp(HPMars);
	let fmt_illum_mars = " " + illumMars + "%";

	// Jupiter
	let fmtGHAJupiter = outHA(GHAJupiter);
	let fmtRAJupiter = outRA(RAJupiter);
	let fmtDECJupiter = outDec(DECJupiter);
	let fmtSDJupiter = outSdHp(SDJupiter);
	let fmtHPJupiter = outSdHp(HPJupiter);
	let fmt_illum_jupiter = " " + illumJupiter + "%";

	// Saturn
	let fmtGHASaturn = outHA(GHASaturn);
	let fmtRASaturn = outRA(RASaturn);
	let fmtDECSaturn = outDec(DECSaturn);
	let fmtSDSaturn = outSdHp(SDSaturn);
	let fmtHPSaturn = outSdHp(HPSaturn);
	let fmt_illum_saturn = " " + illumSaturn + "%";

	// Moon
	let fmtGHAMoon = outHA(GHAMoon);
	let fmtRAMoon = outRA(RAMoon);
	let fmtDECMoon = outDec(DECMoon);
	let fmtSDMoon = outSdHp(SDMoon);
	let fmtHPMoon = outSdHp(HPMoon);
	let fmt_illum_moon = " " + illumMoon + "%" + moonPhase;

	// Polaris
	let fmtGHAPolaris = outHA(GHAPol);
	let fmtRAPolaris = outRA(RAPol);
	let fmtDECPolaris = outDec(DECPol);

	// Obliquity of Ecliptic
	OoE = outECL(eps0);
	tOoE = outECL(eps);

	// Equation of time
	let sign = "";
	if (EoT < 0) {
		sign = "-";
	} else {
		sign = "+";
	}
	EoT = Math.abs(EoT);
	let EOTmin = Math.floor(EoT);
	let EOTsec = Math.round(600 * (EoT - EOTmin)) / 10;
	if (EOTsec - Math.floor(EOTsec) === 0) {
		EOTsec += ".0";
	}
	if (EOTmin === 0) {
		EoT = " " + sign + " " + EOTsec + "s";
	} else {
		EoT = " " + sign + " " + EOTmin + "m " + EOTsec + "s";
	}

	// Lunar Distance of Sun
	let fmtLDist = outHA(LDist);

	let outForm = {};

	let sun = {};
	sun.GHA = {
		raw: GHASun,
		fmt: fmtGHASun
 	};
	sun.RA = {
		raw: RASun,
		fmt: fmtRASun
	};
	sun.DEC = {
		raw: DECSun,
		fmt: fmtDECSun
	};
	sun.SD = {
		raw: SDSun,
		fmt: fmtSDSun
	};
	sun.HP = {
		raw: HPSun,
		fmt: fmtHPSun
	};
	outForm.sun = sun;

	outForm.EOT = EoT;

	let moon = {};
	moon.GHA = GHAMoon;
	moon.RA = RAMoon;
	moon.DEC = DECMoon;
	moon.SD = SDMoon;
	moon.HP = HPMoon;
	moon.illum = illumMoon;
	moon.phase = {
		phase: moonPhase,
		phaseAngle: moonPhaseAngle
	};
	outForm.moon = moon;

	let venus = {};
	venus.GHA = GHAVenus;
	venus.RA = RAVenus;
	venus.DEC = DECVenus;
	venus.SD = SDVenus;
	venus.HP = HPVenus;
	venus.illum = illumVenus;
	outForm.venus = venus;

	let mars = {};
	mars.GHA = GHAMars;
	mars.RA = RAMars;
	mars.DEC = DECMars;
	mars.SD = SDMars;
	mars.MarsHP = HPMars;
	mars.HP = illumMars;
	outForm.mars = mars;

	let jupiter = {};
	jupiter.GHA = GHAJupiter;
	jupiter.RA = RAJupiter;
	jupiter.DEC = DECJupiter;
	jupiter.SD = SDJupiter;
	jupiter.HP = HPJupiter;
	jupiter.illum = illumJupiter;
	outForm.jupiter = jupiter;

	let saturn = {};
	saturn.GHA = GHASaturn;
	saturn.RA = RASaturn;
	saturn.DEC = DECSaturn;
	saturn.SD = SDSaturn;
	saturn.HP = HPSaturn;
	saturn.illum = illumSaturn;
	outForm.saturn = saturn;

	let polaris = {};
	polaris.GHA = GHAPol;
	polaris.RA = RAPol;
	polaris.DEC = DECPol;
	outForm.polaris = polaris;

	outForm.sidTmean = {
		raw: GHAAmean,
		fmt: SidTm
	};
	outForm.sidTapp = {
		raw: GHAAtrue,
		fmt: SidTa
	};
	outForm.EoEquin = EoEout;
	outForm.dPsi =  Math.round(3600000 * deltaPsi) / 1000; // + "''";
	outForm.dEps = Math.round(3600000 * deltaEps) / 1000;  // + "''";
	outForm.obliq = {
		raw: eps0,
		fmt: OoE
	};
	outForm.trueObliq = {
		raw: eps,
		fmt: tOoE
	};
	outForm.julianDay = Math.round(1000000 * JD) / 1000000;
	outForm.julianEphemDay = Math.round(1000000 * JDE) / 1000000;
	outForm.lunarDist = {
		raw: LDist,
		fmt: fmtLDist
	};
	outForm.dayOfWeek = DoW;

	return outForm;
}

function sampleMain(userDataObject) {
	let year = userDataObject.utcyear;
	let	month = userDataObject.utcmonth;
	if (month < 1 || month > 12) {
		throw new Error("Month out of range! Restart calculation.");
	}
	let day = userDataObject.utcday;
	if (day < 1 || day > 31) {
		alert("Day out of range! Restart calculation.");
	}
	let leap = isLeapYear(year);
	if (month === 2 && day > 28 && !leap) {
		alert("February has only 28 days! Restart calculation.");
	}
	if (month === 2 && day > 29 && leap) {
		alert("February has only 29 days in a leap year! Restart calculation.");
	}
	if (month === 4 && day > 30) {
		alert("April has only 30 days! Restart calculation.");
	}
	if (month === 6 && day > 30) {
		alert("June has only 30 days! Restart calculation.");
	}
	if (month === 9 && day > 30) {
		alert("September has only 30 days! Restart calculation.");
	}
	if (month === 11 && day > 30) {
		alert("November has only 30 days! Restart calculation.");
	}
	let hour = userDataObject.utchour;
	let minute = userDataObject.utcminute;
	let second = userDataObject.utcsecond;

	let delta_t = userDataObject.deltaT;

	return calculate(year, month, day, hour, minute, second, delta_t);
}

let sampleData = {
	utcyear: 2020,
	utcmonth: 2,
	utcday: 10,
	utchour: 13,
	utcminute: 58,
	utcsecond: 0,
	deltaT: 69.01
};

let testResult = sampleMain(sampleData);
console.log("Result:\n", testResult);
