# Complete Onboarding Survey Flow

## Overview
5-minute survey that maps user context → avatar initial state → personalized coaching approach

## Section 1: Physical Metrics (2 min)

### Q1: Height
- Type: Number input
- Unit: cm
- Validation: 140-220 cm
- Used for: BMI calculation, avatar scale

**Q1 FOLLOW-UP: How confident are you in this measurement?**
- Helpful for: Body acceptance gauge

### Q2: Current Weight
- Type: Number input
- Unit: kg
- Validation: 30-200 kg
- Used for: BMI, body fat estimation

**Q2 FOLLOW-UP: Last time you weighed yourself?**
- Helpful for: Data freshness

### Q3: Goal Weight
- Type: Number input
- Unit: kg
- Validation: Must be logical relative to height
- Used for: Goal progress calculation

**Q3 VALIDATION CHECK:**
```
if (goalWeight - currentWeight > 20) {
  showWarning: "That's a big shift! Let's make sure this is realistic. 
               For sustainable loss, aim for 0.5-1 kg/week. 
               Want to adjust?"
}
```

### Q4: Height Measurement Confidence
- Type: Multi-choice
- Options: "Measured recently", "Roughly remember", "Not sure"
- Used for: Avatar generation accuracy flag

---

## Section 2: Health History (1.5 min)

### Q5: Current Health Status
- Type: Checkbox grid
- Options:
  - [ ] No current injuries
  - [ ] Minor aches (tweaks, soreness)
  - [ ] Previous injuries (healed)
  - [ ] Chronic condition managed
  - [ ] Recent surgery/recovery
  - [ ] Pregnant or postpartum (6mo-2yr)

**Q5 BRANCHING:**
If "Chronic condition" or "Recent surgery" → Show:
> "Thanks for sharing. We want to make sure we give you advice that's safe for your body. Have you cleared exercise with your doctor?"

### Q6: Dietary Restrictions/Preferences
- Type: Checkbox (multi-select)
- Options:
  - [ ] None
  - [ ] Vegetarian/Vegan
  - [ ] Pescatarian
  - [ ] Gluten-free
  - [ ] Dairy-free
  - [ ] Kosher/Halal
  - [ ] Other (specify)

### Q7: Medication/Supplement Use
- Type: Text (optional)
- Question: "Taking anything that affects metabolism? (diabetes meds, thyroid, etc.)"
- Used for: Contextualizing plateau/results

### Q8: Mental Health Screening - PHQ-2
> "Over the past 2 weeks, how often have you been bothered by:"

- **Q8A:** Little interest/pleasure in activities?
  - Radio: Not at all | Several days | More than half | Nearly every day

- **Q8B:** Feeling down, depressed, or hopeless?
  - Radio: Not at all | Several days | More than half | Nearly every day

**SCORING & ACTION:**
```
phq2_score = q8a + q8b (0-6 scale)

if (score >= 3) {
  showMessage: "I appreciate you being honest. What you're experiencing is more 
               common than you think, and it's treatable. 
               
               Our avatar journey can be a tool, but I want you to also connect with a 
               professional who can really help.
               
               Resources: Talk to your doctor or text 'HELLO' to 741741 
               (Crisis Text Line)"
  
  pauseCoaching: true // Don't push fitness until mental health supported
}
```

### Q9: Eating Disorder Risk - SCOFF Screening

> "Please answer honestly. There are no wrong answers here."

- **Q9A:** Do you make yourself **Sick** because you feel uncomfortably full?
  - Yes / No

- **Q9B:** Do you worry you have lost **Control** over how much you eat?
  - Yes / No

- **Q9C:** Have you recently lost more than **14 pounds** in a **3-month period**?
  - Yes / No

- **Q9D:** Do you believe yourself to be **Fat** when others say you're too thin?
  - Yes / No

- **Q9E:** Would you say **Food** dominates your life?
  - Yes / No

