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
      var conn = new WebSocket(“ws://INSERT_SERVER_URL_HERE:8765”);
  
      conn.onopen = function (ev) {
          // do something
      };

      conn.onmessage = function (ev) {
          // do something
          console.log(ev);
      };
      ```
