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
	getLessonList();
})

/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	getLessonList();
}

function getLessonList() {
	var user = JSON.parse(plus.storage.getItem('user'))
	var param = {
		studentId: user.studentId
	}
	XHRHTTPFunc.getLessonList(param, function(obj) {
//		console.log("thisData", JSON.stringify(obj));
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
			var innerDom = "";
			var datalist = obj.data;
			for(var i = 0; i < datalist.length; i++) {
				var weekly = datalist[i].weekly.split(",");
				var weekStr = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
				var weekDom = "";
				for(var s = 0; s < weekStr.length; s++) {
					if(weekly.indexOf((s + 1).toString()) > -1) {
						weekDom += ('<span class="weekactive">' + weekStr[s] + '</span>');
					} else {
						weekDom += ('<span>' + weekStr[s] + '</span>');
					}
				}
				innerDom += '<div class="mui-card" data-pNum="' + datalist[i].pNum + '">\
						<div class="courselist-header">\
							<span class="courselist-num">No.' + (i + 1) + '</span>\
							<span class="courselist-code">课程代码：' + datalist[i].pCode + '</span>\
						</div>\
						<div class="mui-card-content">\
							<div class="mui-card-content-inner">\
								<ul class="courseBooklist">\
									<li>\
										<span class="font-icon icon-shijian"></span><span>' + datalist[i].startTime + ' - ' + datalist[i].endTime + '</span>\
									</li>\
									<li>\
										<span class="font-icon icon-riqi"></span><span>' + datalist[i].startDate + ' - ' + datalist[i].endDate + '</span>\
									</li>\
								</ul>\
							</div>\
						</div>\
						<div class="week-box">\
							<div class="week-name">Every Week</div>\
							<div class="week-list">' + weekDom + '</div>\
						</div>\
					</div>';
			}
			document.getElementById('lessonlist').innerHTML = innerDom;
		} else {
			console.log('课程信息暂时为空')
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

mui('.mui-content').on('tap', '.mui-card', function() {
	var pNum = this.getAttribute('data-pNum')
	mui.openWindow({
		url: 'courseInfo.html',
		id: "courseInfo",
		extras: {
			pNum: pNum
		}
	})
})