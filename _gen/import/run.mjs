import { importMbpp } from './mbpp.mjs';
import { importExercism } from './exercism.mjs';
import { emitDataFile } from './emit.mjs';

const SOURCES = 'C:/Users/User/AppData/Local/Temp/claude/C--Users-User-Desktop-pin-cms-home-page/00c815b3-63ff-42bf-8b2a-0f0cbd997026/scratchpad';

const mbpp = await importMbpp(`${SOURCES}/mbpp.jsonl`);
await emitDataFile({
  path: new URL('../data/21-everyday-functions.mjs', import.meta.url),
  category: 'Everyday Functions',
  dir: '21-everyday-functions',
  intro:
    '\nShort, self-contained tasks from the MBPP dataset (Google Research, Apache 2.0): one\n' +
    'idea each, no data structure to design. They are here for volume and for the reflex of\n' +
    'turning a sentence into a signature. The examples are the dataset own assertions.\n',
  problems: mbpp.problems,
});
console.log('MBPP:', mbpp.problems.length, 'imported,', mbpp.skipped.reduce((s, [, c]) => s + c, 0), 'skipped');

const exercism = await importExercism(`${SOURCES}/exercism/exercises`);
await emitDataFile({
  path: new URL('../data/22-exercism.mjs', import.meta.url),
  category: 'Exercism',
  dir: '22-exercism',
  intro:
    '\nExercises from Exercism problem specifications (MIT). The prose is longer than most\n' +
    'sets here on purpose: the work is reading a rule carefully and turning it into code,\n' +
    'not spotting a trick. Test data is the project own canonical data.\n',
  problems: exercism.problems,
});
console.log('Exercism:', exercism.problems.length, 'imported,', exercism.skipped.reduce((s, [, c]) => s + c, 0), 'skipped');
