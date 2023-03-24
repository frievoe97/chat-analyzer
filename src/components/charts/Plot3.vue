<template>
    <div>
        <div id="plot-3-title">Most Used Words</div>
        <div style="font-size: 10px" class="plot-3-container">
            <div
                v-for="(name, index) in data.names"
                :key="index"
                class="plot-3-child"
            >
                <p style="font-size: 1.5rem">{{ name }}</p>
                <div v-for="(word, index) in mostUsedWords[index]" :key="index">
                    <p style="font-size: 1.1rem">
                        {{ index + 1 }}. {{ word[0] }} {{ word[1] }}
                    </p>
                </div>
            </div>
        </div>
        <div>
            <!-- <div @click="changeIndex2(5)" class="single-button">Hour</div> -->
            <!-- <div @click="changeIndex2(6)" class="single-button">Minute</div> -->
        </div>
    </div>
</template>

<script>
export default {
    name: "Plot-3",
    components: {},
    props: {
        data: Object,
        classIDProp: String,
    },
    data() {
        return {
            statData: [],
            mostUsedWords: [],
            ignoreWords: [
                "ICH",
                "BILD",
                "DU",
                "DAS",
                "UND",
                "NICHT",
                "DANN",
                "IST",
                "JA",
                "NEIN",
                "WIR",
                "ES",
                "DIE",
                "AUCH",
                "DIR",
                "ABER",
                "DER",
                "NOCH",
                "MIT",
                "GUT",
                "HAB",
                "ZU",
                "WEGGELASSEN",
                "‎BILD",
                "",
                "BIN",
                "SO",
                "DA",
                "IN",
                "BEI",
                "HAUSE",
                "JETZT",
                "WAS",
                "😊",
                "WAR",
                "AUF",
                "SCHON",
                "MIR",
                "NE",
                "DEN",
                "GERADE",
                "MAL",
                "HABE",
                "FÜR",
                "NUR",
                "MORGEN",
                "UM",
                "HEUTE",
                "ALLES",
                "KANN",
                "DEM",
                "ODER",
                "WANN",
                "WIEDER",
                "HIER",
                "NACH",
                "HAT",
                "WÜRDE",
                "EIN",
                "ABEND",
                "ESSEN",
                "WIE",
                "MICH",
                "AM",
                "SIND",
                "N",
                "VON",
                "BIS",
                "BIST",
                "HAST",
                "WENN",
                "IM",
                "HABEN",
                "DENN",
                "DOCH",
                "VIELLEICHT",
                "MUSS",
                "MACHEN",
                "LEIDER",
                "NOCHMAL",
                "EINE",
                "OKAY",
                "OK",
                "KOMMST",
                "SCHÖN",
                "IHR",
                "DICH",
                "KANNST",
                "EIGENTLICH",
                "😘",
                "WO",
                "‎",
                "S",
                "ZUM",
                "AUS",
                "UHR",
                "NA",
                "AN",
                "SOLL",
                "WIRD",
                "GEHT",
                "MEHR",
                "IMMER",
                "SICH",
                "ER",
                "VIEL",
                "MAN",
                "ZEIT",
                "OKEY",
                "DASS",
                "SIE",
                "AB",
                "RICHTIG",
                "KEINE",
                "NICHTS",
                "ALSO",
                "WERDEN",
                "GIBT",
                "SEHR",
                "KÖNNTE",
                "DANKE",
                "SEIN",
                "EINEN",
                "GLEICH",
                "NACHHER",
                "DEINE",
                "LOS",
                "HTTPS",
                "GANZ",
                "GERNE",
                "KOMMEN",
                "UNS",
                "LANGE",
                "MACHST",
                "D",
                "ACHSO",
                "AUDIO",
                "OH",
                "NEE",
                "HEY",
                "MEINE",
                "GEHTS",
                "SUPER",
                "SCHADE",
                "ALS",
                "OB",
                "KEIN",
                "VOR",
                "KOMMT",
                "WERDE",
                "WÄRE",
                "WARUM",
                "FAHR",
                "SIEHT",
                "WÄR",
                "WILLST",
                "VORBEI",
                "MEIN",
                "GLAUBE",
                "ETWAS",
                "KÖNNTEST",
                "DEIN",
                "WEISST",
                "KLAR",
                "KURZ",
                "BISSCHEN",
                "GEGEN",
                "ERST",
            ],
        };
    },
    mounted() {
        //this.createStats();
    },
    watch: {
        data() {
            this.createStats();
        },
    },
    methods: {
        createStats: function () {
            if (!this.data.names.length) return;

            this.statData = [];
            this.mostUsedWords = [];

            for (let i = 0; i < this.data.messagesPerPersoan.length; i++) {
                this.statData.push({});
                this.mostUsedWords.push([]);
            }

            for (let i = 0; i < this.data.messagesPerPersoan.length; i++) {
                for (
                    let j = 0;
                    j < this.data.messagesPerPersoan[i].length;
                    j = j + 1
                ) {
                    let words =
                        this.data.messagesPerPersoan[i][j].msg.split(
                            /[ ,.:("!-?)]+/
                        );
                    for (let word of words) {
                        if (!word.length) break;
                        if (
                            Object.keys(this.statData[i]).includes(
                                word.toUpperCase()
                            )
                        ) {
                            //console.log("Enthalten");
                            this.statData[i][word.toUpperCase()]++;
                        } else {
                            //console.log("Neu");
                            this.statData[i][word.toUpperCase()] = 1;
                        }
                    }
                }
            }
            for (let i = 0; i < this.statData.length; i++) {
                for (let word of Object.entries(this.statData[i]).sort(
                    (a, b) => b[1] - a[1]
                )) {
                    if (
                        !this.ignoreWords.includes(word[0]) &&
                        this.mostUsedWords[i].length < 10 &&
                        word.length >= 2
                    ) {
                        this.mostUsedWords[i].push(word);
                    }
                }
            }
        },
    },
};
</script>
<style>
#plot-3-title {
    margin: auto;
    font-size: 1.5rem;
    height: 40px;
    color: #000;
}

.plot-3-container {
}

.plot-3-child {
    width: 50%;
    float: left;
}
</style>
