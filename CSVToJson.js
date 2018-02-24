
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

module.exports = {
  csvJSON
}

