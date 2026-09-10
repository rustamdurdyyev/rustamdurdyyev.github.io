---
date: "2026-02-03"
description: "A local retrieval-augmented chatbot that answers questions from personal data without external API calls."
cardLabel: "AI"
title: "🤖 Local AI Chatbot with RAG"
---
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>🤖 Local AI Chatbot with RAG</title>
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
  color: #16a085;
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
  background: #16a085;
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
ul {
  margin-left: 20px;
}
</style>
</head>
<body>

<!-- <img src="/images/local_ai_chatbot.jpg" alt="Screenshot of Local AI Chatbot"> -->

<p>
This project is a <strong>local AI chatbot</strong> built with <strong>Retrieval-Augmented Generation (RAG)</strong> using <strong>Ollama</strong>. 
It allows you to ask questions and get answers based on <strong>your own data</strong> (for example, your CV stored in <code>cv.json</code>). 
Everything runs entirely on your computer — no external API calls are required.
</p>

<h2>✨ Key Features</h2>

<ul>
<li>100% local AI using Ollama</li>
<li>Retrieval-Augmented Generation (RAG) from your own JSON data</li>
<li>Terminal-based chatbot</li>
<li>Web UI using Streamlit</li>
<li>Easy setup and fully customizable</li>
</ul>

<h2>How It Works</h2>

<p>
Here’s the step-by-step workflow of the chatbot:
</p>

<h3>1. Prepare Your Data</h3>
<p>
Your knowledge base is stored in a JSON file, <code>cv.json</code>. 
This can contain your CV, notes, FAQs, or any text you want the AI to reference. The chatbot will use this data to answer your questions.
</p>

<h3>2. Vectorize the Data</h3>
<p>
Computers can’t understand plain text directly, so we convert your data into <strong>vector embeddings</strong>. 
These embeddings are numeric representations of text that capture its meaning. When you ask a question, the AI can search these vectors to find the most relevant information.
</p>

<h3>3. Ollama AI</h3>
<p>
Ollama is a local AI framework that runs large language models on your computer. 
It receives your question and the relevant context from the vector search and generates a natural, grounded response.
</p>

<h3>4. Terminal Chatbot</h3>
<p>
You can chat with the AI directly in your terminal using <code>main.py</code>:
</p>

<pre>
python main.py
</pre>

<p>
Steps behind the scenes:
<ul>
<li>Your question is converted into a vector.</li>
<li>The chatbot searches the knowledge base vectors for relevant context.</li>
<li>Ollama receives the question + context and generates an answer.</li>
<li>The answer is displayed in your terminal.</li>
</ul>
</p>

<h3>5. Streamlit Web Interface</h3>
<p>
For a graphical interface, run the web app with <code>app.py</code>:
</p>

<pre>
streamlit run app.py
</pre>

<p>
This opens a web interface where you can type questions and receive answers in a chat-like environment. 
The RAG logic works the same way as the terminal chatbot.
</p>

<h3>6. Customize Your Data</h3>
<p>
Replace <code>cv.json</code> with your own documents, notes, or FAQs. 
After updating, rebuild the vectors to ensure the AI uses the new data:
</p>

<pre>
python vector.py
</pre>

<h2>Project Structure</h2>

<ul>
<li><code>main.py</code> — Terminal chatbot</li>
<li><code>vector.py</code> — Converts JSON data into vector embeddings</li>
<li><code>app.py</code> — Streamlit web application</li>
<li><code>cv.json</code> — Knowledge base (your data)</li>
<li><code>requirements.txt</code> — Python dependencies</li>
</ul>

<h2>Setup Requirements</h2>

<ul>
<li>Python 3.9 or higher</li>
<li>Ollama installed locally (<a href="https://ollama.com" target="_blank">https://ollama.com</a>)</li>
</ul>

<h2>Getting Started</h2>

<p>Clone the repository and install dependencies:</p>

<pre>
git clone https://github.com/rustamdurdyyev/LocalRAG-Chatbot

pip install -r requirements.txt
</pre>

<p class="center">
<a class="button" href="https://github.com/rustamdurdyyev/LocalRAG-Chatbot" target="_blank">🔗 View on GitHub</a>
</p>

<h2>Why This Project is Exciting</h2>

<p>
This project demonstrates how AI can work entirely <strong>locally</strong>, maintain <strong>privacy</strong>, and answer questions based on your own knowledge base. 
By combining <strong>vectors</strong> for search and <strong>Ollama</strong> for language generation, the AI is fast, flexible, and fully controllable.
</p>

<p class="center">
✨ Now you can have your own AI assistant that knows <strong>your data</strong> and runs <strong>on your machine</strong>!
</p>

</body>
</html>
