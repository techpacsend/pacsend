//Install express server
const express = require('express');
const path = require('path');
const forceSSl = require("force-ssl-heroku")

const app = express();
app.use(forceSSl);

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));

app.get('/*', function(req,res) {

res.sendFile(path.join(__dirname+'/dist/index.html'));
});

//Test Change
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
