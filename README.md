EV Management System project root:

Current structure:

evdb/
├── Jenkinsfile
├── backend
├── frontend
├── docker-compose.yml
└── README.md   ✅

Create file:

cd /root/evdb

vi README.md

Paste:

# EV Charging Station Management System

## Project Overview

EV Charging Station Management System is a 3-Tier application developed to manage electric vehicle charging stations.

The application provides:
- EV station management
- District-wise station details
- Available charging ports
- Backend REST API
- Database integration
- Docker container deployment
- Jenkins CI/CD automation


## Architecture


User
|
| HTTP Request
|
React Frontend
|
|
Flask Backend API
|
|
MySQL Database


## Technology Stack

### Frontend
- React JS
- Bootstrap
- HTML
- CSS
- JavaScript

### Backend
- Python
- Flask Framework
- Flask-CORS
- REST API

### Database
- MySQL

### DevOps Tools
- Docker
- Docker Compose
- GitHub
- Jenkins CI/CD


## Project Structure


ev-management-system/

├── frontend/
│ ├── src/
│ ├── package.json
│ └── Dockerfile
│
├── backend/
│ ├── app.py
│ ├── requirements.txt
│ └── Dockerfile
│
├── docker-compose.yml
├── Jenkinsfile
└── README.md



## Backend API

### Get All Stations


GET /stations


Example:


http://localhost:5000/stations



### Filter By District


GET /stations/<district>



## Docker Deployment

Build images:

```bash
docker compose build

Start application:

docker compose up -d

Check containers:

docker ps

Stop application:

docker compose down
Application Ports
Service	Port
React Frontend	3000
Flask Backend	5000
MySQL Database	3306
Jenkins CI/CD Pipeline

Pipeline stages:

Clone Source Code
Docker Verification
Stop Old Containers
Build Docker Images
Deploy Containers
Verify Deployment
Git Commands

Clone repository:

git clone https://github.com/anandhan293/ev-management-system.git

Push changes:

git add .
git commit -m "Update EV Management System"
git push origin main
Future Enhancements
User authentication
Online EV charging booking
Payment integration
Charging history reports
Cloud deployment using AWS
Author

Anandhan Raja
