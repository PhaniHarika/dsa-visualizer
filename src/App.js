import { useState, useEffect } from "react";

  const algorithms = {
  bubble: { name: "Bubble Sort", complexity: "O(n²)", space: "O(1)", stable: "Yes" },
  merge: { name: "Merge Sort", complexity: "O(n log n)", space: "O(n)", stable: "Yes" },
  quick: { name: "Quick Sort", complexity: "O(n log n)", space: "O(log n)", stable: "No" },
  linear: { name: "Linear Search", complexity: "O(n)", space: "O(1)", stable: "-" },
  binary: { name: "Binary Search", complexity: "O(log n)", space: "O(1)", stable: "-" },
  bfs: { name: "BFS", complexity: "O(V+E)", space: "O(V)", stable: "-" },
  dfs: { name: "DFS", complexity: "O(V+E)", space: "O(V)", stable: "-" },
};


function generateArray(size = 20) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

async function bubbleSort(arr, setArr, setHighlight, delay) {
  let a = [...arr];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      setHighlight([j, j + 1]);
      await new Promise(r => setTimeout(r, delay));
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        setArr([...a]);
      }
    }
  }
  setHighlight([]);
}

async function mergeSort(arr, setArr, setHighlight, delay) {
  let a = [...arr];
  async function merge(a, l, m, r) {
    let left = a.slice(l, m + 1);
    let right = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      setHighlight([k, m + 1 + j]);
      await new Promise(res => setTimeout(res, delay));
      if (left[i] <= right[j]) a[k++] = left[i++];
      else a[k++] = right[j++];
      setArr([...a]);
    }
    while (i < left.length) { a[k++] = left[i++]; setArr([...a]); }
    while (j < right.length) { a[k++] = right[j++]; setArr([...a]); }
  }
  async function sort(a, l, r) {
    if (l >= r) return;
    let m = Math.floor((l + r) / 2);
    await sort(a, l, m);
    await sort(a, m + 1, r);
    await merge(a, l, m, r);
  }
  await sort(a, 0, a.length - 1);
  setHighlight([]);
}

