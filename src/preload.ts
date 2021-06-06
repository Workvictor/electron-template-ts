import electron from 'electron';
import { EVENT_NAME } from './enums';

window.addEventListener(EVENT_NAME.$game_quit, () => {
  electron.ipcRenderer.send('api-quit');
});
