export interface Quest {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  duration_minutes: number;
  solo: boolean;
  equipment: string;
  xp: number;
}

export const categories = [
  "Dawn & Early Morning",
  "Darkness & Night",
  "Water",
  "Sleeping Outdoors",
  "Movement / Distance",
  "Specific Achievement",
  "Nature Observation",
  "Seasonal",
  "Mindset / Challenge",
];

export const quests: Quest[] = [
  // Dawn & Early Morning
  { id: 1, title: "Dawn chorus", description: "Wake before 5am. Sit somewhere outside (garden, park, bench) for 30 minutes. Listen. Record what you hear.", category: "Dawn & Early Morning", location: "Any outdoor spot", duration_minutes: 30, solo: true, equipment: "None", xp: 150 },
  { id: 2, title: "First light, any summit", description: "Watch sunrise from the highest point within 30 minutes of your home.", category: "Dawn & Early Morning", location: "Local high point", duration_minutes: 60, solo: true, equipment: "None", xp: 200 },
  { id: 3, title: "Cold morning coffee", description: "Make a hot drink outdoors before 7am. Doesn't matter where.", category: "Dawn & Early Morning", location: "Garden or outdoor spot", duration_minutes: 20, solo: true, equipment: "Thermos (optional)", xp: 100 },
  { id: 4, title: "Mist and water", description: "Find a lake, river or pond. Arrive before 6am. Watch what happens when sun hits the water.", category: "Dawn & Early Morning", location: "Any water body", duration_minutes: 45, solo: true, equipment: "None", xp: 175 },
  { id: 5, title: "Feed the birds", description: "Leave seeds or bread out for birds. Watch who comes to breakfast.", category: "Dawn & Early Morning", location: "Garden or park", duration_minutes: 30, solo: true, equipment: "Seeds/bread", xp: 100 },

  // Darkness & Night
  { id: 6, title: "Stars visible", description: "Find somewhere with minimal light pollution. Stay out until you can count 10 stars with the naked eye.", category: "Darkness & Night", location: "Dark sky area", duration_minutes: 60, solo: true, equipment: "None", xp: 175 },
  { id: 7, title: "Bivvy under the stars", description: "Sleep outside without a tent. Just a bivvy bag or blanket.", category: "Darkness & Night", location: "Any safe spot", duration_minutes: 480, solo: true, equipment: "Bivvy bag", xp: 400 },
  { id: 8, title: "Night swim", description: "Swim in open water after dark (safe spot only).", category: "Darkness & Night", location: "Safe open water", duration_minutes: 30, solo: false, equipment: "Swimsuit + towel", xp: 200 },
  { id: 9, title: "Darkness walk", description: "Walk somewhere in complete darkness for 30+ minutes. No phone torch.", category: "Darkness & Night", location: "Any safe area", duration_minutes: 45, solo: true, equipment: "None", xp: 175 },
  { id: 10, title: "Listen to rain fall asleep", description: "Fall asleep to rain falling on a tent or bivvy.", category: "Darkness & Night", location: "Tent or bivvy spot", duration_minutes: 600, solo: true, equipment: "Tent or bivvy bag", xp: 350 },

  // Water
  { id: 11, title: "Skinny dip", description: "Swim somewhere natural, with no clothes.", category: "Water", location: "Natural swimming spot", duration_minutes: 30, solo: true, equipment: "Nothing needed", xp: 175 },
  { id: 12, title: "Step in and stop", description: "Wade into cold water until it's above your knees. Stay for 60 seconds.", category: "Water", location: "Any cold water", duration_minutes: 5, solo: true, equipment: "None", xp: 125 },
  { id: 13, title: "Wash in a stream", description: "Find flowing water. Wash your face, arms and hands with it.", category: "Water", location: "Stream or river", duration_minutes: 10, solo: true, equipment: "None", xp: 100 },
  { id: 14, title: "Paddle to somewhere", description: "Walk knee-deep in water for at least 10 minutes. Find somewhere you've never waded before.", category: "Water", location: "River, lake or sea", duration_minutes: 30, solo: true, equipment: "Old shoes (optional)", xp: 150 },
  { id: 15, title: "One full minute", description: "Submerge your whole head. Count to 60. Open your eyes.", category: "Water", location: "Any water body", duration_minutes: 5, solo: true, equipment: "None", xp: 125 },

  // Sleeping Outdoors
  { id: 16, title: "Garden sleep", description: "Sleep outside at home. No tent. Just what you bring.", category: "Sleeping Outdoors", location: "Your garden", duration_minutes: 480, solo: true, equipment: "Sleeping bag", xp: 300 },
  { id: 17, title: "Hammock night", description: "String a hammock up somewhere you've never slept before. Wake in it.", category: "Sleeping Outdoors", location: "Trees with anchor points", duration_minutes: 480, solo: true, equipment: "Hammock", xp: 350 },
  { id: 18, title: "Soundtrack sleep", description: "Fall asleep listening only to nature sounds. No music, no podcast.", category: "Sleeping Outdoors", location: "Any outdoor spot", duration_minutes: 600, solo: true, equipment: "Sleeping bag", xp: 300 },
  { id: 19, title: "Porch night", description: "Sleep on a doorstep, balcony, or flat roof all night.", category: "Sleeping Outdoors", location: "doorstep, balcony or roof", duration_minutes: 480, solo: true, equipment: "Sleeping bag", xp: 300 },
  { id: 20, title: "Bivvy in a forest", description: "Sleep in a forest. Bivvy bag only. Wake up to birds.", category: "Sleeping Outdoors", location: "Forest", duration_minutes: 480, solo: true, equipment: "Bivvy bag", xp: 400 },

  // Movement & Distance
  { id: 21, title: "Five hour walk", description: "Walk for five consecutive hours. No destination required. Just go.", category: "Movement / Distance", location: "Anywhere", duration_minutes: 300, solo: true, equipment: "Comfortable shoes", xp: 500 },
  { id: 22, title: "Walk without purpose", description: "Walk for two hours. No destination. No Strava. Just wandering.", category: "Movement / Distance", location: "Anywhere", duration_minutes: 120, solo: true, equipment: "None", xp: 250 },
  { id: 23, title: "1000 steps before noon", description: "Take 1000 steps before 12pm. Outside. Before breakfast.", category: "Movement / Distance", location: "Anywhere outside", duration_minutes: 15, solo: true, equipment: "None", xp: 75 },
  { id: 24, title: "Public transport to somewhere new", description: "Take a bus or train to somewhere you've never been. Walk for two hours. Get back the same way.", category: "Movement / Distance", location: "Unfamiliar destination", duration_minutes: 180, solo: true, equipment: "Travel pass", xp: 350 },
  { id: 25, title: "The long way home", description: "Take a route home that's longer than necessary. Intentionally.", category: "Movement / Distance", location: "Home area", duration_minutes: 90, solo: true, equipment: "None", xp: 200 },

  // Specific Achievements
  { id: 26, title: "Summit a hill", description: "Reach the top of any hill within a day's walk of your home.", category: "Specific Achievement", location: "Any hill", duration_minutes: 240, solo: true, equipment: "Walking boots", xp: 450 },
  { id: 27, title: "Wild camp and pack out", description: "Camp somewhere wild. Leave nothing behind but footprints.", category: "Specific Achievement", location: "Wild spot", duration_minutes: 720, solo: true, equipment: "Tent + all kit", xp: 700 },
  { id: 28, title: "Find running water", description: "Find a stream, river or waterfall you've never seen before. Touch it.", category: "Specific Achievement", location: "Anywhere with water", duration_minutes: 60, solo: true, equipment: "None", xp: 175 },
  { id: 29, title: "Wild swimming spot", description: "Find a swimming spot in nature. Swim there. Share the location with no one.", category: "Specific Achievement", location: "Secret natural spot", duration_minutes: 60, solo: true, equipment: "Swimsuit", xp: 200 },
  { id: 30, title: "Campfire cook", description: "Cook an entire meal over an open fire you've made yourself.", category: "Specific Achievement", location: "Safe fire spot", duration_minutes: 120, solo: false, equipment: "Fire kit + food", xp: 300 },

  // Nature Observation
  { id: 31, title: "Sit for an hour", description: "Sit somewhere outside for 60 minutes. Don't look at your phone.", category: "Nature Observation", location: "Any outdoor spot", duration_minutes: 60, solo: true, equipment: "None", xp: 200 },
  { id: 32, title: "Eat something wild", description: "Find, identify and eat something from the wild (blackberries, wild garlic, mushrooms if expert).", category: "Nature Observation", location: "Foraging area", duration_minutes: 45, solo: true, equipment: "None", xp: 175 },
  { id: 33, title: "Track an animal", description: "Find animal tracks. Follow them until you understand where the animal was going.", category: "Nature Observation", location: "Woodland or fields", duration_minutes: 60, solo: true, equipment: "None", xp: 225 },
  { id: 34, title: "Sketch a tree", description: "Find a tree. Sit with it for 30 minutes. Draw it with a pencil.", category: "Nature Observation", location: "Any tree", duration_minutes: 45, solo: true, equipment: "Pencil + paper", xp: 175 },
  { id: 35, title: "Name a place", description: "Find somewhere unnamed on any map. Give it a name. Return to it.", category: "Nature Observation", location: "Unknown spot", duration_minutes: 60, solo: true, equipment: "None", xp: 200 },

  // Seasonal
  { id: 36, title: "First frost", description: "Be outside when you see frost for the first time that autumn/winter.", category: "Seasonal", location: "Garden or outdoors", duration_minutes: 30, solo: true, equipment: "Warm clothes", xp: 125 },
  { id: 37, title: "The last of the light", description: "Watch the sun fully set outdoors. Don't go inside until the last sliver is gone.", category: "Seasonal", location: "Any outdoor spot", duration_minutes: 45, solo: true, equipment: "None", xp: 150 },
  { id: 38, title: "Spring arrival", description: "Find one new sign of spring. Photograph it. Return in a month to see what's changed.", category: "Seasonal", location: "Any outdoor spot", duration_minutes: 30, solo: true, equipment: "Camera/phone", xp: 150 },
  { id: 39, title: "Snow sleep", description: "Sleep outside in snow. Bivvy or tent. Wake up inside a different world.", category: "Seasonal", location: "Snowy spot", duration_minutes: 480, solo: true, equipment: "Tent/bivvy + warm bag", xp: 500 },
  { id: 40, title: "August bank holiday", description: "Do something outdoors on the August bank holiday that you haven't done before.", category: "Seasonal", location: "Anywhere", duration_minutes: 180, solo: false, equipment: "Varies", xp: 300 },

  // Mindset & Challenge
  { id: 41, title: "Phone in the car", description: "Leave your phone in the car for a full outdoor outing. Navigate with a map.", category: "Mindset / Challenge", location: "Any outdoor area", duration_minutes: 180, solo: true, equipment: "Paper map", xp: 350 },
  { id: 42, title: "No headphones", description: "Walk for 2+ hours with no music, no podcast, no audio. Just you and your footsteps.", category: "Mindset / Challenge", location: "Anywhere", duration_minutes: 120, solo: true, equipment: "None", xp: 250 },
  { id: 43, title: "Speak to a stranger", description: "Talk to someone you encounter outdoors who you would normally walk past.", category: "Mindset / Challenge", location: "Outdoors", duration_minutes: 15, solo: true, equipment: "None", xp: 100 },
  { id: 44, title: "Solo night", description: "Spend a full 24 hours alone outdoors with no communication with anyone.", category: "Mindset / Challenge", location: "Remote spot", duration_minutes: 1440, solo: true, equipment: "Full overnight kit", xp: 1000 },
  { id: 45, title: "Say yes", description: "Agree to an outdoor challenge from a friend you would normally decline.", category: "Mindset / Challenge", location: "Varies", duration_minutes: 180, solo: false, equipment: "Varies", xp: 300 },
];