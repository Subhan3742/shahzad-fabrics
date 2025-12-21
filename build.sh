source .env
UPLOAD_DIR="/var/www/public/shahzad-fabrics"
if docker ps -q --filter "name=${DOCKER_NAME}" | grep -q .; then
  echo "Creating backup image and backup container..."
  docker commit ${DOCKER_NAME} ${DOCKER_NAME}-backup:latest || true
  docker stop ${DOCKER_NAME} || true
  docker rmi -f ${DOCKER_NAME}:latest 2>/dev/null || true
  docker compose --env-file .env up -d backup-node
else
  echo "master container not running. Skipping backup."
  docker stop ${DOCKER_NAME} || true
  docker rmi -f ${DOCKER_NAME}:latest 2>/dev/null || true
fi

docker compose --env-file .env up -d master-node
docker stop ${DOCKER_NAME}-backup || true
docker rmi -f ${DOCKER_NAME}-backup:latest 2>/dev/null || true
cp -rf public/* ${UPLOAD_DIR}/
docker system prune -a -f