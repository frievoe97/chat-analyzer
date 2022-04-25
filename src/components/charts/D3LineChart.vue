<template>
    <div id="my_dataviz"></div>
</template>

<script>
// eslint-disable-next-line
import * as d3 from "d3";
export default {
    name: "D3LineChart",
    components: {},
    props: {
        data: Object,
    },
    data() {
        return {
            dataObj: [
                {
                    date: "1-May-12",
                    close: "68.13",
                    open: "34.12",
                },
                {
                    date: "30-Apr-12",
                    close: "63.98",
                    open: "45.56",
                },
                {
                    date: "27-Apr-12",
                    close: "67.00",
                    open: "67.89",
                },
                {
                    date: "26-Apr-12",
                    close: "89.70",
                    open: "78.54",
                },
                {
                    date: "25-Apr-12",
                    close: "99.00",
                    open: "89.23",
                },
                {
                    date: "24-Apr-12",
                    close: "130.28",
                    open: "99.23",
                },
            ],
        };
    },
    mounted() {
        this.prepareData();
    },
    watch: {
        data() {
            this.prepareData();
        },
    },
    methods: {
        /* eslint-disable */
        prepareData: function () {
            console.log(this.data);
            if (!this.data.allMessages.length) return;
            this.dataObj = [];
            for (
                let i = 0;
                i < this.data.totalConfig.messagesPerTime.x.length;
                i++
            ) {
                this.dataObj.push({
                    time: this.data.totalConfig.messagesPerTime.x[i],
                    number: this.data.totalConfig.messagesPerTime.y[i],
                    name: "Gesamt",
                });
            }
            for (let i = 0; i < this.data.configPerPersoan.length; i++) {
                for (
                    let j = 0;
                    j < this.data.configPerPersoan[i].messagesPerTime.x.length;
                    j++
                ) {
                    this.dataObj.push({
                        time: this.data.configPerPersoan[i].messagesPerTime.x[
                            i
                        ],
                        number: this.data.configPerPersoan[i].messagesPerTime.y[
                            i
                        ],
                        name: this.data.names[i],
                    });
                }
            }
            this.init();
        },
        init: function () {
            if (!this.data.allMessages.length) return;
            console.log(this.dataObj);
            var margin = { top: 20, right: 20, bottom: 30, left: 50 },
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            // parse the date / time
            var parseTime = d3.timeParse("%d-%b-%y");

            // set the ranges
            var x = d3.scaleLinear().range([0, width]);
            var y = d3.scaleLinear().range([height, 0]);

            // define the 1st line
            var valueline = d3
                .line()
                .x(function (d) {
                    return x(d.x);
                })
                .y(function (d) {
                    return y(d.number);
                });

            // define the 2nd line

            // append the svg obgect to the body of the page
            // appends a 'group' element to 'svg'
            // moves the 'group' element to the top left margin
            var svg = d3
                .select("#my_dataviz")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr(
                    "transform",
                    "translate(" + margin.left + "," + margin.top + ")"
                );

            // Get the data
            // format the data
            /*
            this.data.totalConfig.messagesPerTime.x.forEach(function (d) {
                //d.x = +d.x;
                //d.y = +d.y;
            });
            */

            this.dataObj.forEach(function (d) {
                d.x = +d.x;
                d.number = +d.number;
            });

            // Scale the range of the data
            x.domain([0, 23]);
            y.domain([
                0,
                d3.max(this.dataObj, function (d) {
                    return Math.max(0, d.number);
                }),
            ]);
            /*

            x.domain(
                d3.extent(this.data.totalConfig.messagesPerTime, function (d) {
                    return d.x;
                })
            );
            y.domain([0, d3.max(23)]);
            */

            // Add the valueline path.

            svg.append("path")
                .data([this.dataObj])
                .attr("class", "line")
                .style("stroke", "blue")
                .attr("d", valueline);

            // Add the valueline2 path.

            // Add the X Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add the Y Axis
            svg.append("g").call(d3.axisLeft(y));
        },
    },
};
</script>
<!-- css loaderhttps://vue-loader.vuejs.org/guide/scoped-css.html#mixing-local-and-global-styles -->
<style></style>
