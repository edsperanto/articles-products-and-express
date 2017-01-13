const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const app = express();
const PORT = process.env.PORT || 3000;

const articles = require('./routes/articles');
const products = require('./routes/products');

app.use(bodyParser.json());
app.use('/articles', articles);
app.use('/products', products);

app.get('/', (req, res) => {
	res.write('heyy!!!');
	res.end();
});

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});