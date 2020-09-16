import "./MoviePanel.css";
import React, { Suspense } from "react";
import { T } from "../Stores/Locales/Locale";
import { observer, inject } from "mobx-react";
import FilmStore from "../Stores/FilmStore";
import Waiter from "./Waiter";

/** Свойства компонента MoviePanel */
export interface MoviePanelProps {
    /** Хранилище данных о фильмах */
    FilmStore?: FilmStore
}

/** Состояние компонента MoviePanel */
interface MoviePanelState {
    /** Подгружаемая форма */
    ReviewForm: any;
}

/** Панель отображения данных фильма */
@inject(FilmStore.name)
@observer
export default class MoviePanel extends React.Component<MoviePanelProps, MoviePanelState> {
    constructor(props: MoviePanelProps) {
        super(props);
        this.reviewClickHandler = this.reviewClickHandler.bind(this);
        this.state = {
            ReviewForm: undefined
        };
    }

    private reviewClickHandler(): void {
        this.setState({
            ReviewForm: React.lazy(() => import("./ReviewForm"))
        });
    }

    /** Выполняет рендеринг */
    public render(): JSX.Element {
        const filmStore = this.props.FilmStore;
        if (filmStore?.isMovieLoading)
            return (
                <Waiter text={T.MoviesList?.MovieIsLoading} />
            );
        else {
            const movie = filmStore?.getActiveMovie();
            const poster = movie?.poster_url;
            const { ReviewForm } = this.state;
            const R = T.MoviesList;

            return (
                <div className="movie-panel">
                    {poster ? <img className="poster" src={poster} /> : null}
                    <h2 className="title">{movie?.title}</h2>
                    <p className="description">{movie?.opening_crawl}</p>
                    {ReviewForm
                        ? (
                            <Suspense fallback={<Waiter text={R?.FormIsLoading} />}>
                                <ReviewForm url={movie?.url} storePath="movieCache.review" />
                            </Suspense>
                        )
                        : (
                            <button onClick={this.reviewClickHandler}>{R?.AddReview}</button>
                    )}
                </div>
            );
        }
    }
}