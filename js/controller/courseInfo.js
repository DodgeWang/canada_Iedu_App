mui.init({
	swipeBack: false,
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			callback: pulldownRefresh
		}
	}
});

var self = plus.webview.currentWebview();
var pNum = self.pNum;
getLessonInfo()

function pulldownRefresh() {
	getLessonInfo()
}

function getLessonInfo() {
	var user = JSON.parse(plus.storage.getItem('user'))
	var param = {
		studentId: user.studentId,
		pNum: pNum
	}
	XHRHTTPFunc.getlessonInfo(param, function(obj) {
//		console.log('thisData:' + JSON.stringify(obj));
		if(obj.status.code !== 0) {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
			mui.alert(obj.status.msg, '提示', '确定', function() {
				if(obj.status.code === 5){
					plus.storage.clear();
				    mui.openWindow({
					  url: 'login.html',
					  id: "login"
				    })
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
			var weekStr = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
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
		setTimeout(function() {
			errorBox.hide();
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
		}, 1000)

	}, function() {
		errorBox.show();
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
	})
}