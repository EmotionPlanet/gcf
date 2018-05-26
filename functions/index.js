
'use strict';

const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
const concat = Function.bind.call(Function.call, Array.prototype.concat);
const keys = Reflect.ownKeys;

if (!Object.values) {
	Object.values = function values(O) {
		return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), []);
	};
}

if (!Object.entries) {
	Object.entries = function entries(O) {
		return reduce(keys(O), (e, k) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []), []);
	};
}

const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();


exports.gameManager = functions.database.ref('/rooms/{roomName}')
    .onWrite((change,  context) => {
      const original = change.after.val();

      // if (!snapshot) return
      // const original = snapshot.val();
      
      if (original) {
        const room = Object.assign(
          original,
          {
            users: Object.entries(original.users || {}).map(([i, v]) => 
              Object.assign(
                {id: i},
                v
              )
            )
          }
        )
        
        // game start func
        if (!original.is_start) {
          if (room.users.length >= 2 && room.users.every(x => x.is_ready)) {
            const firstTargetUserId = room.users[Math.floor(Math.random() * room.users.length)].id

            let date = new Date()
            date.setSeconds( (original.game_time * 1000) + date.getSeconds() + 2000);
            console.log(date, "date debug point")
            return admin.database().ref('rooms/' + context.params.roomName ).update(
              {
                is_start: true,
                ball_holding_user: firstTargetUserId,
                finish_time: date.toString()
              }
            )
          }
        }

        if (original.users.length == 0) {
          return admin.database().ref('rooms/' + context.params.roomName ).remove()
        }

      }

    });
