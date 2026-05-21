import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { quests } from "@/data/quests";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function QuestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quest = quests.find((q) => q.id === Number(id));
  const [completed, setCompleted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [mood, setMood] = useState("");
  const [journalNote, setJournalNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!quest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1f16] to-background p-6">
        <div className="mx-auto max-w-2xl">
          <Link to="/" className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2">
            ← Back to quests
          </Link>
          <div className="text-center py-20 text-muted-foreground">Quest not found</div>
        </div>
      </div>
    );
  }

  const handleComplete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quest/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          quest_id: quest.id,
          mood,
          journal_note: journalNote
        }),
      });

      if (res.ok) {
        setCompleted(true);
        setShowCompletion(true);
      } else if (res.status === 401) {
        navigate("/auth");
      }
    } catch (err) {
      console.error("Failed to complete quest:", err);
    }
    setLoading(false);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1f16] to-background">
      <div className="mx-auto max-w-2xl p-6">
        <Link to="/" className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm">
          ← Back to quests
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="text-xs">
              {quest.category}
            </Badge>
            {quest.solo ? (
              <Badge variant="outline" className="text-xs">Solo</Badge>
            ) : (
              <Badge variant="outline" className="text-xs">Social</Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold text-[#f5f1e8] mb-3">{quest.title}</h1>
          <p className="text-[#aaa39a] leading-relaxed">{quest.description}</p>
        </div>

        <div className="bg-[#262820] rounded-xl p-5 mb-6 border border-[#3a3f32]">
          <h3 className="text-sm font-medium text-[#8a8577] mb-3 uppercase tracking-wide">Quest Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-[#6a665a] mb-1">Duration</div>
              <div className="text-[#d8d4c8] font-medium">{formatDuration(quest.duration_minutes)}</div>
            </div>
            <div>
              <div className="text-xs text-[#6a665a] mb-1">XP Reward</div>
              <div className="text-[#d8a657] font-bold text-lg">{quest.xp} XP</div>
            </div>
            <div>
              <div className="text-xs text-[#6a665a] mb-1">Location</div>
              <div className="text-[#d8d4c8]">{quest.location || "Anywhere"}</div>
            </div>
            <div>
              <div className="text-xs text-[#6a665a] mb-1">Type</div>
              <div className="text-[#d8d4c8]">{quest.solo ? "Solo" : "Social"}</div>
            </div>
          </div>
          {quest.equipment && quest.equipment !== "None" && (
            <div className="mt-4 pt-4 border-t border-[#3a3f32]">
              <div className="text-xs text-[#6a665a] mb-1">Equipment</div>
              <div className="text-[#d8d4c8] text-sm">{quest.equipment}</div>
            </div>
          )}
        </div>

        {!completed ? (
          <Button
            onClick={handleComplete}
            disabled={loading}
            className="w-full bg-[#d8a657] hover:bg-[#c4963f] text-[#1a1f16] font-semibold py-6 text-lg rounded-xl transition-colors"
          >
            {loading ? "Completing..." : `Complete Quest (+${quest.xp} XP)`}
          </Button>
        ) : (
          <div className="text-center py-6 text-[#6a9a5a] bg-[#2a3520] rounded-xl border border-[#4a6a3a]">
            Quest completed! ✓
          </div>
        )}

        {showCompletion && completed && (
          <div className="mt-6 bg-[#2a3520] rounded-xl p-5 border border-[#4a6a3a] text-center">
            <div className="text-3xl font-bold text-[#8ac46a] mb-2">+{quest.xp} XP</div>
            <p className="text-[#a8c88a] text-sm">Quest marked as complete!</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 text-sm text-[#8ac46a] hover:underline"
            >
              Continue exploring →
            </button>
          </div>
        )}

        {!completed && !showCompletion && (
          <div className="mt-6 bg-[#262820] rounded-xl p-5 border border-[#3a3f32]">
            <h3 className="text-sm font-medium text-[#8a8577] mb-3 uppercase tracking-wide">How was it? (optional)</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="mood">Mood</Label>
                <input
                  id="mood"
                  type="text"
                  placeholder="How did you feel?"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                />
              </div>
              <div>
                <Label htmlFor="journal">Journal</Label>
                <textarea
                  id="journal"
                  placeholder="Write about your experience..."
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white min-h-[100px]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}