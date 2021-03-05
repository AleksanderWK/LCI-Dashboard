const electron = window.require("electron");
const ipc = electron.ipcRenderer;

export function ipcGet<T>(message: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        ipc.send(message);
        ipc.once(message + "-reply", (event: any, data: T) => {
            resolve(data);
        });
    });
}

export default ipc;
