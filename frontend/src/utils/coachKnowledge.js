// src/utils/coachKnowledge.js — Flexion Coach: small talk + ~60 fitness topics + app help.
const SMALL_TALK = {
  greet: [
    "Hey champ! 💪 Ready to talk training, food, or mindset? Fire away!",
    "Yo! Great to see you. What's on your mind — nutrition, workouts, recovery?",
    "Hello hello! Ask me anything fitness — from protein to plateaus.",
  ],
  howAreYou: [
    "Running on pure motivation and whey protein 😄 How can I help YOU today?",
    "Feeling electric! Every question you ask makes me smarter. What's up?",
  ],
  thanks: [
    "Anytime! That's what I'm here for 🙌",
    "You're welcome! Now go crush that workout 💪",
    "No problem at all — consistency is king. Keep going!",
  ],
  bye: [
    "See you at the next workout! 🔥",
    "Later! Remember: never miss twice in a row.",
    "Goodbye! Hydrate and sleep well — recovery is training too.",
  ],
  compliment: [
    "Haha, stop it 😄 Now let's build some muscle — what do you need?",
    "Flattery will get you… excellent fitness advice. Shoot your question!",
  ],
  who: [
    "I'm the Flexion Coach — your in-app training and nutrition sidekick. I know about workouts, food, recovery, and how to use this app. Try asking 'what can you do?'",
  ],
  capabilities:
    "Here's what I'm good at:\n• 🍎 Nutrition — meal ideas, macros, protein, cutting/bulking\n• 🏋️ Training — splits, form, progressive overload, plateaus\n• 😴 Recovery — sleep, soreness, stress\n• 📱 The Flexion app — how any feature works\n• 💬 Small talk — I'm friendly like that\n\nTry: 'meal plan for losing weight', 'why am I sore', or 'how does my streak work'",
};

const APP_HELP = [
  {
    keywords: ["how to log", "log a workout", "add workout", "create workout", "use workout"],
    answer: "Head to the Workouts page from the sidebar, hit '+ New workout', give it a name and category, then add exercises with sets, reps and weight. You can edit or delete it anytime — and your volume stats update automatically!",
  },
  {
    keywords: ["log a meal", "add meal", "track food", "use nutrition", "quick add"],
    answer: "On the Nutrition page, click 'Log meal', pick the meal type (breakfast/lunch/dinner/snack), then add food items with calories and macros — or tap the Quick Add chips to auto-fill common foods. Your daily totals and macro donut update live!",
  },
  {
    keywords: ["streak", "heatmap", "consistency"],
    answer: "Your streak counts consecutive days with ANY activity — a workout or a logged meal. Check the Consistency Heatmap on your Dashboard (last 12 weeks): darker cells mean more activity. Hit 7, 14, 30-day milestones and the app celebrates with confetti 🎉",
  },
  {
    keywords: ["fitness score", "score", "66", "how does the score"],
    answer: "Your Fitness Score (0–100) is computed live from your activity: base 30 points + 12 per workout this week + up to 20 for hitting your calorie target + bonus for progress entries. Do more, watch it climb!",
  },
  {
    keywords: ["reminder", "notification", "alert"],
    answer: "Go to Settings → enable notifications → flip on workout/meal/goal reminders and set your times. The app pings you with real notifications at those times — even the goal check-in at 9 PM.",
  },
  {
    keywords: ["profile picture", "avatar", "upload photo", "change picture"],
    answer: "Profile page → tap the camera button on your avatar → pick any image. It uploads to the server and updates everywhere instantly, including the sidebar.",
  },
  {
    keywords: ["dark mode", "light mode", "theme", "appearance"],
    answer: "Settings page → Appearance → pick Dark or Light. Your choice is saved to your account and loads on every login.",
  },
  {
    keywords: ["export", "csv", "pdf", "download data"],
    answer: "Export is on the roadmap — for now you can view all your data on each page and screenshot your charts. (Psst — ask your developer friend about the CSV feature 😉)",
  },
  {
    keywords: ["units", "kg", "lbs", "pounds", "imperial"],
    answer: "Settings → Units → pick Metric (kg/cm) or Imperial (lb/in). The Dashboard and Progress pages instantly convert your weights.",
  },
  {
    keywords: ["game", "play", "bored", "fun"],
    answer: "Check out 'Snack or Stack' in the sidebar — guess which food has more calories and build your combo streak. High score is saved! 🎮",
  },
  {
    keywords: ["support", "bug report", "contact", "help page"],
    answer: "The Support page (sidebar) lets you send help requests, bug reports, or feedback — and track their status: Open → In review → Resolved.",
  },
];

