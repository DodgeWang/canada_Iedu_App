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
	getMark()
})
/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	getMark()
}


var shouldIntegral = 100;
document.getElementById('shouldIntegral').innerText = shouldIntegral;
function getMark() {
	var user = JSON.parse(plus.storage.getItem('user'))
	var param = {
		studentId: user.studentId
	}

	XHRHTTPFunc.getStudentMark(param, function(obj) {
//		console.log("thisData",JSON.stringify(obj));
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
			var dataList = obj.data.lessonList;
			var innerDom = "";
			for(var i = 0; i<dataList.length; i++){
				innerDom += '<div class="mui-card">\
						<div class="mui-card-header">No.'+ (i+1) +'</div>\
						<div class="mui-card-content">\
							<div class="mui-card-content-inner">\
								<ul class="transcript-info">\
									<li>\
										<div class="fl"><span>课程代码：</span>'+ dataList[i].pCode +'</div>\
										<div class="fr"><span>课程名：</span>'+ dataList[i].pName +'</div>\
									</li>\
									<li>\
										<div class="fr"><span>平均成绩：</span>'+ dataList[i].pMark +'</div>\
									</li>\
								</ul>\
							</div>\
						</div>\
					</div>'
			}
			document.getElementById('markList').innerHTML = innerDom;
			document.getElementById('accumulatedCredit').innerText = obj.data.accumulatedCredit;
			document.getElementById('disparity').innerText = shouldIntegral - Number(obj.data.accumulatedCredit);
		} else {
			console.log('该学生成绩暂时为空')
		}
		setTimeout(function() {
			errorBox.hide();
		    mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
		},1000)
		
	},function(){
        errorBox.show();
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
	})
}


