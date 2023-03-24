<template>
    <div>
        <div id="plot-4-title">Who Answers First?</div>
        <div :id="classID"></div>
    </div>
</template>

<script>
import * as d3 from "d3";

export default {
    name: "Plot-3",
    components: {},
    props: {
        data: Object,
        classIDProp: String,
        selectedNames: Array,
    },
    data() {
        return {
            plotData: [],
            margin: { top: 20, right: 20, bottom: 20, left: 20 },
            //width: 876 - 100,
            width: 350,
            //width: 576 - 100,
            //height: 350,
            height: 440,
            classID: "plot-4",
            //colors: ["#440154ff", "#31668dff", "#37b578ff", "#fde725ff"],
            colors: [
                "red",
                "green",
                "blue",
                "black",
                "brown",
                "coral",
                "darkblue",
                "orange",
                "darkorange",
                "darkviolet",
                "indigo",
                "lightsalmon",
                "midnightblue",
                "red",
                "green",
                "blue",
                "black",
                "brown",
                "coral",
                "darkblue",
                "orange",
                "darkorange",
                "darkviolet",
                "indigo",
                "lightsalmon",
                "midnightblue",
                "red",
                "green",
                "blue",
                "black",
                "brown",
                "coral",
                "darkblue",
                "orange",
                "darkorange",
                "darkviolet",
                "indigo",
                "lightsalmon",
                "midnightblue",
            ],
        };
    },
    mounted() {
        this.classID = this.classIDProp;
        window.addEventListener("resize", this.myEventHandler);
        this.getStartWidth();
    },
    watch: {
        data() {
            this.calculateData();
        },
        selectedNames() {
            this.calculateData();
        },
    },
    methods: {
        getStartWidth: async function () {
            this.width =
                document.querySelector("#grid-" + this.classID).clientWidth -
                (this.margin.left + this.margin.right);
            // if (this.width > this.height) {
            //     this.width = this.height;
            // } else {
            //     this.height = this.width;
            // }
        },
        myEventHandler: function () {
            // eslint-disable-next-line
            const widthPlot1 =
                document.querySelector("#grid-" + this.classID).clientWidth -
                (this.margin.left + this.margin.right);
            if (this.width != widthPlot1) {
                this.width = widthPlot1;
            }
            /*
            if (this.width > this.height) {
                this.width = this.height;
            } else {
                this.height = this.width;
            }
            */
        },
        calculateData: function () {
            console.log(this.selectedNames);
            this.plotData = [];
            for (let i = 0; i < this.data.names.length; i++) {
                if (this.selectedNames[i].active) {
                    let tempArray = [];
                    for (let j = 0; j < this.data.names.length; j++) {
                        if (this.selectedNames[i].active) {
                            tempArray.push([0]);
                        }
                    }
                    this.plotData.push(tempArray);
                }
            }
            console.log(this.plotData);
            for (let i = 0; i < this.data.allMessages.length - 1; i++) {
                // eslint-disable-next-line
                const indexFirstMsg = this.data.names.indexOf(
                    this.data.allMessages[i].name
                );
                // eslint-disable-next-line
                const indexSecondMsg = this.data.names.indexOf(
                    this.data.allMessages[i + 1].name
                );

                //console.log(indexFirstMsg, indexSecondMsg);

                this.plotData[indexFirstMsg][indexSecondMsg]++;
            }

            // Scale down
            /*
            let sum = 0;
            for (let i = 0; i < this.data.names.length; i++) {
                for (let j = 0; j < this.data.names.length; j++) {
                    sum = sum + this.plotData[i][j];
                }
            }
            for (let i = 0; i < this.data.names.length; i++) {
                for (let j = 0; j < this.data.names.length; j++) {
                    this.plotData[i][j] = this.plotData[i][j] / sum;
                }
            }
            */
            this.createPlot();
        },
        createPlot: function () {
            // eslint-disable-next-line
            d3.select("#" + this.classID + "-svg").remove();

            let svg = d3
                .select("#" + this.classID)
                .append("svg")
                .attr("id", this.classID + "-svg")
                .attr("width", this.width)
                .attr("height", this.height)
                .append("g")
                .attr(
                    "transform",
                    "translate(" + this.width / 2 + "," + this.height / 2 + ")"
                );

            // eslint-disable-next-line
            let res = d3.chord().padAngle(0.05).sortSubgroups(d3.descending)(
                this.plotData
            );

            // eslint-disable-next-line
            const colors = this.colors;

            svg.datum(res)
                .append("g")
                .selectAll("path")
                .data(function (d) {
                    return d;
                })
                .enter()
                .append("path")
                .attr(
                    "d",
                    d3
                        .ribbon()
                        .radius(
                            this.height / 2 -
                                this.margin.left -
                                this.margin.right
                        )
                )
                /*.style("fill", function (d) {
                    console.log(d);
                    return colors[d.source.index + d.target.index];
                })*/
                .style("fill", (d) => colors[d.source.index])
                .style("opacity", 0.8)
                .style("stroke", "black");

            // eslint-disable-next-line
            let group = svg
                .datum(res)
                .append("g")
                .selectAll("g")
                .data(function (d) {
                    return d.groups;
                })
                .enter();

            group
                .append("g")
                .append("path")
                .style("fill", (d, i) => colors[i])
                .attr(
                    "d",
                    d3
                        .arc()
                        .innerRadius(
                            this.height / 2 +
                                5 -
                                this.margin.left -
                                this.margin.right
                        )
                        .outerRadius(
                            this.height / 2 +
                                10 -
                                this.margin.left -
                                this.margin.right
                        )
                );

            // eslint-disable-next-line
            const height = this.height;
            const names = this.data.names;

            group
                .append("text")
                /*
                .attr("transform", function (d) {
                    const angle = (d.startAngle + d.endAngle) / 2;
                    const deg = angle * (180 / Math.PI);
                    return "rotate(" + deg + ")"; // translate(" + width / 2 + ")
                })
                */
                .attr("text-anchor", "middle")
                .attr("x", function (d) {
                    const sin = Math.sin((d.startAngle + d.endAngle) / 2);
                    // eslint-disable-next-line
                    const x = (sin * height) / 2;
                    return x;
                    //return 0;
                })
                .attr("y", function (d) {
                    const cos = Math.cos((d.startAngle + d.endAngle) / 2);
                    // eslint-disable-next-line
                    const y = (cos * height) / 2;
                    //return -((width - 40) / 2);
                    return -y;
                })
                .text(function (d) {
                    return names[d.index];
                });

            /*
            const width = this.width;
            const margin = this.margin.left;

            group
                .selectAll(".group-tick")
                .data(function (d) {
                    const step = 100;
                    var k = (d.endAngle - d.startAngle) / d.value;
                    return d3.range(0, d.value, step).map(function (value) {
                        return {
                            value: value,
                            angle: value * k + d.startAngle,
                        };
                    });
                }) // Controls the number of ticks: one tick each 25 here.
                .enter()
                .append("g")
                .attr("transform", function (d) {
                    return (
                        "rotate(" +
                        ((d.angle * 180) / Math.PI - 90) +
                        ") translate(" +
                        parseInt(width / 2 - margin + 10) +
                        ",0)"
                    );
                })
                .append("line") // By default, x1 = y1 = y2 = 0, so no need to specify it.
                .attr("x2", 6)
                .attr("stroke", "black");
                */
        },
        groupTicks: function (d, step) {
            var k = (d.endAngle - d.startAngle) / d.value;
            return d3.range(0, d.value, step).map(function (value) {
                return { value: value, angle: value * k + d.startAngle };
            });
        },
    },
};
</script>
<style>
#plot-4-title {
    margin: auto;
    font-size: 1.5rem;
    height: 40px;
    color: #000;
}
</style>
