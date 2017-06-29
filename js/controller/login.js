mui.plusReady(function() {
	plus.navigator.setStatusBarBackground("#021e4a");
	plus.navigator.setStatusBarStyle("UIStatusBarStyleBlackOpaque");
})
document.getElementById('login-sub').addEventListener('tap', function() {
	mui.openWindow({
		url: 'index.html',
		id: 'index'
	})
	
})