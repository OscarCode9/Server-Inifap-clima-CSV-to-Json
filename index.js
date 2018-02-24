const port = 3000
const express = require('express');
const app = express();
const Request = require('request'), Fs = require('fs');
const convert = require('./CSVToJson');
//http://localhost:3000/datos?Tmax=40&Tmin=30&Fecha=2017-12-02
app.get('/datos', function (Requesta, Response) {

  const Tmax = Requesta.query.Tmax;
  const Tmin = Requesta.query.Tmin;
  const fecha = String(Requesta.query.Fecha);

  const url = `http://pdiarios.alcohomeapp.com.mx/Docs/${fecha}/d1.txt`;

  if (Fs.existsSync(`${fecha}.txt`)) {
    try {
      const data = Fs.readFileSync(`${fecha}.txt`, 'utf8');
      const JsonData = convert.csvJSON(data, Tmax, Tmin);
      Response.send({ JsonData });
    } catch (e) {
      console.log('Error:', e.stack);
    }
  } else {
    const req = Request.get(url)
      .on('response', function (res) {
        const filename = `${fecha}.txt`;
        const fws = Fs.createWriteStream(filename);
        res.pipe(fws);
        res.on('end', function () {
          try {
            const data = Fs.readFileSync(`${fecha}.txt`, 'utf8');
            console.log(data);
            const JsonData = convert.csvJSON(data, Tmax, Tmin);
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




