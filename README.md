# Scraping Backend Project

## Project Overview

This project is designed to perform web scraping operations and keep the scraped data up-to-date using a scheduled cron job. The project is structured as an NX monorepo with two main components: a backend scraping service and a cron job service.

### Main Components

1. Main Backend Scraping Service: This service handles web scraping requests, processes query parameters, and retrieves or stores data as needed. It is deployed on an AWS EC2 instance.
2. Cron Job Service: This service triggers the scraping process at regular intervals to ensure that the data remains current. It is deployed as an AWS Lambda function using the Serverless Framework.

### Deployment

The entire project is deployed using GitHub Actions, ensuring automated and continuous integration and deployment.

## Project Functionality

### Main Backend Scraping Service

The main backend service provides an endpoint to trigger the scraping process. It can perform two types of operations:
- On-Demand Scraping: Triggered by a user request with specific query parameters.
- Cached Data Retrieval: When no query parameters are provided, the service retrieves previously scraped data from S3.

Key Features:
- Scraping Logic: Handles pagination and optimizes scraping time to ensure efficient data retrieval.
- Data Caching: Stores the scraped data in S3 to avoid redundant scraping and reduce response time for subsequent requests.
- Endpoint: Exposes a `/scrape` endpoint that can be triggered manually or by the cron job.

### Cron Job Service

The cron job service is designed to automatically trigger the scraping process at scheduled intervals. This ensures that the data is regularly updated without manual intervention.
Key Features:
- Scheduled Trigger: Configured to run daily at midnight UTC using a cron schedule.
- Automated Data Update: Calls the scraping endpoint and processes the data, storing it in S3 for future use.

## Usage

### How to Trigger the Scraping Process

1. Manual Trigger:
   - Send a GET request to the `/scrape` endpoint with the desired query parameters.
   - Example: `GET http://ec2-3-88-184-167.compute-1.amazonaws.com:3000/scrape?lastName=Doe&firstName=John`
3. Automated Trigger (Cron Job):
   - The cron job automatically triggers the scraping process daily at midnight UTC.
   - No action is required from the user for this to occur.

### Endpoint Details
`/scrape` Endpoint
- Description: Triggers the scraping process and returns the scraped data.
- Query Parameters (optional)
  - `lastName`
  - `firstName`
  - `informalName`
  - `registrationNumber`
  - `registrationClass`
  - `registrationStatus`
  - `contactLensMentor`
  - `practiceName`
  - `cityOrTown`
  - `postalCode`
  - `languageOfService`
  - `areaOfService`
- Special Parameter:
  - `isCronJob`: Set to true when triggered by the cron job to store the scraped data in S3.


# Setup Instructions

Follow these instructions to set up the Scraping Backend Project in your local environment. This guide assumes that you have Node.js and npm installed.

## Prerequisites

