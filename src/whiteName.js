// 系统组件
import path from 'path'

let userInterface = [
	'login'
];
let fileTypes = {
	"css": "text/css",
	"html": "text/html",
	"ico": "image/x-icon",
	"jpeg": "image/jpeg",
	"jpg": "image/jpeg",
	"gif": "image/gif",
	"js": "text/javascript",
	"json": "application/json",
	"pdf": "application/pdf",
	"png": "image/png",
	"svg": "image/svg+xml",
	"txt": "text/plain",
	"xml": "text/xml"
};

/**
 * [getContentType 遍历白名单]
 */
export function getContentType(pathName) {
	let contentType = { type: 'unknown', value: '' };
	// 剥离后缀
	let ext = path.extname(pathName);
	ext = ext ? ext.slice(1) : '';
	if (ext != '') {
		// 检测文件
		for (let i in fileTypes) {
			if (ext == i) {
				contentType = { 'type': 'file', 'value': fileTypes[i], ext };
				return contentType;
			}
		}
	} else {
		// 检测接口
		for (let i of userInterface) {
			if (pathName == ('/' + i)) {
				contentType = { type: 'interface', value: i };
				return contentType;
			}
		}
	}
	return contentType;
}

export default getContentType;