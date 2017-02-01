/**
 * Created by OWNER on 2017-01-25.
 *
 * HTTP 라우터 모듈
 */

var express = require('express');
var router = express.Router();
var userCon = require('./controllers/userController');
var writingCon = require('./controllers/writingController');
var subjectCon = require('./controllers/subjectController');
var multer = require("multer");

router.get('/', function(req, res){
    res.sendfile('./public/list.html');
});

router.post('/user', userCon.signUp);

router.put('/user/:userId', userCon.update);

router.get('/user/scraps/:userId', userCon.getScraps);

router.get('/user/writings/:userId', writingCon.getMine);

router.post('/login', userCon.login);

router.post('/subject', subjectCon.newSub);

router.get('/subject/:subjectNum', subjectCon.getSubsToCome);

router.get('/subject', subjectCon.getCurrentSub);

router.get('/subjects/:subjectNum', subjectCon.getSubs);

router.get('/writing/:subjectId', writingCon.getWriting);

router.post('/writing', multer({dest: __dirname + '/public/images'}).single('image'), writingCon.newWriting);

router.put('/writing/:writingId', writingCon.update);

router.delete('/writing/:writingId', writingCon.delWriting);

router.get('/replies/:writingId', writingCon.getReplies);

module.exports = router;