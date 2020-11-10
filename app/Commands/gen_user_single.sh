echo "Changing to script container"
cd "$(dirname "$0")" || exit
cd ../../../wagapi || exit
echo "The present working directory is $(pwd)"

./yii user/create jamessmith@db.nflfanwager.com jamessmith trapok
#./yii user/create <email> <username> [password] [role]
./yii user/confirm jamessmith
#./yii user/confirm <email|username>
