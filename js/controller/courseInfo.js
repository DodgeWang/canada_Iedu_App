mui.init({
	swipeBack: false,
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			callback: pulldownRefresh
		}
	}
});

mui.plusReady(function() {
	getLessonInfo(0)
})

/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
		getLessonInfo(1)
}

function getLessonInfo(type) {
	var user = JSON.parse(plus.storage.getItem('user'))
	var self = plus.webview.currentWebview();
	var pNum = self.pNum;
	var param = {
		studentNum: user.studentNum,
		pNum: pNum
	}
	XHRHTTPFunc.getlessonInfo(param, function(obj) {
		if(obj.status.code !== 0) {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
			mui.alert(obj.status.msg, '提示', '确定', function() {
				if(obj.status.code === 5) {
					plus.storage.clear();
					gotoLogin()
				}
			}, 'div')
			return;
		}

		if(obj.data !== null) {
			document.getElementById('pName').innerText = obj.data.pName;
			document.getElementById('pCode').innerText = obj.data.pCode;
			document.getElementById('pTime').innerText = obj.data.startTime + ' - ' + obj.data.endTime;
			document.getElementById('pDate').innerText = obj.data.startDate + ' - ' + obj.data.endDate;
			document.getElementById('absence').innerText = obj.data.absence;
			document.getElementById('late').innerText = obj.data.late;
			var weekly = obj.data.weekly.split(",");
			var weekStr = ['一', '二', '三', '四', '五', '六', '日'];
			var weekDom = "";
			for(var s = 0; s < weekStr.length; s++) {
				if(weekly.indexOf((s + 1).toString()) > -1) {
					weekDom += ('<li class="weekactive">' + weekStr[s] + '</li>');
				} else {
					weekDom += ('<li>' + weekStr[s] + '</li>');
				}
			}
			document.getElementById('pWeekly').innerHTML = weekDom;

		} else {
			console.log('信息为空')
		}
		if(type === 1) {
			setTimeout(function() {
				errorBox.hide();
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
			}, 1000)
		}

	}, function() {
		errorBox.show();
		if(type === 1) {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
		}
	})
}

//返回登录页面，关闭除登录页面的其他webview
function gotoLogin() {
	var viewList = ["index", "menu", "courseInfo"];
	for(var i = 0; i < viewList.length; i++) {
		plus.webview.close(viewList[i], "slide-out-right", 300)
	}
}