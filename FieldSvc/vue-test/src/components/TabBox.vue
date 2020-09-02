<template>
    <div class="tab-box">
        <button v-for="tab in getTabs()"
            :key="tab.key"
            :class="tab.className" 
            v-on:click="tab.click">
            {{ tab.title }}
        </button>
    </div>
</template>

<script lang="ts">
import { Component, Prop,Vue } from "vue-property-decorator";

/** Данные вкладки для отображения */
interface TabData {
    /** Ключ вкладки */
    key: number;
    /** Заголовок вкладки */
    title: string;
    /** Имя класса вкладки */
    className: string;
    /** Обработчик события выбора вкладки */
    click: (index: number) => void;
}

/** Панель с вкладками */
@Component
export default class TabBox extends Vue {
    /** Элементы вкладок */
    @Prop() private items!: string[];
    /** Индекс выделенного элемента */
    @Prop() private activeIndex!: number;

    /** Возвращает список элементов */
    private getTabs(): TabData[] {
        const { activeIndex, handleClick } = this;
        return this.items.map((title, i) => {
            return {
                key: i,
                title,
                className: "tab-item" + (i === activeIndex ? " active" : ""),
                click: handleClick.bind(this, i)
            };
        });
    }

    /**
     * Обрабатывает нажатие на вкладку
     * @param index
     */
    private handleClick(index: number): void {
        if (index !== this.activeIndex)
            this.$emit("click", index);
    }
}
</script>

<style scoped>
div.tab-box {
    margin: 0;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
}
div.tab-box button.tab-item {
    margin: 0 20px 0 0;
    padding: 0;
    display: inline-block;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: uppercase;
    font-size: 11px;
    font-weight: bold;
    color: #333333;
    background: none;
    border: none;
    cursor: pointer;
}
div.tab-box button.tab-item:focus {
    outline: none;
}
div.tab-box button.tab-item.active {
    color: #3399ff;
    cursor: default;
}
</style>
