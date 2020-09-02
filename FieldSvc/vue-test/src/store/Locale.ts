import { LocaleDictionary } from "./LocaleDictionary";

/** Перевод */
export let T: LocaleDictionary; // вытащен в переменную по соображениям производительности

/** Утилиты для выполнения локализации строковых ресурсов */
export default class Locale {
    private static _Resources: { [locale: string]: LocaleDictionary } = {};

    /** Текущий код культуры */
    static readonly Code = "ru-RU"; // TODO: В будущем реализовать переключение языков

    /**
     * Выполняет загрузку строковых ресурсов
     * @param loaders Загрузчики
     * @param loaded Коллбэк, вызываемый после выполнения загрузки
     */
    static load(
        loaders: { [locale: string]: Promise<unknown> },
        loaded: () => void
    ): void {
        let updateCount = 0;
        for (const locale in loaders) {
            updateCount++;
            (locale => {
                loaders[locale].then(value => {
                    Locale._Resources[locale] = value as LocaleDictionary;
                    updateCount--;
                    if (!updateCount) T = Locale._Resources[Locale.Code];
                    loaded();
                });
            })(locale);
        }
    }
}
