pipeline {
    agent any

    stages {
        stage('clone') {
            steps {
                sh 'echo #############  CLONING ################'
                sh 'hostname'
            }
        }
        stage('build') {
            agent any
            steps {
                sh 'echo ########### BUILD ##############'
                sh 'pwd'
                sh 'hostname'
//                 sh 'docker-compose -f docker-compose.yml -f docker-compose.dev.yml -f components/analytics/docker-compose.analytics.yml build'
            }
        }
        stage('tag') {
            agent any
            steps {
                sh 'echo ########### tagg ##############'
                sh 'pwd'
                sh 'hostname'
                sh 'sh dockertag.sh'
            }
        }

        stage('Push'){
               agent any
               steps{
                sh 'echo ############## Pushing to Docker Registory  ################# '
                sh 'hostname'
             //   sh 'usermod -aG docker apexon'
               // sh 'docker image | grep -i 10.40.41.59'
//                 sh 'docker tag openvino/cvat_server 10.40.41.59:5000/cvat ; docker tag openvino/cvat_ui 10.40.41.59:5000/cvat-ui '
//                 sh 'docker push 10.40.41.59:5000/cvat; docker push 10.40.41.59:5000/cvat-ui'


            }
        }

        stage('Deploy') {
            agent any
            steps {
                script {
                    if (env.BRANCH_NAME == 'devops') {
                        echo 'Deploy From DevOps Branch'
                        //sh 'sh ssh/deploy 10.40.41.59'
                        sh 'hostname'
                        sh 'pwd'

                        //sh 'helm dependency build'
//                         sh 'helm upgrade -i cvat ./helm-chart -f ./helm-chart/values.yaml --namespace production'

               //         sh 'docker-compose up -d'
                    }
                    if (env.BRANCH_NAME == 'prod') {

                        echo 'Deploy From prod Branch'
                        //sh 'sh ssh/deploy 10.40.41.57'
                        sh 'hostname'
                        sh 'pwd'

                        //sh 'helm dependency build'

//                         sh 'helm upgrade -i cvat ./helm-chart -f ./helm-chart/values.yaml --namespace production'
                    }
                }
            }
        }
    }
}
