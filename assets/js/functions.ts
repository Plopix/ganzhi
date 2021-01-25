export const GetRank = (year: number): number => {

    let rank = (year - 3).realModulo(60);

    if (year <= 3) {
        rank += 60;
    }
    if (rank === 0) {
        rank = 60;
    }

    return rank;

}
