<template>
  <div class="list-container">
    <Card v-for="value in todos" :todo="value"/>
  </div>
  <AddTodoButton/>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Card from '../components/Card.vue';
import { useTodos } from '../composables/todos';
import AddTodoButton from '../components/AddTodoButton.vue';

const {todos, fetchTodos} = useTodos();

onMounted(async () => {
  fetchTodos();
});
</script>

<style scoped>

.list-container {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  gap: 1rem;
  padding: 1rem;
  max-width: 75%;
}

</style>