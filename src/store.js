import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

const store = new vuex.Store({
    state: { //唯一数据源，我理解为声明全局变量
        hoverIndex:null,
        comment:[],
        interpretedComment:[],
        code:[],
        colorList:['','T00CCFF','yellow','yellowGreen','FF6600','FF3300','FF9900','FFCC00','T33FF66','CC99FF','T00FF00'],
        interpreted:false,
        clear:false,
        reset:false,
        chosenList:new Array(10),
        indexNow:-1,
        showBlank:"    ",
        autoSize:{
            'minRows': 10,
            'maxRows': 10
            },
        commentIndexMap:[],
        second:0,
    },
    getters: {//针对state数据的过滤，

    },
    mutations: { //逻辑处理，但Mutation 必须是同步函数
        changeHoverIndex(state,num) {
            // 变更状态
            state.hoverIndex = num
        },
        setComment(state,comment){
            state.comment = comment
        },
        setCode(state,code){
            state.code =code
        },
        setInterpreted(state,s){
            state.interpreted = s;
        },
        setInterpretedComment(state,ic){
            state.interpretedComment = ic
        },
        reset(state,s){
            state.reset = s
        },
        addChosenList(state,item){
            state.chosenList.push(item)
        },
        setIndexNow(state,index){
            state.indexNow = index
        },
        setShowBlank(state,f){
            state.showBlank = f
        },
        setAutoSize(state,size){
            state.autoSize = size;
        },
        iniCommentIndexMap(state,map) {
            state.commentIndexMap = map;
        },
        setCommentIndexMap(state,i) {
            if ( i>=0 && i< state.commentIndexMap.length )
            state.commentIndexMap[i] = true;
        },
        setSecond(state,s){
            state.second = s;
        },
    },
    actions: {//Action 类似于 mutation,Action 提交的是 mutation，而不是直接变更状态;Action 可以包含任意异步操作.
      setHoverIndex (context,num){
          context.commit('changeHoverIndex',num)
      }
  }
});

export default store