var express    = require("express"),
    router     = express.Router(),
    request    = require("request"),
    fs         = require("fs");

// HOME ROUTE
router.get("/", function(req,res) {
	res.render("home");
});

// API FORMATION ROUTE
router.get('/api', function(req,res) {
   fs.readFile( __dirname + "/" + "csvjson.json", 'utf8', function (err, data) {
      res.end( data );
   });
})

// ANALYSIS ROUTE
router.get("/analysis", function(req,res) {
	var url = "https://covid-19help.herokuapp.com/api"
	request(url, function(error,response,body) {
		if(!error && response.statusCode == 200) {
			var data = JSON.parse(body);
			res.render("analysis",{data1:data});
		} else {
			console.log("ERROR:",err.message);
		}
	});
});

router.post("/analysis", function(req,res) {
	var url = "https://covid-19help.herokuapp.com/api"
	var filter=req.body.filter;
	var gender,state,kind,date1,date2,dd1,dd2,mm1,mm2;
	if(filter==1) gender=req.body.gender;
	else if(filter==2) state=req.body.state;
	else if(filter==3) kind=req.body.kind;
	else if(filter==4) {
		date1=req.body.date1;
		date2=req.body.date2;
		dd1=parseInt(date1.split('-')[2]);
		dd2=parseInt(date2.split('-')[2]);
		mm1=parseInt(date1.split('-')[1]);
		mm2=parseInt(date2.split('-')[1]);
	}
	request(url, function(error,response,body) {
		if(!error && response.statusCode == 200) {
			var data = JSON.parse(body);
			var data1=[];
			data.forEach(function(eachDate) {
				if(filter==1) {
					if(eachDate["gender"]==gender) data1.push(eachDate);		
				} else if(filter==2) {
					if(eachDate["state"]==state) data1.push(eachDate);
				} else if(filter==3) {
					var age=eachDate["ageEstimate"];
					if(kind==1) {
						if(age==""||(age>=0&&age<=9)) data1.push(eachDate);
					} else if(kind==2) {
						if(age>=10&&age<=19) data1.push(eachDate);
					} else if(kind==3) {
						if(age>=20&&age<=29) data1.push(eachDate);
					} else if(kind==4) {
						if(age>=30&&age<=39) data1.push(eachDate);
					} else if(kind==5) {
						if(age>=40&&age<=49) data1.push(eachDate);
					} else if(kind==6) {
						if(age>=50&&age<=59) data1.push(eachDate);
					} else if(kind==7) {
						if(age>=60&&age<=69) data1.push(eachDate);
					} else if(kind==8) {
						if(age>=70) data1.push(eachDate);
					}
				} else if(filter==4) {
					var date=eachDate["reportedOn"];
					var dd=parseInt(date.split('/')[0]);
					var mm=parseInt(date.split('/')[1]);
					if(mm==mm1&&dd<dd1) ;
					else if(mm==mm2&&dd>dd2);
					else if(mm<mm1||mm>mm2);
					else data1.push(eachDate);
				}
			});
			res.render("analysis",{data1:data1});
		} else {
			console.log("ERROR:",err.message);
		}
	});
});

// HOSPITAL ROUTE
router.get("/hospitals", function(req,res){
	var url="https://api.rootnet.in/covid19-in/hospitals/beds";
	request(url,function(error,response,body){
		if(!error && response.statusCode == 200){
			var data = JSON.parse(body);
			res.render("hospitals",{datas:data});
		}
	});
});

// MEDICAL COLLEGES ROUTE
router.get("/medicalcolleges", function(req,res){
	var url="https://api.rootnet.in/covid19-in/hospitals/medical-colleges";
	request(url,function(error,response,body){
		if(!error && response.statusCode == 200){
			var data = JSON.parse(body);
			res.render("medicalcolleges",{datas:data});
		}
	});
});

router.get("/medicalcolleges/:state", function(req,res) {
	var url="https://api.rootnet.in/covid19-in/hospitals/medical-colleges";
	var stateName = req.params.state;
	var type=["Govt.", "Trust", "Society", "University", "Private", "Govt-Society"];
	request(url,function(error,response,body){
		if(!error && response.statusCode == 200){
			var data = JSON.parse(body);
			var num=type.indexOf(stateName);
			if(num==-1) {
				var flag=1;
				res.render("show",{data:data,stateName:stateName,flag:flag});
			} else {
				var flag=0;
				res.render("show",{data:data,stateName:stateName,flag:flag});
			}
		}
	});
});

// NOTIFICATION ROUTE
router.get("/notification", function(req,res){
	var url="https://api.rootnet.in/covid19-in/notifications";
	request(url,function(error,response,body){
		if(!error && response.statusCode == 200){
			var data = JSON.parse(body);
			res.render("notification",{datas:data});	
		}
	});
});

// CONTACT ROUTE
router.get("/contact",function(req,res) {
	var url="https://api.rootnet.in/covid19-in/contacts";
	request(url,function(error,response,body){
		if(!error && response.statusCode == 200){
			var data = JSON.parse(body);
			res.render("contact",{datas:data});
		}
	});
});

module.exports = router;