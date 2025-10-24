pipeline {
    agent {
        docker {
            image 'appium/appium:latest'
            args '--privileged -v /dev/bus/usb:/dev/bus/usb'
        }
    }

    environment {
        ANDROID_HOME = "/root/android-sdk"
        PATH = "$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools"
    }

    options {
        timeout(time: 30, unit: 'MINUTES') // prevent hanging jobs
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check ADB') {
            steps {
                sh '''
                echo "Verifying ADB installation..."
                adb version || echo "⚠️ adb not found"
                adb start-server || true
                adb devices || true
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                echo "Installing dependencies..."
                npm ci || npm install
                '''
            }
        }

        stage('Run WebdriverIO Tests') {
            steps {
                sh '''
                echo "Running WDIO tests..."
                npx wdio run ./wdio.conf.js || echo "⚠️ Tests failed, generating report anyway..."
                '''
            }
        }

        stage('Generate & Archive Reports') {
            steps {
                sh '''
                echo "Generating Allure report..."
                npx allure generate ./allure-results --clean -o ./allure-report || true
                '''
                archiveArtifacts artifacts: 'allure-report/**/*.*', fingerprint: true, allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "Cleaning up ADB..."
            sh 'adb kill-server || true'
        }
    }
}
