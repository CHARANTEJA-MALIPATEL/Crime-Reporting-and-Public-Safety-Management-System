"""
Test script to verify "credit card" keyword always classifies as "Fraud"
"""
import requests
import json

SERVICE_URL = "http://localhost:5000"

def test_credit_card_classification():
    """Test various descriptions with 'credit card' keyword"""
    print("\n" + "="*70)
    print("🧪 TESTING 'CREDIT CARD' KEYWORD CLASSIFICATION")
    print("="*70)
    
    test_cases = [
        "My credit card was stolen",
        "Someone used my credit card without permission",
        "Credit card fraud detected",
        "Unauthorized credit card charges",
        "Lost my credit card and someone used it",
        "Credit card information was stolen",
        "Debit card fraud",
        "Someone cloned my credit card",
        "Credit card scam",
        "Fake credit card charges"
    ]
    
    print("\n✅ All these should classify as 'Fraud':\n")
    
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
            
            # Check if classified as Fraud
            is_correct = category == "Fraud"
            status = "✅" if is_correct else "❌"
            
            print(f"{status} [{i:2d}] \"{description}\"")
            print(f"      → {category} ({model})")
            
            if not is_correct:
                all_correct = False
                print(f"      ⚠️  EXPECTED: Fraud, GOT: {category}")
            
            print()
            
        except Exception as e:
            print(f"❌ [{i:2d}] Error: {str(e)}\n")
            all_correct = False
    
    print("="*70)
    if all_correct:
        print("✅ SUCCESS! All 'credit card' cases classified as 'Fraud'")
    else:
        print("❌ FAILED! Some cases were not classified as 'Fraud'")
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
    print("   cd ml-model")
    print("   python predict.py\n")
    return False

if __name__ == "__main__":
    print("\n" + "="*70)
    print("🎯 CREDIT CARD FRAUD CLASSIFICATION TEST")
    print("="*70)
    print("\nThis test verifies that any description containing 'credit card'")
    print("is always classified as 'Fraud'\n")
    
    # Check service health
    if not test_service_health():
        exit(1)
    
    # Run the test
    success = test_credit_card_classification()
    
    if success:
        print("🎉 All tests passed! Credit card fraud detection is working.")
        print("\nYou can now:")
        print("  1. Submit reports with 'credit card' keyword")
        print("  2. They will automatically classify as 'Fraud'")
        print("  3. Run reclassification to fix existing reports")
        print("\n")
        exit(0)
    else:
        print("⚠️  Some tests failed. Please check the service logs.")
        exit(1)
