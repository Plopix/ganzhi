export type SymbolsMap = {
    gan: [string, string][];
    zhi: [string, string][];
    energies: [string, string][];
    polarities: [string, string][];
    signs: [string, string][];
    elementSigns: [string, string][];
    elements: string[];
    directions: string[];
    orientations: string[];
    symbols: [string, string][];
};

type smap = {
    fr: SymbolsMap;
    en: SymbolsMap;
};

export const symbolsmap: smap = {
    fr: {
        gan: [
            ['甲', 'jiǎ'],
            ['乙', 'yǐ'],
            ['丙', 'bǐng'],
            ['丁', 'dīng'],
            ['戊', 'wù'],
            ['己', 'jǐ'],
            ['庚', 'gēng'],
            ['辛', 'xīn'],
            ['壬', 'rén'],
            ['癸', 'guǐ']
        ],
        zhi: [
            ['子', 'zǐ'],
            ['丑', 'chǒu'],
            ['寅', 'yín'],
            ['卯', 'mǎo'],
            ['辰', 'chén'],
            ['巳', 'sì'],
            ['午', 'wǔ'],
            ['未', 'wèi'],
            ['申', 'shēn'],
            ['酉', 'yǒu'],
            ['戌', 'xū'],
            ['亥', 'hài']
        ],
        energies: [
            ['少陰', 'shǎo yīn'],
            ['太陰', 'tài yīn'],
            ['少暘', 'shǎo yáng'],
            ['暘明', 'yáng míng'],
            ['太暘', 'tài yáng'],
            ['厥陰', 'jué yīn']
        ],
        polarities: [
            ['陽', 'yáng'],
            ['陰', 'yīn']
        ],
        signs: [
            ['鼠 Rat', 'shǔ'],
            ['牛 Bœuf', 'niú'],
            ['虎 Tigre', 'hǔ'],
            ['兔 Lapin', 'tù'],
            ['龍 Dragon', 'lóng'],
            ['蛇 Serpent', 'shé'],
            ['馬 Cheval', 'mǎ'],
            ['羊 Chèvre', 'yáng'],
            ['猴 Singe', 'hóu'],
            ['鷄 Coq', 'jī'],
            ['狗 Chien', 'gǒu'],
            ['猪 Cochon', 'zhū']
        ],
        elementSigns: [
            ['木 Bois', 'mù'],
            ['木 Bois', 'mù'],
            ['火 Feu', 'huǒ'],
            ['火 Feu', 'huǒ'],
            ['土 Terre', 'tǔ'],
            ['土 Terre', 'tǔ'],
            ['金 Métal', 'jīn'],
            ['金 Métal', 'jīn'],
            ['水 Eau', 'shuǐ'],
            ['水 Eau', 'shuǐ']
        ],
        elements: ['Terre', 'Métal', 'Eau', 'Bois', 'Feu'],
        directions: [
            'le Nord',
            'le Centre',
            'l’Est',
            'l’Est',
            'le Centre',
            'le Sud',
            'le Sud',
            'le Centre',
            'l’Ouest',
            'l’Ouest',
            'le Centre',
            'le Nord'
        ],
        orientations: [
            'Nord',
            'Nord-Nord-Est',
            'Est-Nord-Est',
            'Est',
            'Est-Sud-Est',
            'Sud-Sud-Est',
            'Sud',
            'Sud-Sud-Ouest',
            'Ouest-Sud-Ouest',
            'Ouest',
            'Ouest-Nord-Ouest',
            'Nord-Nord-Ouest'
        ],
        symbols: [
            ['海中金', 'Métal du fond de la mer'],
            ['海中金', 'Métal du fond de la mer'],
            ['炉中火', 'Feu du foyer'],
            ['炉中火', 'Feu du foyer'],
            ['大林木', 'Bois de la grande forêt'],
            ['大林木', 'Bois de la grande forêt'],
            ['路旁土', 'Terre du bord des routes'],
            ['路旁土', 'Terre du bord des routes'],
            ['剑锋金', "Métal du fil de l'épée"],
            ['剑锋金', "Métal du fil de l'épée"],
            ['山头火', 'Feu de la cime des montagnes'],
            ['山头火', 'Feu de la cime des montagnes'],
            ['洞下水', 'Eau des grottes'],
            ['洞下水', 'Eau des grottes'],
            ['城头土', 'Terre du faîte des remparts'],
            ['城头土', 'Terre du faîte des remparts'],
            ['白腊金', "Métal de l'arête de l'épée"],
            ['白腊金', "Métal de l'arête de l'épée"],
            ['杨柳木', 'Bois de saule'],
            ['杨柳木', 'Bois de saule'],
            ['泉中水', 'Eau de source'],
            ['泉中水', 'Eau de source'],
            ['屋上土', 'Terre des tuiles du toit'],
            ['屋上土', 'Terre des tuiles du toit'],
            ['霹雳火', 'Feu de la foudre'],
            ['霹雳火', 'Feu de la foudre'],
            ['松柏木', 'Bois de pin'],
            ['松柏木', 'Bois de pin'],
            ['长流水', 'Eau du fleuve'],
            ['长流水', 'Eau du fleuve'],
            ['沙中金', 'Métal des sables'],
            ['沙中金', 'Métal des sables'],
            ['山下火', 'Feu au pied des montagnes'],
            ['山下火', 'Feu au pied des montagnes'],
            ['平地木', 'Bois des plaines'],
            ['平地木', 'Bois des plaines'],
            ['壁上土', 'Terre des murailles'],
            ['壁上土', 'Terre des murailles'],
            ['金白金', "Métal d'or"],
            ['金白金', "Métal d'or"],
            ['佛灯火', 'Feu de lampe à huile'],
            ['佛灯火', 'Feu de lampe à huile'],
            ['天河水', 'Eau de la Voie Lactée'],
            ['天河水', 'Eau de la Voie Lactée'],
            ['大驿土', 'Terre de la grand-route'],
            ['大驿土', 'Terre de la grand-route'],
            ['钗钏金', 'Métal des parures'],
            ['钗钏金', 'Métal des parures'],
            ['桑柘木', 'Bois de mûrier'],
            ['桑柘木', 'Bois de mûrier'],
            ['大溪水', 'Eau des torrents'],
            ['大溪水', 'Eau des torrents'],
            ['沙中土', 'Terre de sable'],
            ['沙中土', 'Terre de sable'],
            ['天上火', 'Feu céleste'],
            ['天上火', 'Feu céleste'],
            ['石榴木', 'Bois de grenadier'],
            ['石榴木', 'Bois de grenadier'],
            ['大海水', "Eau de l'océan"],
            ['大海水', "Eau de l'océan"]
        ]
    },

    //@todo: translate here
    en: {
        gan: [
            ['甲', 'jiǎ'],
            ['乙', 'yǐ'],
            ['丙', 'bǐng'],
            ['丁', 'dīng'],
            ['戊', 'wù'],
            ['己', 'jǐ'],
            ['庚', 'gēng'],
            ['辛', 'xīn'],
            ['壬', 'rén'],
            ['癸', 'guǐ']
        ],
        zhi: [
            ['子', 'zǐ'],
            ['丑', 'chǒu'],
            ['寅', 'yín'],
            ['卯', 'mǎo'],
            ['辰', 'chén'],
            ['巳', 'sì'],
            ['午', 'wǔ'],
            ['未', 'wèi'],
            ['申', 'shēn'],
            ['酉', 'yǒu'],
            ['戌', 'xū'],
            ['亥', 'hài']
        ],
        energies: [
            ['少陰', 'shǎo yīn'],
            ['太陰', 'tài yīn'],
            ['少暘', 'shǎo yáng'],
            ['暘明', 'yáng míng'],
            ['太暘', 'tài yáng'],
            ['厥陰', 'jué yīn']
        ],
        polarities: [
            ['陽', 'yáng'],
            ['陰', 'yīn']
        ],
        signs: [
            ['鼠 Rat', 'shǔ'],
            ['牛 Ox', 'niú'],
            ['虎 Tiger', 'hǔ'],
            ['兔 Rabbit', 'tù'],
            ['龍 Dragon', 'lóng'],
            ['蛇 Snake', 'shé'],
            ['馬 Horse', 'mǎ'],
            ['羊 Goat', 'yáng'],
            ['猴 Monkey', 'hóu'],
            ['鷄 Rooster', 'jī'],
            ['狗 Dog', 'gǒu'],
            ['猪 Pig', 'zhū']
        ],
        elementSigns: [
            ['木 Wood', 'mù'],
            ['木 Wood', 'mù'],
            ['火 Fire', 'huǒ'],
            ['火 Fire', 'huǒ'],
            ['土 Earth', 'tǔ'],
            ['土 Earth', 'tǔ'],
            ['金 Metal', 'jīn'],
            ['金 Metal', 'jīn'],
            ['水 Water', 'shuǐ'],
            ['水 Water', 'shuǐ']
        ],
        elements: ['Earth', 'Metal', 'Water', 'Wood', 'Fire'],
        directions: [
            'the North',
            'the Center',
            'the East',
            'the East',
            'the Center',
            'the South',
            'the South',
            'the Center',
            'the West',
            'the West',
            'the Center',
            'the North'
        ],
        orientations: [
            'North',
            'North-North-East',
            'East-North-East',
            'East',
            'East-South-East',
            'South-South-East',
            'South',
            'South-South-West',
            'West-South-West',
            'West',
            'West-North-West',
            'North-North-West'
        ],
        symbols: [
            ['海中金', 'Sea Metal'],
            ['海中金', 'Sea Metal'],
            ['炉中火', 'Furnace Fire'],
            ['炉中火', 'Furnace Fire'],
            ['大林木', 'Forest Wood'],
            ['大林木', 'Forest Wood'],
            ['路旁土', 'Road Earth'],
            ['路旁土', 'Road Earth'],
            ['剑锋金', 'Sword edge Metal'],
            ['剑锋金', 'Sword edge Metal'],
            ['山头火', 'Volcanic Fire'],
            ['山头火', 'Volcanic Fire'],
            ['洞下水', 'Cave Water'],
            ['洞下水', 'Cave Water'],
            ['城头土', 'Fortress Earth'],
            ['城头土', 'Fortress Earth'],
            ['白腊金', 'Blade ridge Metal'],
            ['白腊金', 'Blade ridge Metal'],
            ['杨柳木', 'Willow Wood'],
            ['杨柳木', 'Willow Wood'],
            ['泉中水', 'Spring Water'],
            ['泉中水', 'Spring Water'],
            ['屋上土', 'Roof tiles Earth'],
            ['屋上土', 'Roof tiles Earth'],
            ['霹雳火', 'Lightning Fire'],
            ['霹雳火', 'Lightning Fire'],
            ['松柏木', 'Pine Wood'],
            ['松柏木', 'Pine Wood'],
            ['长流水', 'River Water'],
            ['长流水', 'River Water'],
            ['沙中金', 'Sand Metal'],
            ['沙中金', 'Sand Metal'],
            ['山下火', 'Foot of the Mountain Fire'],
            ['山下火', 'Foot of the Mountain Fire'],
            ['平地木', 'Meadow Wood'],
            ['平地木', 'Meadow Wood'],
            ['壁上土', 'Adobe Earth'],
            ['壁上土', 'Adobe Earth'],
            ['金白金', 'Gold Metal'],
            ['金白金', 'Gold Metal'],
            ['佛灯火', 'Oil Lamp Fire'],
            ['佛灯火', 'Oil Lamp fire'],
            ['天河水', 'Milky Way Water'],
            ['天河水', 'Milky Way Water'],
            ['大驿土', 'Highway Earth'],
            ['大驿土', 'Highway Earth'],
            ['钗钏金', 'Jewelry Metal'],
            ['钗钏金', 'Jewelry Metal'],
            ['桑柘木', 'Mulberry Wood'],
            ['桑柘木', 'Mulberry Wood'],
            ['大溪水', 'Torrent Water'],
            ['大溪水', 'Torrent Water'],
            ['沙中土', 'Sand Earth'],
            ['沙中土', 'Sand Earth'],
            ['天上火', 'Heavenly Fire'],
            ['天上火', 'Heavenly Fire'],
            ['石榴木', 'Pomegranate Wood'],
            ['石榴木', 'Pomegranate Wood'],
            ['大海水', 'Ocean Water'],
            ['大海水', 'Ocean Water']
        ]
    }
};
