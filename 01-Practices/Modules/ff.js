import { SharedArray } from 'k6/data';

// Init context: SharedArray must be created here
const sharedData = new SharedArray('mySharedArray', function () {
    return [1, 2, 3, 4, 5]; // Simple array for testing
});

export function setup() {
    // Setup context: Return a JSON array with usernames and passwords
    const userCredentials = [
        { username: 'user1', password: 'pass1' },
        { username: 'user2', password: 'pass2' },
        { username: 'user3', password: 'pass3' }
    ];
    return userCredentials;
}

export default function (userCredentials) {
    // VU context: Use the shared data and setup data in your test
    const sharedElement = sharedData[Math.floor(Math.random() * sharedData.length)];
    const user = userCredentials[Math.floor(Math.random() * userCredentials.length)];
    console.log(`Shared element: ${sharedElement}`);
    console.log(`Username: ${user.username}, Password: ${user.password}`);
}