import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";

export class CustomWorld extends World {
  constructor(options: IWorldOptions) {
    super(options);
  }

  async logMessage(message: string) {
    await this.attach(message, "text/plain");
    console.log("[LOG]:", message);
  }
}

setWorldConstructor(CustomWorld);
