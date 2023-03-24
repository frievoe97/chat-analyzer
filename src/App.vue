<template>
    <div id="app">
        <div v-show="this.showSelectedNames" class="blurred-background"></div>
        <div v-show="this.showSelectedNames" class="select-names">
            <h1 class="select-names-header">Select the Names</h1>
            <div class="select-names-general-buttons">
                <button
                    class="select-names-general-button"
                    @click="selectAllNames()"
                >
                    Select All
                </button>
                <button
                    class="select-names-general-button"
                    @click="unselectAllNames()"
                >
                    Unselect All
                </button>
                <button
                    class="select-names-general-button"
                    @click="unselectUnsavedContacts()"
                >
                    Unselect not saved contacts
                </button>
                <button
                    class="select-names-general-button"
                    @click="selectTopTen()"
                >
                    Select Top 10
                </button>
            </div>
            <div class="select-names-list">
                <div
                    class="select-names-line"
                    v-for="(element, index) in selectedNames"
                    v-bind:key="index"
                >
                    <input
                        type="checkbox"
                        class="select-name-button"
                        :checked="element.active"
                        @click="selectName(index)"
                    />
                    <div class="select-names-name">
                        {{ element.name }} (Nachrichten:
                        {{ element.numberOfMessages }})
                    </div>
                </div>
            </div>
            <div class="select-names-bottom-buttons">
                <button
                    class="select-names-bottom-button"
                    @click="finishSelectNames()"
                >
                    Weiter
                </button>
            </div>
        </div>
        <div class="reselect-names">
            <div class="reselect-names-top">
                <button @click="showReselectNames = !showReselectNames">
                    {{ showReselectNames }}
                </button>

                <v-icon name="arrow-down" />
            </div>
            <div v-show="showReselectNames" class="reselect-names-content">
                <div
                    class="reselect-names-line"
                    v-for="(element, index) in selectedNames"
                    v-bind:key="index"
                >
                    <input
                        type="checkbox"
                        class="reselect-name-button"
                        :checked="element.active"
                        @click="selectName(index)"
                    />
                    <div class="reselect-names-name">
                        {{ element.name }} (Nachrichten:
                        {{ element.numberOfMessages }})
                    </div>
                </div>
            </div>
        </div>
        <div id="zone">
            <input
                type="file"
                id="input"
                name="myfile"
                class="inputfile"
                @change="showfile"
            />
            <label for="file">Choose a file</label>
        </div>
        <div class="grid">
            <div class="grid-element" id="grid-plot-1">
                <Plot1
                    :data="allChats"
                    :globalWidth="widthPlot1"
                    classIDProp="plot-1"
                />
            </div>
            <div class="grid-element" id="grid-plot-2">
                <Plot2
                    :data="allChats"
                    :globalWidth="widthPlot2"
                    classIDProp="plot-2"
                />
            </div>
            <div class="grid-element" id="grid-plot-6">
                <Plot6
                    :data="allChats"
                    :globalWidth="widthPlot6"
                    classIDProp="plot-6"
                />
            </div>
            <div>
                <TestPlot :data="allChats" />
            </div>
            <!--             <div class="grid-element" id="grid-plot-2">
                <Plot2
                    :data="allChats"
                    :globalWidth="widthPlot1"
                    classIDProp="plot-2"
                />
            </div>
            <div class="grid-element" id="grid-plot-3">
                <Plot3 classIDProp="plot-3" :data="allChats" />
            </div>
            <div class="grid-element" id="grid-plot-4">
                <Plot4
                    classIDProp="plot-4"
                    :selectedNames="selectedNames"
                    :data="allChats"
                />
            </div>
            <div class="grid-element" id="grid-plot-5">
                <Plot5 classIDProp="plot-5" :data="allChats" />
            </div>
            <div class="grid-element" id="grid-plot-6">6</div>
            <div class="grid-element" id="grid-plot-7">7</div> -->
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
// eslint-disable-next-line
import D3LineChartv2 from "./components/charts/D3LineChartv2.vue";
// eslint-disable-next-line
import Plot1 from "./components/charts/Plot1.vue";
import Plot2 from "./components/charts/Plot2.vue";
// import Plot3 from "./components/charts/Plot3.vue";
// import Plot4 from "./components/charts/Plot4.vue";
// import Plot5 from "./components/charts/Plot5.vue";
import Plot6 from "./components/charts/Plot6.vue";
import TestPlot from "./components/charts/TestPlot.vue";
// eslint-disable-next-line
import D3BarPlot from "./components/charts/D3BarPlot.vue";
import D3LineChartv3Resize from "./components/charts/D3LineChartv3Resize.vue";
// eslint-disable-next-line
import TestVue from "./components/charts/TestVue.vue";

