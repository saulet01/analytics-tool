<template>
    <v-container fluid>
        <v-row>
            <v-col cols="6">
                <v-card height="400" elevation="4">
                    <v-card-title>{{ pickedData.title }}</v-card-title>
                    <v-card-subtitle>{{ pickedData.date }}</v-card-subtitle>
                    <v-card-text>{{ pickedData.description }}</v-card-text>
                </v-card>
            </v-col>
            <v-col cols="6">
                <v-card elevation="4" height="120">
                    <v-card-title> </v-card-title>
                    <v-card-text> </v-card-text>
                </v-card>
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
import * as d3 from "d3";

export default {
    components: {
        WordCloud
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
            endDate: ""
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
                }
            });
        }
    },
    watch: {}
};
</script>

<style>
circle:hover {
    fill: tomato;
}
</style>
