import { useState } from "react";
import { Link } from "react-router-dom";
import { quests, categories } from "../data/quests";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconMapPin, IconClock } from "@tabler/icons-react";

const categoryColors: Record<string, string> = {
  "Dawn & Early Morning": "bg-amber-100 text-amber-800",
  "Darkness & Night": "bg-indigo-100 text-indigo-800",
  Water: "bg-blue-100 text-blue-800",
  "Sleeping Outdoors": "bg-emerald-100 text-emerald-800",
  "Movement / Distance": "bg-orange-100 text-orange-800",
  "Specific Achievement": "bg-red-100 text-red-800",
  "Nature Observation": "bg-green-100 text-green-800",
  Seasonal: "bg-pink-100 text-pink-800",
  "Mindset / Challenge": "bg-purple-100 text-purple-800",
};

function QuestCard({ quest }: { quest: typeof quests[0] }) {
  return (
    <Link to={`/quest/${quest.id}`}>
      <Card className="h-full cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5">
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between">
            <Badge className={categoryColors[quest.category] || "bg-gray-100 text-gray-800"}>
              {quest.category}
            </Badge>
            <span className="text-xs text-muted-foreground">{quest.solo ? "Solo" : "Social"}</span>
          </div>
          <h3 className="mb-1 font-semibold leading-tight">{quest.title}</h3>
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{quest.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <IconMapPin className="size-3" />
              {quest.location}
            </span>
            <span className="flex items-center gap-1">
              <IconClock className="size-3" />
              {quest.duration_minutes < 60 ? `${quest.duration_minutes}m` : `${Math.floor(quest.duration_minutes / 60)}h`}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredQuests = quests.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Quest Out</h1>
            <p className="text-sm text-muted-foreground">Get outside. Get a little wild.</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search quests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`rounded-full px-3 py-1 text-sm ${selectedCategory === "All" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3 py-1 text-sm ${selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>

        {filteredQuests.length === 0 && (
          <p className="text-center text-muted-foreground">No quests found. Try a different search.</p>
        )}
      </div>
    </main>
  );
}