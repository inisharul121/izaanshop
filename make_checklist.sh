#!/bin/bash

# Configuration
PROJECT_ROOT=$(pwd)
PRODUCTION_FOLDER="$PROJECT_ROOT/izaan_monolith"
CHECKLIST_FILE="$PROJECT_ROOT/DEPLOYMENT_CHECKLIST.md"

echo "# 📋 Development Sync Checklist" > "$CHECKLIST_FILE"
echo "Generated on: $(date)" >> "$CHECKLIST_FILE"
echo "" >> "$CHECKLIST_FILE"
echo "> [!NOTE]" >> "$CHECKLIST_FILE"
echo "> This file lists all differences between your CURRENT code and your last CPANEL version ($PRODUCTION_FOLDER)." >> "$CHECKLIST_FILE"
echo "" >> "$CHECKLIST_FILE"

# Function to process diff output
generate_section() {
    local dir=$1
    local title=$2
    
    echo "### $title" >> "$CHECKLIST_FILE"
    
    # Get diffs, ignore node_modules and .next
    diff -rq "$dir" "$PRODUCTION_FOLDER/$dir" 2>/dev/null | grep -v "node_modules\|.next\|.DS_Store" | while read -r line; do
        if [[ $line == Files*differ ]]; then
            # Format: Files backend/server.js and izaan_monolith/backend/server.js differ
            file=$(echo "$line" | cut -d' ' -f2)
            echo "- [ ] 📝 **MODIFIED**: \`$file\`" >> "$CHECKLIST_FILE"
        elif [[ $line == Only\ in\ $dir* ]]; then
            # Format: Only in backend/controllers: newFile.js
            path=$(echo "$line" | cut -d' ' -f3 | sed 's/://')
            file=$(echo "$line" | cut -d' ' -f4)
            echo "- [ ] ✨ **NEW**: \`$path/$file\`" >> "$CHECKLIST_FILE"
        fi
    done
    echo "" >> "$CHECKLIST_FILE"
}

# Generate sections
generate_section "backend" "🛠️ Backend Changes"
generate_section "next-frontend" "💻 Frontend Changes"

echo "### ✅ Database Check" >> "$CHECKLIST_FILE"
echo "- [ ] Run \`npx prisma@6.2.1 migrate diff --from-schema-datamodel cpannelPrisma/schema.prisma --to-schema-datamodel backend/prisma/schema.prisma --script\`" >> "$CHECKLIST_FILE"
echo "- [ ] Apply generated SQL to cPanel phpMyAdmin." >> "$CHECKLIST_FILE"
echo "- [ ] Copy \`backend/prisma/schema.prisma\` to \`cpannelPrisma/schema.prisma\` (to mark as synced)." >> "$CHECKLIST_FILE"

echo "---" >> "$CHECKLIST_FILE"
echo "🚀 *Tip: After uploading files, remember to RESTART the Node.js app on cPanel.*" >> "$CHECKLIST_FILE"
