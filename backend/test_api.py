#!/usr/bin/env python3
"""
Simple test script to verify the API is working
"""

import requests
import json
import sys

# The VM's API endpoint
API_URL = "http://34.45.129.121:8000/api/chat"
HEALTH_URL = "http://34.45.129.121:8000/"
TEST_AUTH_URL = "http://34.45.129.121:8000/test-auth"
SIMPLIFIED_CHAT_URL = "http://34.45.129.121:8000/simplified-chat"

def test_health():
    print("\n===== Testing Health Endpoint =====")
    try:
        response = requests.get(HEALTH_URL)
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_auth():
    print("\n===== Testing Auth Endpoint =====")
    try:
        response = requests.get(TEST_AUTH_URL)
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_simplified_chat():
    print("\n===== Testing Simplified Chat Endpoint =====")
    try:
        message = "Hello, how are you?"
        response = requests.get(f"{SIMPLIFIED_CHAT_URL}?message={message}")
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_chat_api():
    print("\n===== Testing Chat API Endpoint =====")
    try:
        headers = {
            "Content-Type": "application/json"
        }
        data = {
            "messages": [
                {
                    "role": "user",
                    "content": "Hello, how are you today?"
                }
            ]
        }
        
        print(f"Request payload: {json.dumps(data)}")
        response = requests.post(API_URL, headers=headers, json=data)
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    print("Running API tests...")
    
    health_ok = test_health()
    auth_ok = test_auth()
    simplified_chat_ok = test_simplified_chat()
    chat_api_ok = test_chat_api()
    
    print("\n===== Test Results =====")
    print(f"Health endpoint: {'✅ PASSED' if health_ok else '❌ FAILED'}")
    print(f"Auth endpoint: {'✅ PASSED' if auth_ok else '❌ FAILED'}")
    print(f"Simplified chat: {'✅ PASSED' if simplified_chat_ok else '❌ FAILED'}")
    print(f"Chat API: {'✅ PASSED' if chat_api_ok else '❌ FAILED'}")
    
    if not (health_ok and auth_ok and simplified_chat_ok and chat_api_ok):
        print("\nSome tests failed. Please check the API.")
        sys.exit(1)
    else:
        print("\nAll tests passed! The API is working correctly.")
        sys.exit(0) 