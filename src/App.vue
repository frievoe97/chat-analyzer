<template>
    <div id="app">
        <div style="height: 0px; background-color: red"></div>
        <div id="zone">
            <input type="file" id="input" name="myfile" @change="showfile" />
        </div>
        <div
            v-if="this.allChats.names.length"
            class="d3"
            style="background-color: white"
        >
            <!-- <D3LineChart :data="d3Data" class="ani1" /> -->
            <!-- <D3BarPlot /> -->
            <!-- <D3LineChart :data="allChats" /> -->
            <!-- <D3LineChartv2 :data="allChats" /> -->
            <D3LineChartv3 :data="allChats" />
        </div>
    </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
// eslint-disable-next-line
import MsgOverTime from "./components/charts/MsgOverTime.vue";
// eslint-disable-next-line
import MsgOverTime2 from "./components/charts/MsgOverTime2.vue";
// eslint-disable-next-line
import MsgOverTime3 from "./components/charts/MsgOverTime3.vue";
// eslint-disable-next-line
import MsgOverTime4 from "./components/charts/MsgOverTime4.vue";
// eslint-disable-next-line
import D3LineChart from "./components/charts/D3LineChart.vue";
import D3LineChartv2 from "./components/charts/D3LineChartv2.vue";
// eslint-disable-next-line
import D3LineChartv3 from "./components/charts/D3LineChartv3.vue";
// eslint-disable-next-line
import D3BarPlot from "./components/charts/D3BarPlot.vue";

export default {
    name: "App",
    data() {
        return {
            d3Data: { 0: 100, 1: 200, 2: 167, 3: 776 },
            data: [],
            allChats: {
                names: [],
                allMessages: [],
                messagesPerPersoan: [],
                totalConfig: {
                    firstMessage: "",
                    totalMessages: 0,
                    messagesPerTime: {},
                },
                configPerPersoan: [],
            },
            allNames: [],
            config: {
                firstMsg: "",
                totalMsg: 0,
                names: [],
            },
        };
    },
    components: {
        // eslint-disable-next-line
        MsgOverTime,
        // eslint-disable-next-line
        MsgOverTime2,
        // eslint-disable-next-line
        MsgOverTime3,
        // eslint-disable-next-line
        MsgOverTime4,
        // eslint-disable-next-line
        D3LineChart,
        // eslint-disable-next-line
        D3BarPlot,
        // eslint-disable-next-line
        D3LineChartv2,
        D3LineChartv3,
    },
    methods: {
        showfile: async function () {
            var selectedFile = document.getElementById("input").files[0];
            let text = await selectedFile.text();
            let allDates = text.match(
                /\[(0|1|2|3|4|5|6|7|8|9)(0|1|2|3|4|5|6|7|8|9).(0|1|2|3|4|5|6|7|8|9)(0|1|2|3|4|5|6|7|8|9).(0|1|2|3|4|5|6|7|8|9)(0|1|2|3|4|5|6|7|8|9), (0|1|2|3|4|5|6|7|8|9)(0|1|2|3|4|5|6|7|8|9):(0|1|2|3|4|5|6|7|8|9)(0|1|2|3|4|5|6|7|8|9):(0|1|2|3|4|5|6|7|8|9)(0|1|2|3|4|5|6|7|8|9)\]/g
            );
            let allMessanges = text.split(/\[\d\d.\d\d.\d\d, \d\d:\d\d:\d\d\]/);
            allMessanges.shift();
            this.data = [];
            this.allNames = [];
            this.allChats = {
                names: [],
                allMessages: [],
                messagesPerPersoan: [],
                totalConfig: {
                    firstMessage: "",
                    totalMessages: 0,
                    messagesPerTime: {},
                },
                configPerPersoan: [],
            };
            this.convertData(allDates, allMessanges);
        },
        convertData: function (dates, msg) {
            for (let i = 0; i < dates.length; i++) {
                let [name, ...message] = msg[i].split(": ");
                message = message
                    .join(": ")
                    .replace(/(\r\n|\n|\r)/gm, " ")
                    .replace(/\s{2,}/g, " ")
                    .trim();
                name = name.trim();
                const length = message.length;
                let date = dates[i].slice(1, 9);
                date =
                    "20" +
                    date.substring(6, 8) +
                    "-" +
                    date.substring(3, 5) +
                    "-" +
                    date.substring(0, 2);
                const time = dates[i].slice(11, 19);
                const timestamp = this.toTimestamp(
                    date.substring(0, 4),
                    date.substring(5, 7),
                    date.substring(8, 10),
                    time.substring(0, 2),
                    time.substring(3, 5),
                    time.substring(6, 8)
                );
                if (!this.allNames.includes(name)) {
                    this.allNames.push(name);
                    this.config.names.push({ totalMsg: 0 });
                }
                if (!this.allChats.names.includes(name)) {
                    this.allChats.names.push(name);
                    this.allChats.configPerPersoan.push({
                        totalMessages: 0,
                        firstMessage: "",
                        messagesPerTime: {},
                    });
                    this.allChats.messagesPerPersoan.push([]);
                }
                this.allChats.allMessages.push({
                    date: date,
                    day: date.substring(8, 10),
                    month: date.substring(5, 7),
                    year: date.substring(0, 4),
                    msg: message,
                    name: name,
                    time: time,
                    length: length,
                    timestamp: timestamp,
                    dateAndTime: dates[i].substring(1, 19),
                });
                this.allChats.messagesPerPersoan[
                    this.allNames.indexOf(name)
                ].push({
                    date: date,
                    day: date.substring(8, 10),
                    month: date.substring(5, 7),
                    year: date.substring(0, 4),
                    msg: message,
                    name: name,
                    time: time,
                    length: length,
                    timestamp: timestamp,
                    dateAndTime: dates[i].substring(1, 19),
                });
                this.data.push({
                    date: date,
                    msg: message,
                    name: name,
                    time: time,
                    length: length,
                    timestamp: timestamp,
                });
                this.config.totalMsg++;
                this.allChats.totalConfig.totalMessages++;
                if (i == 0) {
                    this.config.firstMsg = date;
                    this.allChats.totalConfig.firstMessage = date;
                }

                this.config.names[this.allNames.indexOf(name)].totalMsg++;
                this.allChats.configPerPersoan[this.allNames.indexOf(name)]
                    .totalMessages++;

                if (
                    this.allChats.configPerPersoan[this.allNames.indexOf(name)]
                        .firstMessage == ""
                ) {
                    this.allChats.configPerPersoan[
                        this.allNames.indexOf(name)
                    ].firstMessage = date;
                }
            }
            console.log(this.allChats);
            this.calculateMsgPerTime();
        },
        calculateMsgPerTime: function () {
            this.allChats.totalConfig.messagesPerTime = {
                x: [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                    17, 18, 19, 20, 21, 22, 23,
                ],
                y: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0,
                ],
            };
            for (let i = 0; i < this.allNames.length; i++) {
                this.allChats.configPerPersoan[i].messagesPerTime = {
                    x: [
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                        16, 17, 18, 19, 20, 21, 22, 23,
                    ],
                    y: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0,
                    ],
                };
            }
            for (let i = 0; i < this.allChats.allMessages.length; i++) {
                const hour = parseInt(
                    this.allChats.allMessages[i].time.substring(0, 2)
                );
                const nameIndex = this.allNames.indexOf(
                    this.allChats.allMessages[i].name
                );

                this.allChats.totalConfig.messagesPerTime.y[hour]++;
                this.allChats.configPerPersoan[nameIndex].messagesPerTime.y[
                    hour
                ]++;
            }
            console.log(this.allChats);
        },
        toTimestamp: function (year, month, day, hour, minute, second) {
            var datum = new Date(
                Date.UTC(year, month - 1, day, hour, minute, second)
            );
            return datum.getTime() / 1000;
        },
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: rgb(163, 196, 172);
    margin-top: -20px;
}

