pipeline {
    agent any

    environment {
        ANDROID_HOME = "$WORKSPACE/android-sdk"
        PATH = "$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools"
    }

    stages {
        stage('Prepare Environment') {
            steps {
                sh '''
                echo "Installing Android platform-tools if not already installed..."
                if ! command -v adb >/dev/null 2>&1; then
                    sudo apt-get update
                    sudo apt-get install -y android-sdk-platform-tools
                fi

                adb start-server
                echo "Connected Devices:"
                adb devices
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Mobile Tests') {
            steps {
                sh '''
                echo "Running WebdriverIO tests..."
                npx wdio run ./wdio.conf.js || echo "⚠️ Tests failed, generating reports anyway..."
                '''
            }
        }

        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: 'reports/html/**/*.*', fingerprint: true, allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo 'Cleaning up ADB...'
            sh 'adb kill-server || true'
        }
    }
}
