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
                            <!-- <g :transform="style" id="chart" /> -->
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
                diameter: 750,
                records: ""
            };
        },
        mounted() {
            this.fetchData();
            // this.drawEdges();
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
                            imports: breaker
                        };
                    } else {
                        return {
                            name: "Other." + d.From,
                            imports: breaker
                        };
                    }
                });
                this.drawEdges(data);
            },
            drawEdges(data) {
                var cluster = d3.cluster().size([360, this.getInnerRadius]);
                var line = d3
                    .radialLine()
                    .curve(d3.curveBundle.beta(0.81))
                    .radius(function(d) {
                        return d.y;
                    })
                    .angle(function(d) {
                        return (d.x / 180) * Math.PI;
                    });

                var svg = d3
                    .select("svg")
                    .append("g")
                    .attr("transform", "translate(400, 325)");
                // var svg = d3.select("#chart");
                var link = svg.append("g").selectAll(".link");
                var node = svg.append("g").selectAll(".node");

                var root = this.packageHierarchy(data);
                cluster(root);

                link = link
                    .data(this.packageImports(root.leaves()))
                    .enter()
                    .append("path")
                    .each(function(d) {
                        (d.source = d[0]), (d.target = d[d.length - 1]);
                    })
                    .attr("class", "link")
                    .attr("d", line);

                node = node.data(root.leaves()).enter();

                node.append("text")
                    .attr("class", "node")
                    .attr("dy", "0.28em")
                    .attr("transform", function(d) {
                        return (
                            "rotate(" +
                            (d.x - 90) +
                            ")translate(" +
                            (d.y + 8) +
                            ",0)" +
                            (d.x < 180 ? "" : "rotate(180)")
                        );
                    })
                    .attr("text-anchor", function(d) {
                        return d.x < 180 ? "start" : "end";
                    })
                    .text(function(d) {
                        return d.data.key.split("@")[0];
                    })
                    .on("mouseover", mouseovered)
                    .on("mouseout", mouseouted);

                function outed(d) {
                    console.log(d3.select(this));
                }

                function mouseovered(d) {
                    node.each(function(n) {
                        n.target = n.source = false;
                    });

                    link.classed("link--target", function(l) {
                        if (l.target === d) return (l.source.source = true);
                    })
                        .classed("link--source", function(l) {
                            if (l.source === d) return (l.target.target = true);
                        })
                        .filter(function(l) {
                            return l.target === d || l.source === d;
                        })
                        .each(function() {
                            this.parentNode.appendChild(this);
                        });

                    node.classed("node--target", function(n) {
                        return n.target;
                    }).classed("node--source", function(n) {
                        return n.source;
                    });
                }
                function mouseouted() {
                    link.classed("link--target", false).classed(
                        "link--source",
                        false
                    );

                    node.classed("node--target", false).classed(
                        "node--source",
                        false
                    );
                }
            },
            packageHierarchy(data) {
                var map = {};

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
                            // node.key = name.substring(i + 1);
                            node.key = name;
                        }
                    }
                    return node;
                }

                data.forEach(function(d) {
                    find(d.name, d);
                });
                return d3.hierarchy(map[""]);
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
            }
        },
        computed: {
            // style() {
            //     return `translate(${this.getRadius},${this.getRadius})`;
            // },
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
svg {
    /* background-color: lightskyblue; */
}

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
    pointer-events: none;
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
