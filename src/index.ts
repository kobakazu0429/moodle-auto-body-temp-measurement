import * as path from "path";
import * as dotenv from "dotenv";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { AutoBodyTempMesument } from "./moodle";
import { uploadGyazo } from "./gyazo";
import { sendToSlack } from "./slack";

dotenv.config();

const { USERNAME, PASSWORD } = process.env;

if (!USERNAME || !PASSWORD)
  throw new Error(`USERNAME: ${USERNAME}, PASSWORD: ${PASSWORD}`);

dayjs.locale("ja");
const today = dayjs();
const month = today.month() + 1;
const date = today.date();

if (month !== 8) process.exit();

(async () => {
  const moodle = new AutoBodyTempMesument(USERNAME, PASSWORD);
  await moodle.init();
  await moodle.login();
  await moodle.gotoMesumentPage();
  await moodle.gotoDailyPage(month, date);

  await moodle.gotoAnswerFormPage();

  const filename = `${month}-${date}`;

  await moodle.fillForm();
  await moodle.screenshotElement("#region-main", `${filename}-form`);

  await moodle.page.waitForTimeout(500);
  await moodle.answerForm();
  await moodle.page.waitForTimeout(2000);
  await moodle.screenshotElement("#region-main", `${filename}-answer`);
  await moodle.close();

  const formImgUrl = await uploadGyazo(`${filename}-form.png`);
  const answerImgUrl = await uploadGyazo(`${filename}-answer.png`);

  await sendToSlack({ url: formImgUrl, title: `${filename}-form` });
  await sendToSlack({ url: answerImgUrl, title: `${filename}-answer` });
})();
