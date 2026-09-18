import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./index.css";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const portfolioRef = useRef(null);

  useLayoutEffect(() => {
    const eventCleanups = [];
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarsePointer = window.matchMedia(
      "(pointer: coarse)"
    ).matches;
    let lenis = null;
    let lenisFrame = null;

    if (!reducedMotion && !coarsePointer) {
      lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1
      });

      lenis.on("scroll", ScrollTrigger.update);

      const runLenis = (time) => {
        lenis.raf(time);
        lenisFrame = window.requestAnimationFrame(runLenis);
      };

      lenisFrame = window.requestAnimationFrame(runLenis);
    }

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        ScrollTrigger.refresh();
        return;
      }

      const intro = gsap.timeline({
        defaults: {
          ease: "power4.out"
        }
      });

      intro
        .fromTo(
          ".brand",
          { y: -12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65 },
          0
        )
        .fromTo(
          ".nav-meta",
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65 },
          "-=0.42"
        )
        .fromTo(
          ".hero-label",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 }
        )
        .fromTo(
          ".name-top span",
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.15,
            ease: "power4.inOut"
          },
          "-=0.5"
        )
        .fromTo(
          ".name-bottom span",
          { clipPath: "inset(0 0 0 100%)" },
          {
            clipPath: "inset(0 0 0 0%)",
            duration: 1.15,
            ease: "power4.inOut"
          },
          "-=0.82"
        )
        .fromTo(
          ".hero-mark",
          { y: 24, scale: 0.84, opacity: 0, rotation: -2 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 1.25,
            ease: "power4.out"
          },
          "-=0.72"
        )
        .fromTo(
          ".hero-description",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.65"
        )
        .fromTo(
          ".hero-footer",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75 },
          "-=0.55"
        );

      gsap.to(".hero-mark", {
        y: -86,
        opacity: 0.12,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.2
        }
      });

      gsap.to(".hero-mark-frame", {
        scaleX: 2.6,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.2
        }
      });

      gsap.to(".hero-transition-line", {
        scaleX: 1,
        opacity: 0.55,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "65% top",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.to(".hero-transition-wash", {
        opacity: 0.38,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "70% top",
          end: "bottom top",
          scrub: 1.2
        }
      });

      const mark = portfolioRef.current?.querySelector(".hero-mark");
      const cursor = portfolioRef.current?.querySelector(".custom-cursor");
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      const cursorX = cursor ? gsap.quickTo(cursor, "x", { duration: 0.22, ease: "power3.out" }) : null;
      const cursorY = cursor ? gsap.quickTo(cursor, "y", { duration: 0.22, ease: "power3.out" }) : null;

      if (mark && finePointer) {
        const topName = portfolioRef.current.querySelector(".name-top");
        const bottomName = portfolioRef.current.querySelector(".name-bottom");
        const topX = topName ? gsap.quickTo(topName, "x", { duration: 0.7, ease: "power3.out" }) : null;
        const topY = topName ? gsap.quickTo(topName, "y", { duration: 0.7, ease: "power3.out" }) : null;
        const bottomX = bottomName ? gsap.quickTo(bottomName, "x", { duration: 0.7, ease: "power3.out" }) : null;
        const bottomY = bottomName ? gsap.quickTo(bottomName, "y", { duration: 0.7, ease: "power3.out" }) : null;

        const moveMark = (event) => {
          const bounds = mark.getBoundingClientRect();
          const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
          const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 8;
          mark.style.setProperty("--mark-shift-x", `${x}px`);
          mark.style.setProperty("--mark-shift-y", `${y}px`);
          cursorX?.(event.clientX);
          cursorY?.(event.clientY);
          topX?.(x * 0.22);
          topY?.(y * 0.16);
          bottomX?.(x * -0.2);
          bottomY?.(y * -0.14);
        };

        const resetMark = () => {
          mark.style.setProperty("--mark-shift-x", "0px");
          mark.style.setProperty("--mark-shift-y", "0px");
          topX?.(0);
          topY?.(0);
          bottomX?.(0);
          bottomY?.(0);
        };

        mark.addEventListener("pointermove", moveMark);
        mark.addEventListener("pointerleave", resetMark);

        eventCleanups.push(() => {
          mark.removeEventListener("pointermove", moveMark);
          mark.removeEventListener("pointerleave", resetMark);
        });
      }

        const moveCursor = (event) => {
          cursorX?.(event.clientX);
          cursorY?.(event.clientY);
        };

        const enterTarget = () => {
          cursor?.classList.add("is-hovering");
        };

        const leaveTarget = () => {
          cursor?.classList.remove("is-hovering");
        };

        window.addEventListener("pointermove", moveCursor, { passive: true });
        portfolioRef.current.querySelectorAll(
          ".cursor-target, .skill-card, .project-item, .certificate-item, .certificate-view, .contact-action"
        ).forEach((target) => {
          target.addEventListener("pointerenter", enterTarget);
          target.addEventListener("pointerleave", leaveTarget);
          eventCleanups.push(() => {
            target.removeEventListener("pointerenter", enterTarget);
            target.removeEventListener("pointerleave", leaveTarget);
          });
        });

        eventCleanups.push(() => {
          window.removeEventListener("pointermove", moveCursor);
        });

      gsap.utils.toArray(".scroll-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true
            }
          }
        );
      });

      gsap.fromTo(
        ".intro-heading",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".intro-section",
            start: "top 85%",
            once: true
          }
        }
      );

      gsap.fromTo(
        ".intro-description",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".intro-section",
            start: "top 85%",
            once: true
          }
        }
      );

      gsap.fromTo(
        ".detail-item",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".intro-section",
            start: "top 85%",
            once: true
          }
        }
      );

      gsap.fromTo(
        ".skill-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".skills-grid",
            start: "top 85%",
            once: true
          }
        }
      );

      gsap.utils.toArray(".project-item").forEach((project) => {
        gsap.fromTo(
          project,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: project,
              start: "top 85%",
              once: true
            }
          }
        );

        const arrow = project.querySelector(".project-arrow");

        if (arrow) {
          const moveArrow = () => {
            gsap.to(arrow, {
              x: 6,
              y: -6,
              duration: 0.45,
              ease: "power3.out",
              overwrite: true
            });
          };

          const resetArrow = () => {
            gsap.to(arrow, {
              x: 0,
              y: 0,
              duration: 0.45,
              ease: "power3.out",
              overwrite: true
            });
          };

          project.addEventListener("mouseenter", moveArrow);
          project.addEventListener("mouseleave", resetArrow);

          eventCleanups.push(() => {
            project.removeEventListener("mouseenter", moveArrow);
            project.removeEventListener("mouseleave", resetArrow);
          });
        }
      });

      gsap.fromTo(
        ".certificate-item",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".certifications-section",
            start: "top 85%",
            once: true
          }
        }
      );

      gsap.fromTo(
        ".contact-heading-wrap h2",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".contact-section",
            start: "top 85%",
            once: true
          }
        }
      );

      gsap.fromTo(
        ".contact-detail, .contact-action",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-section",
            start: "top 85%",
            once: true
          }
        }
      );

      gsap.fromTo(
        ".contact-footer",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-footer",
            start: "top 95%",
            once: true
          }
        }
      );

      ScrollTrigger.refresh();
    }, portfolioRef);

    return () => {
      eventCleanups.forEach((cleanup) => cleanup());

      if (lenis) {
        lenis.off("scroll", ScrollTrigger.update);
        lenis.destroy();
      }

      if (lenisFrame !== null) {
        window.cancelAnimationFrame(lenisFrame);
      }

      ctx.revert();
    };
  }, []);

  return (
    <div className="portfolio" ref={portfolioRef}>

      {/* ================= NAVBAR ================= */}

      <header className="navbar">
        <div className="brand">MY.</div>

        <div className="nav-meta cursor-target">
          <span>01</span>
          <span>MENU</span>
        </div>
      </header>


      {/* ================= HERO ================= */}

      <main className="hero">

        <div className="hero-grid"></div>
        <div className="hero-ambient" aria-hidden="true"></div>

        <div className="hero-label">
          CREATIVE DEVELOPER
        </div>

        <div className="hero-name">

          <div className="name-line name-top">
            <span>MITESH</span>
          </div>

          <div className="name-line name-bottom">
            <span>YADAV</span>
          </div>

        </div>

        <div className="visual hero-mark" aria-hidden="true">
          <div className="hero-mark-frame">
            <span className="hero-mark-line hero-mark-line-main"></span>
            <span className="hero-mark-line hero-mark-line-secondary"></span>
            <span className="hero-mark-tick hero-mark-tick-one"></span>
            <span className="hero-mark-tick hero-mark-tick-two"></span>
            <span className="hero-mark-tick hero-mark-tick-three"></span>
            <span className="hero-mark-light"></span>
            <span className="hero-mark-fragment hero-mark-fragment-one"></span>
            <span className="hero-mark-fragment hero-mark-fragment-two"></span>
          </div>
        </div>

        <div className="hero-description">
          <span>I BUILD DIGITAL</span>
          <span>EXPERIENCES.</span>
        </div>

        <div className="hero-footer">

          <span>BASED IN MUMBAI</span>

          <div className="scroll-indicator cursor-target">
            <span>SCROLL TO ENTER</span>
            <span className="scroll-arrow">↓</span>
          </div>

          <span>2026</span>

        </div>

        <div className="hero-transition-wash" aria-hidden="true"></div>
        <div className="hero-transition-line" aria-hidden="true"></div>

      </main>

      <div className="custom-cursor" aria-hidden="true">
        <span className="custom-cursor-dot"></span>
        <span className="custom-cursor-ring"></span>
      </div>


      {/* ================= ABOUT ================= */}

      <section className="intro-section" id="about">

        <div className="section-top scroll-reveal">

          <span className="section-number">
            02 / ABOUT
          </span>

          <span className="section-tag">
            GET TO KNOW ME
          </span>

        </div>

        <div className="intro-content">

          <div className="intro-heading">

            <span>BUILDING</span>
            <span>IDEAS</span>
            <span>INTO</span>
            <span>EXPERIENCES.</span>

          </div>

          <div className="intro-side">

            <p className="intro-description">
              I'm Mitesh Yadav — a Computer Science
              student and developer focused on creating
              interactive, modern and visually distinctive
              digital experiences.
            </p>

            <div className="intro-details">

              <div className="detail-item">
                <span>EDUCATION</span>
                <strong>B.TECH CSE</strong>
              </div>

              <div className="detail-item">
                <span>UNIVERSITY</span>
                <strong>ITM SKILLS UNIVERSITY</strong>
              </div>

              <div className="detail-item">
                <span>LOCATION</span>
                <strong>MUMBAI, INDIA</strong>
              </div>

            </div>

          </div>

        </div>

        <div className="intro-bottom">

          <span>SCROLL TO EXPLORE</span>

          <div className="line"></div>

          <span>02</span>

        </div>

      </section>


      {/* ================= SKILLS ================= */}

      <section className="skills-section" id="skills">

        <div className="skills-top scroll-reveal">

          <span className="section-number">
            03 / SKILLS
          </span>

          <span className="section-tag">
            WHAT I WORK WITH
          </span>

        </div>

        <div className="skills-heading scroll-reveal">

          <h2>
            MY
            <br />
            SKILLS.
          </h2>

          <p>
            Technologies and tools I use while building,
            learning and experimenting with digital
            experiences.
          </p>

        </div>

        <div className="skills-grid">

          <div className="skill-card">

            <div className="skill-top">
              <span>01</span>
              <span>FRONTEND</span>
            </div>

            <div className="skill-main">
              <h3>React.js</h3>
              <p>Frontend Development</p>
            </div>

            <div className="skill-progress">
              <span className="progress-react"></span>
            </div>

          </div>


          <div className="skill-card">

            <div className="skill-top">
              <span>02</span>
              <span>PROGRAMMING</span>
            </div>

            <div className="skill-main">
              <h3>JavaScript</h3>
              <p>Programming & Web</p>
            </div>

            <div className="skill-progress">
              <span className="progress-js"></span>
            </div>

          </div>


          <div className="skill-card">

            <div className="skill-top">
              <span>03</span>
              <span>WEB</span>
            </div>

            <div className="skill-main">
              <h3>HTML / CSS</h3>
              <p>Web Development</p>
            </div>

            <div className="skill-progress">
              <span className="progress-html"></span>
            </div>

          </div>


          <div className="skill-card">

            <div className="skill-top">
              <span>04</span>
              <span>PROGRAMMING</span>
            </div>

            <div className="skill-main">
              <h3>Python</h3>
              <p>Programming</p>
            </div>

            <div className="skill-progress">
              <span className="progress-python"></span>
            </div>

          </div>


          <div className="skill-card">

            <div className="skill-top">
              <span>05</span>
              <span>PROBLEM SOLVING</span>
            </div>

            <div className="skill-main">
              <h3>C++ / DSA</h3>
              <p>Algorithms & Problem Solving</p>
            </div>

            <div className="skill-progress">
              <span className="progress-dsa"></span>
            </div>

          </div>


          <div className="skill-card">

            <div className="skill-top">
              <span>06</span>
              <span>LEARNING</span>
            </div>

            <div className="skill-main">
              <h3>Java</h3>
              <p>Currently Learning</p>
            </div>

            <div className="skill-progress">
              <span className="progress-java"></span>
            </div>

          </div>

        </div>

        <div className="skills-footer">

          <span>MORE COMING</span>
          <span>03</span>

        </div>

      </section>


      {/* ================= PROJECTS ================= */}

      <section className="projects-section" id="projects">

        <div className="projects-top scroll-reveal">

          <span className="section-number">
            04 / SELECTED WORK
          </span>

          <span className="section-tag">
            THINGS I'VE BUILT
          </span>

        </div>

        <div className="projects-heading scroll-reveal">

          <h2>
            SELECTED
            <br />
            WORK.
          </h2>

          <p>
            A selection of digital projects where I
            experiment with interfaces, development,
            algorithms and interactive experiences.
          </p>

        </div>


        {/* PROJECT 01 */}

        <article className="project-item">

          <div className="project-meta">

            <span>01</span>
            <span>REACT / ALGORITHMS</span>

          </div>

          <div className="project-content">

            <div className="project-title">

              <span>PATHFINDING</span>
              <span>VISUALIZER</span>

            </div>

            <div className="project-description">

              <p>
                An interactive pathfinding visualizer
                built to explore algorithms and understand
                how different search strategies find a path.
              </p>

              <span className="project-tech">
                REACT.JS · JAVASCRIPT · A*
              </span>

            </div>

            <div className="project-visual project-visual-one">

              <div className="visual-window">

                <div className="window-top">

                  <span>PATHFINDING VISUALIZER</span>
                  <span>01</span>

                </div>

                <div className="path-grid">

                  {Array.from({ length: 16 }).map((_, index) => (
                    <span key={index}></span>
                  ))}

                </div>

                <div className="visual-label">
                  A* ALGORITHM
                </div>

              </div>

            </div>

          </div>

          <div className="project-bottom">

            <a
              href="https://pathfinding-visualizer-react-js-pro.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="project-link"
            >
              <span>VIEW PROJECT</span>
              <span className="project-arrow">
                ↗
              </span>
            </a>

          </div>

        </article>


        {/* PROJECT 02 */}

        <article className="project-item">

          <div className="project-meta">

            <span>02</span>
            <span>WEB / FRONTEND</span>

          </div>

          <div className="project-content">

            <div className="project-title">

              <span>CAREER</span>
              <span>HUB</span>

            </div>

            <div className="project-description">

              <p>
                A career-focused web experience designed
                around discovering opportunities and making
                job searching more structured.
              </p>

              <span className="project-tech">
                REACT.JS · JAVASCRIPT · CSS
              </span>

            </div>

            <div className="project-visual project-visual-two">

              <div className="career-interface">

                <div className="career-header">

                  <span>CAREER HUB</span>
                  <span>SEARCH</span>

                </div>

                <div className="career-line"></div>

                <div className="career-body">

                  <div className="career-sidebar">

                    <span>FILTERS</span>
                    <span>ROLE</span>
                    <span>LOCATION</span>
                    <span>SKILLS</span>

                  </div>

                  <div className="career-results">

                    <div></div>
                    <div></div>
                    <div></div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          <div className="project-bottom">

            <span>VIEW PROJECT</span>

            <span className="project-arrow">
              ↗
            </span>

          </div>

        </article>


        {/* PROJECT 03 */}

        <article className="project-item">

          <div className="project-meta">

            <span>03</span>
            <span>WEB / JAVASCRIPT</span>

          </div>

          <div className="project-content">

            <div className="project-title">

              <span>E-LIBRARY</span>
              <span>SYSTEM</span>

            </div>

            <div className="project-description">

              <p>
                A digital library interface focused on
                organizing books, browsing content and
                creating a clean user experience.
              </p>

              <span className="project-tech">
                JAVASCRIPT · HTML · CSS
              </span>

            </div>

            <div className="project-visual project-visual-three">

              <div className="library-interface">

                <div className="library-title">
                  E-LIBRARY
                </div>

                <div className="book-stack">

                  <div className="book book-one">
                    DESIGN
                  </div>

                  <div className="book book-two">
                    CODE
                  </div>

                  <div className="book book-three">
                    IDEAS
                  </div>

                </div>

              </div>

            </div>

          </div>

          <div className="project-bottom">

            <span>VIEW PROJECT</span>

            <span className="project-arrow">
              ↗
            </span>

          </div>

        </article>


        <div className="projects-footer">

          <span>MORE PROJECTS COMING</span>
          <span>04</span>

        </div>

      </section>


      {/* ================= CERTIFICATIONS ================= */}

      <section
        className="certifications-section"
        id="certifications"
      >

        <div className="certifications-top scroll-reveal">

          <span className="section-number">
            05 / CERTIFICATIONS
          </span>

          <span className="section-tag">
            VERIFIED LEARNING
          </span>

        </div>


        <div className="certifications-heading scroll-reveal">

          <h2>
            CERTIFIED
            <br />
            IN TECH.
          </h2>

          <p>
            Certifications that represent the skills,
            concepts and technologies I have explored
            throughout my learning journey.
          </p>

        </div>


        {/* CERTIFICATE 01 */}

        <article className="certificate-item">

          <div className="certificate-number">
            01
          </div>

          <div className="certificate-info">

            <span className="certificate-category">
              NETWORKING
            </span>

            <h3>
              NETWORKING
              <br />
              BASICS
            </h3>

            <p>
              Cisco Networking Academy
            </p>

            <span className="certificate-date">
              ISSUED · 11 SEP 2026
            </span>

          </div>

          <a
            href="/certificates/networking-basics.pdf"
            target="_blank"
            rel="noreferrer"
            className="certificate-view"
          >

            <span>VIEW CERTIFICATE</span>
            <span>↗</span>

          </a>

        </article>


        {/* CERTIFICATE 02 */}

        <article className="certificate-item">

          <div className="certificate-number">
            02
          </div>

          <div className="certificate-info">

            <span className="certificate-category">
              DATABASE
            </span>

            <h3>
              SQL
              <br />
              BASIC
            </h3>

            <p>
              HackerRank Skill Certification
            </p>

            <span className="certificate-date">
              EARNED · 16 SEP 2026
            </span>

          </div>

          <a
            href="/certificates/sql-basic.pdf"
            target="_blank"
            rel="noreferrer"
            className="certificate-view"
          >

            <span>VIEW CERTIFICATE</span>
            <span>↗</span>

          </a>

        </article>


        {/* CERTIFICATE 03 */}

        <article className="certificate-item">

          <div className="certificate-number">
            03
          </div>

          <div className="certificate-info">

            <span className="certificate-category">
              DATABASE
            </span>

            <h3>
              SQL
              <br />
              INTERMEDIATE
            </h3>

            <p>
              HackerRank Skill Certification
            </p>

            <span className="certificate-date">
              EARNED · 16 SEP 2026
            </span>

          </div>

          <a
            href="/certificates/sql-intermediate.pdf"
            target="_blank"
            rel="noreferrer"
            className="certificate-view"
          >

            <span>VIEW CERTIFICATE</span>
            <span>↗</span>

          </a>

        </article>


        <div className="certifications-footer">

          <span>
            3 VERIFIED CERTIFICATIONS
          </span>

          <span>
            05
          </span>

        </div>

      </section>


      {/* ================= CONTACT ================= */}

      <section
        className="contact-section"
        id="contact"
      >

        <div className="contact-top scroll-reveal">

          <span className="section-number">
            06 / CONTACT
          </span>

          <span className="section-tag">
            GET IN TOUCH
          </span>

        </div>


        <div className="contact-main">

          <div className="contact-heading-wrap">

            <h2>
              LET'S
              <br />
              BUILD
              <br />
              SOMETHING
              <br />
              TOGETHER.
            </h2>

            <p>
              Have an idea, project or collaboration in mind?
              <br />
              Let's turn it into something digital.
            </p>

          </div>

          <div className="contact-side">

            <a
              className="contact-action"
              href="mailto:ymiitesh760@gmail.com"
            >
              <span>LET'S TALK</span>
              <span className="contact-action-arrow">↗</span>
            </a>

            <div className="contact-details">

              <div className="contact-detail">
                <span>EMAIL</span>
                <a href="mailto:ymiitesh760@gmail.com">
                  ymiitesh760@gmail.com
                </a>
              </div>

              <div className="contact-detail">
                <span>GITHUB</span>
                <a
                  href="https://github.com/ymitesh760-star"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/ymitesh760-star
                </a>
              </div>

              <div className="contact-detail">
                <span>LINKEDIN</span>
                <a
                  href="https://www.linkedin.com/in/mitesh-yadav-b89192415/"
                  target="_blank"
                  rel="noreferrer"
                >
                  linkedin.com/in/mitesh-yadav-b89192415
                </a>
              </div>

            </div>

          </div>

        </div>

        <footer className="contact-footer">

          <div>
            <span>AVAILABLE FOR</span>
            <strong>PROJECTS / COLLABORATIONS</strong>
          </div>

          <span>MUMBAI, INDIA</span>
          <span>2026</span>
          <strong>MITESH YADAV</strong>

        </footer>

      </section>

    </div>
  );
}

export default App;