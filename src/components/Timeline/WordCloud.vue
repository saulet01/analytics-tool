<template>
    <v-card class="mt-4 justify-center" elevation="4" height="260">
        <!-- <v-card-title class="justify-center font-weight-bold">Word Cloud</v-card-title> -->

        <div class="d-flex pt-2 justify-space-between mb-n5">
            <p></p>
            <p class="font-weight-bold title" style="color: red;">Word Cloud</p>

            <v-menu offset-y close-on-click="false" close-on-content-click="false">
                <template v-slot:activator="{ on }">
                    <v-btn class="mr-2" small fab dark color="primary" v-on="on" v-if="words">
                        <v-icon dark>fas fa-cog</v-icon>
                    </v-btn>
                </template>
                <v-card width="4o0">
                    <v-card-text>
                        <div class="d-flex flex-row mt-3">
                            <v-subheader>Padding</v-subheader>
                            <v-slider class="mt-2" v-model="settings.padding" thumb-label max="20" min="0" :size="settings.padding"></v-slider>
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
                            <v-btn fab small color="#4CAF50" class="mx-2" @click="colors = ['#4CAF50']"></v-btn>
                            <v-btn fab small color="#FF9800" class="mx-2" @click="colors = ['#FF9800']"></v-btn>
                            <v-btn fab small color="#000000" class="mx-2" @click="colors = ['#000000']"></v-btn>
                            <v-btn fab small color="#2196F3" class="mx-2" @click="colors = ['#2196F3']"></v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-menu>
        </div>
        <v-card-text>
            <div class="d-flex justify-center">
                <cloud :onWordClick="onClick" :spiral="settings.spiral" :padding="settings.padding" :colors="colors" :data="words" :fontSizeMapper="this.fontSizeMapper" width="600" height="200" />
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
import Cloud from "vue-d3-cloud";

export default {
    name: "app",
    data() {
        return {
            settings: {
                padding: 10,
                spiral: "archimedean",
                fontSize: 5
            },
            colors: ["#1976D2"],
            words: [
                { text: "Vue", value: 100 },
                { text: "js", value: 200 },
                { text: "is", value: 500 },
                { text: "very cool", value: 100 },
                { text: "lunch", value: 100 },
                { text: "sau1", value: 100 },
                { text: "sau2", value: 100 },
                { text: "sau3", value: 100 },
                { text: "sau4", value: 100 },
                { text: "sau5", value: 100 },
                { text: "sau6", value: 100 },
                { text: "sau7", value: 100 },
                { text: "sau8", value: 100 },
                { text: "sa9", value: 100 },
                { text: "sau10", value: 100 },
                { text: "sau11", value: 100 }
            ]
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
            return word => Math.log2(word.value) * this.settings.fontSize;
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
