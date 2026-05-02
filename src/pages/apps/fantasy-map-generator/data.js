// Naming traditions, world presets, and cartographic style palettes.

export const NAMING = {
  westron: {
    pre: ['West','North','Iron','Deep','Grey','Misty','High','Red','Black','White','Silver','Gold','Old','Lost','Stone','Raven','Wolf','Bree','Bag','Tuck'],
    suf: ['wood','peak','river','fall','bridge','field','haven','watch','dale','vale','gate','port','bay','isle','hold','bury','ton','shire','marsh','mere'],
    cap: ['Annúminas','Tharbad','Fornost','Edoras','Lond','Mithlond'],
    realm: ['Arnor','Gondor','Rohan','Eriador','Dunland','Calenardhon','Enedwaith','Rhovanion'],
  },
  norse: {
    pre: ['Skjald','Vík','Norð','Aust','Vest','Dverg','Jötun','Berg','Eld','Ulf','Hrafn','Bjørn','Ís','Þor','Frey','Sig','Helga','Odin','Val','Skjold'],
    suf: ['heim','gard','fjord','vík','holm','strand','mark','dal','berg','stad','øy','nes','fell','tun','borg','land'],
    cap: ['Asgárd','Niflheim','Midgardr','Útgardr','Helheim','Vanaheim'],
    realm: ['Skjaldarríki','Norðlönd','Jötunheimr','Vinlandr','Austrvegr','Hrafnamark'],
  },
  latin: {
    pre: ['Aqua','Mons','Castra','Porta','Nova','Magna','Sancta','Petra','Silva','Aurea','Vetus','Alta','Sera','Lucia','Valeria','Marcus','Tiberius','Augusta'],
    suf: ['ium','ica','arium','polis','burgum','ana','ensis','dunum','vicus','aquae','ostium','minor','maior','prima'],
    cap: ['Aquilonia','Tarraconensis','Augusta Treverorum','Caesarea','Mediolanum','Valentia'],
    realm: ['Imperium Aquilae','Provincia Lucia','Regnum Petrosum','Confoederatio Stellae','Ducatus Silvae'],
  },
  arabic: {
    pre: ['Al-','Bayt-','Qasr-','Wadi-','Jebel-','Bahr-','Dar-','Ain-','Madinat-','Bab-','Ras-','Tell-'],
    suf: ['nahar','salam','noor','rahma','baraka','jameel','kadim','azraq','dhahab','sahra','maghrib','mashriq','samaa','qamar'],
    cap: ['Al-Qahira','Madinat al-Salam','Bayt al-Hikma','Qasr al-Qamar','Wadi al-Noor'],
    realm: ['Sultanat al-Sahra','Khilafat al-Bahrain','Imarat al-Najm','Mamlakat al-Qamar'],
  },
  elvish: {
    pre: ['Cala','Mith','Lóri','Imla','Mene','Tiri','Lúthi','Galadh','Eryn','Aman','Núme','Ered','Anoria','Silvë','Tinu','Anar','Isil','Cele','Aelin'],
    suf: ['enor','rilas','dris','vie','noth','wen','dor','iel','star','riel','than','mië','lor','ndil','riath','ëa','llon','duil'],
    cap: ['Caras Galadhon','Imladris','Menegroth','Lórien','Tirion'],
    realm: ['Eldamar','Ñoldorin','Doriath','Lothlórien','Eregion','Aman'],
  },
  slavic: {
    pre: ['Belo','Cherno','Krasno','Zlato','Novo','Staro','Velko','Mroz','Vlk','Zar','Polz','Ostro','Ruso','Drev','Brez'],
    suf: ['grad','gora','polje','ovo','ica','sk','kov','dor','les','reka','more','vyy','itsa','niki'],
    cap: ['Beligrad','Krasnograd','Zarítsa','Veliky Novograd','Drevograd'],
    realm: ['Knyazhestvo Beli','Tsarstvo Zlatoye','Krasnaya Rus','Velikoye Polje'],
  },
};

