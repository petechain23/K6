const solace = require('solclientjs'); // Correct package name

const host = "tcps://heineken-test.messaging.solace.cloud:55443";
const vpn = "heineken-test";
const username = "OMS_GLB_USER";
const password = "qzNy7l387Yn1";
const queueName = "HNK/MDM/PRODUCT/MATERIAL/STOCKUPDATE/UPD/OMS/APAC/MM/GR";

// Sample JSON Payload
const payload = {
    sku: 'NPCTGOBL01',
    distributor_id: '1102',
    location: '10164514',
    added_stocked_quantity: 1000,
    total_stocked_quantity: 1000,
    incoming_quantity: 0,
    incoming_date: '2025-03-20',
    order_number: '17012024002'
};

// Initialize the Solace factory
solace.SolclientFactory.init({
    profile: solace.SolclientFactoryProfiles.version10
});

// Create a session
const session = solace.SolclientFactory.createSession({
    url: host,
    vpnName: vpn,
    userName: username,
    password: password,
    connectRetries: 3
});

session.on(solace.SessionEventCode.UP_NOTICE, function () {
    console.log("Connected to Solace!");

    const message = solace.SolclientFactory.createMessage();
    message.setDestination(solace.SolclientFactory.createTopicDestination(queueName));

    // Convert JSON to string and attach as payload
    const messagePayload = JSON.stringify(payload);
    message.setBinaryAttachment(messagePayload);

    // Send message
    session.send(message);
    console.log("Message sent to Solace Queue:", messagePayload);

    // Disconnect after sending
    setTimeout(() => {
        session.disconnect();
        console.log("Disconnected from Solace.");
    }, 1000);
});

session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, function (error) {
    console.error("Connection failed:", error);
});

session.on(solace.SessionEventCode.DISCONNECTED, function () {
    console.log("Disconnected from Solace.");
});

// Connect to Solace
session.connect();
