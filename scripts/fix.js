const fs = require('fs');

const dStr = fs.readFileSync('./src/data/dictionary.ts', 'utf8');
const dClean = dStr.replace(/export interface DictionaryEntry \{\s+id: string;\s+word: string;\s+export interface DictionaryEntry \{/, 'export interface DictionaryEntry {');
fs.writeFileSync('./src/data/dictionary.ts', dClean);

const lStr = fs.readFileSync('./src/data/lessons.ts', 'utf8');
const lClean = lStr.replace(/export interface VocabWord \{[\s\S]+?export interface VocabWord \{/, 'export interface VocabWord {');
fs.writeFileSync('./src/data/lessons.ts', lClean);
console.log('Fixed syntax!');
