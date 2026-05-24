# 🔍 Crime Classification Keywords

This document shows which keywords trigger which crime categories.

---

## 🔓 Theft
**Priority Keywords** (checked first):
- `stolen` ✅
- `stole` ✅

**Other Keywords:**
- theft
- took
- missing
- lost
- steal
- thief
- pickpocket

**Examples:**
- "My bike was **stolen**" → Theft ✅
- "Someone **stole** my phone" → Theft ✅
- "Laptop **stolen** from office" → Theft ✅

---

## 🏠 Burglary
**Keywords:**
- broke in
- break-in
- burglary
- burglar
- entered
- forced entry

**Examples:**
- "Someone **broke into** my house" → Burglary
- "**Burglary** at my apartment" → Burglary

---

## 💰 Robbery
**Keywords:**
- robbed
- robbery
- mugged
- gunpoint
- knifepoint

**Examples:**
- "I was **robbed** at gunpoint" → Robbery
- "**Mugged** on the street" → Robbery

---

## 👊 Assault
**Keywords:**
- assault
- attacked
- hit
- beat
- punched
- kicked
- fight

**Examples:**
- "Someone **attacked** me" → Assault
- "I was **assaulted**" → Assault

---

## 📱 Harassment
**Keywords:**
- harass
- stalking
- threatening
- intimidat
- bully

**Examples:**
- "Someone is **harassing** me" → Harassment
- "Receiving **threatening** messages" → Harassment

---

## 💻 Cybercrime
**Keywords:**
- hack
- cyber
- online
- email
- phishing
- scam
- internet
- website

**Examples:**
- "My email was **hacked**" → Cybercrime
- "**Online scam**" → Cybercrime

---

## 🎭 Fraud
**Keywords:**
- fraud
- scam
- cheat
- fake
- counterfeit
- forgery

**Examples:**
- "Credit card **fraud**" → Fraud
- "**Fake** documents" → Fraud

---

## 🎨 Vandalism
**Keywords:**
- vandal
- damage
- graffiti
- destroyed
- smashed

**Examples:**
- "My car was **vandalized**" → Vandalism
- "Property **damaged**" → Vandalism

---

## 💊 Drug-related
**Keywords:**
- drug
- narcotic
- marijuana
- cocaine
- heroin
- meth

**Examples:**
- "**Drug** dealing in my area" → Drug-related
- "Found **narcotics**" → Drug-related

---

## 🏡 Domestic Violence
**Keywords:**
- domestic
- spouse
- partner
- family violence

**Examples:**
- "**Domestic violence** incident" → Domestic Violence
- "**Spouse** abuse" → Domestic Violence

---

## ⚠️ Sexual Offense
**Keywords:**
- sexual
- rape
- molest
- abuse

**Examples:**
- "**Sexual harassment**" → Sexual Offense
- "**Abuse** case" → Sexual Offense

---

## 💀 Murder/Homicide
**Keywords:**
- murder
- killed
- homicide
- dead
- death

**Examples:**
- "Someone was **killed**" → Murder/Homicide
- "**Murder** case" → Murder/Homicide

---

## 👶 Kidnapping
**Keywords:**
- kidnap
- abduct
- missing person

**Examples:**
- "Child **kidnapped**" → Kidnapping
- "Person **abducted**" → Kidnapping

---

## 🔥 Arson
**Keywords:**
- arson
- fire
- burned
- set fire

**Examples:**
- "Building **set on fire**" → Arson
- "**Arson** attack" → Arson

---

## 🚗 Traffic Violation
**Keywords:**
- traffic
- accident
- driving
- vehicle
- car crash

**Examples:**
- "**Traffic accident**" → Traffic Violation
- "Reckless **driving**" → Traffic Violation

---

## 📢 Public Disturbance
**Keywords:**
- noise
- disturbance
- loud
- party
- public

**Examples:**
- "**Noise** complaint" → Public Disturbance
- "**Loud party**" → Public Disturbance

---

## 🚫 Trespassing
**Keywords:**
- trespass
- unauthorized
- private property

**Examples:**
- "**Trespassing** on my land" → Trespassing
- "**Unauthorized** entry" → Trespassing

---

## 📝 Other
**Default category** when no keywords match

---

## 🎯 Priority Rules

1. **"stolen" or "stole"** → Always classifies as **Theft** (highest priority)
2. Keywords are checked in order from top to bottom
3. First matching category wins
4. If no keywords match → **Other**

---

## 🧪 Testing

To test if "stolen" always classifies as Theft:

```bash
cd ml
python test_stolen_classification.py
```

This will test 10 different descriptions with "stolen" keyword.

---

## 🔧 Customization

To add more keywords or change classification:

1. Open `ml/gemini_service.py`
2. Find the `classify_rule_based()` function
3. Add your keywords to the appropriate category
4. Restart the service

Example:
```python
# Add "snatched" to Theft keywords
if any(word in desc_lower for word in ['theft', 'took', 'missing', 'lost', 'steal', 'thief', 'pickpocket', 'snatched']):
    return "Theft"
```

---

## ✅ Verification

After making changes:

1. Restart the service: `python gemini_service.py`
2. Test: `python test_stolen_classification.py`
3. Reclassify existing reports: `node server/reclassify_reports.js`

---

**Note:** When Gemini AI is configured, it uses AI-based classification which is more accurate than keyword matching. The rule-based system is a fallback when Gemini is unavailable.
