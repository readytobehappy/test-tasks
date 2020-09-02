<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { CreateElement, VNode } from "vue";

/** Метаданные заголовка столбца */
export interface ListBoxHeader {
    /** Ключ, по которому будет производиться поиск данных ячейки, применительно к этому столбцу */
    Key: string;
    /** Заголовок столбца */
    Title: string;
    /** Ширина столбца в пикселях */
    Width: number;
}

/** Коллбэк сортировки */
export type ListBoxItemsSortCallback = (a: unknown, b: unknown) => 0 | -1 | 1;

/** Коллбэк конвертации в строку для отображения */
export type ListBoxItemsConverterCallback = (item: unknown) => string;

/** Коллбэк рендеринга */
export type ListBoxItemsRendererCallback = (
    cell: unknown,
    text: string | VNode,
    createElement: CreateElement
) => VNode;

/** Данные элемента таблицы по ключу заголовка */
export interface ListBoxItemData {
    [key: string]: unknown;
}

/** Метаданные элементов таблицы */
export interface ListBoxItemsData {
    /** Передаваемые данные для отображения */
    items?: ListBoxItemData[];
    /** Коллбэки сортировки */
    sortCallbacks?: { [Key: string]: ListBoxItemsSortCallback };
    /** Конвертеры данных для отображения */
    converters?: { [Key: string]: ListBoxItemsConverterCallback };
    /** Рендереры компонентов в ячейки */
    cellRenderers?: {
        [Key: string]: ListBoxItemsRendererCallback;
    };
}

/** Данные для рендеринга заголовка */
interface RenderHeaderData {
    /** Имя класса */
    className: string;
    /** Ключ */
    key: string;
    /** Ширина линии */
    width: string;
    /** Название заголовка */
    title: string;
    /** Обработчик нажатия на заголовок */
    handleClick: (key: string) => void;
}

/** Тип обработчика нажатия на ячейку */
type ClickCellHandler = (key: string, id: string) => void;

/** Данные обработчиков нажатия на ячейку */
interface HandleClickCellData {
    [key: string]: ClickCellHandler;
}

/** Данные для рендеринга строки таблицы */
interface RenderRowData {
    /** Ключ */
    key: string;
    /** Данные заголовков */
    headers: RenderHeaderData[];
    /** Данные ячеек */
        data: RenderCellData;
    /** Обработчик нажатия */
    handleClick: HandleClickCellData;
}

/** Данные для рендеринга ячеек */
interface RenderCellData {
    /** Ключ */
    key: string;
    [key: string]: string | VNode;
}

/** Многоколоночный список с поддержкой сортировки */
@Component
export default class ListBox extends Vue {
    /** Данные заголовков */
    @Prop() private headers!: ListBoxHeader[];
    /** Данные таблицы с описанием поведения */
    @Prop() private data!: ListBoxItemsData;
    /** Ключ столбца сортировки */
    private sortKey!: string;
    /** Направление сортировки (true — прямая, false — обратная) */
    private isAscending!: boolean;

    /** Возвращает данные заголовков для рендеринга */
    private getHeaders(): RenderHeaderData[] {
        const { sortKey, isAscending, handleHeaderClick } = this;
        return this.headers.map((h: ListBoxHeader) => {
            return {
                className:
                    "cell" +
                    (h.Key == sortKey
                        ? " active" + (!isAscending ? " desc" : "")
                        : ""),
                key: h.Key,
                width: h.Width + "px",
                title: h.Title,
                handleClick: handleHeaderClick.bind(this, h.Key)
            };
        });
    }

    /**
     *  Возвращает данные строк таблицы для рендеринга
     * @param createElement Коллбэк создания элемента
     * */
    private getRows(createElement: CreateElement): RenderRowData[] {
        const headers = this.getHeaders();
        const { data, sortKey, isAscending, handleCellClick } = this;
        const { converters, sortCallbacks, cellRenderers } = data;
        let { items } = data;
        if (!items) return [];
        if (sortKey) {
            const postSortCallback = sortCallbacks
                ? sortCallbacks[sortKey]
                : undefined;
            const sortCallback = (a: ListBoxItemData, b: ListBoxItemData) => {
                let x = a[sortKey] as string;
                let y = b[sortKey] as string;
                if (postSortCallback)
                    return isAscending
                        ? -postSortCallback(x, y)
                        : postSortCallback(x, y);
                x = x || "";
                y = y || "";
                if (x === y) return 0;
                if (x < y) return isAscending ? -1 : 1;
                return isAscending ? 1 : -1;
            };
            items = items?.sort(sortCallback);
        }
        const stringify = (v: ListBoxItemData): RenderCellData => {
            const result: RenderCellData = { key: "" };
            for (const k in v) {
                const converter = converters ? converters[k] : undefined;
                const renderer = cellRenderers ? cellRenderers[k] : undefined;
                if (renderer)
                    result[k] = renderer(
                        v[k],
                        converter ? converter(v[k]) : (v[k] as string),
                        createElement
                    );
                else result[k] = converter ? converter(v[k]) : (v[k] as string);
            }
            return result;
        };
        const clickify = (v: ListBoxItemData): HandleClickCellData => {
            const result: HandleClickCellData = {};
            for (const k in v) {
                result[k] = handleCellClick.bind(this, k, v.Id);
            }
            return result;
        };
        return items.map((v: ListBoxItemData, i: number) => {
            return {
                key: i + "",
                headers,
                data: stringify(v),
                handleClick: clickify(v)
            };
        });
    }

