<template>
    <v-row>
        <v-col lg="7" md="7" sm="12" cols="12">
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
        </v-col>
        <v-col lg="5" md="5" sm="12" cols="12">
            <div>
                <v-subheader class="pl-0">Diameter:</v-subheader>
                <v-slider
                    v-model="updateDiameter"
                    max="1000"
                    min="100"
                    :size="diameter"
                    thumb-label
                ></v-slider>
            </div>
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
                        email: d.EmailAddress.toLowerCase(),
                        cluster: d.CurrentEmploymentType.replace(/\s+/g, "")
                    };
                });
                data = data.map(d => {
                    let breaker = d.To.split(",").map(function(item) {
                        return item.trim();
                    });
                    // let username = d.From.split("@");
                    // username = username[1] + "." + username[0];
                    return {
                        name: d.From,
                        imports: breaker
                    };
                });
                console.log(records);

                // console.log(data);
                // this.records = records;
                this.drawEdges(data);
            },
            drawEdges(data) {
                var cluster = d3.cluster().size([360, this.getInnerRadius]);
                var line = d3
                    .radialLine()
                    .curve(d3.curveBundle.beta(0.9))
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

                node = node
                    .data(root.leaves())
                    .enter()
                    .append("text")
                    .attr("class", "node")
                    .attr("dy", "0.31em")
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
                        return d.data.key;
                    })
                    .append("text")
                    .text("Whatsaaaaaaaaaaaaaap")
                    .attr("dy", "1em")
                    .on("mouseover", d => {
                        console.log(d);
                    });
            },
            packageHierarchy(data) {
                var map = {};

                function find(name, data) {
                    var node = map[name],
                        i;
                    if (!node) {
                        node = map[name] = data || { name: name, children: [] };
                        if (name.length) {
                            node.parent = find(
                                name.substring(0, (i = name.lastIndexOf(".")))
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
    font: 0.5em sans-serif;
}

.link {
    stroke: steelblue;
    stroke-opacity: 0.5;
    fill: none;
    pointer-events: none;
}
</style>
