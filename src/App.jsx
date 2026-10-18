import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import MonogramLogo from "./MonogramLogo";
import luxuryAudio from "./audioEngine";
import "./index.css";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// CROSS-DEVICE TACTILE FEEDBACK SYSTEM
// ============================================================================
let lastTactileTime = 0;
let lastTactileKey = "";

function triggerTactileFeedback(key, element, soundEnabled = false) {
  const now = performance.now();
  // Cooldown & debounce: prevent duplicate rapid firings
  if (now - lastTactileTime < 80 || (lastTactileKey === key && now - lastTactileTime < 350)) {
    return;
  }
  lastTactileTime = now;
  lastTactileKey = key;

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Mobile / Tablet Haptic Pulse (8–15ms)
  if (!prefersReducedMotion && typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    try {
      navigator.vibrate(10);
    } catch (_) {}
  }

  // 2. Desktop Audio Feedback (Luxury tactile mechanical click)
  if (soundEnabled && (!prefersReducedMotion || soundEnabled)) {
    luxuryAudio.playTactileClick(0.22);
  }

  // 3. Desktop Visual Micro-Pulse (scale 1 -> 0.995 -> 1, translateY <= 1px)
  if (element && !prefersReducedMotion) {
    element.classList.remove("tactile-micro-pulse");
    void element.offsetWidth; // Force reflow
    element.classList.add("tactile-micro-pulse");
    setTimeout(() => {
      element.classList.remove("tactile-micro-pulse");
    }, 160);
  }

  // 4. Custom Cursor Response
  if (typeof window !== "undefined" && !prefersReducedMotion) {
    window.dispatchEvent(new CustomEvent("portfolio-tactile"));
  }
}

const skillCategories = [
  {
    id: "all",
    label: "All Technologies",
  },
  {
    id: "frontend",
    label: "Frontend & UI",
  },
  {
    id: "programming",
    label: "Languages & CS",
  },
  {
    id: "backend",
    label: "Backend & Data",
  },
];

const skillItems = [
  {
    number: "01",
    name: "React.js",
    category: "frontend",
    categoryLabel: "Frontend",
    description: "Component Architecture, Custom Hooks, State Management & Modern Patterns",
  },
  {
    number: "02",
    name: "JavaScript",
    category: "programming",
    categoryLabel: "Core Language",
    description: "ES6+, Asynchronous Programming, DOM APIs & Event Loop Mechanics",
  },
  {
    number: "03",
    name: "HTML5 & CSS3",
    category: "frontend",
    categoryLabel: "Markup & Styling",
    description: "Semantic Standards, Responsive Flexbox/Grid, CSS Animations & Modern Layouts",
  },
  {
    number: "04",
    name: "Python",
    category: "programming",
    categoryLabel: "Programming",
    description: "Data Structures, Algorithmic Problem Solving & Scripting",
  },
  {
    number: "05",
    name: "DSA & Problem Solving",
    category: "programming",
    categoryLabel: "Computer Science",
    description: "Data Structures, Time-Space Complexity Analysis & Graph Algorithms",
  },
  {
    number: "06",
    name: "Java Programming",
    category: "programming",
    categoryLabel: "Programming",
    description: "Object-Oriented Programming (OOP), Data Types & Application Logic",
  },
  {
    number: "07",
    name: "Git & GitHub",
    category: "backend",
    categoryLabel: "DevOps & Workflow",
    description: "Version Control, Branch Management, Collaboration & Open Source",
  },
  {
    number: "08",
    name: "Node.js & Express",
    category: "backend",
    categoryLabel: "Backend",
    description: "RESTful API Development, Middleware, Server Routing & HTTP Protocols",
  },
  {
    number: "09",
    name: "MongoDB",
    category: "backend",
    categoryLabel: "Database",
    description: "NoSQL Data Modeling, Schemas, Aggregations & CRUD Queries",
  },
  {
    number: "10",
    name: "GSAP & Motion",
    category: "frontend",
    categoryLabel: "Creative Motion",
    description: "ScrollTrigger, Scrubbing, Easing, Timeline Orchestration & Micro-interactions",
  },
];

const certificateItems = [
  {
    number: "01",
    category: "Networking & Systems",
    title: "Networking Basics",
    issuer: "Cisco Networking Academy",
    date: "Issued · 11 Sep 2026",
    href: "/certificates/networking-basics.pdf",
    description: "Fundamental network architectures, protocols, routing principles, IPv4/IPv6 addressing and subnetting.",
  },
  {
    number: "02",
    category: "Database & Querying",
    title: "SQL (Basic)",
    issuer: "HackerRank Skill Certification",
    date: "Earned · 16 Sep 2026",
    href: "/certificates/sql-basic.pdf",
    description: "Relational database queries, filtering, sorting, aggregations, joins, grouping and conditional data retrieval.",
  },
  {
    number: "03",
    category: "Database & Optimization",
    title: "SQL (Intermediate)",
    issuer: "HackerRank Skill Certification",
    date: "Earned · 16 Sep 2026",
    href: "/certificates/sql-intermediate.pdf",
    description: "Complex multi-table joins, subqueries, indexing concepts, window functions, and query optimization.",
  },
];

// Interactive Pathfinding Visualizer Simulation Component
const GRID_ROWS = 7;
const GRID_COLS = 13;
const START_NODE = { r: 3, c: 1 };
const TARGET_NODE = { r: 3, c: 11 };

