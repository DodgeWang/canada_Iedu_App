"use strict" //使用严格模式编写js
var path = function() {
//  var SERVER_URL = "http://192.168.1.69:3000";
//  var SERVER_URL = "http://69.42.59.68:3000";
	var SERVER_URL = "http://home.ieduapp.com:3000";
	return {
		url_login: SERVER_URL + '/api/login', //用户登陆
		url_resetPassword: SERVER_URL + "/api/resetPassword", //修改密码
		url_logOut: SERVER_URL + "/api/logOut", //退出登录
		url_getStudentInfo: SERVER_URL + '/api/studentInfo', //根据学生ID获取学生信息
		url_getStudentMark: SERVER_URL + "/api/studentMark", //获取学生成绩
		url_getlessonList: SERVER_URL + "/api/lessonList", //获取学生课程列表
		url_getlessonInfo: SERVER_URL + "/api/lessonInfo", //获取学生课程信息详情
		url_indexActivity: SERVER_URL + "/api/homeActivity", //获取首页展示活动
		url_getBanner: SERVER_URL + "/api/getBanner" //获取首页banner
	}
}()

function XHRHttpResquestFunc(url, data, method, cb, errorCb) {
	mui.ajax(url, {
		data: data, //请求参数
		dataType: 'json', //服务器返回json格式数据
		type: method, //HTTP请求类型
		timeout: 3000,
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
		userLogin: function(data, cb, errorCb) {
			XHRHttpResquestFunc(path.url_login, data, 'post', cb, errorCb);
		},
		logOut: function(cb, errorCb) {
			XHRHttpResquestFunc(path.url_logOut, {}, 'get', cb, errorCb);
		},
		resetPassword: function(data, cb, errorCb) {
			XHRHttpResquestFunc(path.url_resetPassword, data, 'post', cb, errorCb);
		},
		getStudentInfo: function(data, cb, errorCb) {
			XHRHttpResquestFunc(path.url_getStudentInfo, data, 'get', cb, errorCb);
		},
		getStudentMark: function(data, cb, errorCb) {
			XHRHttpResquestFunc(path.url_getStudentMark, data, 'get', cb, errorCb);
		},
		getLessonList: function(data, cb, errorCb) {
			XHRHttpResquestFunc(path.url_getlessonList, data, 'get', cb, errorCb);
		},
		getlessonInfo: function(data, cb, errorCb) {
			XHRHttpResquestFunc(path.url_getlessonInfo, data, 'get', cb, errorCb);
		},
		indexActivity: function(cb, errorCb) {
			XHRHttpResquestFunc(path.url_indexActivity, {}, 'get', cb, errorCb);
		},
		getBanner: function(cb, errorCb) {
			XHRHttpResquestFunc(path.url_getBanner, {}, 'get', cb, errorCb);
		}
	}
}()

var errorBox = function() {
	function errorDom() {
		if(!document.getElementById('errorBox')) {
			var pageCont = document.getElementById('pageCont');
			var errorbox = document.createElement('div');
			errorbox.setAttribute('id', 'errorBox');
			errorbox.innerText = '服务器连接失败,请下拉刷新重试';
			pageCont.insertBefore(errorbox, pageCont.children[0])
		}
	}
	return {
		show: function() {
			errorDom()
			document.getElementById('errorBox').style.display = 'block';
		},
		hide: function() {
			errorDom()
			document.getElementById('errorBox').style.display = 'none';
		}
	}
}()
