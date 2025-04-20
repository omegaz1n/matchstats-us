import { useState } from "react";

export default function MatchStatsUS() {
  const [matchId, setMatchId] = useState("");
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setMatchData(null);
    try {
      const response = await fetch("https://matchstats.sea.ffesports.com/api/match_stats/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search: matchId }),
      });

      if (!response.ok) throw new Error("Match not found or server unavailable");

      const data = await response.json();
      setMatchData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(matchData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `match-${matchId}.json`;
    a.click();
  };

  const downloadCSV = () => {
    if (!matchData?.teams) return;
    const rows = [
      ["Team", "Player", "Kills", "Damage"]
    ];

    matchData.teams.forEach(team => {
      team.players.forEach(player => {
        rows.push([team.name, player.name, player.kills, player.damage]);
      });
    });

    const csvContent = rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `match-${matchId}.csv`;
    a.click();
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Match Stats - Free Fire US</h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter Match ID"
          value={matchId}
          onChange={(e) => setMatchId(e.target.value)}
          className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-yellow-500 rounded text-black font-semibold hover:bg-yellow-400"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {matchData && (
        <>
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={downloadJSON}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
            >
              Download JSON
            </button>
            <button
              onClick={downloadCSV}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            >
              Download CSV
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchData.teams?.map((team, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl shadow-md p-4">
                <h2 className="text-xl font-semibold mb-2">{team.name}</h2>
                <ul className="pl-4 list-disc text-sm">
                  {team.players.map((player, i) => (
                    <li key={i}>{player.name} - {player.kills} kills - {player.damage} dmg</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
