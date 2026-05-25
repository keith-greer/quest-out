import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { quests } from "@/data/quests";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import HeaderMenu from "@/components/HeaderMenu";
import { themes } from "@/components/theme-provider";

export default function QuestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quest = quests.find((q) => q.id === Number(id));
  const [user, setUser] = useState<{ username: string; avatar?: string } | null>(null);
  const [completed, setCompleted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [mood, setMood] = useState("");
  const [journalNote, setJournalNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser();
    if (quest) {
      checkCompletion();
    }
  }, [id]);

  async function fetchUser() {
    try {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch {}
  }

  async function checkCompletion() {
    try {
      const res = await fetch(`/api/completed/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCompleted(data.completed);
      }
    } catch {}
  }

  if (!quest) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Quest not found</h1>
          <Link to="/" className="text-emerald-400 hover:underline">Back to quests</Link>
        </div>
      </div>
    );
  }

  async function handleComplete() {
    if (!user) {
      navigate("/auth");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quest_id: quest.id, mood, journal_note: journalNote }),
      });
      if (res.ok) {
        setShowCompletion(true);
        setCompleted(true);
      }
    } catch {}
    setLoading(false);
  }

  async function handleSignOut() {
    try {
      await fetch("/api/logout", { method: "POST" });
      setUser(null);
      window.location.reload();
    } catch {}
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur border-b border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg">Quest Out</Link>
          <div className="flex items-center gap-3">
            {user ? (
              <HeaderMenu user={user} onSignOut={handleSignOut} />
            ) : (
              <Link to="/auth" className="text-sm text-zinc-400 hover:text-white">Sign in</Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Quest header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="bg-emerald-900/40 text-emerald-300 border-emerald-700">
              {quest.category}
            </Badge>
            <Badge variant="secondary" className="bg-amber-900/40 text-amber-300 border-amber-700">
              {quest.xp} XP
            </Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">{quest.title}</h1>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {quest.location}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              {quest.duration_minutes} min
            </span>
            <span className="flex items-center gap-1">
              {quest.solo ? "Solo" : "Social"}
            </span>
          </div>
        </div>

        {/* Description */}
        <section className="mb-8">
          <p className="text-zinc-300 leading-relaxed">{quest.description}</p>
        </section>

        {/* How to do it */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">How to do it</h2>
          <ul className="space-y-2">
            {quest.how_to_steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-zinc-300">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-sm text-zinc-400">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </section>

        {/* What to bring */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">What to bring</h2>
          <div className="flex flex-wrap gap-2">
            {quest.equipment.split(", ").map((item, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-zinc-800 text-sm text-zinc-300">
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* Safety note */}
        <section className="mb-8 p-4 rounded-lg bg-amber-900/20 border border-amber-800">
          <h2 className="text-lg font-semibold mb-2 text-amber-300">⚠️ Safety note</h2>
          <p className="text-sm text-zinc-300">{quest.safety_note}</p>
        </section>

        {/* Completion */}
        {completed || showCompletion ? (
          <div className="text-center p-8 rounded-lg bg-emerald-900/20 border border-emerald-800">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-emerald-300 mb-2">Quest Complete!</h2>
            <p className="text-zinc-400">You earned <span className="text-amber-300 font-bold">+{quest.xp} XP</span></p>
            {mood && <p className="text-sm text-zinc-500 mt-2">Mood: {mood}</p>}
            <Link to="/" className="inline-block mt-4 text-emerald-400 hover:underline">
              Browse more quests →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleComplete}
              disabled={loading}
              className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-white transition-colors disabled:opacity-50"
            >
              {loading ? "Completing..." : "Complete Quest"}
            </button>

            {user && !completed && (
              <div className="space-y-3 p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                <Label>How did it feel? (optional)</Label>
                <div className="flex gap-2">
                  {["Amazing 😄", "Good 🙂", "Okay 😐", "Tough 😓", "Epic 🤩"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMood(m)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${mood === m ? "bg-emerald-700 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Write a quick journal note... (optional)"
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>
            )}

            {!user && (
              <p className="text-center text-sm text-zinc-500">
                <Link to="/auth" className="text-emerald-400 hover:underline">Sign in</Link> to track your progress and earn XP
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
