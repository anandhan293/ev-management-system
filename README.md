# ⚡ EV Charging Station Management System

A full-stack **3-Tier EV Charging Station Management System** built with **React, Flask, MySQL, Docker, and Jenkins**. The application allows users to view EV charging stations, check charging port availability, and retrieve station details through a REST API.

---

## 📌 Project Overview

The EV Charging Station Management System is designed to manage electric vehicle charging stations efficiently. It demonstrates modern full-stack development and DevOps practices using Docker containers and Jenkins CI/CD.

### Features

- 🚗 View EV charging stations
- 📍 District-wise station search
- 🔌 Display available charging ports
- 🌐 RESTful API using Flask
- 🗄️ MySQL database integration
- 🐳 Docker containerization
- ⚙️ Jenkins CI/CD automation

---

## 🏗️ Architecture

<img width="1536" height="1024" alt="WhatsApp Image 2026-08-05 at 10 31 56 PM" src="https://github.com/user-attachments/assets/0e4bec49-c0b6-4725-923c-b7220a6cfec7" />


---

## 🛠️ Technology Stack

### Frontend
- React.js
- Bootstrap
- HTML5
- CSS3
- JavaScript

### Backend
- Python
- Flask
- Flask-CORS
- REST API

### Database
- MySQL

### DevOps
- Docker
- Docker Compose
- Git & GitHub
- Jenkins CI/CD

---

## 📁 Project Structure

```text
EV-Management-System/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

---

## 🚀 Backend API

### Get All Stations

```http
GET /stations
```

Example

```
http://localhost:5000/stations
```

---

### Get Stations by District

```http
GET /stations/<district>
```

Example

```
http://localhost:5000/stations/Chennai
```

---

## 🐳 Docker Deployment

### Build Images

```bash
docker compose build
```

### Start Containers

```bash
docker compose up -d
```

### Check Running Containers

```bash
docker ps
```

### Stop Containers

```bash
docker compose down
```

---

## 🔌 Application Ports

| Service | Port |
|----------|------|
| React Frontend | 3000 |
| Flask Backend | 5000 |
| MySQL Database | 3306 |

---

## ⚙️ Jenkins CI/CD Pipeline

Pipeline stages:

1. Clone Source Code
2. Verify Docker
3. Stop Existing Containers
4. Build Docker Images
5. Deploy Containers
6. Verify Deployment

---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/anandhan293/ev-management-system.git
```

Move into the project directory:

```bash
cd ev-management-system
```

Build and start the application:

```bash
docker compose up --build -d
```

---

## 📤 Git Commands

```bash
git add .
git commit -m "Update EV Management System"
git push origin main
```

---

## 🔮 Future Enhancements

- User Authentication
- Online EV Charging Booking
- Payment Integration
- Charging History
- AWS Cloud Deployment
- Email Notifications
- Admin Dashboard

---

## 👨‍💻 Author

**Anandhan V**

AWS DevOps | Docker | Jenkins | Python | React | Flask

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
