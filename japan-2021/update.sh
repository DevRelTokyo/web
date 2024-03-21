#!/bin/bash
cd /home/ubuntu/japan-2021

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm use v16.10.0

git pull
sh getData.sh
git add .
git commit -m "Auto update"
MESSAGE=`git push`
NOTHING="Everything up-to-date"
if [ "$MESSAGE" = "$NOTHING" ] ; then
    echo "Clean"
else
    docker run --rm --volume="$PWD:/srv/jekyll" jekyll/jekyll jekyll build
    npx gh-pages -d _site
fi
