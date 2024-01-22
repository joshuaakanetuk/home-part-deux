---
title: How To Use Google Calendar API with Python
tags: ["google", "calendar", "api", "python"]
date: 2024-01-17
author: Joshua Akan-Etuk
subtitle: How to use the Google Calendar API with Python.
---

Trying to setup the Google Calendar API with Python can be a bit of a challenge if using the [documentation](https://developers.google.com/calendar/api/quickstart/python) Google has for their quickstart. In this article, we will walkthrough how to use the Google Calendar API with Python.

There are two ways of using the Google Calendar API: OAuth2 and a service account. OAuth2 allows you to make requests to the API on behalf of users and service accounts allows you to make your own data (very easily I might add). I personally prefer service accounts for tinkering with personal data and if you will building out a service for users, you'll need OAuth2. This article will show you how to get started with both methods, but successfully fully setting up the OAuth2 flow is outside of the scope of _this article_.

Firstly, you'll need to setup a [Google Platform project](https://console.cloud.google.com/). You can create a new project or use an existing project to [enable the API](https://console.cloud.google.com/flows/enableapi?apiid=calendar-json.googleapis.com) for that project.

Go to the "OAuth Consent Screen" and select "External" and create.

Make the "App name" whatever you like, select the "User support email" dropdown and pick a valid email and add the Developer contact information. Hit Next.

Click "Add or Remove Scopes" and add "/auth/calendar" (You can change to specific scope if you want here). Click update, then save and continue.

When using OAuth2, you'll need to add Test users manually to make requests on their behalf. If using service accounts you can skip. Click Save and Continue. Feel free to go back to dashboard. Click "Credentials".

Click "Create Credentials."

## Using OAuth2

Click "OAuth client ID" and choose the appropriate type (I recommend Web application). Choose the name and with Authorized redirect URIs (you can use Express for this) you can add `http://localhost:3000`.

Hit create. 

Download the json in a safe spot. Add the json downloaded to your project somewhere. Be sure not to check this into Git and if you need to use the data in a production environment, use .env variables.

## Using Service Account

Click "Service Account" and choose the name. The account id is generated from the name. Add an account description if you would like. Grant Google Console permissions if you like and then continue.

Grant users access if you would like and hit done. Go to credentials and click on the Service Account. 

Go to "Keys" and create new key. Select JSON and create. Add the json downloaded to your project somewhere. Be sure not to check this into Git and if you need to use the data in a production environment, use .env variables.

Copy the email, and head over to Google Calendar to add access to the calendars you want to retrieve data from.

Now you can go into your Python project!

Install the required libraries.

```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

## Using OAuth2

Create a `.py` file and add this code:

```python
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/calendar']

flow = InstalledAppFlow.from_client_secrets_file(
    'path/to/client_secrets.json', SCOPES)
credentials = flow.run_local_server(port=0)

service = build('calendar', 'v3', credentials=credentials)

# Now, you can use 'service' to make API calls.
now = datetime.datetime.utcnow().isoformat() + "Z"  # 'Z' indicates UTC time
print("Getting the upcoming 10 events")
events_result = (
    service.events()
    .list(
        calendarId="primary",
        timeMin=now,
        maxResults=10,
        singleEvents=True,
        orderBy="startTime",
    )
    .execute()
)
events = events_result.get("items", [])

if not events:
    print("No upcoming events found.")
    return

# Prints the start and name of the next 10 events
for event in events:
    start = event["start"].get("dateTime", event["start"].get("date"))
    print(start, event["summary"])

```

## Using Service Account

Create a `.py` file and add this code:

```python
from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/calendar']

credentials = service_account.Credentials.from_service_account_file(
    'path/to/service-account-key.json', scopes=SCOPES)

service = build('calendar', 'v3', credentials=credentials)

# Now, you can use 'service' to make API calls.
now = datetime.datetime.utcnow().isoformat() + "Z"  # 'Z' indicates UTC time
print("Getting the upcoming 10 events")
events_result = (
    service.events()
    .list(
        calendarId="primary",
        timeMin=now,
        maxResults=10,
        singleEvents=True,
        orderBy="startTime",
    )
    .execute()
)
events = events_result.get("items", [])

if not events:
    print("No upcoming events found.")
    return

# Prints the start and name of the next 10 events
for event in events:
    start = event["start"].get("dateTime", event["start"].get("date"))
    print(start, event["summary"])


```

Now you are done and setup to start using the Google Calendar API with Python with other requests.
