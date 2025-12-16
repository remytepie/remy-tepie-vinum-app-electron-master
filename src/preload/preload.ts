import { contextBridge, ipcRenderer } from "electron";
import IElectronService from "src/shared/interfaces/IElectronService";
import { vinService } from "./vinService";
import { fournisseurService } from "./fournisseurService";
import { mouvementService } from "./mouvementService";
import { emplacementService } from "./emplacementService";

contextBridge.exposeInMainWorld("electronService", {
    vins: vinService(),
    fournisseurs: fournisseurService(),
    mouvements: mouvementService(),
    emplacements: emplacementService(),
} as IElectronService)
