pipeline {
    agent any
    stages {
        stage('Checkout SCM') {
            steps { checkout scm }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build --no-cache -t dingamrabearistide/web-tryrecruiters:latest -f Dockerfile .'
            }
        }
        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push dingamrabearistide/web-tryrecruiters:latest'
                }
            }
        }
    }
}
