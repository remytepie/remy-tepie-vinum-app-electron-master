<template>
    <button class="add-todo" @click="handleClick">Ajouter Vin</button>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleClick = () => {
    router.push('/add-todo')
}
</script>

<style>
.add-todo {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: #3b82f6;
    border: none;
    color: white;
    padding: 1rem 2rem;
    border-radius: .5rem;
    font-size: 1rem;
    font-weight: 600;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, .2);
    cursor: pointer;
    transition: ease-in-out .2s;
}

.add-todo:hover {
    transform: translateY(-5px);
}
</style>
