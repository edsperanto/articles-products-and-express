const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 3000;

const testArticles = require('./routes/articlesAPI');
const testProducts = require('./routes/productsAPI');
const articles = require('./routes/articles');
const products = require('./routes/products');

const hbs = handlebars.create({
	extname: '.hbs',
	defaultLayout: 'app'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride('_method'));

app.use((req, res, next) => {
	let time = new Date();
	let year = time.getFullYear();
	let month = time.getMonth() + 1;
	let date = time.getDate();
	let hour = time.getHours();
	let minute = time.getMinutes();
	let second = time.getSeconds();
	let millisecond = time.getMilliseconds();
	let fileName = `logs/${year}.${month}-${date}.${hour}-${minute}-${second}-${millisecond}.log`;
	let log = `[${req.method}] [${req.path}] [${time.getTime()}]`;
	fs.writeFile(fileName, log, 'utf8', (err) => {
		if (err) throw err;
	});
	next();
});

app.get('/', (req, res) => {
	res.render('index', { "atIndex": true });
});

app.use('/api/articles', testArticles);
app.use('/api/products', testProducts);
app.use('/articles', articles);
app.use('/products', products);

if(!module.parent){ 
    app.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`);
	}); 
}

module.exports = app;