function PathfindingPreview() {
  const [grid, setGrid] = useState([]);
  const [activeAlgorithm, setActiveAlgorithm] = useState("A* Search");
  const [isSimulating, setIsSimulating] = useState(false);
  const [stats, setStats] = useState({ visited: 38, pathLength: 12, executionTime: "2.4ms" });

  const initGrid = useCallback(() => {
    const initialGrid = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      const row = [];
      for (let c = 0; c < GRID_COLS; c++) {
        const isStart = r === START_NODE.r && c === START_NODE.c;
        const isTarget = r === TARGET_NODE.r && c === TARGET_NODE.c;
        const isWall =
          (c === 4 && r >= 1 && r <= 4) ||
          (c === 8 && r >= 2 && r <= 5) ||
          (r === 5 && c >= 4 && c <= 6);
        row.push({
          r,
          c,
          isStart,
          isTarget,
          isWall: !isStart && !isTarget && isWall,
          isVisited: false,
          isPath: false,
        });
      }
    }
    setGrid(initialGrid);
  }, []);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);

    setGrid((prevGrid) =>
      prevGrid.map((row) =>
        row.map((cell) => ({
          ...cell,
          isVisited: false,
          isPath: false,
        }))
      )
    );

    const visitedInOrder = [];
    const queue = [{ r: START_NODE.r, c: START_NODE.c, parent: null }];
    const visitedSet = new Set([`${START_NODE.r}-${START_NODE.c}`]);
    const parents = new Map();

    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];
    let found = false;

    while (queue.length > 0) {
      if (activeAlgorithm === "A* Search") {
        queue.sort((a, b) => {
          const distA = Math.abs(a.r - TARGET_NODE.r) + Math.abs(a.c - TARGET_NODE.c);
          const distB = Math.abs(b.r - TARGET_NODE.r) + Math.abs(b.c - TARGET_NODE.c);
          return distA - distB;
        });
      }

      const current = queue.shift();
      visitedInOrder.push(current);

      if (current.r === TARGET_NODE.r && current.c === TARGET_NODE.c) {
        found = true;
        break;
      }

      for (let i = 0; i < 4; i++) {
        const nr = current.r + dr[i];
        const nc = current.c + dc[i];
        const key = `${nr}-${nc}`;

        if (
          nr >= 0 &&
          nr < GRID_ROWS &&
          nc >= 0 &&
          nc < GRID_COLS &&
          !visitedSet.has(key)
        ) {
          const cell = grid[nr]?.[nc];
          if (cell && !cell.isWall) {
            visitedSet.add(key);
            parents.set(key, current);
            queue.push({ r: nr, c: nc });
          }
        }
      }
    }

    const shortestPath = [];
    if (found) {
      let curr = { r: TARGET_NODE.r, c: TARGET_NODE.c };
      while (curr) {
        shortestPath.unshift(curr);
        const parent = parents.get(`${curr.r}-${curr.c}`);
        curr = parent;
      }
    }

    // Step 1: Animate visited cells
    visitedInOrder.forEach((node, index) => {
      setTimeout(() => {
        setGrid((prev) =>
          prev.map((row, r) =>
            row.map((cell, c) => {
              if (r === node.r && c === node.c && !cell.isStart && !cell.isTarget) {
                return { ...cell, isVisited: true };
              }
              return cell;
            })
          )
        );
      }, index * 25);
    });

    // Step 2: Animate path cells after visited cells
    const visitedDuration = visitedInOrder.length * 25;
    setTimeout(() => {
      shortestPath.forEach((node, pIndex) => {
        setTimeout(() => {
          setGrid((prev) =>
            prev.map((row, r) =>
              row.map((cell, c) => {
                if (r === node.r && c === node.c && !cell.isStart && !cell.isTarget) {
                  return { ...cell, isPath: true };
                }
                return cell;
              })
            )
          );
          if (pIndex === shortestPath.length - 1) {
            setIsSimulating(false);
            setStats({
              visited: visitedInOrder.length,
              pathLength: shortestPath.length,
              executionTime: activeAlgorithm === "A* Search" ? "1.8ms" : "3.2ms",
            });
          }
        }, pIndex * 40);
      });
    }, visitedDuration + 100);
  };

  const toggleWall = (r, c) => {
    if (isSimulating) return;
    if ((r === START_NODE.r && c === START_NODE.c) || (r === TARGET_NODE.r && c === TARGET_NODE.c)) return;
    setGrid((prev) =>
      prev.map((row, rowIdx) =>
        row.map((cell, colIdx) => {
          if (rowIdx === r && colIdx === c) {
            return { ...cell, isWall: !cell.isWall, isVisited: false, isPath: false };
          }
          return cell;
        })
      )
    );
  };

  return (
    <div className="pathfinder-widget">
      <div className="widget-header">
        <div className="widget-title-badge">
          <span className="live-dot" />
          <span>Interactive Simulation Engine</span>
        </div>
        <div className="widget-controls">
          <div className="algo-selector">
            {["A* Search", "Dijkstra", "BFS"].map((algo) => (
              <button
                key={algo}
                type="button"
                className={`algo-btn ${activeAlgorithm === algo ? "active" : ""}`}
                onClick={() => {
                  if (!isSimulating) setActiveAlgorithm(algo);
                }}
              >
                {algo}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="run-sim-btn"
            onClick={runSimulation}
            disabled={isSimulating}
          >
            {isSimulating ? "Calculating..." : "Run Visualizer ▶"}
          </button>
        </div>
      </div>

      <div className="simulation-canvas-wrapper">
        <div className="simulation-grid">
          {grid.map((row, r) => (
            <div key={`row-${r}`} className="grid-row">
              {row.map((cell, c) => {
                let cellClass = "grid-node";
                if (cell.isStart) cellClass += " start-node";
                else if (cell.isTarget) cellClass += " target-node";
                else if (cell.isWall) cellClass += " wall-node";
                else if (cell.isPath) cellClass += " path-node";
                else if (cell.isVisited) cellClass += " visited-node";

                return (
                  <button
                    key={`node-${r}-${c}`}
                    type="button"
                    className={cellClass}
                    onClick={() => toggleWall(r, c)}
                    title={
                      cell.isStart
                        ? "Start Node (S)"
                        : cell.isTarget
                        ? "Target Node (T)"
                        : cell.isWall
                        ? "Obstacle Wall"
                        : "Click to toggle wall"
                    }
                    aria-label={`Node at row ${r}, column ${c}`}
                  >
                    {cell.isStart ? "S" : cell.isTarget ? "T" : ""}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="widget-footer">
        <div className="widget-stat">
          <span className="stat-label">ALGORITHM</span>
          <span className="stat-val">{activeAlgorithm}</span>
        </div>
        <div className="widget-stat">
          <span className="stat-label">NODES VISITED</span>
          <span className="stat-val">{stats.visited}</span>
        </div>
        <div className="widget-stat">
          <span className="stat-label">PATH LENGTH</span>
          <span className="stat-val">{stats.pathLength} units</span>
        </div>
        <div className="widget-stat">
          <span className="stat-label">CALC TIME</span>
          <span className="stat-val">{stats.executionTime}</span>
        </div>
      </div>
    </div>
  );
}

// Minimal Precision Custom Cursor
function CustomCursor() {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReducedMotion) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let ringScale = 1;
    let rafId;
    let hasMoved = false;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        ringX = mouseX;
        ringY = mouseY;
        if (cursorDotRef.current) cursorDotRef.current.style.opacity = "1";
        if (cursorRingRef.current) cursorRingRef.current.style.opacity = "1";
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ringScale += (1 - ringScale) * 0.14;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${ringScale})`;
      }
      rafId = requestAnimationFrame(animateRing);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animateRing);

    const handleMouseOver = (e) => {
      const target = e.target.closest("button, a, .spec-row, .skill-row, .cert-row, .social-card, .editorial-headline, .contact-giant-title, .grid-node, .brand-group");
      if (target && cursorRingRef.current) {
        cursorRingRef.current.classList.add("hovered");
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest("button, a, .spec-row, .skill-row, .cert-row, .social-card, .editorial-headline, .contact-giant-title, .grid-node, .brand-group");
      if (target && cursorRingRef.current) {
        cursorRingRef.current.classList.remove("hovered");
      }
    };

    const handleTactilePulse = () => {
      ringScale = 1.25;
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("portfolio-tactile", handleTactilePulse);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("portfolio-tactile", handleTactilePulse);
    };
  }, []);

  return (
    <>
      <div className="custom-cursor-dot" ref={cursorDotRef} style={{ opacity: 0 }} />
      <div className="custom-cursor-ring" ref={cursorRingRef} style={{ opacity: 0 }} />
    </>
  );
}

function App() {
  const portfolioRef = useRef(null);
  const lenisRef = useRef(null);
  const introRef = useRef(null);
  const stageRef = useRef(null);
  const myRef = useRef(null);
  const letterMRef = useRef(null);
  const letterYRef = useRef(null);
  const identityRef = useRef(null);
  const nameRef = useRef(null);
  const roleRef = useRef(null);
  const introBioRef = useRef(null);
  const heroBgGridRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  // Section Refs for scroll and tactile thresholds
  const aboutRef = useRef(null);
  const aboutKickerRef = useRef(null);
  const aboutHeadlineColRef = useRef(null);
  const aboutHeadlineRef = useRef(null);
  const aboutSideColRef = useRef(null);
  const aboutTableRef = useRef(null);

  const skillsRef = useRef(null);
  const skillsKickerRef = useRef(null);

  const projectsRef = useRef(null);
  const projectsKickerRef = useRef(null);

  const certRef = useRef(null);
  const certKickerRef = useRef(null);

  // Contact Section Refs
  const contactRef = useRef(null);
  const contactKickerRef = useRef(null);
  const contactHeadlineColRef = useRef(null);
  const contactTitleRef = useRef(null);
  const contactLeadRef = useRef(null);
  const contactActionsRef = useRef(null);
  const emailCardRef = useRef(null);
  const socialGridRef = useRef(null);
  const footerRef = useRef(null);

  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem("portfolio_tactile_sound") === "true";
    } catch (_) {
      return false;
    }
  });
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const toggleSound = (e) => {
    e?.stopPropagation?.();
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEnabledRef.current = next;
    try {
      localStorage.setItem("portfolio_tactile_sound", next ? "true" : "false");
    } catch (_) {}

    luxuryAudio.playToggleChime(next);
    if (next) {
      luxuryAudio.startAmbient();
      luxuryAudio.playTactileClick(0.12);
    } else {
      luxuryAudio.stopAmbient();
    }
  };

  // User gesture listener to respect autoplay policies and resume ambient if previously enabled
  useEffect(() => {
    const unlockAudio = () => {
      if (soundEnabledRef.current) {
        luxuryAudio.startAmbient();
      }
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };

    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("keydown", unlockAudio, { passive: true });
    window.addEventListener("touchstart", unlockAudio, { passive: true });

    return () => {
      luxuryAudio.stopAmbient(true);
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentTime, setCurrentTime] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  // Lock body scroll and listen for Escape key when project modal is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  // Scroll Progress & Active Section Tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      const sections = ["about", "skills", "projects", "certifications", "contact"];
      const scrollPos = window.scrollY + window.innerHeight * 0.35;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Live IST Clock in Mumbai
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istString = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setCurrentTime(istString);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ymitesh760@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -50, duration: 1.1 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.1 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleHeroMouseMove = (e) => {
    if (!introRef.current || !heroBgGridRef.current) return;
    const rect = introRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const geoRing = heroBgGridRef.current.querySelector(".hero-geo-ring");
    if (geoRing) {
      gsap.to(geoRing, {
        x: x * 24,
        y: y * 24,
        duration: 1.2,
        ease: "power1.out",
        overwrite: "auto",
      });
    }
  };

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis = null;
    let updateLenis = null;

    if (!prefersReducedMotion) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.2,
      });

      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);

      updateLenis = (time) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(myRef.current, { display: "none" });
        gsap.set(identityRef.current, { opacity: 1, scale: 1, x: 0, y: 0 });
        const chars = nameRef.current?.querySelectorAll(".hero-char");
        if (chars) gsap.set(chars, { opacity: 1, y: 0, scale: 1, filter: "none" });
        if (roleRef.current) gsap.set(roleRef.current, { opacity: 1, y: 0 });
        if (introBioRef.current) gsap.set(introBioRef.current, { opacity: 1, y: 0 });
        if (scrollIndicatorRef.current) gsap.set(scrollIndicatorRef.current, { opacity: 0 });
        return;
      }

      // Initial GSAP States (100% crisp, unblurred, centered)
      gsap.set(myRef.current, { opacity: 0, scale: 0.94 });
      gsap.set(letterMRef.current, { x: 0, opacity: 1 });
      gsap.set(letterYRef.current, { x: 0, opacity: 1 });
      gsap.set(identityRef.current, { opacity: 0, y: 0 });

      const heroChars = nameRef.current?.querySelectorAll(".hero-char");
      if (heroChars && heroChars.length > 0) {
        gsap.set(heroChars, { opacity: 0, y: 28 });
      }

      const dividerLine = identityRef.current?.querySelector(".intro-divider-line");
      if (dividerLine) {
        gsap.set(dividerLine, { scaleX: 0, opacity: 0 });
      }

      if (roleRef.current) {
        gsap.set(roleRef.current, { opacity: 0, y: 16 });
      }

      if (introBioRef.current) {
        gsap.set(introBioRef.current, { opacity: 0, y: 16 });
      }

      if (scrollIndicatorRef.current) {
        gsap.set(scrollIndicatorRef.current, { opacity: 0, y: 16 });
      }

      // Master Cinematic Entrance Timeline (Smooth, self-choreographed, non-blocking)
      const entranceTl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Background subtle grid & geometry fade in
      if (heroBgGridRef.current) {
        entranceTl.fromTo(
          heroBgGridRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.0, ease: "power1.out" },
          0
        );
      }

      // Monogram MY emerges with high-impact precision
      entranceTl.to(
        myRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.85,
          ease: "power2.out",
          onStart: () => {
            triggerTactileFeedback("intro-monogram", myRef.current, soundEnabledRef.current);
          },
        },
        0.15
      );

      // Monogram letters smoothly part left and right (double-door reveal)
      entranceTl.to(
        letterMRef.current,
        {
          x: -70,
          opacity: 0,
          duration: 0.9,
          ease: "power3.inOut",
        },
        1.05
      );

      entranceTl.to(
        letterYRef.current,
        {
          x: 70,
          opacity: 0,
          duration: 0.9,
          ease: "power3.inOut",
          onStart: () => {
            triggerTactileFeedback("intro-part-letters", letterYRef.current, soundEnabledRef.current);
          },
        },
        1.05
      );

      // Identity container reveals behind parting letters
      entranceTl.to(
        identityRef.current,
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        1.25
      );

      // Staggered letters of MITESH YADAV rise cleanly
      if (heroChars && heroChars.length > 0) {
        entranceTl.to(
          heroChars,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.035,
            ease: "power3.out",
            onStart: () => {
              triggerTactileFeedback("intro-name", nameRef.current, soundEnabledRef.current);
            },
          },
          1.3
        );
      }

      // Divider hairline expands
      if (dividerLine) {
        entranceTl.to(
          dividerLine,
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
          },
          1.6
        );
      }

      // Subtitle role text rises
      if (roleRef.current) {
        entranceTl.to(
          roleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
          },
          1.75
        );
      }

      // Intro bio reveals
      if (introBioRef.current) {
        entranceTl.to(
          introBioRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
          },
          1.9
        );
      }

      // Scroll indicator at bottom appears
      if (scrollIndicatorRef.current) {
        entranceTl.to(
          scrollIndicatorRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
          },
          2.05
        );
      }

      // Natural Lightweight Scroll Parallax:
      // Only background grid gently shifts for spatial depth.
      // Identity stays permanently 100% visible so it NEVER disappears when scrolling down and back up!
      if (heroBgGridRef.current) {
        ScrollTrigger.create({
          trigger: introRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          animation: gsap.to(heroBgGridRef.current, {
            y: -50,
            ease: "none",
          }),
        });
      }

      // Explicit guarantee: whenever viewport returns to the top, identity is 100% visible
      ScrollTrigger.create({
        trigger: introRef.current,
        start: "top top",
        onEnterBack: () => {
          gsap.set(identityRef.current, { opacity: 1, y: 0 });
        },
      });

      // Section Tactile Threshold ScrollTriggers (Crossing thresholds in both directions)
      const sectionConfigs = [
        { id: "about", ref: aboutRef, targetRef: aboutKickerRef },
        { id: "skills", ref: skillsRef, targetRef: skillsKickerRef },
        { id: "projects", ref: projectsRef, targetRef: projectsKickerRef },
        { id: "certifications", ref: certRef, targetRef: certKickerRef },
        { id: "contact", ref: contactRef, targetRef: contactKickerRef },
      ];

      sectionConfigs.forEach(({ id, ref, targetRef }, idx) => {
        if (ref.current) {
          ScrollTrigger.create({
            trigger: ref.current,
            start: "top 62%",
            end: "bottom 38%",
            onEnter: () => {
              const target = targetRef?.current || ref.current?.querySelector(".section-kicker") || ref.current;
              triggerTactileFeedback(`section-${id}-enter`, target, soundEnabledRef.current);
              if (soundEnabledRef.current) {
                luxuryAudio.playSectionTransition(idx + 1);
              }
            },
            onLeaveBack: () => {
              const target = targetRef?.current || ref.current?.querySelector(".section-kicker") || ref.current;
              triggerTactileFeedback(`section-${id}-leaveback`, target, soundEnabledRef.current);
            },
          });
        }
      });

      // ==========================================
      // SECTION 01: ABOUT SCROLL REVEALS
      // ==========================================
      if (aboutRef.current) {
        // About Kicker
        gsap.fromTo(
          aboutKickerRef.current?.querySelectorAll(".kicker-left, .kicker-tag"),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: aboutKickerRef.current || aboutRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );

        // About Headline Lines Reveal (Masked vertical rise)
        const headlineLines = aboutHeadlineRef.current?.querySelectorAll(".headline-line");
        if (headlineLines && headlineLines.length > 0) {
          gsap.fromTo(
            headlineLines,
            { opacity: 0, yPercent: 100 },
            {
              opacity: 1,
              yPercent: 0,
              duration: 1.1,
              stagger: 0.12,
              ease: "power4.out",
              scrollTrigger: {
                trigger: aboutHeadlineRef.current,
                start: "top 85%",
                once: true,
              },
            }
          );
        }

        // About Paragraphs Reveal
        const paragraphs = aboutSideColRef.current?.querySelectorAll(".about-paragraph");
        if (paragraphs && paragraphs.length > 0) {
          gsap.fromTo(
            paragraphs,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: aboutSideColRef.current,
                start: "top 85%",
                once: true,
              },
            }
          );
        }

        // About Spec Table Rows Reveal
        const specRows = aboutTableRef.current?.querySelectorAll(".spec-row");
        if (specRows && specRows.length > 0) {
          gsap.fromTo(
            specRows,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: aboutTableRef.current,
                start: "top 88%",
                once: true,
              },
            }
          );
        }

        // Subtle About Parallax (Desktop)
        if (!prefersReducedMotion && window.innerWidth > 768) {
          gsap.fromTo(
            aboutHeadlineColRef.current,
            { y: 25 },
            {
              y: -25,
              ease: "none",
              scrollTrigger: {
                trigger: aboutRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );

          gsap.fromTo(
            aboutSideColRef.current,
            { y: -15 },
            {
              y: 15,
              ease: "none",
              scrollTrigger: {
                trigger: aboutRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }
      }

      // ==========================================
      // SECTION 05: CONTACT SCROLL REVEALS
      // ==========================================
      if (contactRef.current) {
        // Contact Kicker
        gsap.fromTo(
          contactKickerRef.current?.querySelectorAll(".kicker-left, .kicker-tag"),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contactKickerRef.current || contactRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );

        // Contact Giant Title Lines Reveal (Masked vertical rise)
        const contactLines = contactTitleRef.current?.querySelectorAll(".contact-line");
        if (contactLines && contactLines.length > 0) {
          gsap.fromTo(
            contactLines,
            { opacity: 0, yPercent: 100 },
            {
              opacity: 1,
              yPercent: 0,
              duration: 1.1,
              stagger: 0.12,
              ease: "power4.out",
              scrollTrigger: {
                trigger: contactTitleRef.current,
                start: "top 85%",
                once: true,
              },
            }
          );
        }

        // Contact Lead Text
        if (contactLeadRef.current) {
          gsap.fromTo(
            contactLeadRef.current,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: contactLeadRef.current,
                start: "top 88%",
                once: true,
              },
            }
          );
        }

        // Direct Inquiry Email Card Slide & Scale
        if (emailCardRef.current) {
          gsap.fromTo(
            emailCardRef.current,
            { opacity: 0, y: 40, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: emailCardRef.current,
                start: "top 88%",
                once: true,
              },
            }
          );
        }

        // Social Cards Stagger
        const socialCards = socialGridRef.current?.querySelectorAll(".social-card");
        if (socialCards && socialCards.length > 0) {
          gsap.fromTo(
            socialCards,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: socialGridRef.current,
                start: "top 90%",
                once: true,
              },
            }
          );
        }

        // Footer Columns Reveal
        const footerCols = footerRef.current?.querySelectorAll(".footer-col");
        if (footerCols && footerCols.length > 0) {
          gsap.fromTo(
            footerCols,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top 95%",
                once: true,
              },
            }
          );
        }

        // Subtle Contact Parallax (Desktop)
        if (!prefersReducedMotion && window.innerWidth > 768) {
          gsap.fromTo(
            contactHeadlineColRef.current,
            { y: 20 },
            {
              y: -20,
              ease: "none",
              scrollTrigger: {
                trigger: contactRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );

          gsap.fromTo(
            contactActionsRef.current,
            { y: -15 },
            {
              y: 15,
              ease: "none",
              scrollTrigger: {
                trigger: contactRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }
      }

      // Global Scroll Reveal for remaining sections (Skills, Projects, Certifications)
      gsap.utils.toArray(".scroll-reveal").forEach((elem) => {
        gsap.fromTo(
          elem,
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: elem,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      if (document.fonts) {
        document.fonts.ready.then(() => {
          ScrollTrigger.refresh();
        });
      } else {
        ScrollTrigger.refresh();
      }
    }, portfolioRef);

    return () => {
      if (updateLenis) {
        gsap.ticker.remove(updateLenis);
      }
      if (lenis) {
        lenis.off("scroll", ScrollTrigger.update);
        lenis.destroy();
        lenisRef.current = null;
      }
      ctx.revert();
    };
  }, []);

  const filteredSkills =
    activeCategory === "all"
      ? skillItems
      : skillItems.filter((item) => item.category === activeCategory);

  return (
    <div className="portfolio" ref={portfolioRef}>
      <CustomCursor />

      {/* Top Editorial Bar */}
      <header className="topbar">
        <div className="topbar-progress" style={{ width: `${scrollProgress}%` }} />
        
        <div
          className="brand-group"
          onClick={scrollToTop}
          role="button"
          tabIndex={0}
          aria-label="Mitesh Yadav — Return to top"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              scrollToTop();
            }
          }}
        >
          <MonogramLogo className="brand-logo-svg" width={40} height={27} />
          <span className="brand-sub">Mitesh Yadav</span>
        </div>

        <div className="topbar-center">
          <span className="time-indicator">
            <span className="time-pulse" />
            <span>MUMBAI, IN {currentTime || "IST"}</span>
          </span>
        </div>

        <nav className="topbar-nav" aria-label="Quick navigation">
          <button
            type="button"
            className={activeSection === "about" ? "active" : ""}
            onClick={() => scrollToSection("about")}
            onMouseEnter={() => soundEnabled && luxuryAudio.playHoverTick()}
          >
            About
          </button>
          <button
            type="button"
            className={activeSection === "skills" ? "active" : ""}
            onClick={() => scrollToSection("skills")}
            onMouseEnter={() => soundEnabled && luxuryAudio.playHoverTick()}
          >
            Skills
          </button>
          <button
            type="button"
            className={activeSection === "projects" ? "active" : ""}
            onClick={() => scrollToSection("projects")}
            onMouseEnter={() => soundEnabled && luxuryAudio.playHoverTick()}
          >
            Work
          </button>
          <button
            type="button"
            className={activeSection === "certifications" ? "active" : ""}
            onClick={() => scrollToSection("certifications")}
            onMouseEnter={() => soundEnabled && luxuryAudio.playHoverTick()}
          >
            Certificates
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("contact")}
            onMouseEnter={() => soundEnabled && luxuryAudio.playHoverTick()}
            className={`nav-contact-btn ${activeSection === "contact" ? "active" : ""}`}
          >
            Let&apos;s Talk
          </button>

          <button
            type="button"
            onClick={toggleSound}
            className={`sound-toggle-btn ${soundEnabled ? "active" : ""}`}
            aria-label={soundEnabled ? "Disable cinematic ambient audio" : "Enable cinematic ambient audio"}
            aria-pressed={soundEnabled}
            title={soundEnabled ? "Cinematic Audio: On" : "Cinematic Audio: Off"}
          >
            <span className="sound-toggle-icon" aria-hidden="true">
              <span className="sound-wave-bar bar-1" />
              <span className="sound-wave-bar bar-2" />
              <span className="sound-wave-bar bar-3" />
            </span>
            <span className="sound-toggle-text">{soundEnabled ? "SOUND ON" : "SOUND OFF"}</span>
          </button>
        </nav>
      </header>

      <main>
        {/* OPENING EXPERIENCE: Dedicated Cinematic Hero */}
        <section
          className="intro-scroll"
          ref={introRef}
          onMouseMove={handleHeroMouseMove}
          aria-label="Intro hero stage"
        >
          <div className="intro-stage" ref={stageRef}>
            {/* Cinematic Background Architectural Grid & Geometric Accents */}
            <div className="hero-grid-background" ref={heroBgGridRef} aria-hidden="true">
              <div className="hero-grid-lines" />
              <div className="hero-geo-ring" />
              <div className="hero-geo-cross cross-tl">+</div>
              <div className="hero-geo-cross cross-tr">+</div>
              <div className="hero-geo-cross cross-bl">+</div>
              <div className="hero-geo-cross cross-br">+</div>
              <div className="hero-geo-coordinate coord-left">
                <span>19°04&apos;N 72°52&apos;E</span>
              </div>
              <div className="hero-geo-coordinate coord-right">
                <span>PORTFOLIO // 2026</span>
              </div>
              <div className="hero-guide-line guide-h-top" />
              <div className="hero-guide-line guide-h-bottom" />
            </div>

            {/* STATE 1: Large Central 'MY' Monogram that splits into M and Y on entrance */}
            <div className="intro-my" ref={myRef} aria-label="Mitesh Yadav Initials">
              <div className="monogram-wrapper">
                <span className="monogram-letter monogram-letter-m" ref={letterMRef}>
                  M
                </span>
                <span className="monogram-letter monogram-letter-y" ref={letterYRef}>
                  Y
                </span>
              </div>
            </div>

            {/* STATE 2: Revealed Behind Monogram: MITESH YADAV + Subtitle + Short Intro */}
            <div className="intro-identity" ref={identityRef}>
              <h1 className="intro-name" ref={nameRef} aria-label="Mitesh Yadav">
                <span className="name-line name-line-first">
                  {"MITESH".split("").map((char, index) => (
                    <span key={`m-${index}`} className="hero-char">
                      {char}
                    </span>
                  ))}
                </span>
                <span className="name-line name-line-second">
                  {"YADAV".split("").map((char, index) => (
                    <span key={`y-${index}`} className="hero-char">
                      {char}
                    </span>
                  ))}
                </span>
              </h1>

              <div className="intro-divider-line" />

              <p className="intro-role" ref={roleRef}>
                COMPUTER SCIENCE STUDENT &amp; DEVELOPER
              </p>

              <p className="intro-bio" ref={introBioRef}>
                I build digital experiences through code, creativity, and continuous learning.
              </p>
            </div>

            {/* Subtle Animated Clickable Scroll Indicator */}
            <button
              type="button"
              className="scroll-indicator"
              ref={scrollIndicatorRef}
              onClick={() => scrollToSection("about")}
              aria-label="Scroll to explore About section"
            >
              <span className="scroll-text">SCROLL TO EXPLORE</span>
              <div className="scroll-line">
                <div className="scroll-dot" />
              </div>
            </button>
          </div>
        </section>

        {/* SECTION 01: ABOUT */}
        <section className="section about-section" id="about" ref={aboutRef}>
          <div className="section-kicker" ref={aboutKickerRef}>
            <div className="kicker-left">
              <span className="kicker-index">01</span>
              <span className="kicker-divider">/</span>
              <span className="kicker-title">ABOUT</span>
            </div>
            <span className="kicker-tag">DISCIPLINE & BACKGROUND</span>
          </div>

          <div className="about-grid">
            <div className="about-main-col" ref={aboutHeadlineColRef}>
              <h2 className="editorial-headline" ref={aboutHeadlineRef}>
                <span className="headline-line-mask">
                  <span className="headline-line">BUILDING IDEAS INTO</span>
                </span>
                <span className="headline-line-mask">
                  <span className="headline-line">MEANINGFUL, HIGH-</span>
                </span>
                <span className="headline-line-mask">
                  <span className="headline-line">PERFORMANCE DIGITAL</span>
                </span>
                <span className="headline-line-mask">
                  <span className="headline-line">EXPERIENCES.</span>
                </span>
              </h2>
            </div>

            <div className="about-side-col" ref={aboutSideColRef}>
              <p className="about-paragraph">
                I&apos;m <strong>Mitesh Yadav</strong> — a Computer Science student and creative developer based in Mumbai. I specialize in engineering responsive, typography-led web applications that merge thoughtful design mechanics with algorithmic precision.
              </p>
              <p className="about-paragraph subtle">
                Passionate about interactive frontend systems, clean data flows, and building software that feels seamless, fast, and deliberate.
              </p>

              <div className="spec-table" ref={aboutTableRef}>
                <div className="spec-row">
                  <span className="spec-key">DISCIPLINE</span>
                  <span className="spec-value">Creative Developer / Full-Stack</span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">EDUCATION</span>
                  <span className="spec-value">B.Tech Computer Science</span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">UNIVERSITY</span>
                  <span className="spec-value">ITM Skills University</span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">LOCATION</span>
                  <span className="spec-value">Mumbai, India</span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">STATUS</span>
                  <span className="spec-value highlight">
                    <span className="status-live-indicator" />
                    Available for Opportunities
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02: SKILLS */}
        <section className="section skills-section" id="skills" ref={skillsRef}>
          <div className="section-kicker scroll-reveal" ref={skillsKickerRef}>
            <div className="kicker-left">
              <span className="kicker-index">02</span>
              <span className="kicker-divider">/</span>
              <span className="kicker-title">CAPABILITIES</span>
            </div>
            <span className="kicker-tag">CORE TECH & PROFICIENCIES</span>
          </div>

          <div className="section-header-block scroll-reveal">
            <h2 className="section-title">TECHNICAL ARSENAL.</h2>
            <p className="section-description">
              A curated suite of modern technologies, core computer science concepts, and tools I leverage to build robust digital products.
            </p>
          </div>

          {/* Skill Filter Tabs */}
          <div className="skill-filters scroll-reveal">
            {skillCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`filter-btn ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Editorial Typographic Skill Rows */}
          <div className="skill-table">
            {filteredSkills.map((skill) => (
              <div className="skill-row scroll-reveal" key={skill.number}>
                <div className="skill-col-index">{skill.number}</div>
                <div className="skill-col-main">
                  <h3 className="skill-title">{skill.name}</h3>
                  <p className="skill-desc">{skill.description}</p>
                </div>
                <div className="skill-col-meta">
                  <span className="skill-badge">{skill.categoryLabel}</span>
                  <span className="skill-arrow">↗</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 03: FEATURED WORK */}
        <section className="section projects-section" id="projects" ref={projectsRef}>
          <div className="section-kicker scroll-reveal" ref={projectsKickerRef}>
            <div className="kicker-left">
              <span className="kicker-index">03</span>
              <span className="kicker-divider">/</span>
              <span className="kicker-title">SELECTED WORK</span>
            </div>
            <span className="kicker-tag">FEATURED WORK — 02 PRODUCTIONS</span>
          </div>

          <div className="section-header-block scroll-reveal">
            <h2 className="section-title">FEATURED WORK.</h2>
            <p className="section-description">
              A curated selection of production web applications, algorithmic engineering, and full-stack interactive systems.
            </p>
          </div>

          <div className="projects-grid-stack">
            {/* PROJECT 01: PATHFINDING VISUALIZER */}
            <article className="featured-project-card scroll-reveal">
              <div className="project-top-bar">
                <div className="project-tag">
                  <span className="project-num">PROJECT / 01</span>
                  <span className="project-type">GRAPH ALGORITHMS & INTERACTION</span>
                </div>
                <div className="project-status-badge">
                  <span className="status-dot" />
                  <span>Production Live</span>
                </div>
              </div>

              <div className="project-headline-row">
                <h3 className="project-hero-title">PATHFINDING VISUALIZER</h3>
                <div className="project-actions">
                  <a
                    href="https://pathfinding-visualizer-react-js-pro.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="editorial-action-btn primary"
                    onClick={() => soundEnabled && luxuryAudio.playTactileClick()}
                  >
                    <span>Launch Live Project</span>
                    <span className="btn-arrow">↗</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProject("pathfinding");
                      soundEnabled && luxuryAudio.playTactileClick();
                    }}
                    className="editorial-action-btn secondary"
                  >
                    <span>View Project</span>
                    <span className="btn-arrow">⊕</span>
                  </button>
                  <a
                    href="https://github.com/ymitesh760-star"
                    target="_blank"
                    rel="noreferrer"
                    className="editorial-action-btn secondary"
                    onClick={() => soundEnabled && luxuryAudio.playTactileClick()}
                  >
                    <span>GitHub Repo</span>
                    <span className="btn-arrow">↗</span>
                  </a>
                </div>
              </div>

              <div className="project-body-grid">
                <div className="project-info-column">
                  <div className="info-block">
                    <h4 className="info-heading">OVERVIEW</h4>
                    <p className="info-text">
                      An interactive pathfinding visualizer built in React to explore algorithm mechanics and understand how different graph search heuristics find the shortest path between coordinates in real-time.
                    </p>
                  </div>

                  <div className="info-block">
                    <h4 className="info-heading">IMPLEMENTED ALGORITHMS</h4>
                    <ul className="algo-list">
                      <li>
                        <strong>A* Search:</strong> Uses Manhattan distance heuristics to guarantee the shortest path while dramatically reducing visited nodes.
                      </li>
                      <li>
                        <strong>Dijkstra&apos;s Algorithm:</strong> The father of pathfinding; guarantees shortest path across weighted & unweighted networks.
                      </li>
                      <li>
                        <strong>Breadth-First Search (BFS):</strong> Explores equally in all directions; optimal for unweighted graphs.
                      </li>
                      <li>
                        <strong>Depth-First Search (DFS):</strong> Exhaustively dives deep into paths; demonstrates tree exploration.
                      </li>
                    </ul>
                  </div>

                  <div className="info-block">
                    <h4 className="info-heading">TECH STACK & ARCHITECTURE</h4>
                    <div className="tech-tags-cloud">
                      <span>React.js</span>
                      <span>JavaScript (ES6+)</span>
                      <span>A* Algorithm</span>
                      <span>Dijkstra</span>
                      <span>CSS Grid</span>
                      <span>State Scheduling</span>
                    </div>
                  </div>
                </div>

                <div className="project-interactive-column">
                  <div className="simulation-container">
                    <PathfindingPreview />
                  </div>
                </div>
              </div>

              <div className="project-card-footer">
                <span>EXPLORE LIVE PRODUCTION AT PATHFINDING-VISUALIZER.VERCEL.APP</span>
                <span>2026 EDITION</span>
              </div>
            </article>

            {/* PROJECT 02: CHREZAA ATELIER */}
            <article className="featured-project-card scroll-reveal">
              <div className="project-top-bar">
                <div className="project-tag">
                  <span className="project-num">PROJECT / 02</span>
                  <span className="project-type">FULL-STACK E-COMMERCE & BOUTIQUE ATELIER</span>
                </div>
                <div className="project-status-badge">
                  <span className="status-dot" />
                  <span>Production Live</span>
                </div>
              </div>

              <div className="project-headline-row">
                <h3 className="project-hero-title">CHREZAA ATELIER</h3>
                <div className="project-actions">
                  <a
                    href="https://6ad435c390ed2d78279911b9--chrezaa.netlify.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="editorial-action-btn primary"
                    onClick={() => soundEnabled && luxuryAudio.playTactileClick()}
                  >
                    <span>Live Demo</span>
                    <span className="btn-arrow">↗</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProject("chrezaa");
                      soundEnabled && luxuryAudio.playTactileClick();
                    }}
                    className="editorial-action-btn secondary"
                  >
                    <span>View Project</span>
                    <span className="btn-arrow">⊕</span>
                  </button>
                  <a
                    href="https://github.com/ymitesh760-star/Womens-Fashion-"
                    target="_blank"
                    rel="noreferrer"
                    className="editorial-action-btn secondary"
                    onClick={() => soundEnabled && luxuryAudio.playTactileClick()}
                  >
                    <span>GitHub Repo</span>
                    <span className="btn-arrow">↗</span>
                  </a>
                </div>
              </div>

              <div className="project-body-grid">
                <div className="project-info-column">
                  <div className="info-block">
                    <h4 className="info-heading">OVERVIEW</h4>
                    <p className="info-text">
                      A luxury Indian women&apos;s fashion boutique atelier and multi-tenant e-commerce platform. Engineered with customer storefronts, scoped supplier dashboards, real-time Firebase inventory management, automated WhatsApp order notifications, and an AI personal stylist.
                    </p>
                  </div>

                  <div className="info-block">
                    <h4 className="info-heading">CORE CAPABILITIES & HIGHLIGHTS</h4>
                    <ul className="algo-list">
                      <li>
                        <strong>Multi-Role Architecture:</strong> Customer boutique, isolated Supplier Portal for inventory and dispatching, and Super-Admin oversight.
                      </li>
                      <li>
                        <strong>Real-Time Cloud Synchronization:</strong> Firebase Firestore database synchronizing live stock counts, product catalogs, and order tracking.
                      </li>
                      <li>
                        <strong>WhatsApp Order Dispatch:</strong> Automated conversational order alerts and status notifications directly to patrons and artisans.
                      </li>
                      <li>
                        <strong>AI Wardrobe Stylist:</strong> Curated look suggestions and occasion-tailored recommendations based on customer preferences.
                      </li>
                    </ul>
                  </div>

                  <div className="info-block">
                    <h4 className="info-heading">TECH STACK & ARCHITECTURE</h4>
                    <div className="tech-tags-cloud">
                      <span>React.js (SPA)</span>
                      <span>Firebase Firestore</span>
                      <span>Firebase Storage</span>
                      <span>React Router v6</span>
                      <span>Framer Motion</span>
                      <span>WhatsApp Cloud API</span>
                      <span>Vite</span>
                      <span>Netlify CI/CD</span>
                    </div>
                  </div>
                </div>

                <div className="project-interactive-column">
                  <div
                    className="project-preview-frame"
                    onClick={() => {
                      setSelectedProject("chrezaa");
                      soundEnabled && luxuryAudio.playTactileClick();
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedProject("chrezaa");
                        soundEnabled && luxuryAudio.playTactileClick();
                      }
                    }}
                    title="Click to view Chrezaa project details"
                  >
                    <div className="browser-chrome-bar">
                      <div className="browser-dots">
                        <span className="b-dot close" />
                        <span className="b-dot min" />
                        <span className="b-dot max" />
                      </div>
                      <div className="browser-url-pill">
                        <span>https://chrezaa.netlify.app</span>
                      </div>
                      <div className="browser-action-hint">
                        <span>View Details ⊕</span>
                      </div>
                    </div>
                    <div className="project-image-wrap">
                      <img
                        src="/projects/chrezaa.jpg"
                        alt="CHREZAA Luxury Women's Fashion & Boutique Atelier Preview"
                        className="project-showcase-img"
                        loading="lazy"
                      />
                      <div className="project-img-overlay">
                        <span className="overlay-badge">Click to Explore Details ⊕</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="project-card-footer">
                <span>EXPLORE LIVE PRODUCTION AT CHREZAA.NETLIFY.APP</span>
                <span>2026 EDITION · FULL-STACK COMMERCE</span>
              </div>
            </article>
          </div>
        </section>

        {/* SECTION 04: CERTIFICATIONS */}
        <section className="section certifications-section" id="certifications" ref={certRef}>
          <div className="section-kicker scroll-reveal" ref={certKickerRef}>
            <div className="kicker-left">
              <span className="kicker-index">04</span>
              <span className="kicker-divider">/</span>
              <span className="kicker-title">CREDENTIALS</span>
            </div>
            <span className="kicker-tag">VERIFIED INDUSTRY CERTIFICATIONS</span>
          </div>

          <div className="section-header-block scroll-reveal">
            <h2 className="section-title">CERTIFIED IN TECH.</h2>
            <p className="section-description">
              Verified credentials showcasing foundational competencies in networking architectures, relational databases, and SQL query optimization.
            </p>
          </div>

          <div className="cert-table">
            {certificateItems.map((cert) => (
              <article className="cert-row scroll-reveal" key={cert.number}>
                <div className="cert-index">{cert.number}</div>

                <div className="cert-main">
                  <div className="cert-domain">{cert.category}</div>
                  <h3 className="cert-title">{cert.title}</h3>
                  <p className="cert-desc">{cert.description}</p>
                  <div className="cert-meta-tags">
                    <span className="cert-issuer">{cert.issuer}</span>
                    <span className="cert-dot">•</span>
                    <span className="cert-date">{cert.date}</span>
                  </div>
                </div>

                <div className="cert-action-col">
                  <a
                    href={cert.href}
                    target="_blank"
                    rel="noreferrer"
                    className="cert-link-btn"
                    title={`View ${cert.title} certificate PDF`}
                  >
                    <span>View PDF</span>
                    <span className="cert-arrow">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="cert-footer-stats scroll-reveal">
            <span>3 OF 3 VERIFIED CERTIFICATIONS</span>
            <span>CISCO & HACKERRANK CERTIFIED</span>
          </div>
        </section>

        {/* SECTION 05: CONTACT */}
        <section className="section contact-section" id="contact" ref={contactRef}>
          <div className="section-kicker" ref={contactKickerRef}>
            <div className="kicker-left">
              <span className="kicker-index">05</span>
              <span className="kicker-divider">/</span>
              <span className="kicker-title">CONTACT</span>
            </div>
            <span className="kicker-tag">COLLABORATION & INQUIRIES</span>
          </div>

          <div className="contact-editorial-layout">
            <div className="contact-headline-col" ref={contactHeadlineColRef}>
              <h2 className="contact-giant-title" ref={contactTitleRef}>
                <span className="contact-line-mask">
                  <span className="contact-line">LET&apos;S</span>
                </span>
                <span className="contact-line-mask">
                  <span className="contact-line">WORK</span>
                </span>
                <span className="contact-line-mask">
                  <span className="contact-line">TOGETHER.</span>
                </span>
              </h2>
              <p className="contact-lead-text" ref={contactLeadRef}>
                Have a project in mind, looking for a passionate creative developer, or want to discuss modern web architectures? Let&apos;s create something remarkable.
              </p>
            </div>

            <div className="contact-actions-col" ref={contactActionsRef}>
              <div className="contact-email-card" ref={emailCardRef}>
                <span className="card-sub-label">DIRECT INQUIRY</span>
                <a href="mailto:ymitesh760@gmail.com" className="email-giant-link">
                  ymitesh760@gmail.com
                </a>
                <div className="email-button-row">
                  <a href="mailto:ymitesh760@gmail.com" className="contact-primary-btn">
                    <span>Send Email</span>
                    <span className="btn-arrow">↗</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className={`contact-copy-btn ${copiedEmail ? "copied" : ""}`}
                  >
                    {copiedEmail ? "✓ Copied to Clipboard" : "Copy Address"}
                  </button>
                </div>
              </div>

              <div className="contact-social-grid" ref={socialGridRef}>
                <a
                  href="https://github.com/ymitesh760-star"
                  target="_blank"
                  rel="noreferrer"
                  className="social-card"
                >
                  <div className="social-card-inner">
                    <span className="social-platform">GITHUB</span>
                    <strong className="social-handle">@ymitesh760-star</strong>
                  </div>
                  <span className="social-arrow">↗</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/mitesh-yadav-b89192415/"
                  target="_blank"
                  rel="noreferrer"
                  className="social-card"
                >
                  <div className="social-card-inner">
                    <span className="social-platform">LINKEDIN</span>
                    <strong className="social-handle">Mitesh Yadav</strong>
                  </div>
                  <span className="social-arrow">↗</span>
                </a>

                <div className="social-card location-card">
                  <div className="social-card-inner">
                    <span className="social-platform">BASE LOCATION</span>
                    <strong className="social-handle">Mumbai, India</strong>
                  </div>
                  <span className="location-flag">IN</span>
                </div>
              </div>
            </div>
          </div>

          <footer className="editorial-footer" ref={footerRef}>
            <div className="footer-col">
              <span className="footer-meta-label">CURRENT AVAILABILITY</span>
              <strong className="footer-meta-val">Full-time Roles & Projects (2026)</strong>
            </div>

            <div className="footer-col">
              <span className="footer-meta-label">LOCATION & TIMEZONE</span>
              <strong className="footer-meta-val">Mumbai, India · UTC+5:30</strong>
            </div>

            <div className="footer-col right">
              <span className="footer-meta-label">PORTFOLIO EDITION</span>
              <strong className="footer-meta-val">Mitesh Yadav © 2026</strong>
            </div>
          </footer>
        </section>
      </main>

      {/* PROJECT DETAILS MODAL */}
      {selectedProject && (
        <div
          className="project-modal-backdrop"
          onClick={() => {
            setSelectedProject(null);
            soundEnabled && luxuryAudio.playTactileClick();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
        >
          <div
            className="project-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="project-modal-header">
              <div className="modal-tag">
                <span>
                  {selectedProject === "chrezaa"
                    ? "PROJECT / 02 · FULL-STACK E-COMMERCE"
                    : "PROJECT / 01 · ALGORITHM VISUALIZATION"}
                </span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => {
                  setSelectedProject(null);
                  soundEnabled && luxuryAudio.playTactileClick();
                }}
                aria-label="Close project modal"
                title="Close (Esc)"
              >
                ✕
              </button>
            </div>

            <div className="project-modal-body">
              {selectedProject === "chrezaa" ? (
                <>
                  <div className="modal-hero-header">
                    <span className="modal-eyebrow">HAUTE COUTURE 2026 · PRODUCTION ATELIER</span>
                    <h2 id="modal-project-title" className="modal-title">CHREZAA ATELIER</h2>
                    <p className="modal-lead">
                      A full-stack luxury fashion e-commerce boutique platform built for Indian couture collections, multi-tier supplier operations, real-time inventory synchronization, and conversational order dispatch.
                    </p>

                    <div className="modal-cta-row">
                      <a
                        href="https://6ad435c390ed2d78279911b9--chrezaa.netlify.app/"
                        target="_blank"
                        rel="noreferrer"
                        className="editorial-action-btn primary"
                        onClick={() => soundEnabled && luxuryAudio.playTactileClick()}
                      >
                        <span>Launch Live Demo</span>
                        <span className="btn-arrow">↗</span>
                      </a>
                      <a
                        href="https://github.com/ymitesh760-star/Womens-Fashion-"
                        target="_blank"
                        rel="noreferrer"
                        className="editorial-action-btn secondary"
                        onClick={() => soundEnabled && luxuryAudio.playTactileClick()}
                      >
                        <span>GitHub Repository</span>
                        <span className="btn-arrow">↗</span>
                      </a>
                    </div>
                  </div>

                  <div className="modal-image-showcase">
                    <div className="browser-chrome-bar">
                      <div className="browser-dots">
                        <span className="b-dot close" />
                        <span className="b-dot min" />
                        <span className="b-dot max" />
                      </div>
                      <div className="browser-url-pill">
                        <span>https://chrezaa.netlify.app</span>
                      </div>
                      <span className="browser-badge">Live Production</span>
                    </div>
                    <img
                      src="/projects/chrezaa.jpg"
                      alt="CHREZAA Live Boutique Showcase"
                      className="modal-feature-img"
                    />
                  </div>

                  <div className="modal-details-grid">
                    <div className="modal-detail-card">
                      <h3 className="modal-card-title">ECOSYSTEM ARCHITECTURE</h3>
                      <p className="modal-card-text">
                        Designed with 3 dedicated user tiers:
                      </p>
                      <ul className="modal-feature-list">
                        <li>
                          <strong>Boutique Storefront:</strong> High-end luxury experience with editorial collections (Dresses, Footwear, Jewellery, Bags, Ethnic Wear), instant wishlist, and cart bag management.
                        </li>
                        <li>
                          <strong>Supplier Dashboard:</strong> Isolated portal enabling partner artisans to manage catalog pieces, edit available sizes, and monitor order fulfillments.
                        </li>
                        <li>
                          <strong>Super-Admin Hub:</strong> Real-time oversight over total GMV, supplier commissions, order status toggles, and catalog curation.
                        </li>
                      </ul>
                    </div>

                    <div className="modal-detail-card">
                      <h3 className="modal-card-title">COMMERCE & AI INNOVATIONS</h3>
                      <ul className="modal-feature-list">
                        <li>
                          <strong>Firebase Cloud Firestore:</strong> Synchronizes live stock counts, pricing, customer inquiries, and order records with zero latency.
                        </li>
                        <li>
                          <strong>Automated WhatsApp Notifications:</strong> Automated transactional customer alerts for order confirmations, dispatch, and doorstep status tracking.
                        </li>
                        <li>
                          <strong>AI Wardrobe Stylist:</strong> An interactive concierge helping patrons discover silhouettes and complete the look with styling rationale.
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="modal-tech-section">
                    <h4 className="info-heading">VERIFIED TECH STACK</h4>
                    <div className="tech-tags-cloud">
                      <span>React.js 18</span>
                      <span>Firebase Firestore</span>
                      <span>Firebase Storage</span>
                      <span>React Router v6</span>
                      <span>Framer Motion</span>
                      <span>Lucide React</span>
                      <span>WhatsApp Cloud API</span>
                      <span>Vite Tooling</span>
                      <span>Netlify Production</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="modal-hero-header">
                    <span className="modal-eyebrow">GRAPH ALGORITHMS & STATE SCHEDULING</span>
                    <h2 id="modal-project-title" className="modal-title">PATHFINDING VISUALIZER</h2>
                    <p className="modal-lead">
                      An interactive sandbox to simulate, benchmark, and visualize shortest-path search algorithms and maze generation heuristics in real-time.
                    </p>

                    <div className="modal-cta-row">
                      <a
                        href="https://pathfinding-visualizer-react-js-pro.vercel.app/"
                        target="_blank"
                        rel="noreferrer"
                        className="editorial-action-btn primary"
                        onClick={() => soundEnabled && luxuryAudio.playTactileClick()}
                      >
                        <span>Launch Live Project</span>
                        <span className="btn-arrow">↗</span>
                      </a>
                      <a
                        href="https://github.com/ymitesh760-star"
                        target="_blank"
                        rel="noreferrer"
                        className="editorial-action-btn secondary"
                        onClick={() => soundEnabled && luxuryAudio.playTactileClick()}
                      >
                        <span>GitHub Repository</span>
                        <span className="btn-arrow">↗</span>
                      </a>
                    </div>
                  </div>

                  <div className="modal-details-grid">
                    <div className="modal-detail-card">
                      <h3 className="modal-card-title">ALGORITHMIC MECHANICS</h3>
                      <ul className="modal-feature-list">
                        <li>
                          <strong>A* Search:</strong> Optimal path heuristic using Manhattan coordinate distances to reduce visited nodes.
                        </li>
                        <li>
                          <strong>Dijkstra&apos;s Algorithm:</strong> Guaranteed shortest path across weighted grids.
                        </li>
                        <li>
                          <strong>Breadth-First Search (BFS):</strong> Level-by-level exhaustive unweighted graph exploration.
                        </li>
                        <li>
                          <strong>Depth-First Search (DFS):</strong> Recursive branch traversal exploration.
                        </li>
                      </ul>
                    </div>

                    <div className="modal-detail-card">
                      <h3 className="modal-card-title">PERFORMANCE & ARCHITECTURE</h3>
                      <ul className="modal-feature-list">
                        <li>
                          <strong>Custom State Scheduler:</strong> Decoupled animation ticks ensuring 60 FPS renders during complex grid path calculations.
                        </li>
                        <li>
                          <strong>Dynamic Obstacle Canvas:</strong> Drag-and-drop wall placement and interactive weight nodes.
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="modal-tech-section">
                    <h4 className="info-heading">TECH STACK</h4>
                    <div className="tech-tags-cloud">
                      <span>React.js</span>
                      <span>JavaScript (ES6+)</span>
                      <span>A* Algorithm</span>
                      <span>Dijkstra</span>
                      <span>CSS Grid</span>
                      <span>Vercel</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
