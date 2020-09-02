import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

/** Список маршрутов */
const routes: RouteConfig[] = [
    { // Корневая страница
        path: "/",
        name: "Home",
        component: Home
    },
    { // Страница с тестовым заданием
        path: "/field/:field_id/operations/:filter",
        name: "Operations",
        component: () =>
            import(/* webpackChunkName: "Operations" */ "../views/Operations.vue")
    }
];

/** Объект маршрутизации */
const router = new VueRouter({
    routes
});

export default router;
