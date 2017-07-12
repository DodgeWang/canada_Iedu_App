mui.plusReady(function() {
	plus.navigator.setStatusBarBackground("#021e4a");
	plus.navigator.setStatusBarStyle("UIStatusBarStyleBlackOpaque");

	var usernameInput = document.getElementById('username');
	var passwordInput = document.getElementById('password');
	//自动登录
	if(localStorage.getItem("username") && localStorage.getItem("password")) {
		usernameInput.value = localStorage.getItem("username");
		passwordInput.value = localStorage.getItem("password");
		var data = {
			username: localStorage.getItem("username"),
			password: localStorage.getItem("password")
		}
		login(data)
	}
	document.getElementById('login-sub').addEventListener('tap', function() {
		var username = usernameInput.value;
		var password = passwordInput.value;
		if(isNull(username)) return mui.alert('账号不能为空');
		if(isNull(password)) return mui.alert('密码不能为空');
		var param = {
			username: username,
			password: password
		}
		login(param)
	})

	function login(param) {
		XHRHTTPFunc.userLogin(param, function(obj) {
			if(obj.status.code !== 0) return mui.alert(obj.status.msg);
			plus.storage.setItem("user", JSON.stringify(obj.data));
			localStorage.setItem("username", usernameInput.value);
			localStorage.setItem("password", passwordInput.value);
			passwordInput.value = "";
			
			mui.openWindow({
				url: 'index.html',
				id: 'index'
			})
		}, function() {
			mui.alert("服务器连接失败");
		})
	}

})

//判断输入字符串是否为空或者全部都是空格
function isNull(str) {
	if(str == "") return true;
	var regu = "^[ ]+$";
	var re = new RegExp(regu);
	return re.test(str);
}