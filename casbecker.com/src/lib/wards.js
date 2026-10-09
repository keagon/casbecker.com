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
      'M · V · U',
      'First turn it around; then set each letter against its opposite (A ↔ Z).',
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
      'I · G · P',
      'The first is one ahead; the second, two; the third, three.',
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
    riddleTitle: 'Seal IV — the Glimmerkin blinks',
    riddle: [
      'Hold this to the glass.',
      '.eno kcab snrut ssalg eht · XPPSPN',
    ],
  },
];

export function wardById(id) {
  return WARDS.find((w) => w.id === id) || null;
}
