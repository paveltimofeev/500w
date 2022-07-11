#!/bin/bash

mkdir ~/.ssh/
cp ./keypairs/id_ed25519 ~/.ssh/id_ed25519
chmod 600 ~/.ssh/id_ed25519
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
ssh-keyscan -H github.com >> /etc/ssh/ssh_known_hosts

git config --global user.email "paul.v.timofeev@gmail.com"
git config --global user.name "paveltimofeev"

git clone git@github.com:paveltimofeev/500w.git /500w
rm -rf /500w/docs/
cp -r /app/docs/ /500w/docs/
