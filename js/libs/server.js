"use strict" //使用严格模式编写js
var path = function() {
	var SERVER_URL = "http://192.168.1.69:3000";
	return {
		url_getStudentInfo: SERVER_URL + '/api/studentInfo' //根据学生ID获取学生信息
	}
}()

function XHRHttpResquestFunc(url, data, method, cb) {
	mui.ajax(url, {
		data: data, //请求参数
		dataType: 'json', //服务器返回json格式数据
		type: method, //HTTP请求类型
		success: function(data) {
			cb(data)
		},
		error: function(xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
		}
	});
}

var XHRHTTPFunc = function() {
	return {
       getStudentInfo: function(data,cb){
       	   XHRHttpResquestFunc(path.url_getStudentInfo, data, 'get', cb);
       }
	}
}()
