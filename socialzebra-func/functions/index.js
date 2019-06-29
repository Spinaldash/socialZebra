const functions = require('firebase-functions');
const admin = require('firebase-admin');

//Exposing your firebase apikey is apparently not a security risk
const firebaseConfig = {
    apiKey: "AIzaSyCF3uMcSkRvxzmQh47z88cQuvqW_tFmSEw",
    authDomain: "social-zebra.firebaseapp.com",
    databaseURL: "https://social-zebra.firebaseio.com",
    projectId: "social-zebra",
    storageBucket: "social-zebra.appspot.com",
    messagingSenderId: "1062882121358",
    appId: "1:1062882121358:web:f2e3be75bdc1560e"
  };

admin.initializeApp(firebaseConfig);

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello World!");
});

exports.getScreams = functions.https.onRequest((request, response) => {
    admin
        .firestore()
        .collection('screams')
        .get()
        .then(data => {
            let screams = [];
            data.forEach(doc => {
                screams.push(doc.data());
            });
            return response.json(screams);
        })
        .catch(err => console.error(err));

});

exports.createScream = functions.https.onRequest((request, response) => {
    if (request.method !== "POST") {
        return response.status(400).json({error: 'Method not allowed'});
    }
    const newScream = {
        body: request.body.body,
        userHandle: request.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    };

    admin.firestore()
        .collection('screams')
        .add(newScream)
        .then(doc => {
            response.json({ 
                message: `document ${doc.id} created successfully`
            })
        .catch((err) => {
            response.status(500).json({ error: "Something went wrong" });
            console.error(err);
        });
        })
});