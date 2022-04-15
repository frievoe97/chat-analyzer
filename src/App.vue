<template>
    <div id="app">
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
                <MsgOverTime3
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
        <div id="zone">
            <input type="file" id="input" name="myfile" @change="showfile" />
        </div>
    </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import MsgOverTime from "./components/charts/MsgOverTime.vue";
import MsgOverTime2 from "./components/charts/MsgOverTime2.vue";
import MsgOverTime3 from "./components/charts/MsgOverTime3.vue";

export default {
    name: "App",
    data() {
        return {
            data: [],
            allNames: [],
            config: {
                firstMsg: "",
                totalMsg: 0,
            },
        };
    },
    components: {
        MsgOverTime,
        MsgOverTime2,
        MsgOverTime3,
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
                if (!this.allNames.includes(name)) {
                    this.allNames.push(name);
                }
                this.data.push({
                    date: date,
                    msg: message,
                    name: name,
                    time: time,
                    length: length,
                });
                this.config.totalMsg++;
                if (i == 0) {
                    this.config.firstMsg = date;
                }
            }
            console.log(this.data);
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
</style>
