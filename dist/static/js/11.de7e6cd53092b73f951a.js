webpackJsonp([11],{"7EcI":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a("2vhu"),o=a("u4Bf"),s=a.n(o),n=a("+4Zy"),r={name:"MovieList",props:{headerTitle:{type:String,default:""},isLoading:{type:Boolean,default:!1},movies:Array,paginator:{perPage:Number,currentPage:Number,total:Number}},components:{Pagination:i.i,draggable:s.a},computed:{},methods:{onPageChange:function(e,t){this.$emit("onDataChange",{page:e,pageSize:t})},onAddEvent:function(e){var t=Object(n.c)(this.movies,function(t){return t.id===e.item.getAttribute("data-id")});-1!==t&&this.movies.splice(t,1)}}},d=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"file-list"}},[a("div",{staticClass:"card"},[a("div",{staticClass:"card-status-top bg-warning"}),e._v(" "),a("div",{staticClass:"card-header pb-4 pt-4"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-12 col-md-7 d-flex align-items-center"},[e.headerTitle?a("b",{domProps:{textContent:e._s(e.headerTitle)}}):e._e()]),e._v(" "),a("div",{staticClass:"col-12 col-md-5"},[e._t("headerRight")],2)])]),e._v(" "),a("div",{staticClass:"card-body position-relative card-body-style"},[e.isLoading?a("div",{staticClass:"position-absolute w-100 h-100 spin"},[a("a-spin")],1):a("div",{staticClass:"row"},[a("draggable",e._b({staticClass:"col-12 d-flex flex-row flex-wrap",staticStyle:{"min-height":"320px"},attrs:{"ghost-class":"ghost-movie",list:e.movies,tag:"div"},on:{add:function(t){return e.onAddEvent(t)}}},"draggable",{group:{name:"movie",pull:"clone"}},!1),e._l(e.movies,function(t,i){return a("a-card",{key:i,staticClass:"custom-card-image",attrs:{bordered:!1,headStyle:{minHeight:"30px",padding:0},bodyStyle:{padding:"10px 5px"},"data-id":t.id}},[a("img",{directives:[{name:"lazy",rawName:"v-lazy",value:t.movie_thumbnail,expression:"movie.movie_thumbnail"}],staticStyle:{width:"100%",height:"150px","object-fit":"cover"},attrs:{slot:"cover",title:t.movie_title,alt:t.movie_title},slot:"cover"}),e._v(" "),a("a-card-meta",{attrs:{title:t.movie_title}})],1)}),1)],1)]),e._v(" "),a("div",{staticClass:"card-footer text-center p-0"},[a("a-pagination",{attrs:{"default-current":e.paginator.currentPage,current:e.paginator.currentPage,pageSize:e.paginator.perPage,total:e.paginator.total,"show-less-items":""},on:{change:e.onPageChange}})],1)])])};d._withStripped=!0;var c={render:d,staticRenderFns:[]},l=c;var A=!1;var p=a("VU/8")(r,l,!1,function(e){A||a("Rq3j")},"data-v-cb7e8dd0",null);p.options.__file="src/pages/movie/components/MovieList.vue";t.default=p.exports},"8kBa":function(e,t,a){(e.exports=a("FZ+f")(!0)).push([e.i,"\n#file-list[data-v-cb7e8dd0]{position:-webkit-sticky;position:sticky;top:80px\n}\n.card-body-style[data-v-cb7e8dd0]{max-height:320px;min-height:320px;overflow-y:scroll\n}\n.spin[data-v-cb7e8dd0]{left:0;top:0;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;z-index:2;background:#ffffff85\n}\n.card .card-header[data-v-cb7e8dd0]{display:-webkit-box;display:-ms-flexbox;display:flex\n}\n.card .card-header h3[data-v-cb7e8dd0]{width:50%\n}\n.card-footer[data-v-cb7e8dd0] .ant-pagination{margin:5px 20px !important\n}\n","",{version:3,sources:["C:/laragon/www/PERSONAL_BLOG_PAGE/src/pages/movie/components/C:/laragon/www/PERSONAL_BLOG_PAGE/src/pages/movie/components/MovieList.vue"],names:[],mappings:";AAAA,4BAAW,wBAAwB,gBAAgB,QAAQ;CAAC;AAAA,kCAAiB,iBAAiB,iBAAiB,iBAAiB;CAAC;AAAA,uBAAM,OAAO,MAAM,oBAAA,oBAAA,aAAa,yBAAA,sBAAA,mBAAmB,wBAAA,qBAAA,uBAAuB,UAAU,oBAAoB;CAAC;AAAA,oCAAmB,oBAAA,oBAAA,YAAY;CAAC;AAAA,uCAAsB,SAAS;CAAC;AAAA,8CAAoC,0BAA0B;CAAE",file:"MovieList.vue",sourcesContent:["#file-list{position:-webkit-sticky;position:sticky;top:80px}.card-body-style{max-height:320px;min-height:320px;overflow-y:scroll}.spin{left:0;top:0;display:flex;align-items:center;justify-content:center;z-index:2;background:#ffffff85}.card .card-header{display:flex}.card .card-header h3{width:50%}.card-footer /deep/ .ant-pagination{margin:5px 20px !important}\n"],sourceRoot:""}])},Rq3j:function(e,t,a){var i=a("8kBa");"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);a("rjj0")("8caaecc2",i,!1,{})}});
//# sourceMappingURL=11.de7e6cd53092b73f951a.js.map