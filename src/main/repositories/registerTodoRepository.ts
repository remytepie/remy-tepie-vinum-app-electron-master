import { ipcMain } from "electron";
import { TodoRepository } from "./todoRepository";
import Todo from "src/shared/todo";

export function registerTodoRepository() {
  const todoRepository = new TodoRepository();

  ipcMain.handle("todoRepository:getTodos", (e, a) => {
    return todoRepository.getTodos();
  });

  ipcMain.handle("todoRepository:addTodo", (e, todo: Todo) => {
    return todoRepository.addTodo(todo);
  });

  ipcMain.handle("todoRepository:deleteTodo", (e, id: number) => {
    return todoRepository.deleteTodo(id);
  });

  ipcMain.handle("todoRepository:toggleTodo", (e, id: number) => {
    return todoRepository.toggleTodo(id);
  });
}
