set -e

# Start timer
start_time=$(date +%s)

# pre clean up + setup
rm -rf tmp-build
mkdir -p tmp-build
cp pnpm-lock.yaml package.json tmp-build
cd tmp-build
mkdir -p layer/nodejs

# build
# pnpm install --frozen-lockfile --prod --ignore-scripts
pnpm install --frozen-lockfile --prod --ignore-scripts --shamefully-hoist

mv node_modules layer/nodejs
cd layer
zip -qr layer.zip .
cd ..

# post clean up
mv layer/layer.zip layer.zip
rm -rf layer pnpm-lock.yaml package.json

# Finish timer
end_time=$(date +%s)

# Calculate elapsed time
elapsed_time=$(( end_time - start_time ))

# Display start, finish, and elapsed time
echo "Start Time: $(date -d @$start_time)"
echo "Finish Time: $(date -d @$end_time)"
echo "Elapsed Time: $elapsed_time seconds"