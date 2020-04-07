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
                    to="#favorites"
                >
                    <v-avatar left color="red">{{ countFavorites}}</v-avatar>Favorites
                </v-chip>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="12" lg="6" md="10">
                <v-card height="430" elevation="4">
                    <v-card-title class="justify-space-between animated fadeIn">
                        {{ pickedData.title }}
                        <v-btn
                            small
                            color="primary"
                            @click="addFavorite(pickedData)"
                            class="animated fadeIn elevation-5"
                            :style="toggled"
                            :disabled="checkSelected"
                        >
                            Add to Favorites
                            <v-icon small right>fas fa-heart</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-subtitle class="animated fadeIn">{{ pickedData.date }}</v-card-subtitle>
                    <v-card-text class="animated fadeIn">{{ pickedData.description }}</v-card-text>
                </v-card>
            </v-col>
            <!-- <v-col cols="12" lg="6" md="10">
                <Sentiment :value="value" />
                <WordCloud />
            </v-col>-->
        </v-row>
        <v-row>
            <v-col cols="12">
                <div id="event-chart" class="elevation-5 pt-10"></div>
            </v-col>
        </v-row>
        <Favorites id="favorites" :timelines="favorites" @sendToParent="messageFromFavorite" />
    </v-container>
</template>

<script>
    import eventDrops from "event-drops";

    // import WordCloud from "./WordCloud";
    // import Sentiment from "./Sentiment";
    import Favorites from "./Favorties";
    import * as d3 from "d3";

    export default {
        components: {
            // WordCloud,
            // Sentiment,
            Favorites
        },
        data() {
            return {
                data: [
                    {
                        name: "admin-on-rest",
                        data: [
                            {
                                date: new Date("2020/03/03 14:21:31"),
                                title: "First Title",
                                description: "This is a description"
                            },
                            {
                                date: new Date("2019/10/03 15:21:31"),
                                title: "Second Title",
                                description: "This is a description"
                            },
                            {
                                date: new Date("2019/11/03 15:21:31"),
                                title: "Fourth Title",
                                description: "This is a description"
                            },
                            {
                                date: new Date("2019/12/03 15:21:31"),
                                title: "Fifth Title",
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
                title: "Twitter Data",
                favorites: new Array()
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
            },
            addFavorite(selected) {
                this.favorites.push(selected);
            },
            messageFromFavorite(message) {
                this.favorites = message;
                // console.log(message);
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
