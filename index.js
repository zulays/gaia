/* eslint-disable no-console */
const { prompt, Separator } = require("inquirer");
const feedback = require("./feedback");
const ghost = require("./ghost");
const mailer = require("./mailer");
const projects = require("./projects");
const random = require("./random");
const setup = require("./setup");
const manual = require("./setup/manual");
const update = require("./setup/update");
const { filterEnrolled } = require("./helpers");
const provideStudents = require("./setup/students");

const main = async () => {
  try {
    if (!process.env.TOKEN) {
      setup();
    } else {
      const { choice } = await prompt([
        {
          message: "Welcome to GAIA! What would you like to run today?",
          type: "list",
          name: "choice",
          choices: [
            "ghost",
            "mailedit",
            "random",
            new Separator(),
            "projects",
            "feedback",
            new Separator(),
            "setup",
            "update",
            "help",
            "status",
            new Separator(),
          ],
        },
      ]);
      let test;
      if (["ghost", "mailedit", "feedback"].includes(choice)) {
        test = (
          await prompt([
            {
              type: "confirm",
              name: "test",
              message: "Is this a test run?",
              default: true,
            },
          ])
        ).test;
      }
      const { auth, students } = await provideStudents();
      switch (choice) {
        case "setup":
          setup();
          break;
        case "status":
          console.table(filterEnrolled(students));
          break;
        case "update":
          update();
          break;
        case "help":
          manual();
          break;
        case "random":
          await random(students);
          break;
        case "ghost":
          await ghost(auth, students, test);
          break;
        case "mailedit":
          await mailer(students, test);
          break;
        case "projects":
          await projects(auth, students);
          break;
        case "feedback":
          await feedback(auth, test);
          break;
        default:
          console.table(filterEnrolled(students));
      }
    }
  } catch (e) {
    if (e.message === "(intermediate value) is not iterable") {
      console.log("Readline is waiting (don't worry).");
    } else {
      console.log(e.message);
    }
  }
};

main();