const KNOWLEDGE = [
  // ----- FAT LOSS -----
  { keywords: ["lose weight", "losing weight", "lose fat", "fat loss", "weight loss", "cutting", "slim down", "belly fat", "burn fat"],
    answer: "Fat loss comes down to one thing: a calorie deficit. Eat 300–500 kcal below your maintenance, keep protein high (1.6–2.2g/kg) to protect muscle, lift weights 3–4x/week, and walk 8–10k steps daily. Expect 0.5–1% bodyweight loss per week — track it on your Progress page.",
    more: "Meal ideas for cutting: grilled chicken + huge salad, eggs + veggies, Greek yogurt + berries, fish + roasted vegetables. Volume eating (lots of veggies, lean protein) keeps you full on fewer calories. And don't crash diet — losing too fast costs muscle." },
  { keywords: ["calorie deficit", "deficit", "maintenance calories", "how many calories", "calories should i eat", "tdee", "bmr"],
    answer: "Estimate maintenance: bodyweight (kg) × 30–33 for moderate activity. For fat loss, subtract 300–500. For muscle gain, add 250–400. These are starting points — adjust every 2 weeks based on the scale trend (use your Progress page!)." },
  { keywords: ["not losing weight", "stuck", "plateau", "weight not moving", "why no progress"],
    answer: "First check the basics: tracking everything (yes, weekends & drinks), sleeping 7+ hours, and daily movement. If weight's been flat 2–3 weeks: drop 100–200 kcal OR add 2,000 steps. Also trust the trend, not single weigh-ins — water, salt and carbs swing the scale day-to-day.",
    more: "The 'whoosh effect' is real: fat cells temporarily fill with water, so the scale stalls then drops suddenly. Take weekly averages and progress photos — they're more honest than daily weight." },
  { keywords: ["spot reduce", "lose belly", "arm fat", "thigh fat", "face fat"],
    answer: "Spot reduction is a myth — your body decides where fat comes off. Crunches won't burn belly fat; a calorie deficit will, and eventually it takes fat from everywhere. Train the muscle to shape it, diet to reveal it." },
  { keywords: ["starvation mode", "not eating enough", "metabolism damaged", "slow metabolism"],
    answer: "True 'starvation mode' is rare — but very low calories for long periods slow you down (less NEAT, hormonal dips, training suffers). If you've been dieting hard for months, take a 2–4 week diet break at maintenance, then resume. Your metabolism isn't broken; it's adaptive." },
  { keywords: ["intermittent fasting", "fasting", "16:8", "skip breakfast", "omad"],
    answer: "IF works because it helps some people eat less — not magic. Calories still decide your weight. Try 16:8 if it suits you, but if fasting triggers evening binges, regular meals win. There's no best meal timing, only the one you can sustain." },
  { keywords: ["fasted cardio", "cardio empty stomach", "morning cardio"],
    answer: "Fasted cardio burns slightly more fat during the session but total daily deficit matters more. If you feel weak fasted, eat first — performance beats minor metabolic tricks. The best cardio is the one you'll actually do consistently." },
  // ----- MUSCLE GAIN -----
  { keywords: ["gain muscle", "build muscle", "bulking", "bulk", "get bigger", "muscle growth", "hypertrophy", "get stronger"],
    answer: "Muscle growth needs three things: a small calorie surplus (250–400 kcal), 1.6–2.2g protein/kg, and progressive overload — add reps or weight over time. Train each muscle 2x/week. Expect ~0.25–0.5kg gain per week as a natural lifter; more than that is mostly fat.",
    more: "Best beginner bulk foods: rice, oats, eggs, chicken, ground beef, milk, peanut butter, bananas, potatoes. Log your meals in Flexion to make sure you're actually hitting +300 kcal — most 'hard gainers' simply under-eat." },
  { keywords: ["skinny fat", "thin but fat", "recomp", "body recomposition"],
    answer: "Skinny-fat? Recomposition is your friend: eat at maintenance (or a tiny deficit), lift heavy 3–4x/week with progressive overload, and hit your protein. You'll slowly trade fat for muscle. It's slower than bulk/cut cycles but looks dramatically better." },
  { keywords: ["hard gainer", "can't gain", "eat a lot but skinny", "fast metabolism"],
    answer: "Hard gainers almost always under-eat liquid calories and skip consistency. Add calorie-dense foods: nuts, peanut butter, olive oil, whole milk, dried fruit. Drink some calories (smoothies). Track for one week — you'll likely find you eat less than you think. Aim +300–500 kcal above maintenance." },
  { keywords: ["protein", "how much protein", "protein intake", "whey protein", "protein powder"],
    answer: "Target 1.6–2.2g per kg of bodyweight (0.7–1g per lb), split across 3–5 meals of 25–40g. Great sources: chicken, eggs, Greek yogurt, fish, lean beef, tofu, lentils. Whey is just convenient food — one scoop helps you hit the number, especially on busy days.",
    more: "High-protein picks per 100g: chicken breast ~31g, tuna ~30g, Greek yogurt ~10g (per 100g), eggs ~13g, tofu ~8–15g, lentils ~9g. Mixing animal + plant sources across the day covers all amino acids." },
  { keywords: ["creatine", "supplements", "pre workout", "fat burner", "vitamins", "fish oil", "should i take"],
    answer: "The honest shortlist: creatine monohydrate (5g daily — most researched supplement ever), vitamin D if you get little sun, omega-3 if you eat little fish, whey for convenience. Skip fat burners and most 'boosters' — caffeine and marketing, mostly. Food + training beat pills.",
    more: "Creatine monohydrate is safe for healthy kidneys (despite the myths), costs pennies, and helps strength + muscle fullness. Drink a bit more water. Loading (20g/day for 5 days) is optional — 5g daily gets you there in ~3–4 weeks." },
  { keywords: ["progressive overload", "overload", "add weight", "strength plateau"],
    answer: "Progressive overload = gradually demanding more from your muscles: add 2.5kg, one rep, or one set over time. Simple system: when you hit the top of your rep range on all sets, add weight next session and build back up. Log every workout in Flexion so you know what to beat!" },
  { keywords: ["how often train", "training frequency", "every day gym", "rest days", "overtraining"],
    answer: "Each muscle grows best trained 2x/week. Most people thrive on 3–5 sessions/week with at least 1–2 full rest days. Signs you need rest: performance dropping, poor sleep, irritability, nagging aches. Muscles grow during recovery, not during the workout." },
  { keywords: ["rep range", "how many reps", "8-12", "low reps", "high reps"],
    answer: "Muscle growth happens across ~5–30 reps IF you take sets close to failure. Practical guide: big compounds 5–10 reps, most work 8–15, isolations 12–20. Heavier = strength focus, lighter = more volume with less joint stress. Mix it." },
  { keywords: ["failure", "train to failure", "rir", "rpe", "how hard"],
    answer: "You don't need to fail every set. A good rule: take isolations 0–2 reps from failure, compounds 1–3 from failure (RIR 1–3). Going to failure on every set burns you out fast. Last set of an exercise can go to failure safely." },
  { keywords: ["compound", "isolation", "free weights", "machines", "barbell", "dumbbell"],
    answer: "Base your program on compound lifts (squat, bench, deadlift, row, overhead press) — they build the most muscle in the least time. Add isolations (curls, lateral raises) for lagging muscles. Machines are great too; your muscles can't read the label. Free weights add stabilizer work and flexibility demands." },
  { keywords: ["beginner workout", "start lifting", "new to gym", "first program", "workout plan", "workout split"],
    answer: "Start with a full-body routine 3x/week: squat or leg press, bench or push-ups, rows, a hinge (deadlift/RDL), plus core — 3 sets of 8–12. Learn the movements with light weight, then add a little every week. 3 consistent months beat 3 perfect weeks. Log everything in Flexion!",
    more: "Sample day: Goblet squat 3×10, push-ups/bench 3×8–12, one-arm row 3×10, Romanian deadlift 3×10, plank 3×30s. Rest 90–120s between sets. That's a complete, effective beginner session." },
  { keywords: ["home workout", "no equipment", "no gym", "bodyweight", "workout at home"],
    answer: "No gym, no problem: push-ups, squats, lunges, glute bridges, plank, and inverted rows under a table cover everything. Progress by adding reps, slowing the tempo, or elevating feet/hands. A pair of adjustable dumbbells (~$50) unlocks almost everything else." },
  { keywords: ["pull up", "chin up", "can't do pull", "pull-up progression"],
    answer: "Build up with: dead hangs → band-assisted reps → negatives (jump up, lower 3–5s) → full reps. Train 2–3x/week, 3–5 sets, stop 1 rep before failure. Most people get their first strict rep within 4–8 weeks. Lat pulldowns help too." },
  { keywords: ["push up", "push-up", "cant do push"],
    answer: "Start with incline push-ups (hands on a bench/counter) — the higher the surface, the easier. As you hit 3×12–15, lower the surface, then go to knees, then full floor push-ups. Elevate your feet later to make them harder than standard." },
  { keywords: ["squat", "squat form", "squat depth", "knees hurt squat"],
    answer: "Squat cues: feet shoulder-width, toes slightly out, chest up, brace your core, sit between your hips (knees track over toes), depth to at least parallel if mobility allows. Knee pain usually means knees caving in or heels lifting — drop the weight, film yourself, and fix the pattern." },
  { keywords: ["deadlift", "deadlift form", "lower back deadlift"],
    answer: "Deadlift checklist: bar over mid-foot, grip just outside knees, chest up + lats tight, push the floor away (don't yank), hips and shoulders rise together, lock out by squeezing glutes. A little soreness in the back muscles is normal; sharp pain is a form alarm — deload and reset." },
  { keywords: ["bench press", "bench form", "bench arch"],
    answer: "Bench setup: shoulder blades pinched and down, slight arch (natural, not circus), feet planted, bar over lower chest/upper abs, elbows ~45–75° from your torso, wrist stacked over elbow. A small arch is safe and standard — it reduces shoulder stress." },
  { keywords: ["abs", "six pack", "core workout", "visible abs"],
    answer: "Everyone has abs — visibility is body fat %, not crunch count. Men typically need ~10–12% body fat, women ~18–22%, for visible definition. Train core 2–3x/week (planks, hanging leg raises, cable crunches) for strength, and control calories for the reveal." },
  // ----- NUTRITION -----
  { keywords: ["macros", "macro split", "carbs", "fats", "tracking macros"],
    answer: "Solid starting split: protein 25–35%, carbs 40–50%, fat 20–30% of calories. Cutting? Keep protein high, trim carbs slightly. Bulking? Add carbs around workouts. Per kg: protein ~2g, carbs 3–6g, fat 0.8–1g. Your Nutrition page tracks all of this live." },
  { keywords: ["pre workout food", "eat before gym", "before workout", "pre-workout meal"],
    answer: "1.5–3 hours before training: carbs + moderate protein, low fat/fiber for easy digestion — rice + chicken, oats + banana + whey, or a bagel + eggs. 15–30 min before: a banana or dates for quick fuel. Avoid huge fatty meals right before — your deadlift will hate you." },
  { keywords: ["post workout", "after workout", "protein shake after", "eat after gym", "anabolic window"],
    answer: "The '30-minute anabolic window' is mostly myth — total daily protein matters far more. Still, get 20–40g protein + some carbs within 1–2 hours: whey + banana, or a proper meal like salmon + rice. Rehydrate too." },
  { keywords: ["meal prep", "prepare meals", "batch cook"],
    answer: "Meal prep wins: cook 2 proteins (chicken + beef/tofu), 1–2 carbs (rice + potatoes), and chopped veggies on Sunday. Portion into containers for 3–4 days. It removes daily decisions — the #1 killer of diet consistency. Flexion makes logging prepped meals take seconds with Quick Add." },
  { keywords: ["eating out", "restaurant", "fast food", "order healthy"],
    answer: "Restaurant playbook: grilled/baked over fried, ask for sauce on the side, double the protein + veggies, skip sugary drinks (or zero-cal), and box half the portion if servings are huge. One meal out won't ruin you — weekly habits decide everything." },
  { keywords: ["cheat meal", "cheat day", "craving", "junk food", "pizza diet"],
    answer: "Use the 80/20 rule: 80% whole foods, 20% whatever you love. A planned treat within your calories changes nothing; the guilt-binge cycle changes everything. Log the treat in Flexion, enjoy it fully, move on. No drama, no damage.",
    more: "Pro move: fit treats with flexible tracking — a burger fits fine if the rest of the day is protein + veggies. The 'damage' was never the burger; it was the 3-day spiral after it." },
  { keywords: ["sugar", "is sugar bad", "sweet tooth"],
    answer: "Sugar isn't poison — excess calories are. The real problem: sugary foods are easy to overeat and not very filling. Keep added sugars moderate, get most carbs from whole foods, and if you have a sweet tooth, fruit + Greek yogurt + dark chocolate hit the spot with protein included." },
  { keywords: ["carbs bad", "carbs make fat", "low carb", "keto", "no carbs"],
    answer: "Carbs don't make you fat — excess calories do. Carbs fuel training, and hard training keeps muscle. Keto works for some by reducing appetite, not by magic. If you love bread and rice (same), just count them. Performance usually beats on low-carb diets." },
  { keywords: ["fat bad", "healthy fats", "olive oil", "peanut butter", "avocado"],
    answer: "Don't fear fats — you need them for hormones. Prioritize olive oil, nuts, avocado, fatty fish, eggs. Just remember: fat is 9 kcal/g (vs 4 for protein/carbs), so portions add up fast. A 'splash' of olive oil is often 200+ kcal — measure the pour." },
  { keywords: ["eggs every day", "eggs bad", "cholesterol"],
    answer: "For most healthy people, 1–3 eggs daily is fine — dietary cholesterol has a surprisingly small effect on blood cholesterol for the majority. Eggs are protein-packed, cheap, and complete. If you have specific cholesterol concerns, check with your doctor." },
  { keywords: ["vegetarian", "vegan", "plant based", "no meat protein"],
    answer: "Totally doable! Stack: lentils, chickpeas, tofu, tempeh, seitan, edamame, beans, plus pea/soy protein powder. Vegans: supplement B12 (non-negotiable), consider creatine + algae omega-3. Combine varied plant proteins through the day and you'll hit your targets." },
  { keywords: ["budget food", "cheap protein", "eating healthy expensive", "student budget"],
    answer: "Cheap protein all-stars: eggs, canned tuna, chicken thighs (cheaper than breast), frozen veggies, rice, oats, lentils, Greek yogurt tubs, peanut butter, milk. Frozen produce is just as nutritious as fresh. A week's muscle-building groceries can cost less than two takeouts." },
  { keywords: ["alcohol", "beer", "wine", "drinking"],
    answer: "Alcohol (7 kcal/g) pauses muscle building and lowers willpower around food. If you drink: cap 1–2, choose lower-cal options (spirit + zero-cal mixer, light beer), alternate with water, eat protein first, and never skip training the next day. Damage control, not perfection." },
  { keywords: ["coffee", "caffeine", "pre workout coffee"],
    answer: "Caffeine is a legit performance booster — 1–3mg/kg 30–60 min before training improves focus and output. Keep daily intake under ~400mg and cut off 6–8 hours before bed or sleep quality tanks. Black coffee is basically free calories; the latte is a dessert (and that's fine if counted!)." },
  { keywords: ["water", "hydration", "how much water"],
    answer: "Aim ~30–40ml per kg bodyweight (2.5–3.5L for most), more on training days or in heat. Mild dehydration measurably hurts strength and focus. Use the Hydration tracker on your Dashboard — 8 glasses earns confetti 💦" },
  { keywords: ["green tea", "detox", "cleanse", "detox tea"],
    answer: "Skip detoxes and cleanses — your liver and kidneys detox you 24/7 for free. Green tea is a fine low-cal drink with mild benefits, but it's not a fat burner. If a product promises rapid detox weight loss, it sells water loss and hope." },
  // ----- RECOVERY & LIFESTYLE -----
  { keywords: ["sleep", "insomnia", "how much sleep", "recovery"],
    answer: "Sleep is the legal performance enhancer: 7–9 hours. Short sleep spikes hunger hormones, tanks training, and slows fat loss. Power moves: consistent bedtime, dark cool room, no screens 30–60 min before, no caffeine after mid-afternoon. Track how training feels after good vs bad sleep — you'll never skip it again." },
  { keywords: ["sore", "soreness", "doms", "muscle pain"],
    answer: "DOMS (delayed soreness) peaks 24–72h after new or hard training and fades in 3–5 days. Best remedies: gentle movement, light activity ('flush it out'), sleep, protein, hydration. Sharp, localized, or joint pain ≠ DOMS — rest that area. You can train other muscles while sore." },
  { keywords: ["stretching", "flexibility", "mobility", "warm up"],
    answer: "Warm up dynamically before lifting (5 min bike/row + a few ramp-up sets). Static stretching is best AFTER training or on rest days — it improves flexibility long-term but can temporarily reduce strength if done pre-lift. For mobility: 10 min/day of hips, shoulders, and ankles beats 1 hour monthly." },
  { keywords: ["injury", "hurt", "sprain", "sharp pain", "injured"],
    answer: "Golden rule: sharp or worsening pain = stop that movement. RICE (rest, ice, compression, elevation) for acute tweaks, and see a professional if pain persists past a week or limits daily life. Training around an injury (not through it) keeps you sane and fit while you heal." },
  { keywords: ["back pain", "lower back", "back hurts"],
    answer: "Common lifting-related back tweaks heal with: a few days lighter activity, avoiding painful ranges, and gradual reloading. Long-term fix: strengthen the back itself (rows, deadlifts with good form, back extensions) + brace properly + don't neglect core. Persistent or radiating pain → see a physio." },
  { keywords: ["knee pain", "knees hurt"],
    answer: "Knee pain in training usually traces to: knees caving on squats, sudden volume jumps, or weak hips/glutes. Quick fixes: track knees over toes, warm up properly, strengthen glutes (glute bridges, clamshells), and reduce depth/load temporarily. Ongoing pain deserves a physio's eyes." },
  { keywords: ["stress", "anxious", "anxiety", "burnout", "mental health"],
    answer: "Mental health IS physical health — chronic stress raises cortisol, disrupts sleep, and stalls both fat loss and muscle gain. Non-negotiables: daily movement (even walking), 5–10 min of breathing/meditation, sunlight in the morning, and talking to someone when it gets heavy. Training is therapy, but it's not a substitute for help when you need it." },
  { keywords: ["motivation", "no motivation", "lazy", "cant start", "discipline"],
    answer: "Motivation is weather — discipline is climate. Shrink the ask: 'just put shoes on' beats 'crush a workout.' Never miss twice in a row. Schedule workouts like meetings. And let Flexion hook you: streaks, the heatmap, and the score are literally gamified accountability 🔥",
    more: "The 2-minute rule: when you can't start, commit to just 2 minutes of the habit. Starting is the hard part — momentum handles the rest. Also: discipline gets easier when sleep, food, and stress are handled. Fix the basics first." },
  { keywords: ["habit", "consistency", "build habit", "stick to"],
    answer: "Habits stick via: tiny start + same trigger daily + visible tracking (Flexion does this!) + never missing twice. Attach it to an existing routine: 'after morning coffee, I log breakfast.' A 70% consistent year crushes a 100% perfect month followed by burnout." },
  { keywords: ["gym anxiety", "intimidated", "afraid of gym", "gym scared"],
    answer: "Completely normal — everyone starts there. Fixes: go at off-peak hours, have a plan written down (open Flexion!), wear whatever's comfortable, remember literally nobody is watching you (they're busy worrying about themselves), and give it 2 weeks — the gym becomes YOUR place fast." },
  { keywords: ["morning or evening workout", "best time to train", "train at night"],
    answer: "The best time is whenever you'll actually show up consistently. Physiologically, late afternoon strength peaks slightly higher, but the difference is tiny compared to consistency. Train at your sustainable time — a 6 AM workout you skip loses to a 7 PM workout you attend." },
  { keywords: ["deload", "deload week", "tired of program"],
    answer: "Every 4–8 weeks (or when performance, sleep, and mood dip), take a deload: same exercises at ~50–60% of normal volume/intensity for a week. You'll come back stronger. Think of it as taking one step back to take three forward — recovery IS training." },
  { keywords: ["sauna", "ice bath", "cold plunge", "massage", "foam roll"],
    answer: "Recovery tools ranked by impact: 1) sleep, 2) food, 3) rest days, 4) everything else. Foam rolling + sauna feel great and may help short-term soreness; ice baths feel heroic but can blunt muscle growth if overused right after training. Enjoy them as extras — not foundations." },
  { keywords: ["steps", "walking", "10k steps", " neat"],
    answer: "Daily steps are the stealth fat-loss weapon: 8,000–10,000 burns 300–500 kcal — often more than your workout! Build them invisibly: walking calls, stairs, park farther, 10-min post-meal walks (also great for blood sugar). It all counts and it doesn't fatigue you." },
  { keywords: ["period", "cycle training", "mensruation", "women training"],
    answer: "Energy and strength naturally fluctuate across the cycle — that's biology, not weakness. Many people feel strongest in the follicular phase (week 2) and prefer lighter/intuitive training late-luteal. Track your patterns in Flexion and plan your hardest sessions where YOU perform best. Adapt, don't quit." },
  // ----- MISC POPULAR -----
  { keywords: ["bmi", "body fat percentage", "ideal weight"],
    answer: "BMI is a population statistic — it can't see muscle. A muscular person can be 'overweight' by BMI and lean by body fat. Better trackers: waist measurement, progress photos, strength trends, and how clothes fit. For most healthy people, waist < half your height is a strong health marker." },
  { keywords: ["weigh myself", "weighing frequency", "scale", "daily weigh"],
    answer: "Daily weighing is fine IF you track the weekly average — single readings swing 1–2kg from water, sodium, and carbs. Same conditions every time: morning, after bathroom, before food. Judge the 7-day trend, not any single day. Your Progress page chart does exactly this." },
  { keywords: ["reverse diet", "diet break", "end of cut"],
    answer: "After a long cut, don't slam calories back up. Reverse dieting: add 100–200 kcal/week for 4–8 weeks while training hard — hormones recover, hunger normalizes, and you keep the leanness. A 2-week maintenance break mid-diet also works wonders for adherence." },
  { keywords: ["refeed", "carb refeed", "high carb day"],
    answer: "A refeed (1 day at maintenance/high carbs during a cut) can refill gym performance and give a mental break. It's a tool for longer cuts, not a cheat day — keep protein high, push carbs up, keep fats low. Some people love them; others do fine without. Optional tool." },
  { keywords: ["boiled food", "only eat boiled", "boring diet"],
    answer: "Please don't live on boiled chicken and broccoli — misery is the #1 diet killer. Season aggressively (spices are ~0 calories), use sauces within reason, rotate proteins, and cook methods you enjoy (grill, air-fry, slow-cook). The best diet is the one you can still be on in 6 months." },
  { keywords: ["green vegetables", "eat more vegetables", "vegetables"],
    answer: "Target half your plate with veggies — huge volume, tons of fiber and micronutrients, minimal calories. Frozen veg counts 100%. Easy wins: pre-chopped bags, frozen broccoli/green beans, big salads, veggie omelets, blended soups. Fiber also keeps hunger (and digestion) in check." },
  { keywords: ["plateau strength", "not getting stronger", "weak"],
    answer: "Strength plateaus usually mean one of: not enough sleep/food, no progressive overload (are you tracking and beating last week's numbers?), too much junk volume, or needing a deload. Pick ONE goal lift, program it first in the session, add weight in small jumps (2.5kg upper / 5kg lower).",
    more: "Linear progression fix: if 3×5 stalls, switch to 5×3, or add a rep range scheme (3×5–8 — add reps weekly, then add weight and restart). Also double-check: are you actually eating at maintenance or above? Strength hates deficits." },
  { keywords: ["how long see results", "when will i see", "how fast results", "one month"],
    answer: "Realistic timelines with consistency: 2–4 weeks for energy and habit changes, 4–8 weeks for visible shape changes, 3–6 months for 'whoa, you look different' from friends. Muscle gain: ~0.5–1kg/month for beginners (slower after year one). Trust the process — the Flexion heatmap will prove you're showing up." },
  { keywords: ["should i cut or bulk", "cut or bulk first"],
    answer: "Decision guide: noticeably overweight or higher body fat (>~25% men / >~35% women)? Cut first. Lean but skinny? Bulk (lean). In between? Body recomp at maintenance with hard training. When in doubt: train hard at maintenance for 3 months — nearly everyone looks better after." },
  { keywords: ["protein before bed", "eat at night", "late night eating"],
    answer: "Eating at night doesn't automatically turn to fat — total daily calories decide that. That said, a high-protein evening snack (Greek yogurt, casein/cottage cheese) can support overnight muscle repair and tame late-night cravings. Total context beats meal-timing myths." },
  { keywords: ["cortisol", "hormones", "testosterone"],
    answer: "The boring truth: sleep 7–9h, lift heavy 3–4x/week, eat enough (including fats + carbs), keep stress managed, maintain a healthy body fat — that covers 95% of hormone optimization. 'Testosterone booster' supplements are marketing; heavy squats are not." },
  { keywords: ["run faster", "5k", "running tips", "improve running"],
    answer: "Run 3x/week: 1 easy long run (conversational pace), 1 intervals (6–8×400m fast), 1 steady tempo. Most beginners run their easy days too hard — slow down to get faster. Track your 5K time in Flexion's Progress page and watch it drop." },
  { keywords: ["warm up before lifting", "ramp up sets", "how to warm up"],
    answer: "Efficient lifting warm-up: 3–5 min light cardio, a few dynamic moves for the day's muscles, then ramp-up sets on the first exercise (e.g., bench: 40%×8, 60%×5, 75%×3, then work sets). You should arrive at working weight warm but not fatigued." },
  { keywords: ["yoga", "pilates"],
    answer: "Yoga and Pilates are excellent complements: mobility, core strength, posture, and stress relief. 1–2 sessions/week alongside lifting covers the flexibility most lifters skip. They won't replace resistance training for muscle/strength, but they'll keep you training longer and pain-free." },
  { keywords: ["heart rate", "zone 2", "cardio zones"],
    answer: "Zone 2 = ~60–70% max heart rate (roughly 220 minus age, then 60–70%) — you can still talk in sentences. It's the aerobic base that boosts recovery between sets and overall work capacity. 1–2 sessions of 30–45 min/week is plenty for lifters." },
];

