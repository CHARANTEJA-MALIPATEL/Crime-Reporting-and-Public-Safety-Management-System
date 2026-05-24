"""
Verification script to check ML model and backend integration
"""
import requests
import time
import sys

def check_ml_service():
    """Check if ML service is running"""
    print("\n1. Checking ML Service (Port 5000)...")
    print("-" * 60)
    try:
        response = requests.get("http://localhost:5000/health", timeout=3)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ ML Service is RUNNING")
            print(f"   Status: {data.get('status', 'unknown')}")
            print(f"   Model Loaded: {data.get('model_loaded', False)}")
            return True
        else:
            print(f"   ❌ ML Service returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("   ❌ ML Service is NOT RUNNING")
        print("   Start it with: cd ml-model && python predict.py")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def check_backend():
    """Check if backend is running"""
    print("\n2. Checking Backend Server (Port 3000)...")
    print("-" * 60)
    try:
        response = requests.get("http://localhost:3000", timeout=3)
        if response.status_code == 200:
            print("   ✅ Backend Server is RUNNING")
            return True
        else:
            print(f"   ⚠️  Backend returned status {response.status_code}")
            return True  # Still running, just different status
    except requests.exceptions.ConnectionError:
        print("   ❌ Backend Server is NOT RUNNING")
        print("   Start it with: cd server && npm start")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_ml_classification():
    """Test ML classification with sample data"""
    print("\n3. Testing ML Classification...")
    print("-" * 60)
    
    test_cases = [
        "Someone stole my bike from the parking lot",
        "My house was broken into last night",
        "I was assaulted on the street"
    ]
    
    success_count = 0
    for i, description in enumerate(test_cases, 1):
        print(f"\n   Test {i}: \"{description}\"")
        try:
            response = requests.post(
                "http://localhost:5000/predict",
                json={"description": description},
                timeout=5
            )
            if response.status_code == 200:
                data = response.json()
                category = data.get('category', 'N/A')
                confidence = data.get('confidence', 'N/A')
                print(f"   ✅ Classified as: {category} (confidence: {confidence})")
                success_count += 1
            else:
                print(f"   ❌ Failed with status {response.status_code}")
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print(f"\n   Results: {success_count}/{len(test_cases)} successful")
    return success_count == len(test_cases)

def check_backend_ml_integration():
    """Check if backend can connect to ML service"""
    print("\n4. Checking Backend-ML Integration...")
    print("-" * 60)
    try:
        response = requests.get("http://localhost:3000/api/ml/status", timeout=3)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Backend can connect to ML service")
            print(f"   Status: {data.get('status', 'unknown')}")
            return True
        else:
            print(f"   ⚠️  Backend ML route returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    print("\n" + "="*60)
    print("   CRIME REPORTING SYSTEM - INTEGRATION VERIFICATION")
    print("="*60)
    
    results = {
        "ml_service": False,
        "backend": False,
        "classification": False,
        "integration": False
    }
    
    # Check ML Service
    results["ml_service"] = check_ml_service()
    time.sleep(1)
    
    # Check Backend
    results["backend"] = check_backend()
    time.sleep(1)
    
    # Test Classification (only if ML service is running)
    if results["ml_service"]:
        results["classification"] = test_ml_classification()
        time.sleep(1)
    else:
        print("\n3. Testing ML Classification...")
        print("-" * 60)
        print("   ⏭️  Skipped (ML service not running)")
    
    # Check Integration (only if both services are running)
    if results["ml_service"] and results["backend"]:
        results["integration"] = check_backend_ml_integration()
    else:
        print("\n4. Checking Backend-ML Integration...")
        print("-" * 60)
        print("   ⏭️  Skipped (services not running)")
    
    # Summary
    print("\n" + "="*60)
    print("   VERIFICATION SUMMARY")
    print("="*60)
    print(f"\n   ML Service:           {'✅ PASS' if results['ml_service'] else '❌ FAIL'}")
    print(f"   Backend Server:       {'✅ PASS' if results['backend'] else '❌ FAIL'}")
    print(f"   ML Classification:    {'✅ PASS' if results['classification'] else '❌ FAIL' if results['ml_service'] else '⏭️  SKIP'}")
    print(f"   Backend Integration:  {'✅ PASS' if results['integration'] else '❌ FAIL' if (results['ml_service'] and results['backend']) else '⏭️  SKIP'}")
    
    all_pass = all([
        results["ml_service"],
        results["backend"],
        results["classification"],
        results["integration"]
    ])
    
    print("\n" + "="*60)
    if all_pass:
        print("   🎉 ALL CHECKS PASSED!")
        print("   Your system is ready to use!")
        print("\n   Next steps:")
        print("   1. Open browser: http://localhost:3000")
        print("   2. Register/Login")
        print("   3. Submit a crime report")
        print("   4. Verify automatic classification")
    else:
        print("   ⚠️  SOME CHECKS FAILED")
        print("\n   Troubleshooting:")
        if not results["ml_service"]:
            print("   - Start ML service: cd ml-model && python predict.py")
        if not results["backend"]:
            print("   - Start backend: cd server && npm start")
        if not results["classification"] and results["ml_service"]:
            print("   - Check ML service logs for errors")
        if not results["integration"] and results["ml_service"] and results["backend"]:
            print("   - Check backend can reach http://localhost:5000")
    print("="*60 + "\n")
    
    return 0 if all_pass else 1

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\n⚠️  Verification interrupted by user")
        sys.exit(1)
