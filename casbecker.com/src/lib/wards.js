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
      'The ledger was never written in letters, only in numbers.',
      '3 · 19 · 2 · 15 · 5',
      '(Count the alphabet from A — then let the fire cool each one by a single step.)',
    ],
    hints: [
      '① A = 1 — count the alphabet from A.',
      '② It becomes letters first, then each one shifts.',
      '③ Cool each letter by one step → B R A N D.',
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
    hints: [
      '① Say what the picture is — out loud.',
      '② Let the end of it fall away.',
      '③ Drop its last sound → F E N.',
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
      'I keep three thimbles in a row — brass, silver and bone — and in them sleep three letters. Which is where? Read my card, and weigh every clue; none of them is idle.',
      'Read the letters from left to right, and my true name will be standing there.',
    ],
    hints: [
      '① Start with which thimble the E must be in.',
      '② In a row of three, two letters that aren\'t neighbours must be at the two ends.',
      '③ Silver = H, brass = M → H E M.',
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
    hints: [
      '① It\'s a day.',
      '② Tomorrow.',
      '③ Drop the "to" → M O R R O W.',
    ],
  },
];

export function wardById(id) {
  return WARDS.find((w) => w.id === id) || null;
}
