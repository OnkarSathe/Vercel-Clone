// const redis = require('redis');

// // Create a Redis client with custom port
// const client = redis.createClient({
//   host: '127.0.0.1', // Default Redis server address
//   port: 6379,        // Custom port, change this to your Redis server port
// });

// // Event listener for successful connection
// client.on('connect', () => {
//   console.log('Connected to Redis server');
// });

// // Event listener for any error during connection
// client.on('error', (err) => {
//   console.error(`Error: ${err}`);
// });

// // Example: Set a key-value pair
// client.set('example_key', 'Hello, Redis!', (err, reply) => {
//   if (err) {
//     console.error(`Error setting key: ${err}`);
//   } else {
//     console.log(`Set key: ${reply}`);
//   }

//   // Example: Get the value of the key
//   client.get('example_key', (err, value) => {
//     if (err) {
//       console.error(`Error getting value: ${err}`);
//     } else {
//       console.log(`Got value: ${value}`);

//       // Example: Quit the Redis connection
//       client.quit(() => {
//         console.log('Disconnected from Redis server');
//       });
//     }
//   });
// });
// const {createClient} = require('redis');

// const client = await createClient()
//   .on('error', err => console.log('Redis Client Error', err))
//   .connect();

// await client.set('key', 'value');
// const value = await client.get('key');
// await client.disconnect();

const { createClient } = require('redis');
async function main() {
  const client = await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  await client.set("key1", "value1");
  const value = await client.get("key1");
  console.log("value :", value);
  await client.disconnect();
}
main()