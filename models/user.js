/**
 * Created by OWNER on 2017-01-25.
 */


/**
 * 유저 스키마
 * scraps : 구독 글 id 배열
 */

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    email: String,
    password: String,
    nickname: String,
    scraps: [String]
});

module.exports = mongoose.model('User', userSchema);