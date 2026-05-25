import { serveStatic } from "hono/bun";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import type { ViteDevServer } from "vite";
import { createServer as createViteServer } from "vite";
import config from "./zosite.json";
import { Hono } from "hono";
import {
  createUser,
  validateCredentials,
  getUserById,
  getSession,
  deleteSession,
  createSession,
  addXP,
  completeQuest,
  getUserCompletions,
  hasCompletedQuest,
  getUserBadges,
  awardBadge,
  getXPProgress,
  cleanupExpiredSessions,
  createPasswordResetToken,
  resetPassword
} from "./src/data/auth-db";
import { achievements } from "./src/data/achievements";
import { quests } from "./src/data/quests";

// AI agents: read README.md for navigation and contribution guidance.
type Mode = "development" | "production";
const app = new Hono();

const mode: Mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

/**
 * Add any API routes here.
 */
app.get("/api/hello-zo", (c) => c.json({ msg: "Hello from Zo" }));

// Auth routes
app.post("/api/auth/register", async (c) => {
  const { email, username, password } = await c.req.json();
  if (!email || !username || !password) {
    return c.json({ error: "All fields required" }, 400);
  }
  if (password.length < 6) {
    return c.json({ error: "Password must be at least 6 characters" }, 400);
  }
  const user = createUser(email, username, password);
  if (!user) {
    return c.json({ error: "Email or username already exists" }, 400);
  }
  const session = createSession(user.id);
  setCookie(c, "session", session.id, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/"
  });
  return c.json({ user });
});

app.post("/api/auth/login", async (c) => {
  const { email, password } = await c.req.json();
  if (!email || !password) {
    return c.json({ error: "Email and password required" }, 400);
  }
  const user = validateCredentials(email, password);
  if (!user) {
    return c.json({ error: "Invalid credentials" }, 401);
  }
  const session = createSession(user.id);
  setCookie(c, "session", session.id, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/"
  });
  return c.json({ user });
});

app.post("/api/auth/logout", async (c) => {
  const sessionId = getCookie(c, "session");
  if (sessionId) {
    deleteSession(sessionId);
  }
  deleteCookie(c, "session", { path: "/" });
  return c.json({ success: true });
});

app.post("/api/auth/forgot-password", async (c) => {
  const { email } = await c.req.json();
  if (!email) {
    return c.json({ error: "Email required" }, 400);
  }
  const result = createPasswordResetToken(email);
  if (!result.success) {
    return c.json({ error: result.error }, 404);
  }
  // In production, you would send an email here with the reset link
  // For now, we'll log it (or you could return it for testing)
  console.log(`Password reset token for ${email}: ${result.token}`);
  return c.json({ success: true, message: "If that email exists, a reset link has been sent." });
});

app.post("/api/auth/reset-password", async (c) => {
  const { token, password } = await c.req.json();
  if (!token || !password) {
    return c.json({ error: "Token and password required" }, 400);
  }
  if (password.length < 6) {
    return c.json({ error: "Password must be at least 6 characters" }, 400);
  }
  const result = resetPassword(token, password);
  if (!result.success) {
    return c.json({ error: result.error }, 400);
  }
  return c.json({ success: true, message: "Password has been reset." });
});

app.get("/api/auth/me", async (c) => {
  const sessionId = getCookie(c, "session");
  if (!sessionId) {
    return c.json({ user: null });
  }
  cleanupExpiredSessions();
  const session = getSession(sessionId);
  if (!session) {
    deleteCookie(c, "session", { path: "/" });
    return c.json({ user: null });
  }
  const user = getUserById(session.user_id);
  return c.json({ user });
});

// Quest completion routes
app.post("/api/quest/complete", async (c) => {
  const sessionId = getCookie(c, "session");
  if (!sessionId) {
    return c.json({ error: "Not authenticated" }, 401);
  }
  cleanupExpiredSessions();
  const session = getSession(sessionId);
  if (!session) {
    return c.json({ error: "Session expired" }, 401);
  }

  const { quest_id, mood, journal_note } = await c.req.json();
  const questId = parseInt(quest_id, 10);
  const quest = quests.find(q => q.id === questId);

  if (!quest) {
    return c.json({ error: "Quest not found" }, 404);
  }

  if (hasCompletedQuest(session.user_id, questId)) {
    return c.json({ error: "Quest already completed" }, 400);
  }

  // Get XP from quest data
  const xpEarned = quest.xp || 100;

  const completion = completeQuest(session.user_id, questId, xpEarned, mood, journal_note);
  if (!completion) {
    return c.json({ error: "Failed to complete quest" }, 500);
  }

  const xpResult = addXP(session.user_id, xpEarned);
  const user = getUserById(session.user_id);

  return c.json({ completion, xpResult, user, xpEarned });
});

app.get("/api/user/completions", async (c) => {
  const sessionId = getCookie(c, "session");
  if (!sessionId) {
    return c.json({ error: "Not authenticated" }, 401);
  }
  cleanupExpiredSessions();
  const session = getSession(sessionId);
  if (!session) {
    return c.json({ error: "Session expired" }, 401);
  }

  const completions = getUserCompletions(session.user_id);
  return c.json({ completions });
});

