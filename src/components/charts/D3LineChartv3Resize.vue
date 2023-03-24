<template>
    <div>
        <div class="title">
            Number Of Messages er {{ this.indexName[this.index - 1] }}
        </div>
        <div id="container" class="svg-container"></div>
        <!--  <div class="button-box" style="height: 50px">
            <button
                class="button"
                :class="{ active: index == 3 }"
                type="button"
                @click="changeIndex2(3)"
            >
                Year
            </button>
            <button
                class="button"
                :class="{ active: index == 2 }"
                type="button"
                @click="changeIndex2(2)"
            >
                Month
            </button>
            <button
                class="button"
                :class="{ active: index == 1 }"
                type="button"
                @click="changeIndex2(1)"
            >
                Day
            </button>
        </div> -->
    </div>
</template>

<script>
import * as d3 from "d3";
import { interpolatePath } from "d3-interpolate-path";

export default {
    name: "D3LineChartv3Resize",
    components: {},
    props: {
        data: Object,
    },
    data() {
        return {
            plotData: [], // erster Index ist Lisa, Friedrich, Gesamt // Zweiter Index ist unvonverted, perDay, perMonth, perYear
            starteDate: "",
            endDate: "",
            index: 3,
            parseTime: d3.timeParse("%Y-%m-%d"),
            allCurveObjects: [],
            curve: {},
            svg: {},
            xScale: {},
            yScale: {},
            x: {},
            y: {},
            xAxis: {},
            yAxis: {},
            focus: {},
            margin: { top: 50, right: 50, bottom: 50, left: 50 },
            width: 1060 - 100,
            height: 370 - 100,
            indexName: ["Day", "Month", "Year"],
            classNames: ["line1", "line2", "line3"],
            classNamesDot: [".line1", ".line2", ".line3"],
            lineObjects: [],
            colors: ["red", "green", "blue"],
        };
    },
    mounted() {
        this.prepareData2();
    },
    watch: {
        data() {
            this.prepareData2();
        },
    },
    methods: {
        changeIndex2: function (index) {
            this.index = index;
            this.updateCurve();
        },
        prepareData2: function () {
            if (!this.data.allMessages.length) return;
            this.plotData = [];
            const defaultPaerseTime = d3.timeParse("%Y-%m-%d");

            if (this.index == 2) {
                this.parseTime = d3.timeParse("%Y-%m");
            } else if (this.index == 1) {
                this.parseTime = d3.timeParse("%Y-%m-%d");
            } else if (this.index == 3) {
                this.parseTime = d3.timeParse("%Y");
            }

            for (let i = 0; i < this.data.names.length; i++) {
                this.plotData.push([[], [], [], [], []]);
            }

            this.plotData.push([[], [], [], [], []]);

            for (let i = 0; i < this.data.allMessages.length; i++) {
                const name = this.data.allMessages[i].name;
                const nameIndex = this.data.names.indexOf(name);

                this.plotData[nameIndex][0].push([
                    this.data.allMessages[i].date,
                ]);
                this.plotData[this.data.names.length][0].push([
                    this.data.allMessages[i].date,
                ]);
            }

            // Count Unvonverted, still stored as unconverted
            for (let i = 0; i < this.plotData.length; i++) {
                let updatedUnconverted = [];
                let lastDate = "";
                for (let j = 0; j < this.plotData[i][0].length; j++) {
                    if (this.plotData[i][0][j][0] != lastDate) {
                        lastDate = this.plotData[i][0][j][0];
                        updatedUnconverted.push([lastDate, 1]);
                    } else {
                        lastDate = this.plotData[i][0][j][0];
                        const lastvalue =
                            updatedUnconverted[
                                updatedUnconverted.length - 1
                            ][1];
                        updatedUnconverted[updatedUnconverted.length - 1] = [
                            lastDate,
                            lastvalue + 1,
                        ];
                    }
                }
                this.plotData[i][0] = updatedUnconverted;
            }

            // per Day
            for (let i = 0; i < this.plotData.length; i++) {
                const startDate = this.plotData[i][0][0][0];
                const endDate =
                    this.plotData[i][0][this.plotData[i][0].length - 1][0];

                const allDates = [];
                for (let j = 0; j < this.plotData[i][0].length; j++) {
                    allDates.push(this.plotData[i][0][j][0]);
                }
                for (
                    let j = new Date(defaultPaerseTime(startDate));
                    j <= new Date(defaultPaerseTime(endDate));
                    j.setDate(j.getDate() + 1)
                ) {
                    const date = new Date(j).toISOString().split("T")[0];
                    if (allDates.includes(date)) {
                        const dateIndex = allDates.indexOf(date);
                        this.plotData[i][1].push([
                            this.plotData[i][0][dateIndex][0],
                            this.plotData[i][0][dateIndex][1],
                        ]);
                    } else {
                        this.plotData[i][1].push([date, 0]);
                    }
                }
            }

            // per month
            for (let i = 0; i < this.plotData.length; i++) {
                const startDate = this.plotData[i][0][0][0];
                const endDate =
                    this.plotData[i][0][this.plotData[i][0].length - 1][0];
                const allMonth = []; // 2015-06
                let daysPerMonth = [];
                let daysPerMonthValue = [];

                for (
                    let j = new Date(defaultPaerseTime(startDate));
                    j <= new Date(defaultPaerseTime(endDate));
                    j.setDate(j.getDate() + 1)
                ) {
                    // add "empty" months
                    const month = new Date(j).toISOString().substring(0, 7);
                    if (!allMonth.includes(month)) {
                        allMonth.push(month);
                        this.plotData[i][2].push([month, 0]);
                        daysPerMonth.push(month);
                        daysPerMonthValue.push(0);
                    }
                    const countIndex = daysPerMonth.indexOf(month);
                    daysPerMonthValue[countIndex]++;
                }
                // loop throu all days
                for (let j = 0; j < this.plotData[i][0].length; j = j + 1) {
                    const month = this.plotData[i][0][j][0].substring(0, 7);
                    const value = this.plotData[i][0][j][1];
                    const monthIndex = allMonth.indexOf(month);

                    this.plotData[i][2][monthIndex][1] =
                        this.plotData[i][2][monthIndex][1] + value;
                }

                for (let j = 0; j < this.plotData[i][2].length; j = j + 1) {
                    const month = this.plotData[i][2][j][0];
                    const value = this.plotData[i][2][j][1];
                    const monthIndex = daysPerMonth.indexOf(month);
                    const days = daysPerMonthValue[monthIndex];
                    if (value != 0) {
                        this.plotData[i][2][j][1] = value / days;
                    }
                }
            }

            console.log(this.plotData);

            // per year
            for (let i = 0; i < this.plotData.length; i++) {
                const startDate = this.plotData[i][0][0][0];
                const endDate =
                    this.plotData[i][0][this.plotData[i][0].length - 1][0];
                const allYears = []; // 2015
                let daysPerYear = [];
                let daysPerYearValue = [];
                for (
                    let j = new Date(defaultPaerseTime(startDate));
                    j <= new Date(defaultPaerseTime(endDate));
                    j.setDate(j.getDate() + 1)
                ) {
                    const year = new Date(j).toISOString().substring(0, 4);
                    if (!allYears.includes(year)) {
                        allYears.push(year);
                        this.plotData[i][3].push([year, 0]);
                        daysPerYear.push(year);
                        daysPerYearValue.push(0);
                    }
                    const countIndex = daysPerYear.indexOf(year);
                    daysPerYearValue[countIndex]++;
                }
                for (let j = 0; j < this.plotData[i][0].length; j = j + 1) {
                    const year = this.plotData[i][0][j][0].substring(0, 4);
                    const value = this.plotData[i][0][j][1];
                    const yearIndex = allYears.indexOf(year);
                    this.plotData[i][3][yearIndex][1] =
                        this.plotData[i][3][yearIndex][1] + value;
                }
                for (let j = 0; j < this.plotData[i][3].length; j = j + 1) {
                    const year = this.plotData[i][3][j][0];
                    const value = this.plotData[i][3][j][1];
                    const yearIndex = daysPerYear.indexOf(year);
                    const days = daysPerYearValue[yearIndex];
                    if (value != 0) {
                        this.plotData[i][3][j][1] = value / days;
                    }
                }
            }

            for (let i = 0; i < this.plotData.length; i++) {
                for (let j = 0; j < this.plotData[i][3].length; j++) {
                    this.plotData[i][4].push([
                        this.plotData[i][3][j][0],
                        this.plotData[i][3][j][1] *
                            (Math.random() * (3 - 0.5) + 0.5),
                    ]);
                }
            }

            this.createPlot();
        },
        createPlot: function () {
            if (this.index == 2) {
                this.starteDate = this.plotData[2][2][0][0].substring(0, 7);
                this.endDate = this.plotData[2][2][
                    this.plotData[2][2].length - 1
                ][0].substring(0, 7);
            } else if (this.index == 1) {
                this.starteDate = this.plotData[2][1][0][0].substring(0, 10);
                this.endDate = this.plotData[2][1][
                    this.plotData[2][1].length - 1
                ][0].substring(0, 10);
                //maxY = 60;
            } else if (this.index == 3) {
                this.starteDate = this.plotData[2][3][0][0].substring(0, 4);
                this.endDate = this.plotData[2][3][
                    this.plotData[2][3].length - 1
                ][0].substring(0, 4);
            }

            d3.select("svg").remove();

            const svg = d3
                .select("#container")
                .append("svg")
                //.attr("viewBox", "0 0 " + this.width + " " + this.height)
                .attr("viewBox", "0 0 1000 1000")
                .attr("preserveAspectRatio", "none")
                //.classed("svg-content", true)
                /*.attr(
                    "width",
                    this.width + this.margin.left + this.margin.right
                )
                .attr(
                    "height",
                    this.height + this.margin.top + this.margin.bottom
                )
                */
                .append("g")
                .attr(
                    "transform",
                    `translate(${this.margin.left},${-this.margin.top})`
                );

            const x = d3
                .scaleTime()

                .range([0, this.width]);
            const xAxis = d3.axisBottom().scale(x);

            svg.append("g")
                //.attr("transform", `translate(0px, ${this.height})`)
                .attr("transform", `translate(0, ${this.height})`)
                .attr("class", "myXaxis");

            const y = d3.scaleLinear().range([this.height, 0]);
            const yAxis = d3.axisLeft().scale(y);
            svg.append("g").attr("class", "myYaxis");

            svg.append("text")
                .attr("class", "y-label")
                .attr("text-anchor", "end")
                .attr("y", "-35px")
                .attr("font-size", "2rem")
                //.attr("y", "200px")
                .attr("transform", "rotate(-90)")
                .text("average messages per " + this.indexName[this.index - 1]);

            // TOOLTIP
            // eslint-disable-next-line
            var rectOverlay = svg
                .append("rect")
                //.attr("cursor", "move")
                .attr("fill", "none")
                .attr("pointer-events", "all")
                .attr("class", "zoom")
                .attr("width", this.width)
                .attr("height", this.height)
                .on("mouseover", this.focusMouseOver())
                .on("mousemove", this.focusMouseMove())
                .on("mouseout", this.focusMouseOut());
            /*.attr(
                    "transform",
                    "translate(" +
                        this.margin.left +
                        "," +
                        this.margin.top +
                        ")"
                );
            //.call(zoom)
            //.on("mousemove", focusMouseMove)
            .on("mouseover", focusMouseOver)
            /*.on("mouseout", focusMouseOut);*/

            this.x = x;
            this.y = y;
            this.xAxis = xAxis;
            this.yAxis = yAxis;
            this.svg = svg;
            this.focus = focus;

            this.setInitalLine();
            //this.updateCurve();
        },
        setInitalLine() {
            let maxY = this.calculateMaxY(this.plotData[2][this.index]);

            let parseTime = this.parseTime;
            if (this.index == 2) {
                parseTime = d3.timeParse("%Y-%m");
            } else if (this.index == 1) {
                parseTime = d3.timeParse("%Y-%m-%d");
            } else if (this.index == 3) {
                parseTime = d3.timeParse("%Y");
            }

            if (this.index == 2) {
                this.starteDate = this.plotData[2][2][0][0].substring(0, 7);
                this.endDate = this.plotData[2][2][
                    this.plotData[2][2].length - 1
                ][0].substring(0, 7);
            } else if (this.index == 1) {
                this.starteDate = this.plotData[2][1][0][0].substring(0, 10);
                this.endDate = this.plotData[2][1][
                    this.plotData[2][1].length - 1
                ][0].substring(0, 10);
                //maxY = 60;
            } else if (this.index == 3) {
                this.starteDate = this.plotData[2][3][0][0].substring(0, 4);
                this.endDate = this.plotData[2][3][
                    this.plotData[2][3].length - 1
                ][0].substring(0, 4);
            }

            this.x.domain([
                parseTime(this.starteDate),
                parseTime(this.endDate),
            ]);
            this.svg.selectAll(".myXaxis").call(this.xAxis);

            /*
            this.svg
                .append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("x", this.width)
                .attr("y", this.height - 6)
                .text("x-Achse");
            */

            // create the Y axis
            this.y.domain([0, maxY]).nice();
            this.svg.selectAll(".myYaxis").call(this.yAxis);

            this.svg
                .select(".y-label")
                .text("Average Messages Per " + this.indexName[this.index - 1]);

            // this.indexName[this.index - 1].charAt(0).toUpperCase() + this.indexName[this.index - 1].slice(1)
            //.text("average messages per " + this.indexName[this.index - 1]);

            //this.svg.select("title").text("NEUN");

            const x = this.x;
            // eslint-disable-next-line
            const y = this.y;
            const height = this.height;

            const line = d3
                .line()
                .curve(d3.curveBumpX)
                .x(function (d) {
                    return x(parseTime(d[0]));
                })
                // eslint-disable-next-line
                .y(function (d) {
                    return height;
                });

            this.lineObjects = [];

            for (let i = 0; i < this.classNames.length; i++) {
                this.lineObjects.push(
                    this.svg
                        .selectAll("." + this.classNames[i])
                        .data([this.plotData[i][this.index]], function (d) {
                            return parseTime(d[0]);
                        })
                );
            }

            //const classNames = this.classNames;

            for (let i = 0; i < this.lineObjects.length; i++) {
                this.lineObjects[i]
                    .join("path")
                    .attr("class", this.classNames[i])
                    .merge(this.lineObjects[i])
                    .attr("d", function (d) {
                        return line(d);
                    })
                    .style("fill", "none")
                    .style("stroke", this.colors[i])
                    .style("stroke-width", "3");
            }
            this.updateCurve();
        },
        updateCurve() {
            let maxY = this.calculateMaxY(this.plotData[2][this.index]);

            let parseTime = this.parseTime;
            if (this.index == 2) {
                parseTime = d3.timeParse("%Y-%m");
            } else if (this.index == 1) {
                parseTime = d3.timeParse("%Y-%m-%d");
            } else if (this.index == 3) {
                parseTime = d3.timeParse("%Y");
            }

            if (this.index == 2) {
                this.starteDate = this.plotData[2][2][0][0].substring(0, 7);
                this.endDate = this.plotData[2][2][
                    this.plotData[2][2].length - 1
                ][0].substring(0, 7);
            } else if (this.index == 1) {
                this.starteDate = this.plotData[2][1][0][0].substring(0, 10);
                this.endDate = this.plotData[2][1][
                    this.plotData[2][1].length - 1
                ][0].substring(0, 10);
                //maxY = 60;
            } else if (this.index == 3) {
                this.starteDate = this.plotData[2][3][0][0].substring(0, 4);
                this.endDate = this.plotData[2][3][
                    this.plotData[2][3].length - 1
                ][0].substring(0, 4);
            }

            this.x.domain([
                parseTime(this.starteDate),
                parseTime(this.endDate),
            ]);
            this.svg
                .selectAll(".myXaxis")
                .transition()
                .duration(1000)
                .call(this.xAxis);

            /*
            this.svg
                .append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("x", this.width)
                .attr("y", this.height - 6)
                .text("x-Achse");
            */

            // create the Y axis
            this.y.domain([0, maxY]).nice();
            this.svg
                .selectAll(".myYaxis")
                .transition()
                .duration(1000)
                .call(this.yAxis);

            this.svg
                .select(".y-label")
                .transition()
                .duration(1000)
                //.text("Average Messages Per " + this.indexName[this.index - 1]);
                .text("Average Messages Per Day");

            // this.indexName[this.index - 1].charAt(0).toUpperCase() + this.indexName[this.index - 1].slice(1)
            //.text("average messages per " + this.indexName[this.index - 1]);

            //this.svg.select("title").text("NEUN");

            const x = this.x;
            const y = this.y;

            const line = d3
                .line()
                .curve(d3.curveBumpX)
                .x(function (d) {
                    return x(parseTime(d[0]));
                })
                .y(function (d) {
                    return y(d[1]);
                });

            this.lineObjects = [];

            for (let i = 0; i < this.classNames.length; i++) {
                this.lineObjects.push(
                    this.svg
                        .selectAll("." + this.classNames[i])
                        .data([this.plotData[i][this.index]], function (d) {
                            return parseTime(d[0]);
                        })
                );
            }

            const classNames = this.classNames;

            for (let i = 0; i < this.lineObjects.length; i++) {
                this.lineObjects[i]
                    .join("path")
                    .attr("class", this.classNames[i])
                    .merge(this.lineObjects[i])
                    .transition()
                    .duration(1000)
                    .attrTween("d", function (d) {
                        var previous = d3.select("." + classNames[i]).attr("d");
                        var current = line(d);
                        return interpolatePath(previous, current);
                    })
                    .style("fill", "none")
                    .style("stroke", this.colors[i])
                    .style("stroke-width", "3");
            }
        },
        calculateMaxY: function (array) {
            let max = 0;
            for (let i = 0; i < array.length; i++) {
                if (array[i][1] > max) {
                    max = array[i][1];
                }
            }
            if (max < 10) {
                max = 10;
            } else if (max < 100) {
                let modulo = max % 10;
                max = max - modulo + 10;
            } else if (max < 500) {
                let modulo = max % 100;
                max = max - modulo + 100;
            } else if (max < 1000) {
                let modulo = max % 200;
                max = max - modulo + 200;
            } else if (max < 10000) {
                let modulo = max % 500;
                max = max - modulo + 500;
            }
            return max;
        },
        focusMouseOver: function () {
            console.log("DRIN");
        },
        focusMouseMove: function () {
            console.log("BEWEGUNG!");
        },
        focusMouseOut: function () {
            console.log("DRAUSSEN");
        },
        /*
        mousemove: function () {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            this.focus.attr(
                "transform",
                "translate(" + x(d.date) + "," + y(d.likes) + ")"
            );
            this.focus.select(".tooltip-date").text(dateFormatter(d.date));
            this.focus.select(".tooltip-likes").text(formatValue(d.likes));
        },
        */
    },
};
</script>
<!-- css loaderhttps://vue-loader.vuejs.org/guide/scoped-css.html#mixing-local-and-global-styles -->
<style>
/* AXES */
/* ticks */
.axis line {
    stroke: #706f6f;
    stroke: black;
    stroke-width: 0.5;
    shape-rendering: crispEdges;
    color: black;
}

