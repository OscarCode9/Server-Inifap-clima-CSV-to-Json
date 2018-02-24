
const csvJSON = (csv, max, min) => {
  const lines = csv.split("\n");
  let result = [];
  const headers = lines[0].split(",");
  for (let i = 1; i < lines.length; i++) {
    let obj = {};
    const currentline = lines[i].split(",");
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  result = result.filter((res) => {
    if ((parseInt(res.Tmin) >= min) && (parseInt(res.Tmax) <= max)) {
      console.log('Que onda viejo');
      return res;
    }
  });

  return result;
}


const port = 3000
const express = require('express');
const app = express();
const Path = require('path');
const Request = require('request'),
  Fs = require('fs');

// respond with "hello world" when a GET request is made to the homepage
//http://localhost:3000/datos?Tmax=30&Tmin=20

app.get('/datos', function (Requesta, Response) {
  const Tmax = Requesta.query.Tmax;
  const Tmin = Requesta.query.Tmin;
  console.log('Querys:', Tmax, Tmin);
  const url = 'http://pdiarios.alcohomeapp.com.mx/Docs/2017-12-02/d1.txt';
  if (Fs.existsSync('file.txt')) {
    try {
      const data = Fs.readFileSync('file.txt', 'utf8');
      const JsonData = csvJSON(data, Tmax, Tmin);
      Response.send({ JsonData });
    } catch (e) {
      console.log('Error:', e.stack);
    }
  } else {
    const req = Request.get(url)
      .on('response', function (res) {
        const filename = 'file.txt';
        const fws = Fs.createWriteStream(filename);
        res.pipe(fws);
        res.on('end', function () {
          try {
            const data = Fs.readFileSync('file.txt', 'utf8');
            const JsonData = csvJSON(data, Tmax, Tmin);
            Response.send({ JsonData });
          } catch (e) {
            console.log('Error:', e.stack);
          }
        });
      });
  }
});

app.listen(port, () => {
  console.log(`API REST corriendo en ${port}`)
})




