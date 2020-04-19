<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <v-row align="center">
                <v-col md="8" lg="9" cols="8">
                    <router-link to="/" style="cursor: pointer">
                        <v-img :src="getImageVast" transition="scale-transition" width="200"></v-img>
                    </router-link>
                </v-col>
                <v-col lg="3" md="4" cols="6" class="hidden-md-and-down">
                    <v-btn
                        small
                        text
                        v-for="(item, index) in menuItems"
                        :key="'L' + index"
                        router
                        :to="item.link"
                        active-class="button-link-active"
                    >{{ item.title }}</v-btn>
                </v-col>
            </v-row>
            <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
        </v-app-bar>

        <v-navigation-drawer
            v-model="drawer"
            absolute
            temporary
            color="neutral"
            dark
            style="position:fixed; top:0; left:0; overflow-y:scroll;"
        >
            <v-divider class="mt-2"></v-divider>
            <v-list nav dense>
                <v-list-item-group
                    active-class="text--accent-4"
                    v-for="(item, index) in menuItems"
                    :key="'K' + index"
                >
                    <v-list-item :to="item.link" class="mt-2">
                        <v-list-item-icon>
                            <v-icon>fas fa-{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>

        <v-content>
            <nuxt />
        </v-content>
    </v-app>
</template>

<script>
    export default {
        computed: {},

        data: () => ({
            getImageVast: require("~/assets/images/vast.png"),
            drawer: false,
            collapseOnScroll: true,
            menuItems: [
                {
                    title: "Home",
                    link: "/",
                    icon: "home"
                },
                {
                    title: "Timeline Novelty",
                    link: "/novelty",
                    icon: "history"
                },
                {
                    title: "Email",
                    link: "/email",
                    icon: "at"
                }
            ]
        })
    };
</script>
<style scoped>
.button-link-active {
    background-color: #fe7d3b !important;
}
.button-link-active::before {
    background-color: #fe7d3b !important;
}
/* #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
} */
</style>
