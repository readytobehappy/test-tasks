<template>
    <div class="quality-switch">
        <div v-for="button in getButtons()" 
             :key="button.key"
             :class="button.className" 
             v-on:click="button.click">
            {{ button.title }}
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { T } from "@/store/Locale";

/** Данные кнопки для отображения */
interface ButtonData {
    /** Ключ кнопки */
    key: number;
    /** Текст кнопки */
    title: string;
    /** Имя класса кнопки */
    className: string;
    /** Обработчик события выбора кнопки */
    click: (index: number) => void;
}

/** Панель с кнопками (отл/уд/пл) */
@Component
export default class QualitySwitch extends Vue {
    /** Индекс выделенной кнопки */
    @Prop() private activeIndex!: number;

    /** Возвращает список кнопок */
    private getButtons(): ButtonData[] {
        const classes = ["first", "middle", "last"];
        const { activeIndex, handleClick } = this;

        return [T.QUALITY_EXCELLENT, T.QUALITY_SATISFACTORILY, T.QUALITY_BADLY]
            .map((title, i) => {
                return {
                    title,
                    key: i,
                    className: ["item", classes[i], activeIndex === i ? "active" : ""].join(" "),
                    click: handleClick.bind(this, i)
                };
            });
    }

    /**
    * Обрабатывает нажатие на кнопку
    * @param index Индекс кнопки
    */
    private handleClick(index: number): void {
        if (this.activeIndex === index)
            return;
        this.activeIndex = index;
        this.$forceUpdate();
        this.$emit("change", index);
    }
}
</script>

<style scoped>
div.quality-switch {
    margin: 0;
    display: inline-block;
    user-select: none;
}

div.quality-switch div.item {
    background-color: #f9f9f9;
    height: 40px;
    width: 97px;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    font-size: 11px;
    text-transform: uppercase;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

div.quality-switch div.item.first {
    border-radius: 20px 0 0 20px;
}

div.quality-switch div.item.middle {
    border-left: 1px solid #eff0f0;
    border-right: 1px solid #eff0f0;
}

div.quality-switch div.item.last {
    border-radius: 0 20px 20px 0;
}

div.quality-switch div.item.first.active {
    background-color: #66cc66;
    color: #ffffff;
    cursor: default;
}

div.quality-switch div.item.middle.active {
    background-color: #ffe06d;
    color: #000000;
    cursor: default;
}

div.quality-switch div.item.last.active {
    background-color: #ff7360;
    color: #ffffff;
    cursor: default;
}
</style>
