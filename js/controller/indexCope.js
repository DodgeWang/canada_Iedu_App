//mui初始化
mui.init({
	swipeBack: false,
	beforeback: back
});

/*侧边栏*/
var self, menu, mask = mui.createMask(_closeMenu);
var showMenu = false;

function back() {
	if(showMenu) {
		//菜单处于显示状态，返回键应该先关闭菜单,阻止主窗口执行mui.back逻辑；
		closeMenu();
		return false;
	} else {
		//菜单处于隐藏状态，执行返回时，要先close菜单页面，然后继续执行mui.back逻辑关闭主窗口；
		menu.close('none');
		return true;
	}
}
/*侧边栏*/

var subpages = ['home.html', 'courseBook.html', 'transcript.html', 'studentProfiles.html'];
var subpage_style = {
	top: '44px',
	bottom: '51px'
};
var aniShow = {};

mui.plusReady(function() {
	plus.navigator.setStatusBarBackground("#021e4a");
	plus.navigator.setStatusBarStyle("UIStatusBarStyleBlackOpaque");

	self = plus.webview.currentWebview();
	for(var i = 0; i < 4; i++) {
		var temp = {};
		var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
		if(i > 0) {
			sub.hide();
		} else {
			temp[subpages[i]] = "true";
			mui.extend(aniShow, temp);
		}
		self.append(sub);
	}

	/*侧边栏*/
	setTimeout(function() {
		menu = mui.preload({
			id: 'menu',
			url: 'menu.html',
			styles: {
				left: "30%",
				width: '70%',
				zindex: 9997
			}
		});
	}, 300);
	/*侧边栏*/

})

//当前激活选项
var activeTab = subpages[0];
var title = document.getElementById("title");
//选项卡点击事件
mui('.mui-bar-tab').on('tap', 'a', function(e) {
	var targetTab = this.getAttribute('href');
	if(targetTab == activeTab) {
		return;
	}
	//显示目标选项卡
	//若为iOS平台或非首次显示，则直接显示
	if(mui.os.ios || aniShow[targetTab]) {
		plus.webview.show(targetTab);
	} else {
		//否则，使用fade-in动画，且保存变量
		var temp = {};
		temp[targetTab] = "true";
		mui.extend(aniShow, temp);
		plus.webview.show(targetTab, "fade-in", 300);
	}
	//隐藏当前;
	plus.webview.hide(activeTab);
	//更改当前活跃的选项卡
	activeTab = targetTab;
});
//自定义事件，模拟点击“首页选项卡”
document.addEventListener('gohome', function() {
	var defaultTab = document.getElementById("defaultTab");
	//模拟首页点击
	mui.trigger(defaultTab, 'tap');
	//切换选项卡高亮
	var current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active");
	if(defaultTab !== current) {
		current.classList.remove('mui-active');
		defaultTab.classList.add('mui-active');
	}
});

/*侧边栏*/
/*
 * 显示菜单菜单
 */
function openMenu() {
	if(!showMenu) {
		//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
		if(mui.os.android && parseFloat(mui.os.version) < 4.4) {
			document.querySelector("header.mui-bar").style.position = "static";
			//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
			document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "0px";
		}

		//侧滑菜单处于隐藏状态，则立即显示出来；
		//显示完毕后，根据不同动画效果移动窗体；
		menu.show('none', 0, function() {
			//主窗体开始侧滑；
			menu.setStyle({
				left: '30%',
				transition: {
					duration: 150
				}
			});
		});
		//显示主窗体遮罩
		mask.show();
		//给webview设置遮罩
		self.setStyle({
			mask: 'rgba(0,0,0,0.7)'
		})
		showMenu = true;
	}
}

function closeMenu() {
	//窗体移动
	_closeMenu();
	//关闭遮罩
	mask.close();
	self.setStyle({
		mask: 'none'
	})
}
/**
 * 关闭侧滑菜单(业务部分)
 */
function _closeMenu() {
	if(showMenu) {
		//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
		if(mui.os.android && parseFloat(mui.os.version) < 4.4) {
			document.querySelector("header.mui-bar").style.position = "fixed";
			//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
			document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "44px";
		}

		//菜单开始侧滑；
		menu.setStyle({
			left: '100%',
			transition: {
				duration: 150
			}
		});
		//等窗体动画结束后，隐藏菜单webview，节省资源；
		setTimeout(function() {
			menu.hide();
		}, 300);
		showMenu = false;
	}
}

/*侧边栏*/

document.getElementById('info').addEventListener('tap', openMenu);
//			//在android4.4中的swipe事件，需要preventDefault一下，否则触发不正常
//			 //故，在dragleft，dragright中preventDefault
//			window.addEventListener('dragright', function(e) {
//				e.detail.gesture.preventDefault();
//			});
//			window.addEventListener('dragleft', function(e) {
//				e.detail.gesture.preventDefault();
//			});
//			 //主界面向左滑动，若菜单未显示，则显示菜单；否则不做任何操作；
//			window.addEventListener("swipeleft", openMenu);
//			 //主界面向右滑动，若菜单已显示，则关闭菜单；否则，不做任何操作；
//			window.addEventListener("swiperight", closeMenu);
//			 //menu页面向右滑动，关闭菜单；
window.addEventListener("menu:swiperight", closeMenu);
//重写mui.menu方法，Android版本menu按键按下可自动打开、关闭侧滑菜单；
mui.menu = function() {
	if(showMenu) {
		closeMenu();
	} else {
		openMenu();
	}
}