import { contextBridge, ipcRenderer } from 'electron';

const allowedChannels = {
  invoke: new Set(['app:get-version', 'dialog:open-file', 'window:print']),
};

function invoke(channel) {
  if (!allowedChannels.invoke.has(channel)) {
    throw new Error(`IPC channel not allowed: ${channel}`);
  }
  return ipcRenderer.invoke(channel);
}

contextBridge.exposeInMainWorld('salonDesktop', {
  getVersion: () => invoke('app:get-version'),
  openFile: () => invoke('dialog:open-file'),
  print: () => invoke('window:print'),
});
