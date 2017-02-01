/**
 * Created by OWNER on 2017-01-26.
 */


/*
* 컴포넌트 간 데이터 공유를 위한 전역 객체입니다.
* props를 통한 전달로 대부분 대체하였으나 시간 부족으로 일부가 남아있습니다.
* */
var sharedStore = {
    state : {
        writing : {},
        userId : "",
        userNickname : "",
        isLogin : false,
        isScrap : false
    }
};


/*
* 공통적으로 쓰이는 style template 객체를 추출하여 전역 객체 안에 두었습니다.
* */
var styleTemplate = {
    page : {
        height: '100%',
    },
    centering : {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url("images/background.jpg")'
    },
    userform : {
        width: '30%',
        padding: '20px',
        borderRadius: '15px',
        backgroundColor: '#FFF',
        textAlign: 'center'
    },
    title : {
        fontSize : '1.7em',
        marginBottom : '20px'
    },
    board : {
        textAlign : 'center',
        display : 'flex',
        flexDirection: 'column',
        alignItems : 'center',
        paddingTop: '30px'
    },
    body : {
        margin:'0 0 0 20%',
        display: 'flex',
        'align-items': 'stretch',
        height: '100%'
    },
    nav : {
        height: '100%',
        width: '20%',
        marginTop: '70px',
        paddingTop: '30px',
        position: 'fixed',
        borderRight: 'solid 1px #E1E1E1',
        top:'0',
        left:'0',
        overflowX: 'hidden'
    },
    anchor : {
        display : 'inline-block',
        width : '60%',
        textDecoration: 'none',
        margin: '30px 10px 0px 0px'
    },
    article : {
        color : 'black',
        padding : '20px 40px',
        borderRadius : '5px',
        border: 'solid 1px black',
        boxShadow : '7px 7px 4px #888888'
    },
    section : {
        width:'100%',
        textAlign: 'center'
    },
    writing : {
        title : {
            fontSize: '1.9em',
            margin : '15px'
        },
        imagearea : {
            width: '25%',
            minHeight: '1px',
            height: '95%'
        },
        textarea : {
            width: '65%'
        },
        preview : {
            height : '200px',
            width : 'auto',
            maxWidth : '95%'
        }
    }
};

/*
* 비 부모-자식 객체 간 이벤트 전달을 위해 설정한 Vue 객체입니다.
* 구조를 모두 부모-자식 관계에 속하도록 바꾸었으나 시간 부족으로 일부가 남아있습니다.
* */
var bus = new Vue();


/*
* 메뉴바 컴포넌트
* */
Vue.component('navigation', {
    template : '\
    <nav :style="styleTemplate.nav">\
    \
        <ul :style="styleTemplate.menu">\
            <li :style="styleTemplate.list" v-for="item in menu">\
                <a href="#" @click="makeActive(item)" :style="styleTemplate.navItem">{{item.name}}</a>\
            </li>\
            <li :style="styleTemplate.list">\
                <a href="#" @click="logout" :style="styleTemplate.navItem">나가기.</a>\
            </li>\
        </ul>\
    \
    </nav>\
    ',
    data : function(){
        return {
            styleTemplate : {
                nav : styleTemplate.nav,
                navItem : {
                    fontFamily : 'Nanum Myeongjo',
                    textDecoration : 'none',
                    color : 'black'
                },
                menu : {
                    listStyleType: 'none'
                },
                list : {
                    padding: '10px',
                    fontSize: '2em'
                }
            }
        }
    },
    methods : {

        /*
        * 메뉴 클릭 시 해당 섹션이 활성화 되도록 부모 객체에 이벤트 전달
        * */
        makeActive : function(item){
            this.$emit('activate', item);
        },
        logout:function(){
            sharedStore.state.userId = "";
            sharedStore.state.userNickname = "";
            sharedStore.state.isLogin = false;

            this.$emit('logout');
        }
    },
    props : ['menu']
});

