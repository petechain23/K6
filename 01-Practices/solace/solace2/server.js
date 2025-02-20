// run: node server.js
const express = require('express');
const solace = require('solclientjs');

const app = express();
app.use(express.json()); // Enable JSON parsing

// Stock Update
const host = "tcps://heineken-test.messaging.solace.cloud:55443";
const vpn = "heineken-test";
const username = "OMS_GLB_USER";
const password = "qzNy7l387Yn1";
const queueName = "HNK/MDM/PRODUCT/MATERIAL/STOCKUPDATE/UPD/OMS/APAC/MM/GR";

// Orders Incomming
// const host = "tcps://heineken-test.messaging.solace.cloud:55443";
// const vpn = "heineken-test";
// const username = "OMS_ID_USER";
// const password = "nrmQP3mK5tm9";
// const queueName = "HNK/MTC/SELLOUTSALES/SALESORDER/ORDER/3.0.0/OMS/NEW/APAC/ID";

solace.SolclientFactory.init({
    profile: solace.SolclientFactoryProfiles.version10
});

app.post('/send-message', (req, res) => {
    const payload = req.body;

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
        message.setBinaryAttachment(JSON.stringify(payload));

        session.send(message);
        console.log("Message sent:", payload);

        res.status(200).send({ status: "Message sent successfully!" });

        setTimeout(() => {
            session.disconnect();
            console.log("Disconnected from Solace.");
        }, 1000);
    });

    session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, function (error) {
        console.error("Connection failed:", error);
        res.status(500).send({ error: "Solace connection failed" });
    });

    session.connect();
});

// Start Express Server
const PORT = 3000; //default 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
