function getDatos () {
    fetch('http://localhost:5000/db1') 
    .then(res =>{
      return res.json();
    })
      .then(data =>{
      console.log(data)
      })
      .catch(error => console.log(error));
}

getDatos();