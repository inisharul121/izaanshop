#!/bin/bash

# Target URL (Default to local if not provided)
URL=${1:-"http://localhost:3000"}

echo "🚀 Testing performance for: $URL"
echo "--------------------------------"

curl -w "@curl-format.txt" -o /dev/null -s "$URL"

echo ""
echo "📊 Results breakdown:"
echo "- namelookup:    DNS resolution time"
echo "- connect:       TCP connection time"
echo "- appconnect:    SSL/TLS handshake time"
echo "- pretransfer:   Time to start of request"
echo "- starttransfer: TTFB (Time to First Byte)"
echo "- total:         Total round trip time"
