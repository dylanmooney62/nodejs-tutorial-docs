# NodeJS Tutorial

## Prerequisites

To follow this tutorial, you will need the following installed on your machine:

- [**Node.js**](https://nodejs.org/en/)

Please download the [**starter files**](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/dylanmooney62/nodejs-tutorial/tree/main/starter-files) and open the directory in your favourite code editor.

---

# Creating a Web Server

This section will teach how to build a basic web server in a few simple steps.

In the index.js file, require the [**http module**](https://nodejs.org/api/http.html). This module allows node to transfer data over HTTP.

```js
const http = require('http');
```

Create a variable for the port the server will listen at.

```js
const port = 3000;
```

Next, we'll create the web server using the `http.createServer` method. This method takes a callback that contains the request object and response object.

```js
const server = http.createServer((req, res) => {
  // Set HTTP Response as 200 OK
  res.statusCode = 200;

  // Set HTTP Headers, this defines the type of content we will send
  res.setHeader('Content-Type', 'text/html');

  // Writing a response
  res.write('<h1>Hello World!</h1>');

  // Ending the response process
  res.end();
});
```

Finally, we need to tell the server to listen at port 3000.

```js
server.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);
```

Run the node server with by entering `node index.js` in the terminal and visit the webserver on **localhost:3000**

![Entering node index.js in the terminal](/images/terminal.png)

![Viewing web server on browser at localhost:3000](/images/hello-world.png)

---

# JSON API

## Sending a JSON Response

Right now, the web server is pretty bare and doesn't have much functionality. Let's change that. In this tutorial, we turn our web server into a JSON API that returns a random joke.

First, let's edit our web server to tell the client to expect JSON data and send a JSON message as the response.

```js
const server = http.createServer((req, res) => {
  // Set HTTP Response as 200 OK
  res.statusCode = 200;

  // Set HTTP Header to application/json
  res.setHeader('Content-Type', 'application/json');

  // We can send a JSON message and end the response at the same time
  res.end(JSON.stringify({ data: 'Hello World' }));
});
```

## Reading Data from a File

Now we need some jokes to send. To do this, we'll be using a dataset of jokes available to us from the  JSON file in the project folder.

To do this we'll need to require the [**fs**](https://nodejs.org/api/fs.html) and [**path**](https://nodejs.org/api/path.html) module at the top of our file.

```js
const http = require('http');
const fs = require('fs');
const path = require('path');
```

To read the JSON file, we use `fs.readFileSync` method in combination with the `path.join`
method. 

The `path.join` method constructs a path to the JSON data. The `__dirname` environment variable refers to the directory containing the executed file, i.e., `index.js`. 

Finally, we parse the data to a JSON object.

```js
// Read from jokes.json and parse JSON to JavaScript object
const jokes = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'jokes.json'), 'utf-8')
);
```

## Sending a Random Joke

Now, let's put this all together and send a joke to the client.

```js
const server = http.createServer((req, res) => {
  // Set HTTP Response as 200 OK
  res.statusCode = 200;

  // Set HTTP Header to application/json
  res.setHeader('Content-Type', 'application/json');

  // Generate number between 0 and the amount of jokes
  const random = Math.floor(Math.random() * jokes.length);

  // Select random joke from data
  const joke = jokes[random];

  // Send joke as response
  res.end(JSON.stringify({ data: joke }));
});
```

If all is done correctly, visiting the site on **localhost:3000** will display a random joke.

![Viewing joke from API on browser at localhost:3000](/images/joke.png)

---

# URL Parameters

Let's take this a step further. Let's allow the client the select a specific joke from a specified position in the jokes array. 

For example, if the clients send a request to **localhost::3000/10**, the server will return the 10th Joke.

First, tell the server only to send a random joke if the client doesn't request one. 

```js
const server = http.createServer((req, res) => {
  // Set HTTP Header to application/json
  res.setHeader('Content-Type', 'application/json');

  // If client doesn't request a specific joke, send a random one
  if (req.url === '/') {
    // Generate number between 0 and the amount of jokes
    const random = Math.floor(Math.random() * jokes.length);

    // Select random joke from data
    const joke = jokes[random];

    // Send joke as response
    return res.writeHead(200).end(JSON.stringify({ data: joke }));
  }
});
```

You can visit **localhost::3000** on the browser to ensure this still works.

![Viewing joke from API on browser at localhost:3000](/images/joke-2.png)


## Parsing the URL

Now, let's parse the parameter from the URL. First, we should check if the client sends a value that the server can parse to a number, and if it can't, we'll send back an error response.

```js
const server = http.createServer((req, res) => {
  // Set HTTP Header to application/json
  res.setHeader('Content-Type', 'application/json');

  // If there user doesn't request a specific joke, send a random one
  if (req.url === '/') {
    // Generate number between 0 and the amount of jokes
    const random = Math.floor(Math.random() * jokes.length);

    // Select random joke from data
    const joke = jokes[random];

    // Send joke as response
    return res.writeHead(200).end(JSON.stringify({ data: joke }));
  }

   // Remove slash from path name
  const path = req.url.slice(1);

  // If parameter is not a number, return 400 bad request
  if (isNaN(path)) {
    return res.writeHead(400).end(
      JSON.stringify({
        data: { error: 'Please enter a valid number' },
      })
    );
  }
});
```

## Sending the Requested Joke

Next we check if the joke exists, and if it doesn't, we will send a 404 Not Found Error. 

If the joke exists, the server will send the client the joke with the matching index.

```js
const server = http.createServer((req, res) => {
  // Set HTTP Header to application/json
  res.setHeader('Content-Type', 'application/json');

  // If there user doesn't request a specific joke, send a random one
  if (req.url === '/') {
    // Generate number between 0 and the amount of jokes
    const random = Math.floor(Math.random() * jokes.length);

    // Select random joke from data
    const joke = jokes[random];

    // Send joke as response
    return res.writeHead(200).end(JSON.stringify({ data: joke }));
  }

  // Remove slash from path name
  const path = req.url.slice(1);

  // If parameter is not a number, return 400 bad request
  if (isNaN(path)) {
    return res.writeHead(400).end(
      JSON.stringify({
        data: { error: 'Please enter a valid number' },
      })
    );
  }

  // Parse paramter to number
  const index = parseInt(path, 10);

  // Select joke using index
  const joke = jokes[index];

  // If no joke exists for index, return a 404 message to the client
  if (!joke) {
    return res
      .writeHead(404)
      .end(JSON.stringify({ data: { error: 'No jokes found' } }));
  }

  // Return joke to client
  return res.writeHead(200).end(JSON.stringify(joke));
});
```

If all was done correctly sending a request with the following url **localhost::3000/10** will display the following joke

![Viewing specific joke from API on browser at localhost:3000](/images/joke-3.png)

**🎉 Congratulations! 🎉** you have built your very first API using Node.js. 

You can view the full source code for this tutorial from the [**Github repository**](https://github.com/dylanmooney62/nodejs-tutorial)

---

## Additional Resources

If you would like to take to your Node.js knowledge to the next level, there are many free and excellent resources available on the web.

- [**Node.js Ultimate Beginner’s Guide in 7 Easy Steps**](https://www.youtube.com/watch?v=ENrzD9HAZK4) -- Learn the very fundamentals of Node.js.
- [**W3Schools Node.js tutorial**](https://www.w3schools.com/nodejs/) -- Here you can learn the very basic of Node.js and more in-depth topics such as connecting to a database.
- [**Node.js and Express.js full course**](https://www.youtube.com/watch?v=Oe421EPjeBE) -- An entire eight hour course regarding Node.js and the Express framework.
  