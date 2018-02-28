#!/bin/bash
echo ==== env ====
env
echo ==== params ====
TAG=pacosi
REMOTE_TAG=registry.heroku.com/pacosi/web
echo TAG=$TAG
echo REMOTE_TAG=$REMOTE_TAG
echo "{\"log\":\""`git log --pretty=oneline -n 1`"\", \"date\":\"`date`\", \"commit\":\"`git log --pretty=tformat:%h -n 1`\"}" > version.json
VER=`git log --pretty=tformat:%h -n 1`
echo VER=$VER
echo version.json
cat version.json
echo running docker build tag = $TAG:$VER
docker build -t $TAG:$VER .
if [ $? -ne 0 ]; then
  echo docker build error
  exit -1
fi
echo tagging as $REMOTE_TAG:$VER and $REMOTE_TAG:latest
docker tag $TAG:$VER $REMOTE_TAG:latest
if [ $? -ne 0 ]; then
  echo docker tag error
  exit -1
fi
docker tag $TAG:$VER $REMOTE_TAG:$VER
if [ $? -ne 0 ]; then
  echo docker tag error
  exit -1
fi
docker tag $TAG:$VER $TAG:latest
if [ $? -ne 0 ]; then
  echo docker tag error
  exit -1
fi
echo build done
exit 0
