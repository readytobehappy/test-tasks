<template>
    <div class="add-operation">
        <div class="header">
            <h1>{{ getTitle() }}</h1>
        </div>
        <div class="field">
            <svg
                width="66"
                height="40"
                viewBox="0 0 66 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g clip-path="url(#clip0)">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.3762 7.10742L32.2373 6.52734L32.9102 33.5312L7.24609 33.2422L7.3762 7.10742Z"
                        fill="#73FF82"
                        stroke="#66CC66"
                    />
                </g>
                <defs>
                    <clipPath id="clip0">
                        <rect width="66" height="40" fill="white" />
                    </clipPath>
                </defs>
            </svg>
            <div class="field-title">{{ getFieldText() }}</div>
            <div class="field-id">{{ getFieldId() }}</div>
        </div>
        <div class="culture">
            <img src="@/assets/culture.svg" />
            <div class="culture-title">{{ getCultureTitle() }}</div>
            <div class="culture-id">{{ getCultureId() }}</div>
        </div>
        <div class="operation">
            <label for="operation">{{ getOperationText() }}</label>
            <div class="select-group">
                <select name="operation" v-on:change="handleOperationChange">
                    <option
                        v-for="operation in getOperations()"
                        :key="operation.value"
                        :value="operation.value"
                        :selected="operation.selected"
                    >
                        {{ operation.name }}
                    </option>
                </select>
            </div>
        </div>
        <div class="date">
            <label>{{ getDateText() }}</label>
            <div class="textbox-group">
                <input
                    type="text"
                    :placeholder="getDatePlaceholder()"
                    :value="getDateValue()"
                    v-on:change="handleDateChange"
                />
            </div>
            <img src="@/assets/calendar.svg" />
        </div>
        <div class="quantity">
            <label>{{ getQuantityText() }}</label>
            <div class="textbox-group">
                <input
                    type="text"
                    :placeholder="getQuantityPlaceholder()"
                    :value="getQuantityValue()"
                    v-on:change="handleQuantityChange"
                />
            </div>
        </div>
        <div class="description">
            <textarea
                :placeholder="getCommentText()"
                :value="getNotesValue()"
                v-on:change="handleNotesChange"
            />
        </div>
        <div class="quality">
            <label>{{ getQualityText() }}</label>
            <div class="quality-group">
                <QualitySwitch :activeIndex="quality"
                    v-on:change="handleQualityChange"
                ></QualitySwitch>
            </div>
        </div>
        <div class="button">
            <DialogButton v-on:click="handleAddClick">
                {{ getAddOperationText() }}
            </DialogButton>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import QualitySwitch from "@/components/QualitySwitch.vue";
import DialogButton from "@/components/DialogButton.vue";
import Locale, { T } from "@/store/Locale";
import Operation, { OperationType, Assessment } from "../models/Operation";
import moment from "moment";

/** Данные операций */
interface OperationData {
    /** Название операции */
    name: string;
    /** Индекс операции */
    value: number;
    /** Флаг активности */
    selected: boolean;
}

/** Диалог добавления/изменения операции */
@Component({
    components: {
        QualitySwitch,
        DialogButton
    }
})
export default class AddOrEditOperation extends Vue {
    /** Строки с типами операций */
    private operationTypeNames = [
        T.CHOOSE_OPERATION,
        T.PLOWING,
        T.BOWLING,
        T.FERTILIZATION,
        T.WATERING,
        T.RIGGING,
        T.HARVESTING
    ];
    /** Типы операций */
    private operationTypes = [
        OperationType.PLOWING,
        OperationType.BOWLING,
        OperationType.FERTILIZATION,
        OperationType.WATERING,
        OperationType.RIGGING,
        OperationType.HARVESTING
    ];
    /** Типы качества */
    private assessmentTypes = [
        Assessment.EXCELLENT,
        Assessment.SATISFACTORILY,
        Assessment.BADLY
    ];

    /** Выбранная операция */
    @Prop() private operation!: Operation;
    /** Индекс операции */
    private operationTypeIndex = -1;
    /** Дата операции */
    private date = new Date();
    /** Площадь операции */
    private quantity = 0;
    /** Комментарии операции */
    private notes = "";
    /** Качество операции */
    private quality = 0;

    /** Обработчик события на изменение операции */
    @Watch("operation", { immediate: true })
    private operationChanged(): void {
        const { operation } = this;
        if (operation) {
            this.operationTypeIndex = this.operationTypes.indexOf(operation.type as number);
            const { date } = operation;
            this.date = new Date(date.year, date.month - 1, date.day);
            this.quantity = operation.area;
            this.notes = operation.comment || "";
            this.quality = this.assessmentTypes.indexOf(operation.assessment || -1);
        } else {
            this.operationTypeIndex = -1;
            this.date = new Date();
            this.quantity = 0;
            this.notes = "";
            this.quality = 0;
        }
    }

    /** Возвращает список операций */
    private getOperations(): OperationData[] {
        const { operationTypeIndex } = this;
        return this.operationTypeNames.map((name, i) => {
            return {
                name,
                value: i - 1,
                selected: (i - 1) === operationTypeIndex
            };
        });
    }

    /** Возвращает строковое значение даты */
    private getDateValue(): string {
        return this.date.toLocaleDateString(Locale.Code);
    }

    /** Возвращает строковое значение площади */
    private getQuantityValue(): string {
        return this.quantity + "";
    }

    /** Возвращает строковое значение комментария операции */
    private getNotesValue(): string {
        return this.notes;
    }

    /** Возвращает заголовок диалога */
    private getTitle(): string {
        return this.operation ? T.EDIT_OPERATION : T.ADD_OPERATION;
    }

    /** Возвращает текст поля */
    private getFieldText(): string {
        return T.FIELD_TEXT;
    }

    /** Возвращает идентификатор поля */
    private getFieldId(): string {
        return this.$route.params.field_id;
    }

    /** Возвращает название культуры */
    private getCultureTitle(): string {
        return T.WINTER_WHEAT;
    }

    /** Возвращает сорт культуры */
    private getCultureId(): string {
        return T.WINTER_WHEAT_KIND;
    }

    /** Возвращает текст "Операция" */
    private getOperationText(): string {
        return T.OPERATION_TEXT;
    }

    /** Возвращает текст "Дата проведения" */
    private getDateText(): string {
        return T.DATE_TEXT;
    }

    /** Возвращает текст "Количество га к обработке" */
    private getQuantityText(): string {
        return T.QUANTITY_TEXT;
    }

    /** Возвращает текст "Комментарии" */
    private getCommentText(): string {
        return T.NOTES_TEXT;
    }

    /** Возвращает текст "Качество" */
    private getQualityText(): string {
        return T.QUALITY_TEXT;
    }

    /** Возвращает текст для кнопки */
    private getAddOperationText(): string {
        return this.operation ? T.EDIT_OPERATION_TEXT : T.ADD_OPERATION_TEXT;
    }

    /** Возвращает текст по умолчанию для даты */
    private getDatePlaceholder(): string {
        return T.DATE_PLACEHOLDER;
    }

    /** Возвращает текст по умолчанию для количества */
    private getQuantityPlaceholder(): string {
        return T.QUANTITY_PLACEHOLDER;
    }

    /**
     * Обработчик события на смену даты
     * @param e Событие
     */
    private handleDateChange(e: Event): void {
        const input = e.target as HTMLInputElement;
        try {
            console.log(12);
            const date = moment(input.value, "L", Locale.Code).toDate();
            if (date.toDateString().toLowerCase().indexOf("invalid") >= 0)
                this.date = new Date();
            else
                this.date = date;
            
        } catch {
            this.date = new Date();
        }
    }

    /**
     * Обработчик события на смену количества
     * @param e Событие
     */
    private handleQuantityChange(e: Event): void {
        const input = e.target as HTMLInputElement;
        const quantity = +input.value;
        if (!isNaN(quantity)) this.quantity = quantity;
    }

    /**
     * Обработчик события на смену комментария
     * @param e Событие
     */
    private handleNotesChange(e: Event): void {
        const textArea = e.target as HTMLTextAreaElement;
        this.notes = textArea.value;
    }

    /**
     * Обработчик события на смену типа операции
     * @param e Событие
     */
    private handleOperationChange(e: Event): void {
        const select = e.target as HTMLSelectElement;
        this.operationTypeIndex = +select.options[select.selectedIndex].value;
    }

    /**
     * Обработчик события на смену качества
     * @param e Событие
     */
    private handleQualityChange(index: number): void {
        this.quality = index;
    }

    /**
     * Обработчик события на подтперждение добавления или изменения операции
     * @param e Событие
     */
    private handleAddClick(): void {
        const { date, notes, operation } = this;

        this.$store.dispatch(operation ? "editOperation" : "addOperation", {
            fieldId: this.$route.params.field_id,
            operation: {
                id: operation ? operation.id : null,
                type: Math.max(0, this.operationTypeIndex) as OperationType,
                date: {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate()
                },
                area: Math.min(0, this.quantity),
                comment: notes ? notes : null,
                assessment: this.assessmentTypes[this.quality]
            }
        });
        this.$router.go(-1);
    }
}
</script>

<style scoped>
div.add-operation {
    background-color: #ffffff;
    width: 100%;
    height: 100%;
    overflow: auto;
    display: grid;
    grid-template-rows: 50px 52px 70px 70px 126px 1fr 60px;
    grid-template-columns: 1fr 1fr;
}

div.add-operation div.header {
    grid-row-start: 1;
    grid-row-end: 1;
    grid-column-start: 1;
    grid-column-end: 3;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

div.add-operation div.header h1 {
    text-align: left;
    padding: 0 16px;
    font-size: 21px;
}

div.add-operation div.field {
    grid-row-start: 2;
    grid-row-end: 2;
    grid-column-start: 1;
    grid-column-end: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-top: 1px solid #edeeee;
    border-bottom: 1px solid #edeeee;
    text-align: left;
    position: relative;
}

div.add-operation div.field svg {
    position: relative;
    left: 5px;
    top: 5px;
}

div.add-operation div.field div.field-title {
    display: inline-block;
    position: absolute;
    left: 45px;
    top: 13px;
    font-size: 9px;
    text-transform: uppercase;
}

div.add-operation div.field div.field-id {
    display: inline-block;
    position: absolute;
    left: 45px;
    top: 24px;
    font-size: 15px;
    font-weight: bold;
}

div.add-operation div.culture {
    grid-row-start: 2;
    grid-row-end: 2;
    grid-column-start: 2;
    grid-column-end: 2;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-top: 1px solid #edeeee;
    border-bottom: 1px solid #edeeee;
    text-align: right;
    position: relative;
}

div.add-operation div.culture img {
    position: absolute;
    right: 10px;
    top: 10px;
}

div.add-operation div.culture div.culture-title {
    position: absolute;
    right: 46px;
    top: 9px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

div.add-operation div.culture div.culture-id {
    position: absolute;
    right: 46px;
    top: 31px;
    font-size: 9px;
    text-transform: uppercase;
}

div.add-operation div.operation {
    grid-row-start: 3;
    grid-row-end: 3;
    grid-column-start: 1;
    grid-column-end: 3;
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-align: left;
}

div.add-operation div.operation div.select-group {
    margin: 0 15px;
}

div.add-operation div.operation div.select-group select {
    width: 100%;
    font-size: 13px;
    border: none;
    padding: 0;
    margin: 0;
    color: #333333;
}

div.add-operation div.operation div.select-group select:focus {
    outline: none;
}

div.add-operation div.date {
    grid-row-start: 4;
    grid-row-end: 4;
    grid-column-start: 1;
    grid-column-end: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-align: left;
    position: relative;
}

div.add-operation div.date img {
    position: absolute;
    right: 20px;
    top: 28px;
}

div.add-operation div.quantity {
    grid-row-start: 4;
    grid-row-end: 4;
    grid-column-start: 2;
    grid-column-end: 2;
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-align: left;
}

div.add-operation div.description {
    grid-row-start: 5;
    grid-row-end: 5;
    grid-column-start: 1;
    grid-column-end: 3;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-top: 1px solid #edeeee;
    border-bottom: 1px solid #edeeee;
}

div.add-operation div.description textarea {
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    font-size: 13px;
    border: none;
    padding: 20px;
    margin: 0;
    color: #333333;
    resize: none;
}

div.add-operation div.description textarea::placeholder {
    color: #c7c7cd;
}

div.add-operation div.description textarea:focus {
    outline: none;
}

div.add-operation div.textbox-group {
    margin: 0 18px;
}

div.add-operation div.textbox-group input {
    width: 100%;
    font-size: 18px;
    border: none;
    padding: 0;
    margin: 0;
    color: #333333;
}

div.add-operation div.textbox-group input:focus {
    outline: none;
}

div.add-operation div.quality {
    grid-row-start: 6;
    grid-row-end: 6;
    grid-column-start: 1;
    grid-column-end: 3;
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-align: left;
}

div.add-operation div.quality label {
    font-size: 11px;
    margin: 12px 0 0 20px;
}

div.add-operation div.quality div.quality-group {
    margin: 20px;
}

div.add-operation div.button {
    grid-row-start: 7;
    grid-row-end: 7;
    grid-column-start: 1;
    grid-column-end: 3;
    width: 100%;
    height: 100%;
    overflow: auto;
}

div.add-operation label {
    font-size: 8px;
    text-transform: uppercase;
    margin: 24px 0 0 20px;
    padding: 0;
    display: inline-block;
    color: #333333;
}
</style>
