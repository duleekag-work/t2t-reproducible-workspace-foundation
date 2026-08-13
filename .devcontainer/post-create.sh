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

if ! command -v act >/dev/null 2>&1; then
  echo "Installing act..."
  case "$(uname -m)" in
    x86_64)        act_arch=x86_64 ;;
    aarch64|arm64) act_arch=arm64 ;;
    *)             act_arch="" ;;
  esac

  if [ -z "$act_arch" ]; then
    echo "  Unsupported architecture $(uname -m) - see docs/how-to/run-the-gates.md."
  elif curl -fsSL "https://github.com/nektos/act/releases/latest/download/act_Linux_${act_arch}.tar.gz" \
       | sudo tar -xz -C /usr/local/bin act; then
    # Pinning the image here means act never stops to ask which size to download.
    mkdir -p "$HOME/.config/act"
    echo '-P ubuntu-latest=catthehacker/ubuntu:act-latest' > "$HOME/.config/act/actrc"
  else
    echo "  Could not download act - see docs/how-to/run-the-gates.md to add it later."
  fi
fi

echo
echo "Ready. Next steps:"
echo "  npm --prefix src/server run seed   # load sample data into MongoDB"
echo "  npm --prefix src/server run dev    # API on http://localhost:4000"
echo "  npm --prefix src/client run dev    # Web on http://localhost:5173"
echo "  mkdocs serve -a 0.0.0.0:8888       # Docs on http://localhost:8888"