.plot-inside {
    min-width: 500px;
    max-width: calc(100% - 80px);
    border-radius: 50px;
    padding: 20px;
    margin: 40px;
    box-shadow: 0px 0px 20px 20px rgba(0, 0, 0, 0.234);
    height: 100%;
    background-color: white;
}

.plot-box {
    max-width: 100vw;
    background-color: rgb(163, 196, 172);
    width: max-content;
    padding-top: 10px;
    padding-bottom: 10px;
    margin: 20px;
    height: 600px;
    margin-top: 50px;
}

.plot-area {
    display: flex;
    flex-wrap: wrap;
    width: 100vw;
}

/* 

<div class="plot-area">
            <div class="plot-box" style="flex-grow: 1">
                <MsgOverTime
                    class="plot-inside"
                    :msgData="data"
                    :names="allNames"
                />
            </div>
            <div class="plot-box" style="flex-grow: 1">
                <MsgOverTime2
                    class="plot-inside"
                    :msgData="data"
                    :names="allNames"
                    :config="config"
                />
            </div>
            <div class="plot-box" style="flex-grow: 2">
                <MsgOverTime3
                    class="plot-inside"
                    :msgData="data"
                    :names="allNames"
                />
            </div>
            <div class="plot-box" style="flex-grow: 2">
                <MsgOverTime4
                    class="plot-inside"
                    :msgData="data"
                    :names="allNames"
                />
            </div>
            <div class="plot-box" style="flex-grow: 2">
                <MsgOverTime3
                    class="plot-inside"
                    :msgData="data"
                    :names="allNames"
                />
            </div>
        </div>

*/

#zone {
    height: 100px;
}

#input {
    height: 50px;
    width: 50px;
    margin: auto;
    border: 1px solid #ccc;
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
}
</style>
