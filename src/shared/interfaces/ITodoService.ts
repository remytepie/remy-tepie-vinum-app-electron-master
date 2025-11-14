import Todo from "../todo";

export default interface ITodoService {
    getTodos:() => Promise<Todo[]>
    addTodo:(todo: Todo) => Promise<void>
    deleteTodo:(id: number) => Promise<void>
    toggleTodo:(id: number) => Promise<void>
}