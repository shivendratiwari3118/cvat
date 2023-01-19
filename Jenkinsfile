pipeline {
    agent any
    options {
        skipDefaultCheckout true
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: "${env.BRANCH_NAME}", url: "${env.REPO_URL}"
            }
        }

        stage('Build') {
            steps {
                sh './gradlew build'
            }
        }

        stage('Test') {
            steps {
                sh './gradlew test'
            }
        }

        stage('Deploy') {
            steps {
                sh './deploy.sh'
            }
        }
    }

    post {
        always {
            githubStatus context: 'continuous-integration/jenkins', state: 'success'
            if (env.CHANGE_ID) {
                githubComment message: "The pipeline completed successfully!"
                githubLabel labels: ['approved']
            }
        }
    }
}
