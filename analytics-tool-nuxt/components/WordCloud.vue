<template>
    <v-card class="mt-4 justify-center" elevation="4" height="260" :loading="isLoading">
        <!-- <v-card-title class="justify-center font-weight-bold">Word Cloud</v-card-title> -->

        <div class="d-flex pt-2 justify-space-between mb-n5">
            <p></p>
            <p class="font-weight-bold title" style="color: red;">Word Cloud</p>

            <v-menu
                offset-y
                :close-on-click="settings.closeOnClick"
                :close-on-content-click="settings.clonOnContent"
            >
                <template v-slot:activator="{ on }">
                    <v-btn class="mr-2" small fab dark color="primary" v-on="on" v-if="keywords">
                        <v-icon dark>fas fa-cog</v-icon>
                    </v-btn>
                </template>
                <v-card>
                    <v-card-text>
                        <div class="d-flex flex-row mt-3">
                            <v-subheader>Padding</v-subheader>
                            <v-slider
                                class="mt-2"
                                v-model="settings.padding"
                                thumb-label
                                max="20"
                                min="0"
                                :size="settings.padding"
                            ></v-slider>
                        </div>
                        <div class="d-flex flex-row mt-n2">
                            <v-subheader>Spiral:</v-subheader>
                            <v-radio-group v-model="settings.spiral" row class="mt-2">
                                <v-radio value="archimedean" label="archimedean"></v-radio>
                                <v-radio value="rectangular" label="rectangular"></v-radio>
                            </v-radio-group>
                        </div>
                        <div class="d-flex flex-row">
                            <v-subheader>Color:</v-subheader>
                            <v-btn
                                fab
                                small
                                color="#4CAF50"
                                class="mx-1"
                                @click="colors = ['#4CAF50']"
                            ></v-btn>
                            <v-btn
                                fab
                                small
                                color="#FF9800"
                                class="mx-1"
                                @click="colors = ['#FF9800']"
                            ></v-btn>
                            <v-btn
                                fab
                                small
                                color="#000000"
                                class="mx-1"
                                @click="colors = ['#000000']"
                            ></v-btn>
                            <v-btn
                                fab
                                small
                                color="#2196F3"
                                class="mx-1"
                                @click="colors = ['#2196F3']"
                            ></v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-menu>
        </div>
        <v-card-text>
            <v-row justify="center" align="center">
                <v-col cols="12" class="text-center">
                    <cloud
                        :onWordClick="onClick"
                        :spiral="settings.spiral"
                        :padding="settings.padding"
                        :colors="colors"
                        :data="renamedArray"
                        :fontSizeMapper="this.fontSizeMapper"
                        height="180"
                        :width="responsiveWidth"
                    />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
    import Cloud from "vue-d3-cloud";

    export default {
        name: "app",
        props: {
            isLoading: {
                type: Boolean
            },
            keywords: {
                type: Array
            }
        },
        data() {
            return {
                settings: {
                    padding: 10,
                    spiral: "archimedean",
                    fontSize: 5,
                    closeOnClick: true,
                    clonOnContent: false
                },
                colors: ["#1976D2"]
            };
        },
        methods: {
            onClick() {}
        },
        components: {
            Cloud
        },
        computed: {
            fontSizeMapper() {
                switch (this.$vuetify.breakpoint.name) {
                    case "sm":
                        return word => Math.log2(word.value) * 2;
                    case "xs":
                        return word => Math.log2(word.value) * 2;
                    case "md":
                        return word => Math.log2(word.value) * 2;
                    default:
                        return word => Math.log2(word.value) * 2.5;
                }
            },
            responsiveWidth() {
                switch (this.$vuetify.breakpoint.name) {
                    case "sm":
                        return "250";
                    case "xs":
                        return "250";
                    case "md":
                        return "900";
                    default:
                        return "600";
                }
            },
            renamedArray() {
                return this.keywords.map(d => {
                    return {
                        text: d.text,
                        value: parseInt(d.relevance * 100)
                    };
                });
            }
        }
    };
</script>

<style scoped>
svg {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>
