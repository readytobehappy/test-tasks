import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from "mobx-react";
import FilmStore from "./Stores/FilmStore";
import { Locale, T } from './Stores/Locales/Locale';
import LocaleEnUs from './Stores/Locales/en-US';
import LocaleRuRu from './Stores/Locales/ru-RU';

const stores = {
    FilmStore: new FilmStore()
};

Locale.register(new LocaleEnUs());
Locale.register(new LocaleRuRu());
Locale.change("ru-RU");

ReactDOM.render(
    <React.StrictMode>
        <Provider {...stores}>
            <div id="dialog-place" />
            <App />
        </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
document.title = T.Title!;