export default {
    name: "App",
    data() {
        return {
            d3Data: { 0: 100, 1: 200, 2: 167, 3: 776 },
            data: [],
            width: 100,
            height: 100,
            showReselectNames: false,
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
            allWidths: [0, 0, 0, 0, 0, 0, 0],
            allWidths2: {
                plot1: 0,
                plot2: 0,
                plot3: 0,
                plot4: 0,
                plot5: 0,
                plot6: 0,
                plot7: 0,
            },
            testProp: 1,
            widthPlot1: 0,
            showSelectedNames: false,
            selectedNames: [],
        };
    },
    components: {
        // eslint-disable-next-line
        Plot1,
        Plot2,
        // Plot3,
        // Plot4,
        // Plot5,
        Plot6,
        TestPlot,
        // eslint-disable-next-line
        D3LineChartv3Resize,
        // eslint-disable-next-line
        TestVue,
    },
    mounted() {
        window.addEventListener("resize", this.myEventHandler);
    },
    methods: {
        myEventHandler() {
            this.testProp++;
            const widthPlot1 =
                document.querySelector("#grid-plot-1").clientWidth;
            const widthPlot2 =
                document.querySelector("#grid-plot-2").clientWidth;
            const widthPlot3 =
                document.querySelector("#grid-plot-3").clientWidth;
            const widthPlot4 =
                document.querySelector("#grid-plot-4").clientWidth;
            const widthPlot5 =
                document.querySelector("#grid-plot-5").clientWidth;
            const widthPlot6 =
                document.querySelector("#grid-plot-6").clientWidth;
            const widthPlot7 =
                document.querySelector("#grid-plot-7").clientWidth;

            this.allWidths[0] = widthPlot1;
            this.allWidths[1] = widthPlot2;
            this.allWidths[2] = widthPlot3;
            this.allWidths[3] = widthPlot4;
            this.allWidths[4] = widthPlot5;
            this.allWidths[5] = widthPlot6;
            this.allWidths[6] = widthPlot7;

            this.allWidths2.plot1 = widthPlot1;
            this.allWidths2.plot2 = widthPlot2;
            this.allWidths2.plot3 = widthPlot3;
            this.allWidths2.plot4 = widthPlot4;
            this.allWidths2.plot5 = widthPlot5;
            this.allWidths2.plot6 = widthPlot6;
            this.allWidths2.plot7 = widthPlot7;

            this.widthPlot1 = widthPlot1;
        },
        showfile: async function () {
            if (document.getElementById("input").files == null) return;
            var selectedFile = document.getElementById("input").files[0];
            let text = await selectedFile.text();

            const dateRegEx =
                /\[\d\d\.\d\d\.\d\d,\s[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?\]/g;

            let allDates = text.match(dateRegEx);
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
        creatAllNamesArray: function () {
            this.showSelectedNames = true;
            this.selectedNames = [];
            // eslint-disable-next-line
            for (let i = 0; i < this.allChats.names.length; i++) {
                this.selectedNames.push({
                    name: this.allChats.names[i],
                    active: true,
                    numberOfMessages:
                        this.allChats.configPerPersoan[i].totalMessages,
                });
            }
            //this.$set(this.selectedNames, 0, this.selectedNames[0]);
            console.log(this.allChats);
        },
        convertData: function (dates, msg) {
            for (let i = 0; i < dates.length; i++) {
                if (!msg[i].includes(":")) continue;
                if (msg[i].includes("Ende-zu-Ende-verschlüsselt")) continue;
                if (
                    msg[i].includes(
                        "Deine Sicherheitsnummer für alle Teilnehmer"
                    )
                )
                    continue;
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

                const weekday = new Date(
                    date.substring(0, 4) +
                        "-" +
                        date.substring(5, 7) +
                        "-" +
                        date.substring(8, 10)
                ).getDay();
                //console.log(date + ": " + weekday);
                this.allChats.allMessages.push({
                    date: date, // e.g. 2022-04-14
                    day: date.substring(8, 10),
                    month: date.substring(5, 7),
                    year: date.substring(0, 4),
                    msg: message,
                    weekday: weekday,
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
            this.creatAllNamesArray();
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
        },
        toTimestamp: function (year, month, day, hour, minute, second) {
            var datum = new Date(
                Date.UTC(year, month - 1, day, hour, minute, second)
            );
            return datum.getTime() / 1000;
        },
        onResize: function ({ width, height }) {
            console.log(width, height);
            console.log("Moin");
        },
        selectAllNames: function () {
            this.selectedNames.forEach((element) => {
                element.active = true;
            });
        },
        unselectAllNames: function () {
            this.selectedNames.forEach((element) => {
                element.active = false;
            });
        },
        unselectUnsavedContacts: function () {
            var hasNumber = /\d/;
            this.selectedNames.forEach((element) => {
                element.active = !hasNumber.test(element.name);
            });
        },
        selectTopTen: function () {
            if (this.selectedNames.length < 10) return;
            this.unselectAllNames();
            let maxValue = 0;
            let maxIndex = -1;
            for (let i = 0; i < 10; i++) {
                this.selectedNames.forEach((element, index) => {
                    if (
                        !element.active &&
                        element.numberOfMessages > maxValue
                    ) {
                        maxIndex = index;
                        maxValue = element.numberOfMessages;
                    }
                });
                this.selectedNames[maxIndex].active = true;
                maxValue = 0;
                maxIndex = -1;
            }
        },
        finishSelectNames: function () {
            this.showSelectedNames = false;
            console.log(this.selectedNames);
        },
        selectName: function (index) {
            this.selectedNames[index].active =
                !this.selectedNames[index].active;
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

    /* margin-top: -20px; */
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
    margin: 100px;
    width: min-content;
}

.grid {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: stretch;
    max-width: 1500px;
    background-color: rgba(0, 0, 0, 0.02);
    margin: auto;
    padding: 15px;
}

.grid-element {
    height: 480px;
    min-width: 100px;
    background-color: white;
    margin: 30px;
    overflow: hidden;
    width: min-content;
}
#grid-plot-1 {
    flex-grow: 2;
    min-width: 800px;
}

#grid-plot-2 {
    flex-grow: 2;
    min-width: 800px;
}

#grid-plot-3 {
    flex-grow: 4;
    min-width: 400px;
}

#grid-plot-4 {
    flex-grow: 6;
    min-width: 600px;
}

#grid-plot-5 {
    flex-grow: 4;
    min-width: 400px;
}

#grid-plot-6 {
    flex-grow: 8;
    min-width: 800px;
}

#grid-plot-7 {
    flex-grow: 1;
    min-width: 600px;
}

