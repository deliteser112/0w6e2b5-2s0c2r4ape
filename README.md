![image](https://github.com/deliteser112/0w6e2b5-2s0c2r4ape/assets/158203489/d3458327-1e3b-4539-aacb-4f6a2776cc0a)# Scraping Backend Project

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







To execute tasks with Nx use the following syntax:

```
npx nx <target> <project> <...options>
```

You can also run multiple targets:

```
npx nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
npx nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/features/run-tasks).

## Set up CI!

Nx comes with local caching already built-in (check your `nx.json`). On CI you might want to go a step further.

- [Set up remote caching](https://nx.dev/features/share-your-cache)
- [Set up task distribution across multiple machines](https://nx.dev/nx-cloud/features/distribute-task-execution)
- [Learn more how to setup CI](https://nx.dev/recipes/ci)

## Explore the project graph

Run `npx nx graph` to show the graph of the workspace.
It will show tasks that you can run with Nx.

- [Learn more about Exploring the Project Graph](https://nx.dev/core-features/explore-graph)

## Connect with us!

- [Join the community](https://nx.dev/community)
- [Subscribe to the Nx Youtube Channel](https://www.youtube.com/@nxdevtools)
- [Follow us on Twitter](https://twitter.com/nxdevtools)
