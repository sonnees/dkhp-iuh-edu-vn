const express = require('express');
const app = express();
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

app.use(cors());

// Load the gRPC protobuf file
const protoDefinition = protoLoader.loadSync('auth.proto');
const packageDefinition = grpc.loadPackageDefinition(protoDefinition);
const authService = packageDefinition.edu.iuh.AuthService;
const registerService = packageDefinition.edu.iuh.RegisterService;

// Create gRPC clients
const authClient = new authService('localhost:9090', grpc.credentials.createInsecure());
const registerClient = new registerService('localhost:9090', grpc.credentials.createInsecure());

// Define your API endpoints
app.get('/authorize', (req, res) => {
    const authRequest = { id: req.query.id, password: req.query.password };
    authClient.authorize(authRequest, (error, response) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(response); // Return gRPC response to client
    });
});

app.post('/register', (req, res) => {
    const registerRequest = {}; // Your register request object here
    registerClient.registerStudent(registerRequest, (error, response) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(response); // Return gRPC response to client
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
