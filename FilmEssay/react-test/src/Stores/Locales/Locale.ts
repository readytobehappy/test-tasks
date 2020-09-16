export type LocaleCode = "ru-RU" | "en-US";

export interface MoviesList {
    /** Загружается список... */
    ListIsLoading: string;
    /** Загружается фильм... */
    MovieIsLoading: string;
    /** Загружается форма */
    FormIsLoading: string;
    /** Написать рецензию */
    AddReview: string;
}

export interface ReviewFormCongratDialog {
    /** Заголовок */
    Header: string;
    /** Сообщение */
    Message: string;
    /** Кнопка OK */
    OkButton: string;
}

export interface ReviewForm {
    /** Ваша рецензия */
    Title: string;
    /** Имя пользователя */
    UserName: string;
    /** Адрес электронной почты */
    Email: string;
    /** Текст рецензии */
    Review: string;
    /** Отправить */
    SendButton: string;
    /** Ресурсы диалога */
    CongratDialog: ReviewFormCongratDialog;
    /** Заголовок отзыва */
    ReviewHeader: string;
}

export class Locale {
    /** Код языковой культуры */
    public readonly code: LocaleCode;
    /** Заголовок приложения */
    public Title?: string;
    /** Ресурсы для списка фильмов */
    public MoviesList?: MoviesList;
    /** Ресурсы для формы рецензии */
    public Review?: ReviewForm;
    /** Загруженные языковые культуры */
    protected static _Locales: { [id: string]: Locale } = {};
    /**
     * Конструктор с защитой от создания напрямую
     * @param code Код языковой культуры
     */
    protected constructor(code: LocaleCode) {
        this.code = code;
    }

    /**
     * Выполняет регистрацию культуры
     * @param locale Экземпляр культуры
     */
    public static register(locale: Locale): void {
        Locale._Locales[locale.code] = locale;
    }

    /**
     * Выполняет смену культуры
     * @param code Код языковой культуры
     */
    public static change(code: LocaleCode): void {
        T = Locale._Locales[code];
    }
}

/** Тeкущие строковые ресурсы */
export let T: Locale;