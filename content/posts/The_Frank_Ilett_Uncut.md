---
date: "2026-02-13"
description: "A playful Manchester United win-streak predictor inspired by Frank Ilett's no-haircut challenge."
featuredImage: "/images/frank_illet.png"
title: "⚽ Frank Ilett & The Uncut Hair Bet"
---
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>⚽ Frank Ilett & The Uncut Hair Bet: Manchester United Win Predictor</title>
<img src="/images/frank_illet.png" alt="A soccer pitch for an international match" style="width:100%; max-width:800px; display:block; margin:20px auto; border-radius:12px;">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #34495e;
  padding: 30px;
  max-width: 900px;
  margin: auto;
}
h1, h2, h3 {
  color: #2c3e50;
}
h2 {
  color: #e74c3c;
  margin-top: 40px;
}
img {
  width: 100%;
  max-width: 800px;
  display: block;
  margin: 20px auto;
  border-radius: 12px;
}
pre {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 10px;
  overflow: auto;
  font-size: 14px;
}
a.button {
  display: inline-block;
  background: #e74c3c;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  margin-top: 10px;
}
p.center {
  text-align: center;
  font-size: 18px;
  color: #2c3e50;
  margin-top: 30px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
th {
  background-color: #e74c3c;
  color: white;
}
</style>
</head>
<body>

<p>
This project predicts Manchester United’s upcoming match outcomes and simulates the probability of consecutive wins — inspired by <strong>Frank Ilett’s unique challenge</strong>. Frank has declared that he will <strong>not cut his hair until Manchester United wins 5 matches in a row</strong>. Based on predictions and simulations, it looks like the Red Devils won’t manage a 5-win streak this season, so Frank’s hair will remain uncut until the end of the season.
</p>

<h2>What This Project Does</h2>

<ul>
<li><strong>Loads historical Premier League data</strong> from <code>E0.csv</code>.</li>
<li><strong>Calculates team and opponent strength</strong> (average points per game).</li>
<li><strong>Creates a target variable</strong> (<code>MU_win</code>) to indicate Manchester United victories.</li>
<li><strong>Trains a Random Forest model</strong> to estimate win probabilities using:
  <ul>
    <li>Home/away status</li>
    <li>Opponent strength (average PPG)</li>
  </ul>
</li>
<li><strong>Loads future fixtures</strong> and predicts the probability of winning each match.</li>
<li><strong>Simulates streaks of consecutive wins</strong> using Monte Carlo simulations.</li>
<li><strong>Outputs results</strong> to <code>manutd_predictions_fixed.csv</code> for easy review.</li>
</ul>

<h2>Fun Fact</h2>
<p>
Frank Ilett will <strong>not cut his hair until the end of the season</strong>, so every predicted win streak is a reminder of his growing mane!
</p>

<h2>Results</h2>

<pre>
→ Loaded 259 matches from E0.csv
→ Opponent strength (avg PPG) calculated for 20 teams

Manchester United record in data (26 matches):
  Wins   : 12
  Draws  : 9
  Losses : 5

→ Creating target and features...
  → Wins detected: 12
</pre>

<h2>Predicted Upcoming Matches</h2>

<table>
<tr>
<th>Date</th>
<th>Home</th>
<th>Away</th>
<th>Win %</th>
<th>Prediction</th>
</tr>
<tr><td>2026-02-23</td><td>Everton</td><td>Manchester United</td><td>0.1%</td><td>NO WIN</td></tr>
<tr><td>2026-03-01</td><td>Manchester United</td><td>Crystal Palace</td><td>99.2%</td><td>WIN</td></tr>
<tr><td>2026-03-04</td><td>Newcastle United</td><td>Manchester United</td><td>0.1%</td><td>NO WIN</td></tr>
<tr><td>2026-03-15</td><td>Manchester United</td><td>Aston Villa</td><td>89.0%</td><td>WIN</td></tr>
<tr><td>2026-03-20</td><td>Bournemouth</td><td>Manchester United</td><td>0.1%</td><td>NO WIN</td></tr>
<tr><td>2026-04-11</td><td>Manchester United</td><td>Leeds United</td><td>89.8%</td><td>WIN</td></tr>
<tr><td>2026-04-18</td><td>Chelsea</td><td>Manchester United</td><td>0.4%</td><td>NO WIN</td></tr>
<tr><td>2026-04-25</td><td>Manchester United</td><td>Brentford</td><td>69.9%</td><td>WIN</td></tr>
<tr><td>2026-05-02</td><td>Manchester United</td><td>Liverpool</td><td>69.9%</td><td>WIN</td></tr>
<tr><td>2026-05-09</td><td>Sunderland</td><td>Manchester United</td><td>0.1%</td><td>NO WIN</td></tr>
<tr><td>2026-05-17</td><td>Manchester United</td><td>Nottingham Forest</td><td>89.8%</td><td>WIN</td></tr>
<tr><td>2026-05-24</td><td>Brighton & Hove Albion</td><td>Manchester United</td><td>0.1%</td><td>NO WIN</td></tr>
</table>

<h2>5-Consecutive Win Simulation</h2>
<pre>
Probability of at least one 5-win streak:
→ 0.0%
→ Low to moderate
</pre>

<p class="center">
⚡ Predicting the Red Devils’ fate — and Frank’s hair — one match at a time!
</p>

</body>
</html>
