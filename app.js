var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Crawler=require('crawler');

var index = require('./routes/index');
var users = require('./routes/users');
var app = express();
//
var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            var arr=$(".tray-item-thumbnail");
            express.data_crawl=[];
            if(express.data_crawl.length==0||arr[0].attribs.src!=express.data_crawl[0].src)
            {
              for( i=0;i<10;i++)
              {
                if(arr[i])
                {
                  console.log(arr[i].attribs);
                  express.data_crawl.push(arr[i].attribs);
                }
              }
            }
            else {

            }
        }

        // setTimeout(()=>{c.queue(['http://vuighe.net','https://noname9x.herokuapp.com']);},120000);
        done();
    }
});
// Queue just one URL, with default callback
c.refesh=function(){
     c.queue(['http://vuighe.net','https://noname9x.herokuapp.com','https://getmark.azurewebsites.net/','https://ginspoj.azurewebsites.net/']);
      setTimeout(()=>{c.refesh()},300000);
}
c.refesh();
//

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
