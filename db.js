/**
 * Created by OWNER on 2017-01-25.
 */

/**
 * db 정의와 mongoose 연결 확립 함수 export
 */

var mongoose = require('mongoose');

var dbURI = "mongodb://localhost:27017/";

exports.connect = function(){

    mongoose.Promise = global.Promise;
    mongoose.connect(dbURI);
    mongoose.connection.on('connected', function(){
        console.log('Succeed to get connection pool ' + dbURI);
    });

    mongoose.connection.on('error', function(err){
        console.log('Failed to get connection in mongoose, err is ' + err);
    });

    mongoose.connection.on('disconnected', function(){
        console.log('Database connection has disconnected.');
    });

    process.on('SIGINT', function(){
        mongoose.connection.close(function() {
            console.log('Application process is going down, disconnect database connection...');
            process.exit(0);
        });
    });

};