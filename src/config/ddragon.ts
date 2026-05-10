const DDRAGON_VERSION = '14.10.1';
const DDRAGON_BASE = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}`;

export const ddragon = {
  championIcon: (championKey: string): string =>
    `${DDRAGON_BASE}/img/champion/${championKey}.png`,

  championSplash: (championKey: string): string =>
    `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championKey}_0.jpg`,

  spellIcon: (spellId: string): string =>
    `${DDRAGON_BASE}/img/spell/${spellId}.png`,

  passiveIcon: (filename: string): string =>
    `${DDRAGON_BASE}/img/passive/${filename}`,

  summonerSpellIcon: (spellId: string): string =>
    `${DDRAGON_BASE}/img/spell/${spellId}.png`,
} as const;
