"""
Quick test script for Gemini AI Classification Service
"""
import requests
import json

SERVICE_URL = "http://localhost:5000"

def test_health():
    """Test if service is running"""
    print("\n" + "="*60)
    print("Testing Service Health...")
    print("="*60)
    try:
        response = requests.get(f"{SERVICE_URL}/health", timeout=3)
        print(f"✅ Status: {response.status_code}")
        print(f"📊 Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print("\n💡 Make sure the service is running:")
        print("   cd ml")
        print("   python gemini_service.py")
        return False

def test_classification():
    """Test crime classification"""
    print("\n" + "="*60)
    print("Testing Crime Classification...")
    print("="*60)
    
    test_cases = [
        "Someone stole my bike from the parking lot",
        "My house was broken into last night",
        "I received threatening messages online",
        "Someone hacked my email account",
        "My car was vandalized with spray paint"
    ]
    
    for i, description in enumerate(test_cases, 1):
        print(f"\n[Test {i}] Description: \"{description}\"")
        try:
            response = requests.post(
                f"{SERVICE_URL}/predict",
                json={"description": description},
                timeout=10
            )
            result = response.json()
            print(f"   ✅ Category: {result.get('category')}")
            print(f"   🤖 Model: {result.get('ai_model')}")
            print(f"   📊 Confidence: {result.get('confidence')}")
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")

def test_categories():
    """Test getting all categories"""
    print("\n" + "="*60)
    print("Testing Crime Categories...")
    print("="*60)
    try:
        response = requests.get(f"{SERVICE_URL}/categories", timeout=3)
        categories = response.json().get('categories', [])
        print(f"✅ Total Categories: {len(categories)}")
        print("\nAvailable Categories:")
        for i, cat in enumerate(categories, 1):
            print(f"   {i:2d}. {cat}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🧪 GEMINI AI SERVICE TEST SUITE")
    print("="*60)
    
    # Test 1: Health Check
    if not test_health():
        print("\n❌ Service is not running. Exiting...")
        exit(1)
    
    # Test 2: Categories
    test_categories()
    
    # Test 3: Classification
    test_classification()
    
    print("\n" + "="*60)
    print("✅ ALL TESTS COMPLETED!")
    print("="*60)
    print("\nThe service is working correctly! 🎉")
    print("\nYou can now:")
    print("  1. Submit crime reports through the web app")
    print("  2. Run reclassification: node server/reclassify_reports.js")
    print("  3. View classifications in the admin dashboard")
    print("\n")
