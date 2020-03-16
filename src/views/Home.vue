<template>
    <v-container fluid>
        <h1 class="text-center display-2 my-2">Analyzing Email Data:</h1>
        <EdgeCircle />
        <!-- <EdgeMain /> -->
    </v-container>

    <!-- <v-container fluid> -->

    <!-- </v-container> -->
</template>

<script>
    // @ is an alias to /src
    // import HelloWorld from '@/components/HelloWorld.vue'
    import EdgeMain from "../components/EdgeMain";
    import EdgeCircle from "../components/EdgeCircle";

    export default {
        components: {
            EdgeCircle
            // EdgeMain
        }
    };
</script>

<style scoped>
h1 {
    color: #1967c0;
}
</style>
