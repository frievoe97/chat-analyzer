<template>
    <div class="test-plot"><div id="my_dataviz"></div></div>
</template>

<script>
import Vue from "vue";
import VuePapaParse from "vue-papa-parse";
import * as d3 from "d3";
Vue.use(VuePapaParse);

export default {
    components: {},
    name: "D3BarPlot",
    props: {},
    data() {
        return {
            dataObj: [
                {
                    Country: "United States",
                    Value: "12394",
                },
                {
                    Country: "Germany",
                    Value: "6452",
                },
                {
                    Country: "Poland",
                    Value: "6468",
                },
            ],
        };
    },
    mounted() {
        this.init();
    },
    watch: {},
    methods: {
        init: function () {
            // set the dimensions and margins of the graph
            const margin = { top: 50, right: 50, bottom: 90, left: 50 },
                width = 460 - margin.left - margin.right,
                height = 450 - margin.top - margin.bottom;

            // append the svg object to the body of the page
            const svg = d3
                .select("#my_dataviz")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Parse the Data

            //data = this.dataObj;
            //console.log(data);
            // X axis
            const x = d3
                .scaleBand()
                .range([0, width])
                .domain(this.dataObj.map((d) => d.Country))
                .padding(0.2);
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end")
                .style("color", "black");

            // Add Y axis
            const y = d3.scaleLinear().domain([0, 14000]).range([height, 0]);

            const yAxis = d3.axisLeft().scale(y).ticks(7, ",.0f");
            svg.append("g")
                .call(yAxis)
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end")
                .style("color", "black")
                .style("font-size", "10px");

            // Bars
            svg.selectAll("mybar")
                .data(this.dataObj)
                .join("rect")
                .attr("x", (d) => x(d.Country))
                .attr("width", x.bandwidth())
                .attr("fill", "black")
                // no bar at the beginning thus:
                // eslint-disable-next-line
                .attr("height", (d) => height - y(0)) // always equal to 0
                // eslint-disable-next-line
                .attr("y", (d) => y(0));

            // Animation
            svg.selectAll("rect")
                .transition()
                .duration(800)
                .attr("y", (d) => y(d.Value))
                .attr("height", (d) => height - y(d.Value))
                .delay((d, i) => {
                    console.log(i);
                    return i * 100;
                });
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
