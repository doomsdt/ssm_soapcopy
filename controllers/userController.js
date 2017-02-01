/**
 * Created by OWNER on 2017-01-25.
 *
 * 유저 스키마의 DB 컨트롤러
 */

var User = require("../models/user.js");
var Writing = require("../models/writing.js");

/**
 * 회원 가입 함수
 */
exports.signUp = function(req, res){
    new User(req.body).save(function(err,doc){
        res.status(200).send();
    });
};

/**
 * 담아놓은 글 목록 반환 함수
 */
exports.getScraps = function(req, res){
    User.find({_id:req.params.userId},'scraps', function(err, docs){
        if(err){
            res.status(400).send(err);
        } else {
            var scrapList = docs[0].scraps;
            Writing.find({_id : {$in : scrapList}}).sort({dateTime: -1}).exec(function (err, docs2) {
                res.status(200).json(docs2);
            });
        }
    });
};

/**
 * 로그인 함수
 */
exports.login = function(req, res){
    User.find({email:req.body.email, password:req.body.password},'email nickname',function(err, docs){
        if(docs[0]){
            res.status(200).json(docs[0]);
        } else {
            res.status(400).send("No such user");
        }
    });
};

/**
 * 유저 정보 업데이트 함수
 * !담아놓은 글 추가 부분만 구현됨
 */
exports.update = function(req, res){
    User.update(
        {_id:req.params.userId},
        {$addToSet: {scraps: req.body.writingId}},
        function(err){
            res.status(200).send();
    });
};