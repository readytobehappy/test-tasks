<template>
    <button class="dialog-button" v-on:click="handleClick()">
        <slot></slot>
    </button>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

/** Кнопка диалога */
@Component
export default class DialogButton extends Vue {
    /** Обработчик нажатия на кнопку */
    private handleClick(): void {
        this.$emit("click");
    }
}
</script>

<style scoped>
button.dialog-button {
    margin: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    cursor: pointer;
    display: inline-block;
    font-size: 11px;
    border: none;
    background-color: #66cc66;
    text-transform: uppercase;
    color: #ffffff;
}

button.dialog-button:focus {
    outline: none;
}
</style>
