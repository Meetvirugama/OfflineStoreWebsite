#!/bin/bash

BASE_URL="http://localhost:5001/api"

echo "🌦️ TESTING WEATHER INTELLIGENCE SYSTEM APIs"
echo "=========================================="

# 1. TEST CURRENT WEATHER (Rajkot Coordinates)
echo -e "\n1. Current Weather & Insights (Rajkot)"
curl -s "${BASE_URL}/weather/current?lat=22.3072&lon=70.8022" | jq

# 2. TEST CITY SEARCH
echo -e "\n2. Searching for 'Ahmedabad'"
curl -s "${BASE_URL}/weather/by-city?name=Ahmedabad" | jq

# 3. TEST IP-BASED FALLBACK (No Params)
echo -e "\n3. Testing IP-based detection (Fallback to Rajkot on Localhost)"
curl -s "${BASE_URL}/weather/current" | jq

echo -e "\n=========================================="
echo "✅ Backend API testing complete."
