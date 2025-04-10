#!/usr/bin/env python3
"""
Google Cloud Authentication Test Script

This script tests if your Google Cloud authentication is properly configured
for use with the DarkChat Fusion application.
"""

import sys
import traceback

def test_google_auth():
    """Test Google Cloud authentication by trying to initialize clients."""
    results = {
        "overall_status": "FAILED",
        "tests": {}
    }
    
    # Test 1: Basic Google Auth
    print("Test 1: Importing Google libraries...")
    try:
        import google.auth
        results["tests"]["import_google_auth"] = "PASSED"
        print("✅ Successfully imported Google Auth libraries")
    except Exception as e:
        results["tests"]["import_google_auth"] = f"FAILED: {str(e)}"
        print(f"❌ Failed to import Google Auth libraries: {str(e)}")
        return results
    
    # Test 2: Default credentials
    print("\nTest 2: Checking default credentials...")
    try:
        credentials, project_id = google.auth.default()
        if credentials and project_id:
            results["tests"]["default_credentials"] = "PASSED"
            print(f"✅ Successfully loaded default credentials for project: {project_id}")
        else:
            results["tests"]["default_credentials"] = "FAILED: No credentials or project found"
            print("❌ Failed to load default credentials or project ID")
            return results
    except Exception as e:
        results["tests"]["default_credentials"] = f"FAILED: {str(e)}"
        print(f"❌ Failed to load default credentials: {str(e)}")
        return results
    
    # Test 3: Import Vertex AI
    print("\nTest 3: Importing Vertex AI libraries...")
    try:
        from google import genai
        results["tests"]["import_genai"] = "PASSED"
        print("✅ Successfully imported Generative AI libraries")
    except Exception as e:
        results["tests"]["import_genai"] = f"FAILED: {str(e)}"
        print(f"❌ Failed to import Generative AI libraries: {str(e)}")
        return results
    
    # Test 4: Initialize Vertex AI client
    print("\nTest 4: Initializing Generative AI client...")
    try:
        client = genai.Client(
            vertexai=True,
            project=project_id,
            location="us-central1",
        )
        results["tests"]["initialize_client"] = "PASSED"
        print(f"✅ Successfully initialized Generative AI client")
    except Exception as e:
        results["tests"]["initialize_client"] = f"FAILED: {str(e)}"
        print(f"❌ Failed to initialize Generative AI client: {str(e)}")
        traceback_str = traceback.format_exc()
        print(f"\nError details:\n{traceback_str}")
        return results
    
    # Test 5: Simple model access
    print("\nTest 5: Testing model access...")
    try:
        from google.genai import types
        response = client.models.generate_content(
            model="gemini-2.0-flash-001",
            contents=[types.Content(
                role="user",
                parts=[types.Part.from_text(text="Hello, respond with a single word for testing.")]
            )],
            generation_config=types.GenerationConfig(
                max_output_tokens=10,
                temperature=0
            )
        )
        
        if response and hasattr(response, 'text'):
            results["tests"]["model_access"] = "PASSED"
            print(f"✅ Successfully accessed model and got response: {response.text}")
        else:
            results["tests"]["model_access"] = "FAILED: No response from model"
            print("❌ Failed to get response from model")
            return results
    except Exception as e:
        results["tests"]["model_access"] = f"FAILED: {str(e)}"
        print(f"❌ Failed to access model: {str(e)}")
        traceback_str = traceback.format_exc()
        print(f"\nError details:\n{traceback_str}")
        return results
    
    # All tests passed
    results["overall_status"] = "PASSED"
    return results

if __name__ == "__main__":
    print("========================================")
    print("Google Cloud Authentication Test Script")
    print("========================================\n")
    
    results = test_google_auth()
    
    print("\n========================================")
    if results["overall_status"] == "PASSED":
        print("✅ ALL TESTS PASSED!")
        print("Your Google Cloud authentication is configured correctly.")
        print("You should be able to run the backend API successfully.")
    else:
        print("❌ TESTS FAILED")
        print("Your Google Cloud authentication has issues that need to be resolved.")
        print("Please check the error messages above and refer to TROUBLESHOOTING.md")
        
    print("========================================")
    sys.exit(0 if results["overall_status"] == "PASSED" else 1) 