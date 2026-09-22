document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     HEMANTH B — PORTFOLIO JAVASCRIPT
  ========================================================= */


  /* =========================================================
     1. SMOOTH SCROLL
  ========================================================= */

  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {

    link.addEventListener("click", event => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });



  /* =========================================================
     2. SCROLL REVEAL
  ========================================================= */

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

          revealObserver.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -50px 0px"
    }
  );


  revealElements.forEach(element => {
    revealObserver.observe(element);
  });



  /* =========================================================
     3. LAZY LOAD VIDEOS
  ========================================================= */

  const portfolioVideos = document.querySelectorAll(
    "video[data-video]"
  );


  function loadVideo(video) {

    if (!video) return;

    if (video.dataset.loaded === "true") {
      return;
    }

    const source = video.querySelector("source");

    if (!source) return;

    const videoURL = video.dataset.video;

    if (!videoURL) return;

    source.src = videoURL;

    video.load();

    video.dataset.loaded = "true";

  }


  const videoLoadObserver = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          loadVideo(entry.target);

          videoLoadObserver.unobserve(entry.target);

        }

      });

    },
    {
      rootMargin: "500px 0px",
      threshold: 0
    }
  );


  portfolioVideos.forEach(video => {

    videoLoadObserver.observe(video);

  });



  /* =========================================================
     4. VIDEO PLAY / PAUSE CONTROL
  ========================================================= */

  portfolioVideos.forEach(video => {

    video.addEventListener("play", () => {

      /*
        Pause every other portfolio video
      */

      portfolioVideos.forEach(otherVideo => {

        if (
          otherVideo !== video &&
          !otherVideo.paused
        ) {

          otherVideo.pause();

        }

      });


      /*
        Add playing state to current card
      */

      const card = video.closest(".project");

      if (card) {

        card.classList.add("is-playing");

      }

    });


    video.addEventListener("pause", () => {

      const card = video.closest(".project");

      if (card) {

        card.classList.remove("is-playing");

      }

    });


    video.addEventListener("ended", () => {

      const card = video.closest(".project");

      if (card) {

        card.classList.remove("is-playing");

      }

    });

  });



  /* =========================================================
     5. PAUSE VIDEOS WHEN THEY LEAVE SCREEN
  ========================================================= */

  const videoVisibilityObserver = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        const video = entry.target;

        if (!entry.isIntersecting && !video.paused) {

          video.pause();

        }

      });

    },
    {
      threshold: 0.15
    }
  );


  portfolioVideos.forEach(video => {

    videoVisibilityObserver.observe(video);

  });



  /* =========================================================
     6. CINEMATIC VIDEO MODAL
  ========================================================= */

  const videoModal =
    document.getElementById("videoModal");

  const modalVideo =
    document.getElementById("modalVideo");

  const modalClose =
    document.getElementById("videoModalClose");

  const modalBackdrop =
    videoModal?.querySelector(".video-modal-backdrop");


  function openVideoModal(video) {

    if (!videoModal || !modalVideo) return;

    /*
      Make sure the video has been loaded
    */

    loadVideo(video);


    const source =
      video.dataset.video ||
      video.currentSrc ||
      video.querySelector("source")?.src;


    if (!source) return;


    /*
      Stop the inline video
    */

    video.pause();


    /*
      Set modal video
    */

    modalVideo.src = source;

    modalVideo.currentTime = 0;


    /*
      Show modal
    */

    videoModal.classList.add("active");

    videoModal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "modal-open"
    );


    /*
      Start playing
    */

    const playPromise =
      modalVideo.play();


    if (playPromise !== undefined) {

      playPromise.catch(() => {});

    }

  }


  function closeVideoModal() {

    if (!videoModal || !modalVideo) return;


    modalVideo.pause();

    modalVideo.removeAttribute("src");

    modalVideo.load();


    videoModal.classList.remove(
      "active"
    );

    videoModal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "modal-open"
    );

  }


  /*
    VIEW button
  */

  const videoHoverButtons =
    document.querySelectorAll(
      ".video-hover"
    );


  videoHoverButtons.forEach(button => {

    button.addEventListener(
      "click",
      event => {

        event.preventDefault();

        event.stopPropagation();


        const card =
          button.closest(".project");


        const video =
          card?.querySelector("video");


        if (!video) return;


        openVideoModal(video);

      }
    );

  });


  /*
    Close button
  */

  if (modalClose) {

    modalClose.addEventListener(
      "click",
      closeVideoModal
    );

  }


  /*
    Click backdrop
  */

  if (modalBackdrop) {

    modalBackdrop.addEventListener(
      "click",
      closeVideoModal
    );

  }


  /*
    Escape key
  */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        videoModal?.classList.contains("active")
      ) {

        closeVideoModal();

      }

    }
  );



  /* =========================================================
     7. ACTIVE NAVIGATION
  ========================================================= */

  const sections =
    document.querySelectorAll(
      "main section[id]"
    );


  const navLinks =
    document.querySelectorAll(
      ".nav-links a"
    );


  const navObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;


          const sectionId =
            entry.target.getAttribute(
              "id"
            );


          navLinks.forEach(link => {

            link.classList.remove(
              "active"
            );


            const linkTarget =
              link.getAttribute(
                "href"
              );


            if (
              linkTarget ===
              `#${sectionId}`
            ) {

              link.classList.add(
                "active"
              );

            }

          });

        });

      },
      {
        rootMargin:
          "-35% 0px -55% 0px",

        threshold: 0
      }
    );


  sections.forEach(section => {

    navObserver.observe(section);

  });



  /* =========================================================
     8. VIDEO CARD HOVER
  ========================================================= */

  const videoCards =
    document.querySelectorAll(
      ".video-card"
    );


  videoCards.forEach(card => {

    card.addEventListener(
      "mouseenter",
      () => {

        card.classList.add(
          "hovered"
        );

      }
    );


    card.addEventListener(
      "mouseleave",
      () => {

        card.classList.remove(
          "hovered"
        );

      }
    );

  });



  /* =========================================================
     9. VIDEO ERROR HANDLING
  ========================================================= */

  portfolioVideos.forEach(video => {

    video.addEventListener(
      "error",
      () => {

        const card =
          video.closest(".project");


        if (!card) return;


        card.classList.add(
          "video-error"
        );

      }
    );

  });



  /* =========================================================
     10. MOBILE TOUCH BEHAVIOR
  ========================================================= */

  const isMobile =
    window.matchMedia(
      "(max-width: 800px)"
    );


  function handleMobileChange() {

    if (!isMobile.matches) return;


    /*
      Remove hover state on mobile
    */

    videoCards.forEach(card => {

      card.classList.remove(
        "hovered"
      );

    });

  }


  handleMobileChange();


  if (isMobile.addEventListener) {

    isMobile.addEventListener(
      "change",
      handleMobileChange
    );

  }



  /* =========================================================
     11. PAGE LOAD ANIMATION
  ========================================================= */

  document.body.classList.add(
    "page-loaded"
  );



  /* =========================================================
     12. PREVENT DOUBLE MODAL SCROLL
  ========================================================= */

  if (videoModal) {

    videoModal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          videoModal
        ) {

          closeVideoModal();

        }

      }
    );

  }



  /* =========================================================
     13. LOG
  ========================================================= */

  console.log(
    "Hemanth B Portfolio — JavaScript loaded successfully."
  );

});
/* =========================================================
   SMART DYNAMIC H / V VIDEO GALLERY
========================================================= */

