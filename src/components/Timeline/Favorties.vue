<template>
    <div>
        <v-row align="center" justify="center">
            <v-col cols="10" class="text-center">
                <h1 class="text-center mt-4">
                    Favorites
                    <v-icon color="red">fas fa-heart</v-icon>
                </h1>
            </v-col>
            <v-col cols="2">
                <v-switch
                    v-model="switch1"
                    label="Remove Events"
                    color="red darken-3"
                    hide-details
                    inset
                ></v-switch>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col cols="10">
                <v-timeline dense>
                    <transition-group name="fade-transition">
                        <v-timeline-item v-for="(timeline, i) in timelines" :key="'A' + i">
                            <v-card elevation="3">
                                <v-card-title class="justify-space-between">
                                    {{ timeline.title }}
                                    <v-btn
                                        fab
                                        small
                                        dark
                                        class="animated fadeIn"
                                        color="red"
                                        :style="hideButtons"
                                        @click="removeEvent(timeline)"
                                    >
                                        <v-icon small>fas fa-trash</v-icon>
                                    </v-btn>
                                </v-card-title>

                                <v-card-subtitle>{{ timeline.date }}</v-card-subtitle>
                                <v-card-text>{{ timeline.description }}</v-card-text>
                            </v-card>
                        </v-timeline-item>
                    </transition-group>
                </v-timeline>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        props: ["timelines"],
        data() {
            return {
                switch1: false
            };
        },
        computed: {
            hideButtons() {
                return this.switch1 ? "" : "display:none";
            }
        },
        methods: {
            removeEvent(timeline) {
                // console.log(timeline);
                // console.log(this.timelines);
                let filteredData = this.timelines.filter(function(el) {
                    return el.title != timeline.title && el.date != timeline.date;
                });
                this.$emit("sendToParent", filteredData);

                // console.log(timeline);
            }
        }
    };
</script>

<style>
</style>