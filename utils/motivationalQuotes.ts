export const motivationalQuotes = [
  "You are stronger than you think! 💪",
  "Every small step counts toward your wellness! 🌟",
  "Progress, not perfection, is the goal! ✨",
  "Your mental health journey is unique and valuable! 🧠💚",
  "Take it one day at a time, you've got this! 🌅",
  "Self-care isn't selfish, it's necessary! 💝",
  "You're doing better than you realize! 🌈",
  "Healing isn't linear, and that's okay! 🌱",
  "Your feelings are valid and important! ❤️",
  "Every moment of mindfulness matters! 🧘‍♀️",
  "You deserve happiness and peace! ☮️",
  "Growth happens outside your comfort zone! 🚀",
  "Be patient with yourself during difficult times! 🤗",
  "You have overcome challenges before, you can do it again! 🦋",
  "Celebrate small wins - they add up! 🎉",
];

export const getRandomQuote = (): string => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
};

export const getWellnessTips = (mood: number, sleepHours: number, habits: string[]) => {
  const tips: string[] = [];

  // Mood-based tips
  if (mood <= 2) {
    tips.push("Consider reaching out to someone you trust today");
    tips.push("Try some gentle breathing exercises");
    tips.push("Remember: this feeling is temporary");
  } else if (mood >= 4) {
    tips.push("Great mood! Share your positive energy with others");
    tips.push("Document what made you feel good today");
  }

  // Sleep-based tips
  if (sleepHours < 6) {
    tips.push("Try to get to bed 30 minutes earlier tonight");
    tips.push("Consider a relaxing bedtime routine");
  } else if (sleepHours > 9) {
    tips.push("You might be oversleeping - try setting a consistent wake time");
  }

  // Habit-based tips
  if (!habits.includes('exercise')) {
    tips.push("Even a 10-minute walk can boost your mood!");
  }
  if (!habits.includes('meditation')) {
    tips.push("Try 5 minutes of mindfulness or deep breathing");
  }
  if (!habits.includes('gratitude')) {
    tips.push("Write down three things you're grateful for");
  }

  return tips.slice(0, 3); // Return max 3 tips
};