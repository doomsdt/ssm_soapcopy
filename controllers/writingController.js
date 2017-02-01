/**
 * Created by OWNER on 2017-01-28.
 *
 * 작성 글 스키마의 DB 컨트롤러
 */

var Writing = require('../models/writing.js');
var multer = require('multer');

/**
 * 새 글 작성 함수
 * 파일 첨부 시 파일 경로 추가
 */
    exports.newWriting = function(req,res){

        var writing = new Writing(req.body);
        if(req.body.filename)
            writing.filepath = "images/" + req.file.filename;

        writing.save(function(err, doc){
            if(err)
                console.log(err);
            res.status(200).send();
        });
    };

/**
 * 특정 주제의 글 모두 반환하는 함수
 */
    exports.getWriting = function(req,res) {
        Writing.find({subjectId: req.params.subjectId}).sort({dateTime: -1}).exec(function (err, docs) {
            res.status(200).json(docs);
        });
    };

/**
 * 내가 쓴 글 모두 반환하는 함수
 */
    exports.getMine = function(req,res) {
        Writing.find({userId: req.params.userId}).sort({dateTime: -1}).exec(function (err, docs) {
            res.status(200).json(docs);
        });
    };

/**
 * 글 삭제 함수
 */
    exports.delWriting = function(req, res){
        Writing.remove({_id: req.params.writingId}, function(err){
            res.status(200).send();
        });
    };

/**
 * 글 수정 함수
 * 파라미터에 의해
 * 본문 수정 기능과
 * 댓글 추가 기능으로 분류됨
 */
    exports.update = function(req, res) {
        if (!req.body.userNickname) {
            Writing.update(
                {_id: req.params.writingId},
                {body : req.body.body},
                {upsert: false},
                function (err) {
                    res.status(200).send();
                }
            );
        }
        else {
            Writing.update(
                {_id: req.params.writingId},
                {$addToSet: {replies: req.body}},
                function (err) {
                    if (err) console.log(err);
                    res.status(200).send();
                }
            );
        }
    };

/**
 * 댓글 불러오기 함수
 */
    exports.getReplies = function(req, res){
        Writing.find({_id:req.params.writingId},'replies', function(err, docs){
            if(docs)
                res.status(200).json(docs[0]);
            else
                res.status(400).send();
        });
    };

