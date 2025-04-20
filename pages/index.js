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

  return (
    <main style={{ padding: "2rem", background: "#000", color: "#fff", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", textAlign: "center" }}>Match Stats - Free Fire US</h1>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", margin: "2rem 0" }}>
        <input
          type="text"
          placeholder="Enter Match ID"
          value={matchId}
          onChange={(e) => setMatchId(e.target.value)}
          style={{ padding: "0.5rem", width: "300px" }}
        />
        <button onClick={handleSearch} style={{ padding: "0.5rem 1rem", background: "#FFD700", border: "none" }}>
          Search
        </button>
      </div>
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}
      {matchData && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
          {matchData.teams?.map((team, index) => (
            <div key={index} style={{ border: "1px solid #444", padding: "1rem", borderRadius: "8px" }}>
              <h2>{team.name}</h2>
              <ul>
                {team.players.map((player, i) => (
                  <li key={i}>{player.name} - {player.kills} kills - {player.damage} dmg</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
