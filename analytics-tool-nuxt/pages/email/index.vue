<template>
    <div>
        <v-row align="center" justify="center">
            <v-col cols="3" sm="6" md="3">
                <v-menu
                    v-model="menu"
                    :nudge-right="30"
                    transition="slide-y-transition"
                    offset-y
                    min-width="290px"
                    ref="menu"
                    :close-on-content-click="false"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                            v-model="getDates"
                            label="Pick a date or range"
                            prepend-icon="far fa-calendar-alt"
                            readonly
                            v-on="on"
                            color="primary"
                        ></v-text-field>
                    </template>

                    <v-date-picker
                        v-model="dates"
                        :min="datePicker.limitMin"
                        :max="datePicker.limitMax"
                        @input="menu2 = false"
                        range
                        color="primary"
                    >
                        <v-spacer></v-spacer>
                        <v-btn text color="alt" @click="menu = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.menu.save(dates)">OK</v-btn>
                    </v-date-picker>
                </v-menu>
            </v-col>
            <v-col cols="3">
                <p class="title neutral-color">Total Email: {{ original.length }}</p>
            </v-col>
        </v-row>
        <v-row>
            <v-col lg="7" md="7" sm="12" cols="12">
                <v-card elevation="3">
                    <div class="svg-container" ref="saveSvg">
                        <div class id="edge">
                            <svg
                                preserveAspectRatio="xMidYMid meet"
                                viewBox="0 0 800 650"
                                class="svg-content-responsive"
                                v-show="formatedData"
                                ref="diagram"
                            >
                                <g :transform="style">
                                    <g>
                                        <path
                                            class="link"
                                            v-for="(b, i) in getLinks"
                                            :key="'AA' + i"
                                            :d="getLines(b)"
                                            :class="objectClass(b)"
                                        />
                                    </g>

                                    <g>
                                        <text
                                            class="node"
                                            v-for="d in getNodes"
                                            :key="d.id"
                                            :dy="d.dy"
                                            :text-anchor="d.textAnchor"
                                            :transform="d.transform"
                                            :style="{ fontSize: chartStyling.fontSize + 'px', fill: d.fill}"
                                            :data="d.data"
                                            @mouseover="mouseOver(d, $event)"
                                            @mouseout="mouseLeave(d)"
                                            @click="selectedItem(d.data)"
                                        >{{ d.text | splitItem(switchExtensions) }}</text>
                                    </g>
                                </g>
                                <g>
                                    <text
                                        v-for="(item, index) in uniqueClusters"
                                        :key="'legend'+index"
                                        :style="{fill: item.fill, fontSize: '11px'}"
                                        :dy="(index + 1) * 25"
                                        x="10"
                                    >{{ item.group }}</text>
                                </g>
                            </svg>
                        </div>
                    </div>
                </v-card>
            </v-col>
            <v-col lg="5" md="5" sm="12" cols="12">
                <v-card class="d-flex flex-row justify-center align-center">
                    <v-switch v-model="switchExtensions" label="Display Email Domain"></v-switch>

                    <v-menu
                        offset-y
                        :close-on-click="chartStyling.closeOnClick"
                        :close-on-content-click="chartStyling.closeOnContentClick"
                        transition="slide-y-transition"
                        nudge-bottom="10"
                        v-model="showSettings"
                    >
                        <template v-slot:activator="{ on }">
                            <v-btn
                                width="150"
                                v-on="on"
                                dark
                                color="primary"
                                @click="showSettings = true"
                                class="mx-2"
                                small
                            >
                                Settings
                                <v-icon small class="ml-2">fas fa-cog</v-icon>
                            </v-btn>
                        </template>
                        <v-card width="500">
                            <v-card-text>
                                <div class="d-flex">
                                    <v-subheader
                                        class="pl-0 font-weight-bold"
                                        style="width:7em;"
                                    >Diameter:</v-subheader>
                                    <v-slider
                                        v-model="updateDiameter"
                                        class="mt-2"
                                        max="900"
                                        min="600"
                                        :size="chartStyling.diameter"
                                        thumb-label
                                        color="primary"
                                        track-color="#BDBDBD"
                                    ></v-slider>
                                </div>
                                <div class="d-flex mt-n4">
                                    <v-subheader
                                        class="pl-0 font-weight-bold"
                                        style="width:7em;"
                                    >Tension:</v-subheader>
                                    <v-slider
                                        v-model="getTension"
                                        max="10"
                                        min="1"
                                        :size="chartStyling.diameter"
                                        thumb-label
                                        class="mt-2"
                                        color="primary"
                                        track-color="#BDBDBD"
                                    ></v-slider>
                                </div>
                                <div class="d-flex mt-n4">
                                    <v-subheader
                                        class="pl-0 font-weight-bold"
                                        style="width:7em;"
                                    >Text Offset:</v-subheader>
                                    <v-slider
                                        v-model="chartStyling.textOffset"
                                        max="15"
                                        min="4"
                                        :size="chartStyling.diameter"
                                        thumb-label
                                        class="mt-2"
                                        color="primary"
                                        track-color="#BDBDBD"
                                    ></v-slider>
                                </div>
                                <div class="d-flex mt-n4">
                                    <v-subheader
                                        class="pl-0 font-weight-bold"
                                        style="width:7em;"
                                    >Text Size:</v-subheader>
                                    <v-slider
                                        v-model="chartStyling.fontSize"
                                        max="12"
                                        min="8"
                                        :size="chartStyling.diameter"
                                        thumb-label
                                        class="mt-2"
                                        color="primary"
                                        track-color="#BDBDBD"
                                    ></v-slider>
                                </div>
                                <v-btn small color="alt" dark @click="showSettings = false">
                                    Close
                                    <v-icon small class="ml-2">fas fa-times</v-icon>
                                </v-btn>
                            </v-card-text>
                        </v-card>
                    </v-menu>

                    <v-btn width="150" small color="neutral" dark @click="saveSvg">
                        Save Image
                        <v-icon small class="ml-2">fas fa-save</v-icon>
                    </v-btn>
                </v-card>

                <SelectionComponent :selectedemail="selectedData" />
            </v-col>
            <v-col>
                <v-card
                    v-show="tooltip.showTooltip"
                    :style="tooltipStyle"
                    style="position: absolute;z-index:99"
                    elevation="5"
                    width="300"
                >
                    <v-card-title class="primary-color" style="font-size: 0.8em;">{{ tooltip.text }}</v-card-title>
                    <v-card-text>
                        <div style="font-size: 0.8em; color: green;">Sent: {{ tooltip.outgoing }}</div>
                        <div
                            style="font-size: 0.8em; color: tomato;"
                        >Received: {{ tooltip.incoming }}</div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-overlay :value="overlay">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>

        <EdgeTable v-bind:originaldata="original" />
    </div>
