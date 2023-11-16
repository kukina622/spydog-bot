import { ICardStrategy } from "./cardStrategy";

export class SpyCard implements ICardStrategy {
  public use(): void {
    throw new Error("Method not implemented.");
  }
}
