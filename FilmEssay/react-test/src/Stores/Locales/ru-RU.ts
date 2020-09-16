import { Locale } from "./Locale";

/** Строковые ресурсы для культуры ru-RU */
export default class LocaleRuRu extends Locale {
    Title = "Рецензии на фильмы из серии Star Wars";
    MoviesList = {
        ListIsLoading: "Загружается список...",
        MovieIsLoading: "Загружается фильм...",
        FormIsLoading: "Загружается форма...",
        AddReview: "Написать рецензию",
    };
    Review = {
        Title: "Ваша рецензия",
        UserName: "Имя пользователя*:",
        Email: "Адрес электронной почты*:",
        Review: "Текст рецензии*:",
        SendButton: "Отправить",
        CongratDialog: {
            Header: "Поздравляем",
            Message: "Спасибо за рецензию!",
            OkButton: "OK"
        },
        ReviewHeader: "Рецензия от {date} от пользователя {user}"
    };

    constructor() {
        super("ru-RU");
    }
}