const express = require('express');
const router = express.Router();
const User = require('../models/user');



router.get('/', async(req,res) => {
    try{
        const usersData = await User.find()
        res.status(200).json({data: usersData})
    }catch(err) {
        res.status(500).json({message: 'error occurred'});
    }
})

router.get('/:id',async(req,res) => {
    try{
        const user = await User.findById(req.params.id);
        console.log(user);
        if(user) {
            res.json({data : user});
        } 
    }catch(err) {
        res.status(500).json({message: 'error occurred'});
    }
})

router.post('/new', async(req,res) => {
    const newUser = new User({userName: req.body.userName}) 
    await newUser.save();
    res.status(200).json({message: 'A new user created'})
})

router.patch('/update/:id', async(req,res) => {
    const user = await User.findById(req.params.id);
    user.userName = req.body.userName;
    await user.save();
    res.status(200).json({message: 'user details updated'})
})
router.delete('/delete/:id', async(req,res) => {
    await User.findOneAndDelete(req.params.id);
    res.status(200).json({message: 'user deleted'})
})
module.exports = router; 