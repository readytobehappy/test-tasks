import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Locale from "./store/Locale";

Vue.config.productionTip = false;

Locale.load(
    {
        "en-US": import("./locales/en-US.json"),
        "ru-RU": import("./locales/ru-RU.json")
    },
    () => {
        new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount("#app");
    }
);
