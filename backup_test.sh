
docker run -it \
  --env AWS_ACCESS_KEY_ID=myaccesskeyid \
  --env AWS_SECRET_ACCESS_KEY=mysecretaccesskey \
  --env BUCKET=mybucketname \
  --env BACKUP_FOLDER=a/sub/folder/path/ \
  --env INIT_BACKUP=false \
  --env DISABLE_CRON=true \
 prcek/mongodb-backup-s3 /bin/bash
