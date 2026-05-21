export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  category: "quest" | "social" | "streak" | "milestone" | "special";
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  requirement: string;
}

export const achievements: Achievement[] = [
  // === QUEST COMPLETION ACHIEVEMENTS (45) ===
  ...Array.from({ length: 45 }, (_, i) => ({
    id: `quest_${i + 1}`,
    name: `Quest ${i + 1} Complete`,
    description: `Completed quest #${i + 1}`,
    icon: "IconFlag",
    xpReward: 10,
    category: "quest" as const,
    rarity: "common" as const,
    requirement: `complete_quest_${i + 1}`
  })),

  // === STREAK ACHIEVEMENTS ===
  { id: "streak_3", name: "Getting Warmed Up", description: "Complete quests 3 days in a row", icon: "IconFlame", xpReward: 25, category: "streak", rarity: "common", requirement: "streak_3" },
  { id: "streak_7", name: "On Fire", description: "Complete quests 7 days in a row", icon: "IconFlame", xpReward: 75, category: "streak", rarity: "uncommon", requirement: "streak_7" },
  { id: "streak_14", name: "Blazing Trail", description: "Complete quests 14 days in a row", icon: "IconFlame", xpReward: 150, category: "streak", rarity: "rare", requirement: "streak_14" },
  { id: "streak_30", name: "Unstoppable", description: "Complete quests 30 days in a row", icon: "IconFlame", xpReward: 500, category: "streak", rarity: "epic", requirement: "streak_30" },
  { id: "streak_100", name: "Legend of Consistency", description: "Complete quests 100 days in a row", icon: "IconFlame", xpReward: 2000, category: "streak", rarity: "legendary", requirement: "streak_100" },

  // === XP MILESTONES ===
  { id: "xp_100", name: "Century Club", description: "Earn 100 XP", icon: "IconTrophy", xpReward: 0, category: "milestone", rarity: "common", requirement: "xp_100" },
  { id: "xp_500", name: "Half Grand", description: "Earn 500 XP", icon: "IconTrophy", xpReward: 0, category: "milestone", rarity: "uncommon", requirement: "xp_500" },
  { id: "xp_1000", name: "Grand Scholar", description: "Earn 1,000 XP", icon: "IconTrophy", xpReward: 0, category: "milestone", rarity: "rare", requirement: "xp_1000" },
  { id: "xp_5000", name: "XP Master", description: "Earn 5,000 XP", icon: "IconTrophy", xpReward: 0, category: "milestone", rarity: "epic", requirement: "xp_5000" },
  { id: "xp_10000", name: "XP Legend", description: "Earn 10,000 XP", icon: "IconTrophy", xpReward: 0, category: "milestone", rarity: "legendary", requirement: "xp_10000" },

  // === LEVEL MILESTONES ===
  { id: "level_5", name: "Rising Star", description: "Reach level 5", icon: "IconStar", xpReward: 0, category: "milestone", rarity: "common", requirement: "level_5" },
  { id: "level_10", name: "Seasoned Explorer", description: "Reach level 10", icon: "IconStar", xpReward: 0, category: "milestone", rarity: "uncommon", requirement: "level_10" },
  { id: "level_25", name: "Expert Adventurer", description: "Reach level 25", icon: "IconStar", xpReward: 0, category: "milestone", rarity: "rare", requirement: "level_25" },
  { id: "level_50", name: "Master of Quests", description: "Reach level 50", icon: "IconStar", xpReward: 0, category: "milestone", rarity: "epic", requirement: "level_50" },
  { id: "level_100", name: "Quest Legend", description: "Reach level 100", icon: "IconStar", xpReward: 0, category: "milestone", rarity: "legendary", requirement: "level_100" },

  // === QUEST COUNT MILESTONES ===
  { id: "quests_5", name: "Adventurer", description: "Complete 5 quests", icon: "IconMap", xpReward: 0, category: "milestone", rarity: "common", requirement: "quests_5" },
  { id: "quests_10", name: "Pathfinder", description: "Complete 10 quests", icon: "IconMap", xpReward: 0, category: "milestone", rarity: "uncommon", requirement: "quests_10" },
  { id: "quests_25", name: "Trailblazer", description: "Complete 25 quests", icon: "IconMap", xpReward: 0, category: "milestone", rarity: "rare", requirement: "quests_25" },
  { id: "quests_45", name: "Completionist", description: "Complete all 45 quests", icon: "IconMap", xpReward: 0, category: "milestone", rarity: "legendary", requirement: "quests_45" },

  // === CATEGORY ACHIEVEMENTS ===
  { id: "category_dawn", name: "Early Bird", description: "Complete 5 Dawn & Early Morning quests", icon: "IconSunrise", xpReward: 50, category: "special", rarity: "uncommon", requirement: "category_dawn_5" },
  { id: "category_nature", name: "Nature Lover", description: "Complete 5 Nature & Wildlife quests", icon: "IconTree", xpReward: 50, category: "special", rarity: "uncommon", requirement: "category_nature_5" },
  { id: "category_urban", name: "City Explorer", description: "Complete 5 Urban Exploration quests", icon: "IconBuilding", xpReward: 50, category: "special", rarity: "uncommon", requirement: "category_urban_5" },
  { id: "category_food", name: "Foodie Explorer", description: "Complete 5 Food & Drink quests", icon: "IconToolsKitchen", xpReward: 50, category: "special", rarity: "uncommon", requirement: "category_food_5" },
  { id: "category_creative", name: "Creative Spirit", description: "Complete 5 Creative quests", icon: "IconPalette", xpReward: 50, category: "special", rarity: "uncommon", requirement: "category_creative_5" },
  { id: "category_fitness", name: "Fitness Fighter", description: "Complete 5 Fitness & Sport quests", icon: "IconDumbbell", xpReward: 50, category: "special", rarity: "uncommon", requirement: "category_fitness_5" },
  { id: "category_social", name: "Social Butterfly", description: "Complete 5 Social & Community quests", icon: "IconUsers", xpReward: 50, category: "special", rarity: "uncommon", requirement: "category_social_5" },
  { id: "category_mindfulness", name: "Inner Peace", description: "Complete 5 Mindfulness & Wellbeing quests", icon: "IconBrain", xpReward: 50, category: "special", rarity: "uncommon", requirement: "category_mindfulness_5" },

  // === SPECIAL ACHIEVEMENTS ===
  { id: "first_quest", name: "First Steps", description: "Complete your first quest", icon: "IconFootprint", xpReward: 0, category: "special", rarity: "common", requirement: "first_quest" },
  { id: "first_streak", name: "Streak Started", description: "Complete quests 2 days in a row", icon: "IconFlame", xpReward: 10, category: "special", rarity: "common", requirement: "streak_2" },
  { id: "weekend_warrior", name: "Weekend Warrior", description: "Complete 3 quests on a weekend", icon: "IconCalendar", xpReward: 30, category: "special", rarity: "uncommon", requirement: "weekend_3" },
  { id: "early_bird_special", name: "Dawn Pioneer", description: "Complete a quest before 6 AM", icon: "IconSunrise", xpReward: 25, category: "special", rarity: "uncommon", requirement: "time_0600" },
  { id: "night_owl", name: "Night Owl", description: "Complete a quest after 11 PM", icon: "IconMoon", xpReward: 25, category: "special", rarity: "uncommon", requirement: "time_2300" },
  { id: "journaler", name: "Journal Keeper", description: "Write a journal note for 5 quests", icon: "IconPencil", xpReward: 50, category: "special", rarity: "uncommon", requirement: "journal_5" },
  { id: "mood_tracker", name: "Mood Tracker", description: "Log your mood for 10 quests", icon: "IconMoodSmile", xpReward: 50, category: "special", rarity: "uncommon", requirement: "mood_10" },
  { id: "all_moods", name: "Emotional Explorer", description: "Log every different mood type", icon: "IconMoodSmile", xpReward: 100, category: "special", rarity: "rare", requirement: "all_moods" },
  { id: "perfectionist", name: "Perfectionist", description: "Complete 10 quests with a journal note", icon: "IconCheck", xpReward: 75, category: "special", rarity: "rare", requirement: "journal_10" },
  { id: "social_star", name: "Social Star", description: "Complete 10 social quests", icon: "IconUsers", xpReward: 100, category: "special", rarity: "rare", requirement: "category_social_10" },
  { id: "early_adopter", name: "Early Adopter", description: "Joined during launch week", icon: "IconRocket", xpReward: 100, category: "special", rarity: "rare", requirement: "early_adopter" },
  { id: "multiplier", name: "Multiplier", description: "Complete 3 quests in one day", icon: "IconZ", xpReward: 50, category: "special", rarity: "rare", requirement: "quests_1_day_3" },
  { id: "marathon", name: "Quest Marathon", description: "Complete 5 quests in one day", icon: "IconZ", xpReward: 150, category: "special", rarity: "epic", requirement: "quests_1_day_5" },
  { id: "ultra", name: "Ultra Marathon", description: "Complete 10 quests in one day", icon: "IconZ", xpReward: 500, category: "special", rarity: "legendary", requirement: "quests_1_day_10" },
  { id: "comeback", name: "Comeback Kid", description: "Return after a 7+ day streak break", icon: "IconRefresh", xpReward: 30, category: "special", rarity: "uncommon", requirement: "comeback_7" },
  { id: "consistent", name: "Consistently Great", description: "Maintain a 7-day streak twice", icon: "IconFlame", xpReward: 100, category: "special", rarity: "rare", requirement: "streak_7_twice" },
  { id: "dedicated", name: "Dedicated Adventurer", description: "Maintain a 30-day streak", icon: "IconMedal", xpReward: 300, category: "special", rarity: "epic", requirement: "streak_30_twice" },
  { id: "master", name: "Quest Master", description: "Complete all 45 quests AND reach level 50", icon: "IconCrown", xpReward: 1000, category: "special", rarity: "legendary", requirement: "all_quests_level_50" },
];

export const achievementMap = new Map(achievements.map(a => [a.id, a]));

export function getAchievementById(id: string): Achievement | undefined {
  return achievementMap.get(id);
}

export function getAchievementsByCategory(category: Achievement["category"]): Achievement[] {
  return achievements.filter(a => a.category === category);
}

export function getAchievementsByRarity(rarity: Achievement["rarity"]): Achievement[] {
  return achievements.filter(a => a.rarity === rarity);
}

export const totalAchievements = achievements.length;

export const rarityColors: Record<Achievement["rarity"], string> = {
  common: "#9ca3af",      // gray-400
  uncommon: "#22c55e",    // green-500
  rare: "#3b82f6",        // blue-500
  epic: "#a855f7",        // purple-500
  legendary: "#f59e0b"    // amber-500
};

export const categoryIcons: Record<Achievement["category"], string> = {
  quest: "IconFlag",
  social: "IconUsers",
  streak: "IconFlame",
  milestone: "IconTrophy",
  special: "IconStar"
};