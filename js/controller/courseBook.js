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
var lesTitle = ["第一节","第二节","第三节","第四节"];
/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	getLessonList();
}

function getLessonList() {
	
	var user = JSON.parse(plus.storage.getItem('user'))
	console.log(JSON.stringify(user))
	var param = {
		studentNum: user.studentNum,
		studentId: user.id
	}
	XHRHTTPFunc.getLessonList(param, function(obj) {
		console.log("thisData", JSON.stringify(obj));
		if(obj.status.code !== 0) {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
			mui.alert(obj.status.msg, '提示', '确定', function() {
				if(obj.status.code === 5){
					plus.storage.clear();
				    gotoLogin();
				}
			}, 'div')
			return;
		}
		if(obj.data !== null) {
			var innerDom = "";
			var datalist = obj.data;
			
			for(var i = 0; i < datalist.length; i++) {
				var weekly = datalist[i].weekly.split(",");
				var weekStr = ['一', '二', '三', '四', '五', '六', '日'];
				var weekDom = "";
				for(var s = 0; s < weekStr.length; s++) {
					if(weekly.indexOf((s + 1).toString()) > -1) {
						weekDom += ('<span class="weekactive">' + weekStr[s] + '</span>');
					} else {
						weekDom += ('<span>' + weekStr[s] + '</span>');
					}
				}
				var typesStr = datalist[i].type === 0 ? '<div class="mui-card card-click" data-pNum="' + datalist[i].pNum + '">' : '<div class="mui-card">';
				innerDom += (typesStr + '<div class="courselist-header">\
							<span class="courselist-num">' + lesTitle[i] + '</span>\
                            <span class="courselist-code">'+ datalist[i].pName+ '</span>\
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
							<div class="week-name">星期</div>\
							<div class="week-list">' + weekDom + '</div>\
						</div>\
					</div>');
				
				
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

mui('.mui-content').on('tap', '.card-click', function() {
	var pNum = this.getAttribute('data-pNum')
	mui.openWindow({
		url: 'courseInfo.html',
		id: "courseInfo",
		extras: {
			pNum: pNum
		}
	})
})



//返回登录页面，关闭除登录页面的其他webview
function gotoLogin() {
	var viewList = ["index", "menu"];
	for(var i = 0; i < viewList.length; i++) {
		plus.webview.close(viewList[i],"slide-out-right",300)
	}
}