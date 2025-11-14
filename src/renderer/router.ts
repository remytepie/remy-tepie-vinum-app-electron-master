import { createRouter, createMemoryHistory } from "vue-router";

import Home from "./pages/Home.vue";
import AddTodoForm from "./pages/AddTodoForm.vue";

const routes = [
    { path: '/', component: Home},
    { path: '/add-todo', component: AddTodoForm}
]

export const router = createRouter({routes, history: createMemoryHistory()});