<template>
    <div class="close-button" v-on:click="handleClick()">
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M24 3.08108L20.9189 0L12 8.88649L3.08108 0L0 3.08108L8.88649 12L0 20.9189L3.08108 24L12 15.1135L20.9189 24L24 20.9189L15.1135 12L24 3.08108Z"
                fill="white"
            />
        </svg>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

/** Кнопка закрытия диалога */
@Component
export default class DialogCloseButton extends Vue {
    /** Обработчик нажатия на кнопку */
    private handleClick(): void {
        this.$emit("click");
    }
}
</script>

<style scoped>
div.close-button {
    padding: 30px;
    cursor: pointer;
    display: inline-block;
}
</style>
