import * as playwright from "playwright";

class Moodle {
  private username: string;
  private password: string;
  // @ts-expect-error
  public page: playwright.Page;
  // @ts-expect-error
  public browser: playwright.Browser;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  public async init() {
    this.browser = await playwright["chromium"].launch();
    const context = await this.browser.newContext();
    this.page = await context.newPage();

    console.log("Moodle.init: initialized");
  }

  public async login() {
    const url = "https://e-mdl.kure-nct.ac.jp/login/index.php";
    await this.page.goto(url);
    await this.page.fill('input[name="username"]', this.username);
    await this.page.fill('input[name="password"]', this.password);
    await this.page.click('input[id="loginbtn"]');
    console.log("Moodle.login: logined");
  }

  public async close() {
    await this.browser.close();
    console.log("Moodle.close: closed");
  }

  public async screenshot(filename: string) {
    await this.page.waitForSelector("#page", { state: "attached" });
    await this.page.screenshot({ path: `${filename}.png`, fullPage: true });
    console.log("Moodle.screenshot: screenshoted");
  }

  public async screenshotElement(element: string, filename: string) {
    await this.page.waitForSelector(element, { state: "attached" });
    const detectedElement = await this.page.$(element);
    if (detectedElement) {
      await detectedElement.screenshot({ path: `${filename}.png` });
      console.log(`Moodle.screenshotElement: screenshoted, ${element}`);
    } else {
      console.log(`Moodle.screenshotElement: screenshot failed, ${element}`);
    }
  }
}

export class AutoBodyTempMesument extends Moodle {
  constructor(username: string, password: string) {
    super(username, password);
  }

  public async gotoMesumentPage() {
    const url = "https://e-mdl.kure-nct.ac.jp/course/view.php?id=599";
    await this.page.goto(url);
    console.log("AutoBodyTempMesument.gotoMesumentPage: moved");
  }

  public async gotoDailyPage(month: number, date: number) {
    const handle = await this.page.$(`text=${month}/${date}検温`);
    if (handle) {
      await handle.click();
      console.log(
        `AutoBodyTempMesument.gotoDailyPage: moved, ${month}/${date}`
      );
    } else {
      console.log(
        `AutoBodyTempMesument.gotoDailyPage: moved failed, ${month}/${date}`
      );
    }
  }
}
