/**
 * Created by OWNER on 2017-01-28.
 */


/**
 * 글감 주제 스키마
 * subject : 주제명
 * number : 주제 번호
 */

var mongoose = require('mongoose');
var subjectSchema = new mongoose.Schema({
    subject: String,
    number: Number
});

module.exports = mongoose.model('Subject', subjectSchema);