const FALLBACKS = [
  "Hmm, I'm strongest on training, nutrition, recovery, and using the Flexion app. Try rephrasing — or tap a suggestion below!",
  "Not quite my lane! Ask me about losing fat, building muscle, protein, sleep, plateaus… or type 'what can you do?' to see my full skill list.",
  "Good question — a bit outside my playbook though. Try things like 'meal ideas for cutting', 'why am I not getting stronger', or 'how does my streak work?'",
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// returns { text, more? } — more enables "tell me more" follow-ups
export function coachReply(message, lastMore) {
  const msg = message.toLowerCase().trim();

  // follow-up: continue last topic
  if (/^(tell me more|more|continue|go on|and\?|why\??|how\??)$/.test(msg) && lastMore) {
    return { text: lastMore };
  }

  // small talk first
  if (/^(hi|hii+|hello|hey|yo|salam|salaam|good (morning|evening|afternoon))/.test(msg))
    return { text: pick(SMALL_TALK.greet) };
  if (/how are you|how's it going|hows it going|what's up|whats up/.test(msg))
    return { text: pick(SMALL_TALK.howAreYou) };
  if (/^(thanks|thank you|shukriya|thx|ty)/.test(msg))
    return { text: pick(SMALL_TALK.thanks) };
  if (/^(bye|goodbye|see you|gtg|good night)/.test(msg))
    return { text: pick(SMALL_TALK.bye) };
  if (/(cool|awesome|nice|great|amazing|love (you|this)|lol|lmao)/.test(msg) && msg.length < 30)
    return { text: pick(SMALL_TALK.compliment) };
  if (/who are you|what are you|your name/.test(msg))
    return { text: pick(SMALL_TALK.who) };
  if (/what can you do|help me|commands|options|features/.test(msg))
    return { text: SMALL_TALK.capabilities };

  // knowledge matching (app help first, then fitness)
  const all = [...APP_HELP, ...KNOWLEDGE];
  let best = null, bestScore = 0;
  for (const entry of all) {
    let score = 0;
    for (const k of entry.keywords) {
      if (msg.includes(k)) score += k.split(" ").length + 1;
    }
    if (score > bestScore) { bestScore = score; best = entry; }
  }
  if (best) return { text: best.answer, more: best.more || null };

  return { text: pick(FALLBACKS) };
}

export const QUICK_QUESTIONS = [
  "Meal ideas for losing weight?",
  "How do I gain muscle?",
  "How much protein do I need?",
  "Why am I not losing weight?",
  "Best pre-workout meal?",
  "How does my streak work?",
];