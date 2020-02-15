<template>
    <v-row>
        <v-col cols="8">
            <svg :width="diameter" :height="diameter">
                <g :transform="style" id="chart" />
            </svg>
        </v-col>
        <v-col cols="4">
            <v-subheader class="pl-0">Diameter:</v-subheader>
            <v-slider v-model="updateDiameter" max="1000" min="100" :size="diameter" thumb-label></v-slider>
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
                diameter: 800
            };
        },
        mounted() {
            this.fetchData();
            // this.drawEdges();
        },
        methods: {
            async fetchData() {
                let data = await d3.json("./flare.json");
                this.drawEdges(data);
                // this.loadData = data;
            },
            drawEdges(data) {
                var cluster = d3.cluster().size([360, this.getInnerRadius]);
                var line = d3
                    .radialLine()
                    .curve(d3.curveBundle.beta(0.85))
                    .radius(function(d) {
                        return d.y;
                    })
                    .angle(function(d) {
                        return (d.x / 180) * Math.PI;
                    });

                // var svg = d3
                //     .select("svg")
                //     .append("g")
                //     .attr(
                //         "transform",
                //         "translate(" + this.getRadius + "," + this.getRadius + ")"
                //     );
                var svg = d3.select("#chart");
                var link = svg.append("g").selectAll(".link");
                var node = svg.append("g").selectAll(".node");

                var root = this.packageHierarchy(data).sum(function(d) {
                    return d.size;
                });

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
                            node.key = name.substring(i + 1);
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
            style() {
                return `translate(${this.getRadius},${this.getRadius})`;
            },
            getRadius() {
                // 480
                return this.diameter / 2;
            },
            getInnerRadius() {
                // 360
                return this.getRadius - 120;
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
.node {
    font: 10px sans-serif;
}

.link {
    stroke: steelblue;
    stroke-opacity: 0.5;
    fill: none;
    pointer-events: none;
}
</style>
