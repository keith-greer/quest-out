import { Database } from "bun:sqlite";
import { hashSync, compareSync, genSaltSync } from "bcryptjs";
import { randomBytes } from "node:crypto";

const db = new Database("quest-out.db");

// Enable WAL mode for better concurrent performance
db.run("PRAGMA journal_mode = WAL");

// Create tables
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS quest_completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    quest_id INTEGER NOT NULL,
    completed_at TEXT DEFAULT CURRENT_TIMESTAMP,
    mood TEXT,
    journal_note TEXT,
    xp_earned INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, quest_id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS user_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    badge_id TEXT NOT NULL,
    earned_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, badge_id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

export interface User {
  id: number;
  email: string;
  username: string;
  xp: number;
  level: number;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: number;
  expires_at: string;
}

export interface QuestCompletion {
  id: number;
  user_id: number;
  quest_id: number;
  completed_at: string;
  mood: string | null;
  journal_note: string | null;
  xp_earned: number;
}

export interface UserBadge {
  id: number;
  user_id: number;
  badge_id: string;
  earned_at: string;
}

// Auth functions
export function createUser(email: string, username: string, password: string): User | null {
  const password_hash = hashSync(password, 10);
  try {
    const result = db.prepare(
      "INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)"
    ).run(email, username, password_hash);
    return getUserById(result.lastInsertRowid as number);
  } catch {
    return null;
  }
}

export function validateCredentials(email: string, password: string): User | null {
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
  if (!user) return null;
  if (!compareSync(password, user.password_hash)) return null;
  return { ...user, password_hash: undefined };
}

export function getUserById(id: number): User | null {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as any;
  if (!user) return null;
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

export function getUserByEmail(email: string): User | null {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as User | null;
}

export function getUserByUsername(username: string): User | null {
  return db.prepare("SELECT * FROM users WHERE username = ?").get(username) as User | null;
}

// Session functions
export function createSession(userId: number): Session {
  const id = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
  db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").run(id, userId, expiresAt);
  return { id, user_id: userId, expires_at: expiresAt };
}

export function getSession(id: string): Session | null {
  return db.prepare("SELECT * FROM sessions WHERE id = ? AND expires_at > datetime('now')").get(id) as Session | null;
}

export function deleteSession(id: string): void {
  db.prepare("DELETE FROM sessions WHERE id = ?").run(id);
}

export function deleteUserSessions(userId: number): void {
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
}

// XP and Level functions
export function addXP(userId: number, amount: number): { newXP: number; newLevel: number; leveledUp: boolean } {
  const user = getUserById(userId);
  if (!user) return { newXP: 0, newLevel: 1, leveledUp: false };

  const newXP = user.xp + amount;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > user.level;

  db.prepare("UPDATE users SET xp = ?, level = ? WHERE id = ?").run(newXP, newLevel, userId);
  return { newXP, newLevel, leveledUp };
}

export function calculateLevel(xp: number): number {
  // Level formula: each level requires 100 * level XP
  // Level 1: 0 XP, Level 2: 100 XP, Level 3: 300 XP, Level 4: 600 XP, etc.
  let level = 1;
  let xpRequired = 0;
  while (xp >= xpRequired + level * 100) {
    xpRequired += level * 100;
    level++;
  }
  return level;
}

export function getXPForNextLevel(currentLevel: number): number {
  return currentLevel * 100;
}

export function getXPProgress(xp: number, level: number): { current: number; required: number; percentage: number } {
  let xpRequired = 0;
  for (let l = 1; l < level; l++) {
    xpRequired += l * 100;
  }
  const current = xp - xpRequired;
  const required = level * 100;
  return {
    current,
    required,
    percentage: Math.min(100, (current / required) * 100)
  };
}

// Quest completion functions
export function completeQuest(
  userId: number,
  questId: number,
  xpEarned: number,
  mood?: string,
  journalNote?: string
): QuestCompletion | null {
  try {
    const result = db.prepare(`
      INSERT INTO quest_completions (user_id, quest_id, xp_earned, mood, journal_note)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, questId, xpEarned, mood || null, journalNote || null);

    // Add XP to user
    addXP(userId, xpEarned);

    return db.prepare("SELECT * FROM quest_completions WHERE id = ?").get(result.lastInsertRowid) as QuestCompletion;
  } catch {
    return null; // Already completed
  }
}

export function getUserCompletions(userId: number): QuestCompletion[] {
  return db.prepare("SELECT * FROM quest_completions WHERE user_id = ? ORDER BY completed_at DESC").all(userId) as QuestCompletion[];
}

export function hasCompletedQuest(userId: number, questId: number): boolean {
  const result = db.prepare("SELECT 1 FROM quest_completions WHERE user_id = ? AND quest_id = ?").get(userId, questId);
  return !!result;
}

// Badge functions
export function awardBadge(userId: number, badgeId: string): boolean {
  try {
    db.prepare("INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)").run(userId, badgeId);
    return true;
  } catch {
    return false; // Already has badge
  }
}

export function getUserBadges(userId: number): UserBadge[] {
  return db.prepare("SELECT * FROM user_badges WHERE user_id = ? ORDER BY earned_at DESC").all(userId) as UserBadge[];
}

export function hasBadge(userId: number, badgeId: string): boolean {
  const result = db.prepare("SELECT 1 FROM user_badges WHERE user_id = ? AND badge_id = ?").get(userId, badgeId);
  return !!result;
}

export function getAllUserBadges(userId: number): string[] {
  const badges = getUserBadges(userId);
  return badges.map(b => b.badge_id);
}

// Cleanup expired sessions
export function cleanupExpiredSessions(): void {
  db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();
}

// Password reset functions
export function createPasswordResetToken(email: string): { token: string; success: boolean; error?: string } {
  const user = getUserByEmail(email);
  if (!user) {
    return { token: "", success: false, error: "email not found" };
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  db.prepare("INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)").run(user.id, token, expiresAt);

  return { token, success: true };
}

export function getValidResetToken(token: string): { userId: number; email: string } | null {
  const result = db.prepare(`
    SELECT u.id as user_id, u.email
    FROM password_reset_tokens t
    JOIN users u ON u.id = t.user_id
    WHERE t.token = ? AND t.expires_at > datetime('now') AND t.used = 0
  `).get(token) as { user_id: number; email: string } | undefined;

  return result ? { userId: result.user_id, email: result.email } : null;
}

export function markResetTokenUsed(token: string): void {
  db.prepare("UPDATE password_reset_tokens SET used = 1 WHERE token = ?").run(token);
}

export function resetPassword(token: string, newPassword: string): { success: boolean; error?: string } {
  const tokenData = getValidResetToken(token);
  if (!tokenData) {
    return { success: false, error: "Invalid or expired reset token" };
  }

  const password_hash = hashSync(newPassword, 10);
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(password_hash, tokenData.userId);
  markResetTokenUsed(token);

  return { success: true };
}

export { db };