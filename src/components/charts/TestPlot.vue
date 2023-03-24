<template>
    <div id="plot-outside">
        <div id="plot-inside"></div>
    </div>
</template>

<script>
// eslint-disable-next-line
import * as d3 from "d3";
// eslint-disable-next-line
import { interpolatePath } from "d3-interpolate-path";

export default {
    name: "Plot-1",
    components: {},
    props: {
        data: Object,
    },
    data() {
        return {
            plotData: [
                [
                    [1, 1],
                    [2, 2],
                    [3, 3],
                    [4, 4],
                    [5, 5],
                    [6, 6],
                ],
                [
                    [1, 6],
                    [2, 5],
                    [3, 4],
                    [4, 3],
                    [5, 2],
                    [6, 1],
                ],
            ],
            margin: { top: 20, right: 30, bottom: 30, left: 50 },
            width: 876 - 100,
            //width: 576 - 100,
            height: 350,
            x: {},
            y: {},
            xAxis: {},
            yAxis: {},
            focus: {},
            svg: {},
        };
    },
    mounted() {
        this.createPlot();
    },
    watch: {
        data() {},
        globalWidth() {},
    },
    methods: {
        createPlot: function () {
            // svg
            d3.select("#" + "plot-inside" + "-svg").remove();

            const svg = d3
                .select("#" + "plot-inside")
                .append("svg")
                .attr("id", "plot-inside" + "-svg")
                .attr(
                    "width",
                    this.width + this.margin.left + this.margin.right
                )
                .attr(
                    "height",
                    this.height + this.margin.top + this.margin.bottom
                )
                .append("g")
                .attr(
                    "transform",
                    `translate(${this.margin.left},${this.margin.top})`
                );

            const x = d3.scaleTime().range([0, this.width]);
            const xAxis = d3.axisBottom().scale(x);

            // myXaxis -> plot-1-x-axis
            svg.append("g")
                .attr("transform", `translate(0, ${this.height})`)
                .attr("id", "plot-inside" + "-x-axis");

            const y = d3.scaleLinear().range([this.height, 0]);
            const yAxis = d3.axisLeft().scale(y);
            svg.append("g")
                //.attr("class", "myYaxis")
                .attr("id", "plot-inside" + "-y-axis");

            svg.append("text")
                .attr("id", "plot-inside" + "-y-label")
                .attr("text-anchor", "end")
                .attr("y", "-35px")
                .attr("transform", "rotate(-90)")
                .text("average messages per " + "TEST1");

            this.x = x;
            this.y = y;
            this.xAxis = xAxis;
            this.yAxis = yAxis;
            this.svg = svg;
            this.focus = focus;
        },
        createClassArrays: function () {
            this.classNames = [];
            this.classNamesDot = [];
            for (let i = 0; i <= this.data.names.length; i++) {
                const index = (i + 1).toString();
                this.classNames.push("line-" + index);
                this.classNamesDot.push(".line" + index);
            }
        },
    },
};
</script>

<style>
#plot-outside {
    background-color: antiquewhite;
    width: 900px;
    height: 400px;
}
</style>
