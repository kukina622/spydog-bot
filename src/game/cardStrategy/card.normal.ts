import { ICardStrategy } from "./cardStrategy";

export class NormalCard implements ICardStrategy {
  public use(): void {
    throw new Error("Method not implemented.");
  }
}
