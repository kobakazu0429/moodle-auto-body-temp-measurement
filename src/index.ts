import { AutoBodyTempMesument } from "./moodle";

const username = process.env.username;
const password = process.env.password;

const today = new Date();
const month = today.getMonth() + 1;
const date = today.getDate();

if (month !== 8) process.exit();

(async () => {
  const moodle = new AutoBodyTempMesument(username, password);
  await moodle.init();
  await moodle.login();
  await moodle.gotoMesumentPage();
  await moodle.gotoDailyPage(month, date);
  await moodle.scrrenshot(`${month}-${date}`);
  await moodle.close();
})();
