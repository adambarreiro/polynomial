echo "************** EJECUTANDO MONGOD"
mongod --dbpath "/Users/adambarreiro/PFC/MongoDB" & 
sleep 1
echo "************** EJECUTANDO NODE"
node "main.js"