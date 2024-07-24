// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Message = require('./models/message');
const {userSocketMap} = require('./userSocketMap');
const {io} = require('./socketServer');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose
  .connect(
    'mongodb+srv://venkat:venkat123@cluster0.xbpvody.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  )
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.log('Error connecting to MongoDB');
  });

app.post('/register', async (req, res) => {
  const {name, email, password, image} = req.body;

  const newUser = new User({name, email, password, image});

  newUser
    .save()
    .then(() => {
      res.status(200).json({message: 'User registered successfully!'});
    })
    .catch(error => {
      console.log('Error creating a user', error);
      res.status(500).json({message: 'Error registering the user'});
    });
});

app.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({message: 'Invalid email'});
    }

    if (user.password !== password) {
      return res.status(401).json({message: 'Invalid password'});
    }

    const secretKey = crypto.randomBytes(32).toString('hex');
    const token = jwt.sign({userId: user._id}, secretKey);

    res.status(200).json({token});
  } catch (error) {
    console.log('Error logging in', error);
    res.status(500).json({message: 'Error logging in'});
  }
});

app.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.find({_id: {$ne: userId}});

    res.json(users);
  } catch (error) {
    console.log('Error', error);
  }
});

app.post('/sendrequest', async (req, res) => {
  const {senderId, receiverId, message} = req.body;

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(404).json({message: 'Receiver not found'});
  }

  receiver.requests.push({from: senderId, message});
  await receiver.save();

  res.status(200).json({message: 'Request sent successfully'});
});

app.get('/getrequests/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate(
      'requests.from',
      'name email image',
    );

    if (user) {
      res.json(user.requests);
    } else {
      res.status(400).json({message: 'User not found'});
    }
  } catch (error) {
    console.log('Error', error);
  }
});

app.post('/acceptrequest', async (req, res) => {
  try {
    const {userId, requestId} = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {$pull: {requests: {from: requestId}}},
      {new: true},
    );

    if (!updatedUser) {
      return res.status(404).json({message: 'Request not found'});
    }

    await User.findByIdAndUpdate(userId, {
      $push: {friends: requestId},
    });

    const friendUser = await User.findByIdAndUpdate(requestId, {
      $push: {friends: userId},
    });

    if (!friendUser) {
      return res.status(404).json({message: 'Friend not found'});
    }

    res.status(200).json({message: 'Request accepted successfully'});
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({message: 'Server Error'});
  }
});

app.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).populate(
      'friends',
      'name email image',
    );
    res.json(user.friends);
  } catch (error) {
    console.log('Error fetching user', error);
  }
});

app.post('/sendMessage', async (req, res) => {
  try {
    const {senderId, receiverId, message} = req.body;

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();

    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      console.log('Emitting receiveMessage event to the receiver', receiverId);
      io.to(receiverSocketId).emit('newMessage', newMessage);
    } else {
      console.log('Receiver socket ID not found');
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log('Error', error);
  }
});

app.get('/messages', async (req, res) => {
  try {
    const {senderId, receiverId} = req.query;

    const messages = await Message.find({
      $or: [
        {senderId: senderId, receiverId: receiverId},
        {senderId: receiverId, receiverId: senderId},
      ],
    }).populate('senderId', '_id name');

    res.status(200).json(messages);
  } catch (error) {
    console.log('Error', error);
  }
});

module.exports = app;