(function () {

  const gallery = document.querySelector("#dynamicGallery");

  if (!gallery) return;

  const cards = Array.from(
    gallery.querySelectorAll("[data-video-card]")
  );

  if (!cards.length) return;


  /*
   * -------------------------------------------------------
   * Get video orientation
   * -------------------------------------------------------
   */

  function getOrientation(video) {

    if (
      video.videoWidth &&
      video.videoHeight
    ) {

      return video.videoWidth > video.videoHeight
        ? "horizontal"
        : "vertical";

    }

    /*
     * Fallback based on the current known
     * portfolio videos.
     */

    const source =
      video.dataset.video ||
      "";

    const verticalNames = [
      "waver-v10",
      "growingfinal",
      "sequence02",
      "3-websites",
      "warren-buffett"
    ];

    const isVertical =
      verticalNames.some(name =>
        source.toLowerCase().includes(name)
      );

    return isVertical
      ? "vertical"
      : "horizontal";
  }


  /*
   * -------------------------------------------------------
   * Get aspect ratio
   * -------------------------------------------------------
   */

  function getRatio(card) {

    const video =
      card.querySelector("video");

    if (
      video &&
      video.videoWidth &&
      video.videoHeight
    ) {

      return (
        video.videoWidth /
        video.videoHeight
      );

    }

    return card.classList.contains("is-horizontal")
      ? 16 / 9
      : 9 / 16;
  }


  /*
   * -------------------------------------------------------
   * Identify orientation
   * -------------------------------------------------------
   */

  function identifyCards() {

    cards.forEach(card => {

      const video =
        card.querySelector("video");

      if (!video) return;

      const orientation =
        getOrientation(video);

      card.classList.remove(
        "is-horizontal",
        "is-vertical"
      );

      card.classList.add(
        orientation === "horizontal"
          ? "is-horizontal"
          : "is-vertical"
      );

    });

  }


  /*
   * -------------------------------------------------------
   * Build intelligent rows
   *
   * We use aspect ratios rather than fixed row types.
   *
   * V = approximately 0.56 width/height
   * H = approximately 1.77 width/height
   * -------------------------------------------------------
   */

  function buildRows() {

    identifyCards();

    const containerWidth =
      gallery.clientWidth;

    if (!containerWidth) return;


    /*
     * Mobile = one card per row
     */

    if (window.innerWidth < 768) {

      gallery.innerHTML = "";

      cards.forEach(card => {

        const row =
          document.createElement("div");

        row.className =
          "dynamic-gallery-row";

        row.appendChild(card);

        card.style.width = "100%";

        gallery.appendChild(row);

      });

      return;
    }


    /*
     * Desktop / tablet
     */

    const gap = window.innerWidth < 1100
      ? 14
      : 18;

    const targetHeight =
      window.innerWidth < 1100
        ? 300
        : 390;


    const rows = [];
    let currentRow = [];
    let currentRatio = 0;


    cards.forEach(card => {

      const ratio =
        getRatio(card);

      const newRatio =
        currentRatio + ratio;


      /*
       * Estimate row width at target height
       */

      const itemCount =
        currentRow.length + 1;

      const estimatedWidth =
        newRatio * targetHeight +
        gap * (itemCount - 1);


      /*
       * If adding another card makes the row
       * too wide, close the current row.
       */

      if (
        currentRow.length &&
        estimatedWidth > containerWidth
      ) {

        rows.push(currentRow);

        currentRow = [card];

        currentRatio = ratio;

      } else {

        currentRow.push(card);

        currentRatio = newRatio;

      }

    });


    if (currentRow.length) {

      rows.push(currentRow);

    }


    /*
     * Rebuild DOM
     */

    gallery.innerHTML = "";


    rows.forEach(
      (rowCards, rowIndex) => {

        const row =
          document.createElement("div");

        row.className =
          "dynamic-gallery-row";


        /*
         * Calculate the exact row height.
         */

        const ratioSum =
          rowCards.reduce(
            (sum, card) =>
              sum + getRatio(card),
            0
          );


        let rowHeight =
          (
            containerWidth -
            gap * (rowCards.length - 1)
          ) / ratioSum;


        /*
         * Avoid extremely huge final rows.
         */

        const isLastRow =
          rowIndex === rows.length - 1;


        if (
          isLastRow &&
          rowCards.length === 1
        ) {

          const card =
            rowCards[0];

          const ratio =
            getRatio(card);


          /*
           * Keep a single final card visually
           * balanced instead of stretching it
           * across the entire screen.
           */

          if (
            card.classList.contains(
              "is-horizontal"
            )
          ) {

            rowHeight =
              Math.min(
                rowHeight,
                420
              );

          } else {

            rowHeight =
              Math.min(
                rowHeight,
                520
              );

          }

        }


        rowCards.forEach(card => {

          const ratio =
            getRatio(card);

          const width =
            ratio * rowHeight;

          card.style.width =
            `${width}px`;

          row.appendChild(card);

        });


        gallery.appendChild(row);

      }
    );

  }


  /*
   * -------------------------------------------------------
   * Wait for video metadata
   * -------------------------------------------------------
   */

  cards.forEach(card => {

    const video =
      card.querySelector("video");

    if (!video) return;

    video.addEventListener(
      "loadedmetadata",
      () => {

        buildRows();

      },
      {
        once: true
      }
    );

  });


  /*
   * -------------------------------------------------------
   * Initial layout
   * -------------------------------------------------------
   */

  buildRows();


  /*
   * -------------------------------------------------------
   * Recalculate on resize
   * -------------------------------------------------------
   */

  let resizeTimer;

  window.addEventListener(
    "resize",
    () => {

      clearTimeout(resizeTimer);

      resizeTimer =
        setTimeout(
          buildRows,
          150
        );

    }
  );


})();
