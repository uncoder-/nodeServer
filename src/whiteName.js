import path from 'path';

const userInterface = ['login'];
const fileTypes = {
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
 *  遍历白名单
 */
export function getContentType(pathName) {
	let contentType = { type: 'unknown', value: '' };
	// 剥离后缀
	let ext = path.extname(pathName);
	ext = ext ? ext.slice(1) : '';
	if (ext != '') {
		// 检测文件
		for (const i in fileTypes) {
			if (ext == i) {
				contentType = { type: 'file', value: fileTypes[i], ext };
				return contentType;
			}
		}
	} else {
		// 检测接口
		for (const i of userInterface) {
			if (pathName == (`/${i}`)) {
				contentType = { type: 'interface', value: i };
				return contentType;
			}
		}
	}
	return contentType;
}

export default getContentType;