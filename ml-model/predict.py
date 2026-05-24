from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('../server/.env')

app = Flask(__name__)
CORS(app)

# Try to import and configure Gemini
GEMINI_CONFIGURED = False
genai = None

try:
    import google.generativeai as genai
    
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        GEMINI_CONFIGURED = True
        print("✅ Gemini API: Configured")
    else:
        print("⚠️  Warning: GEMINI_API_KEY not found in .env file")
except ImportError:
    print("⚠️  Warning: google-generativeai not installed")
    print("   Install with: pip install google-generativeai")

# Crime categories
CRIME_CATEGORIES = [
    "Theft", "Burglary", "Robbery", "Assault", "Harassment",
    "Cybercrime", "Fraud", "Vandalism", "Drug-related",
    "Domestic Violence", "Sexual Offense", "Murder/Homicide",
    "Kidnapping", "Arson", "Traffic Violation", "Public Disturbance",
    "Trespassing", "Other"
]

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "service": "SafeCity Crime Classification Service",
        "version": "2.0",
        "ai_model": "Gemini 2.0 Flash" if GEMINI_CONFIGURED else "Rule-based Fallback",
        "status": "online",
        "gemini_configured": GEMINI_CONFIGURED,
        "categories": len(CRIME_CATEGORIES)
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "gemini_configured": GEMINI_CONFIGURED,
        "service": "gemini_crime_classifier"
    })

@app.route('/categories', methods=['GET'])
def get_categories():
    return jsonify({"categories": CRIME_CATEGORIES})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    description = data.get('description', '').strip()
    
    if not description:
        return jsonify({"error": "Description is required"}), 400
    
    # Try Gemini AI first
    if GEMINI_CONFIGURED:
        try:
            category = classify_with_gemini(description)
            return jsonify({
                "category": category,
                "confidence": "high",
                "ai_model": "Gemini 2.0 Flash"
            })
        except Exception as e:
            print(f"Gemini error: {str(e)}")
            # Fall back to rule-based
    
    # Fallback to rule-based classification
    category = classify_rule_based(description)
    return jsonify({
        "category": category,
        "confidence": "medium",
        "ai_model": "Rule-based Classifier"
    })

def classify_with_gemini(description):
    """Classify using Gemini AI"""
    try:
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        prompt = f"""You are a crime classification expert. Classify the following crime report into ONE of these categories:

{', '.join(CRIME_CATEGORIES)}

IMPORTANT RULES (Priority Order):
1. If the description contains "credit card", "debit card", or "card fraud" → classify as "Fraud"
2. If the description contains "stolen", "stole", or "steal" → classify as "Theft"
3. If it mentions breaking into a building/house → classify as "Burglary"
4. If it involves force or threat during theft → classify as "Robbery"
5. Choose the MOST SPECIFIC category that fits

Crime Report: "{description}"

Respond with ONLY the category name from the list above, nothing else."""

        response = model.generate_content(prompt)
        category = response.text.strip()
        
        # Validate the category
        if category in CRIME_CATEGORIES:
            return category
        
        # Try to find a close match
        for cat in CRIME_CATEGORIES:
            if cat.lower() in category.lower():
                return cat
        
        return "Other"
        
    except Exception as e:
        print(f"Gemini classification error: {str(e)}")
        raise

def classify_rule_based(description):
    """Simple rule-based classification as fallback"""
    desc_lower = description.lower()
    
    # PRIORITY CHECKS (checked first)
    
    # Priority 1: Credit card fraud
    if 'credit card' in desc_lower or 'creditcard' in desc_lower or 'debit card' in desc_lower:
        return "Fraud"
    
    # Priority 2: Theft keywords
    if 'stolen' in desc_lower or 'stole' in desc_lower:
        return "Theft"
    
    # Other theft-related keywords
    if any(word in desc_lower for word in ['theft', 'took', 'missing', 'lost', 'steal', 'thief', 'pickpocket']):
        return "Theft"
    
    # Burglary keywords
    if any(word in desc_lower for word in ['broke in', 'break-in', 'burglary', 'burglar', 'entered', 'forced entry']):
        return "Burglary"
    
    # Robbery keywords
    if any(word in desc_lower for word in ['robbed', 'robbery', 'mugged', 'gunpoint', 'knifepoint']):
        return "Robbery"
    
    # Assault keywords
    if any(word in desc_lower for word in ['assault', 'attacked', 'hit', 'beat', 'punched', 'kicked', 'fight']):
        return "Assault"
    
    # Harassment keywords
    if any(word in desc_lower for word in ['harass', 'stalking', 'threatening', 'intimidat', 'bully']):
        return "Harassment"
    
    # Cybercrime keywords
    if any(word in desc_lower for word in ['hack', 'cyber', 'online', 'email', 'phishing', 'scam', 'internet', 'website']):
        return "Cybercrime"
    
    # Fraud keywords (general)
    if any(word in desc_lower for word in ['fraud', 'scam', 'cheat', 'fake', 'counterfeit', 'forgery', 'card fraud', 'bank fraud']):
        return "Fraud"
    
    # Vandalism keywords
    if any(word in desc_lower for word in ['vandal', 'damage', 'graffiti', 'destroyed', 'smashed']):
        return "Vandalism"
    
    # Drug-related keywords
    if any(word in desc_lower for word in ['drug', 'narcotic', 'marijuana', 'cocaine', 'heroin', 'meth']):
        return "Drug-related"
    
    # Domestic Violence keywords
    if any(word in desc_lower for word in ['domestic', 'spouse', 'partner', 'family violence']):
        return "Domestic Violence"
    
    # Sexual Offense keywords
    if any(word in desc_lower for word in ['sexual', 'rape', 'molest', 'abuse']):
        return "Sexual Offense"
    
    # Murder keywords
    if any(word in desc_lower for word in ['murder', 'killed', 'homicide', 'dead', 'death']):
        return "Murder/Homicide"
    
    # Kidnapping keywords
    if any(word in desc_lower for word in ['kidnap', 'abduct', 'missing person']):
        return "Kidnapping"
    
    # Arson keywords
    if any(word in desc_lower for word in ['arson', 'fire', 'burned', 'set fire']):
        return "Arson"
    
    # Traffic keywords
    if any(word in desc_lower for word in ['traffic', 'accident', 'driving', 'vehicle', 'car crash']):
        return "Traffic Violation"
    
    # Public Disturbance keywords
    if any(word in desc_lower for word in ['noise', 'disturbance', 'loud', 'party', 'public']):
        return "Public Disturbance"
    
    # Trespassing keywords
    if any(word in desc_lower for word in ['trespass', 'unauthorized', 'private property']):
        return "Trespassing"
    
    return "Other"

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 SafeCity Crime Classification Service")
    print("="*60)
    print(f"🤖 AI Model: {'Gemini 2.0 Flash' if GEMINI_CONFIGURED else 'Rule-based Fallback'}")
    print(f"📊 Categories: {len(CRIME_CATEGORIES)}")
    print(f"🌐 Server: http://localhost:5000")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=False)
