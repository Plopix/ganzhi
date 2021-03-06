export enum Page {
    GANZHI = '/ganzhi',
    GANZHIYEAR = '/ganzhiyear',
    JIEQI = '/jieqi',
    SOURCES = '/sources',
    GUIDE = '/guide',
    NOTES = '/notes'
}

export const SimplePages = [Page.NOTES, Page.GUIDE, Page.SOURCES];

export type MoonSequenceDefinition = {
    index: number;
    element: string;
    polarity: string;
    leapIndex: number;
};

export const elementSequenceOrder = ['earth', 'metal', 'water', 'wood', 'fire'];

export const polaritySequenceOrder = ['yang', 'yin'];

export type Journal = {
    [indexer: number]: string;
};
