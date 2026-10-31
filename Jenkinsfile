pipeline {
    agent any
    stages {
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t dingamrabearistide/web-tryrecruiters:latest -f Dockerfile .'
            }
        }
        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                    sh 'docker push dingamrabearistide/web-tryrecruiters:latest'
                }
            }
        }
    }
}
