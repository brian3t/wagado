echo "Changing to script container"
cd "$(dirname "$0")" || exit
cd ../.. || exit
echo "The present working directory is $(pwd)"

./yii user/create abc@test.com abc01 trapok
#./yii user/create <email> <username> [password] [role]
./yii user/confirm abc01
#./yii user/confirm <email|username>
