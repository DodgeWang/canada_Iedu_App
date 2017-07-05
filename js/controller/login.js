mui.plusReady(function() {
	plus.navigator.setStatusBarBackground("#021e4a");
	plus.navigator.setStatusBarStyle("UIStatusBarStyleBlackOpaque");
})
document.getElementById('login-sub').addEventListener('tap', function() {
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	if(isNull(username)) return mui.alert('账号不能为空');
	if(isNull(password)) return mui.alert('密码不能为空');
	var param = {
		username: username,
		password: password
	}
	XHRHTTPFunc.userLogin(param, function(obj) {
		if(obj.status.code !== 0) return mui.alert(obj.status.msg);
		plus.storage.setItem("user", JSON.stringify(obj.data))
		mui.openWindow({
			url: 'index.html',
			id: 'index'
		})
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