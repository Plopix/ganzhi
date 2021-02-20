import { expect } from 'chai';
import { GetRank, YearCycleRange, RecalculateNewMoons } from '../src/js/functions';
import { Moment } from 'moment';

describe('Functions', function () {
    describe('GetRank', function () {
        const data = [
            [1984, 1],
            [1985, 2],
            [1986, 3],
            [1987, 4],
            [1988, 5],
            [1983, 60],
            [2021, 38],
            [2345, 2],
            [111, 48]
        ];

        it('should return correct value', function () {
            data.map(([year, expectedRank]) => {
                expect(GetRank(year)).to.be.equal(expectedRank);
            });
        });
    });

    describe('YearCycleRange', function () {
        const data = [
            [1984, 60, { min: 1984, max: 2043 }],
            [1984, 30, { min: 1984, max: 2013 }],
            [2000, 60, { min: 1984, max: 2043 }],
            [2001, 60, { min: 1984, max: 2043 }],
            [2004, 60, { min: 1984, max: 2043 }],
            [1999, 60, { min: 1984, max: 2043 }],
            [1900, 60, { min: 1864, max: 1923 }],
            [1901, 60, { min: 1864, max: 1923 }],
            [1923, 60, { min: 1864, max: 1923 }],
            [1924, 60, { min: 1924, max: 1983 }],
            [2145, 60, { min: 2104, max: 2163 }]
        ];

        it('should return correct value', function () {
            data.map((set) => {
                const year: number = set[0] as number;
                const step: number = set[1] as number;
                const expectedRange = set[2] as { min: number; max: number };
                expect(YearCycleRange(year, step).min).to.be.equal(expectedRange.min);
                expect(YearCycleRange(year, step).max).to.be.equal(expectedRange.max);
            });
        });
    });

    describe('RecalculateNewMoons', function () {
        const data = [
            [1984, [3, 32, 62, 92, 122, 151, 181, 210, 239, 269, 298, 328, 357]],
            [1985, [21, 50, 80, 110, 139, 169, 199, 228, 257, 287, 316, 346]],
            [2020, [24, 54, 84, 114, 143, 173, 202, 232, 261, 290, 320, 349]],
            [2021, [13, 42, 72, 102, 131, 161, 191, 220, 250, 279, 309, 338]],
            [2022, [2, 32, 61, 91, 120, 150, 180, 209, 239, 268, 298, 328, 357]],
            [2132, [18, 48, 77, 107, 136, 165, 195, 224, 253, 283, 312, 342]]
        ];

        it('should return correct value', function () {
            data.map((set) => {
                const year: number = set[0] as number;
                const expectedMoonDayOfYear: number[] = set[1] as number[];
                const moons: Moment[] = RecalculateNewMoons(year);
                moons.map((moon: Moment, index: number) => {
                    expect(moon.dayOfYear()).to.be.equal(expectedMoonDayOfYear[index]);
                });
            });
        });
    });
});