export const WORLD_PRESETS = {
  continent:    { label: 'Continent',          mask: 'radial',     waterAdj:  0.00, mountAdj:  0.00, climate: 0.50, biomeBoost: {} },
  archipelago:  { label: 'Archipelago',        mask: 'islands',    waterAdj:  0.10, mountAdj: -0.10, climate: 0.55, biomeBoost: { jungle: 0.2 } },
  peninsula:    { label: 'Peninsula',          mask: 'peninsula',  waterAdj:  0.05, mountAdj:  0.10, climate: 0.50, biomeBoost: {} },
  island:       { label: 'Lone Island',        mask: 'island',     waterAdj:  0.05, mountAdj:  0.05, climate: 0.55, biomeBoost: {} },
  atoll:        { label: 'Atoll Ring',         mask: 'atoll',      waterAdj:  0.15, mountAdj: -0.20, climate: 0.65, biomeBoost: { jungle: 0.4 } },
  inlandSea:    { label: 'Inland Sea',         mask: 'inland',     waterAdj:  0.00, mountAdj:  0.10, climate: 0.45, biomeBoost: {} },
  middleEarth:  { label: 'Middle-Earth',       mask: 'middle',     waterAdj:  0.05, mountAdj:  0.20, climate: 0.45, biomeBoost: { forest: 0.2 } },
  volcanic:     { label: 'Volcanic Isle',      mask: 'island',     waterAdj:  0.05, mountAdj:  0.40, climate: 0.55, biomeBoost: {}, volcanoes: 4 },
  frozenNorth:  { label: 'Frozen North',       mask: 'radial',     waterAdj:  0.00, mountAdj:  0.10, climate: 0.10, biomeBoost: { tundra: 0.5 } },
  desert:       { label: 'Desert Caliphate',   mask: 'radial',     waterAdj: -0.05, mountAdj:  0.00, climate: 0.85, biomeBoost: { desert: 0.6 } },
  subcontinent: { label: 'Subcontinent',       mask: 'wide',       waterAdj: -0.05, mountAdj:  0.10, climate: 0.55, biomeBoost: {} },
};

