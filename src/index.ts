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

  const filename = `${month}-${date}`;
  await moodle.screenshotElement("#region-main", filename);
  await moodle.close();

  const imgPath = `${filename}.png`;

  const url = await uploadGyazo(imgPath, filename);

  await sendToSlack({ url, title: filename });
})();
