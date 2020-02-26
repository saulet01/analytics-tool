<template>
    <v-container fluid>
        <h1 class="text-center display-2 my-2">Analyzing Email Data:</h1>
        <!-- <EdgeMain /> -->
        <hr />
        <EdgeBundling />
    </v-container>

    <!-- <v-container fluid> -->

    <!-- </v-container> -->
</template>

<script>
    // @ is an alias to /src
    // import HelloWorld from '@/components/HelloWorld.vue'
    import EdgeBundling from "../components/EdgeBundling";
    import EdgeMain from "../components/EdgeMain";

    export default {
        components: {
            EdgeBundling
            // EdgeMain
        }
    };
</script>

<style scoped>
h1 {
    color: #1967c0;
}
</style>
