#! /usr/bin/env node
const states = require("../util/states");
const districts = require("../util/districts");
const slots = require("../util/slots");
const program = require('commander');
//states();
//districts(16);
// slots(283);

program
  .command('states ')
  .description('list down all the states')
  .action(states);

  program
  .command('districts <stateid>')
  .description('Retrieve all the districts by stateId')
  .action(districts);

  program
  .command('slots <districtid>')
  .description('list down all the slots in district')
  .action(slots);

  program.parse();