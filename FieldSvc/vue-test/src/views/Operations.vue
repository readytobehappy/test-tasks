<template>
    <div class="operations">
        <div class="page-header"></div>
        <div class="page">
            <Header>
                {{ getTitle() }}
            </Header>
            <div v-if="!isLoading()">
                <Toolbar>
                    <ToolbarField>
                        <TabBox :items="getTabs()" :activeIndex="getActiveTab()" v-on:click="handleTabClick" />
                    </ToolbarField>
                    <ToolbarButton
                        className="right"
                        :iconSrc="require('@/assets/add.svg')"
                        v-on:click="handleTabClick(2)"
                        >{{ getAddOperationText() }}</ToolbarButton
                    >
                </Toolbar>
                <ListBox :headers="getHeaders()" 
                         :data="getData()"
                         v-on:cellClick="handleCellClick"
                         ></ListBox>
            </div>
        </div>
        <div class="dialog" v-if="getIsAddOrEditActive()">
            <div class="dialog-panel">
                <AddOrEditOperation :operation="getOperation()" />
            </div>
            <div class="close-panel" v-on:click="handleCloseClick()">
                <DialogCloseButton
                    v-on:click="handleCloseClick()"
                ></DialogCloseButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@/components/Header.vue";
import Toolbar from "@/components/Toolbar.vue";
import ToolbarField from "@/components/ToolbarField.vue";
import ToolbarButton from "@/components/ToolbarButton.vue";
import TabBox from "@/components/TabBox.vue";
import ListBox, { ListBoxHeader, ListBoxItemsData, ListBoxItemsSortCallback, ListBoxItemsConverterCallback, ListBoxItemsRendererCallback } from "@/components/ListBox.vue";
import AssessmentText from "@/components/AssessmentText.vue";
import Operation, { OperationType, Assessment } from "@/models/Operation";
import Locale, { T } from "@/store/Locale";
import TDate from "../models/TDate";
import { CreateElement } from "vue";
import AddOrEditOperation from "./AddOrEditOperation.vue";
import DialogCloseButton from "@/components/DialogCloseButton.vue";

/** Вкладка с операциями */
enum OperationTab {
    /** Вкладка с запланированными операциями */
    Planned = "planned",
    /** Вкладка с выполненными операциями */
    Completed = "completed",
    /** Вкладка с диалогом добавления операции */
    Add = "add"
}

/** Страница списка операций */
@Component({
    components: {
        Header,
        Toolbar,
        ToolbarField,
        ToolbarButton,
        TabBox,
        ListBox,
        AssessmentText,
        AddOrEditOperation,
        DialogCloseButton
    }
})
export default class OperationsView extends Vue {
    /** Перечень вкладок */
    private tabs = [OperationTab.Planned, OperationTab.Completed, OperationTab.Add];

    /** Вызывается после инициализации */
    protected mounted(): void {
        if (this.isLoading()) {
            this.$store.watch(
                state => state.operationsUpdateTime,
                () => {
                    console.log(0);
                    this.$forceUpdate();
                }
            );
            this.load();
        }
    }

    /** Возвращает заголовок страницы */
    private getTitle(): string {
        return this.isLoading()
            ? T.OPERATIONS_LOADING_TITLE.replace(
                "{field}",
                this.$route.params.field_id
            )
            : T.OPERATIONS_TITLE.replace("{field}", this.$route.params.field_id);
    }

    /** Возвращает текст кнопки добавления операции */
    private getAddOperationText(): string {
        return T.ADD_OPERATION_TAB;
    }

    /** Возвращает список операций */
    private getOperations(): Operation[] {
        return this.$store.state.operations[this.$route.params.field_id];
    }

    /** Возвращает список заголовков таблицы */
    private getHeaders(): ListBoxHeader[] {
        const keys = ["Date", "Operation", "Comment", "Area", "Assessment"];
        const widths = [78, 180, 180, 70, 150];
        return T.OPERATIONS_LIST_TITLES.map((v, i) => {
            return { Key: keys[i], Title: v, Width: widths[i] };
        });
    }

