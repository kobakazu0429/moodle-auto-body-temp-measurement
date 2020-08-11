import * as path from "path";
import * as dotenv from "dotenv";
import { AutoBodyTempMesument } from "./moodle";
import { uploadGyazo } from "./gyazo";
import { sendToSlack } from "./slack";

dotenv.config();

const username = process.env.username;
const password = process.env.password;

if (!username || !password)
  throw new Error(`username: ${username}, password: ${password}`);

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

  await moodle.gotoAnswerFormPage();

  const filename = `${month}-${date}`;

  await moodle.fillForm();
  await moodle.screenshotElement("#region-main", `${filename}-form`);

  await moodle.answerForm();
  await moodle.screenshotElement("#region-main", `${filename}-answer`);
  await moodle.close();

  const formImgUrl = await uploadGyazo(`${filename}-form.png`);
  const answerImgUrl = await uploadGyazo(`${filename}-answer.png`);

  await sendToSlack({ url: formImgUrl, title: `${filename}-form` });
  await sendToSlack({ url: answerImgUrl, title: `${filename}-answer` });
})();
