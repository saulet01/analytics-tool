<template>
    <v-card elevation="4" :height="responsiveHeight" :loading="isLoading">
        <v-card-title
            class="justify-center title font-weight-bold"
            style="color:red;"
        >Sentiment and Emotion Analysis</v-card-title>
        <v-card-text class="mt-n3 d-flex flex-row justify-space-between align-center">
            <v-row justify="center" :style="display">
                <v-col lg="7" md="7" sm="9" cols="12">
                    <div class="d-flex flex-row justify-space-around mb-n4">
                        <p>Negative</p>
                        <p>Positive</p>
                    </div>
                    <div class="d-flex flex-row justify-space-around">
                        <v-tooltip top nudge-bottom="5" nudge-right="30" light>
                            <template v-slot:activator="{ on }">
                                <svg
                                    id="chart"
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 380 50"
                                    preserveAspectRatio="xMidYMid meet"
                                >
                                    >
                                    <g class="rect" v-on="on" />
                                </svg>
                            </template>
                            <span>{{ value }}</span>
                        </v-tooltip>
                    </div>
                </v-col>
                <v-col lg="5" md="5" cols="10" class="d-flex justify-center">
                    <div
                        class="d-flex flex-column justify-center"
                        style="width: 150px;"
                        v-for="(item, index) in emotions"
                        :key="'emotions' + index"
                    >
                        <v-img
                            :src="getImgUrl(item[0])"
                            contain
                            height="40"
                            transition="scale-transition"
                        ></v-img>
                        <p class="text-center body-1 mt-2">{{ item[0] + " " + item[1] + "%"}}</p>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
    import * as d3 from "d3";

    export default {
        props: {
            value: {
                type: Number
            },
            isLoading: {
                type: Boolean
            },
            emotions: {
                type: Array
            }
        },
        data() {
            return {
                svg: {
                    totalWidth: 400,
                    totalHeight: 60
                },
                margin: {
                    top: 10,
                    right: 10,
                    bottom: 0,
                    left: 10
                }
            };
        },
        mounted() {
            this.draw();
        },
        computed: {
            responsiveHeight() {
                switch (this.$vuetify.breakpoint.name) {
                    case "sm":
                        return "260";
                    case "xs":
                        return "250";
                    case "md":
                        return "250";
                    default:
                        return "150";
                }
            },
            display() {
                return this.emotions.length > 0 ? "" : "display:none";
            }
        },
        methods: {
            getImgUrl(emoji) {
                return require("~/assets/images/emoji/" + emoji + ".svg");
            },
            draw() {
                let height = 20;
                let width = 350;

                let x = d3.scaleLinear().rangeRound([0, width]);

                let svg = d3
                    .select("#chart")
                    .attr("transform", "translate(0," + this.margin.top + ")");

                let xAxis = svg.append("g").attr("class", "x-axis");

                x.domain([-1, 1]).nice();

                let rectangular = d3.select(".rect");
                rectangular
                    .selectAll("rect")
                    .remove()
                    .exit();

                rectangular
                    .selectAll(".bar")
                    .data([this.value])
                    .enter()
                    .append("rect")
                    .attr("class", function(d) {
                        return "bar--" + (d < 0 ? "negative" : "positive");
                    })
                    .attr("width", 0)
                    .attr("x", width / 2)
                    .attr("y", "5")
                    .attr("height", height)
                    .attr("transform", "translate(10,0)")
                    .transition()
                    .duration(1400)
                    .attr("width", function(d) {
                        return Math.abs(x(d) - x(0));
                    })
                    .attr("transform", "translate(10,0)")
                    .attr("rx", "4")
                    .attr("x", function(d) {
                        return x(Math.min(0, d));
                    });

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(10," + 30 + ")")
                    .call(d3.axisBottom(x).ticks(4));

                svg.append("line")
                    .attr("x1", "205")
                    .attr("y1", "0")
                    .attr("x2", "205")
                    .attr("y2", "40")
                    .attr("stroke-width", "1")
                    .attr("stroke", "grey")
                    .attr("transform", "translate(-19.5,0)");
            }
        },
        watch: {
            value(newValue) {
                this.draw();
            }
        }
    };
</script>

<style>
.bar--positive {
    fill: #1976d2;
}

.bar--negative {
    fill: tomato;
}

.axis path,
.axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
}
</style>
