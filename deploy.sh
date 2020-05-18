#!/bin/bash
cd ~/public_html/lushfarms-client/

npm run build

pm2 delete lushfarms 


pm2 start npm --name lushfarms -- start
