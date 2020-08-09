import * as playwright from "playwright";

class Moodle {
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  private username: string;
  private password: string;
  public page: playwright.Page;
  public browser: playwright.Browser;

  public async init() {
    this.browser = await playwright["chromium"].launch();
    const context = await this.browser.newContext();
    this.page = await context.newPage();
  }

  public async login() {
    const url = "https://e-mdl.kure-nct.ac.jp/login/index.php";
    await this.page.goto(url);
    await this.page.fill('input[name="username"]', this.username);
    await this.page.fill('input[name="password"]', this.password);
    await this.page.click('input[id="loginbtn"]');
  }

  public async close() {
    await this.browser.close();
  }

  public async scrrenshot(filename: string) {
    await this.page.waitForSelector("#page", { state: "attached" });
    await this.page.screenshot({ path: `${filename}.png`, fullPage: true });
  }
}

export class AutoBodyTempMesument extends Moodle {
  constructor(username: string, password: string) {
    super(username, password);
  }

  public async gotoMesumentPage() {
    const url = "https://e-mdl.kure-nct.ac.jp/course/view.php?id=599";
    await this.page.goto(url);
  }

  public async gotoDailyPage(month: number, date: number) {
    const handle = await this.page.$(`text=${month}/${date}検温`);
    await handle.click();
  }
}
