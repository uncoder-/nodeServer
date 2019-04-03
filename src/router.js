import url from 'url'
import fs from 'fs'
import crypto from 'crypto';
import { getContentType } from './whiteName'
/**
 * [Router 解析URL]
 */
async function router(req, res) {
	const Url = url.parse(req.url, true);
	const pathName = Url.pathname;

	// 定义站点访问根目录
	const wwwPath = `${process.cwd()}/www/`;
	// 返回定义的请求分类
	const reqType = getContentType(pathName);
	switch (reqType['type']) {
		case 'file':
			const filePath = wwwPath + pathName;
			const fileInfo = fs.statSync(filePath);
			// 静态文件缓存
			const isNeedStore = /^(gif|png|jpg|js|css)$/gi.test(reqType['ext']);
			const maxAge = 60 * 60 * 24 * 0 //缓存0天
			const expires = new Date();
			expires.setTime(expires.getTime() + maxAge * 1000);
			const lastModify = fileInfo.mtime.toUTCString();
			const etag = crypto.createHash('sha1').update(lastModify).digest('base64');
			// 304缓存 check
			if (isNeedStore && req.headers['if-modified-since'] == lastModify || req.headers['if-none-match'] == etag) {
				console.log("命中", reqType['ext']);
				res.writeHead(304);
				res.end();
				return;
			}
			// 文件内容
			const fileData = await getFileContent(filePath);
			const contentType = reqType['value'];
			res.writeHead(200, {
				'Content-Type': `${contentType};charset=utf-8`,
				Etag: etag,
				'Last-Modified': lastModify,
				Expires: isNeedStore ? expires.toUTCString() : -1,
				'Cache-Control': `public,max-age=${isNeedStore ? maxAge : 0}`
			});
			res.write(fileData, 'binary');
			res.end();
			break;
		case 'interface':
			// 解析请求类型
			const requestMethod = req.method;
			// 解析请求数据
			let queryData = '';
			if (requestMethod == 'GET') {
				queryData = Url.query;
			} else if (requestMethod == 'POST') {
				// 设置接收数据类型
				queryData = await getPostData(req);
			}
			console.log('我是从客户端来的数据', queryData);
			const data = await execuMethod(reqType['type'], queryData);
			// 根据方法处理的结果反回相对应的类型,这里暂时只做json返回
			res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
			res.write(data);
			res.end();
			break;
		case 'unknown':
			const file404 = await getFileContent(`${wwwPath}/404.html`);
			res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
			res.write(file404);
			res.end();
			break;
	}
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
			const queryData = JSON.parse(postData);
			resolve(queryData);
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
			let data = JSON.stringify({ 'status': 200, msg: `${methodName}方法执行成功！`, data: prams });
			resolve(data);
		}, 2000);
	});
}
export default router