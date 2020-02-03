const PORT = process.env.PORT || 3005;
const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const insuranceData = JSON.parse(json);

//Created NodeJS web server as well as the call back function which is ran each time some one access the server
//Loading a page from the server to the browser
// Added an http header to send a message with the request to tell the browser what type of data is coming in
const server = http.createServer((req, res) => {
    
    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;
    
    // PRODUCTS OVERVIEW
    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, { 'Content-type': 'text/html'});
        
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;
            
            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
            
                const cardsOutput = insuranceData.map(el => replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput); 
                
                res.end(overviewOutput);
            });
        });
        
        
    }
    
    // Insurance DETAIL
    else if (pathName === '/insurance' && id < insuranceData.length) {
        res.writeHead(200, { 'Content-type': 'text/html'});
        
        fs.readFile(`${__dirname}/templates/template-insurance.html`, 'utf-8', (err, data) => {
            const insurance = insuranceData[id];
            const output = replaceTemplate(data, insurance);
            res.end(output);
        });
    }
    
    // IMAGES
    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg'});
            res.end(data);
        });
    }
    
    // URL NOT FOUND
    else {
        res.writeHead(404, { 'Content-type': 'text/html'});
        res.end('URL was not found on the server!');
    }
    
});

server.listen(PORT, () => {
    console.log(`Listening for requests now on ${PORT}`);
});

function replaceTemplate(originalHtml, insurance) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, insurance.productName);
    output = output.replace(/{%IMAGE%}/g, insurance.image);
    output = output.replace(/{%PRICE%}/g, insurance.price);
    output = output.replace(/{%SCREEN%}/g, insurance.screen);
    output = output.replace(/{%CPU%}/g, insurance.cpu);
    output = output.replace(/{%STORAGE%}/g, insurance.storage);
    output = output.replace(/{%RAM%}/g, insurance.ram);
    output = output.replace(/{%DESCRIPTION%}/g, insurance.description);
    output = output.replace(/{%ID%}/g, insurance.id);
    return output;
}