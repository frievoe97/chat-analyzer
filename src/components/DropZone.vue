<template>
    <div class="drop-zone">
        <div id="zone">
            <input type="file" id="input" name="myfile" @change="showfile" />
        </div>
    </div>
</template>

<script>
export default {
    name: "HelloWorld",
    props: {},
    data() {
        return {
            data: [],
            allNames: [],
        };
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
            console.log(
                "Times: ",
                allDates.length,
                " Messanges: ",
                allMessanges.length
            );
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
                const date = dates[i].slice(1, 9);
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
                console.log(message);
            }
            console.log(this.data, this.allNames);
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#zone {
    border: 5px solid blue;
    width: 200px;
    height: 100px;
}
</style>
