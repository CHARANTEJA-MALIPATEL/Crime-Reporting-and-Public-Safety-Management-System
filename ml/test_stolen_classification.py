"""
Test script to verify "stolen" keyword always classifies as "Theft"
"""
import requests
import json

SERVICE_URL = "http://localhost:5000"

def test_stolen_classification():
    """Test various descriptions with 'stolen' keyword"""
    print("\n" + "="*70)
    print("🧪 TESTING 'STOLEN' KEYWORD CLASSIFICATION")
    print("="*70)
    
    test_cases = [
        "My bike was stolen",
        "Someone stole my phone",
        "Laptop stolen from office",
        "My wallet got stolen yesterday",
        "Stolen car from parking lot",
        "Mobile phone stolen",
        "Watch stolen from my house",
        "Someone stole my bag",
        "Credit card stolen",
        "Jewelry stolen during party"
    ]
    
    print("\n✅ All these should classify as 'Theft':\n")
    
    all_correct = True
    
    for i, description in enumerate(test_cases, 1):
        try:
            response = requests.post(
                f"{SERVICE_URL}/predict",
                json={"description": description},
                timeout=10
            )
            result = response.json()
            category = result.get('category')
            model = result.get('ai_model', 'Unknown')
            
            # Check if classified as Theft
            is_correct = category == "Theft"
            status = "✅" if is_correct else "❌"
            
            print(f"{status} [{i:2d}] \"{description}\"")
            print(f"      → {category} ({model})")
            
            if not is_correct:
                all_correct = False
                print(f"      ⚠️  EXPECTED: Theft, GOT: {category}")
            
            print()
            
        except Exception as e:
            print(f"❌ [{i:2d}] Error: {str(e)}\n")
            all_correct = False
    
    print("="*70)
    if all_correct:
        print("✅ SUCCESS! All 'stolen' cases classified as 'Theft'")
    else:
        print("❌ FAILED! Some cases were not classified as 'Theft'")
    print("="*70 + "\n")
    
    return all_correct

def test_service_health():
    """Check if service is running"""
    try:
        response = requests.get(f"{SERVICE_URL}/health", timeout=3)
        if response.status_code == 200:
            print("✅ Service is running\n")
            return True
    except:
        pass
    
    print("❌ Service is NOT running!")
    print("\n💡 Start the service first:")
    print("   cd ml")
    print("   python gemini_service.py\n")
    return False

if __name__ == "__main__":
    print("\n" + "="*70)
    print("🎯 STOLEN KEYWORD CLASSIFICATION TEST")
    print("="*70)
    print("\nThis test verifies that any description containing 'stolen'")
    print("is always classified as 'Theft'\n")
    
    # Check service health
    if not test_service_health():
        exit(1)
    
    # Run the test
    success = test_stolen_classification()
    
    if success:
        print("🎉 All tests passed! The classification is working correctly.")
        print("\nYou can now:")
        print("  1. Submit reports with 'stolen' keyword")
        print("  2. They will automatically classify as 'Theft'")
        print("  3. Run reclassification to fix existing reports")
        print("\n")
        exit(0)
    else:
        print("⚠️  Some tests failed. Please check the service logs.")
        exit(1)
