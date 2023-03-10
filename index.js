/**
 * MarketTerm CLI APP
 * @author Ugur Cengiz <Muffinweb>
 * @email ugurcengiz.mail@icloud.com
 * @github https://github.com/muffinweb
 * @linkedin https://linkedin.com/in/ugurcengiz
 */

import inquirer from 'inquirer';
import questions from './wizard/questions.js';
import MarketTerm from './core/MarketTerm.js';

inquirer
  .prompt(questions)
  .then((answers) => {
    MarketTerm(answers);
  })
  .catch((error) => {
    if (error.isTtyError) {
        console.log(error);
    } else {
      console.log('Uncaught Error Occured!');
    }
  });