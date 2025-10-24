pipeline {
    agent any

    environment {
        ANDROID_HOME = "/Users/refqihussein/Library/Android/sdk"
        PATH = "$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools"
    }

    stages {
        stage('Prepare Environment') {
            steps {
                sh '''
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
                // Run WDIO but don’t fail the pipeline immediately if tests fail
                sh '''
                npx wdio run ./wdio.conf.js || echo "⚠️ Tests failed, continuing to generate reports..."
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