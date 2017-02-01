/**
 * Created by OWNER on 2017-01-31.
 */


/**
 * 글감 주제 번호 auto_increment를 위해 구현한 카운터
 * seq : 생성된 최종 주제 번호
 * cur : 현재 주제 번호
 */


var mongoose = require('mongoose');

var countSchema = new mongoose.Schema({
    seq: {type: Number, default: 0},
    cur: {type: Number, default: 0},
    changed: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Count', countSchema);