import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./index.css";

gsap.registerPlugin(ScrollTrigger);

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

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    let rafId;
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
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

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <>
      <div className="custom-cursor-dot" ref={cursorDotRef} />
      <div className="custom-cursor-ring" ref={cursorRingRef} />
    </>
  );
}

function App() {
  const portfolioRef = useRef(null);
  const introRef = useRef(null);
  const stageRef = useRef(null);
  const myRef = useRef(null);
  const identityRef = useRef(null);
  const nameRef = useRef(null);
  const roleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  // About Section Refs
  const aboutRef = useRef(null);
  const aboutKickerRef = useRef(null);
  const aboutHeadlineColRef = useRef(null);
  const aboutHeadlineRef = useRef(null);
  const aboutSideColRef = useRef(null);
  const aboutTableRef = useRef(null);

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

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentTime, setCurrentTime] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

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
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis = null;

    if (!prefersReducedMotion) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.2,
      });

      lenis.on("scroll", ScrollTrigger.update);

      const updateLenis = (time) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(myRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set(identityRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set(scrollIndicatorRef.current, { opacity: 0 });
        return;
      }

      // Step 4: Initial GSAP States
      gsap.set(myRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
      });

      gsap.set(identityRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 0,
      });

      gsap.set(scrollIndicatorRef.current, {
        opacity: 1,
        y: 0,
      });

      // Master Intro Timeline driven by GSAP ScrollTrigger Scrub
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: introRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Scroll indicator fades out immediately
      tl.to(
        scrollIndicatorRef.current,
        {
          opacity: 0,
          duration: 0.5,
          ease: "power1.out",
        },
        0
      )
        // 2. PHASE 1 & 2: MY transitions out
        .to(
          myRef.current,
          {
            scale: 0.65,
            opacity: 0,
            duration: 1.5,
            ease: "power2.inOut",
          },
          0
        )
        // 3. PHASE 3: Identity appears in the exact center
        .to(identityRef.current, {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
        })
        // 4. PHASE 4 (HOLD): Identity remains centered and visible
        .to(identityRef.current, {
          opacity: 1,
          scale: 1,
          duration: 3,
        })
        // 5. PHASE 5: Identity transitions out toward About
        .to(identityRef.current, {
          opacity: 0,
          y: -40,
          duration: 1,
          ease: "power1.in",
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

      ScrollTrigger.refresh();
    }, portfolioRef);

    return () => {
      if (lenis) {
        lenis.off("scroll", ScrollTrigger.update);
        lenis.destroy();
      }
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
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
        
        <div className="brand-group" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="brand-mark">MY</span>
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
          >
            About
          </button>
          <button
            type="button"
            className={activeSection === "skills" ? "active" : ""}
            onClick={() => scrollToSection("skills")}
          >
            Skills
          </button>
          <button
            type="button"
            className={activeSection === "projects" ? "active" : ""}
            onClick={() => scrollToSection("projects")}
          >
            Work
          </button>
          <button
            type="button"
            className={activeSection === "certifications" ? "active" : ""}
            onClick={() => scrollToSection("certifications")}
          >
            Certificates
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("contact")}
            className={`nav-contact-btn ${activeSection === "contact" ? "active" : ""}`}
          >
            Let&apos;s Talk
          </button>
        </nav>
      </header>

      <main>
        {/* OPENING EXPERIENCE: Dedicated 400vh Scroll-Driven Staged Intro */}
        <section className="intro-scroll" ref={introRef} aria-label="Intro scroll stage">
          <div className="intro-stage" ref={stageRef}>
            {/* STATE 1: Huge 'MY' Centered Mark */}
            <div className="intro-my" ref={myRef} aria-label="Mitesh Yadav Initials">
              MY
            </div>

            {/* STATE 2: Centered Identity Composition (MITESH YADAV + CREATIVE DEVELOPER) */}
            <div className="intro-identity" ref={identityRef}>
              <h1 className="intro-name" ref={nameRef}>MITESH YADAV</h1>
              <p className="intro-role" ref={roleRef}>CREATIVE DEVELOPER</p>
            </div>

            <div className="scroll-indicator" ref={scrollIndicatorRef}>
              <span className="scroll-text">SCROLL TO EXPLORE</span>
              <div className="scroll-line">
                <div className="scroll-dot" />
              </div>
            </div>
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
        <section className="section skills-section" id="skills">
          <div className="section-kicker scroll-reveal">
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

        {/* SECTION 03: FEATURED PROJECT (EXACTLY ONE PROJECT: PATHFINDING VISUALIZER) */}
        <section className="section projects-section" id="projects">
          <div className="section-kicker scroll-reveal">
            <div className="kicker-left">
              <span className="kicker-index">03</span>
              <span className="kicker-divider">/</span>
              <span className="kicker-title">SELECTED WORK</span>
            </div>
            <span className="kicker-tag">FEATURED PROJECT — 01 OF 01</span>
          </div>

          <div className="section-header-block scroll-reveal">
            <h2 className="section-title">FEATURED PROJECT.</h2>
            <p className="section-description">
              A deep dive into algorithmic problem solving, graph theory, and interactive user interface engineering.
            </p>
          </div>

          {/* Featured Single Project Showcase */}
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
                >
                  <span>Launch Live Project</span>
                  <span className="btn-arrow">↗</span>
                </a>
                <a
                  href="https://github.com/ymitesh760-star"
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-action-btn secondary"
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
        </section>

        {/* SECTION 04: CERTIFICATIONS */}
        <section className="section certifications-section" id="certifications">
          <div className="section-kicker scroll-reveal">
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
    </div>
  );
}

export default App;
