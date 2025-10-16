pipeline {
  agent any

  environment {
    NODE_VERSION = '18'
    DOCKER_REGISTRY = 'your-registry.example.com' // change if needed
    IMAGE_NAME = "myorg/vite-app"
  }

  options {
    skipStagesAfterUnstable()
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Prepare Node') {
      steps {
        // Option 1: use NodeJS Plugin tool (uncomment if installed and configured)
        // nodejs(nodeJSInstallationName: 'Node 18') {
        //   sh 'node -v && npm -v'
        // }

        // Option 2: use nvm if available on agent, or system node
        sh 'node -v || true'
        sh 'npm -v || true'
      }
    }

    stage('Install dependencies') {
      steps {
        script {
          // prefer npm ci for reproducible installs if package-lock exists
          if (fileExists('package-lock.json')) {
            sh 'npm ci --silent'
          } else {
            sh 'npm install --silent'
          }
        }
      }
    }

    stage('Typecheck & Lint (optional)') {
      steps {
        // Run if scripts exist
        sh 'npm run typecheck || true'
        sh 'npm run lint || true'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Archive artifacts') {
      steps {
        archiveArtifacts artifacts: 'dist/**', onlyIfSuccessful: true
      }
    }

    stage('Docker: Build & Push (optional)') {
      when {
        expression { return env.BUILD_DOCKER == 'true' }
      }
      steps {
        script {
          docker.withRegistry("https://${env.DOCKER_REGISTRY}", 'docker-credentials-id') {
            def img = docker.build("${env.IMAGE_NAME}:${env.BUILD_NUMBER}")
            img.push()
          }
        }
      }
    }

    stage('Deploy via SSH (optional)') {
      when {
        expression { return env.DEPLOY_TO_SERVER == 'true' }
      }
      steps {
        // requires SSH credentials configured in Jenkins and ssh-agent plugin
        sshagent(['ssh-credentials-id']) {
          // You can copy dist/ to remote using rsync/scp and run commands on remote
          sh '''
            scp -r dist/* ubuntu@your-server:/var/www/vite-app/
            ssh ubuntu@your-server 'sudo systemctl restart nginx' || true
          '''
        }
      }
    }
  }

  post {
    success {
      echo 'Build succeeded'
    }
    failure {
      echo 'Build failed'
    }
    always {
      // optional cleanup
    }
  }
}
