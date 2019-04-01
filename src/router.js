import url from 'url'
import fs from 'fs'
import querystring from 'querystring'

// 自定义组件
import { getContentType } from './whiteName'
/**
 * [Router 解析URL]
 */
async function router(req, res) {
	let Url = url.parse(req.url, true);
	let pathName = Url.pathname;

	// 定义站点访问根目录
	const wwwPath = `${process.cwd()}/www/`;
	// 返回定义的请求分类
	let reqType = getContentType(pathName);
	let contentType = '';
	let data = '';
	switch (reqType['type']) {
		case 'file':
			data = await getFileContent(wwwPath + pathName);
			contentType = reqType['value'];
			break;
		case 'interface':
			// 解析请求类型
			let requestMethod = req.method;
			// 解析请求数据
			let queryData = '';
			if (requestMethod == 'GET') {
				queryData = Url.query;
			} else if (requestMethod == 'POST') {
				// 设置接收数据类型
				queryData = await getPostData(req);
			}
			console.log('我是从客户端来的数据', queryData);
			data = await execuMethod(reqType['type']);
			// 根据方法处理的结果反回相对应的类型,这里暂时只做json返回
			contentType = 'text/plain';
			break;
		case 'unknown':
			data = await getFileContent(`${wwwPath}/404.html`);
			contentType = 'text/html';
			break;
	}
	res.writeHead(200, { 'Content-Type': `${contentType};charset=utf-8`, 'Access-Control-Allow-Origin': '*' });
	// 限制纯文本返回,和返回类型相同
	if (contentType == 'text/plain') {
		res.write(data);
	} else {
		res.write(data, 'binary');
	}
	res.end();
}
/**
 * [ 获取post请求的数据]
 */
function getPostData(req) {
	return new Promise(function (resolve, reject) {
		req.setEncoding("utf8");
		// 设置临时存储
		let postData = '';
		req.on('data', function (data) {
			postData += data;
			// too much post data, kill the connection!
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if (postData.length > 1e6) { req.connection.destroy(); }
		});
		req.on('end', function () {
			let queryString = querystring.parse(postData);
			resolve(queryString);
		});
	});
}
/**
 * [fs 读取文件]
 */
function getFileContent(filePath) {
	return new Promise(function (resolve, reject) {
		fs.readFile(filePath, "binary", function (err, file) {
			if (err) {
				console.log(err);
				reject("读取文件失败")
			}
			resolve(file);
		});
	});
}
/**
 * [execMethod 处理方法]
 */
function execuMethod(methodName, prams) {
	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			let data = JSON.stringify({ 'status': 200, text: `${methodName}方法执行成功！` });
			resolve(data);
		}, 2000);
	});
}
export default router