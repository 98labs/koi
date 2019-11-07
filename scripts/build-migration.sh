# Read arguments passed to the script.
if [ -z "$1" ]; then
 ENVIRONMENT='local'
else
 ENVIRONMENT="$1"
fi

echo ""
echo "Building Migrating scripts"
echo ""

echo " -> Step 1/2: Compiling migration scripts."
echo ""
mkdir -p ./dist-migrations/config
mkdir -p ./dist-migrations/db
mkdir -p ./dist-migrations/models
mkdir -p ./dist-migrations/db/seeders
mkdir -p ./dist-migrations/db/migrations
./node_modules/.bin/tsc -t es2017 -module CommonJS -outDir ./dist-migrations/config ./src/config/database.ts

for filename in ./src/db/migrations/*.ts; do
    ./node_modules/.bin/tsc -t es2017 -module CommonJS -outDir ./dist-migrations/db/migrations $filename
done
echo ""
echo " -> Compilation completed."
echo ""

echo ""
echo " -> Step 2/2: Copying resources required for migration."
cp .env ./dist-migrations/.env
cp -rf ./src/db/dump ./dist-migrations/db/
echo ""
echo " -> Copying resources completed."
echo ""

echo " -> build completed."