/*
* 글 작성 편집기 컴포넌트
* */
Vue.component('writer',{
    template: '\
    <div :style="styleTemplate.board">\
    <section :style="styleTemplate.writer">\
    \
        <div :style="styleTemplate.writing.title">{{subject.subject}}</div>\
        \
        <form class="form-inline" v-on:submit.stop.prevent="submitWriting" enctype="multipart/form-data">\
        \
                <div class="form-group" :style="styleTemplate.writing.imagearea">\
                    <img :src="image" :style="styleTemplate.writing.preview" />\
                    <button v-if="image" @click.stop.prevent="removeImage">파일 제거</button>\
                    <input v-if="!image" type="file" @change="onFileChange" />\
                </div>\
                \
                <div class="form-group" :style="styleTemplate.writing.textarea">\
                    <textarea style="width:80%" name="body" v-model="body" cols="30" rows="10"></textarea><br/>\
                </div>\
                <div style="display:block; margin:15px">\
                    <input class="btn btn-default" type="submit" value="완료"/>\
                </div>\
        </form>\
    </section>\
    <div is="map-board" style="width:760px;height:400px;margin-top:20px;"></div>\
    </div>\
\
    ',
    props:['options'],
    data:function(){
        return {
            isLogin:sharedStore.state.isLogin,
            body:"",
            image:"",
            file:"",

            // 글 작성과 수정 시 같은 컴포넌트를 이용하기 위한 코드. post와 modify가 있음
            writerCode:"post",
            // 작성되는 글의 주제
            subject:this.options.subject,
            styleTemplate : {
                board : styleTemplate.board,
                writer : {
                    border : 'solid 1px #E1E1E1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    width:'70%',
                    padding:'20px',
                    margin:'40px'
                },
                writing : styleTemplate.writing
            }
        }

    },
    methods: {
        /**
         * writerCode 에 따라 실행할 함수를 결정하는 함수
         */
        submitWriting: function(){
            if(this.writerCode == "modify")
                this.modifyWriting();
            else if(this.writerCode == "post")
                this.newWriting();
        },

        /**
         * 글 작성을 위해 multipart form data에 데이터를 담아 post 요청하는 함수
         */
        newWriting : function(){

            var formData = new FormData();
            var vm = this;
            formData.append("userId",sharedStore.state.userId);
            formData.append("userNickname",sharedStore.state.userNickname);
            formData.append("subjectId",this.subject._id);
            formData.append("subject",this.subject.subject);
            formData.append("body",this.body);
            if(this.file!="") {
                formData.append("image", this.file);
                var date = +new Date();
                formData.append("filename", sharedStore.state.userId + "" + date);
            }

            this.$http.post('/writing', formData, {headers:{"Content-Type":"multipart/form-data"}}
            )
                .then(function(){
                    bus.$emit('sectionChange', {name:'List', comp:'list', options: {
                        listCode : "subjectWritings",
                        subject : vm.subject
                    }});
                }, function(){

                });

            this.body="";
        },

        /**
         * 글 수정을 위해 http put 요청 후 글 리스트로 돌아가는 함수
         */
        modifyWriting : function(){
            this.$http.put('/writing/' + sharedStore.state.writing._id, {
                body:this.body
            })
                .then(function(){
                    bus.$emit('sectionChange', {name:'List', comp:'list', options: {
                        listCode : "subjectWritings",
                        subject : vm.subject
                    }});
                }, function(){

                });

            this.body = "";
        },

        /**
         * input file 의 변경이 있을 시 data에 할당하는 함수
         */
        onFileChange(e){
            var files = e.target.files || e.dataTransfer.files;
            if(!files.length)
                return ;
            this.createImage(files[0]);
            this.file = files[0];
        },

        /**
         * 할당된 file 변수를 통해 미리보기 이미지를 생성하는 함수
         * @param file : 이미지를 생성할 파일
         */
        createImage(file){
            var image = new Image();
            var reader = new FileReader();
            var vm = this;

            reader.onload = (e) => {
                vm.image = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        /**
         * 파일과 미리보기 이미지를 해제하는 함수
         * @param e : 클릭 이벤트
         */
        removeImage: function(e){
            this.image = "";
            this.file="";
        }

    },
    watch : {
        /**
         * 부모 객체에서 주입된 options 에 변경이 있을 시 호출되어 본 객체의 옵션 사항을 가져옴
         */
        options : function(){
            this.writerCode = this.options.writerCode;
            this.subject = this.options.subject;
        }
    },
    created: function(){
        /**
         * 생성 목적이 글 수정이라면 수정할 글을 textarea에 보여줌
         */
        if(this.writerCode == "post"){}
        else if(this.writerCode == "modify")
            this.body = sharedStore.state.writing.body;
    }
});

/**
 * 글 목록 컴포넌트
 */
Vue.component('list',{
    template: '\
    <div :style="styleTemplate.board">\
    \
        <input class="btn btn-default" style="width:40%; height:50px; font-size:1.6em" @click="toWriter" v-if="listCode == \'subjectWritings\'" type="submit" value="글쓰기"><br/>\
        \
        <a @click="toWriting(writing)" href="#" v-for="writing in writings" :style="styleTemplate.anchor">\
        \
            <article class="form-inline" :style="styleTemplate.article">\
                <div :style="styleTemplate.writing.title">{{writing.subject}}</div>\
                <div :style="styleTemplate.body">\
                    <div v-if="writing.filepath" :style="styleTemplate.writing.imagearea">\
                        <img :src="writing.filepath" :style="styleTemplate.writing.preview">\
                    </div>\
                    <div :style="[styleTemplate.writing.textarea, styleTemplate.textarea]">\
                        <p :style="styleTemplate.text">{{writing.body}}</p>\
                        <div :style="styleTemplate.tag">\
                            <p :style="styleTemplate.writer">{{writing.userNickname}}</p>\
                            <p :style="styleTemplate.dateTime">{{writing.dateTime | dateFormat}}</p>\
                        </div>\
                    </div>\
                </div>\
            </article>\
        </a>\
    </div>\
    ',
    data: function(){
        return {
            subject: this.options.subject,
            writings : [],

            // 주제의 글, 내가 쓴 글, 담아온 글을 같은 컴포넌트로 사용하기 위해 구분하는 코드. subjectWriting, myWriting, scrapWriting으로 구분
            listCode : this.options.listCode,
            styleTemplate : {
                board : styleTemplate.board,
                anchor : styleTemplate.anchor,
                article : {
                    color : 'black',
                    padding : '20px 40px',
                    borderRadius : '5px',
                    border: 'solid 1px black',
                    boxShadow : '7px 7px 4px #888888',
                    textAlign: 'center'
                },
                writing : styleTemplate.writing,
                textarea : {
                    margin : '0 0 0 10px',
                    display : 'flex',
                    flexDirection : 'column',
                    justifyContent : 'space-between'
                },
                title : {
                    fontSize : '25px',
                    fontWeight : 'bold',
                    textAlign : 'center'
                },
                body : {
                    display : 'flex',
                    justifyContent: 'center'
                },
                text : {
                    top : '0',
                    textAlign : 'left',
                    fontSize : '20px',
                    whiteSpace : 'pre-line'
                },
                tag : {
                    bottom : '0'
                },
                writer : {
                    fontSize : '13px',
                    textAlign : 'center'
                },
                dateTime : {
                    textAlign : 'center'
                }
            }
        }
    },
    props : ['options'],
    filters: {
        /**
         * DB에 저장되어있던 Date 형태의 변수를 포맷에 맞게 바꿔주는 필터 함수
         * @param isoDate Date 변수
         * @returns {string} 년 월 일 시로 표현되는 지정 포맷 문자열
         */
        dateFormat : function(isoDate){
            var dt = new Date(isoDate);
            return dt.getFullYear() + "년 " + (dt.getMonth()+1) + "월 " + dt.getDate() + "일 " + dt.getHours() + "시";
        }
    },
    methods:{
        /**
         * 정해진 주제의 모든 글을 불러오는 함수
         */
        getWriting : function(){
            this.$http.get('/writing/'+this.subject._id)
                .then(function(result){
                    this.writings = result.data;
                }, function(error){

                });
        },
        /**
         * 현재 사용중인 유저가 담아 둔 모든 글을 불러오는 함수
         */
        getScraps : function(){
            this.$http.get('/user/scraps/' + sharedStore.state.userId)
                .then(function(result){
                    this.writings = result.data;
                }, function(){

                });
        },
        /**
         * 현재 사용중인 유저가 작성한 모든 글을 불러오는 함수
         */
        getMine : function(){
            this.$http.get('/user/writings/' + sharedStore.state.userId)
                .then(function(result){
                    this.writings = result.data;
                }, function(){

                });
        },
        /**
         * listCode에 따라 글을 가져오는 함수를 선택하는 함수
         */
        getContents : function(){
            if(this.listCode == "subjectWritings")
                this.getWriting();
            else if(this.listCode == "scrappedWritings")
                this.getScraps();
            else if(this.listCode == "myWritings")
                this.getMine();
        },
        /**
         * 글 상세보기로 이동
         * @param writing : 이동할 글 객체
         */
        toWriting: function(writing){
            bus.$emit('sectionChange',{name:"Writing", comp:"writing-detail", options: {
                subject : this.subject
            }});
            sharedStore.state.writing = writing;
        },
        /**
         * 글 작성으로 이동
         */
        toWriter: function(){
            bus.$emit('sectionChange',{name:"Write", comp:"writer", options: {
                writerCode : "post",
                subject : this.subject
            }});
        }
    },
    watch : {
        /**
         * 주입된 옵션 변경 시 본 객체 옵션 갱신
         */
        options : function(){
            this.listCode = this.options.listCode;
        },
        /**
         * listCode 변경 시 해당 불러오기 함수 호출
         */
        listCode : function(){
            this.getContents();
        }
    },
    created : function(){
        /**
         * 생성 시 불러오기 함수 호출
         */
        this.getContents();
    }
});

/**
 * 글 주제 컴포넌트
 */
Vue.component('subjects',{
    template:'\
    <div :style="styleTemplate.board">\
        <a href="#" v-for="subject in subjects" @click="toList(subject)" :style="styleTemplate.anchor">\
            <article :style="styleTemplate.article">\
            {{subject.subject}}\
            </article>\
        </a>\
    </div>\
    '
    ,
    props:['options'],
    data:function(){
        return {

            //주제들을 가지는 배열
            subjects: [],
            styleTemplate : {
                board : styleTemplate.board,
                anchor : styleTemplate.anchor,
                article : styleTemplate.article
            }
        }
    },
    methods:{
        /**
         * 목록으로 돌아가는 함수
         * @param subject : 목록에 불러올 주제
         */
        toList: function(subject){
            bus.$emit('sectionChange',{name:"List", comp:"list", options: {
                listCode : "subjectWritings",
                subject : subject
            }});
        },
        /**
         * 이때까지 게시되었던 주제들을 모두 불러오는 함수
         */
        getSubjects: function(){
            this.$http.get('/subjects/' + this.options.subject.number)
                .then(function(result){
                    this.subjects = result.data;
                }, function(error){

                });
        }
    },
    created:function(){
        /**
         * 컴포넌트 생성 시 불러오기
         */
        this.getSubjects();
    }
});

/**
 * 관리자 컴포넌트
 */
Vue.component('manager',{
    template:'\
    <div :style="styleTemplate.board">\
        <div>\
            <form class="form-inline" v-on:submit.stop.prevent="newSubject">\
                <div class="form-group">\
                    <label for="subject">새 주제 : </label>\
                    <input class="form-control" type="text" name="subject" id="subject" v-model="subjectName" /><br/>\
                </div>\
                <input class="btn btn-default" type="submit" value="추가" />\
            </form>\
        </div>\
        <template v-for="sub in subjectsToCome">\
            <article :style="[styleTemplate.anchor, styleTemplate.article, styleTemplate.flex]">\
                <span>주제 : {{sub.subject}}</span>\
                <span>{{sub.status | statusFormat}}</span>\
            </article>\
            <div style="margin-top:20px">\
                <span class="glyphicon glyphicon-arrow-down"></span>\
            </div>\
        </template>\
    </div>\
    ',
    props: ['options'],
    data: function(){
            return {
                //현재 주제
                subject: this.options.subject,

                //추가 될 주제 이름
                subjectName: "",

                //앞으로 예정 된 주제들
                subjectsToCome: [],
                styleTemplate: {
                    board : styleTemplate.board,
                    body : styleTemplate.body,
                    anchor : styleTemplate.anchor,
                    article : styleTemplate.article,
                    flex : {
                        display : 'flex',
                        justifyContent : 'space-between'
                    }
                }
            }
        }
    ,
    filters: {
        /**
         * Date 변수인 변경 예정 시간을 포매팅하는 필터 함수
         * @param isoDate : 변경 예정 시간
         * @returns {*} : 년 월 일 시의 지정 포맷 문자열
         */
        statusFormat : function(isoDate){
            // 상태가 현재 주제라면 그대로 return
            if(isoDate == "현재") return isoDate;
            var dt = new Date(isoDate);
            return "변경 시간 : " + dt.getFullYear() + "년 " + (dt.getMonth()+1) + "월 " + dt.getDate() + "일 " + dt.getHours() + "시";
        }
    },
    methods: {
        /**
         * 새로운 주제를 추가하는 함수
         */
        newSubject : function(){
            this.$http.post('/subject', {'subject':this.subjectName})
                .then(function(result){
                    this.getSubjects();
                }, function(error){

                });
            this.subjectName = "";
        },
        /**
         * 앞으로 예정된 주제들을 불러오는 함수
         */
        getSubjects : function(){
            var vm = this;
            this.$http.get('/subject/' + this.subject.number)
                .then(function(result){
                    vm.subjectsToCome = result.data;
                    this.getStatus();
                }, function(error){

                });
        },
        /**
         * 예정된 주제 배열의 각 객체에 추가로 현재 주제, 변경 예정 시간 등의 상태를 추가하는 함수
         */
        getStatus : function(){

            //generator 함수
            var gen = this.getTime();

            for(var key in this.subjectsToCome){

                //각 객체에 대해 status key 에 generator가 반환하는 값 할당
                this.subjectsToCome[key].status = gen.next().value;
            }
        },
        /**
         * 예정된 주제들의 상태 값을 생성하는 generator 함수
         */
        getTime : function*(){
            var now = new Date();
            var hour = now.getHours();

            // 변경 예정 시간을 구하기 위해 현재 시간에서 0분 0초로 세팅
            var next = +new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0, 0);

            // 현재 시간이 짝수라면 +2시간, 홀수라면 +1시간
            if(hour % 2 == 0){
                next += (1000 * 60 * 60 * 2);
            } else
                next += (1000 * 60 * 60);

            // 먼저 현재 주제를 위한 값 반환
            yield "현재";

            while(true) {
                // 다음으로 들어오는 요청에 대해 차례로 변경 예정시간 반환
                yield new Date(next);
                // 다음 변경 예정시간 = 변경 예정시간 +2시간
                next += (1000 * 60 * 60 * 2);
            }
        }
    },
    created : function(){
        /**
         * 컴포넌트 생성 시 주제 가져옴
         */
        this.getSubjects();
    }
});

/**
 * 글 상세보기 컴포넌트
 */
Vue.component('writing-detail',{
    template : '\
    <div>\
        <div>\
            <input @click="modify" type="submit" value="수정"/>\
            <input @click="remove" type="submit" value="삭제"/>\
            <input @click="scrap" type="submit" value="담아가기"/>\
            <p>{{writing.body}}</p>\
            <p>{{writing.userNickname}}</p>\
            <p>{{writing.dateTime}}</p>\
        </div>\
        \
        <form @submit.stop.prevent="addReply">\
            <input type="text" v-model="replyBody"/>\
            <input type="submit" value="댓글"/>\
        </form>\
        <article is="reply" v-for="reply in replies" v-bind:reply="reply"></article>\
    </div>\
    ',
    data : function(){
        return {
            writing : {},
            replyBody : "",
            replies : [],
            writerCode : "post"
        }
    },
    props : ['subject','options'],
    methods : {
        /**
         * 댓글 작성 함수
         */
        addReply : function(){
            this.$http.put('/writing/' + this.writing._id, {
                body : this.replyBody,
                userId : sharedStore.state.userId,
                userNickname : sharedStore.state.userNickname
            })
                .then(function(result){
                    this.replyBody = "";
                    this.getReply();
                }, function(error){

                });
        },
        /**
         * 댓글 불러오기 함수
         */
        getReply : function(){
            this.$http.get('/replies/' + this.writing._id)
                .then(function(result){
                    this.replies = result.data.replies;
                }, function(error){

                });
        },
        /**
         * 수정을 위한 편집기 호출
         */
        modify : function(){
            bus.$emit('sectionChange', {name:"Modify", comp:"writer", options: {
                writerCode : "modify",
                subject : this.subject
            }});
        },

        /**
         * 글 제거 함수
         */
        remove : function(){
            this.$http.delete('/writing/' + this.writing._id)
                .then(function(result){
                    bus.$emit('sectionChange', {name:"List", comp:"list", options: {
                        listCode : "subjectWritings",
                        subject : this.subject
                    }});
                }, function(error){

                })
        },

        /**
         * 현재 계정에 담아놓기 함수
         */
        scrap : function(){
            this.$http.put('/user/' + sharedStore.state.userId, {
                writingId : this.writing._id
            })
                .then(function(result){

                }, function(error){

                });

        }
    },
    watch : {
        /**
         * 주입된 옵션 변경 시 갱신
         */
        options : function(){
            this.writerCode = options.writerCode;
        }
    },
    created : function(){
        /**
         * props style로 바꾸지 못해 남아있는 공유 객체 사용
         */
        this.writing = sharedStore.state.writing;
        this.getReply();
    }
});

/**
 * 댓글 컴포넌트
 * ! 필요 이상의 모듈화
 */
Vue.component('reply',{
    template:'\
    <article>\
        <p>{{reply.body}}</p>\
        <p>{{reply.userNickname}}</p>\
    </article>\
    ',
    props:['reply']
});

/**
 * 지도판 컴포넌트
 * ! 위치 저장 기능 미구현
 * ! 테스트용으로 집 주소를 지도에 마킹하는 것까지 구현해 보았습니다.
 */
Vue.component('map-board',{
    template:
        '\
        <div id="map">\
        </div>\
        \
        '
    , methods: {
        initMap : function(){
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function(pos){
                    var lat = pos.coords.latitude;
                    var lng = pos.coords.longitude;
                    var mapOptions = {
                        zoom : 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        center: new google.maps.LatLng(lat,lng)
                    };

                    //id가 'map'인 DOM에 지도 생성
                    var map = new google.maps.Map(document.getElementById('map'),mapOptions);
                    var myIcon = new google.maps.MarkerImage("https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/google-maps-icons/wifi-logo.png",
                        new google.maps.Size(40,40), null, null,new google.maps.Size(40,40));
                    var address ='인천광역시 서구 한내로 7';
                    var marker = null;

                    //위치 <-> 주소 변환 API
                    var geocoder = new google.maps.Geocoder();

                    // 집 주소를 위치로 변환하여 지도에 마킹
                    geocoder.geocode({'address':address}, function(results, status){
                        if(status == google.maps.GeocoderStatus.OK){
                            map.setCenter(results[0].geometry.location);
                            marker = new google.maps.Marker({
                                map: map,
                                //icon: myIcon,
                                title: 'My Home',
                                position: results[0].geometry.location
                            });
                        } else {
                            alert("Geocode failed by : " + status);
                        }
                    });

                },function(err){
                    console.log(err.code);
                })
            } else {
                console.log("Geo not supported");
            }
        }
    },
    created : function(){
        this.initMap();
    }
});

