<template>
    <div class="test-plot">
        <div v-for="obj in dataTest" v-bind:key="obj.name">
            <h1>{{ obj.name }}</h1>
            <p>Number of messages: {{ obj.numberMsg }}</p>
            <p>Started conversations: {{ obj.startedConversation }}</p>
            <p>Finished conversations: {{ obj.endedConversation }}</p>
            <p>Average message length: {{ obj.msgLength }}</p>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import VuePapaParse from "vue-papa-parse";
Vue.use(VuePapaParse);

export default {
    components: {},
    name: "MsgOverTime4",
    props: {
        msgData: Array,
        names: Array,
    },
    data() {
        return {
            timeBetweenConversations: 86400,
            dataTest: [],
            layout: {
                title: "Plot 4",
                xaxis: {
                    //autorange: true,
                    //tickformat: "%d/%m",
                },
            },
        };
    },
    mounted() {
        this.prepareData();
    },
    watch: {
        msgData() {
            this.prepareData();
        },
    },
    methods: {
        prepareData: function () {
            this.dataTest = [];
            let conversation = [];
            for (let i = 0; i < this.names.length; i++) {
                let convObj = {};
                convObj.name = this.names[i];
                convObj.startedConversation = 0;
                convObj.endedConversation = 0;
                conversation.push(convObj);
            }
            for (let j = 0; j < this.msgData.length; j++) {
                if (j > 0) {
                    if (
                        this.msgData[j].timestamp >
                        this.msgData[j - 1].timestamp +
                            this.timeBetweenConversations
                    ) {
                        // started conversation
                        conversation[this.names.indexOf(this.msgData[j].name)]
                            .startedConversation++;
                        // ended
                        conversation[
                            this.names.indexOf(this.msgData[j - 1].name)
                        ].endedConversation++;
                    }
                } else {
                    conversation[this.names.indexOf(this.msgData[j].name)]
                        .startedConversation++;
                }
            }
            for (let i = 0; i < this.names.length; i++) {
                const name = this.names[i];
                let dataObj = {};
                dataObj.name = name;
                dataObj.numberMsg = 0;
                dataObj.msgLength = 0.0;
                dataObj.startedConversation =
                    conversation[i].startedConversation;
                dataObj.endedConversation = conversation[i].endedConversation;
                for (let j = 0; j < this.msgData.length; j++) {
                    if (this.msgData[j].name == name) {
                        dataObj.numberMsg++;
                        dataObj.msgLength += this.msgData[j].msg.length;
                    }
                }

                dataObj.msgLength = Math.round(
                    dataObj.msgLength / dataObj.numberMsg
                );
                this.dataTest.push(dataObj);
            }
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.plot {
    height: calc(100% - 50px);
}
</style>