// User profile with XP and badges
app.get("/api/user/profile", async (c) => {
  const sessionId = getCookie(c, "session");
  if (!sessionId) {
    return c.json({ error: "Not authenticated" }, 401);
  }
  cleanupExpiredSessions();
  const session = getSession(sessionId);
  if (!session) {
    return c.json({ error: "Session expired" }, 401);
  }

  const user = getUserById(session.user_id);
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  const completions = getUserCompletions(session.user_id);
  const badges = getUserBadges(session.user_id);
  const xpProgress = getXPProgress(user.xp, user.level);

  // Check for new achievements
  const newBadges: string[] = [];
  const questIds = completions.map(c => c.quest_id);

  // Check quest completion badges
  for (const achievement of achievements) {
    if (achievement.category === "quest" && questIds.includes(parseInt(achievement.id.split("_")[1], 10))) {
      if (!badges.find(b => b.badge_id === achievement.id)) {
        awardBadge(session.user_id, achievement.id);
        newBadges.push(achievement.id);
      }
    }
  }

  // Check XP milestones
  const xpBadges = ["xp_100", "xp_500", "xp_1000", "xp_5000", "xp_10000"];
  for (const badgeId of xpBadges) {
    const achievement = achievements.find(a => a.id === badgeId);
    if (achievement && user.xp >= parseInt(badgeId.split("_")[1], 10)) {
      if (!badges.find(b => b.badge_id === badgeId)) {
        awardBadge(session.user_id, badgeId);
        newBadges.push(badgeId);
      }
    }
  }

  // Check level milestones
  const levelBadges = ["level_5", "level_10", "level_25", "level_50", "level_100"];
  for (const badgeId of levelBadges) {
    const achievement = achievements.find(a => a.id === badgeId);
    if (achievement && user.level >= parseInt(badgeId.split("_")[1], 10)) {
      if (!badges.find(b => b.badge_id === badgeId)) {
        awardBadge(session.user_id, badgeId);
        newBadges.push(badgeId);
      }
    }
  }

  // Check quest count milestones
  const questCountBadges = [
    { id: "quests_5", count: 5 },
    { id: "quests_10", count: 10 },
    { id: "quests_25", count: 25 },
    { id: "quests_45", count: 45 }
  ];
  for (const { id, count } of questCountBadges) {
    const achievement = achievements.find(a => a.id === id);
    if (achievement && completions.length >= count) {
      if (!badges.find(b => b.badge_id === id)) {
        awardBadge(session.user_id, id);
        newBadges.push(id);
      }
    }
  }

  return c.json({
    user,
    xpProgress,
    completionsCount: completions.length,
    badgesCount: badges.length + newBadges.length,
    recentBadges: newBadges
  });
});

// Get all achievements
app.get("/api/achievements", async (c) => {
  return c.json({ achievements });
});

if (mode === "production") {
  configureProduction(app);
} else {
  await configureDevelopment(app);
}

/**
 * Determine port based on mode. In production, use the published_port if available.
 * In development, always use the local_port.
 * Ports are managed by the system and injected via the PORT environment variable.
 */
const port = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : mode === "production"
    ? (config.publish?.published_port ?? config.local_port)
    : config.local_port;

export default { fetch: app.fetch, port, idleTimeout: 255 };

/**
 * Configure routing for production builds.
 *
 * - Streams prebuilt assets from `dist`.
 * - Static files from `public/` are copied to `dist/` by Vite and served at root paths.
 * - Falls back to `index.html` for any other GET so the SPA router can resolve the request.
 */
function configureProduction(app: Hono) {
  // Serve static assets from dist/assets
  app.use("/assets/*", async (c) => {
    const path = c.req.path.replace("/assets/", "");
    const file = Bun.file(`./dist/assets/${path}`);
    if (await file.exists()) {
      return new Response(file);
    }
    return c.text("Not found", 404);
  });

  // Serve other static files from dist (favicon, images, etc.)
  app.use(async (c, next) => {
    const path = c.req.path;
    if (path.startsWith("/api/")) return next();

    const file = Bun.file(`./dist${path}`);
    if (await file.exists()) {
      const stat = await file.stat();
      if (stat && !stat.isDirectory()) {
        return new Response(file);
      }
    }

    // Fallback to index.html for SPA
    return new Response(Bun.file("./dist/index.html"));
  });
}

/**
 * Configure routing for development builds.
 *
 * - Boots Vite in middleware mode for transforms.
 * - Static files from `public/` are served at root paths (matching Vite convention).
 * - Mirrors production routing semantics so SPA routes behave consistently.
 */
async function configureDevelopment(app: Hono): Promise<ViteDevServer> {
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });

  app.use("*", async (c, next) => {
    if (c.req.path.startsWith("/api/")) return next();
    if (c.req.path === "/favicon.ico") return c.redirect("/favicon.svg", 302);

    const url = c.req.path;
    try {
      if (url === "/" || url === "/index.html") {
        let template = await Bun.file("./index.html").text();
        template = await vite.transformIndexHtml(url, template);
        return c.html(template, {
          headers: { "Cache-Control": "no-store, must-revalidate" },
        });
      }

      const publicFile = Bun.file(`./public${url}`);
      if (await publicFile.exists()) {
        const stat = await publicFile.stat();
        if (stat && !stat.isDirectory()) {
          return new Response(publicFile, {
            headers: { "Cache-Control": "no-store, must-revalidate" },
          });
        }
      }

      let result;
      try {
        result = await vite.transformRequest(url);
      } catch {
        result = null;
      }

      if (result) {
        return new Response(result.code, {
          headers: {
            "Content-Type": "application/javascript",
            "Cache-Control": "no-store, must-revalidate",
          },
        });
      }

      let template = await Bun.file("./index.html").text();
      template = await vite.transformIndexHtml("/", template);
      return c.html(template, {
        headers: { "Cache-Control": "no-store, must-revalidate" },
      });
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      console.error(error);
      return c.text("Internal Server Error", 500);
    }
  });

  return vite;
}
