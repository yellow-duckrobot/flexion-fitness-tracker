// src/utils/reminders.js — fires browser notifications at user-scheduled times.
const getSettings = () => JSON.parse(localStorage.getItem("flexion_settings") || "{}");

export function requestNotificationPermission() {
  if (!("Notification" in window)) return Promise.resolve("unsupported");
  if (Notification.permission === "granted") return Promise.resolve("granted");
  return Notification.requestPermission();
}

export function startReminderEngine() {
  if (!("Notification" in window)) return;

  const check = () => {
    const s = getSettings();
    if (Notification.permission !== "granted") return;

    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const firedKey = `flexion_fired_${now.toDateString()}`;
    const fired = JSON.parse(localStorage.getItem(firedKey) || "[]");
    const notify = (key, title, body) => {
      if (fired.includes(key)) return;
      new Notification(title, { body, icon: "/icon-192.png" });
      fired.push(key);
    };

    if (s.notifications?.workoutReminders && s.reminderTimes?.workout === hhmm)
      notify("workout", "💪 Workout time!", "Your scheduled workout reminder — let's move!");

    ["breakfast", "lunch", "dinner"].forEach((m) => {
      if (s.notifications?.mealReminders && s.reminderTimes?.meals?.[m] === hhmm)
        notify(m, `🍽️ ${m[0].toUpperCase() + m.slice(1)} time`, "Don't forget to log your meal.");
    });

    if (s.notifications?.goalAlerts && hhmm === "21:00")
      notify("goals", "🎯 Goal check-in", "Review today's progress toward your fitness goals.");

    localStorage.setItem(firedKey, JSON.stringify(fired));
  };

  check(); // once on load
  setInterval(check, 30000); // then every 30 seconds
}