/********************************************************************************** 
 * ITE5315 – Assignment 2* I declare that this assignment is my own work in accordance with Humber Academic Policy.* 
 * No part of this assignment has been copied manually or electronically from any other source* 
 * (including web sites) or distributed to other students.**
 *  Name: Vijul Patel Student ID: N01549702 Date: 03/11/2023
 * **********************************************************************************/

var express = require('express');
var path = require('path');
var app = express();
const fs = require('fs');
var exphbs = require('express-handlebars');
const port = process.env.PORT || 3000; // Change 'port' to 'PORT'
//setup the views dir. path
app.set('views', path.join(__dirname, 'views'));

// Set up middleware to serve static files from the 'public' directory.This allows the client's browser to access these files directly.
app.use(express.static(path.join(__dirname, 'public')));
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');




const hbs = exphbs.create({
  /* Your configuration here */
  helpers: {
    equal: function (a, b, options) {
      if (a === b) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
    replaceBlankAndHighlight: function (classValue) {
      if (classValue === '') {
        return 'unknown';
      } else {
        return classValue;
      }
    }
  }
});

hbs.handlebars.registerHelper('ifBlank', function (classValue, options) {
  if (classValue === '') {
    return 'unknown';
  }
  return classValue;
});

hbs.handlebars.registerHelper('ifBlankHighlight', function (classValue, options) {
  if (classValue === '') {
      return 'highlight';
  }
  return '';
});


hbs.handlebars.registerHelper('ifUnknownHighlight', function (classValue, options) {
  if (classValue === 'unknown') {
      return 'highlight';
  }
  return '';
});


//Assignment-2 Stuff

// Read the data from the JSON file
const carData = JSON.parse(fs.readFileSync('CarSales.json'));
app.get('/data', (req, res) => {
    res.render('cardata', { data: carData });
  });
  
  app.get('/data/invoiceNo/:index', (req, res) => {
    const index = req.params.index;
    const dataAtIndex = carData[index];
    res.render('invoicenum', { data: dataAtIndex });
  });
  
  app.get('/search/invoiceNo', (req, res) => {
    const invoiceNo = req.query.invoiceNo;
    const foundData = carData.find(car => car.InvoiceNo === invoiceNo);
    if (foundData) {
      res.render('search_invoiceNo', { data: foundData });
    } else {
      res.render('search_invoiceNo', { data: null });
    }
  });

  //Step7
  app.get('/allCarData', (req, res) => {
    const carData = JSON.parse(fs.readFileSync('CarSales.json'));
    res.render('allCarData', { carData });
});

//step8
app.get('/filteredCarData', (req, res) => {
  const carData = JSON.parse(fs.readFileSync('CarSales.json'));
  const filteredCarData = carData.filter(car => car.class.trim() !== ''); 
  res.render('filteredCarData', { carData: filteredCarData });
});


  
  //Assignment-2 Manufacturerer stuff
  app.get('/search/Manufacturer', (req, res) => {
    const manufacturer = req.query.manufacturer;
    const foundData = carData.find(car => car.Manufacturer === manufacturer);
    if (foundData) {
      res.render('search_manufacturer', { data: foundData });
    } else {
      res.render('search_manufacturer', { data: null });
    }
  });
  



//Assignment1 - STUFF
// Name, student ID, and email
const name = 'Vijulkumar Patel';
const studentID = 'N01549702';
const email = 'vijulpatel865@gmail.com';

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

//Assignment-1 resume
app.get('/about', (req, res) => {
  const resume = path.join(__dirname, 'vijul-resume.docs');
  res.render('about', { title: 'resume', resume, name, studentID, email });
});

const jsonFilePath = 'supermarket_sales.json';
const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

//Assignment-1 jsondata
app.get('/alldata', (req, res) => {
  const jsonFilePath = path.join(__dirname, 'supermarket_sales.json');
  const jsonDataString = JSON.stringify(jsonData, null, 2); 
  res.render('alldata', { title: 'All Data', jsonDataString, name, studentID, email });
});


//Assignment-1 search invoiceid by index
app.get('/alldata/invoiceID/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (isNaN(index) || index < 0 || index >= jsonData.storeSales.length) {
    res.status(400).send('Invalid index provided');
  } else {
    if (jsonData.storeSales[index] && jsonData.storeSales[index].InvoiceID) {
      const invoiceID = jsonData.storeSales[index].InvoiceID;
      res.render('invoice', { title: 'Invoice', invoiceID, name, studentID, email });
    }
  }
});


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//Assignment1 form searchinvoie stuff
 app.get('/search/invoiceID', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});
app.post('/search/invoiceID', (req, res) => {
  const { invoiceID } = req.body;
  const foundSales = jsonData.filter((sale) => sale.InvoiceID === invoiceID);
  if (foundSales.length > 0) {
      res.render('search_invoice', { title: 'Search Invoice', foundSales, name, studentID, email });
  } else {
      res.render('search_invoiceerror', { title: 'Search Invoice Error', name, studentID, email });
  }
});


//Assignment1 form productline stuff
app.use(express.urlencoded({ extended: true }));
app.get('/search/produceLine', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Search by Product Line</h1>
        <form method="post">
          <label for="productLine">Enter Product Line:</label>
          <input type="text" id="productLine" name="productLine" required>
          <button type="submit">Search</button>
        </form>
      </body>
    </html>
  `);
});
app.post('/search/productLine', (req, res) => {
  const { productLine } = req.body;
  const foundSales = jsonData.filter((sale) => sale.productLine.toLowerCase().includes(productLine.toLowerCase()));
  if (foundSales.length > 0) {
      res.render('productLine', { title: 'Search Product Line', foundSales, name, studentID, email });
  } else {
      res.render('productLine_error', { title: 'Search Product Line Error', name, studentID, email });
  }
});


// Define a route for the root URL, rendering the 'index.hbs' template.
app.get('/', function(req, res) {
    res.render('partials/index', { title: 'Express' });
});

// Define a route for '/users' that sends a simple response.
app.get('/users', function(req, res) {
  res.send('respond with a resource');
});

// handling unmatched routes, rendering the 'error.hbs' template.
app.get('*', function(req, res) {
  res.render('error', { title: 'Error', message: 'Wrong Route' });
});


















app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
