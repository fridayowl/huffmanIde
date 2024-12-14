#!/bin/bash

# Create a secure credentials directory if it doesn't exist
mkdir -p ~/.config/apple-signing
chmod 700 ~/.config/apple-signing

# Create the credentials file with restricted permissions
touch ~/.config/apple-signing/credentials.sh
chmod 600 ~/.config/apple-signing/credentials.sh

# Template for credentials file
cat << 'EOF' > ~/.config/apple-signing/credentials.sh
# Apple ID Credentials for App Notarization
export APPLE_ID="wenergie.ecoworks@gmail.com"
export APPLE_PASSWORD="dlxv-mqzm-fwgv-uvhr"
export APPLE_TEAM_ID="7DYCNUWT79"
EOF

# Create a convenience script to load credentials
cat << 'EOF' > ~/.config/apple-signing/load-credentials.sh
#!/bin/bash
source ~/.config/apple-signing/credentials.sh
echo "Apple signing credentials loaded into environment"
EOF

chmod 700 ~/.config/apple-signing/load-credentials.sh

# Add to .gitignore if in a git repository
if [ -d .git ] || [ -f .git ]; then
    echo ".config/apple-signing/" >> .gitignore
fi