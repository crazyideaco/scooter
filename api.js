const express = require('express');
const bodyParser = require('body-parser');
const net = require('net');

const app = express();
const PORT = 3005; // Choose a port for your API

app.use(bodyParser.json());

// TCP Server Connection
const tcpServerHost = '194.31.55.177'; // Update with your TCP server host
const tcpServerPort = 3003; // Update with your TCP server port
const tcpClient = new net.Socket();

tcpClient.connect(tcpServerPort, tcpServerHost, () => {
  console.log('Connected to TCP server');
});

// API Endpoint to Send Commands
app.post('/send-command', (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000) ;
  const { imei, command } = req.body;

  if (!imei || !command) {
    return res.status(400).json({ error: 'IMEI and command are required.' });
  }


  const formattedCommand = `*SCOS,OM,${imei},${command}#\n`; // Adjust the format based on your protocol

  tcpClient.write(formattedCommand, (err) => {
    if (err) {
      console.error('Error sending command to TCP server:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log(`Command sent to ${imei}: ${formattedCommand}`);
    res.json({ success: true, message: 'Command sent successfully.' });
  });
});

// Start the API server
app.listen(PORT, () => {
  console.log(`API server is listening on port ${PORT}`);
});

