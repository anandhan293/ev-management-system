pipeline {

    agent any

    environment {
        APP_NAME = "ev-management-system"
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "Checkout EV Management System Code"
                checkout scm
            }
        }


        stage('Frontend Test') {
            steps {
                echo "Testing React Frontend"

                sh '''
                cd frontend

                npm install

                npm test -- --watchAll=false
                '''
            }
        }


        stage('Backend Test') {
            steps {
                echo "Testing Flask Backend"

                sh '''
                cd backend

                pip install -r requirements.txt

                python -m unittest discover
                '''
            }
        }


        stage('Docker Build Test') {
            steps {
                echo "Testing Docker Build"

                sh '''
                docker compose build
                '''
            }
        }


        stage('Stop Old Deployment') {
            steps {
                echo "Stopping Previous Containers"

                sh '''
                docker compose down || true
                '''
            }
        }


        stage('Deploy Application') {
            steps {
                echo "Deploying EV Management System"

                sh '''
                docker compose up -d
                '''
            }
        }


        stage('Container Test') {
            steps {
                echo "Checking Docker Containers"

                sh '''
                sleep 10

                docker ps

                docker ps | grep evdb-frontend

                docker ps | grep evdb-backend
                '''
            }
        }


        stage('Backend API Test') {
            steps {
                echo "Testing Flask API"

                sh '''
                curl -f http://localhost:5000 || exit 1
                '''
            }
        }


        stage('Database Connection Test') {
            steps {
                echo "Testing Backend Database Connection"

                sh '''
                docker logs evdb-backend --tail 50
                '''
            }
        }
    }


    post {

        success {
            echo "✅ EV Management System CI/CD Deployment Successful"
        }

        failure {
            echo "❌ Pipeline Failed"

            sh '''
            docker compose logs --tail 100
            '''
        }

        always {
            echo "Pipeline Finished"
        }
    }
}
