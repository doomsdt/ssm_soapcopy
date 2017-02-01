/**
 * Created by OWNER on 2017-01-28.
 *
 * 주제 스키마의 DB 컨트롤러
 */



"use strict";

let Subject = require('../models/subect.js');
let Count = require('../models/subjectCount.js');

/**
 * 새 주제 작성 함수
 * 카운터의 숫자를 증가시키고
 * 해당 카운터를 주제 번호로 하여 삽입
 */
exports.newSub = function(req, res){

    Count.findOneAndUpdate(
        {},
        {$inc:{seq:1}},
        {new:true},
        function(err, doc){
            if(!doc){
                doc = new Count({seq:1, cur:1});
                doc.save(function(err){});
            }
            let subject = new Subject(req.body);
            subject.number = doc.seq;
            subject.save();
        }
    );
    res.status(200).send();
};

/**
 * 이전 주제 반환 함수
 */
exports.getSubs = function(req, res){
    Subject.find({number : {$lte: req.params.subjectNum}}, 'subject', function(err, docs){
        res.status(200).json(docs);
    });
};

/**
 * 미래 주제 반환 함수
 */
exports.getSubsToCome = function(req, res){
    Subject.find({number : {$gte: req.params.subjectNum}}, 'subject', function(err, docs){
        res.status(200).json(docs);
    });
};

/**
 * 현재 주제 반환 함수
 * 카운터에 저장된 현재 주제 번호를 통해
 * 현재 주제 반환
 */
exports.getCurrentSub = function(req, res){
    Count.findOne({},
        function(err, doc){
            if(doc) {
                console.log(doc.cur);
                Subject.findOne({number: doc.cur}, function (error, document) {
                    if (error)
                        console.log(error);
                    console.log(document);
                    res.status(200).json(document);
                })
            } else {
                res.status(400).send();
            }
        }
    )
};

/**
 * 주제 변경 함수
 * 카운터의 현재 주제 번호와 최종 주제 번호를 비교하여
 * 변경 가능한 주제가 남아있다면 다음 주제로 변경
 */
let changeSub = function(){
    Count.findOne(
        {},
        function(err, doc){
            doc.cur = (doc.seq>doc.cur) ? doc.cur+1 : doc.cur;
            doc.save(function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log(doc.cur);
                }
            });
    });
};

/**
 * 2시간 단위 주제 변경 설정 함수
 */
var changeSubjectOnTime = function(){

    var now = new Date();
    var hour = now.getHours();

    var next = +new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0, 0);

    if(hour % 2 == 0){
        next += (1000 * 60 * 60 * 2);
    } else
        next += (1000 * 60 * 60);

    // 다음 변경 예정 시간을 계산하여 남은 시간을 milliseconds 로 구함
    var millisToNext = next-now;

    // 남은 시간 경과 후 2시간마다 주제를 변경하도록 설정
    setTimeout(function(){
        console.log("times up!");
        changeSub();
        setInterval(function(){
            changeSub();
        }, (1000 * 60 * 60 * 2));
    }, millisToNext);

    console.log("set changeSub be started on " + new Date(next));

};

changeSubjectOnTime();