/* axis contour */
.axis path {
    stroke: #706f6f;
    stroke: black;
    stroke-width: 0.7;
    shape-rendering: crispEdges;
}

/* axis text */
.axis text {
    fill: #2b2929;
    font-family: Georgia;
    font-size: 120%;
}

/* STYLE BUTTONS */
.button-box {
    width: max-content;
    margin: auto;
}

.button {
    min-width: 50px;
    width: max-content;
    height: 35px;
    border-style: none;
    background-color: white;
    margin-right: 20px;
    text-decoration: none;
    color: #000;
}

.button:last-child {
    margin-right: 0px;
}

.button {
    position: relative;
    color: #000;
    text-decoration: none;
}

.button:hover {
    color: #000;
}

.button::before {
    content: "";
    position: absolute;
    display: block;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #000;
    transform: scaleX(0);
    transition: transform 0.3s ease;
    /*
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    -ms-transition: all 0.3s ease-in-out;
    -o-transition: all 0.3s ease-in-out;
    */
}

.button:hover::before {
    transform: scaleX(1);
}

.active {
    position: relative;
}

.active::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    left: 0;
    bottom: 0;
    background-color: black;
    transition: all 0.3s ease-in-out;
    /*
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    -ms-transition: all 0.3s ease-in-out;
    -o-transition: all 0.3s ease-in-out;
    */
}

/* title */
.title {
    font-size: 20px;
    text-anchor: middle;
    color: black;
}

/* Resize */

.svg-container {
    display: inline-block;
    position: relative;
    width: 100%;
    vertical-align: top;
    overflow: hidden;
}
.svg-content {
    display: inline-block;
    position: absolute;
}
</style>
