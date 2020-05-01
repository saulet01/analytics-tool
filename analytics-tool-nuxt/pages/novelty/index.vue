<template>
    <v-container fluid>
        <v-snackbar v-model="snackbar" top right>
            {{ error }}
            <v-btn color="primary" small @click="sendIBMRequest()">Try Again</v-btn>
            <v-btn color="error" small @click="snackbar = false">Close</v-btn>
        </v-snackbar>
        <v-snackbar v-model="snackbar2" top right :color="snackbarColor">
            <div class="d-flex flex-column">
                <p
                    class="font-weight-bold"
                    v-show="fileArray.length > 0"
                    :class="sucessClass"
                    :style="successColor"
                >Succesfully Loaded: {{ fileArray.length }} item(s)</p>
                <p
                    class="font-weight-bold"
                    v-show="loadErrors.length > 0"
                    :class="errorClass"
                    :style="errorColor"
                >Could not load: {{ loadErrors.length }} item(s)</p>
            </div>

            <div>
                <v-btn
                    v-show="loadErrors.length > 0"
                    color="primary"
                    small
                    @click="detailedErrors()"
                >More Details</v-btn>
                <v-btn small @click="snackbar2 = false">Close</v-btn>
            </div>
        </v-snackbar>

        <v-dialog
            v-model="errorDetails"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
        >
            <DetailedError :loadErrors="loadErrors" @detailedError="detailedErrorStatus" />
        </v-dialog>

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
                    close-icon="fas fa-bookmark"
                    to="#favorites"
                >
                    <v-avatar left color="neutral">{{ countFavorites }}</v-avatar>Bookmarks
                </v-chip>
            </v-col>
        </v-row>

        <v-row align="center" justify="center">
            <v-col cols="7">
                <v-slide-y-transition>
                    <v-file-input
                        show-size
                        small-chips
                        accept=".json, .csv, .txt"
                        label="Load a file in .json, .csv or .txt formats"
                        multiple
                        @change="fileHandle"
                        v-show="!loaded"
                    ></v-file-input>
                </v-slide-y-transition>

                <v-slide-y-transition>
                    >
                    <h1
                        v-show="fileArray.length > 0"
                        class="title primary-color"
                    >Item(s) Loaded: {{ fileArray.length }}</h1>
                </v-slide-y-transition>
                <v-slide-y-transition>
                    <h1
                        v-show="data[0].data.length > 0"
                        class="title neutral-color"
                    >Item(s) Displayed: {{ data[0].data.length }}</h1>
                </v-slide-y-transition>
            </v-col>
            <v-col cols="4" class="d-flex justify-center">
                <v-btn
                    color="neutral"
                    :disabled="testButtonClicked"
                    :dark="!testButtonClicked"
                    @click="loadTest"
                >Demo Test</v-btn>
                <v-btn
                    color="primary"
                    class="mx-2"
                    dark
                    @click.stop="sampleModal = true"
                >Data Format</v-btn>
                <v-btn
                    @click="saveSVG"
                    :disabled="downloadedSVG"
                    :dark="!downloadedSVG"
                    color="success"
                    v-show="data[0].data.length > 0"
                >Save SVG</v-btn>
                <v-dialog v-model="sampleModal" width="1200">
                    <SampleData
                        :dateFormat="dataFormat"
                        :modalData="sampleModal"
                        @returnValue="sampleUploadModal"
                    />
                </v-dialog>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <div
                    id="event-chart"
                    class="elevation-5 pt-10"
                    style="min-height: 150px;"
                    ref="chart"
                >
                    <v-slide-x-transition>
                        <h1
                            class="text-center primary-color"
                            v-show="!loaded"
                        >Upload Data or Click "DEMO TEST" to display events</h1>
                    </v-slide-x-transition>
                </div>
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
                    Add to Bookmarks
                    <v-icon small right>fas fa-heart</v-icon>
                </v-btn>
                <v-card :height="dynamicHeight" elevation="4" class="scroll">
                    <v-card-title class="justify-space-between animated fadeIn">
                        {{
                        pickedData.title
                        }}
                    </v-card-title>
                    <v-card-subtitle class="animated fadeIn">
                        {{
                        pickedData.date
                        }}
                    </v-card-subtitle>
                    <v-card-text class="wrapper animated fadeIn">
                        {{
                        pickedData.description
                        }}
                    </v-card-text>
                    <v-card-actions>{{ pickedData.source | sourceGet }}</v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12" lg="6" md="10">
                <Sentiment :value="roundFloatNumber" :emotions="emotions" :isLoading="isLoading" />
                <WordCloud :isLoading="isLoading" :keywords="keywords" />
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
        <v-overlay :value="loadingFile" color="primary" :opacity="overlaOpacityf">
            <v-progress-circular
                indeterminate
                :size="100"
                :width="10"
                :value="loadingValue"
                color="neutral"
                class="font-weight-bold"
                style="font-size: 25px;"
            >{{ loadingValue }}%</v-progress-circular>
        </v-overlay>
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
    import SampleData from "~/components/DataSample";
    import axios from "axios";
    import moment from "moment";
    import DetailedError from "~/components/DetailedError";
    import papaparse from "papaparse";
    import saveSvgAsPng from "save-svg-as-png";

    export default {
        components: {
            WordCloud,
            Sentiment,
            Favorites,
            SampleData,
            DetailedError
        },
        head() {
            return {
                title: this.titleMain
            };
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
                titleMain: "Timeline Novelty Visualization",
                sampleModal: false,
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
                },
                dataFormat: [
                    "MM/DD/YYYY",
                    "MM/DD/YYYY HH:mm:ss",
                    "MM/D/YYYY HH:mm:ss",
                    "MM/D/YYYY",
                    "MM/DD/YY",
                    "MM/D/YY",
                    "MM-DD-YYYY HH:mm:ss",
                    "MM-DD-YYYY",
                    "MM-D-YYYY",
                    "MM-D-YYYY HH:mm:ss",
                    "MM/DD/YYYY HH:mm:ss",
                    "DD MMMM YYYY, HH:mm:ss",
                    "DD MMMM YYYY, HHmm",
                    "D MMMM YYYY, HH:mm:ss",
                    "D MMMM YYYY, HHmm",
                    "DD MMMM YYYY, HHmm",
                    "DD MMMM YYYY",
                    "D MMMM YYYY",
                    "YYYY/MM/DD",
                    "YYYY/MM/DD, HH:mm:ss",
                    "YYYY/MM/DD, HHmm"
                ],
                loadingFile: false,
                loaded: false,
                loadErrors: [],
                loadingValue: 0,
                snackbar2: false,
                errorDetails: false,
                fileArray: [],
                overlaOpacityf: 0.8,
                testButtonClicked: false,
                downloadedSVG: false
            };
        },
        mounted() {
            // this.data[0].data = this.formatData();
        },
        filters: {
            sourceGet(newValue) {
                return newValue ? "Source: " + newValue : "";
            }
        },
        methods: {
            async saveSVG() {
                let getImage = await saveSvgAsPng.saveSvgAsPng(
                    document.getElementsByTagName("svg")[0],
                    "novelty.png",
                    {
                        backgroundColor: "#FFFFFF"
                    }
                );
                this.downloadedSVG = true;
            },
            loadTest() {
                this.loadingFile = true;
                this.formatData({ type: "array", tests: tests }, "test.json");
                this.assignTime();
                this.drawEvents();
            },
            drawEvents() {
                this.loadingValue = 95;
                d3.select("#event-chart")
                    .data([this.data])
                    .call(this.getChart);

                d3.selectAll(".line-label").style("display", "none");
                d3.select("#event-chart .viewport").style(
                    "transform",
                    "translate(-100px, 20px)"
                );

                this.loadingFile = false;
                this.loadErrors.length > 0 || this.fileArray.length > 0
                    ? (this.snackbar2 = true)
                    : "";
                this.loaded = true;
                this.testButtonClicked = true;
            },
            assignTime() {
                self = this;
                var stringOfDates = this.data[0].data.reduce(function(result, d) {
                    let dateValue = self.checkDate(d.date);
                    if (dateValue) {
                        result.push(dateValue);
                    }
                    return result;
                }, []);

                this.startDate = moment.min(stringOfDates);
                this.endDate = moment.max(stringOfDates).toDate();
            },
            fileHandle(events) {
                this.loadingFile = true;
                this.loadingValue = 10;
                let calculatedLoading = 90 / events.length;
                let sumUpLoading = calculatedLoading;
                events.map((event, index) => {
                    if (event != undefined) {
                        // 0.09

                        if (event.type == "text/csv") {
                            var self = this;

                            var dataTem = papaparse.parse(event, {
                                header: true,
                                complete: function(results) {
                                    self.data[0].data = self.formatData(
                                        results.data
                                    );
                                    self.drawEvents();
                                }
                            });
                        }

                        var reader = new FileReader();
                        reader.readAsText(event);
                        reader.onload = () => {
                            sumUpLoading += calculatedLoading;

                            if (
                                parseInt(sumUpLoading) > 0 &&
                                this.loadingValue != parseInt(sumUpLoading)
                            ) {
                                this.loadingValue = parseInt(sumUpLoading);
                                console.log(this.loadingValue);
                            }

                            let returnFormat = this.handleFormat(
                                event.type,
                                reader.result
                            );
                            this.formatData(returnFormat, event.name);
                        };
                        reader.onloadend = () => {
                            if (index == events.length - 1) {
                                this.assignTime();
                                this.drawEvents();
                            }
                        };
                    }
                });
            },
            checkDate(value) {
                for (var dateFormat of this.dataFormat) {
                    let dateNum = moment(value, dateFormat);
                    if (dateNum.isValid()) {
                        return dateNum;
                    }
                }
                return false;
            },
            handleFormat(format, file) {
                if (format == "application/json") {
                    let temporaryJSON = JSON.parse(file);
                    return {
                        type: "array",
                        tests: temporaryJSON
                    };
                } else if (format == "text/plain") {
                    let splitTemporary = file.split("\n");
                    let txtData = splitTemporary.filter(function(d) {
                        return d.length > 1;
                    });
                    let txtArray = [];
                    let txtObject = {};
                    txtObject["source"] = txtData[0];
                    txtObject["title"] = txtData[1];
                    txtObject["date"] = txtData[2];
                    txtObject["description"] = txtData[3];
                    if (txtData.length > 4) {
                        for (let i = 4; i < txtData.length; i++) {
                            txtObject["description"] += txtData[i];
                        }
                    }

                    for (let i = 0; i < 5; i++) {
                        if (
                            (Number.isInteger(+txtObject["description"][0]) &&
                                Number.isInteger(+txtObject["description"][1]) &&
                                Number.isInteger(+txtObject["description"][3])) ||
                            Number.isInteger(+txtObject["description"][5])
                        ) {
                            if (i == 0) {
                                txtObject["date"] +=
                                    ", " + txtObject["description"][i];
                            } else {
                                txtObject["date"] += txtObject["description"][i];
                            }
                        }
                    }

                    return {
                        type: "object",
                        tests: txtObject
                    };
                }
            },
            formatData(data, filename) {
                self = this;

                if (data.type === "object") {
                    let dateValue = self.checkDate(data.tests.date);
                    if (!dateValue) {
                        data.tests.file = filename;
                        self.loadErrors.push(data.tests);
                    } else {
                        self.data[0].data.push({
                            source: data.tests.source,
                            title: data.tests.title,
                            date: dateValue,
                            description: data.tests.description
                        });
                    }
                    this.fileArray = this.data[0].data;
                } else {
                    console.log("Array triggered");

                    let temporalData = data.tests.reduce(function(results, d) {
                        let dateValue = self.checkDate(d.date);
                        if (!dateValue) {
                            d.file = filename;
                            self.loadErrors.push(d);
                        } else {
                            self.data[0].data.push({
                                source: d.source,
                                title: d.title,
                                date: dateValue,
                                description: d.description
                            });
                        }
                        return results;
                    }, []);
                    this.fileArray = this.data[0].data;
                }
            },
            detailedErrors() {
                this.errorDetails = true;
            },
            detailedErrorStatus(newValue) {
                this.errorDetails = newValue;
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
            },
            sendIBMRequest() {
                let analyzeText =
                    this.pickedData.title + ". " + this.pickedData.description;
                this.isLoading = true;
                // let localhost = "localhost:3000";
                let heroku = "https://analytics-tool.herokuapp.com/api/ibm-nlu";
                let localhost = "http://localhost:3000/api/ibm-nlu";
                return axios({
                    url: localhost,
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
            },
            sampleUploadModal(value) {
                this.sampleModal = value;
            }
        },
        computed: {
            sucessClass() {
                return this.loadErrors.length == 0 ? "mt-3" : "";
            },
            successColor() {
                return this.fileArray.length > 0 && this.loadErrors.length == 0
                    ? "color: #fff"
                    : "color: #5CB65F";
            },
            errorClass() {
                return this.fileArray.length == 0 ? "mt-3" : "";
            },
            errorColor() {
                return this.loadErrors.length > 0 && this.fileArray.length == 0
                    ? "color: #fff"
                    : "color: #ff5252";
            },
            snackbarColor() {
                if (this.fileArray.length > 0 && this.loadErrors.length == 0) {
                    return "success";
                } else if (
                    this.loadErrors.length > 0 &&
                    this.fileArray.length == 0
                ) {
                    return "error";
                } else {
                    return "white";
                }
            },
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
