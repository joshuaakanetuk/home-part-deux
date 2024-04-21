---

title: How to Create a Basic API with Python
tags: ["api", "python", "fastapi"]
date: 2024-04-22
subtitle: Use Python as your server for anything you want!
author: Joshua Akan-Etuk

---


You are starting to get into Python and you want to start tinkering with web apps, but you don't know where to start. Or maybe you are trying to remember how to create and deploy an API using Python. This guide will show you how to create an API with Python using FastAPI. There are many ways to deploy an API using Python like Flask and Django, but in this guide we will use FastAPI.

### Install FastAPI:

First, make sure you have FastAPI and Uvicorn installed. You can install them via pip:

```bash
pip install fastapi uvicorn
```

### Create your API:
Create a Python file named `main.py` and add this code:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
```

`@app.get("/")` allows users to request the top-level of the hosting entity and it will return Hello World. In order to see what it will look like we have to run the server.

### Run the server:
Run the server using Uvicorn. In your terminal execute this command:

```bash
uvicorn main:app --reload
```

This allows you to host the server on localhost:8000 and saves to the file will automatically restart the server. 

### Use Params:
Params allow for specific information from resources to be queried from users. There are multiple way of doing this, I will show you the url way. Add this code to your `main.py`:

```python
@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}
```

Now queries to your server like `localhost:8000/items/23` will return item_id: 23 from the server.

That's it! You've created a basic API with FastAPI. From here, you can expand your API by adding more routes, integrating databases, adding authentication, etc., depending on you want.