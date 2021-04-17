var express      = require("express"),
	app          = express(),
	request      = require("request"),
	bodyParser   = require("body-parser"),
	mongoose     = require('mongoose'),
	fs           = require("fs");

// Requiring Routes
var indexRoutes	= require("./routes/routes");

app.use(bodyParser.urlencoded({extended: true}));
mongoose.set('useUnifiedTopology',true);
mongoose.set('useFindAndModify', false);
app.set("view engine","ejs");

var url = process.env.URL;
mongoose.connect(url,{
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to DB");
}).catch(err => {
	console.log("ERROR:",err.message); 
});

app.use(express.static(__dirname + "/public"));

app.use("/", indexRoutes);

app.listen(process.env.PORT,() => {
	console.log("Server Has Started");
});