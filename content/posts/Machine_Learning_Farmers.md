---
date: "2025-10-13"
title: "🌱 Machine Learning for Crop Prediction Based on Soil Data"
---

<h1 style="text-align:center; color: #2c3e50;">Predicting Optimal Crops Based on Soil Measurements </h1>

<img src="/images/soil-field.jpg" alt="A farmer examining soil in a field" style="width:100%; max-width:800px; display:block; margin:20px auto; border-radius:12px;">

<p style="font-size:16px; line-height:1.6; color:#34495e;">
As a passionate machine learning enthusiast and someone fascinated by agriculture, I love applying data science to real-world problems. Recently, a farmer reached out to me for help in deciding which crop to plant for the best yield. The challenge? Making the most out of the soil’s natural nutrients.
</p>

<p style="font-size:16px; line-height:1.6; color:#34495e;">
Measuring soil metrics like nitrogen (N), phosphorous (P), potassium (K), and pH is critical for understanding soil health, but it can be expensive and time-consuming. The farmer provided a dataset, <code>soil_measures.csv</code>, containing these measurements along with the crop that historically performed best under those conditions. My goal was to build a model that could predict the optimal crop based on soil composition and identify the most important soil feature for this task.
</p>

<h2 style="color:#16a085;">The Dataset</h2>

<p style="font-size:16px; line-height:1.6; color:#34495e;">
The dataset contains the following columns:
<ul>
<li><strong>N:</strong> Nitrogen content ratio in the soil</li>
<li><strong>P:</strong> Phosphorous content ratio in the soil</li>
<li><strong>K:</strong> Potassium content ratio in the soil</li>
<li><strong>pH:</strong> Soil acidity/alkalinity value</li>
<li><strong>crop:</strong> The type of crop that thrives best in that soil (target variable)</li>
</ul>
Each row represents a unique field with its soil measurements and the historically optimal crop.
</p>

<h2 style="color:#16a085;">Data Preparation</h2>

<div style="background:#f5f5f5; border-radius:10px; padding:15px; box-shadow:0 4px 6px rgba(0,0,0,0.1); margin-bottom:15px;">
<pre style="margin:0; font-size:16px;"><code>import pandas as pd
from sklearn.model_selection import train_test_split 
# Load the dataset
crops = pd.read_csv("soil_measures.csv")
# Separate features and target
X = crops.drop("crop", axis=1)
y = crops["crop"]
# Split data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
</code></pre>
</div>

<h2 style="color:#16a085;">Analysis: Evaluating Feature Importance</h2>

<div style="background:#f5f5f5; border-radius:10px; padding:15px; box-shadow:0 4px 6px rgba(0,0,0,0.1); margin-bottom:15px;">
<pre style="margin:0; font-size:16px;"><code>from sklearn.linear_model import LogisticRegression
from sklearn import metrics
# Evaluate each feature individually
features = {}
for feature in ['N', 'P', 'K', 'ph']:
    log_reg = LogisticRegression(multi_class='multinomial')
    log_reg.fit(X_train[[feature]], y_train)
    y_pred = log_reg.predict(X_test[[feature]])
    f1_score = metrics.f1_score(y_test, y_pred, average='weighted')
    features[feature] = f1_score
# Identify best predictive feature
best_predictive_feature = {max(features, key=features.get): max(features.values())}
print(features)
</code></pre>
</div>

<div style="background:#ecf0f1; border-radius:10px; padding:15px; box-shadow:0 4px 6px rgba(0,0,0,0.05); margin-bottom:20px;">
<pre style="margin:0; font-size:16px;"><code>{'N': 0.0956, 'P': 0.1241, 'K': 0.2347, 'ph': 0.0679}</code></pre>
</div>

<h2 style="color:#16a085;">Interpretation</h2>

<p style="font-size:16px; line-height:1.6; color:#34495e;">
From the analysis, <strong>Potassium (K)</strong> has the highest F1-score (0.2347) among all the soil features. But what does this mean?
</p>

<p style="font-size:16px; line-height:1.6; color:#34495e;">
The <strong>F1-score</strong> is a metric that balances <em>precision</em> (how often the model is correct when it predicts a crop) and <em>recall</em> (how often the model finds all correct crops for a feature). In simple terms, it tells us how well the model predicts the right crop while avoiding mistakes. A score closer to 1 means excellent predictive performance, while a score near 0 means the feature alone is not very informative.
</p>

<p style="font-size:16px; line-height:1.6; color:#34495e;">
Since <strong>K has the highest F1-score</strong>, it suggests that **potassium content is the most important single soil feature for predicting which crop will grow best**. This insight can help the farmer prioritize measuring potassium for better crop selection and higher yields.
</p>

<p style="font-size:16px; line-height:1.6; color:#34495e;">
This project highlights how machine learning can help make **data-driven farming decisions** and optimize crop yield using key soil metrics.
</p>
