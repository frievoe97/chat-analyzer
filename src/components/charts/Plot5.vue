<template>
    <div>
        <div id="plot-5-title">Who Answers First?</div>
        <div :id="classID"></div>
        <div class="buttons">
            <div @click="changeIndex(0)" class="single-button">Anzahl</div>
            <div @click="changeIndex(1)" class="single-button">
                Anzahl Wörter
            </div>
        </div>
    </div>
</template>

<script>
// eslint-disable-next-line
import * as d3 from "d3";

export default {
    name: "Plot-5",
    components: {},
    props: {
        data: Object,
        classIDProp: String,
    },
    data() {
        return {
            plotData: [],
            margin: { top: 20, right: 20, bottom: 20, left: 20 },
            //width: 876 - 100,
            width: 350,
            //width: 576 - 100,
            //height: 350,
            height: 400,
            index: 0,
            classID: "plot-5",
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
    },
    methods: {
        getStartWidth: async function () {
            this.width =
                document.querySelector("#grid-" + this.classID).clientWidth -
                (this.margin.left + this.margin.right);
            if (this.width > this.height) {
                this.width = this.height;
            } else {
                this.height = this.width;
            }
        },
        myEventHandler: function () {
            // eslint-disable-next-line
            const widthPlot1 =
                document.querySelector("#grid-" + this.classID).clientWidth -
                (this.margin.left + this.margin.right);
            if (this.width != widthPlot1) {
                this.width = widthPlot1;
            }
            if (this.width > this.height) {
                this.width = this.height;
            } else {
                this.height = this.width;
            }
        },
        changeIndex: function (index) {
            this.index = index;
            console.log(index);
        },
        calculateData: function () {
            this.plotData = [[], []];
            console.log(this.data);

            // Anzahl -> 0
            // Länge -> 1
            for (let i = 0; i < this.data.messagesPerPersoan.length; i++) {
                this.plotData[0].push(this.data.messagesPerPersoan[i].length);
                this.plotData[1].push(0);
                for (
                    let j = 0;
                    j < this.data.messagesPerPersoan[i].length;
                    j++
                ) {
                    this.plotData[1][i] =
                        this.plotData[1][i] +
                        this.data.messagesPerPersoan[i][j].msg.split(" ")
                            .length;
                }
                this.plotData[1][i] = this.plotData[1][i] / this.plotData[0][i];
            }
            this.createPlot();
        },
        createPlot: function () {
            d3.select("#" + this.classID + "-svg").remove();
            let radius = Math.min(this.width, this.height) / 2 - this.margin;
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

            const pie = d3
                .pie()
                .sort(null) // Do not sort group by size
                .value((d) => d[1]);
            const data_ready = pie(Object.entries(this.plotData));

            // The arc generator
            const arc = d3
                .arc()
                .innerRadius(radius * 0.5) // This is the size of the donut hole
                .outerRadius(radius * 0.8);

            // Another arc that won't be drawn. Just for labels positioning
            // eslint-disable-next-line
            const outerArc = d3
                .arc()
                .innerRadius(radius * 0.9)
                .outerRadius(radius * 0.9);

            svg.selectAll("allSlices")
                .data(data_ready)
                .join("path")
                .attr("d", arc)
                .attr("fill", (d) => this.colors[d.index])
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .style("opacity", 0.7);

            // Add the polylines between chart and labels:
            /*
            svg.selectAll("allPolylines")
                .data(data_ready)
                .join("polyline")
                .attr("stroke", "black")
                .style("fill", "none")
                .attr("stroke-width", 1)
                .attr("points", function (d) {
                    const posA = arc.centroid(d); // line insertion in the slice
                    const posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
                    const posC = outerArc.centroid(d); // Label position = almost the same as posB
                    const midangle =
                        d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
                    posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                    return [posA, posB, posC];
                });

            // Add the polylines between chart and labels:
            
            svg.selectAll("allLabels")
                .data(data_ready)
                .join("text")
                .text((d) => d.data[0])
                .attr("transform", function (d) {
                    const pos = outerArc.centroid(d);
                    const midangle =
                        d.startAngle + (d.endAngle - d.startAngle) / 2;
                    pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                    return `translate(${pos})`;
                })
                .style("text-anchor", function (d) {
                    const midangle =
                        d.startAngle + (d.endAngle - d.startAngle) / 2;
                    return midangle < Math.PI ? "start" : "end";
                });
                */
        },
    },
};
</script>
<style>
#plot-5-title {
    margin: auto;
    font-size: 1.5rem;
    height: 40px;
    color: #000;
}

.single-button {
    font-size: 1.5rem;
    color: #000;
    float: left;
    margin-right: 15px;
}

.single-button:last-child {
    margin-right: 0px;
}

.buttons {
    height: 40px;
    width: max-content;
    margin: auto;
}
</style>
