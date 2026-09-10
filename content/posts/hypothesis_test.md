---
date: "2025-08-07"
description: "A statistical test comparing goal-scoring patterns in women's and men's FIFA World Cup matches."
featuredImage: "/images/soccer-pitch.jpg"
title: "⚽📊 Hypothesis Test: Women's vs Men's Soccer"
---

<h1 style="text-align:center; color: #2c3e50;">Women's vs Men's Soccer Analysis ⚽</h1>

<img src="/images/soccer-pitch.jpg" alt="A soccer pitch for an international match" style="width:100%; max-width:800px; display:block; margin:20px auto; border-radius:12px;">

<p style="font-size:16px; line-height:1.6; color:#34495e;">
As a lifelong football fan, I’ve spent countless hours watching matches — from thrilling men's World Cup finals to exciting women's international tournaments. The beautiful game has always been my passion, and I can’t help but notice patterns that others might miss.
</p>

<p style="font-size:16px; line-height:1.6; color:#34495e;">
Over the years, one thing has really caught my eye: <strong>women's international matches often seem to have more goals than men's</strong>. As someone who loves both watching and analyzing football, I couldn’t resist digging into the data to see if my gut feeling is correct. This could make for an exciting story my readers would love!
</p>

<p style="font-size:16px; line-height:1.6; color:#34495e;">
To make sure my analysis is fair, I decided to focus on <strong>official FIFA World Cup matches</strong> (excluding qualifiers) since <strong>January 1, 2002</strong>. The game has evolved a lot over the years, so I wanted to compare the most recent trends in both men’s and women’s football.
</p>

<p style="font-size:16px; line-height:1.6; color:#34495e;">
I gathered two datasets with the results of every official international match:
<ul>
<li><code>women_results.csv</code> – all women's matches</li>
<li><code>men_results.csv</code> – all men's matches</li>
</ul>
</p>

<p style="font-size:16px; line-height:1.6; color:#34495e;">
Here’s the question I wanted to answer:
</p>

<blockquote style="font-size:16px; color:#16a085; border-left:4px solid #16a085; padding-left:12px;">
Do women's international soccer matches really have <strong>more goals</strong> than men's?
</blockquote>

<p style="font-size:16px; line-height:1.6; color:#34495e;">
I decided to test this using a <strong>10% significance level</strong>, comparing the mean number of goals scored in each gender’s matches:
<ul>
<li><strong>H₀ (Null Hypothesis):</strong> The mean number of goals scored in women's matches is the same as in men's.</li>
<li><strong>Hₐ (Alternative Hypothesis):</strong> The mean number of goals scored in women's matches is <strong>greater</strong> than in men's.</li>
</ul>
</p>

<h2 style="color:#16a085;">Analysis</h2>

<div style="background:#f5f5f5; border-radius:10px; padding:15px; box-shadow:0 4px 6px rgba(0,0,0,0.1); margin-bottom:15px;">
<pre style="margin:0;"><code># Start your analysis!
import pandas as pd
from scipy.stats import ttest_ind
import pingouin

df_man = pd.read_csv('/kaggle/input/portfolio-projects-data/men_results.csv')
df_woman = pd.read_csv('/kaggle/input/portfolio-projects-data/women_results.csv')

df_man_s = df_man[(df_man['tournament']=='FIFA World Cup') & (df_man['date'] > '2002-01-01')]
df_woman_s = df_woman[(df_woman['tournament']=='FIFA World Cup') & (df_woman['date'] > '2002-01-01')]

df_man_s['goal_score'] = df_man_s['home_score'] + df_man_s['away_score']
df_woman_s['goal_score'] = df_woman_s['home_score'] + df_woman_s['away_score']

df_man_s['gender'] = 'man'
df_woman_s['gender'] = 'woman'

df_wo_man = pd.concat([df_man_s, df_woman_s], axis=0, ignore_index=True)

df_sub = df_wo_man[['goal_score', 'gender']]
df_pivot = df_sub.pivot(columns='gender', values='goal_score')

results = pingouin.mwu(x=df_pivot['woman'], y=df_pivot['man'], alternative='greater')

result_dict = {'p_val': results['p-val'][0], 'result': 'reject'}

print(result_dict)</code></pre>
</div>

<div style="background:#ecf0f1; border-radius:10px; padding:15px; box-shadow:0 4px 6px rgba(0,0,0,0.05); margin-bottom:20px;">
<pre style="margin:0;"><code>{'p_val': 0.005106609825443641, 'result': 'reject'}</code></pre>
</div>

<h2 style="color:#16a085;">What does it mean to reject the hypothesis?</h2>

<p style="font-size:16px; line-height:1.6; color:#34495e;">
In simple terms, rejecting the null hypothesis (<strong>H₀</strong>) means that the data provides **strong evidence** that the alternative hypothesis (<strong>Hₐ</strong>) is true. In our case, it suggests that the **average number of goals in women's international matches is indeed higher than in men's** at the 10% significance level. 
</p>

<p style="font-size:16px; line-height:1.6; color:#34495e;">
This doesn’t “prove” it with 100% certainty — statistics never do — but it gives us confidence that the trend we observed as a football fan is backed up by real data.
</p>
