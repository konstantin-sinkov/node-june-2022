const express = require('express');
// const fs = require('fs/promises');
const { fileServices } = require('./services');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/users', async (req, res) => {
    console.log('USERS ENDPOINT');
    //for ending the request should be a response
    //res.json({ user: "Mykola" }); //.json() - stringify pid kapotom
    // res.status(200).json({ user: "Mykola" });
    const users = await fileServices.reader();
    res.json(users);
});

app.get('/users/:userId', async (req, res) => {
    // console.log(req.params);
    const { userId } = req.params; //we get string from params
    
    const buffer = await fs.readFile(path.join(__dirname, 'dataBase', 'users.json'));
    const users = JSON.parse(buffer.toString());
    
    const user = users.find(user => user.id === +userId);
    
    if (!user) {
        return res.status(404).json(`User with id${userId} not found`)
    }
    
    res.json(user);
});

app.post('/users', async (req, res) => {
    const userInfo = req.body;
    // console.log(`${req} ======================= ${req.body}`);
    
    //is the user valid
    if (userInfo.name.length < 3 || typeof userInfo.name !== 'string') {
        return res.status(400).json('Wrong name');
    }
    
    if (userInfo.age < 0 || Number.isNaN(+userInfo.age)) {
        return res.status(400).json('Wrong age');
    }
    
    const users = await fileServices.reader();
    
    const newUser = {
        name: userInfo.name,
        age: userInfo.age,
        id: users[users.length -1].id + 1
    }
    users.push(newUser);
    
    await fileServices.writer(users);
    // console.log(users);
    
    res.status(201).json(newUser);
});

app.put('/users/:userId', async (req, res) => {
    const newUserInfo = req.body;
    const {userID} = req.params;
    
    const buffer = await fs.readFile(path.join(__dirname, 'dataBase', 'users.json'));
    const users = JSON.parse(buffer.toString());
    
    const index = users.findIndex(user => user.id === +userId);
    if (index === -1) { //findIndex won't find index
        return res.status(404).json(`User with id${userId} not found`)
    }
    
    users[index] = { ...users[index], ...newUserInfo };
    await fs.writeFile(path.join(__dirname, 'dataBase', 'users.json'), JSON.stringify(users));
    
    res.status(201).join(users[index]);
})


app.listen(5000, () => {
    console.log('Server listen 5000');
});
