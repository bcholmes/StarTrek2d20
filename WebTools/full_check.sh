npm test -- --coverage &&
  npm run typecheck &&
  npm run lint &&
  npm run prettier:check &&
  echo "passed" || echo "failed"

# If you see repeated/confusing test failures,
# rm -rf node_modules && npm install
