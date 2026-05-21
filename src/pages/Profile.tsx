import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { quests } from "@/data/quests";
import { achievements, getAchievementById, rarityColors } from "@/data/achievements";
import { IconFlame, IconTrophy, IconStar, IconArrowLeft, IconCheck } from "@tabler/icons-react";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [xpProgress, setXpProgress] = useState({ current: 0, required: 100, percentage: 0 });
  const [completionsCount, setCompletionsCount] = useState(0);
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const [recentBadges, setRecentBadges] = useState<string[]>([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile", {
        credentials: "include"
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          // Redirect to auth if not logged in
          window.location.href = "/auth";
          return;
        }
        throw new Error(data.error || "Failed to load profile");
      }

      setUser(data.user);
      setXpProgress(data.xpProgress);
      setCompletionsCount(data.completionsCount);
      setUserBadges(data.badges || []);
      setRecentBadges(data.recentBadges || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });
    window.location.href = "/";
  };

  if (loading) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="quest-out-theme">
        <div className="min-h-screen bg-[#0c0c0c] text-white flex items-center justify-center">
          <div className="text-orange-500">Loading profile...</div>
        </div>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="quest-out-theme">
        <div className="min-h-screen bg-[#0c0c0c] text-white flex items-center justify-center">
          <Card className="bg-zinc-900 border-zinc-800 max-w-md">
            <CardContent className="p-6 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Link to="/">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </ThemeProvider>
    );
  }

  // Get earned achievements
  const earnedAchievements = achievements.filter(a => userBadges.includes(a.id));

  // Group by rarity
  const groupedByRarity = {
    legendary: earnedAchievements.filter(a => a.rarity === "legendary"),
    epic: earnedAchievements.filter(a => a.rarity === "epic"),
    rare: earnedAchievements.filter(a => a.rarity === "rare"),
    uncommon: earnedAchievements.filter(a => a.rarity === "uncommon"),
    common: earnedAchievements.filter(a => a.rarity === "common"),
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="quest-out-theme">
      <div className="min-h-screen bg-[#0c0c0c] text-white">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0c0c0c]/95 backdrop-blur">
          <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white">
                <IconArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <IconFlame className="h-6 w-6 text-orange-500" />
              <span className="text-lg font-bold">Quest Out</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-white/70 hover:text-white"
            >
              Logout
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
          {/* User Info */}
          <section className="grid md:grid-cols-3 gap-6">
            {/* XP Card */}
            <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-orange-400">Level {user?.level || 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-orange-500 mb-2">{user?.xp || 0} XP</div>
                <div className="w-full bg-zinc-800 rounded-full h-2 mb-1">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${xpProgress.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-400">{xpProgress.current} / {xpProgress.required} to next level</p>
              </CardContent>
            </Card>

            {/* Quests Completed */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-400">Quests Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{completionsCount}</div>
                <p className="text-xs text-zinc-400 mt-1">of {quests.length} quests</p>
                <div className="w-full bg-zinc-800 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(completionsCount / quests.length) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Badges Earned */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-400">Badges Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{userBadges.length}</div>
                <p className="text-xs text-zinc-400 mt-1">of {achievements.length} achievements</p>
                <div className="w-full bg-zinc-800 rounded-full h-2 mt-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(userBadges.length / achievements.length) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Recent Badges */}
          {recentBadges.length > 0 && (
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconTrophy className="h-5 w-5 text-purple-400" />
                  New Badges Earned!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {recentBadges.map(badgeId => {
                    const achievement = getAchievementById(badgeId);
                    if (!achievement) return null;
                    return (
                      <div
                        key={badgeId}
                        className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center gap-2"
                      >
                        <IconStar className="h-4 w-4" style={{ color: rarityColors[achievement.rarity] }} />
                        <span className="font-medium">{achievement.name}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Achievements by Rarity */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <IconTrophy className="h-6 w-6 text-yellow-500" />
              Your Achievements
            </h2>

            {earnedAchievements.length === 0 ? (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-8 text-center text-zinc-400">
                  <IconTrophy className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
                  <p>No achievements yet. Complete quests to earn badges!</p>
                  <Link to="/" className="mt-4 inline-block">
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      Browse Quests
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {(["legendary", "epic", "rare", "uncommon", "common"] as const).map(rarity => {
                  const items = groupedByRarity[rarity];
                  if (items.length === 0) return null;
                  return (
                    <div key={rarity}>
                      <h3 className="text-sm font-medium text-zinc-400 mb-2 capitalize">
                        {rarity} ({items.length})
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {items.map(achievement => (
                          <Card
                            key={achievement.id}
                            className="bg-zinc-900 border-zinc-800"
                            style={{ borderColor: `${rarityColors[achievement.rarity]}40` }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <IconStar
                                  className="h-6 w-6 mt-1"
                                  style={{ color: rarityColors[achievement.rarity] }}
                                />
                                <div>
                                  <h4 className="font-medium">{achievement.name}</h4>
                                  <p className="text-sm text-zinc-400">{achievement.description}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </ThemeProvider>
  );
}