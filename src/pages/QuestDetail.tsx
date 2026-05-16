import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { quests } from "@/data/quests";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function QuestDetail() {
  const { id } = useParams();
  const quest = quests.find((q) => q.id === Number(id));
  const [completed, setCompleted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

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

  const handleComplete = () => {
    setShowCompletion(true);
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
            {quest.equipment && (
              <Badge variant="outline" className="text-xs">
                {quest.equipment}
              </Badge>
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
              <div className="text-[#d8d4c8] font-medium">{quest.duration}</div>
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
              <div className="text-[#d8d4c8]">{quest.questType}</div>
            </div>
          </div>
          {quest.equipment && (
            <div className="mt-4 pt-4 border-t border-[#3a3f32]">
              <div className="text-xs text-[#6a665a] mb-1">Equipment</div>
              <div className="text-[#d8d4c8] text-sm">{quest.equipment}</div>
            </div>
          )}
        </div>

        {!completed ? (
          <Button
            onClick={handleComplete}
            className="w-full bg-[#d8a657] hover:bg-[#c4963f] text-[#1a1f16] font-semibold py-6 text-lg rounded-xl transition-colors"
          >
            Complete Quest (+{quest.xp} XP)
          </Button>
        ) : (
          <div className="text-center py-6 text-[#6a9a5a]">
            Quest completed! ✓
          </div>
        )}

        {showCompletion && !completed && (
          <div className="mt-6 bg-[#2a3520] rounded-xl p-5 border border-[#4a6a3a] text-center">
            <div className="text-3xl font-bold text-[#8ac46a] mb-2">+{quest.xp} XP</div>
            <p className="text-[#a8c88a] text-sm">Quest marked as complete!</p>
            <button
              onClick={() => setCompleted(true)}
              className="mt-4 text-sm text-[#8ac46a] hover:underline"
            >
              Continue exploring →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}