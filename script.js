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
