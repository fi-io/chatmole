var path = require('path');
var rootDir = path.join(__dirname , "InstalledApps");
module.exports={
	"apps" : {
		"main" : {
				'contextPath' : "/chat" ,
				'dir' : path.join(rootDir , "chat","app.js")
			}
	}
};