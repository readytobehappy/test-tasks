<template>
    <div class="global-header">{{ content }}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class GlobalHeader extends Vue {
    @Prop() private content!: string;
}
</script>

<style scoped>
div.global-header {
    color: #42b983;
}
</style>
