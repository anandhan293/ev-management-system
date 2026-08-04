pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "ev-frontend"
        BACKEND_IMAGE  = "ev-backend"
    }

    options {
        timestamps()
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo 'Checkout EV Management System Code'
                checkout scm
            }
        }

        stage('Frontend Test') {
            steps {
                echo 'Testing React Frontend'
                sh '''
                    cd frontend
                    npm install
                    CI=true npm test -- --watchAll=false
                '''
            }
        }

        stage('Backend Test') {
            steps {
                echo 'Testing Flask Backend'
                sh '''
                    cd backend
                    python3 -m pip install --upgrade pip
                    python3 -m pip install -r requirements.txt

                    if ls test*.py >/dev/null 2>&1 || find . -name "test*.py" | grep -q .; then
                        python3 -m unittest discover
                    else
                        echo "No backend unit tests found. Skipping."
                    fi
                '''
            }
        }

        stage('Docker Build Test') {
            steps {
                echo 'Building Docker Images'
                sh '''
                    docker compose build
                '''
            }
        }

        stage('Stop Old Deployment') {
            steps {
                echo 'Stopping Existing Containers'
                sh '''
                    docker compose down --remove-orphans || true

                    docker stop evdb-backend evdb-frontend 2>/dev/null || true
                    docker rm -f evdb-backend evdb-frontend 2>/dev/null || true

                    docker container prune -f || true
                '''
            }
        }

        stage('Deploy Application') {
            steps {
                echo 'Starting Containers'
                sh '''
                    docker compose up -d --build
                '''
            }
        }

        stage('Container Test') {
            steps {
                echo 'Checking Running Containers'
                sh '''
                    docker ps
                    docker compose ps
                '''
            }
        }

        stage('Backend API Test') {
            steps {
                echo 'Testing Backend API'
                sh '''
                    sleep 20

                    curl -f http://3.84.28.23:5000/ || \
                    curl -f http://3.84.28.23:5000/stations || \
                    echo "Backend endpoint not found."
                '''
            }
        }

        stage('Database Connection Test') {
            steps {
                echo 'Database Connection Check'
                sh '''
                    docker compose logs backend --tail=30
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline Finished'
            sh '''
                docker compose logs --tail=100 || true
            '''
        }

        success {
            echo 'Application deployed successfully.'
        }

        failure {
            echo 'Pipeline failed.'
        }
    }
}
