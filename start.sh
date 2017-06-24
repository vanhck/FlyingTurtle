docker rm -f vanhck
docker run --name vanhck -d -p 8080:8080 -v $(pwd):/vanhck vanhck node /vanhck/server.js
docker logs -f vanhck
# docker run --name vanhck -i -t -p 8080:8080 -v $(pwd):/vanhck vanhck bash