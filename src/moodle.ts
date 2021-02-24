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
    const url = "https://e-mdl.kure-nct.ac.jp/course/view.php?id=599";
    await this.page.goto(url);
    console.log("AutoBodyTempMesument.gotoMesumentPage: moved");
  }

  public async gotoDailyPage(month: number, date: number) {
    await this.wait();
    await this.click(`text=${month}/${date}検温`);
  }

  public async gotoAnswerFormPage() {
    await this.wait();
    const anchorTags = await this.page.$$("a");

    return new Promise((resolve: (v: void) => void) => {
      anchorTags.forEach(async (a) => {
        const t = await a.textContent();
        const target = t && t.startsWith("質問");
        if (target) {
          await a.click();
          console.log("AutoBodyTempMesument.gotoAnswerFormPage: moved");
          resolve();
        }
      });
    });
  }

  public async fillForm() {
    await this.wait();
    await this.page.selectOption(
      "//html/body/div[3]/div/div/div/section/div/div[1]/form/div[2]/div[1]/div/div[2]/div/select",
      "1"
    );
    await this.page.selectOption(
      "//html/body/div[3]/div/div/div/section/div/div[1]/form/div[2]/div[3]/div/div[2]/div/select",
      "1"
    );
    console.log("AutoBodyTempMesument.fillForm: done");
  }

  public async answerForm() {
    await this.click(`input[name=savevalues]`);
    console.log("AutoBodyTempMesument.answerForm: done");
  }
}
