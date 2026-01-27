---
date: "2026-01-27"
title: "🧩 Interactive Sudoku Solver"
---

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>🧩 Interactive Sudoku Solver — Play & Visualize Backtracking</title>
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
</style>
</head>
<body>

<h2>Try It / View the Source</h2>
<p class="center">
<a class="button" href="https://github.com/rustamdurdyyev/sudoku_solver" target="_blank">🔗 View on GitHub</a>
</p>

<h1 style="text-align:center;">Interactive Sudoku Solver</h1>

<img src="/images/sudoku_visualizer.gif" alt="Sudoku Solver visualizing the backtracking algorithm">

<p>
This project is an <strong>interactive Sudoku game and visual solver</strong> built using Python and Pygame. It allows users to play Sudoku manually, request hints, and watch the algorithm solve the puzzle in real-time using a backtracking approach.
</p>

<h2>Features</h2>
<ul>
<li>Random Sudoku board generation</li>
<li>Mouse-based tile selection and keyboard input</li>
<li>Visual feedback for correct and incorrect entries</li>
<li>Hint system to fill a correct number in a random empty cell</li>
<li>Animated visual backtracking solver that highlights decision-making</li>
<li>Timer and wrong-attempt counter</li>
</ul>

<h2>How the Visual Solver Works</h2>
<p>
The solver uses a <strong>recursive backtracking algorithm</strong> to fill empty cells systematically:
</p>
<ol>
<li>Find the next empty cell in the grid.</li>
<li>Try numbers 1–9 and check Sudoku constraints (row, column, 3×3 subgrid).</li>
<li>If a number is valid, place it and visualize the step on screen.</li>
<li>If no number is valid, backtrack: reset the cell and mark it as incorrect.</li>
<li>Repeat until the puzzle is solved.</li>
</ol>

<p>
During the animation:
<ul>
<li>Correct placements are highlighted in <span style="color:green;">green</span></li>
<li>Incorrect attempts during backtracking are highlighted in <span style="color:red;">red</span></li>
<li>A short delay allows users to see the algorithm's decision-making process</li>
</ul>
</p>

<h2>Code Example</h2>
<pre>
def visualSolve(self, wrong, time):
    empty = find_empty(self.board)
    if not empty:
        return True
    for num in range(1, 10):
        if valid(self.board, empty, num):
            self.board[empty[0]][empty[1]] = num
            self.tiles[empty[0]][empty[1]].value = num
            self.tiles[empty[0]][empty[1]].correct = True
            pygame.time.delay(63)
            self.redraw({}, wrong, time)
            if self.visualSolve(wrong, time):
                return True
            self.board[empty[0]][empty[1]] = 0
            self.tiles[empty[0]][empty[1]].value = 0
            self.tiles[empty[0]][empty[1]].incorrect = True
            pygame.time.delay(63)
            self.redraw({}, wrong, time)
</pre>

<h2>Why This Project Is Interesting</h2>
<p>
This project demonstrates:
<ul>
<li>Recursive algorithm design and constraint satisfaction</li>
<li>Depth-first search with backtracking</li>
<li>Integration of algorithm logic with graphical rendering</li>
<li>Real-time visualization of problem-solving strategies</li>
</ul>
The visual feedback makes it easy to understand how backtracking works in practice.
</p>

<p>
If you use or reference this project, please mention me <a href="https://github.com/rustamdurdyyev" target="_blank">@rustamdurdyyev</a> and him <a href="https://github.com/hdruv" target="_blank">@hdruv</a> on Github.  
This helps give proper credit and track contributions.
</p>

</body>
</html>
