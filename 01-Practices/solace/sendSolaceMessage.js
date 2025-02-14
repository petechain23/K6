const solace = require('solace');

const host = "tcps://heineken-test.messaging.solace.cloud:55443";
const vpn = "heineken-test";
const username = "OMS_GLB_USER";
const password = "qzNy7l387Yn1";
const queueName = "HNK/MDM/PRODUCT/MATERIAL/STOCKUPDATE/UPD/OMS/APAC/MM/GR";

// Sample JSON Payload
const payload = {
    event: "Stock Update",
    materialID: "12345",
    warehouse: "APAC-MM",
    quantity: 500,
    timestamp: new Date().toISOString()
};

function sendMessage() {
    solace.SolclientFactory.init({
        profile: solace.SolclientFactoryProfiles.version10 // Required for compatibility
    });

    const session = solace.SolclientFactory.createSession({
        url: host,
        vpnName: vpn,
        userName: username,
        password: password,
        connectRetries: 3,
        sessionProperties: {
        keepAliveIntervalsLimit: 3
        }
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

    session.connect();
}

// Execute function
sendMessage();


/*
const solace = require('solace-messaging');

async function sendMessage() {
    const factory = solace.messaging.createMessageClientFactory({});
    const client = factory.createMessageClient();
    await client.connect({ host: 'wss://your-solace-broker-url:port', vpn: 'your-vpn', username: 'user', password: 'pass' });

    const producer = client.createMessageProducer();
    await producer.start();

    const message = factory.createMessage({ body: "Test message from K6" });
    await producer.send("your/queue/topic", message);
    
    console.log("Message sent to Solace Queue!");
    await client.disconnect();
}

sendMessage().catch(console.error);


string queueName = "HNK/MDM/PRODUCT/MATERIAL/STOCKUPDATE/UPD/OMS/APAC/MM/GR";
string password = "qzNy7l387Yn1";
string host = "tcps://heineken-test.messaging.solace.cloud:55443";
string username = "OMS_GLB_USER";
string vpnname = "heineken-test";

{
  "sku": "NPCTGOBL01",
  "distributor_id": "1102",
  "location": "10164514",
  "added_stocked_quantity": null,
  "total_stocked_quantity": null,
  "incoming_quantity": 1000,
  "incoming_date": "2025-01-20",
  "order_number": "17012024002"
}


// Sample JSON Payload
const payload = {
    sku: 'NPCTGOBL01',
    distributor_id: '1102',
    location: '10164514',
    added_stocked_quantity: null,
    total_stocked_quantity: null,
    incoming_quantity: 1000,
    incoming_date: '2025-01-20',
    order_number: '17012024002'
};

*/