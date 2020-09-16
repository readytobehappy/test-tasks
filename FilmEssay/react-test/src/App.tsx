import React from "react";
import './App.css';
import { T } from "./Stores/Locales/Locale";
import MoviesList from "./Components/MoviesList";
import MoviePanel from "./Components/MoviePanel";

function App(): JSX.Element {
    return (
        <div className="app">
            <header>
                {T.Title}
            </header>
            <div className="left">
                <MoviesList />
            </div>
            <div className="right">
                <MoviePanel />
            </div>
        </div>
    );
}

export default App;