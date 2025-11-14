import { contextBridge, ipcRenderer } from "electron";
import { todoService } from "./todoService";
import IElectronService from "src/shared/interfaces/IElectronService";

contextBridge.exposeInMainWorld("electronService", {
    todos:todoService()
} as IElectronService)