<template>
    <h1>Should be edge bundling</h1>
</template>

<script>
export default {
    data() {
        return {
            loadData: {}
        };
    },
    mounted() {
        console.log("Data loaded");
        this.fetchData();
    },
    methods: {
        async fetchData() {
            let data = await d3.json("./tweeter.json");
            this.loadData = data;
            console.log(this.loadData);
        }
    }
};
</script>

<style></style>
