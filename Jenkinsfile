pipeline {
    agent {
        docker {
            // Official Appium image with Node + ADB + Android SDK tools
            image 'appium/appium:latest'
            args '--privileged -v /dev/bus/usb:/dev/bus/usb'
        }
    }

    environment {
        ANDROID_HOME = "/root/android-sdk"
        PATH = "$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools"
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
                adb version
                adb start-server
                adb devices
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run WebdriverIO Tests') {
            steps {
                sh '''
                echo "Running tests..."
                npx wdio run ./wdio.conf.js || echo "⚠️ Tests failed, but continuing to report..."
                '''
            }
        }

        stage('Generate & Archive Reports') {
            steps {
                sh 'npx allure generate ./allure-results --clean -o ./allure-report || true'
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
