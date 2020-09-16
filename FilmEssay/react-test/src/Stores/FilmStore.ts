import { observable } from "mobx";

/** Данные фильма */
export interface MovieData {
    /** Название */
    title: string;
    /** Ссылка на данные */
    url: string;
    /** Ссылка на постер */
    poster_url?: string;
    /** Номер эпизода */
    episode_id: number;
    /** Предыстория */
    opening_crawl: string;
    /** Режиссёр */
    director: string;
    /** Список продюсеров */
    producers: string[];
    /** Дата выпуска */
    release_date: Date;
    /** Список ссылок на персонажей */
    character_urls: string[];
    /** Список ссылок на планеты */
    planet_urls: string[];
    /** Список ссылок на космические корабли */
    starship_urls: string[];
    /** Список ссылок на транспорт */
    vehicle_urls: string[];
    /** Список ссылок на существа */
    specie_urls: string[];
    /** Дата добавления записи */
    created: Date;
    /** Дата изменения записи */
    edited: Date;
}

/** Хранилище фильмов */
export default class FilmStore {
    /** Флаг загрузки списка */
    @observable isListLoading: boolean = false;
    /** Данные фильмов */
    @observable movies: MovieData[] = [];
    /** Индекс выбранного фильма */
    @observable movieIndex: number = -1;
    /** Флаг загрузки фильма */
    @observable isMovieLoading: boolean = false;
    private movieCache: { [url: string]: MovieData } = {};

    private convertMovie(v: any): MovieData {
        return {
            title: v.title,
            url: v.url.replace("http:", "https:"),
            episode_id: v.episode_id,
            opening_crawl: v.opening_crawl,
            director: v.director,
            producers: v.producer?.split(", "),
            release_date: new Date(v.release_date),
            character_urls: v.characters,
            planet_urls: v.planets,
            starship_urls: v.starships,
            vehicle_urls: v.vehicles,
            specie_urls: v.species,
            created: new Date(v.created),
            edited: new Date(v.edited)
        }
    }

    private async getPoster(title: string): Promise<string | undefined> {
        const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=938ba536&s=star+wars`, {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "text/plain"
            }
        });
        const obj = await response.json();
        const s = obj?.Search;
        if (!Array.isArray(s))
            return undefined;
        const t = title.toLowerCase();
        const movie = s.find((v) => v.Title?.toLowerCase().indexOf(t) >= 0);
        return movie?.Poster;
    }

    /** Загружает фильмы */
    public async loadMovies(): Promise<void> {
        this.isListLoading = true;
        const response = await fetch("https://swapi.dev/api/films/", {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const obj = await response.json();
        const { convertMovie } = this;
        if (obj)
            this.movies = obj.results.map(convertMovie);
        if (this.movies.length)
            await this.selectMovie(0);
        this.isListLoading = false;
    }

    /**
     * Выбирает текущий фильм по индексу
     * @param index Индекс фильма
     */
    public async selectMovie(index: number): Promise<void> {
        const movie = this.movies[index];
        if (!movie)
            return;
        if (this.movieIndex === index)
            return;
        const { movieCache } = this;
        const { url } = movie;
        if (!movieCache[url]) {
            this.isMovieLoading = true;
            const response = await fetch(url, {
                method: "GET",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const obj = await response.json();
            const movieData = this.convertMovie(obj);
            movieData.poster_url = await this.getPoster(movie.title);
            this.movieCache[url] = movieData;
            this.isMovieLoading = false;
        }
        this.movieIndex = index;
    }

    /**
     * Возвращает текущий фильм по индексу
     * @param index Индекс фильма
     */
    public getMovie(index: number): MovieData | undefined {
        const movie = this.movies[index];
        if (!movie)
            return;
        return this.movieCache[movie.url];
    }

    /** Возвращает выбранный фильм */
    public getActiveMovie(): MovieData | undefined {
        return this.getMovie(this.movieIndex);
    }
}