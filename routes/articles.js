const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	console.log('getting articles');
	res.write('NO');
	res.end();
});

module.exports = router;