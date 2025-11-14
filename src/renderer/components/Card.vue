<template>
    <div class="card">
        <div>
            <input class="checkbox" type="checkbox" :checked="props.todo.isFinished"
                @click="toggleTodo(props.todo.id)" />
            <div class="card-info">
                <span class="title" :class="{ done: props.todo.isFinished }">{{ props.todo.title }}</span>
                <div v-if="props.todo.producer || props.todo.region" class="details">
                    <span v-if="props.todo.producer" class="detail">
                        <span class="detail-label">Producteur</span>
                        <span>{{ props.todo.producer }}</span>
                    </span>
                    <span v-if="props.todo.region" class="detail">
                        <span class="detail-label">Région</span>
                        <span>{{ props.todo.region }}</span>
                    </span>
                </div>
                <span v-if="props.todo.description" class="description">{{ props.todo.description }}</span>
            </div>
            <button class="delete-button" @click="handleDelete">Delete</button>
        </div>

        <div class="tags">
            <Tag v-for="tag in props.todo.tags" :key="tag" :name="tag" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import Todo from 'src/shared/todo';
import { useTodos } from '../composables/todos';
import Tag from './Tag.vue';

interface Props {
    todo: Todo
}

const props = defineProps<Props>();
const { deleteTodo, toggleTodo } = useTodos();

const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this todo?")) {
        await deleteTodo(props.todo.id);
    }
};
</script>

<style>
.card {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    box-shadow: 10px 10px 30px rgba(0, 0, 0, .2);
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid #e2e8f0;
    border-radius: .5rem;
    transition: ease-in-out .2s;
}

.card > div:first-child {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-grow: 1;
}

.card > .tags {
    margin-top: 1rem;
    margin-left: 4rem;
    display: flex;
    flex-wrap: wrap;
    gap: .5rem;
}

.card-info {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    color: #334155;
    flex-grow: 1;
}

.card-info .title {
    font-size: 1.1rem;
    font-weight: 600;
}

.details {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    font-size: .9rem;
}

.detail {
    display: flex;
    flex-direction: column;
    gap: .2rem;
}

.detail-label {
    font-size: .75rem;
    text-transform: uppercase;
    color: #94a3b8;
    letter-spacing: .05em;
}

.card-info .description {
    font-weight: 400;
}

.card:hover {
    transform: translateY(-5px);
}

.delete-button {
    background: #ef4444;
    border: none;
    color: white;
    padding: .5rem 1rem;
    border-radius: .375rem;
    font-weight: 600;
    cursor: pointer;
}

.checkbox {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 1.5rem;
    cursor: pointer;
    align-self: center;
}

.done {
    text-decoration: line-through;
    color: #94a3b8;
}
</style>
