
'use strict';

const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

exports.gameStart = functions.database.ref('/rooms/{roomName}')
    .onWrite((snapshot, context) => {
      const original = snapshot.val();
      
      if (original && (original.is_start == false)) {
        const room = {
          ...original,
          users: Object.entries(val.users).map(([i, v]) => ({
            id: i,
            ...v,
          }))
        }
        if (room.users.length >= 2 && room.users.every(x => x.is_ready)) {
          const firstTargetUserId = room.users[Math.floor(Math.random() * room.users.length)].id
          admin.database().ref('rooms/' + snapshot.params.roomName ).update({is_start: true})
          admin.database().ref('rooms/' + snapshot.params.roomName + "/users/" + firstTargetUserId).update({has_ball: true})
        }
      }
      return 
    });
