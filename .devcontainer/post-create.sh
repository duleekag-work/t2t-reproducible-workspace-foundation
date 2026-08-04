#!/usr/bin/env bash
# Runs once, after the container is created. This is what makes
# "clone and run" true instead of aspirational.
set -euo pipefail

if [ ! -f .env ]; then
  echo "No .env found - creating one from the committed template."
  cp .env.example .env
fi

echo "Installing server dependencies..."
npm --prefix src/server install

echo "Installing client dependencies..."
npm --prefix src/client install

echo
echo "Ready. Next steps:"
echo "  npm --prefix src/server run seed   # load sample data into MongoDB"
echo "  npm --prefix src/server run dev    # API on http://localhost:4000"
echo "  npm --prefix src/client run dev    # Web on http://localhost:5173"
