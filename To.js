function cloneObj(obj) {
	let copy = {};
	for(let key in obj) {
		copy[key] = (typeof obj[key] === 'object') ?
			cloneObj(obj[key]) : obj[key];
	}
	return copy;
}

function rndStr(length) {
	return Math.random().toString(10).slice(2).substr(0, length);
}

function moneyToNum(price) {
	if(price === undefined) { return false };
	let priceStr = price.trim();
	let firstChar = priceStr.charAt(0);
	let priceStrNo$ = (firstChar === '$') ? (priceStr.substr(1)) : (priceStr);
	let priceNum = Number(priceStrNo$.trim());
	return isNaN(priceNum) ? false : priceNum;
}

function strToUrl(str) {
	let regex = /^([A-Za-z0-9])[A-Za-z0-9 ]*$/;
	let strArr = [];
	let newStr = "";
	for(let i = 0; i < str.length; i++) {
		strArr.push(str[i]);
	}
	if(regex.test(str)) {
		strArr.forEach(ch => {
			newStr += (ch === ' ') ? ("%20") : (ch);
		});
		return newStr;
	}else{
		return false;
	}
}

module.exports = { cloneObj, rndStr, moneyToNum, strToUrl };