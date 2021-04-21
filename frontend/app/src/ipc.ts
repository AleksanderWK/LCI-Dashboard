let ipc: any = null;
if (window.require != null) {
    const electron = window.require("electron");
    ipc = electron.ipcRenderer;
}

function ipcSendEvent(event: string): void {
    if (ipc != null) {
        ipc.send(event);
    }
}

export function ipcSend(event: string, data: any): void {
    if (ipc != null) {
        ipc.send(event, data);
    }
}

export function ipcOn(event: string, callback: (event: any, data: any) => void): void {
    if (ipc != null) {
        ipc.on(event, (event: any, data: any) => {
            callback(event, data);
        });
    }
}

export function ipcRemoveAllListeners(event: string): void {
    if (ipc != null) {
        ipc.removeAllListeners(event);
    }
}

export function ipcOnce(event: string, callback: (event: any, data: any) => void): void {
    if (ipc != null) {
        ipc.once(event, (event: any, data: any) => {
            callback(event, data);
        });
    }
}

export function ipcGet<T>(message: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        ipcSendEvent(message);
        ipcOnce(message + "-reply", (event: any, data: T) => {
            resolve(data);
        });
    });
}

export async function ipcInvoke<T>(event: string, data: any): Promise<T> {
    return ipc.invoke(event, data).then((result: any) => {
        return result;
    });
}

export default ipc;
