<template>
    <v-container fluid>
        <v-snackbar v-model="snackbar" top right>
            {{ error }}
            <v-btn color="primary" small @click="sendIBMRequest()">Try Again</v-btn>
            <v-btn color="error" small @click="snackbar = false">Close</v-btn>
        </v-snackbar>
        <v-row align="center" justify="center">
            <v-col lg="10" md="9" cols="7" class="text-center">
                <h1
                    class="display-1 font-weight-bold neutral-color"
                    :class="responsiveh1"
                >Timeline Novelty Visualization</h1>
            </v-col>
            <v-col lg="2" md="3" cols="5">
                <v-chip
                    class="ma-2"
                    close
                    color="primary"
                    text-color="white"
                    close-icon="fas fa-heart"
                    to="#favorites"
                >
                    <v-avatar left color="neutral">{{ countFavorites }}</v-avatar>Favorites
                </v-chip>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="12" lg="6" md="10">
                <v-btn
                    block
                    small
                    color="primary"
                    @click="addFavorite(pickedData)"
                    class="animated fadeIn elevation-3 mb-2"
                    :style="toggled"
                    :disabled="checkSelected"
                >
                    Add to Favorites
                    <v-icon small right>fas fa-heart</v-icon>
                </v-btn>
                <v-card :height="dynamicHeight" elevation="4" class="scroll">
                    <v-card-title
                        class="justify-space-between animated fadeIn"
                    >{{ pickedData.title }}</v-card-title>
                    <v-card-subtitle class="animated fadeIn">{{ pickedData.date }}</v-card-subtitle>
                    <v-card-text class="wrapper animated fadeIn">{{ pickedData.description }}</v-card-text>
                    <v-card-actions>{{ pickedData.source | sourceGet}}</v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12" lg="6" md="10">
                <Sentiment :value="roundFloatNumber" :emotions="emotions" :isLoading="isLoading" />
                <WordCloud :isLoading="isLoading" :keywords="keywords" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <div id="event-chart" class="elevation-5 pt-10"></div>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card
                    v-show="tooltip.showTooltip"
                    style="position: absolute;"
                    :style="tooltipStyle"
                    elevation="5"
                    width="600"
                >
                    <v-card-title>{{ tooltipTitle }}</v-card-title>
                    <v-card-subtitle>{{ tooltip.date }}</v-card-subtitle>
                    <v-card-text>{{ tooltipDescription }}</v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <Favorites id="favorites" :timelines="favorites" @sendToParent="messageFromFavorite" />
    </v-container>
</template>

