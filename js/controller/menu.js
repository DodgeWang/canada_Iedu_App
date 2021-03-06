//关闭back、menu按键监听，这样侧滑主界面会自动获得back和memu的按键事件，仅在主界面处理按键逻辑即可；
mui.init({
	keyEventBind: {
		backbutton: false,
		menubutton: false
	}
});
var main = null;
mui.plusReady(function() {
	main = plus.webview.currentWebview().opener();
	var user = JSON.parse(plus.storage.getItem('user'));
    document.getElementById('userName').innerText = user.username;
})

function closeMenu() {
	mui.fire(main, "menu:swiperight");
}

//左滑显示出来的菜单，只需监听右滑，然后将菜单关闭即可；在该菜单上左滑，不做任何操作；
window.addEventListener("swiperight", closeMenu);

//退出登录
document.getElementById("logOut").addEventListener('tap', function() {

	XHRHTTPFunc.logOut(function(obj) {
       gotoLogin()
	}, function() {
       gotoLogin()
	})

})

//返回登录页面，关闭除登录页面的其他webview
function gotoLogin() {
	var viewList = ["index", "menu"];
	for(var i = 0; i < viewList.length; i++) {
		plus.webview.close(viewList[i],"slide-out-right",300)
	}
}

//打开修改密码页面
document.getElementById("password").addEventListener('tap', function() {
	mui.openWindow({
		url: 'password.html',
		id: 'password',
		show: {
			aniShow: "slide-in-left"
		}
	})
	mui.fire(main, "menu:swiperight");
})

