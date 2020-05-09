<template>
    <div>
        <div v-for="(item,index) in code" v-bind:key="index">
            <span>{{blankArray[index]}}</span>
            <template v-for="(it,lineIndex) in item">
                <span v-bind:class="colorList[(wordIndex[index][lineIndex]===1)?i:0]" v-bind:key="index*1000+lineIndex">{{it}}</span>
            </template>
            <br v-bind:key="-index-1">
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "code_blob",
        props: {
            code: Array,
            blankArray:Array
        },
        data() {
            return {}
        },
        computed: {
            i: function () {
                if (this.hoverIndex == null)
                    return 0;
                else
                    return (this.hoverIndex.index % (this.colorList.length - 1)) + 1;

            },
            wordIndex: function () {
                // window.console.log("code_blob:hoverIndex",this.hoverIndex,this.code)
                let list = new Array();
                let i = 0, j = 0;
                for (i = 0; i < this.code.length; i++) {
                    list[i] = new Array();
                    for (j = 0; j < this.code[i].length; j++)
                        list[i][j] = 0;
                }
                if (this.hoverIndex == null) {
                    return list;
                }

                for (i = 0; i < this.code.length; i++) {
                    var flag = 0, k = 0;
                    for (k = 0; k < this.hoverIndex.relation.length; k++) {
                        if (i == this.hoverIndex.relation[k][0]) {
                            flag = 1;
                            break;
                        }
                    }
                    if (flag)
                        for(j=0;j<this.hoverIndex.relation[k][1].length;j++)
                            list[i][this.hoverIndex.relation[k][1][j]]=1
                }
                // window.console.log("2DmapList:",list);
                return list;
            },
            ...mapState({
                colorList: state => state.colorList,
                hoverIndex: state => state.hoverIndex,
                showBlank: state => state.showBlank
            })
        },
        methods: {}
    }
</script>

<style scoped>
    span.T00CCFF {
        background: #00CCFF;
    }

    span.yellow {
        background: yellow;
    }

    span.yellowGreen {
        background: yellowgreen;
    }

    span.FF6600 {
        background: #FF6600;
    }
    span.FF3300 {
        background: #FF3300;
    }
    span.FF9900 {
        background: #FF9900;
    }
    span.FFCC00 {
        background: #FFCC00;
    }
    span.T33FF66 {
        background: #33FF66;
    }
    span.CC99FF {
        background: #CC99FF;
    }
    span.T00FF00 {
        background: #00FF00;
    }

</style>