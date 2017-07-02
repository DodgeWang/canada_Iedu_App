"use strict" //使用严格模式编写js
var path = function() {
	var SERVER_URL = "http://192.168.1.3:3000";
	return {
		url_getStudentInfo: SERVER_URL + '/api/studentInfo', //根据学生ID获取学生信息
		url_getStudentMark: SERVER_URL + "/api/studentMark" //获取学生成绩
	}
}()

function XHRHttpResquestFunc(url, data, method, cb, errorCb) {
	mui.ajax(url, {
		data: data, //请求参数
		dataType: 'json', //服务器返回json格式数据
		type: method, //HTTP请求类型
		timeout:3000,
		success: function(data) {
			cb(data)
		},
		error: function(xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
			errorCb();
		}
	});
}

var XHRHTTPFunc = function() {
	return {
       getStudentInfo: function(data,cb,errorCb){
       	   XHRHttpResquestFunc(path.url_getStudentInfo, data, 'get', cb, errorCb);
       },
       getStudentMark: function(data,cb,errorCb){
       	   XHRHttpResquestFunc(path.url_getStudentMark, data, 'get', cb, errorCb);
       }
	}
}()
