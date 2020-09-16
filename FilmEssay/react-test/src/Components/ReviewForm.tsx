import "./ReviewForm.css";
import React from "react";
import { T } from "../Stores/Locales/Locale";
import { observer, inject } from "mobx-react";
import FilmStore from "../Stores/FilmStore";
import ReactDOM from "react-dom";

/** Свойства компонента ReviewForm */
export interface ReviewFormProps {
    /** Хранилище данных о фильмах */
    FilmStore?: FilmStore;
    /** Ссылка на выбранный фильм */
    url: string;
    /** Путь в хранилище в формате "ключ.свойство" */
    storePath: string;
}

/** Статус формы */
enum ReviewFormStatus {
    /** Возможность добавления рецензии */
    New = "new",
    /** Отправка рецензии на сервер */
    Sending = "sending",
    /** Рецензия отправлена, отображается диалог с поздравлениями */
    Sent = "sent",
    /** Рецензия отправлена, диалог закрыт, рецензия отображается в режиме просмотра */
    Complete = "complete"
}

/** Состояние компонента ReviewForm */
interface ReviewFormState {
    /** Имя пользователя */
    userName: string;
    /** Email пользователя */
    email: string;
    /** Отзыв */
    review: string;
    /** Статус формы */
    status: ReviewFormStatus;
    /** Ссылка на фильм, для которого пишется отзыв */
    url: string;
}

/** Панель отображения данных фильма */
@inject(FilmStore.name)
@observer
export default class ReviewForm extends React.Component<ReviewFormProps, ReviewFormState> {
    constructor(props: ReviewFormProps) {
        super(props);

        this.userNameChangeHandler = this.userNameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.reviewChangeHandler = this.reviewChangeHandler.bind(this);
        this.sendClickHandler = this.sendClickHandler.bind(this);
        this.okClickHandler = this.okClickHandler.bind(this);

        this.state = this.getOriginState(props);
    }

    private getOriginState(props: ReviewFormProps): ReviewFormState {
        return {
            userName: "",
            email: "",
            review: "",
            status: !!this.getReview(props.url) ? ReviewFormStatus.Complete : ReviewFormStatus.New,
            url: props.url
        };
    }

    private userNameChangeHandler(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ userName: e.target.value });
    }

    private emailChangeHandler(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ email: e.target.value });
    }

    private reviewChangeHandler(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        this.setState({ review: e.target.value });
    }

    private isValidated(): boolean {
        const { userName, email, review } = this.state;
        if (!userName)
            return false;
        if (userName.trim().length < 3)
            return false;
        if (!email)
            return false;
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            .test(email.toLowerCase()))
            return false;
        if (!review)
            return false;
        if (review.trim().length < 3)
            return false;
        return true;
    }

    private async sendClickHandler(): Promise<void> {
        if (!this.isValidated())
            return;
        this.setState({
            status: ReviewFormStatus.Sending
        });
        await new Promise((resolve) => { setTimeout(resolve, 1000) });
        this.setState({
            status: ReviewFormStatus.Sent
        });
    }

    private okClickHandler(): void {
        this.setReview(this.props.url, this.state.userName, this.state.review);
        this.setState(this.getOriginState(this.props));
    }

    private getReview(url: string): { userName: string, date: Date, review: string } | undefined {
        const { FilmStore, storePath } = this.props;
        if (!FilmStore)
            return undefined;
        const p = storePath.split(".");
        const cache = (FilmStore as any)[p[0]];
        if (!cache)
            return undefined;
        const item = cache[url];
        if (!item)
            return undefined;
        return item[p[1]] as any;
    }

    private setReview(url: string, userName: string, review: string): void {
        const { FilmStore, storePath } = this.props;
        if (!FilmStore)
            return;
        const p = storePath.split(".");
        const cache = (FilmStore as any)[p[0]];
        if (!cache)
            return;
        const item = cache[url];
        if (!item)
            return;
        item[p[1]] = { userName, date: new Date(), review };
    }

    /**
     * Обновляет свойства, когда фильм переключен
     * @param nextProps Новые свойства компонента
     */
    public componentWillReceiveProps(nextProps: ReviewFormProps): void {
        if (nextProps.url !== this.state.url) {
            this.setState(this.getOriginState(nextProps));
        }
    }

    private getModalDialog(): JSX.Element {
        const r = document.body.getBoundingClientRect();
        const R = T.Review?.CongratDialog;
        return (
            <div className="modal-dialog" style={{ width: `${r.width}px`, height: `${r.height}px` }}>
                <div className="background" style={{ width: `${r.width}px`, height: `${r.height}px` }} onClick={this.okClickHandler} />
                <div className="window">
                    <div className="header">
                        {R?.Header}
                    </div>
                    <div className="body">
                        <div className="message">
                            {R?.Message}
                        </div>
                        <div className="buttons">
                            <button onClick={this.okClickHandler}>{R?.OkButton}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private getReviewContent(data?: { userName: string, date: Date, review: string }): JSX.Element | undefined {
        if (!data)
            return undefined;
        const { userName, date, review } = data!;
        return (
            <div className="review">
                <div className="header">{T.Review?.ReviewHeader?.replace("{date}", date.toLocaleDateString(T.code)).replace("{user}", userName)}</div>
                <p>{review}</p>
            </div>
        );
    }

    /** Выполняет рендеринг */
    public render(): JSX.Element {
        const R = T.Review;
        const { userName, email, review, status } = this.state;
        let content = null;
        switch (status) {
            case ReviewFormStatus.New:
            case ReviewFormStatus.Sending:
                content = (
                    <fieldset>
                        <legend>{R?.Title}</legend>
                        <div className="textbox"><label htmlFor="username">{R?.UserName}</label><input name="username" type="text" disabled={status !== ReviewFormStatus.New} onChange={this.userNameChangeHandler} value={userName} /></div>
                        <div className="textbox"><label htmlFor="email">{R?.Email}</label><input name="email" type="text" disabled={status !== ReviewFormStatus.New} onChange={this.emailChangeHandler} value={email} /></div>
                        <div className="textarea"><label htmlFor="review">{R?.Review}</label><textarea name="review" disabled={status !== ReviewFormStatus.New} onChange={this.reviewChangeHandler} value={review} /></div>
                        <div className="buttons"><button disabled={!this.isValidated() || status !== ReviewFormStatus.New} onClick={this.sendClickHandler}>{R?.SendButton}</button></div>
                    </fieldset>
                );
                break;
            case ReviewFormStatus.Sent:
                content = ReactDOM.createPortal(this.getModalDialog(), document.getElementById("dialog-place")!);
                break;
            case ReviewFormStatus.Complete:
                content = this.getReviewContent(this.getReview(this.props.url));
                break;
        }

        return (
            <div className="review-form">
                {content}
            </div>
        );
    }
}