/**
 * 메인 페이지 컴포넌트
 */
Vue.component('mainpage', {
    template : '\
    <div>\
    \
        <nav is="navigation" :menu="menu" @activate="makeActive" @logout="logout"></nav>\
    \
        <div :style="styleTemplate.body">\
            <!-- 아래 div는 active 변수에 따라 컴포넌트를 교체합니다. --> \
            <div :style="styleTemplate.section" :is="active.comp" :options="active.options"></div>\
        </div>\
    \
    </div>\
    ',
    data: function(){
        return {
            // 현재 활성화 되어있는 컴포넌트 객체
            active:{},

            // 현재 글 주제
            subject:{},

            // navigation bar에 주입할 컴포넌트 & 옵션 객체 목록
            menu:[
                {name:"글쓰기", comp:"writer", options: {
                    writerCode : "post"
                }},
                {name:"글감 목록", comp:"subjects", options: {}},
                {name:"나의 글", comp:"list", options: {
                    listCode : "myWritings"
                }},
                {name:"담아온 글", comp:"list", options: {
                    listCode : "scrappedWritings"
                }},
                {name:"관리", comp:"manager", options: {}}
            ],

            // 자식 객체에 주입할 옵션
            options:{},
            styleTemplate: styleTemplate
        }
    },
    methods:{
        /**
         * 자식 객체에서 컴포넌트 교체 요청 시 해당 컴포넌트 객체를 활성화
         * @param item : 컴포넌트 정보 객체
         */
        makeActive: function(item){
            if(!item.options.subject) {
                item.options.subject = this.subject;
            }
            this.active = item;
        },

        /**
         * 현 시간 서버에 게시된 주제 get
         * @returns {Promise} : 비동기 처리를 위한 Promise 반환
         */
        getCurrentSubject: function(){
            var vm = this;
            return new Promise(function(resolve, reject){
                vm.$http.get('/subject')
                    .then(function(result){
                        this.subject = result.data;
                        resolve(result.data);
                    }, function(){
                        resolve({subject:"주제 없음", number:0});
                    });
            });
        },

        /**
         * 로그아웃 시 로그인 페이지로 전환
         */
        logout: function(){
            this.$emit('activate',{comp:"loginpage"});
        }
    },
    created:async function(){
        /**
         * 생성 시 getCurrentSubject 의 호출 반환을 기다려 옵션에 현재 주제를 주입
         * @type {*}
         */

        // await 명령어로 비동기 함수의 반환을 기다려 값 할당
        var subject = await this.getCurrentSubject();

        // 초기 메뉴 활성화
        this.makeActive({name:"글쓰기", comp:"writer", options: {
            writerCode : "post",
            subject : subject
        }});
        var vm = this;

        // 컴포넌트 교체 요청 이벤트 시 해당 객체 활성화
        bus.$on('sectionChange',function(obj){
            vm.makeActive(obj);
        });
    }
});

