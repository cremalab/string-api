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
```

### Docs
API docs can be viewed in the Swagger UI at `/docs`

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