async function quickSort(arr, setArr, setHighlight, delay) {
  let a = [...arr];
  async function partition(a, low, high) {
    let pivot = a[high], i = low - 1;
    for (let j = low; j < high; j++) {
      setHighlight([j, high]);
      await new Promise(r => setTimeout(r, delay));
      if (a[j] < pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        setArr([...a]);
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    setArr([...a]);
    return i + 1;
  }
  async function sort(a, low, high) {
    if (low < high) {
      let pi = await partition(a, low, high);
      await sort(a, low, pi - 1);
      await sort(a, pi + 1, high);
    }
  }
  await sort(a, 0, a.length - 1);
  setHighlight([]);
}

async function linearSearch(arr, target, setHighlight, setFound, delay) {
  for (let i = 0; i < arr.length; i++) {
    setHighlight([i]);
    await new Promise(r => setTimeout(r, delay));
    if (arr[i] === target) { setFound(i); setHighlight([]); return; }
  }
  setFound(-1); setHighlight([]);
}

async function binarySearch(arr, target, setHighlight, setFound, delay) {
  let sorted = [...arr].sort((a, b) => a - b);
  let lo = 0, hi = sorted.length - 1;
  while (lo <= hi) {
    let mid = Math.floor((lo + hi) / 2);
    setHighlight([lo, mid, hi]);
    await new Promise(r => setTimeout(r, delay));
    if (sorted[mid] === target) { setFound(mid); setHighlight([]); return; }
    else if (sorted[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  setFound(-1); setHighlight([]);
}

export default function App() {
  // ── GRAPH DATA ──────────────────────────────────────────
const graphNodes = [
  { id: 0, x: 300, y: 50 },
  { id: 1, x: 150, y: 150 },
  { id: 2, x: 450, y: 150 },
  { id: 3, x: 80,  y: 270 },
  { id: 4, x: 220, y: 270 },
  { id: 5, x: 380, y: 270 },
  { id: 6, x: 520, y: 270 },
];
const graphEdges = [
  [0,1],[0,2],[1,3],[1,4],[2,5],[2,6]
];
const adjList = {0:[1,2],1:[0,3,4],2:[0,5,6],3:[1],4:[1],5:[2],6:[2]};

async function bfs(start, setVisited, setQueue, delay) {
  let visited = new Set();
  let queue = [start];
  visited.add(start);
  while (queue.length > 0) {
    let node = queue.shift();
    setVisited(new Set(visited));
    setQueue([...queue]);
    await new Promise(r => setTimeout(r, delay));
    for (let neighbor of adjList[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  setQueue([]);
}

async function dfs(start, setVisited, setQueue, delay) {
  let visited = new Set();
  async function explore(node) {
    visited.add(node);
    setVisited(new Set(visited));
    await new Promise(r => setTimeout(r, delay));
    for (let neighbor of adjList[node]) {
      if (!visited.has(neighbor)) await explore(neighbor);
    }
  }
  await explore(start);
  setQueue([]);
}
  const [algo, setAlgo] = useState("bubble");
  const [array, setArray] = useState(generateArray());
  const [highlight, setHighlight] = useState([]);
  const [running, setRunning] = useState(false);
  const [found, setFound] = useState(null);
  const [target, setTarget] = useState("");
  const [speed, setSpeed] = useState(100);
  const [arraySize, setArraySize] = useState(20);

  const isSearch = algo === "linear" || algo === "binary";
  const [visited, setVisited] = useState(new Set());
  const [bfsQueue, setBfsQueue] = useState([]);
  const isGraph = algo === "bfs" || algo === "dfs";
  const reset = () => {
    setArray(generateArray(arraySize));
    setHighlight([]);
    setFound(null);
  };

  useEffect(() => { reset(); // eslint-disable-next-line
}, [arraySize]);

  const run = async () => {
    setRunning(true);
    setFound(null);
    const delay = 510 - speed;
    if (algo === "bubble") await bubbleSort(array, setArray, setHighlight, delay);
    else if (algo === "merge") await mergeSort(array, setArray, setHighlight, delay);
    else if (algo === "quick") await quickSort(array, setArray, setHighlight, delay);
    else if (algo === "linear") await linearSearch(array, parseInt(target), setHighlight, setFound, delay);
    else if (algo === "binary") await binarySearch(array, parseInt(target), setHighlight, setFound, delay);
    else if (algo === "bfs") await bfs(0, setVisited, setBfsQueue, delay);
    else if (algo === "dfs") await dfs(0, setVisited, setBfsQueue, delay);
    setRunning(false);
  };

  const info = algorithms[algo];

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", color: "white", fontFamily: "sans-serif", padding: "20px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h1 style={{ fontSize: 36, background: "linear-gradient(90deg,#f7971e,#ffd200)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
          DSA Visualizer
        </h1>
        <p style={{ color: "#aaa", marginTop: 6 }}>Built by Phani Harika Soma</p>
      </div>

      {/* Algorithm Selector */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
        {Object.entries(algorithms).map(([key, val]) => (
          <button key={key} onClick={() => { setAlgo(key); reset(); }}
            style={{
              padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14,
              background: algo === key ? "linear-gradient(90deg,#f7971e,#ffd200)" : "#1e1e2e",
              color: algo === key ? "#000" : "#fff",
              transition: "all 0.2s"
            }}>
            {val.name}
          </button>
        ))}
      </div>

      {/* Info Cards */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        {[["Time", info.complexity], ["Space", info.space], ["Stable", info.stable]].map(([label, val]) => (
          <div key={label} style={{ background: "#1e1e2e", borderRadius: 10, padding: "12px 24px", textAlign: "center", minWidth: 100 }}>
            <div style={{ color: "#ffd200", fontSize: 12, marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <label style={{ fontSize: 12, color: "#aaa" }}>Speed</label>
          <input type="range" min={10} max={500} value={speed} onChange={e => setSpeed(+e.target.value)}
            style={{ width: 120 }} disabled={running} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <label style={{ fontSize: 12, color: "#aaa" }}>Array Size</label>
          <input type="range" min={5} max={40} value={arraySize} onChange={e => setArraySize(+e.target.value)}
            style={{ width: 120 }} disabled={running} />
        </div>
        {isSearch && (
          <input
            type="number" placeholder="Search target"
            value={target} onChange={e => setTarget(e.target.value)}
            style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #333", background: "#1e1e2e", color: "white", width: 130 }}
          />
        )}
        <button onClick={reset} disabled={running}
          style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#1e1e2e", color: "white", cursor: "pointer", fontWeight: 700 }}>
          🔀 Shuffle
        </button>
        <button onClick={run} disabled={running || (isSearch && !target)}
          style={{ padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 15,
            background: running ? "#333" : "linear-gradient(90deg,#f7971e,#ffd200)", color: running ? "#aaa" : "#000" }}>
          {running ? "Running..." : "▶ Visualize"}
        </button>
      </div>

      {/* Search result */}
      {found !== null && (
        <div style={{ textAlign: "center", marginBottom: 16, fontSize: 16, fontWeight: 700,
          color: found >= 0 ? "#4ade80" : "#f87171" }}>
          {found >= 0 ? `✅ Found at index ${found}!` : "❌ Not found in array"}
        </div>
      )}

      {/* Array Bars */}
{!isGraph && (
<div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 3, height: 260, padding: "0 20px" }}>
  {(isSearch && algo === "binary" ? [...array].sort((a, b) => a - b) : array).map((val, i) => (
    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, maxWidth: 40 }}>
      <div style={{
        width: "100%", height: val * 2.2,
        background: highlight.includes(i)
          ? "linear-gradient(180deg,#f7971e,#ffd200)"
          : found === i ? "#4ade80" : "#4a9eda",
        borderRadius: "4px 4px 0 0",
        transition: "height 0.1s"
      }} />
      {arraySize <= 20 && <span style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{val}</span>}
    </div>
  ))}
</div>
)}

{/* Graph */}
{isGraph && (
  <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
    <svg width={620} height={340} style={{ background: "#1e1e2e", borderRadius: 16 }}>
      {graphEdges.map(([a, b], i) => (
        <line key={i}
          x1={graphNodes[a].x} y1={graphNodes[a].y+40}
          x2={graphNodes[b].x} y2={graphNodes[b].y+40}
          stroke="#444" strokeWidth={2} />
      ))}
      {graphNodes.map(node => (
        <g key={node.id}>
          <circle cx={node.x} cy={node.y+40} r={24}
            fill={visited.has(node.id) ? "#ffd200" : bfsQueue.includes(node.id) ? "#f7971e" : "#4a9eda"}
            stroke="#0f0f1a" strokeWidth={3}
            style={{ transition: "fill 0.3s" }} />
          <text x={node.x} y={node.y+46} textAnchor="middle"
            fill="#000" fontWeight="bold" fontSize={14}>
            {node.id}
          </text>
        </g>
      ))}
    </svg>
  </div>
)}
      <p style={{ textAlign: "center", color: "#555", marginTop: 30, fontSize: 13 }}>
        🟡 Highlighted = Currently Comparing &nbsp;|&nbsp; 🔵 Default &nbsp;|&nbsp; 🟢 Found
      </p>
    </div>
  );
}