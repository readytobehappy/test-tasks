<template>
    <span :class="getClassName()">
        <svg
            class="icon"
            width="20"
            height="11"
            viewBox="0 0 20 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect y="0.880005" width="20" height="10" rx="5" fill="#FF7360" />
        </svg>
        <slot></slot>
    </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

/** Икона для отображения */
export enum AssessmentIcon {
    /** Отлично, зелёная икона */
    EXCELLENT = 0,
    /** Удовлетворительно, жёлтая икона */
    SATISFACTORILY = 1,
    /** Плохо, красная икона */
    BADLY = 2
}

/** Компонент с иконой (отл/уд/пл) и надпись */
@Component
export default class AssessmentText extends Vue {
    /** Икона для отображения */
    @Prop() private icon?: AssessmentIcon;

    /** Возвращает имя css-класса */
    private getClassName(): string {
        const { icon } = this;
        return "assessment" + (typeof icon === "number" ? " q" + icon : "");
    }
}
</script>

<style scoped>
span.assessment svg.icon {
    margin: 0 10px 0 0;
    position: relative;
    top: 1px;
}

span.assessment svg.icon rect {
    fill: #edeeee;
}

span.assessment.q0 svg.icon rect {
    fill: #42b983;
}

span.assessment.q1 svg.icon rect {
    fill: #ffe06d;
}

span.assessment.q2 svg.icon rect {
    fill: #ff7360;
}
</style>
