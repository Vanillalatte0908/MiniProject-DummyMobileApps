pipeline {
    agent any

    environment {
        NODE_ENV = "test"
        PATH = "/usr/local/bin:$PATH"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out code..."
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing Node.js dependencies..."
                sh 'npm install'
            }
        }

        stage('Run WebdriverIO Tests') {
            steps {
                echo "Running WebdriverIO tests..."
                sh 'npx wdio run ./wdio.conf.js'
            }
        }

        stage('Generate Allure Report') {
            steps {
                echo "Generating Allure report..."
                sh 'npx allure generate ./allure-results --clean -o ./allure-report || true'
            }
        }

        stage('Publish Allure Report') {
            steps {
                script {
                    // If Allure plugin is installed in Jenkins
                    allure([
                        includeProperties: false,
                        jdk: '',
                        results: [[path: 'allure-results']]
                    ])
                }
            }
        }
    }

    post {
        always {
            echo "Archiving results and cleaning up..."
            archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
        }
        failure {
            echo "Build failed. Check logs and screenshots in ./screenshots/"
        }
    }
}
