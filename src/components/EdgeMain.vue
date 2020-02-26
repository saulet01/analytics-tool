<template>
    <v-row>
        <v-col lg="7" md="7" sm="12" cols="12">
            <v-card>
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
                                        v-for="b in getLinks"
                                        :key="b.id"
                                        :d="getLines()"
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
                                    >{{ d.text }}</text>
                                </g>
                            </g>
                        </svg>
                    </div>
                </div>
            </v-card>
        </v-col>
        <v-col lg="5" md="5" sm="12" cols="12">
            <v-card class="mx-auto">
                <v-card-title class="headline">Interaction</v-card-title>
                <v-card-text>
                    <v-subheader class="pl-0">Diameter:</v-subheader>
                    <v-slider
                        v-model="updateDiameter"
                        max="1000"
                        min="100"
                        :size="diameter"
                        thumb-label
                    ></v-slider>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    import * as d3 from "d3";
    // const d3 = {
    //     ...require("d3-scale"),
    //     ...require("d3-shape")
    // };
    export default {
        data() {
            return {
                data: [],
                diameter: 750,
                records: "",
                rootLeaves: ""
            };
        },
        mounted() {
            this.fetchData();
            // this.drawNodes();
        },
        methods: {
            async fetchData() {
                let data = await d3.csv("./email_headers.csv");
                let records = await d3.csv("./EmployeeRecords.csv");
                records = records.map(d => {
                    return {
                        email: d.EmailAddress,
                        type: d.CurrentEmploymentType
                    };
                });
                data = data.map((d, i) => {
                    let breaker = d.To.split(",").map(function(item) {
                        item = item.trim();
                        let searchType = records.find(
                            element => element.email === item
                        );
                        if (searchType) {
                            return searchType["type"] + "." + item;
                        } else {
                            return "Other." + item;
                        }
                    });

                    let found = records.find(element => element.email === d.From);

                    // let username = d.From.split("@");
                    // username = username[1] + "." + username[0];
                    if (found) {
                        return {
                            name: found["type"] + "." + d.From,
                            imports: breaker,
                            subject: d.Subject
                        };
                    } else {
                        return {
                            name: "Other." + d.From,
                            imports: breaker,
                            subject: d.Subject
                        };
                    }
                });
                this.data = data;
            },
            drawNodes() {
                var root = this.packageHierarchy(this.data);
                if (root != undefined) {
                    this.cluster(root);
                    return root.leaves().map((d, i) => {
                        let textAnchor = d.x < 180 ? "start" : "end";
                        let transform =
                            "rotate(" +
                            (d.x - 90) +
                            ")translate(" +
                            (d.y + 8) +
                            ",0)" +
                            (d.x < 180 ? "" : "rotate(180)");
                        return {
                            id: i + 1,
                            dy: "0.28em",
                            text: d.data.key.split("@")[0],
                            textAnchor: textAnchor,
                            transform: transform
                        };
                    });
                }
            },
            drawLinks() {
                var root = this.packageHierarchy(this.data);
                if (root != undefined) {
                    return this.packageImports(root.leaves()).map((d, i) => {
                        return {
                            id: i + 1
                        };
                    });
                }
            },
            packageHierarchy(data) {
                data = JSON.parse(JSON.stringify(data));
                let map = {};
                function find(name, data) {
                    var node = map[name],
                        i;
                    if (!node) {
                        node = map[name] = data || { name: name, children: [] };
                        if (name.length) {
                            // node.parent = 'Text'
                            node.parent = find(
                                name.substring(0, (i = name.indexOf(".")))
                            );
                            node.parent.children.push(node);
                            node.key = name.substring(i + 1);
                            // node.key = name;
                        }
                    }
                    return node;
                }

                data.forEach(function(d) {
                    find(d.name, d);
                });
                if (map[""] != undefined) {
                    return d3.hierarchy(map[""]);
                }
            },
            packageImports(nodes) {
                var map = {},
                    imports = [];
                // Compute a map from name to node.
                nodes.forEach(function(d) {
                    map[d.data.name] = d;
                });

                // For each import, construct a link from the source to target node.
                nodes.forEach(function(d) {
                    if (d.data.imports)
                        d.data.imports.forEach(function(i) {
                            imports.push(map[d.data.name].path(map[i]));
                        });
                });

                return imports;
            },
            getLines() {
                const path = d3
                    .radialLine()
                    .curve(d3.curveBundle.beta(0.5))
                    .radius(function(d) {
                        return d.y;
                    })
                    .angle(function(d) {
                        return (d.x / 180) * Math.PI;
                    });
                return path;
            }
        },

        computed: {
            cluster() {
                return d3.cluster().size([360, this.getInnerRadius]);
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
                // 480
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
    font: 300 9px "Helvetica Neue", Helvetica, Arial, sans-serif;
    fill: #000;
}
.node:hover {
    fill: #000;
}

.link {
    stroke: steelblue;
    stroke-opacity: 0.4;
    fill: none;
    /* pointer-events: none; */
}

.node:hover,
.node--source,
.node--target {
    font-weight: 700;
}

.node--source {
    fill: #2ca02c;
}

.node--target {
    fill: #d62728;
}

.link--source,
.link--target {
    stroke-opacity: 1;
    stroke-width: 2px;
}

.link--source {
    stroke: #d62728;
}

.link--target {
    stroke: #2ca02c;
}
</style>
