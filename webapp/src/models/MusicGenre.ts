export const MusicGenre = {
    PROGRESSIVE_ROCK: 'PROGRESSIVE_ROCK',
    HIP_HOP: 'HIP_HOP',
    PUNK_ROCK: 'PUNK_ROCK'
} as const;

export type MusicGenre = typeof MusicGenre[keyof typeof MusicGenre];