/**
 * 로그인 페이지 컴포넌트
 */
Vue.component('loginpage', {

    template : '\
    <div :style="styleTemplate.page">\
        <div :style="styleTemplate.userform">\
            <div :style="styleTemplate.title">\
                <span>들어가기.</span>\
            </div>\
            <form class="form-horizontal" v-on:submit.stop.prevent="login">\
            \
                <div class="form-group">\
                    <label class="control-label col-sm-2" for="email">\
                        <span class="glyphicon glyphicon-user"></span>\
                    </label>\
                    <div class="col-sm-8">\
                        <input class="form-control" type="email" v-model="email" id="email" placeholder="이메일" />\
                    </div>\
                </div>\
                \
                <div class="form-group">\
                    <label class="control-label col-sm-2" for="email">\
                        <span class="glyphicon glyphicon-lock"></span>\
                    </label>\
                    <div class="col-sm-8">\
                        <input class="form-control" type="password" v-model="password" id="password" placeholder="비밀번호" />\
                    </div>\
                </div>\
                \
                <div class="form-group">\
                    <div class="col-sm-offset-1 col-sm-10">\
                        <button class="btn btn-default col-sm-5" @click="signUp">회원가입</button>\
                        <input class="btn btn-default col-sm-offset-1 col-sm-5" type="submit" value="로그인" />\
                    </div>\
                </div>\
            </form>\
        </div>\
    </div>\
    ',
    data : function(){
        return {
            email : "",
            password : "",
            styleTemplate : {
                page : styleTemplate.centering,
                userform : styleTemplate.userform,
                title : styleTemplate.title
            }
        }
    },
    methods : {
        /**
         * 로그인 요청 후 성공 시 메인 페이지 진입
         */
        login:function(){
            this.$http.post('/login',{
                email : this.email,
                password : this.password
            }).then(function(result){
                sharedStore.state.userId = result.data._id;
                sharedStore.state.userNickname = result.data.nickname;
                sharedStore.state.isLogin = true;
                this.$emit('activate',{comp:"mainpage"});
            }, function(error){
                console.log("Error : " + error.data);
            });
            this.login_email = "";
            this.login_password = "";
        },
        /**
         * 가입 페이지 요청
         */
        signUp:function(){
            this.$emit('activate',{comp:"signuppage"});
        }
    }
});

