import Vue from "vue";
import Vuex from "vuex";
import FieldService from "../FieldService";
import Operation from "../models/Operation";

Vue.use(Vuex);

/** Глобальное состояние */
export interface GlobalState {
    /** Список операций для каждого поля */
    operations: { [fieldId: string]: Operation[] };
    /** Время обновления операций */
    operationsUpdateTime: Date;
}

/** Синглтон с заглушкой сервиса */
const fieldServiceInstance = new FieldService();

/** Состояние приложения */
export default new Vuex.Store({
    state: {
        operations: {},
        operationsUpdateTime: new Date()
    },
    mutations: {
        /**
         * Мутация редактирования операции
         * @param state Состояние
         * @param payload Параметры
         */
        editOperation(
            state: GlobalState,
            payload: { fieldId: string; operation: Operation }
        ) {
            const src = payload.operation;
            const { id } = src;
            const op = state.operations[payload.fieldId].find((o) => o.id === id);
            if (op) {
                op.type = src.type;
                op.date = src.date;
                op.comment = src.comment;
                op.assessment = src.assessment;
                op.area = src.area;
            }
            state.operationsUpdateTime = new Date();
        },
        /**
         * Мутация загрузки операций
         * @param state Состояние
         * @param payload Параметры
         */
        loadOperations(
            state: GlobalState,
            payload: { fieldId: string; operations: Operation[] }
        ) {
            state.operations[payload.fieldId] = payload.operations;
            state.operationsUpdateTime = new Date();
        }
    },
    actions: {
        /** Добавляет операцию */
        async addOperation(options,
            payload: { fieldId: string; operation: Operation }
        ) {
            if (options) {
                await fieldServiceInstance.saveOperation(payload.operation);
                await this.dispatch("loadOperations");
            }
        },
        /** Изменяет операцию */
        async editOperation(
            { commit },
            payload: { fieldId: string; operation: Operation }
        ) {
            await fieldServiceInstance.saveOperation(payload.operation);
            const operation = await fieldServiceInstance.getOperation(payload.operation.id);
            commit("editOperation", { fieldId: payload.fieldId, operation });
        },
        /** Загружает операции для поля 112 */
        async loadOperations({ commit }) {
            const fieldId = "112"; // TODO: в будущем передать в getOperations() и доработать getOperations() для загрузки любого поля
            const operations = await fieldServiceInstance.getOperations();
            commit("loadOperations", { fieldId, operations });
        }
    },
    modules: {} // Модули пока не нужны
});