**SCORING & ACTION:**
```
scoff_score = sum of "Yes" answers (0-5)

if (score >= 2) {
  showMessage: "Thank you for being vulnerable. This matters. 
               
               What you're describing suggests we should get professional support involved. 
               This isn't something I can coach you through alone, and you deserve real expertise.
               
               Please reach out to:
               • National Eating Disorders Hotline: 1-800-931-2237
               • Your doctor
               • ANAD: anad.org
               
               I'm still here, and I believe in your recovery."
  
  referralRequired: true
}
```

---

## Section 3: Goal & Lifestyle (1 min)

### Q10: Primary Goal
- Type: Radio (single select)
- Options:
  - ( ) **Lose weight** - Get leaner, see muscle definition
  - ( ) **Build muscle** - Get stronger, add mass
  - ( ) **Improve fitness** - Better cardio, endurance, energy
  - ( ) **Maintain** - Keep current weight, feel good
  - ( ) **Athletic performance** - Train for specific sport/activity

**Q10 FOLLOW-UP:**
Depending on selection:
- **Lose weight**: "Target body fat range? (e.g., 18-22%)"
- **Build muscle**: "Want bigger overall, or focus on specific areas?"
- **Athletic**: "What sport/activity are you training for?"

### Q11: Activity Level (Current)
- Type: Radio
- Options:
  - ( ) **Sedentary** - Little to no exercise
  - ( ) **Light** - 1-3 days/week activity
  - ( ) **Moderate** - 3-5 days/week activity
  - ( ) **Active** - 6-7 days/week or sports
  - ( ) **Very Active** - Professional athlete or 2x/day training

### Q12: Available Time for Exercise
- Type: Radio
- Options:
  - ( ) **15 min/day** - Fit workouts into busy schedule
  - ( ) **30 min/day** - Moderate time available
  - ( ) **45-60 min/day** - Good amount of time
  - ( ) **Variable** - Depends on the day

### Q13: Workout Environment
- Type: Checkbox (multi-select)
- Options:
  - [ ] Home only (minimal equipment)
  - [ ] Home with dumbbells/bands
  - [ ] Home gym (bench, squat rack, etc.)
  - [ ] Gym membership
  - [ ] Outdoor (running, parks, etc.)
  - [ ] Combination

---

## Section 4: Demographics & Preferences (30 sec)

### Q14: Age
- Type: Number input
- Range: 16-100
- Used for: Body fat estimation accuracy, coaching tone

### Q15: Gender
- Type: Radio
- Options:
  - ( ) Male
  - ( ) Female
  - ( ) Other / Prefer not to say

**Note:** Used only for health calculations and avatar customization. Coaching is gender-neutral supportive.

### Q16: Avatar Customization Preference
- Type: Radio
- Options:
  - ( ) Match my appearance closely
  - ( ) Aspirational (idealized version of me)
  - ( ) Show current state, evolve realistically
  - ( ) Surprise me

---

## Section 5: Mental Health & Motivation (1 min)

### Q17: What's Your Why?
- Type: Text (open-ended, 200 char limit)
- Example answers:
  - "Keep up with my kids"
  - "Feel confident in my body"
  - "Run a 5K without stopping"
  - "Get off blood pressure meds"

**USAGE:** Coach references this in motivation moments:
> "Remember when you said you wanted to [their why]? We're getting closer."

### Q18: Biggest Obstacle
- Type: Radio
- Options:
  - ( ) **Consistency** - Start strong, hard to stick with
  - ( ) **Motivation** - Don't feel excited about it
  - ( ) **Time** - Too busy/competing priorities
  - ( ) **Willpower** - Cravings/emotional eating
  - ( ) **Knowledge** - Don't know what to do
  - ( ) **Social** - Friends/family don't support
  - ( ) **Confidence** - Doubt I can do it
  - ( ) **Other** (specify)

**COACH PERSONALIZATION:**
```
if (obstacle === "Consistency") {
  coachTone: "focus on micro-habits and streaks"
  suggestionFrequency: "more frequent check-ins"
}

if (obstacle === "Motivation") {
  coachTone: "celebrate effort, use avatar visual progress"
  suggestionFrequency: "daily encouragement"
}

if (obstacle === "Time") {
  coachTone: "emphasize efficiency, minimal viable workouts"
  workoutLength: "default to 15-20 min options"
}
```

