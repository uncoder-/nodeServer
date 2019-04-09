(function () {
	var img = document.querySelector('img');
	img.addEventListener("click", function () {
		console.log('我是谁！');
	}, false);
	var button = document.querySelector('#submit');
	button.addEventListener("click", function () {
		var username = document.querySelector('input[name="username"]').value;
		var password = document.querySelector('input[name="password"]').value;
		console.log(username, password);
		const reqData = { username, password };

		var xhr = new XMLHttpRequest();
		// xhr.open('POST', '/login', true);
		xhr.open('POST', 'http://192.168.168.119:8888/login', true);
		xhr.setRequestHeader('token', 'abcdefghijklmnopqrstuvwxyz');
		xhr.send(JSON.stringify(reqData));
		xhr.onreadystatechange = () => {
			if (xhr.readyState == 4 && xhr.status == 200) {
				const json = JSON.parse(xhr.responseText);
				console.log("服务器返回数据", json);
			}
		}
	}, false);
})()