    /** Возвращает данные таблицы с правилами отображения и поведения */
    private getData(): ListBoxItemsData {
        const locale = Locale.Code;
        const areaMask = T.AREA_VALUE;
        const monthConverter = (month: number) =>
            new Date(2000, month, 0)
                .toLocaleString(locale, { month: "short" })
                .toUpperCase()
                .substr(0, 3);
        const dateConverter = (date: TDate) =>
            date.day + " " + monthConverter(date.month) + " " + date.year;
        const operationConverter = (op: OperationType): string =>
            ((T as { [key: string]: unknown })[OperationType[op]] as string) ||
            "?";
        const areaConverter = (a: number): string =>
            areaMask.replace("{area}", a.toLocaleString(locale));
        const assessmentConverter = (a?: Assessment | null): string =>
            ((T as { [key: string]: unknown })[
                Assessment[a as Assessment]
            ] as string) || T.NO_ASSESSMENT;
        const filterDate = (d: TDate, isAfter: boolean): boolean => {
            const src = new Date(d.year, d.month - 1, d.day);
            const now = new Date();
            return isAfter ? src > now : src < now;
        };

        let operations = this.getOperations();
        if (this.getActiveTab() == 0) {
            // после текущей даты (запланированные)
            operations = operations.filter(v => filterDate(v.date, true));
        } else {
            // до текущей даты (выполненные)
            operations = operations.filter(v => filterDate(v.date, false));
        }

        return {
            items: operations.map(v => {
                return {
                    Id: v.id,
                    Date: v.date,
                    Operation: v.type,
                    Comment: v.comment,
                    Area: v.area,
                    Assessment: v.assessment
                };
            }),
            sortCallbacks: {
                Date: ((d1: TDate, d2: TDate) => {
                    const x = new Date(d1.year, d1.month - 1, d1.day);
                    const y = new Date(d2.year, d2.month - 1, d2.day);
                    if (x === y) return 0;
                    return x < y ? 1 : -1;
                }) as ListBoxItemsSortCallback,
                Operation: ((o1: OperationType, o2: OperationType) => {
                    const x = operationConverter(o1);
                    const y = operationConverter(o2);
                    if (x === y) return 0;
                    return x < y ? 1 : -1;
                }) as ListBoxItemsSortCallback,
                Area: ((a1: number, a2: number) => {
                    if (a1 === a2) return 0;
                    return a1 < a2 ? 1 : -1;
                }) as ListBoxItemsSortCallback,
                Assessment: ((s1: Assessment, s2: Assessment) => {
                    const x = typeof s1 === "number" ? s1 : 3;
                    const y = typeof s2 === "number" ? s2 : 3;
                    if (x === y) return 0;
                    return x < y ? -1 : 1;
                }) as ListBoxItemsSortCallback
            },
            converters: {
                Date: dateConverter as ListBoxItemsConverterCallback,
                Operation: operationConverter as ListBoxItemsConverterCallback,
                Area: areaConverter as ListBoxItemsConverterCallback,
                Assessment: assessmentConverter as ListBoxItemsConverterCallback
            },
            cellRenderers: {
                Assessment: ((
                    cell: Assessment,
                    text: string,
                    createElement: CreateElement
                ) =>
                    createElement(
                        AssessmentText,
                        {
                            attrs: { icon: text ? cell : undefined }
                        },
                        [text]
                    )) as ListBoxItemsRendererCallback
            }
        };
    }

    /** Возвращает номер активной вкладки */
    private getActiveTab(): number {
        return this.tabs.indexOf(this.$route.params.filter as OperationTab);
    }

    /**
     * Возвращает флаг активности вкладки
     * @param tab Номер вкладки
     */
    private getIsTabActive(tab: number): boolean {
        return tab === this.getActiveTab();
    }

    /** Возвращает флаг доступности диалога */
    private getIsAddOrEditActive(): boolean {
        switch (this.getActiveTab()) {
        case 2: // add
            return true;
        case -1: // id
            return true;
        }
        return false;
    }

    /** Возвращает список вкладок */
    private getTabs(): string[] {
        return [T.PLANNED_OPERATIONS_TAB, T.COMPLETED_OPERATIONS_TAB];
    }

    /**
     * Обрабатывает нажатие на вкладку
     * @param tab Номер вкладки
     */
    private handleTabClick(tab: number): void {
        if (!this.getIsTabActive(tab))
            this.changeTab(tab);
    }

    /**
     * Выполняет смену вкладки
     * @param tab Вкладка или id элемента
     */
    private changeTab(tab: number | string): void {
        let filterName = tab;
        if (typeof tab === "number")
            filterName = this.tabs[tab];
        if (filterName)
            this.$router.push(
                `/field/${this.$route.params.field_id}/operations/${filterName}`
            );
    }

    /** Возвращает true, если операции загружены */
    private isLoading(): boolean {
        return !this.getOperations();
    }

    /** Выполняет загрузку операций */
    private load(): void {
        this.$store.dispatch("loadOperations", this.$route.params.field_id);
    }

    /**
     * Обрабатывает нажатие на ячейку
     * @param key Ключ заголовка
     * @param item Элемент списка
     */
    private handleCellClick(key: string, id: string): void {
        this.changeTab(id);
    }

    /** Обрабатывает закрытие диалога */
    private handleCloseClick(): void {
        this.$router.go(-1);
    }

    /** Возвращает текущую операцию */
    private getOperation(): Operation | undefined {
        const tab = this.getActiveTab();
        if (tab >= 0)
            return;
        const id = this.$route.params.filter;
        const operations = this.getOperations();
        return operations.find((op) => op.id === id);
    }
}
</script>

<style scoped>
div.operations {
    margin: 0;
    background-color: #f9f9f9;
    display: grid;
    grid-template-rows: 80px 1fr;
    grid-template-columns: 80px 1fr 80px;
    height: 100%;
    width: 100%;
    overflow: hidden;
}

div.operations div.page-header {
    grid-row-start: 1;
    grid-row-end: 1;
    grid-column-start: 1;
    grid-column-end: 4;
    background-color: #091c28;
}

div.operations div.page {
    grid-row-start: 2;
    grid-row-end: 2;
    grid-column-start: 2;
    grid-column-end: 2;
    background-color: #ffffff;
    padding: 30px;
}

div.operations div.dialog {
    grid-row-start: 1;
    grid-row-end: 3;
    grid-column-start: 1;
    grid-column-end: 4;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 320px 1fr;
}

div.operations div.dialog-panel {
    grid-row-start: 1;
    grid-row-end: 1;
    grid-column-start: 1;
    grid-column-end: 1;
    height: 100%;
    width: 100%;
    overflow: hidden;
}

div.operations div.close-panel {
    grid-row-start: 1;
    grid-row-end: 1;
    grid-column-start: 2;
    grid-column-end: 2;
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: table-cell;
    text-align: right;
    vertical-align: top;
}
</style>
