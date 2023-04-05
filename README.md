# AWS Chime Chat Demo

<p align="left">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/Roberson-andrade/aws-chime-chat-demo?color=%2304D361" />

  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/progress-0%25-brightgreen.svg" alt="Progress">
  </a>
	
  <a href="https://github.com/Roberson-andrade/aws-chime-chat-demo/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/Roberson-andrade/aws-chime-chat-demo">
  </a>

  <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen">
</p>

> Real time chat app with AWS Chime Messaging

### Features

#### Frontend:

- [x] Login

  - [x] Create user form
  - [x] Login form
  - [x] Integration with AWS Cognito through Amplify

- [ ] Chat
  - [x] Visual and structure
  - [x] Integration with AWS Chime Messaging
  - [ ] Chat operations (send message, create channel, receive messages...)

#### Backend:

- [x] Add a post confirmation Lambda trigger
- [x] Create chime user through the triggered lambda

#### Terraform:

- [x] Cognito
- [x] Chime Messaging
- [x] Lambda
