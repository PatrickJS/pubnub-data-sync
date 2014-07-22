var express = require('express');
var cors = require('cors');
var app = express();
var port = process.env.PORT || 3000;

app.engine('jade', require('jade').__express);
app.set('views', __dirname + '/public');
app.set('view engine', 'jade');

app.use(cors());

app.use('/bower_components', express.static(__dirname + '/bower_components'));


app.get('/', function(req, res) {
  var locals = {
    keys: {
      PUB: process.env.PUB_KEY,
      SUB: process.env.SUB_KEY
    }
  };

  console.log(locals, process.env);

  res.render('index', locals);
});

app.get('/*', express.static(__dirname + '/public'));

app.listen(port, function() {
  console.log('server started', port);
});