export function GetRank(year: number): number {

    let rank = (year - 3).realModulo(60);

    if (year <= 3) {
        rank += 60;
    }
    if (rank === 0) {
        rank = 60;
    }

    return rank;

}

export function GetDayOfTheYear(isLeapYear: boolean): number {
    let date365 = 0;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (isLeapYear) {
        monthLength[1] = 29;
    }

    for (let i = 0; i < currentMonth; i++) {
        date365 = date365 + monthLength[i];
    }
    return date365 + currentDay;
}
