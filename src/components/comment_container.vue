<template>
    <div id="frameDiv">
        <div class="commentContainer" v-if="!interpreted">
            <Con v-for="(item, index) in comment" v-bind:key="index" v-bind:content="item"
            ></Con>
        </div>
        <div class="commentContainer" v-if="interpreted">
            <Con v-for="(item, index) in interpretedComment" v-bind:i="item[1]" v-bind:key="index" v-bind:content="item[0]"
            ></Con>
        </div>
    </div>
</template>

<script>
    import Con from "./comment_blob.vue"
    import {mapState} from "vuex";

    function changeDivHeight(that){

        var h = document.documentElement.clientHeight;//获取页面可见高度
        that.$store.commit('setAutoSize',{'minRows':Math.ceil(h*0.35/22),'maxRows':Math.ceil(h*0.35/22)})
    }
    export default {
        name: "comment_container",
        data () {
            return {
            }
        },
        mounted(){
            let that = this;
            window.onload = ()=>{
                changeDivHeight(that);
            };
            window.onresize = ()=>{
                changeDivHeight(that);
            }
        },
        computed:{
            ...mapState({
                comment: state => state.comment,
                interpretedComment: state => state.interpretedComment,
                interpreted: state => state.interpreted
            })
    },
        components: {
            Con
        },
        methods:{
        }
    }
</script>

<style scoped>
    #frameDiv{
        overflow:auto;
        border:1px solid  rgba(0, 0, 0, .15);
        height:50px;
        box-shadow: 0px 5px 5px rgb(200, 200, 200);
        background:white;
        padding-top: 25px;
        padding-left: 13px;
        font-size: 16px;
    }
    .commentContainer{
        display:flex;
        flex-direction: row;
        /*justify-content: left;*/
        /*flex-wrap: wrap;*/
        /*align-items: flex-start;*/
        /*background: red;*/
    }
</style>