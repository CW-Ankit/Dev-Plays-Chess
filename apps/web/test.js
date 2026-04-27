import { io } from 'socket.io-client';

const socket1 = io('http://localhost:3000', {
    auth: { guestData: { name: 'Player 1' } }
});
const socket2 = io('http://localhost:3000', {
    auth: { guestData: { name: 'Player 2' } }
});

let match1Found = false;
let match2Found = false;

socket1.on('connect', () => {
    console.log('[S1] Connected');
    socket1.emit('queue:join');
});

socket1.on('queueStatus', (data) => {
    console.log('[S1] Queue Status:', data);
});

socket1.on('matchFound', (data) => {
    console.log('[S1] Match Found:', data);
    match1Found = true;
    checkDone();
});

socket1.on('connect_error', (err) => {
    console.log('[S1] Connect Error:', err.message);
});

socket2.on('connect', () => {
    console.log('[S2] Connected');
    socket2.emit('queue:join');
});

socket2.on('queueStatus', (data) => {
    console.log('[S2] Queue Status:', data);
});

socket2.on('matchFound', (data) => {
    console.log('[S2] Match Found:', data);
    match2Found = true;
    checkDone();
});

socket2.on('connect_error', (err) => {
    console.log('[S2] Connect Error:', err.message);
});

function checkDone() {
    if (match1Found && match2Found) {
        console.log('Matchmaking successful! Both clients matched.');
        process.exit(0);
    }
}

setTimeout(() => {
    console.log('Timeout. Exiting.');
    process.exit(1);
}, 5000);
