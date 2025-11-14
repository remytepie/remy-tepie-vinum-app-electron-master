import ITodoService from "./ITodoService";

export default interface IElectronService {
    todos: ITodoService
}

declare global {
    interface Window {
        electronService: IElectronService
    }
}