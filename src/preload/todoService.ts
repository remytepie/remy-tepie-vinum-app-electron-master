import { ipcRenderer } from "electron"
import ITodoService from "src/shared/interfaces/ITodoService"
import Todo from "src/shared/todo"

export function todoService(): ITodoService {
    return { 
        getTodos: () => ipcRenderer.invoke("todoRepository:getTodos"),
        addTodo: (todo: Todo) => ipcRenderer.invoke("todoRepository:addTodo", todo),
        deleteTodo: (id: number) => ipcRenderer.invoke("todoRepository:deleteTodo", id),
        toggleTodo: (id: number) => ipcRenderer.invoke("todoRepository:toggleTodo", id)
    }
}