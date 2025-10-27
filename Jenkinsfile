pipeline {
    agent {
        docker {
            image 'appium/appium:latest'
            args '--privileged -v ~/.android:/root/.android -e ADB_SERVER_SOCKET=tcp:host.docker.internal:5037'
        }
    }

    environment {
        ANDROID_HOME = "/root/android-sdk"
        PATH = "$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools"
    }

    stages {
        stage('Check ADB') {
            steps {
                sh '''
                    echo "Verifying ADB connection..."
                    adb devices
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    npm ci
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    echo "Running WebdriverIO tests..."
                    npx wdio run ./wdio.conf.js
                '''
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh '''
                    npx allure generate ./allure-results --clean -o ./allure-report || true
                '''
                archiveArtifacts artifacts: 'allure-report/**/*.*', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "✅ Jenkins pipeline finished."
        }
    }
}
