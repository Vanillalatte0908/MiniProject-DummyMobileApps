pipeline {
    agent {
        docker {
            image 'appium/appium:latest'
            // important: pass required docker args so container can see adb/device
            args '--privileged --network host -v /dev/bus/usb:/dev/bus/usb -v /home/ubuntu/.android:/root/.android'
        }
    }

    environment {
        ANDROID_HOME = "/root/android-sdk"
        PATH = "$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools"
        // pick a port derived from build number to avoid collisions across parallel runs
        ADB_PORT = "${5037 + (env.BUILD_NUMBER as Integer % 1000)}"
    }

    stages {
        stage('Sanity: Appium Version') {
            steps {
                sh 'appium -v || true'
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prepare ADB') {
            steps {
                sh '''
                  echo "Using ADB port: $ADB_PORT"
                  # stop any adb on default
                  adb -P $ADB_PORT kill-server || true
                  adb -P $ADB_PORT start-server
                  echo "ADB server started on port $ADB_PORT"
                  adb -P $ADB_PORT devices || true
                '''
            }
        }

        stage('Connect Device (USB or WiFi)') {
            steps {
                sh '''
                  # If device is USB-attached it will show in `adb devices`.
                  # If you need to pair via WiFi, set DEVICE_IP and PAIR_PORT env vars in Jenkins job
                  if [ -n "${DEVICE_IP}" ]; then
                    echo "Attempting pair to ${DEVICE_IP}:${PAIR_PORT}"
                    adb -P $ADB_PORT pair ${DEVICE_IP}:${PAIR_PORT} || true
                    # after pairing, connect
                    adb -P $ADB_PORT connect ${DEVICE_IP}:5555 || true
                  fi

                  echo "Final device list:"
                  adb -P $ADB_PORT devices -l
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
                  echo "Running WebdriverIO tests..."
                  # ensure the ADB port env var is used by tests
                  export ADB_SERVER_PORT=$ADB_PORT
                  npx wdio run ./wdio.conf.js
                '''
            }
        }

        stage('Allure Report') {
            steps {
                sh 'npx allure generate ./allure-results --clean -o ./allure-report || true'
                archiveArtifacts artifacts: 'allure-report/**/*.*', fingerprint: true, allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            sh 'adb -P $ADB_PORT kill-server || true'
            echo "Pipeline finished"
        }
    }
}