.tick {
    font-size: 0.8rem;
}

/* Style select name window */
.select-names {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    height: 500px;
    width: 700px;
    padding: 30px;
    border-style: solid;
}

.select-names-header {
    height: 3rem;
    margin-bottom: 0;
}

.select-names-line {
    width: 100%;
    display: flex;
    height: 2rem;
}

.select-names-name {
    font-size: 1.3rem;
}

.select-names-general-button {
    background-color: transparent;
    border: none;
    height: 2rem;
}

.select-names-general-button:first-child {
    margin-right: 10px;
}

.select-name-button {
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 30px;
    height: 1.3rem;
    width: 1.3rem;
}

.select-names-list {
    height: calc(500px - 7rem - 60px);
    overflow: scroll;
}

.select-names-bottom-buttons {
    position: absolute;
    bottom: 30px;
    margin: auto;
    width: calc(100% - 60px);
}

.select-names-bottom-button {
    background-color: transparent;
    border: none;
    height: 2rem;
}

.blurred-background {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(80, 130, 89, 0.95);
}

.reselect-names-line {
    display: flex;
    max-width: 500px;
    margin: auto;
}

.reselect-names {
    margin: auto;
    max-width: 600px;
}

.reselect-names-top {
    display: flex;
    border-style: solid;
    border-top-style: none;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    padding: 5px;
}

.reselect-names-content {
    border-style: solid;
    border-top-style: none;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    border-color: grey;
    max-width: 500px;
    margin: auto;
    padding: 10px;
}

.icon {
    width: 20px;
    height: 20px;
}
</style>
