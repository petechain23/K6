import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const credentials = new SharedArray('credentials', function () {
    //return JSON.parse(open('./credentials.json')); // Assuming you have a credentials.json file
    return papaparse.parse(open('./credentials.csv'), { header: true }).data; // Assuming you have a credentials.csv file
    // Alternatively, you can define them directly:
    // return [
    //     { username: 'user1', password: 'pass1' },
    //     { username: 'user2', password: 'pass2' },
    //     { username: 'user3', password: 'pass3' },
    //     { username: 'user4', password: 'pass4' },
    //     { username: 'user5', password: 'pass5' },
    // ];
});

// Pick a random username/password pair
const randomUser = credentials[Math.floor(Math.random() * credentials.length)];
console.log('Random user: ', JSON.stringify(randomUser));

export const params = {
    login: randomUser.username,
    password: randomUser.password,
};
console.log('Random user2: ', JSON.stringify(params));

export const sharedWorkload = {
    executor: 'shared-iterations',
    vus: 2,
    iterations: 2,
    maxDuration: '5s'
}

