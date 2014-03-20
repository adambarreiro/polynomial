mongod --dbpath "../Database" &
sleep 3
./node_modules/forever/bin/forever "./main.js" &