### Q19: Body Image Starting Point
- Type: Slider (1-10)
- Question: "How comfortable do you currently feel in your body?"
- Used for: Avatar representation and coaching sensitivity

**LOGIC:**
```
if (bodyImage < 4) {
  emphasis: "non-scale victories"
  tone: "extra compassionate"
  avoidsLanguage: ["fat", "ugly", "disgusting"]
}
```

---

## Section 6: Confirmation & Summary (1 min)

### Q20: Review & Consent

Show summary:
```
✓ Height: 170 cm | Current Weight: 75 kg | Goal: 70 kg
✓ Goal: Lose weight | Activity Level: Moderate | Time: 30 min/day
✓ Why: "Feel confident at my high school reunion"
✓ Biggest challenge: Consistency
```

**Checkboxes (must both check to proceed):**
- [ ] This information is accurate
- [ ] I understand this app provides coaching, not medical advice

### Q21: Email Consent
- Type: Checkbox
- "I'd like weekly progress summaries emailed to me"
- Optional, not required to proceed

---

## Post-Survey Actions

### Immediate (5 sec)
1. **Validation layer** → Check for red flags (ED, depression, etc.)
2. **Avatar generation trigger** → Call Ready Player Me API
3. **Profile creation** → Save to Supabase

### Display to User
```
🎉 Your Avatar is Being Created...

While you wait:
- See what your future self looks like
- Your avatar will update as you log workouts & meals
- Every small win counts—watch it transform

[Coach intro message based on responses]
```

### Background Processing
1. Calculate BMI, body fat estimate, calorie needs
2. Set up onboarding messaging sequence
3. Pre-generate first week of workout suggestions
4. Configure safety guardrails (calorie min/max, exercise limits)

---

## Survey Data Model

```typescript
type OnboardingSurvey = {
  // Physical
  height: number // cm
  currentWeight: number // kg
  goalWeight: number // kg
  
  // Health
  injuryStatus: string[]
  dietaryRestrictions: string[]
  medications: string // optional
  phq2Score: 0 | 1 | 2 | 3 | 4 | 5 | 6
  scoffScore: 0 | 1 | 2 | 3 | 4 | 5
  
  // Goals & Lifestyle
  primaryGoal: 'lose' | 'gain' | 'maintain' | 'fitness' | 'athletic'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  availableTime: 15 | 30 | 45 | 60 | 'variable'
  workoutEnvironment: string[]
  
  // Demographics
  age: number
  gender: 'male' | 'female' | 'other'
  
  // Motivation
  whyStatement: string // their "why"
  biggestObstacle: string
  bodyImageScore: 1-10
  avatarPreference: 'realistic' | 'aspirational' | 'current' | 'surprise'
  
  // Consent
  dataAccuracy: boolean
  understandsLimitations: boolean
  emailOptIn: boolean
  
  createdAt: timestamp
}
```

---

## Coach Personalization Based on Survey

### Tone Adjustments
- **Low body image score** → Extra emphasis on non-scale wins
- **Consistency issue** → More frequent micro-habit focus
- **Obstacle: Time** → Always offer 15-min alternatives
- **Athletic goal** → Sport-specific terminology

### Content Adjustments
- **Dietary restrictions** → Meal suggestions respect preferences
- **Available time** → Match workout lengths to availability
- **Past injury** → Offer modifications and low-impact options
- **Beginner fitness level** → Start with foundational exercises

### Safety Guardrails Activated
- **PHQ-2 ≥ 3** → Refer to mental health, don't push hard
- **SCOFF ≥ 2** → Refer to ED specialist, pause coaching
- **Rapid weight loss history** → Monitor weekly closely
- **Obsessive language** → Watch for overtraining

### Avatar Customization
- **Aspirational preference** → Show goal state visualization
- **Realistic preference** → Reflect current metrics accurately
- **Confidence low** → Start with subtle improvements
- **Confidence high** → Show more dramatic evolution potential