// Palettes are intentionally riso-flat — two-to-three spot colors over warm
// paper. Each carries a `ui` block that drives the page chrome accent so the
// whole interface re-tints when the cartographer switches styles.
export const STYLES = {
  riso: {
    label: 'Risograph',
    paper: '#F4EEE0', paperShade: '#E5DAC0',
    water: '#A8C5D6', waterDeep: '#6F95B0', waterOutline: '#1B2433',
    ink: '#1B2433', text: '#1B2433',
    mountainLight: '#F4EEE0', mountainShadow: '#E8553F',
    forest: '#3F8068', jungle: '#2E6953', swamp: '#7C7A4A',
    desert: '#F0C76A', tundra: '#D8DCD0', snow: '#F4EEE0',
    road: '#E8553F', realmInk: '#E8553F',
    ui: { bg: '#F4EEE0', surface: '#FAF6EA', ink: '#1B2433', muted: '#7B7466', spot: '#E8553F', spotInk: '#FAF6EA', rule: '#1B2433' },
  },
  herbarium: {
    label: 'Herbarium',
    paper: '#F1ECDA', paperShade: '#DCD3B8',
    water: '#C5D2C8', waterDeep: '#9BB0A2', waterOutline: '#2D3A2A',
    ink: '#2D3A2A', text: '#1F2A1D',
    mountainLight: '#F1ECDA', mountainShadow: '#7F7A55',
    forest: '#5C7A4A', jungle: '#3F5C2E', swamp: '#7C8A5A',
    desert: '#D9C58A', tundra: '#CFCDB2', snow: '#F1ECDA',
    road: '#A8895C', realmInk: '#7C5436',
    ui: { bg: '#F1ECDA', surface: '#F8F4E5', ink: '#2D3A2A', muted: '#7C7657', spot: '#5C7A4A', spotInk: '#F8F4E5', rule: '#2D3A2A' },
  },
  ukiyo: {
    label: 'Ukiyo-e',
    paper: '#EFE3CC', paperShade: '#D8C8A8',
    water: '#3D5A8A', waterDeep: '#243B66', waterOutline: '#0E1726',
    ink: '#0E1726', text: '#0E1726',
    mountainLight: '#EFE3CC', mountainShadow: '#C0A878',
    forest: '#3F6E4E', jungle: '#2E5A38', swamp: '#5C6A4A',
    desert: '#D8B96E', tundra: '#CFCAB0', snow: '#EFE3CC',
    road: '#B07636', realmInk: '#B33A2A',
    ui: { bg: '#EFE3CC', surface: '#F6ECD2', ink: '#0E1726', muted: '#7C6E4E', spot: '#B33A2A', spotInk: '#F6ECD2', rule: '#0E1726' },
  },
  midcentury: {
    label: 'Mid-Century',
    paper: '#EAE0CB', paperShade: '#D2C2A0',
    water: '#7AA0A4', waterDeep: '#4F7A82', waterOutline: '#27302E',
    ink: '#27302E', text: '#1B221F',
    mountainLight: '#EAE0CB', mountainShadow: '#B47840',
    forest: '#4F6B3A', jungle: '#3A5A2C', swamp: '#7A7642',
    desert: '#E2B66A', tundra: '#C8C5AC', snow: '#F2E9D2',
    road: '#B47840', realmInk: '#C25A2E',
    ui: { bg: '#EAE0CB', surface: '#F2EAD3', ink: '#27302E', muted: '#7A7053', spot: '#C25A2E', spotInk: '#F2EAD3', rule: '#27302E' },
  },
  arctic: {
    label: 'Arctic Survey',
    paper: '#ECEEF1', paperShade: '#D4D8DE',
    water: '#A8C2D8', waterDeep: '#6F8DA8', waterOutline: '#11212F',
    ink: '#11212F', text: '#0B1822',
    mountainLight: '#ECEEF1', mountainShadow: '#5A6F84',
    forest: '#3A5C5C', jungle: '#2E5A50', swamp: '#5A7080',
    desert: '#C4C7B8', tundra: '#D8DEE2', snow: '#F2F4F7',
    road: '#7A8290', realmInk: '#D14A3C',
    ui: { bg: '#ECEEF1', surface: '#F7F9FB', ink: '#11212F', muted: '#5C6873', spot: '#D14A3C', spotInk: '#F7F9FB', rule: '#11212F' },
  },
  dunes: {
    label: 'Sunset Dunes',
    paper: '#F5E2C8', paperShade: '#EAC9A0',
    water: '#7C5C8A', waterDeep: '#5A3F6E', waterOutline: '#2E1B2E',
    ink: '#2E1B2E', text: '#241420',
    mountainLight: '#F5E2C8', mountainShadow: '#C77A5A',
    forest: '#7A6845', jungle: '#5C4A2E', swamp: '#7A6A4A',
    desert: '#E8AE6A', tundra: '#D8C2A0', snow: '#F5E2C8',
    road: '#C77A5A', realmInk: '#C73E5C',
    ui: { bg: '#F5E2C8', surface: '#FBEED2', ink: '#2E1B2E', muted: '#8A6E5C', spot: '#C73E5C', spotInk: '#FBEED2', rule: '#2E1B2E' },
  },
};

export const NAMING_OPTIONS = [
  { value: 'westron', label: 'Westron (Tolkien)' },
  { value: 'norse',   label: 'Norse Saga' },
  { value: 'latin',   label: 'Latin Imperial' },
  { value: 'arabic',  label: 'Arabic Caliphate' },
  { value: 'elvish',  label: 'High Elvish' },
  { value: 'slavic',  label: 'Slavic Tsardom' },
];
