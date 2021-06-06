type ChannelApiString = 'api-quit';

declare namespace Electron {
  interface IpcRenderer {
    send(channel: ChannelApiString, ...args: any[]): void;
  }
  interface IpcMain {
    on(channel: ChannelApiString, listener: (event: IpcMainEvent, ...args: any[]) => void): this;
  }
}
