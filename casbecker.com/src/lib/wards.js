export const WARDS = [
  {
    id: 'cinderfowl',
    name: 'The Cinderfowl',
    trueName: 'BRAND',
    where: 'beside the hearth',
    blurb: 'A plucky red bird that nests in warm ashes.',
    accent: '#ff8a3d',
    audio: '/audio/cinderfowl.mp3',
    riddleTitle: 'Seal I — the Cinderfowl stirs',
    riddle: [
      'In the hearth ledger, names are counted, then cooled.',
      '3 · 19 · 2 · 15 · 5',
      '(A = 1, B = 2 … Z = 26. The fire dims by one.)',
    ],
  },
  {
    id: 'mossskitter',
    name: 'The Moss-Skitter',
    trueName: 'FEN',
    where: 'in the bedchamber',
    blurb: 'A quick green thing that hides where you least look.',
    accent: '#7fb069',
    audio: '/audio/mossskitter.mp3',
    riddleTitle: 'Seal II — the Moss-Skitter watches',
    riddle: [
      'Look at the card where you found me. Say the plain word for what is drawn there — out loud, the way you would to a child.',
      'Now let the end of it fall away, the way a skitter drops its tail. What is left is my true name.',
    ],
  },
  {
    id: 'thimblekin',
    name: 'The Thimblekin',
    trueName: 'HEM',
    where: 'in the smallest room',
    blurb: 'A tiny guardian that sleeps inside a house of cloth.',
    accent: '#8fb7d9',
    audio: '/audio/thimblekin.mp3',
    riddleTitle: 'Seal III — the Thimblekin hides',
    riddle: [
      'I keep three thimbles in a row — brass, silver and bone — and in them sleep three letters: H, E and M. Which is where? Read my card, and mind the clues.',
      'Read the letters from left to right, and my true name will be standing there.',
    ],
  },
  {
    id: 'glimmerkin',
    name: 'The Glimmerkin',
    trueName: 'MORROW',
    where: 'behind the looking-glass',
    blurb: 'A pale creature whose reflection is always a half-second late.',
    accent: '#b79ad6',
    audio: '/audio/glimmerkin.mp3',
    riddleTitle: 'Seal IV — the Glimmerkin watches',
    riddle: [
      'What is always coming, but never arrives?',
      'Name it. Then drop the to-ing and fro-ing — the coming-and-going part — and what is left is my true name.',
    ],
  },
];

export function wardById(id) {
  return WARDS.find((w) => w.id === id) || null;
}
