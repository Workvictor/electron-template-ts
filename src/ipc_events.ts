import { EVENT_NAME } from './enums';

export class QuitGameEvent extends CustomEvent<null> {
  constructor() {
    super(EVENT_NAME.$game_quit);
  }
}

declare global {
  interface WindowEventMap {
    [EVENT_NAME.$game_quit]: QuitGameEvent;
  }
}