<script>
    import eventDrops from "event-drops";

    import WordCloud from "~/components/WordCloud";
    import Sentiment from "~/components/Sentiment";
    import Favorites from "~/components/Favorties";
    import Moment from "moment";
    import * as d3 from "d3";
    import tests from "~/static/test.json";

    import axios from "axios";
    import moment from "moment";

    export default {
        components: {
            WordCloud,
            Sentiment,
            Favorites
        },
        data() {
            return {
                data: [
                    {
                        name: "admin-on-rest",
                        data: []
                    },
                    {
                        name: "whatsapp",
                        data: []
                    }
                ],
                isLoading: false,
                radius: 10,
                pickedData: {},
                startDate: "",
                endDate: "",
                value: null,
                emotions: [],
                title: "Twitter Data",
                keywords: [],
                favorites: new Array(),
                snackbar: false,
                error: "Error 403 | 503",
                tooltip: {
                    showTooltip: false,
                    top: 0,
                    left: 0,
                    title: "",
                    date: "",
                    description: ""
                }
            };
        },
        mounted() {
            this.data[0].data = this.formatData();

            // this.data[0].data = tests;
            d3.select("#event-chart")
                .data([this.data])
                .call(this.getChart);
        },
        filters: {
            sourceGet(newValue) {
                return newValue ? "Source: " + newValue : "";
            }
        },
        methods: {
            formatData() {
                let stringOfDates = tests.map(d => {
                    return moment(d.date, "DD MMMM YYYY");
                });
                this.startDate = moment.min(stringOfDates);
                console.log(stringOfDates);
                this.endDate = moment.max(stringOfDates).toDate();
                console.log(this.startDate);
                let temporalData = tests.map(d => {
                    return {
                        source: d.source,
                        title: d.title,
                        date: moment(d.date),
                        description: d.description
                    };
                });

                return temporalData;
            },
            updateText(event) {
                this.pickedData = event;
                this.sendIBMRequest();
            },
            addFavorite(selected) {
                this.favorites.push(selected);
            },
            messageFromFavorite(message) {
                this.favorites = message;
                // console.log(message);
            },
            sendIBMRequest() {
                let analyzeText =
                    this.pickedData.title + ". " + this.pickedData.description;
                this.isLoading = true;
                // let localhost = "localhost:3000";
                let heroku = "analytics-tool.herokuapp.com";
                return axios({
                    url: `http://${heroku}/api/ibm-nlu`,
                    method: "post",
                    data: {
                        text: analyzeText
                    }
                })
                    .then(res => {
                        console.log(res.data.result);
                        // Sentiment
                        this.value = res.data.result.sentiment.document.score;
                        // Emotion
                        let temporaryEmotions =
                            res.data.result.emotion.document.emotion;

                        var sortable = [];
                        for (var item in temporaryEmotions) {
                            sortable.push([
                                item,
                                parseFloat(temporaryEmotions[item].toFixed(2))
                            ]);
                        }
                        sortable.sort(function(a, b) {
                            return b[1] - a[1];
                        });
                        this.emotions = sortable.slice(0, 2);

                        // Keywords
                        this.keywords = res.data.result.keywords;
                        this.isLoading = false;
                    })
                    .catch(e => {
                        this.isLoading = false;
                        this.error = e;
                        this.snackbar = true;
                    });
            }
        },
        computed: {
            dynamicHeight() {
                return this.pickedData.title ? 390 : 430;
            },
            tooltipTitle() {
                return this.tooltip.title.length > 60
                    ? this.tooltip.title.slice(0, 60) + "...."
                    : this.tooltip.title;
            },
            tooltipDescription() {
                return this.tooltip.description.length > 200
                    ? this.tooltip.description.slice(0, 200) + "...."
                    : this.tooltip.description;
            },

            tooltipStyle() {
                return {
                    top: this.tooltip.top + "px",
                    left: this.tooltip.left + "px"
                };
            },
            getChart() {
                return eventDrops({
                    d3,
                    line: {
                        height: 50
                    },
                    drop: {
                        radius: this.radius,
                        date: d => d.date,
                        onClick: d => {
                            this.updateText(d);
                        },
                        onMouseOver: data => {
                            this.tooltip.showTooltip = true;
                            this.tooltip.top = d3.event.pageY - 30;
                            this.tooltip.left = d3.event.pageX;
                            this.tooltip.title = data.title;
                            this.tooltip.description = data.description;
                            this.tooltip.date = data.date;
                        },
                        onMouseOut: data => {
                            this.tooltip.showTooltip = false;
                        }
                    },
                    label: {
                        padding: 50,
                        text: this.title
                    },
                    range: {
                        start: this.startDate,
                        end: this.endDate
                    },
                    zoom: {
                        minimumScale: 1
                    }
                });
            },
            roundFloatNumber() {
                return this.value ? parseFloat(this.value.toFixed(2)) : 0;
            },
            responsiveh1() {
                return { title: this.$vuetify.breakpoint.mdAndDown };
            },
            toggled() {
                return this.pickedData.title ? "" : "display:none";
            },
            checkSelected() {
                return this.favorites.some(
                    item =>
                        item.title === this.pickedData.title &&
                        item.date === this.pickedData.date
                );
            },
            countFavorites() {
                return this.favorites.length;
            }
        },
        watch: {}
    };
</script>

<style>
.scroll {
    overflow-y: auto;
}

circle:hover {
    fill: tomato;
}

#event-chart .line-label {
    display: none;
}

#event-chart .viewport {
    transform: translate(-100px, 20px);
}

.start text {
    transform: translate(-75px, -20px);
    font-weight: bold;
    font-size: 1.2em;
    fill: #fe7d3b;
}
.end text {
    transform: translate(75px, -20px);
    font-weight: bold;
    font-size: 1.2em;
    fill: #fe7d3b;
}
.wrapper {
    white-space: pre-wrap;
}
</style>
