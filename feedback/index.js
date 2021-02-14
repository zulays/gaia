// Code originally from Andre Pato, @anpato
const fs = require("fs");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const inquirer = require("inquirer");
const path = require("path");

require("dotenv").config();

const fillTemplate = (student, unit, name, template) =>
  template
    .replace("[FIRSTNAME]", student.firstName)
    .replace("[UNIT]", unit)
    .replace("[GIST]", student.gist)
    .replace("[INSTRUCTORNAME]", name);

const mailer = async (students, unit, config, test) => {
  try {
    const template = fs.readFileSync(__dirname + "/template.txt", "utf8");
    let sent = 0;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      pool: true,
      secure: true,
      auth: {
        user: config.config.emailUser,
        pass: config.config.emailPass,
      },
    });
    if (students) {
      if (test) {
        await transporter.sendMail({
          from: config.config.emailUser,
          to: config.config.emailUser,
          subject: "Test Project Feedback",
          text: fillTemplate(students[0], unit, config.config.name, template),
        });
        console.log(
          `Sending test email for ${students[0].name} to ${config.config.emailUser}.`
        );
        transporter.close();
      } else {
        await students.forEach(async (student) => {
          await transporter.sendMail({
            from: config.config.emailUser,
            to: student.email,
            subject: "Project Feedback",
            text: fillTemplate(student, unit, config.config.name, template),
          });
          console.log(`Sending email to ${student.name} at ${student.email}.`);
          sent += 1;
          if (sent === students.length) {
            transporter.close();
            console.log("All Messages Sent");
          }
        });
      }
    }
    console.log("Feedback is complete!");
  } catch (error) {
    console.log(error);
  }
};

const buildStudents = async (auth, unit, config) => {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId =
      config.cohorts[config.config.cohort][`project${unit}Tracker`];
    const studentsData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Copy of Project Completions!A2:F50",
    });
    const actualStudents = studentsData.data.values
      .filter((val) => val[0] !== "")
      .map((stu) => ({
        name: `${stu[0]} ${stu[1]}`,
        firstName: stu[0],
        email: stu[4],
        gist: stu[5],
      }));
    return actualStudents;
  } catch (e) {
    console.log(e);
  }
};

const deliverFeedback = async (auth, test) => {
  const configPath = path.resolve(__dirname, "../config.json");
  const config = JSON.parse(fs.readFileSync(configPath));
  const results = await inquirer.prompt([
    {
      type: "list",
      choices: [
        {
          name: "Unit 1",
          value: 1,
        },
        {
          name: "Unit 2",
          value: 2,
        },
        {
          name: "Unit 3",
          value: 3,
        },
        {
          name: "Unit 4",
          value: 4,
        },
      ],
      default: 1,
      name: "unit",
      message: "What unit is this project for?",
    },
    {
      message: `Please enter the name of your cohort, or press enter for your current cohort!`,
      type: "input",
      name: "cohort",
      default: config.config.cohort,
    },
  ]);
  const students = await buildStudents(auth, results.unit, config);
  await mailer(students, results.unit, config, test);
};

module.exports = deliverFeedback;