/**
 * 회원가입 페이지 컴포넌트
 */
Vue.component('signuppage', {
    template : '\
    <div :style="styleTemplate.page">\
        <div :style="styleTemplate.userform">\
            <div :style="styleTemplate.title">\
                <span>가입하기.</span>\
            </div>\
            <form class="form-horizontal" v-on:submit.stop.prevent="signIn">\
            \
                <div class="form-group">\
                    <label class="control-label col-sm-2" for="email">\
                        <span class="glyphicon glyphicon-user"></span>\
                    </label>\
                    <div class="col-sm-8">\
                        <input class="form-control" type="email" v-model="email" id="email" placeholder="이메일" />\
                    </div>\
                </div>\
                \
                <div class="form-group">\
                    <label class="control-label col-sm-2" for="email">\
                        <span class="glyphicon glyphicon-lock"></span>\
                    </label>\
                    <div class="col-sm-8">\
                        <input class="form-control" type="password" v-model="password" id="password" placeholder="비밀번호" />\
                    </div>\
                </div>\
                \
                <div class="form-group">\
                    <label class="control-label col-sm-2" for="email">\
                        <span class="glyphicon glyphicon-pencil"></span>\
                    </label>\
                    <div class="col-sm-8">\
                        <input class="form-control" type="text" v-model="nickname" id="nickname" placeholder="필명" />\
                    </div>\
                </div>\
                \
                <div class="form-group">\
                    <div class="col-sm-offset-1 col-sm-10">\
                        <button class="btn btn-default col-sm-5" @click="cancel">뒤로</button>\
                        <input class="btn btn-default col-sm-offset-1 col-sm-5" type="submit" value="회원가입" />\
                    </div>\
                </div>\
            </form>\
        </div>\
    </div>',
    data : function(){
        return {
            email : "",
            password : "",
            nickname : "",
            styleTemplate : {
                page : styleTemplate.centering,
                userform : styleTemplate.userform,
                title : styleTemplate.title
            }
        }
    },
    methods : {
        /**
         * 회원가입 요청
         */
        signIn:function(){
            this.$http.post('/user',{
                email : this.email,
                password : this.password,
                nickname : this.nickname
            });
            this.email = "";
            this.password = "";
            this.nickname = "";

            this.$emit('activate',{comp:"loginpage"});
        },
        /**
         * 취소하고 로그인 페이지로
         */
        cancel : function(){
            this.$emit('activate',{comp:"loginpage"});
        }
    }
});

/**
 * Vue Application
 */
let app = new Vue({
    el:'#ssm',
    data : {
        // 활성화 페이지 객체 변수
        active : {comp : 'loginpage'},
        styleTemplate : {
            page : styleTemplate.page
        }
    },
    methods : {
        /**
         * 자식 객체의 페이지 교체 요청에 따라 해당 페이지 활성화
         * @param page : 교체 요청 페이지 정보 객체
         */
        makeActive : function(page){
            this.active = page;
        }
    }
});