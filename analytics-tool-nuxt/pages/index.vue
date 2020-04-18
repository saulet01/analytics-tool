<template>
    <v-container fluid>
        <v-row justify="center" align="center">
            <v-col>
                <h1
                    class="display-1 text-center font-weight-bold neutral-color"
                >VAST Challenge Analytic Tool</h1>
            </v-col>
        </v-row>
        <v-divider class="my-5 elevation-3"></v-divider>

        <v-row justify="center" align="center">
            <v-col cols="5" v-for="(item, index) in tools" :key="index + 'menu'">
                <v-card elevation="3">
                    <v-card-title
                        class="primary-color font-weight-bold text-center justify-center"
                    >{{ item.title }}</v-card-title>
                    <v-img transition="slide-y-transition" :src="item.imgLink" contain></v-img>
                    <v-card-actions>
                        <v-btn dark block :to="item.btnLink" color="neutral">{{ item.btnName }}</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        data() {
            return {
                tools: [
                    {
                        title: "Edge Bundling Email Visualization",
                        imgLink: require("~/assets/images/email.png"),
                        description: "",
                        btnName: "Email",
                        btnLink: "/email"
                    },
                    {
                        title: "Timeline Novelty Visualization",
                        imgLink: require("~/assets/images/novelty.png"),
                        description: "",
                        btnName: "Novelty",
                        btnLink: "/novelty"
                    }
                ]
            };
        }
    };
</script>
