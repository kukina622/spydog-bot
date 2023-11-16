import { ICardStrategy } from "./cardStrategy";

export class CueCard implements ICardStrategy {
  public use(): void {
    throw new Error("Method not implemented.");
  }
}
