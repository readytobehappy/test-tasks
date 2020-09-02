<template>
    <button :class="getContainerClassName()" v-on:click="handleClick()">
        <img v-if="getHasIcon()" :src="iconSrc" />
        <slot></slot>
    </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

/** Кнопка панели инструментов с иконой */
@Component
export default class ToolbarButton extends Vue {
    /** Имя css-класса кнопки */
    @Prop() private className!: string;
    /** Ссылка на икону */
    @Prop() private iconSrc!: string;

    /** Возвращает флаг наличия иконы */
    private getHasIcon(): boolean {
        return !!this.iconSrc;
    }

    /** Возвращает имя класса кнопки */
    private getContainerClassName(): string {
        const { className } = this;
        if (className)
            return ["toolbar-button", ...className.split(" ")].join(" ");
        else return "toolbar-button";
    }

    /** Обрабатывает нажатие на кнопку */
    private handleClick(): void {
        this.$emit("click");
    }
}
</script>

<style scoped>
div.toolbar button.toolbar-button {
    margin: 8px;
    display: inline-block;
    min-width: 40px;
    background-color: #ffffff;
    padding: 10px 14px;
    line-height: 18px;
    border: 0;
    border-radius: 20px;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.1);
    font-size: 13px;
    color: #333333;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
}

div.toolbar button.toolbar-button:focus {
    outline: none;
}

div.toolbar button.toolbar-button img {
    float: left;
    margin: 0 8px 0 0;
}

div.toolbar button.toolbar-button.right {
    align-self: flex-end;
}
</style>
