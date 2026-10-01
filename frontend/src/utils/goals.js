export const GOAL_PLANS = {
  lose: {
    label: "Lose Weight", emoji: "🔥", color: "#22d3ee",
    headline: "Slight deficit, high protein, keep lifting.",
    tips: [
      "Eat 300–500 kcal below maintenance — track meals daily here",
      "Protein at every meal (1.6–2g per kg) protects muscle",
      "Lift weights 3–4x/week — cardio is the sidekick",
      "Walk 8–10k steps daily; expect 0.5–1% loss per week",
    ],
    foods: [
      { name: "Chicken breast + salad", note: "High protein, huge volume, low kcal" },
      { name: "Eggs + veggies", note: "Keeps you full for hours" },
      { name: "Greek yogurt + berries", note: "Sweet fix, 23g protein" },
      { name: "White fish + greens", note: "Lean, light, filling" },
      { name: "Protein shake", note: "120 kcal, 24g protein" },
      { name: "Soups & salads first", note: "Volume eating trick" },
    ],
  },
  maintain: {
    label: "Stay Fit", emoji: "⚖️", color: "#34d399",
    headline: "Balance energy, build the habit engine.",
    tips: [
      "Eat around maintenance — use the Nutrition page to learn your numbers",
      "Train 3–5x/week mixing strength + cardio",
      "Sleep 7–9h — recovery is where results are made",
      "Hit 80/20 whole foods vs treats — sustainability wins",
    ],
    foods: [
      { name: "Balanced plates", note: "½ veg, ¼ protein, ¼ carbs" },
      { name: "Oats + fruit", note: "Steady morning energy" },
      { name: "Rice + chicken + veg", note: "The classic athlete meal" },
      { name: "Nuts (small handful)", note: "Healthy fats, watch portions" },
      { name: "Plenty of water", note: "Log it in Hydration 💧" },
      { name: "Colorful vegetables", note: "Micronutrients matter" },
    ],
  },
  gain: {
    label: "Gain Muscle", emoji: "💪", color: "#f97316",
    headline: "Small surplus, progressive overload, repeat.",
    tips: [
      "Eat 250–400 kcal ABOVE maintenance — track it!",
      "1.6–2.2g protein/kg; add carbs around workouts",
      "Progressive overload: beat last week's numbers",
      "Gain ~0.25–0.5kg/week — more is mostly fat",
    ],
    foods: [
      { name: "Rice + chicken + olive oil", note: "Calorie-dense + protein" },
      { name: "Oats + peanut butter + banana", note: "Easy 500+ kcal breakfast" },
      { name: "Whole milk / smoothies", note: "Drink your calories" },
      { name: "Eggs + toast", note: "Cheap anabolic combo" },
      { name: "Beef + potatoes", note: "Protein + creatine from beef" },
      { name: "Trail mix & dates", note: "Portable surplus" },
    ],
  },
};