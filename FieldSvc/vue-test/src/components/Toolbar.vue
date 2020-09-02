<template>
    <div class="toolbar">
        <slot />
    </div>
</template>

<style scoped>
div.toolbar {
    margin: 0;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
}
</style>
