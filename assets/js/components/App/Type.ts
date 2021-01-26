export enum Page {
    GANZHI = 'ganzhi',
    GANZHIYEAR = 'ganzhiyear',
    JIEQI = 'jieqi',
}

export type MoonSequenceDefinition = {
    index: number;
    element: string;
    polarity: string;
    leapIndex: number;
}


export const elementSequenceOrder = [
    'earth',
    'metal',
    'water',
    'wood',
    'fire'
];

export const polaritySequenceOrder = [
    'yang',
    'yin',
];
