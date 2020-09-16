import "./MoviesList.css";
import React from "react";
import { T } from "../Stores/Locales/Locale";
import { observer, inject } from "mobx-react";
import FilmStore from "../Stores/FilmStore";
import Waiter from "./Waiter";

/** Свойства компонента MoviesList */
export interface MoviesListProps {
    /** Хранилище данных о фильмах */
    FilmStore?: FilmStore
}

/** Список фильмов */
@inject(FilmStore.name)
@observer
export default class MoviesList extends React.Component<MoviesListProps, unknown>
{
    /**
     * Обрабатывает нажатие на элемент
     * @param index Индекс элемента
     */
    private handleClick(index: number): void {
        this.props.FilmStore?.selectMovie(index);
    }

    /** Обрабатывает включение в DOM */
    public componentDidMount(): void {
        const filmStore = this.props.FilmStore;
        if (!filmStore?.movies.length)
            filmStore?.loadMovies();
    }

    /** Выполняет рендеринг */
    public render(): JSX.Element {
        const filmStore = this.props.FilmStore;
        if (filmStore?.isListLoading)
            return (
                <Waiter text={T.MoviesList?.ListIsLoading} />
            );
        else {
            const { movies, movieIndex } = filmStore!;
            return (
                <div className="movie-list">
                    {movies.map((movie, index) => (
                        <div
                            className={"movie-item" + (movieIndex === index ? " active" : "")}
                            key={index}
                            onClick={this.handleClick.bind(this, index)}
                        >
                            {movie.title}
                        </div>)
                    )}
                </div>
            );
        }
    }
}