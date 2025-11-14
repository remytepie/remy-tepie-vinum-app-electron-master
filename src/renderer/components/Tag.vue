<template>
    <span class="tag">{{ name }}</span>
</template>

<script lang="ts" setup>

defineProps<{
    name: string;
}>();
</script>

<style scoped>
.tag {
    display: inline-block;
    background-color: #e0e0e0;
    color: #333;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.875rem;
    margin-right: 4px;
}
</style>