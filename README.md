# AWS Chime Chat Demo

<p align="left">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/Roberson-andrade/aws-chime-chat-demo?color=%2304D361" />

  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/progress-100%25-brightgreen.svg" alt="Progress">
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

- [x] Chat
  - [x] Visual and structure
  - [x] Integration with AWS Chime Messaging
  - [x] Chat operations (send message, create channel, receive messages...)

#### Backend:

- [x] Add a post confirmation Lambda trigger
- [x] Create chime user through the triggered lambda

#### Terraform:

- [x] Cognito
- [x] Chime Messaging
- [x] Lambda

### 💻 Prerequisites

Before you begin, make sure you've met the following requirements:

- [NodeJs v10.x+](https://nodejs.org/en);
- [AWS CLI](https://aws.amazon.com/cli/);
- [Terraform CLI](https://developer.hashicorp.com/terraform/downloads);
- [pnpm](https://pnpm.io/pt/);

### 📦 Configuring the environment

In order to configure and run this application, follow these steps:

Download the project and install the dependencies:

```bash
# Clone this repo
git clone https://github.com/Roberson-Andrade/aws-chime-chat-demo.git

# Enter the project folder
cd aws-chime-chat-demo

# Install the project dependencies
## This project uses pnpm workspace so the following command install all the project's dependencies
pnpm install

# Run the aws configure command to set the AWS credentials for the next steps and you should have an IAM user configured.

# Deploy infrastructure on your account with terraform
pnpm tf:deploy
```

### ☕ Running the application

To run the application, follow these steps:

```bash
# Run the web app
pnpm --filter web dev

# or

cd apps/web && pnpm dev
```

### 💡 AWS Infrastructure diagram

![infrastructure-diagram](https://user-images.githubusercontent.com/78360479/230795526-189b9e78-ce95-480a-b5b4-881d3dd9f519.png)

### 🖥️ App demonstration

[aws-chime-chat-video.webm](https://user-images.githubusercontent.com/78360479/230795416-5dcd4045-0e58-482c-b20a-7cb90503a9c0.webm)
