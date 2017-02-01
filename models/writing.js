/**
 * Created by OWNER on 2017-01-28.
 */

/**
 * 작성 글 스키마
 */

var mongoose = require('mongoose');

var writingSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    //userId: String,
    userNickname: String,
    subjectId: {type: mongoose.Schema.Types.ObjectId, ref: 'Subject'},
    subject: String,
    body: String,
    dateTime: {type: Date, default: Date.now},
    replies : [new mongoose.Schema({
        body : String,
        userId : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        userNickname : String,
        dateTime : {type: Date, default: Date.now}
    })],
    filepath : String
});

module.exports = mongoose.model('Writing', writingSchema);