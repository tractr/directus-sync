/*
  This file is used to start the server in order to create test
  configurations and dump them using Directus Sync CLI.
 */
import 'dotenv/config';
import './helpers/env.js';
import { Context } from './helpers/index.js';

const context = new Context();
void context.init();