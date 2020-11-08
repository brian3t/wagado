echo "Changing to script container"
cd "$(dirname "$0")" || exit
cd ../.. || exit
echo "The present working directory is $(pwd)"

yes | ./yii user/delete abc01
