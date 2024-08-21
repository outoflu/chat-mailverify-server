docker build -t node-docker-app .
docker run -p 50051:50051 -d node-docker-app