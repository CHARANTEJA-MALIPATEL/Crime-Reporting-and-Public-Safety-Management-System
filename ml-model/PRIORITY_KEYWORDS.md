# 🎯 Priority Keywords for Classification

This document shows which keywords are checked FIRST with highest priority.

---

## ⚡ PRIORITY KEYWORDS (Checked First)

These keywords are checked BEFORE all others and have the highest priority:

### 1. 💳 Credit Card → Fraud
**Priority: HIGHEST**

Keywords:
- `credit card` ✅
- `creditcard` ✅
- `debit card` ✅

**Examples:**
- "My credit card was stolen" → **Fraud** ✅
- "Someone used my credit card" → **Fraud** ✅
- "Credit card fraud" → **Fraud** ✅
- "Debit card scam" → **Fraud** ✅

---

### 2. 🔓 Stolen → Theft
**Priority: HIGH**

Keywords:
- `stolen` ✅
- `stole` ✅

**Examples:**
- "My bike was stolen" → **Theft** ✅
- "Someone stole my phone" → **Theft** ✅

**Note:** If description contains BOTH "credit card" AND "stolen", it will classify as **Fraud** (credit card has higher priority)

---

## 📋 Full Priority Order

The system checks keywords in this order:

```
1. credit card / debit card     → Fraud
2. stolen / stole               → Theft
3. Other keywords...            → Various categories
```

---

## 🧪 Testing

### Test Credit Card Classification:
```bash
cd ml-model
python test_credit_card.py
```

### Test Stolen Classification:
```bash
cd ml-model
python test_stolen_classification.py
```

---

## 📝 Examples with Priority

| Description | Priority Match | Classification |
|-------------|---------------|----------------|
| "Credit card stolen" | credit card (1st) | **Fraud** ✅ |
| "My bike was stolen" | stolen (2nd) | **Theft** ✅ |
| "Someone stole my credit card" | credit card (1st) | **Fraud** ✅ |
| "Laptop stolen from office" | stolen (2nd) | **Theft** ✅ |
| "Credit card fraud" | credit card (1st) | **Fraud** ✅ |

---

## 🔧 How It Works

### Rule-Based Classification:
```python
# Priority 1: Credit card fraud
if 'credit card' in description:
    return "Fraud"

# Priority 2: Theft
if 'stolen' in description:
    return "Theft"

# Other keywords...
```

### Gemini AI Classification:
The AI is instructed to follow the same priority order:
1. Credit card → Fraud
2. Stolen → Theft
3. Other rules...

---

## ✅ Verification

After starting the service, verify it's working:

```bash
# Test credit card
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d "{\"description\": \"My credit card was stolen\"}"

# Expected: {"category": "Fraud"}
```

```bash
# Test stolen
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d "{\"description\": \"My bike was stolen\"}"

# Expected: {"category": "Theft"}
```

---

## 📚 All Crime Categories

1. **Fraud** (Priority: credit card)
2. **Theft** (Priority: stolen)
3. Burglary
4. Robbery
5. Assault
6. Harassment
7. Cybercrime
8. Vandalism
9. Drug-related
10. Domestic Violence
11. Sexual Offense
12. Murder/Homicide
13. Kidnapping
14. Arson
15. Traffic Violation
16. Public Disturbance
17. Trespassing
18. Other

---

## 🎯 Summary

**Priority Keywords:**
- ✅ "credit card" → Fraud (HIGHEST)
- ✅ "stolen" → Theft (HIGH)

**Testing:**
- `python test_credit_card.py` - Test fraud detection
- `python test_stolen_classification.py` - Test theft detection

**Both work together:**
- Credit card is checked first
- Then stolen is checked
- Then other keywords

All priority keywords work correctly! 🎉
