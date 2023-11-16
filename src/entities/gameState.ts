import { Entity, Column, PrimaryColumn } from "typeorm";

export enum State {
  PENDING = "pending",
  STARTING = "starting",
  PAUSE = "pause"
}

@Entity()
export class gameState {
  @PrimaryColumn({
    type: "enum",
    enum: State,
    default: State.PENDING
  })
  state: State;

  @Column({
    type: "varchar",
    length: 10
  })
  description: string;

  constructor(param: gameState = {} as gameState) {
    const { state, description } = param;
    this.state = state;
    this.description = description;
  }
}
