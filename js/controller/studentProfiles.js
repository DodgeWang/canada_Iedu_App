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
	getStudentInfo()
})

/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
		getStudentInfo()
}

function getStudentInfo() {
	var user = JSON.parse(plus.storage.getItem('user'))
	var param = {
		studentId: user.studentId
	}

	XHRHTTPFunc.getStudentInfo(param, function(obj) {
//		console.log('wangdaiqiang:' + JSON.stringify(obj));
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
			document.getElementById('name').innerText = obj.data.surname + obj.data.given_name;
			if(obj.data.gender === 'girl') {
				document.getElementById('headImg').setAttribute("src", "../img/girl.png")
			} else {
				document.getElementById('headImg').setAttribute("src", "../img/boy.png")
			}
			for(var i in obj.data) {
				if(i != 'surname' && i != 'given_name') {
					document.getElementById(i).innerText = obj.data[i];
				}
			}

		} else {
			console.log('该学生信息不存在')
		}
		setTimeout(function() {
			errorBox.hide();
		    mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
		},1000)
		
	},function(){
//		document.getElementById("errorBox").style.display = 'block';
        errorBox.show();
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
	})
}