    /**
     * Обрабатывает нажатие на заголовок
     * @param key Ключ заголовка
     */
    private handleHeaderClick(key: string): void {
        if (this.sortKey === key) this.isAscending = !this.isAscending;
        else {
            this.sortKey = key;
            this.isAscending = true;
        }
        this.$forceUpdate();
    }

    /**
     * Обрабатывает нажатие на ячейку
     * @param key Ключ заголовка
     * @param item Элемент списка
     */
    private handleCellClick(key: string, item: unknown): void {
        this.$emit("cellClick", key, item);
    }

    /**
     * Рендерит заголовок
     * @param header Данные заголовка
     * @param createElement Коллбэк создания элемента
     */
    private renderHeader(
        header: RenderHeaderData,
        createElement: CreateElement
    ): VNode {
        return createElement(
            "div",
            {
                class: header.className,
                key: header.key,
                style: { width: header.width },
                on: { click: header.handleClick }
            },
            [
                header.title,
                createElement( // стрелка с направлением сортировки
                    "svg",
                    {
                        class: "sort",
                        attrs: {
                            width: "10",
                            height: "5",
                            viewBox: "0 0 10 5",
                            fill: "none",
                            xmlns: "http://www.w3.org/2000/svg"
                        }
                    },
                    [
                        createElement("path", {
                            attrs: {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M10 0L5 5L0 0H10Z",
                                fill: "#A7A9AC"
                            }
                        })
                    ]
                )
            ]
        );
    }

    /**
     * Рендерит строку таблицы
     * @param row Данные строки таблицы
     * @param createElement Коллбэк создания элемента
     */
    private renderRow(row: RenderRowData, createElement: CreateElement): VNode {
        return createElement(
            "div",
            {
                class: "row",
                key: row.key
            },
            row.headers.map(header =>
                this.renderCell(row, header, createElement)
            )
        );
    }

    /**
     * Рендерит ячейку таблицы
     * @param row Данные строки таблицы
     * @param cell Данные ячейки таблицы
     * @param createElement Коллбэк создания элемента
     */
    private renderCell(
        row: RenderRowData,
        cell: RenderCellData | RenderHeaderData,
        createElement: CreateElement
    ): VNode {
        return createElement(
            "div",
            {
                class: "cell",
                key: cell.key + "|" + row.key,
                style: { width: cell.width },
                on: { click: row.handleClick[cell.key] }
            },
            [row.data[cell.key]]
        );
    }

    /**
     * Рендерит компонент
     * @param createElement Коллбэк создания элемента
     */
    protected render(createElement: CreateElement): VNode {
        return createElement(
            "div",
            {
                class: "list-box"
            },
            [
                createElement(
                    "div",
                    {
                        class: "header"
                    },
                    this.getHeaders().map(header =>
                        this.renderHeader(header, createElement)
                    )
                ),
                createElement(
                    "div",
                    {
                        class: "body"
                    },
                    this.getRows(createElement).map(row =>
                        this.renderRow(row, createElement)
                    )
                )
            ]
        );
    }
}
</script>

<style scoped>
div.list-box {
    margin: 8px 0 0 0;
}

div.list-box div.header {
    background-color: #edeeee;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: stretch;
    height: 40px;
    cursor: pointer;
    overflow: hidden;
    user-select: none;
}

div.list-box div.header div.cell {
    display: inline-block;
    font-size: 11px;
    font-weight: bold;
    line-height: 38px;
    padding: 0 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
}

div.list-box div.header div.cell svg.sort {
    padding: 18px 0 0 4px;
}

div.list-box div.header div.cell.desc svg.sort {
    transform: translate(4px, 18px) rotate(180deg);
}

div.list-box div.header div.cell.active svg.sort path {
    fill: #3399ff;
}

div.list-box div.row {
    background-color: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: stretch;
    height: 40px;
    border-bottom: 1px solid #edeeee;
    cursor: pointer;
    overflow: hidden;
}

div.list-box div.row:hover {
    background-color: #f6f8f8;
}

div.list-box div.row div.cell {
    display: inline-block;
    font-size: 11px;
    font-weight: bold;
    line-height: 38px;
    padding: 0 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
}
</style>
