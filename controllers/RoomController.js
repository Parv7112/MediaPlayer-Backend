const express = require('express');
const RoomModel = require('../models/RoomModel');
const AuthModel = require('../models/AuthModel')

const RoomController = {
  createRoom: async (req, res) => {
    const { name, number } = req.body;

    const newRoomId = generateRandomRoomId();

    const newRoom = new RoomModel({
      name,
      number,
      roomId: newRoomId,
      participants: [],
    });

    try {
      await newRoom.save();

      res.json({ roomId: newRoomId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to  room' });
      console.log(err)
    }
  },

  getRoom: async (req, res) => {
    const { roomId } = req.params;

    try {
      const room = await RoomModel.findOne({ roomId }).populate('participants'); // Ensure 'participants' field is populated
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      res.json({ room });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch room details' });
    }
  },


  joinRoom: async (req, res) => {
    const { roomId, uid } = req.body;

    try {
      const room = await RoomModel.findOne({ roomId });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      room.participants = room.participants || [];
      room.participants.push(participantId);

      await room.save();

      if (!room.participants) {
        room.participants = [uid];
      } else if (!room.participants.includes(uid)) {
        room.participants.push(uid);
      }

      await room.save();

      res.json({ message: 'Joined the room successfully', data: room });
    } catch (error) {
      console.error('Error joining room:', error);
      res.status(500).json({ error: 'Failed to join room' });
    }
  },

  addParticipant: async (req, res) => {
    try {
      const { roomId, participant } = req.body;

      const room = await RoomModel.findOne({ roomId });

      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      const userWithEmail = await AuthModel.findOne({ email: participant.email });

      if (!userWithEmail) {
        return res.status(404).json({ error: 'User with email not found' });
      }

      const uid = userWithEmail.uid;

      if (!room.participants) {
        room.participants = [{ uid, displayName: participant.displayName, email: participant.email }];
      } else {
        const existingParticipant = room.participants.find((p) => p.uid === uid);

        if (!existingParticipant) {
          room.participants.push({ uid, displayName: participant.displayName, email: participant.email });
        }
      }

      await room.save();

      res.json({ success: true, message: 'Participant added to the room' });
    } catch (error) {
      console.error('Error adding participant:', error);
      res.status(500).json({ success: false, message: 'Failed to add participant' });
    }
  },

  removeParticipant: async (req, res) => {
    try {
      const { roomId, participant } = req.body;

      const room = await RoomModel.findOne({ roomId });

      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      const participantIndex = room.participants.findIndex((p) => p.email === participant.email);

      if (participantIndex === -1) {
        return res.status(404).json({ error: 'Participant not found in the room' });
      }

      room.participants.splice(participantIndex, 1);

      await room.save();

      res.json({ success: true, message: 'Participant removed from the room' });
    } catch (error) {
      console.error('Error removing participant:', error);
      res.status(500).json({ success: false, message: 'Failed to remove participant' });
    }
  },
};

function generateRandomRoomId() {
  return Math.floor(Math.random() * 100000).toString();
}

module.exports = RoomController;
