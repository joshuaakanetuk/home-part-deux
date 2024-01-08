---

title: How To Use Google Calendar API with Node.js
tags: ["google", "calendar", "api"]
date: 2024-01-10
author: Joshua Akan-Etuk
subtitle: How to use the Google Calendar API with Node.js.
---

Trying to setup the Google Calendar API with Node.js can be a bit of a challenge if using the [documentation](https://developers.google.com/calendar/api/quickstart/nodejs) Google has for their quickstart. In this article, we will walkthrough how to use the Google Calendar API with Node.js.

There are two ways of using the Google Calendar API: OAuth2 and a service account. OAuth2 allows you to make requests to the API on behalf of users and service accounts allows you to make your own data (very easily I might add). I personally prefer service accounts for tinkering with personal data and if you will building out a service for users, you'll need OAuth2. This article will show you how to get started with both methods, but successfully setting up the OAuth2 flow is outside of the scope of *this article*. 

Firstly, you'll need to setup a [Google Platform project](https://console.cloud.google.com/). You can create a new project or use an existing project to [enable the API](https://console.cloud.google.com/flows/enableapi?apiid=calendar-json.googleapis.com) for that project.


Go to the "OAuth Consent Screen" and select "External" and create.

Make the "App name" whatever you like, select the "User support email" dropdown and pick a valid email and add the Developer contact information. Hit Next.

Click "Add or Remove Scopes" and add "/auth/calendar" (You can change to specific scope if you want here). Click update, then save and continue.

When using OAuth2, you'll need to add Test users manually to make requests on their behalf. If using service accounts you can skip. Click Save and Continue. Feel free to go back to dashboard. Click "Credentials".

Click "Create Credentials."

## If OAuth2

Click "OAuth client ID" and choose the appropriate type (I recommend Web application). Choose the name and with Authorized redirect URIs (you can use Express for this) you can add `http://localhost:3000`. Hit create. Download the json in a safe spot. Add the json downloaded to your project somewhere. Be sure not to check this into Git and if you need to use the data in a production environment, use .env variables.

## If Service Account

Click "Service Account" and choose the name. The account id is generated from the name. Add an account description if you would like. Grant Google Console permissions if you like and then continue. Grant users access if you would like and hit done. Go to credentials and click on the Service Account. Go to "Keys" and create new key. Select JSON and create. Add the json downloaded to your project somewhere. Be sure not to check this into Git and if you need to use the data in a production environment, use .env variables.

 Copy the email, and head over to Google Calendar to add access to the calendars you want to retrieve data from. 

Now you can go into your Node project! 

Install the googleapis library.

```bash
npm install googleapis
```

or 

```bash
yarn install googleapis
```



## If OAuth2

Make a `/lib/gcal.js` file and add this code: 

```javascript
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'YOUR_REDIRECT_URI';
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const oAuth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Generate a URL for users to authorize the application
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

// After the user grants access, Google will redirect to the specified redirect URI with a code
// Use this code to get access and refresh tokens
async function getToken(code) {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  console.log('Access Token:', tokens.access_token);
  console.log('Refresh Token:', tokens.refresh_token);
}

// Example: Once you have the tokens, you can use the oAuth2Client to make API calls
// Example: List events from a user's calendar
async function listEvents() {
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  try {
    const response = await calendar.events.list({
      calendarId: 'primary', // or the specific calendar ID
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    const events = response.data.items;
    console.log('Events:', events);
  } catch (err) {
    console.error('Error fetching calendar events:', err);
  }
}

console.log(authUrl)

// Call getToken function when you receive the code after user authorization
// Call listEvents function to retrieve events from the calendar
// getToken('CODE_FROM_REDIRECT_URI').then((result) => listEvents())

```

The client ID, secret, and redirect URI will be in the downloaded JSON or back in the console. Once you have replaced the variables, run the code once, get the url printed in the console. After going through the flow you will get redirected and the browser will have something similar to `&code=""`. Copy that and place in `getToken()` (listEvents() will only run if getToken is run before it with a valid code). 

## If Service Account

Make a `/lib/gcal.js` file and add this code:

```javascript
const { google } = require('googleapis');
const key = require('./path-to-your-service-account-json-file.json'); // Import your service account key JSON file

// Define the scope for the calendar API
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Create a new JWT client using the key file
const auth = new google.auth.JWT({
  email: key.client_email,
  key: key.private_key,
  scopes: SCOPES,
});

// Set up the Google Calendar API with the authenticated client
const calendar = google.calendar({ version: 'v3', auth });

// Example: List the user's calendar events
async function listEvents() {
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  try {
    const response = await calendar.events.list({
      calendarId: 'primary', // or the specific calendar ID
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    const events = response.data.items;
    console.log('Events:', events);
  } catch (err) {
    console.error('Error fetching calendar events:', err);
  }
}

// Call the function to list events
listEvents();

```

Now you are done and setup to start using the Google Calendar API with NodeJS with other requests.