</template>

<script>
    import * as d3 from "d3";
    import EdgeTable from "~/components/EdgeTable";
    import SelectionComponent from "~/components/SelectionComponent";
    import Moment from "moment";
    import { extendMoment } from "moment-range";
    const moment = extendMoment(Moment);
    import emails from "~/static/email_100.json";
    import clusters from "~/static/EmployeeRecords.json";
    import saveSvgAsPng from "save-svg-as-png";

    export default {
        components: {
            EdgeTable,
            SelectionComponent
        },

        filters: {
            splitItem(value, extensions) {
                return extensions ? value || "" : (value || "").split("@")[0];
            },
            clustered(value) {
                return;
            }
        },
        data() {
            return {
                uniqueClusters: [],
                overlay: false,
                switchExtensions: false,
                showSettings: false,
                dates: [],
                datePicker: {
                    limitMin: "",
                    limitMax: ""
                },
                menu: false,
                data: [],
                chartStyling: {
                    diameter: 750,
                    tension: 9,
                    maxTension: 1,
                    minTension: 0.1,
                    fontSize: 9,
                    textOffset: 8,
                    closeOnClick: true,
                    closeOnContentClick: false
                },
                tooltip: {
                    showTooltip: false,
                    top: 0,
                    left: 0,
                    text: "",
                    outgoing: "",
                    incoming: ""
                },
                records: "",
                original: [],
                links: [],
                nodes: [],
                selectedData: [],
                formatedData: [],
                clusterData: [],
                dialog: false,
                output: null
            };
        },
        mounted() {
            this.fetchData();
            // this.draw();
            // this.drawNodes();
        },
        watch: {
            dates() {
                if (this.dates.length == 1) {
                    let rangeData = moment(this.dates[0], "YYYY-MM-DD");
                    let findRange = moment.range(rangeData, rangeData);
                    let newData = this.original.filter(d =>
                        findRange.contains(moment(d.Date, "MM-DD-YYYY"))
                    );
                    this.draw(newData);
                } else {
                    let rangeStart = moment(this.dates[0], "YYYY-MM-DD");
                    let rangeFinish = moment(this.dates[1], "YYYY-MM-DD");
                    let getRange = moment.range(rangeStart, rangeFinish);
                    let newRangedData = this.original.filter(d =>
                        getRange.contains(moment(d.Date, "MM/DD/YYYY"))
                    );
                    this.draw(newRangedData);
                }
            }
        },
        methods: {
            async saveSvg() {
                this.overlay = true;
                let getImage = await saveSvgAsPng.saveSvgAsPng(
                    this.$refs.diagram,
                    "diagram.png",
                    {
                        scale: 2,
                        backgroundColor: "#FFFFFF",
                        excludeUnusedCss: true
                    }
                );
                this.overlay = false;
            },

            updateDialog(newValue) {
                this.dialog = newValue;
            },

            selectedItem(item) {
                Array.prototype.push.apply(item.data.outgoing, item.data.incoming);
                this.selectedData = item.data.outgoing;
            },
            objectClass(b) {
                return {
                    "link--source": b.source.source,
                    "link--target": b.target.target
                };
            },

            fetchData() {
                // let data = await d3.json("./dumb.json");

                this.original = emails;
                this.clusterData = clusters;

                let stringOFDates = this.original.map(d => {
                    return moment(d.Date, "MM/DD/YYYY");
                });
                let justMinDate = moment.min(stringOFDates);
                this.datePicker.limitMin = justMinDate.format("YYYY-MM-DD");

                let startingDate = justMinDate.format("YYYY-MM-DD");
                let nextDate = justMinDate.add(1, "d").format("YYYY-MM-DD");

                let findRangeBeginning = moment.range(startingDate, nextDate);
                let newData = this.original.filter(d =>
                    findRangeBeginning.contains(moment(d.Date, "MM/DD/YYYY"))
                );

                this.dates = [startingDate, nextDate];

                this.datePicker.limitMax = moment
                    .max(stringOFDates)
                    .format("YYYY-MM-DD");

                // this.draw(newData);
                // this.data = this.wrangleData(this.formatedData);
                // this.links = this.drawLinks();
                // this.nodes = this.drawNodes();
            },
            draw(data) {
                if (data) {
                    this.formatedData = this.formatData(data, this.clusterData);
                } else {
                    this.formatedData = this.formatData(
                        this.original,
                        this.clusterData
                    );
                }

                this.data = this.wrangleData(this.formatedData);
                // this.links = this.drawLinks();
                // this.nodes = this.drawNodes();
            },

            mouseOver(thisNode, event) {
                this.tooltip.showTooltip = true;
                this.tooltip.top = event.pageY - 30;
                this.tooltip.left = event.pageX;
                this.tooltip.text = thisNode.text;
                this.tooltip.outgoing = thisNode.outgoing;
                this.tooltip.incoming = thisNode.incoming;
                this.nodes.map(d => {
                    d.target = d.source = false;
                });

                this.links.map(d => {
                    if (d.source.data == thisNode.data.data) {
                        d.source.source = true;
                    }

                    if (d.target.data == thisNode.data.data) {
                        d.target.target = true;
                    }
                });
            },
            mouseLeave(thisNode) {
                this.tooltip.showTooltip = false;

                this.links.map(d => {
                    if (d.source.data == thisNode.data.data) {
                        d.source.source = false;
                    }
                    if (d.target.data == thisNode.data.data) {
                        d.target.target = false;
                    }
                });
            },
            formatData(data, records) {
                records = records.map(d => {
                    return {
                        email: d.EmailAddress,
                        type: d.CurrentEmploymentType
                    };
                });
                let mySet = new Set();
                let results = [];
                let fromData = data.map(d => {
                    if (!mySet.has(d.From)) {
                        mySet.add(d.From);
                        let searchType = records.find(
                            element => element.email === d.From
                        );
                        results.push({
                            id: d.From,
                            group: searchType["type"]
                        });
                    }
                    // Convert String to Array
                    let breaker = d.To.split(",").map(function(word) {
                        word = word.trim();
                        if (!mySet.has(word)) {
                            mySet.add(word);
                            let searchType = records.find(
                                element => element.email === word
                            );
                            results.push({
                                id: word,
                                group: searchType["type"]
                            });
                        }
                        return word;
                    });
                    return {
                        source: d.From,
                        target: breaker,
                        message: d.Subject,
                        date: d.Date
                    };
                });
                return {
                    nodes: results,
                    links: fromData
                };
            },
            wrangleData(data) {
                const { nodes, links } = data;

                const groupById = new Map();
                const nodeById = new Map(nodes.map(node => [node.id, node]));

                for (const node of nodes) {
                    let group = groupById.get(node.group);
                    if (!group)
                        groupById.set(
                            node.group,
                            (group = {
                                name: node.group,
                                children: []
                            })
                        );
                    group.children.push(node);
                    node.targetIds = [];
                    node.outgoing = [];
                    node.incoming = [];
                }

                for (const {
                    source: sourceId,
                    target: targetId,
                    message: messageId,
                    date: dateId
                } of links) {
                    const source = nodeById.get(sourceId);
                    const target = targetId.map(function(d) {
                        let nodeGet = nodeById.get(d);
                        const targetMessage = {};
                        targetMessage["state"] = "Received";
                        targetMessage["from"] = sourceId;
                        targetMessage["to"] = targetId;
                        targetMessage["message"] = messageId;
                        targetMessage["date"] = dateId;
                        nodeGet.incoming.push(targetMessage);
                    });

                    targetId.map(d => source.targetIds.push(d));

                    const messagesObject = {};
                    messagesObject["state"] = "Sent";
                    messagesObject["from"] = sourceId;
                    messagesObject["to"] = targetId;
                    messagesObject["message"] = messageId;
                    messagesObject["date"] = dateId;
                    source.outgoing.push(messagesObject);
                }

                return {
                    children: [...groupById.values()]
                };
            },
            drawNodes() {
                var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

                var root = this.cluster(d3.hierarchy(this.data));
                this.nodes = root.leaves().map((d, i) => {
                    let textAnchor = d.x < 180 ? "start" : "end";
                    // console.log(d.data.id);
                    let text = d.data.id;

                    let transform =
                        "rotate(" +
                        (d.x - 90) +
                        ")translate(" +
                        (d.y + this.chartStyling.textOffset) +
                        ",0)" +
                        (d.x < 180 ? "" : "rotate(180)");
                    return {
                        id: i + 1,
                        dy: "0.28em",
                        text: text,
                        outgoing: d.data.outgoing ? d.data.outgoing.length : "",
                        incoming: d.data.incoming ? d.data.incoming.length : "",
                        textAnchor: textAnchor,
                        transform: transform,
                        data: d,
                        fill: colorScale(d.data.group),
                        group: d.data.group
                    };
                });

                this.uniqueClusters = [
                    ...new Map(
                        this.nodes.map(item => [item["group"], item])
                    ).values()
                ];
                return this.nodes;
            },
            drawLinks() {
                var root = this.cluster(d3.hierarchy(this.data));
                const map = new Map(root.leaves().map(d => [d.data.id, d]));
                if (map.size > 1) {
                    let linkColors = d3.merge(
                        root.leaves().map(d =>
                            d.data.targetIds.map(i => {
                                return d.path(map.get(i));
                            })
                        )
                    );
                    this.links = linkColors.map(d => {
                        d.source = d[0];
                        d.source.source = false;
                        d.target = d[d.length - 1];
                        d.target.target = false;
                        return d;
                    });
                    return this.links;
                }
            }
        },
        computed: {
            tooltipStyle() {
                return {
                    top: this.tooltip.top + "px",
                    left: this.tooltip.left + "px"
                };
            },
            getDates() {
                return this.dates.join(" - ");
            },
            getLines() {
                return d3
                    .radialLine()
                    .curve(d3.curveBundle.beta(this.chartStyling.tension / 10))
                    .radius(function(d) {
                        return d.y;
                    })
                    .angle(function(d) {
                        return (d.x / 180) * Math.PI;
                    });
            },
            cluster() {
                return d3.cluster().size([360, this.getInnerRadius]);
            },
            getTension: {
                get() {
                    return this.chartStyling.tension;
                },
                set(newValue) {
                    this.chartStyling.tension = newValue;
                }
            },
            getMaxTension() {
                return this.chartStyling.maxTension * 10;
            },
            getMinTension() {
                return this.chartStyling.minTension * 10;
            },
            getNodes() {
                return this.drawNodes();
            },
            getLinks() {
                return this.drawLinks();
            },
            style() {
                return `translate(400,325)`;
            },
            getRadius() {
                return this.chartStyling.diameter / 2;
            },
            getInnerRadius() {
                // 360
                return this.getRadius - 150;
            },
            updateDiameter: {
                get() {
                    return this.chartStyling.diameter;
                },
                set(newValue) {
                    this.chartStyling.diameter = newValue;
                }
            }
        }
    };
</script>

<style>
/* svg {
    background-color: lightskyblue;
} */

.node {
    /* font: 300 9px "Helvetica Neue", Helvetica, Arial, sans-serif; */
    /* font-size: 8px; */
    fill: #000;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.node:hover {
    fill: #000;
    cursor: pointer;
}

.link {
    stroke: #1975d2;
    stroke-opacity: 0.2;
    fill: none;
}

.node:hover,
.node--source,
.node--target {
    font-weight: 700;
}

.node--source {
    fill: #d62728;
}

.node--target {
    fill: #2ca02c;
}

.link--source,
.link--target {
    stroke-opacity: 1;
    stroke-width: 2px;
}

.link--source {
    stroke: #2ca02c;
}

.link--target {
    stroke: #d62728;
}
</style>
