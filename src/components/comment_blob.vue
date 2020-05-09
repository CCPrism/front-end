<template>
    <div @mouseover="mouseOver" @mouseleave="mouseLeave" :class="conStyle">
        {{"\u200b"+content + "\u200b"}}
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "comment_blob",
        props: {
            content: String,
            i:Object
        },
        computed:{
            ...mapState({
                colorList: state => state.colorList,
                interpreted : state => state.interpreted
            }),
            conStyle:function(){
                if (this.interpreted&&(this.i!=null)) {
                    var length = this.colorList.length;
                    return this.colorList[(this.i.index % (length - 1)) + 1];
                }
                else
                    return '';
            }
        },
        methods:{
            mouseOver(){
                this.$store.commit('changeHoverIndex',this.i);
            },
            mouseLeave(){
                this.$store.commit('changeHoverIndex',null);
            }
        }
    }
</script>

<style scoped>
    .T00CCFF:hover {
        background: #00CCFF;
        cursor:pointer
    }

     .yellow:hover {
        background: yellow;
         cursor:pointer
    }

     .yellowGreen:hover {
        background: yellowgreen;
         cursor:pointer
    }

     .FF6600:hover {
        background: #FF6600;
         cursor:pointer
    }
     .FF3300:hover {
        background: #FF3300;
         cursor:pointer
    }
     .FF9900:hover {
        background: #FF9900;
         cursor:pointer
    }
     .FFCC00:hover {
        background: #FFCC00;
         cursor:pointer
    }
     .T33FF66:hover {
        background: #33FF66;
         cursor:pointer
    }
     .CC99FF:hover {
        background: #CC99FF;
         cursor:pointer
    }
     .T00FF00:hover {
        background: #00FF00;
         cursor:pointer
    }

</style>