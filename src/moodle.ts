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
    this.browser = await playwright["chromium"].launch({ headless: true });
    const context = await this.browser.newContext();
    this.page = await context.newPage();

    console.log("Moodle.init: initialized");
  }

  public async login() {
    const url = "https://k-mdl01.kure-nct.ac.jp/login/index.php";
    await this.page.goto(url);
    await this.page.fill('input[name="username"]', this.username);
    await this.page.fill('input[name="password"]', this.password);
    await this.page.click('button[id="loginbtn"]');
    console.log("Moodle.login: logined");
  }

  public async close() {
    await this.browser.close();
    console.log("Moodle.close: closed");
  }

  public async wait() {
    await this.page.waitForSelector("#region-main", { state: "visible" });
  }

  public async screenshot(filename: string) {
    await this.wait();
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

  public async click(element: string) {
    const handle = await this.page.$(element);
    if (handle) {
      await handle.click();
      console.log(`Moodle.click: moved, ${element}`);
    } else {
      console.log(`Moodle.click: moved failed, ${element}`);
    }
  }
}

export class AutoBodyTempMesument extends Moodle {
  constructor(username: string, password: string) {
    super(username, password);
  }

  public async gotoMesumentPage() {
    const url = "https://k-mdl01.kure-nct.ac.jp/course/view.php?id=37";
    await this.page.goto(url);
    console.log("AutoBodyTempMesument.gotoMesumentPage: moved");
  }

  public async gotoDailyPage(month: number, date: number) {
    await this.wait();
    await this.click(`text=${month}/${date}`);
  }

  public async gotoAnswerFormPage() {
    await this.wait();
    await this.click(`text=質問に回答する`);
    console.log("AutoBodyTempMesument.gotoAnswerFormPage: moved");
  }

  public async fillForm() {
    await this.wait();
    await this.page.check("text=なし（37.5度未満）");
    await this.page.check("text=なし（他県へ移動しない）");
    console.log("AutoBodyTempMesument.fillForm: done");
  }

  public async answerForm() {
    await this.click(`input[name=savevalues]`);
    console.log("AutoBodyTempMesument.answerForm: done");
  }
}
