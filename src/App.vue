<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <v-row align="center">
                <v-col cols="9">
                    <p class="headline mt-4">VAST Challenge 2014</p>
                </v-col>
                <v-col cols="3">
                    <v-btn small text v-for="(item, index) in menuItems" :key="'L' + index" router :to="item.link" exact active-class="button-link-active">{{ item.title }}</v-btn>
                </v-col>
            </v-row>
        </v-app-bar>

        <v-content>
            <router-view></router-view>
        </v-content>
    </v-app>
</template>

<script>
export default {
    name: "App",

    components: {},

    data: () => ({
        collapseOnScroll: true,
        menuItems: [
            {
                title: "Timeline Novelty",
                link: "/",
                icon: "car"
            },
            {
                title: "Email",
                link: "/email",
                icon: "wind"
            }
        ]
    })
};
</script>
<style scoped>
.button-link-active {
    background-color: #c6382c !important;
}
.button-link-active::before {
    background-color: #c6382c !important;
}
/* #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
} */
</style>
