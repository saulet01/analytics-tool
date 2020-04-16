<template>
    <div>
        <v-row align="center" justify="center">
            <v-col cols="8" class="text-center">
                <h1 class="text-center neutral-color mt-4" ref="capture">
                    Favorites
                    <v-icon color="neutral" large>fas fa-heart</v-icon>
                </h1>
            </v-col>
            <v-col cols="4" class="d-flex flex-row align-center">
                <v-select
                    :items="items"
                    @change="listenPerPage"
                    outlined
                    class="mt-10 mr-3"
                    label="Numbers per page:"
                    dense
                    :value="perPage"
                    :disabled="disableItem"
                ></v-select>
                <v-switch
                    :disabled="disableItem"
                    v-model="switch1"
                    label="Remove Events"
                    color="red darken-3"
                    hide-details
                    inset
                ></v-switch>
                <v-btn
                    class="mt-4 ml-4"
                    :disabled="disableItem"
                    @click="print"
                    color="primary"
                    small
                >Save Image</v-btn>
            </v-col>
        </v-row>

        <v-row justify="center" class="favorite-deploy elevation-5" ref="printMe" :style="divStyle">
            <v-col cols="10">
                <v-timeline dense v-if="timelines.length > 0">
                    <transition-group name="fade-transition">
                        <v-timeline-item v-for="(timeline, i) in displayCards" :key="'A' + i">
                            <v-card class="elevation-5">
                                <v-card-title class="justify-space-between">
                                    <v-row>
                                        <v-col cols="11">{{ timeline.title }}</v-col>
                                        <v-col cols="1">
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
                                        </v-col>
                                    </v-row>
                                </v-card-title>

                                <v-card-subtitle>{{ timeline.date }}</v-card-subtitle>
                                <v-card-text>{{ timeline.description }}</v-card-text>
                            </v-card>
                        </v-timeline-item>
                    </transition-group>
                </v-timeline>
            </v-col>
        </v-row>
        <v-row>
            <v-pagination class="mt-3" :length="pageLength" v-model="page"></v-pagination>
        </v-row>
        <SaveAsImage :dialog="dialog" :output="output" @close-dialog="updateDialog" />
    </div>
</template>

<script>
    import Moment from "moment";
    import SaveAsImage from "~/components/SaveAsImage";

    export default {
        props: ["timelines"],

        components: {
            SaveAsImage
        },

        data() {
            return {
                dialog: false,
                switch1: false,
                output: null,
                page: 1,
                perPage: "4",
                divStyle: {
                    backgroundImage: `url(${require("~/assets/images/2.png")})`
                },
                items: ["2", "4", "6", "8", "10"],
                sortedArray: []
            };
        },

        computed: {
            pageLength() {
                return Math.ceil(this.timelines.length / this.perPage);
            },
            returnImage() {
                return this.output ? this.output : "";
            },
            hideButtons() {
                return this.switch1 ? "" : "display:none";
            },
            disableItem() {
                return this.timelines.length > 0 ? false : true;
            },
            displayCards() {
                this.sortData();
                let page = this.page;
                let perPage = parseInt(this.perPage);
                let from = page * perPage - perPage;
                let to = page * perPage;
                return this.sortedArray.slice(from, to);
            }
        },

        methods: {
            sortData() {
                this.sortedArray = this.timelines.sort(function(a, b) {
                    return new Date(a.date) - new Date(b.date);
                });
            },
            listenPerPage(e) {
                this.perPage = e;
            },
            removeEvent(timeline) {
                let filteredData = this.timelines.filter(function(el) {
                    return el.title != timeline.title && el.date != timeline.date;
                });
                this.$emit("sendToParent", filteredData);
            },

            async print() {
                this.dialog = true;
                const el = this.$refs.printMe;
                const options = {
                    type: "dataURL"
                };
                this.output = await this.$html2canvas(el, options);
            },
            updateDialog(dialogValue) {
                this.dialog = dialogValue;
            }
        }
    };
</script>

<style>
.favorite-deploy {
    background-size: cover;
    min-height: 50vh;
}
</style>
