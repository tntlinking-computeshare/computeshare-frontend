#!/opt/homebrew/bin/zsh

set -ex;

export TIMESTAMP=$(date "+%Y%m%d%H%M%S")

git fetch origin
git merge origin/develop
docker buildx build -f script/Dockerfile -t hamstershare/computeshare-frontend:${TIMESTAMP} --platform=linux/amd64 --push .
kubectl --kubeconfig ~/.kube/config_computeshare  -n computeshare set image deployment/computeshare-frontend computeshare-frontend=hamstershare/computeshare-frontend:${TIMESTAMP}
