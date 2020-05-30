'use strict';

// Entrypoint for app

const markov = require('./markov');
import { plot as markov_diagram } from './markov-diagram';

const chain = markov.create();
const svg = markov_diagram(chain);
