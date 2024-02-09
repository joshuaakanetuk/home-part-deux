---

title: How To Use Open AI API with Node.js
tags: ["openai", "chatgpt", "api", "nodejs", "tutorial"]
date: 2024-02-08
published: true
author: Joshua Akan-Etuk
subtitle: How To Use Open AI API with Node.js
---

ChatGPT has become one of the most popular web applications of all-time. The firm, OpenAI, that created ChatGPT actually has an API that allow access to the same models that ChatGPT uses and more. This article will demonstrate quickstart usage for OpenAI's API for Node.js. 

> This requires a credit card, but you are provided $5 credits before you are change


1. First you'll need to create an API account via [OpenAI's platform](https://platform.openai.com/signup). It's free to create.

2. Create an [API key](https://platform.openai.com/account/api-keys) and save it securely somewhere as it is required to make requests to OpenAI.

3. Create a Nodejs project. Run `npm init` if you like.

4. Install the `openai` package:

```bash
npm install openai@^4.0.0
``` 
or
```bash
yarn install openai@^4.0.0
``` 

5. Create a `index.js` and paste the following code (sourced from [OpenAI docs](https://platform.openai.com/docs/api-reference/authentication)):

```javascript
import OpenAI from "openai";

const openai = new OpenAI({
  organization: 'YOUR_ORG_ID',
});
```

You are now ready to make other requests!