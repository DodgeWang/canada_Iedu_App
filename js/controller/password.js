document.getElementById('subbtn').addEventListener('tap', function() {
	var oldPass = document.getElementById("oldPass").value;
	var newPass = document.getElementById("newPass").value;
	var validatePass = document.getElementById("validatePass").value;
	if(isNull(oldPass) || isNull(newPass) || isNull(validatePass)) return mui.alert('输入框内容不能为空');
	if(newPass !== validatePass) return mui.alert("两次密码输入不一致");

	var param = {
		oldpassword: oldPass,
		newpassword: newPass
	}
	XHRHTTPFunc.resetPassword(param, function(obj) {
		if(obj.status.code !== 0) {
			mui.alert(obj.status.msg, '提示', '确定', function() {
				if(obj.status.code === 5) {
					plus.storage.clear();
                    gotoLogin()
				}
			}, 'div')
			return;
		}

		mui.alert("密码修改成功，返回重新登陆", '提示', '确定', function() {
			plus.storage.clear();
			gotoLogin();
		}, 'div')

	}, function() {
		mui.alert("服务器连接失败");
	})
})

//判断输入字符串是否为空或者全部都是空格
function isNull(str) {
	if(str == "") return true;
	var regu = "^[ ]+$";
	var re = new RegExp(regu);
	return re.test(str);
}


//返回登录页面，关闭除登录页面的其他webview
function gotoLogin() {
	var viewList = ["index", "menu","password"];
	for(var i = 0; i < viewList.length; i++) {
		plus.webview.close(viewList[i],"slide-out-right")
	}
}