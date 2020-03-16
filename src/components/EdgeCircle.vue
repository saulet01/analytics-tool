<template>
    <div>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>Whatsapp</v-card-title>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col lg="7" md="7" sm="12" cols="12">
                <v-card elevation="3">
                    <div class="svg-container">
                        <div class id="edge">
                            <svg
                                preserveAspectRatio="xMidYMid meet"
                                viewBox="0 0 800 650"
                                class="svg-content-responsive"
                            >
                                <g :transform="style">
                                    <g>
                                        <path
                                            class="link"
                                            v-for="(b, i) in getLinks"
                                            :key="i"
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
                                            :style="{ fontSize: fontSize + 'px' }"
                                            :data="d.data"
                                            :class="objectNode()"
                                            @mouseover="mouseOver(d)"
                                            @mouseout="mouseLeave(d)"
                                            @click="selectedItem(d.data)"
                                        >{{ d.text }}</text>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                </v-card>
            </v-col>
            <v-col lg="5" md="5" sm="12" cols="12">
                <v-expansion-panels>
                    <v-expansion-panel>
                        <!-- <div class="d-flex"> -->
                        <!-- <v-icon class="ml-2 mr-n3" color="primary">fa-cog</v-icon> -->
                        <v-expansion-panel-header class="headline">Settings</v-expansion-panel-header>
                        <!-- </div> -->
                        <v-expansion-panel-content>
                            <div class="d-flex">
                                <v-subheader class="pl-0" style="width:7em;">Diameter:</v-subheader>
                                <v-slider
                                    v-model="updateDiameter"
                                    class="mt-2"
                                    max="900"
                                    min="600"
                                    :size="diameter"
                                    thumb-label
                                ></v-slider>
                            </div>
                            <div class="d-flex mt-n4">
                                <v-subheader class="pl-0" style="width:7em;">Tension:</v-subheader>
                                <v-slider
                                    v-model="getTension"
                                    max="10"
                                    min="1"
                                    :size="diameter"
                                    thumb-label
                                    class="mt-2"
                                ></v-slider>
                            </div>
                            <div class="d-flex mt-n4">
                                <v-subheader class="pl-0" style="width:7em;">Text Offset:</v-subheader>
                                <v-slider
                                    v-model="textOffset"
                                    max="15"
                                    min="4"
                                    :size="diameter"
                                    thumb-label
                                    class="mt-2"
                                ></v-slider>
                            </div>
                            <div class="d-flex mt-n4">
                                <v-subheader class="pl-0" style="width:7em;">Text Size:</v-subheader>
                                <v-slider
                                    v-model="fontSize"
                                    max="12"
                                    min="8"
                                    :size="diameter"
                                    thumb-label
                                    class="mt-2"
                                ></v-slider>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <SelectionComponent :selectedemail="selectedData" />
            </v-col>
            <v-col></v-col>
        </v-row>

        <EdgeTable v-bind:originaldata="original" />
    </div>
</template>

<script>
    import * as d3 from "d3";
    import EdgeTable from "./EdgeTable";
    import SelectionComponent from "./SelectionComponent";
    // const d3 = {
    //     ...require("d3-scale"),
    //     ...require("d3-shape")
    // };
    export default {
        components: {
            EdgeTable,
            SelectionComponent
        },
        data() {
            return {
                data: [],
                diameter: 750,
                records: "",
                tension: 9,
                maxTension: 1,
                minTension: 0.1,
                fontSize: 9,
                textOffset: 8,
                original: [],
                test: [],
                nodes: [],
                selectedData: []
            };
        },
        mounted() {
            this.fetchData();
            // this.drawNodes();
        },

        methods: {
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
            objectNode(gg) {},
            async fetchData() {
                // let data = await d3.json("./dumb.json");

                let temporal_data = await d3.csv("./email_100.csv");
                this.original = temporal_data;
                let cluster_data = await d3.csv("./EmployeeRecords.csv");
                let gettingFromat = this.formatData(temporal_data, cluster_data);

                this.data = this.wrangleData(gettingFromat);
                this.test = this.drawLinks();
                this.nodes = this.drawNodes();
            },
            mouseOver(thisNode, lines) {
                this.nodes.map(d => {
                    d.target = d.source = false;
                });

                this.test.map(d => {
                    if (d.source.data == thisNode.data.data) {
                        d.source.source = true;
                    }

                    if (d.target.data == thisNode.data.data) {
                        d.target.target = true;
                    }
                });

                //                 this.nodes.map(d => {
                //                     let findSource = this.test.find(
                //                         element => element.source.data == thisNode.data.data
                //                     );

                //                     let findTarget = this.test.find(
                //                         element => element.target.data == thisNode.data.data
                //                     );
                // =                });
                // console.log(this.nodes);
            },
            mouseLeave(thisNode) {
                this.test.map(d => {
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
                    // You can do whatever the fuck you want to do!
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
                var root = this.cluster(d3.hierarchy(this.data));
                let getNodes = root.leaves().map((d, i) => {
                    let textAnchor = d.x < 180 ? "start" : "end";
                    let text = d.data.id;
                    let transform =
                        "rotate(" +
                        (d.x - 90) +
                        ")translate(" +
                        (d.y + this.textOffset) +
                        ",0)" +
                        (d.x < 180 ? "" : "rotate(180)");
                    return {
                        id: i + 1,
                        dy: "0.28em",
                        text: text,
                        textAnchor: textAnchor,
                        transform: transform,
                        data: d
                    };
                });

                return getNodes;
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

                    linkColors = linkColors.map(d => {
                        d.source = d[0];
                        d.source.source = false;
                        d.target = d[d.length - 1];
                        d.target.target = false;
                        return d;
                    });
                    return linkColors;
                }
            }
        },
        computed: {
            getLines() {
                return d3
                    .radialLine()
                    .curve(d3.curveBundle.beta(this.tension / 10))
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
                    return this.tension;
                },
                set(newValue) {
                    this.tension = newValue;
                }
            },
            getMaxTension() {
                return this.maxTension * 10;
            },
            getMinTension() {
                return this.minTension * 10;
            },
            getNodes() {
                return this.nodes;
                // return this.drawNodes();
            },
            getLinks() {
                return this.test;
                // return this.drawLinks();
            },
            style() {
                return `translate(400,325)`;
            },
            getRadius() {
                return this.diameter / 2;
            },
            getInnerRadius() {
                // 360
                return this.getRadius - 150;
            },
            updateDiameter: {
                get() {
                    return this.diameter;
                },
                set(newValue) {
                    this.diameter = newValue;
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
}

.link {
    stroke: steelblue;
    stroke-opacity: 0.4;
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
