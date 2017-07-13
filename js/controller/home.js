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
	getActivity();
})

mui('#activity').on('tap', '.mui-table-view-cell', function() {
	mui.openWindow({
		url: 'webPage.html',
		id: "webPage",
		extras: {
			webLink: this.getAttribute('data-src')
		}

	})
})

/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	getActivity();
}

//获取首页
function getActivity() {
	//获取banner
	XHRHTTPFunc.getBanner(function(obj){
		if(obj.data !== null) {
			document.getElementById("bannerImg").setAttribute("src",obj.data.path)
		}
	},function(){})
	
	//获取活动列表
	XHRHTTPFunc.indexActivity(function(obj) {
//		console.log("thisData", JSON.stringify(obj));
		if(obj.status.code !== 0) {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
			mui.alert(obj.status.msg, '提示', '确定', function() {
				if(obj.status.code === 5) {
					plus.storage.clear();
					gotoLogin();
				}
			}, 'div')
			return;
		}
		if(obj.data !== null) {
			var dataList = obj.data;
			var innerDom = '';
			for(var i = 0; i < dataList.length; i++) {
				if(dataList[i].list.length>0) {
					var itemDom = "";
					for(var s = 0; s < dataList[i].list.length; s++) {
						itemDom += '<li class="mui-table-view-cell mui-media mui-col-xs-6" data-src="' + dataList[i].list[s].url + '">\
									<a href="#"><img class="mui-media-object" src="' + dataList[i].list[s].imgpath + '">\
										<div class="mui-media-body">' + dataList[i].list[s].title + '</div>\
									</a>\
								</li>'
					}
					innerDom += '<div class="activity-list-box">\
							    <div class="activity-list-title">' + dataList[i].name + '</div>\
							    <ul class="mui-table-view mui-grid-view">' + itemDom + '</ul>\
						    </div>'
				}
			}
			document.getElementById('activity').innerHTML = innerDom;
		} else {
			console.log('活动为空')
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


//返回登录页面，关闭除登录页面的其他webview
function gotoLogin() {
	var viewList = ["index", "menu"];
	for(var i = 0; i < viewList.length; i++) {
		plus.webview.close(viewList[i],"slide-out-right",300)
	}
}