const chalk = require('chalk');

const manual = () => {
  console.log(`${chalk.bold('Welcome to the GAIA manual!')} Here is a list of each command and what they do.\n`);
  console.log(`${chalk.bold.green('Setup')} (${chalk.bold.blue('npm run setup')}): This should be the first command that you run when cloning this repo for the first time. After running this command, the CLI will prompt you for information regarding your GitHub account, GMail, and course tracker to add to your .env.`);
  console.log(`${chalk.bold.green('Help')} (${chalk.bold.blue('npm run help')}): This opens this manual. Hello!`);
  console.log(`${chalk.bold.green('Auth Test')} (${chalk.bold.blue('npm run auth-test')}): This attempts to source data from the students sheet to confirm you are logged in with proper credentials.`);
  console.log(`${chalk.bold.green('GHOST')} (${chalk.bold.blue('npm run ghost')}): This tool sources data from GitHub to provide real-time information regarding homework completion, and updates the course tracker accordingly.`);
  console.log(`${chalk.bold.green('GHOST Test')} (${chalk.bold.blue('npm run ghost-test')}): This will test GHOST and output the data in a console.table() call.`);
  console.log(`${chalk.bold.green('Mailed It!')} (${chalk.bold.blue('npm run mailedit')}): This tool sources data from the course tracker t.`);
  console.log(`${chalk.bold.green('Mailed It Test')} (${chalk.bold.blue('npm run mailedit-test')}): This will test MailedIt and send the user a sample homework sheet for analysis before sending.`);
  console.log(`${chalk.bold.green('All')} (${chalk.bold.blue('npm run all')}): This will run GHOST and MailedIt, for a final update on the sheet before sending your students a mail update.`);
  console.log(`${chalk.bold.green('All Test')} (${chalk.bold.blue('npm run all-test')}): This will run GHOST and MailedIt, but not update the spreadsheet or send the mailer. This is useful for confirming your services are working.`);
  console.log(`${chalk.bold.green('Update')} (${chalk.bold.blue('npm run update')}): This will open the CLI to update your cohort and course tracker spreadsheet id.`);
};

manual();