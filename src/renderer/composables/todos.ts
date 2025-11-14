import Todo from "src/shared/todo";
import { ref } from "vue";

const todos = ref<Todo[]>([]);

export function useTodos() {
    const fetchTodos = async () => {
        todos.value = await window.electronService.todos.getTodos();
    };

    const addTodo = async (todo: Todo) => {
        await window.electronService.todos.addTodo(todo);
        await fetchTodos();
    }

    const deleteTodo = async (id: number) => {
        await window.electronService.todos.deleteTodo(id);
        await fetchTodos();
    };

    const toggleTodo = async (id: number) => {
        await window.electronService.todos.toggleTodo(id);
        await fetchTodos();
    };

    return  {
        todos,
        addTodo,
        fetchTodos,
        deleteTodo,
        toggleTodo
    }
}