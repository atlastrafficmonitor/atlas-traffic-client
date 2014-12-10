<<<<<<< HEAD
Traffic Monitor
===============

Group members: Brian Newsom, Ian Ker-Seymer, Mark Simpson, Adrian Chen

##  Installation:

1. Install Node.js:
2. Install global npm tools for the project:
    `$ npm install -g yo generator-webapp grunt grunt-cli bower`
    `$ gem install compass`
3. Clone this project:
    `$ git clone https://github.com/atlastrafficmonitor/traffic-monitor && cd $_`
4. Install the project dependencies:
    `$ npm install && bower install`

## Usage:

1. Run the server:
    `$ grunt serve`
=======
atlas-traffic-server
====================

### Installation:

  1. Make sure you have Python 3.4 installed.
  2. Git it.
    `$ git clone https://github.com/atlastrafficmonitor/atlas-traffic-server && cd $_`
  3. Install the dependencies
    `$ pip install -r requirements.txt`

### Usage:

  1. Run the server.
    `$ python atlas_traffic_server.py`
  2. Connect to it from the client.

    ```javascript
    var conn = new WebSocket("ws://INSERT_SERVER_URL_HERE:8765");

    conn.onopen = function (ev) {
      // do something
    };

    conn.onmessage = function (ev) {
      // do something
      console.log(ev);
    };
    ```
>>>>>>> 6b9e3d1d37eb05eef19c06ebfb00e47be7a66b14
