const express = require('express');

const app = express();

app.get('/users', (req, res) => {
    console.log('USERS ENDPOINT');
    //for ending the request should be a response
    //res.json({ user: "Mykola" }); //.json() - stringify pid kapotom
    res.status(200).json({ user: "Mykola" });
})

app.listen(5000, () => {
    console.log('Server listen 5000');
});
