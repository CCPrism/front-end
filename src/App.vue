<template>
    <div id="app">
        <span class="title">CCPrism</span>
        <div class="title_divider">
            <el-divider></el-divider>
        </div>
        <div v-if="false" class="clock_container">
            {{clockText}}
        </div>
        <div class="center_container">
            <Main ref="codeMain" v-on:clear="clearHandler" v-on:onFileChange="onFileChange"/>
            <div class="mid">
                <strong style="margin: 5px;font-family: Avenir;color:rgb(84,84,84);font-size: 18px; ">Automatic
                    comment</strong>
                <Con></Con>
            </div>
            <div class="bot">
                <strong style="margin: 5px;font-family: Avenir;color:rgb(84,84,84);font-size: 18px;">My comment</strong>
                <el-input ref="comment_userInput"
                          type="textarea"
                          :autosize="{
                    minRows:3,
                    maxRows:3
                  }"
                          v-model="editText"
                          style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)"
                ></el-input>

                <div class="right-bottom-button">
                    <el-button icon="el-icon-document-copy" size="small" @click="copyText" plain round
                               style="width:90px;font-size: 14px">Copy
                    </el-button>
                    <el-button icon="el-icon-upload" size="small" :plain="!commentIndexMap[indexNow]"
                               :type="commentIndexMap[indexNow]?'primary':''"
                               round
                               style="width:90px;font-size: 14px;margin-left: 30px;"
                               @click="onSubmit"
                    >Submit
                    </el-button>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Main from './components/main.vue'
    import Con from './components/comment_container'
    import {mapState} from 'vuex'
    import axios from 'axios'

    export default {
        name: 'app',
        data() {
            return {
                editText: '',
                commentTimeSet: [],
                commentSet: [],
                second: 0,
                countingTime: false,
                timer: null,
                s: 0,
                e: 0
            }
        },
        watch: {
            autoSize: function (newVal) {
                this.$refs.comment_userInput.resizeTextarea(newVal);
            },
            interpreted: function () {
            },
            indexNow: function (newVal) {
                var text = this.commentSet[newVal].comment
                if (text == null)
                    this.editText = '';
                else
                    this.editText = text;
                this.s = this.second;
            },
            editText: function () {
                if (this.commentTimeSet.length > 0)
                    this.commentTimeSet[this.indexNow].typeTime.push((new Date()).valueOf())
            }
        },
        mounted() {
        },
        computed: {
            ...mapState({
                comment: state => state.comment,
                interpreted: state => state.interpreted,
                autoSize: state => state.autoSize,
                indexNow: state => state.indexNow,
                commentIndexMap: state => state.commentIndexMap,
            }),
            clockText: function () {
                var min = Math.floor(this.second / 60);
                var second = this.second % 60;
                min = min % 60 >= 10 ? (min % 60) : '0' + Math.floor(min % 60);
                second = second >= 10 ? second : '0' + second;
                if (second % 2)
                    return min + ' ' + second;
                else
                    return min + ':' + second;
            }
        },
        components: {
            Main,
            Con
        },
        methods: {
            onFileChange() {
                if (!this.countingTime)
                    this.start()
                this.countingTime = true;
            },
            copyText() {
                let comment = this.comment;
                for (var i = 0; i < comment.length; i++) {
                    this.editText = this.editText + comment[i];
                }
            },
            onSubmit() {
                if (this.editText === '') {
                    this.$message.error('Comment is empty!');
                    return;
                }
                if (this.commentSet.length === 0) {
                    this.commentSet = new Array(this.commentIndexMap.length);
                    this.commentTimeSet = new Array(this.commentIndexMap.length);
                    for (var k = 0; k < this.commentTimeSet.length; k++) {
                        this.commentTimeSet[k] = {watchTime: [], typeTime: []}
                        this.commentSet[k] = {comment: '', interpreted: false}
                    }
                }

                this.e = this.second;
                this.commentTimeSet[this.indexNow].watchTime.push([this.s, this.e]);
                this.s = this.e;
                this.commentSet[this.indexNow].comment = this.editText;
                this.commentSet[this.indexNow].interpreted = this.interpreted;
                this.$store.commit('setCommentIndexMap', this.indexNow);
                // if (this.indexNow === this.commentSet.length - 1) {
                //     var notFinishList = [];
                //     for (var i = 0; i < this.commentSet.length; i++)
                //         if (this.commentSet[i].comment === '') {
                //             notFinishList.push(i + 1)
                //         }
                //     this.dialog(notFinishList);
                // }
                this.$refs.codeMain.next();
            },
            dialog(notFinishList) {
                if (notFinishList.length > 0) {
                    this.$alert(notFinishList, 'Items below not submitted', {
                        confirmButtonText: 'OK',
                    });
                }
                else {
                    this.$prompt('Please input your ID', 'ID', {
                        confirmButtonText: 'Confirm',
                        cancelButtonText: 'Cancel',
                        inputPattern: /^[0-9a-z]+$/,
                        inputErrorMessage: 'characters and numbers'
                    }).then(({value}) => {
                        clearInterval(this.timer);
                        let data = {
                            'id': value,
                            'commentSet': this.commentSet,
                            'commentTimeSet': this.commentTimeSet,
                            'second': this.e
                        };
                        axios.get("saveFile", data)
                            .then(res => {
                                window.console.log('After submit:', res.data)
                            })
                            .catch(res => {
                                window.console.log("Submit error", res)
                            })
                        ;
                        this.$message({
                            type: 'success',
                            message: value
                        });
                        this.saveShareContent(JSON.stringify({
                            'id': value,
                            'commentSet': this.commentSet,
                        }), value + "_commentSet.json");
                        this.saveShareContent(JSON.stringify({
                            'id': value,
                            'commentTimeSet': this.commentTimeSet,
                            'second': this.e
                        }), value + "_commentTimeSet.json")
                        this.$refs.codeMain.reset();
                    }).catch(() => {
                    });
                }
            },
            start() {
                var that = this;
                this.commentSet = new Array(this.commentIndexMap.length);
                this.commentTimeSet = new Array(this.commentIndexMap.length)
                for (var k = 0; k < this.commentTimeSet.length; k++) {
                    this.commentTimeSet[k] = {watchTime: [], typeTime: []}
                    this.commentSet[k] = {comment: '', interpreted: false}
                }
                this.timer = setInterval(function () {
                    that.second += 1;
                    that.$store.commit('setSecond', that.second);
                }, 1000);
            },
            saveShareContent(content, fileName) {
                let downLink = document.createElement('a');
                downLink.download = fileName;
                let blob = new Blob([content]);
                downLink.href = URL.createObjectURL(blob);
                document.body.appendChild(downLink);
                downLink.click();
                document.body.removeChild(downLink)
            },
            clearHandler() {
                this.$nextTick(function () {
                    this.countingTime = false;
                    this.second = 0;
                    this.s = 0;
                    this.e = 0;
                    this.$store.commit('setSecond', this.second);
                    clearInterval(this.timer);
                    this.timer = null;
                    this.commentSet = [];
                    this.commentTimeSet = [];
                    this.editText=''
                    // this.$store.commit("iniCommentIndexMap", []);
                })
            }
        }
    }
</script>

<style>
    #app {
        position: absolute;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background: rgb(250, 250, 250);
    }

    .title {
        position: absolute;
        font-size: 26px;
        left: 5%;
        top: 0px;
        color: rgb(88, 158, 248);
    }

    .title_divider {
        position: absolute;
        top: 15px;
        left: 4%;
        width: 92%;
    }

    .mid {
        position: relative;
        width: 700px;
        left: 60px;
        margin-top: 15px;
    }

    .bot {
        margin-top: 30px;
        position: relative;
        width: 700px;
        left: 60px;
    }

    .right-bottom-button {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin: 10px;
    }

    .center_container {
        position: absolute;
        width: 820px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        top: 50px;

    }

    .clock_container {
        position: absolute;
        top: 5px;
        right: 5%;
        text-align: center;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(0, 0, 0, .15);
        width: 50px;
        font-family: Avenir;
        color: rgb(84, 84, 84);
        font-size: 18px;
    }

</style>
