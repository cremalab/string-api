* `npm install`
* create `.env` file with the content outlined below
* add a `SIGNING_SECRET` variable, it can be whatever string you want
* `npm start`

#### `.env` file contents
```
GOOGLE_API_KEY=<YOUR KEY HERE>
SIGNING_SECRET=<SOME LONG STRING>
TWILIO_SID=<GET FROM TWILIO>
TWILIO_TOKEN=<GET FROM TWILIO>
TWILIO_FROM_PHONE=+15005550006
CLOUDINARY_NAME=string
CLOUDINARY_KEY=<YOUR_CLOUDINARY_KEY>
CLOUDINARY_SECRET=<YOUR_CLOUDINARY_SECRET>
```

### Authentication
Authentication is provided by using JSON Web Tokens and device-in-hand security. Authentication flow is as follows:

1. To log in _or_ sign up, `POST` a payload of `{phone: 9999999999}` to `/api/users`
2. The API will look up or create a user based on that phone number and return response with a `_id` and a `tempToken`. It will also send a text message with a 5 digit verification code to the phone number.
3. Prompt the user to enter the verification code they received, and pass it and the `tempToken` to the server via a `POST` request to `/api/sessions`, like so: `{tempToken: '38fjdsf9j4jSSjfmdk', verificationCode: 11387}`
4. If the verification code matches, the API will respond with a `201` and a payload of a `user` object with a `authToken` attribute.
5. Save the `authToken` attribute and send it with all requests under the `Authorization` header.

Example response from successful session request:

```json
{
  "user": {
    "authToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6ImttdTN0WEg3WDhnOVg1dVQiLCJ1c2VySWQiOiI1NmY5YjliMjg5ZjExNWNlZDc2M2YyMzIiLCJpYXQiOjE0NTkyMDY1Nzh9.W0XqueUgZAqsA6A6vrduGU0gpfip-aVAuus9FaNIS8c",
    "id": "56f9b9b289f115ced763f232",
    "name": null
  }
}
```

### Message handling
En lieu of a RESTful JSON API, String utilizes handlers on a websocket connection. A Socket.io server is registered on web server startup via `lib/socketEvents.js`. Each message with an `action` property is authorized by the current user and handled by a handler in `lib/actions/index.js` with a matching key name. You can consider the `socketEvents.js` file a bare bones router, and all exports in `lib/actions` route handlers.

Each action handler is passed `payload` and `chatInterface` params. `payload` is the formatted response from the client, and `chatInterface` is the socket connection that the message occurred on. Each action handler must return a promise that resolves a properly formatted chat response. You can view the expected bot response schema at `config/schemas/botMessageSchema`. To assist in formatting messages, use the `respondWith` method from `lib/chatHelpers.js`.

A simple action handler would look like this:

```js
'string:start': () => {
  return Promise.resolve(ch.respondWith({
    text: `What do you want?!`
  }))
}
```

This would simply respond with the text `What do you want?!` and not prompt the user for any input.

#### Eliciting User Responses

If you're handling a user action with a question and you want to provide multiple options for a user to make a choice with, you'll need to return 3 things in your response object:

* `responseType` of  `'choice'` - this let's the client app know how to format the response
* a `responseOptions` object with an `items` array property - these are the options to display to the user
* a `responseAction` string - this is the action type that will be sent with the user's response when a choice is made. Basically: what to do next.

Here's an example of an action handler that returns multiple choices:

```js
'string:set_favorite_tv_show': (payload, chatInterface) => {
  const { activity_type, continued } = payload.params

  // stuff is done here to save a user's favorite TV show... then()  
  return ch.respondWith({
    text: `Who is your favorite Friends character?`,
    sentiment: 'friendly',
    responseOptions: {
      items: [
        {text: 'Monica', params: {character: 'monica'}},
        {text: 'Chandler', params: {character: 'chandler'}},
        {text: 'Rachel', params: {character: 'rachel'}},
        {text: 'Ross', params: {character: 'ross'}},
        {text: 'Joey', params: {character: 'joey'}},
        {text: 'They all suck', params: {character: null}},
      ],
      multi: false
    },
    responseAction: 'string:set_favorite_character',
    responseType: 'choice'
  })
}
```

When a user selects an option, the client app sends a socket response with the selected choice's `params` merged into the response, and an `action` property of the original `responseAction`.

A `responseParams` object can also be included with an API responses. This object will simply be merged into the params of the client app's response object. Use this as a way to retain params over multiple requests, e.g.

```js
return Location.model.findOne({_id: params.location }).exec().then((location) => {
  return ch.respondWith({
    text: `Are you sure you want to choose ${location.name}?`,
    responseAction: 'string:confirm_location_selection',
    responseParams: {
      location: location._id
    },
    responseType: 'choice',
    responseOptions: {
      items: [
        {text: `Yes`, params: {confirm: true}},
        {text: `No`, params: {confirm: false}}
      ],
      multiple: false
    }
  })
})
```

The payload from a `Yes` choice in this example would contain
```
params: {
  confirm: true, // merged param from choice
  location: `1eff8e3ff` // merged param from `responseParams`
}
```

#### User Response Types

| responseType   | Description                                                                                                             | requires                                                                                                      |
|----------------|-------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| `choice`       | Renders multiple buttons for a user's selection.                                                                        | a `responseOptions` object with an `items` array property. Each item must have `text` and `params` attributes |
| `text`         | Reveals a keyboard for user text input. Returns text as a `text` property on the response payload.                      |                                                                                                               |
| `meda`         | Prompts the user for a photo/video. Returns uploaded media object as `media` on the response payload                    |                                                                                                               |
| `userLocation` | Prompts user device for geo-location information. Immediately returns a response with updated `userLocation` attribute  | a `nextAction` string param describing what action should be handled after response from client               |
