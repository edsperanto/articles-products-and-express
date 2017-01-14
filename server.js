const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const app = express();
const PORT = process.env.PORT || 3000;

const articles = require('./routes/articles');
const products = require('./routes/products');

const hbs = handlebars.create({
	extname: '.hbs',
	defaultLayout: 'app'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use('/articles', articles);
app.use('/products', products);

app.get('/', (req, res) => {
	res.render('index', { "atIndex": true });
});

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});