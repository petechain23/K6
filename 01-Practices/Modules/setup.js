import { params } from "./config.js";
export { params };

// Moved to Init Functions 
/*
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
const credentials = new SharedArray('credentials', function () {
    return JSON.parse(open('./credentials.json')); // Assuming you have a credentials.json file
    //return papaparse.parse(open('./credentials.csv'), { header: true }).data;
    // return [1, 2, 3, 4, 5];
    // Alternatively, you can define them directly:
    // return [
    //     { username: 'user1', password: 'pass1' },
    //     { username: 'user2', password: 'pass2' },
    //     { username: 'user3', password: 'pass3' },
    //     { username: 'user4', password: 'pass4' },
    //     { username: 'user5', password: 'pass5' },
    // ];
});

// // Pick a random username/password pair
// const randomUser = credentials[Math.floor(Math.random() * credentials.length)];
// console.log('Random user: ', JSON.stringify(randomUser));

// const params = {
//     login: randomUser.username,
//     password: randomUser.password,
// };
// console.log('Random user2: ', JSON.stringify(params));
*/

export function setup() {
    return { credential: params };
}

// Moved to Main Functions
// export default function (data) {
//     console.log('Random user3: ', JSON.stringify(data.credential));
// }