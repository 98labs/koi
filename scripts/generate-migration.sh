echo ""
echo "Generating Migration Script"
echo ""

echo " -> Step 1/2: Generating Migrtaion Directory."
echo ""

mkdir -p ./src/db
mkdir -p ./src/db/seeders
mkdir -p ./src/db/migrations
mkdir -p ./src/models

echo ""
echo " -> Migration Directory completed."
echo ""

echo ""
echo " -> Step 2/2: Generating Migration Script."

./node_modules/.bin/sequelize migration:generate --name $1

echo ""
echo " -> Migration Script generated."
echo ""

echo " -> Done."
echo ""