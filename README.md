# LogStream - Alerting Service 🔔

A scheduled Python microservice that evaluates user-defined rules against log data to trigger real-time alerts.

This service operates as the proactive monitoring engine of the platform. It runs on a schedule, querying the database to check if any alert conditions have been met, and dispatches notifications via email if a threshold is breached.

---

### Key Features

- **Scheduled Execution**: Triggered periodically by Amazon EventBridge for consistent monitoring.
- **Rule-Based Logic**: Evaluates custom rules created by users (e.g., "5 errors in 1 minute").
- **Multi-Channel Notifications**: Sends alerts via Amazon SES (Simple Email Service).
- **Stateful Evaluation**: Designed to avoid sending duplicate alerts for the same ongoing incident.

### Tech Stack

- **Language**: Python
- **Containerization**: Docker
- **Deployment**: AWS Fargate (as a scheduled task)
- **Scheduling**: Amazon EventBridge
- **Notifications**: Amazon SES

---

### Getting Started

_Instructions for local setup, environment variables, and running the service will be added here._

### Alerting Logic

_Details on how alert rules are structured and evaluated will be added here._
