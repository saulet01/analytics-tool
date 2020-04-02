<template>
    <v-container fluid>
        <v-row align="center" justify="center">
            <v-col lg="10" md="9" cols="7" class="text-center">
                <h1
                    class="display-1 font-weight-bold"
                    style="color:red;"
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
                >
                    <v-avatar left color="red">1</v-avatar>Favorites
                </v-chip>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="12" lg="6" md="10">
                <v-card height="430" elevation="4">
                    <v-card-title>{{ pickedData.title }}</v-card-title>
                    <v-card-subtitle>{{ pickedData.date }}</v-card-subtitle>
                    <v-card-text>{{ pickedData.description }}</v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" lg="6" md="10">
                <Sentiment :value="value" />
                <WordCloud />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <div id="event-chart"></div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import eventDrops from "event-drops";
    import WordCloud from "./WordCloud";
    import Sentiment from "./Sentiment";
    import * as d3 from "d3";

    export default {
        components: {
            WordCloud,
            Sentiment
        },
        data() {
            return {
                data: [
                    {
                        name: "admin-on-rest",
                        data: [
                            {
                                date: new Date("2020/03/03 14:21:31"),
                                title: "This is title",
                                description: "This is a description"
                            },
                            {
                                date: new Date("2020/03/03 15:21:31"),
                                title: "This is title a new title",
                                description: "This is a description"
                            }
                        ]
                    },
                    {
                        name: "whatsapp",
                        data: []
                    }
                ],
                radius: 10,
                pickedData: {},
                startDate: "",
                endDate: "",
                value: 0.5,
                title: "Twitter Data"
            };
        },
        mounted() {
            d3.select("#event-chart")
                .data([this.data])
                .call(this.getChart);
        },
        methods: {
            updateText(event) {
                this.pickedData = event;
            }
        },
        computed: {
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
                        }
                    },
                    label: {
                        padding: 50,
                        text: this.title
                    },
                    breakpoints: {
                        small: 576,
                        medium: 768,
                        large: 992,
                        extra: 1200
                    }
                });
            },
            responsiveh1() {
                return { title: this.$vuetify.breakpoint.mdAndDown };
            }
        },
        watch: {}
    };
</script>

<style>
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
    fill: #1976d2;
}
.end text {
    transform: translate(75px, -20px);
    font-weight: bold;
    font-size: 1.2em;
    fill: #1976d2;
}
</style>