- Node.js: Ensure you have Node.js (v18.x or above) installed. You can download it from [here](https://nodejs.org/).
- Nx CLI: Install the Nx CLI globally using npm:
  ```
  npm install -g nx
  ```

- AWS CLI: For deploying and managing services on AWS, install the AWS CLI as per the instructions [here](https://aws.amazon.com/cli/).
- Serverless Framework: Install the Serverless Framework globally:
  ```
  npm install -g serverless
  ```

## Cloning the Repository

First, clone the repository to your local machine using Git:

```
git clone https://github.com/deliteser112/0w6e2b5-2s0c2r4ape.git
cd 0w6e2b5-2s0c2r4ape
```

if you are using SSH:

```
git clone git@github.com:deliteser112/0w6e2b5-2s0c2r4ape.git
cd 0w6e2b5-2s0c2r4ape
```

## Installing Dependencies

Navigate to the project directory and install the required npm packages:

```
npm install
```

## Configuring AWS Credentials

To deploy the services to AWS, configure your AWS credentials:

- Add below credentials in .env file
  ```
  AWS_ACCESS_KEY_ID=your_aws_access_key_id
  AWS_SECRET_ACCESS_KEY=your_aws_secret_acccess_key
  S3_BUCKET_NAME=your_bucket_name
  S3_KEY_PREFIX=your_bucket_key
  ```

## Running the Project

Run the main backend project locally using the Nx CLI to compile the TypeScript code and prepare it for deployment:

```
nx serve assessment
```

## Deploying to AWS

Once you update the main branch of your repository, both the main backend service and the cron job service are automatically deployed through the configured GitHub Actions workflow.

### Manage EC2 Instance

To ensure that the main backend service runs successfully on an AWS EC2 instance, perform the following steps:
1. Connecting to Your EC2 Instance
   Use SSH to connect to your EC2 instance. Replace your-instance-ip with the actual IP address of your instance:
   ```
   ssh -i path/to/your/ssh-key.pem ec2-user@your-instance-ip
   ```
   
2. Preparing Your EC2 Instance for Node.js
   Before deploying the project, prepare your EC2 instance to run Node.js applications. This setup should be done once prior to the deployment:
   
   ```
   curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo apt-get install -y git
   mkdir ~/myproject
   cd ~/myproject
   ```
   
4. Running project
   The project is deployed to a directory on the EC2 instance as specified by the `TARGET_DIR` environment variable in the GitHub Actions secrets. Navigate to this directory:
   - Install packages
     ```
     npm install
     ```
   - Setup env variables
     ```
     echo "export HOST='0.0.0.0'" >> ~/.bashrc
     echo "export PORT=3000" >> ~/.bashrc
     echo "export AWS_ACCESS_KEY_ID=your_aws_access_key_id" >> ~/.bashrc
     echo "export AWS_SECRET_ACCESS_KEY=your_aws_secret_acccess_key" >> ~/.bashrc
     echo "export S3_BUCKET_NAME=your_bucket_name" >> ~/.bashrc
     echo "export S3_KEY_PREFIX=your_bucket_key" >> ~/.bashrc
     source ~/.bashrc
     ```
   - Install additional packages to run puppeteer library. This library requires browsing to scraping data from live website.
     ```
     sudo apt update && sudo apt upgrade -y
     sudo apt install -y libdrm2 libgbm1 alsa-utils libatk1.0-0 libcups2 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxi6 libxrandr2 libxss1 libxtst6 libpango-1.0-0 libxt6 libx11-xcb1 libxfixes3 libxcb1 libxkbcommon0 libgtk-3-0
     sudo apt install -y fonts-ipafont-gothic xfonts-100dpi xfonts-75dpi x11-utils xfonts-cyrillic xfonts-scalable xfonts-base
     ```
   - Run the project
     ```
     node main.js
     ```
   
5. Trigger long-running application
   - Create a service file (`/etc/systemd/system/myapp.service`)
   - Update that service file
     ```
     [Unit]
     Description=My App Service
     After=network.target
     [Service]
     Type=simple
     User=ubuntu
     Environment="HOST='0.0.0.0'" "PORT=3000" #other env variables like AWS_ACCESS_KEY
     ExecStart=/usr/bin/node /path/to/project
     Restart=on-failure
     [Install]
     WantedBy=multi-user.target
     ```
   - Starting and enabling the service:
     ```
     sudo systemctl start myapp.service
     sudo systemctl enable myapp.service
     ```
     Use below command to manage service.
     ```
     sudo systemctl restart myapp.service
     sudo systemctl stop myapp.service
     ```

## Verification

Verify the deployment by triggering the scrape process:

1. Access the `/scrape` endpoint through a browser or using a tool like curl:
   - For local verification:
     ```
     curl http://localhost:3000/scrape?lastName=Doe&firstName=John
     ```
   - For cloud verification:
     ```
     curl http://3.88.184.167:3000/scrape?lastName=Doe&firstName=John
     curl http://ec2-3-88-184-167.compute-1.amazonaws.com:3000/scrape?lastName=Doe&firstName=John
     ```
2. Check the logs or the output to confirm that the data is being scraped and handled correctly.

