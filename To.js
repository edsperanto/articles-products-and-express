function cloneObj(obj) {
	let copy = {};
	for(let key in obj) {
		if(typeof obj[key] === 'object') {
			copy[key] = cloneObj(obj[key]);
		}else{
			copy[key] = obj[key];
		}
	}
	return copy;
}

module.exports = { cloneObj };