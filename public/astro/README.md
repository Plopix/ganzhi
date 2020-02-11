# JS Celestial Almanac
- Ported in ES6 from [Henning Umland](https://www.celnav.de/)'s code.

### Test it from NodeJS
From `node-js`, run the script named `sample.main.js`:
```
 $ node sample.main.js 
   Calculation done 2020-2-11 17:4:57 UTC :
   Result:
    { sun: 
      { GHA: { raw: 72.68481496169176, fmt: '072° 41\' 05"' },
        RA: { raw: 324.783604433748, fmt: '21h 39m 08.1s' },
        DEC: { raw: -14.03502850140126, fmt: 'S   14° 02\' 06"' },
        SD: { raw: 972.3873639398472, fmt: '972.4"' },
        HP: { raw: 8.910907827482484, fmt: '8.9"' } },
     EOT: { raw: -14.210740153233019, fmt: ' - 14m 12.6s' },
     moon: 
      { GHA: { raw: 219.20343716725228, fmt: '219° 12\' 12"' },
        RA: { raw: 178.26498222818748, fmt: '11h 53m 03.6s' },
        DEC: { raw: 6.236259892532262, fmt: 'N   06° 14\' 11"' },
        SD: { raw: 992.8458322619886, fmt: '992.8"' },
        HP: { raw: 3643.7368424098754, fmt: '3643.7"' },
        illum: 91.6,
        phase: { phase: ' -gib', phaseAngle: 213.5 } },
     venus: 
      { GHA: { raw: 33.206448263419816, fmt: '033° 12\' 23"' },
        RA: { raw: 4.261971132019922, fmt: '00h 17m 02.9s' },
        DEC: { raw: 1.5859715304540454, fmt: 'N   01° 35\' 09"' },
        SD: { raw: 8.26186484288226, fmt: '8.3"' },
        HP: { raw: 8.639101002176764, fmt: '8.6"' },
        illum: 69.8 },
     mars: 
      { GHA: { raw: 131.04157508964005, fmt: '131° 02\' 30"' },
        RA: { raw: 266.4268443057997, fmt: '17h 45m 42.4s' },
        DEC: { raw: -23.530078576468615, fmt: 'S   23° 31\' 48"' },
        SD: { raw: 2.513444023277323, fmt: '2.5"' },
        HP: { raw: 4.722911696730936, fmt: '4.7"' },
        illum: 92.4 },
     jupiter: 
      { GHA: { raw: 110.17210430012642, fmt: '110° 10\' 20"' },
        RA: { raw: 287.29631509531333, fmt: '19h 09m 11.1s' },
        DEC: { raw: -22.460411545688483, fmt: 'S   22° 27\' 37"' },
        SD: { raw: 16.48158345864249, fmt: '16.5"' },
        HP: 1.472359253710911,
        illum: 99.7 },
     saturn: 
      { GHA: { raw: 99.20615927716727, fmt: '099° 12\' 22"' },
        RA: { raw: 298.2622601182725, fmt: '19h 53m 02.9s' },
        DEC: { raw: -20.895862825503553, fmt: 'S   20° 53\' 45"' },
        SD: { raw: 7.585553159518628, fmt: '7.6"' },
        HP: { raw: 0.8063260544519136, fmt: '0.8"' },
        illum: 100 },
     polaris: 
      { GHA: { raw: 353.297966384888, fmt: '353° 17\' 53"' },
        RA: { raw: 44.170453010551746, fmt: '02h 56m 40.9s' },
        DEC: { raw: 89.35252147219398, fmt: 'N   89° 21\' 09"' } },
     sidTmean: { raw: 37.472418242599815, fmt: '2h 29m 53.380s' },
     sidTapp: { raw: 37.46841939543974, fmt: '2h 29m 52.421s' },
     EoEquin: -0.96,
     dPsi: -15.69,
     dEps: -0.619,
     obliq: { raw: 23.436675602141516, fmt: '23° 26\' 12.032"' },
     trueObliq: { raw: 23.436503759012673, fmt: '23° 26\' 11.414"' },
     julianDay: 2458891.211771,
     julianEphemDay: 2458891.21257,
     lunarDist: { raw: 146.17298579949397, fmt: '146° 10\' 23"' },
     dayOfWeek: 'TUE' }
$
```

As you would see, it returns the celestial configuration for the current UTC date.

It returns data for the following bodies:
 - `Sun`
 - `Moon`
 - `Venus`
 - `Mars`
 - `Jupiter`
 - `Saturn`
 - `Polaris`
 
For each body, it gives:
- the Greenwich Hour Angle (`GHA`), raw and formatted
- the Right Ascension (`RA`), raw and formatted
- the Declination (`DEC`), raw and formatted
- the Semi-Diameter (`SD`), raw and formatted
- the Horizontal Parallax (`HP`), raw and formatted
- the illumination (`illum`) in %, except for the Sun 

`Polaris` obviously does not have semi-diameter, horizontal parallax, nor illumination.

In addition for the `Moon`, there is also the phase (raw, and formatted).
Values are in degrees, from `0` to `360`
- `0` and `360`: New Moon
- `90`: First quarter
- `180`: Full Moon
- `270`: Last Quarter

## How to use it
As shown in `sample.main.js`, you need to import `longterm.almanac.js` from a `require` statement, and then 
invoke the `calculate` function to get the `JSON` object featured above.

> Note: DeltaT is to be provided at runtime. It can be obtained from [here](http://maia.usno.navy.mil/).

---
