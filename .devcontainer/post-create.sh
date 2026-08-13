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

echo "Installing documentation and hook toolchain..."
pip install --quiet --no-input mkdocs-material pre-commit

echo
echo "Ready. Next steps:"
echo "  npm --prefix src/server run seed   # load sample data into MongoDB"
echo "  npm --prefix src/server run dev    # API on http://localhost:4000"
echo "  npm --prefix src/client run dev    # Web on http://localhost:5173"
echo "  mkdocs serve -a 0.0.0.0:8888       # Docs on http://localhost:8888"
