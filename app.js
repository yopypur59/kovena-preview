/**
 * KOVENA — The Table of Four
 * Interactive Experience, Scroll Animations, Prompt Deck & Onboarding Flow
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Subtle Fade-In-Up Animations on Scroll
  const revealElements = document.querySelectorAll('.reveal-up');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // 3. Mobile Navigation Drawer
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuToggle && mobileNavDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', String(!isExpanded));
      mobileNavDrawer.classList.toggle('hidden');
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileNavDrawer.classList.add('hidden');
      });
    });
  }

  // 4. Interactive "The Table of Four" Illustration (Hero Section)
  const seatData = {
    1: {
      title: 'Kursi 01 — Latar Belakang Berbeda',
      desc: 'Empat individu yang belum pernah bertemu, duduk setara membawa cerita dan rasa ingin tahu yang tulus.',
      indicator: 'Kursi 01 Aktif',
      threads: ['1-2', '4-1', '1-3'],
    },
    2: {
      title: 'Kursi 02 — Perspektif Baru',
      desc: 'Bukan tentang siapa jabatanmu di luar sana, melainkan cerita hidup apa yang membentukmu hari ini.',
      indicator: 'Kursi 02 Aktif',
      threads: ['1-2', '2-3', '2-4'],
    },
    3: {
      title: 'Kursi 03 — Pendengar yang Antusias',
      desc: 'Tanpa layar ponsel di atas meja. Setiap cerita disimak secara utuh tanpa terburu-buru.',
      indicator: 'Kursi 03 Aktif',
      threads: ['2-3', '3-4', '1-3'],
    },
    4: {
      title: 'Kursi 04 — Kursimu Malam Ini',
      desc: 'Satu kursi yang kami siapkan untukmu—tempat kamu bisa hadir apa adanya dan merasa diterima.',
      indicator: 'Kursimu Menunggu',
      threads: ['3-4', '4-1', '2-4'],
    },
  };

  const seatNodes = document.querySelectorAll('.seat-node');
  const connectionThreads = document.querySelectorAll('.connection-thread');
  const seatCaptionTitle = document.getElementById('seat-caption-title');
  const seatCaptionDesc = document.getElementById('seat-caption-desc');
  const tableActiveIndicator = document.getElementById('table-active-indicator');
  const cycleSeatBtn = document.getElementById('cycle-seat-btn');

  let currentSeat = 1;
  let seatAutoTimer = null;

  function setActiveSeat(seatNumber) {
    currentSeat = Number(seatNumber);
    const info = seatData[currentSeat];
    if (!info) return;

    seatNodes.forEach((node) => {
      const nodeSeat = Number(node.getAttribute('data-seat'));
      node.classList.toggle('active', nodeSeat === currentSeat);
    });

    connectionThreads.forEach((thread) => {
      const connectId = thread.getAttribute('data-connect');
      thread.classList.toggle('highlighted', info.threads.includes(connectId));
    });

    if (seatCaptionTitle && seatCaptionDesc) {
      seatCaptionTitle.textContent = info.title;
      seatCaptionDesc.textContent = info.desc;
    }

    if (tableActiveIndicator) {
      tableActiveIndicator.textContent = info.indicator;
    }
  }

  function startSeatAutoCycle() {
    stopSeatAutoCycle();
    seatAutoTimer = setInterval(() => {
      const nextSeat = (currentSeat % 4) + 1;
      setActiveSeat(nextSeat);
    }, 5200);
  }

  function stopSeatAutoCycle() {
    if (seatAutoTimer) {
      clearInterval(seatAutoTimer);
      seatAutoTimer = null;
    }
  }

  seatNodes.forEach((node) => {
    const seatNum = Number(node.getAttribute('data-seat'));
    node.addEventListener('mouseenter', () => {
      stopSeatAutoCycle();
      setActiveSeat(seatNum);
    });
    node.addEventListener('click', () => {
      stopSeatAutoCycle();
      setActiveSeat(seatNum);
    });
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        stopSeatAutoCycle();
        setActiveSeat(seatNum);
      }
    });
  });

  if (cycleSeatBtn) {
    cycleSeatBtn.addEventListener('click', () => {
      stopSeatAutoCycle();
      const nextSeat = (currentSeat % 4) + 1;
      setActiveSeat(nextSeat);
    });
  }

  startSeatAutoCycle();

  // 5. Section 4: Interactive Preview — "Isi Kepala di Meja KOVENA"
  const promptCards = Array.from(document.querySelectorAll('.prompt-card'));
  const prevPromptBtn = document.getElementById('prev-prompt-btn');
  const nextPromptBtn = document.getElementById('next-prompt-btn');
  const promptCounter = document.getElementById('prompt-counter');
  const promptDots = Array.from(document.querySelectorAll('[data-prompt-dot]'));

  let activePromptIndex = 0;
  const totalPrompts = promptCards.length;

  function updatePromptDeck(newIndex) {
    activePromptIndex = (newIndex + totalPrompts) % totalPrompts;

    promptCards.forEach((card, idx) => {
      const relativePosition = (idx - activePromptIndex + totalPrompts) % totalPrompts;
      card.setAttribute('data-position', String(relativePosition));
    });

    if (promptCounter) {
      promptCounter.textContent = `0${activePromptIndex + 1} / 0${totalPrompts}`;
    }

    promptDots.forEach((dot, idx) => {
      if (idx === activePromptIndex) {
        dot.className = 'h-1.5 w-8 rounded-full bg-terracotta transition-all duration-300';
      } else {
        dot.className = 'h-1.5 w-3 rounded-full bg-borderwarm hover:bg-earthgray/50 transition-all duration-300';
      }
    });
  }

  promptCards.forEach((card) => {
    card.addEventListener('click', () => {
      updatePromptDeck(activePromptIndex + 1);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updatePromptDeck(activePromptIndex + 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        updatePromptDeck(activePromptIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        updatePromptDeck(activePromptIndex - 1);
      }
    });
  });

  if (nextPromptBtn) {
    nextPromptBtn.addEventListener('click', () => {
      updatePromptDeck(activePromptIndex + 1);
    });
  }

  if (prevPromptBtn) {
    prevPromptBtn.addEventListener('click', () => {
      updatePromptDeck(activePromptIndex - 1);
    });
  }

  promptDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIndex = Number(dot.getAttribute('data-prompt-dot'));
      updatePromptDeck(targetIndex);
    });
  });

  // 6. Section 7: Interactive Onboarding Modal ("Ambil Kursimu")
  const onboardingModal = document.getElementById('onboarding-modal');
  const openOnboardingBtns = document.querySelectorAll('[data-open-onboarding]');
  const closeOnboardingBtn = document.getElementById('close-onboarding-btn');
  const finishOnboardingBtn = document.getElementById('finish-onboarding-btn');
  const onboardingForm = document.getElementById('onboarding-form');

  const stepSlides = Array.from(document.querySelectorAll('.step-slide'));
  const modalStepIndicator = document.getElementById('modal-step-indicator');
  const modalProgressBar = document.getElementById('modal-progress-bar');

  const inputNickname = document.getElementById('input-nickname');
  const greetingNickname = document.getElementById('greeting-nickname');
  const longingOptions = Array.from(document.querySelectorAll('.longing-option'));
  const inputWhatsapp = document.getElementById('input-whatsapp');
  const inputCity = document.getElementById('input-city');
  const cityPills = Array.from(document.querySelectorAll('.city-pill'));

  const errorStep1 = document.getElementById('error-step-1');
  const errorStep2 = document.getElementById('error-step-2');
  const errorStep3 = document.getElementById('error-step-3');

  const nextToStep2Btn = document.getElementById('next-to-step-2');
  const backToStep1Btn = document.getElementById('back-to-step-1');
  const nextToStep3Btn = document.getElementById('next-to-step-3');
  const backToStep2Btn = document.getElementById('back-to-step-2');

  const confirmNickname = document.getElementById('confirm-nickname');
  const confirmCity = document.getElementById('confirm-city');
  const confirmLonging = document.getElementById('confirm-longing');
  const confirmWa = document.getElementById('confirm-wa');

  let currentModalStep = 1;

  function showModalStep(stepNum) {
    currentModalStep = stepNum;

    stepSlides.forEach((slide) => {
      const slideStep = Number(slide.getAttribute('data-step'));
      slide.classList.toggle('active', slideStep === stepNum);
    });

    if (stepNum <= 3) {
      if (modalStepIndicator) {
        modalStepIndicator.textContent = `Langkah 0${stepNum} / 03`;
      }
      if (modalProgressBar) {
        modalProgressBar.style.width = `${(stepNum / 3) * 100}%`;
      }
    } else {
      if (modalStepIndicator) {
        modalStepIndicator.textContent = 'Selesai';
      }
      if (modalProgressBar) {
        modalProgressBar.style.width = '100%';
      }
    }

    // Focus appropriate field for smooth Typeform experience
    setTimeout(() => {
      if (stepNum === 1 && inputNickname) {
        inputNickname.focus();
      } else if (stepNum === 3 && inputWhatsapp) {
        inputWhatsapp.focus();
      }
    }, 120);
  }

  function openOnboardingModal() {
    if (!onboardingModal) return;
    onboardingModal.classList.add('is-open');
    onboardingModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (currentModalStep === 4) {
      showModalStep(1);
    } else {
      showModalStep(currentModalStep);
    }
  }

  function closeOnboardingModal() {
    if (!onboardingModal) return;
    onboardingModal.classList.remove('is-open');
    onboardingModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openOnboardingBtns.forEach((btn) => {
    btn.addEventListener('click', openOnboardingModal);
  });

  if (closeOnboardingBtn) {
    closeOnboardingBtn.addEventListener('click', closeOnboardingModal);
  }

  if (finishOnboardingBtn) {
    finishOnboardingBtn.addEventListener('click', () => {
      closeOnboardingModal();
      setTimeout(() => {
        if (onboardingForm) onboardingForm.reset();
        longingOptions.forEach((opt) => opt.classList.remove('selected'));
        selectCityPill('Surabaya');
        showModalStep(1);
      }, 350);
    });
  }

  if (onboardingModal) {
    onboardingModal.addEventListener('click', (e) => {
      if (e.target === onboardingModal) {
        closeOnboardingModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && onboardingModal && onboardingModal.classList.contains('is-open')) {
      closeOnboardingModal();
    }
  });

  // Step 1 Validation & Navigation
  function validateStep1() {
    const val = inputNickname ? inputNickname.value.trim() : '';
    if (!val) {
      if (errorStep1) errorStep1.classList.remove('hidden');
      if (inputNickname) inputNickname.focus();
      return false;
    }
    if (errorStep1) errorStep1.classList.add('hidden');
    if (greetingNickname) greetingNickname.textContent = val;
    return true;
  }

  if (nextToStep2Btn) {
    nextToStep2Btn.addEventListener('click', () => {
      if (validateStep1()) {
        showModalStep(2);
      }
    });
  }

  if (inputNickname) {
    inputNickname.addEventListener('input', () => {
      if (errorStep1) errorStep1.classList.add('hidden');
    });
    inputNickname.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (validateStep1()) {
          showModalStep(2);
        }
      }
    });
  }

  // Step 2 Option Selection & Navigation
  function getSelectedLonging() {
    const checked = document.querySelector('input[name="longing"]:checked');
    return checked ? checked.value : '';
  }

  longingOptions.forEach((optionLabel) => {
    const radio = optionLabel.querySelector('input[type="radio"]');
    optionLabel.addEventListener('click', () => {
      longingOptions.forEach((opt) => opt.classList.remove('selected'));
      optionLabel.classList.add('selected');
      if (radio) radio.checked = true;
      if (errorStep2) errorStep2.classList.add('hidden');
    });
  });

  if (backToStep1Btn) {
    backToStep1Btn.addEventListener('click', () => showModalStep(1));
  }

  if (nextToStep3Btn) {
    nextToStep3Btn.addEventListener('click', () => {
      const selected = getSelectedLonging();
      if (!selected) {
        if (errorStep2) errorStep2.classList.remove('hidden');
        return;
      }
      if (errorStep2) errorStep2.classList.add('hidden');
      showModalStep(3);
    });
  }

  // Step 3 City Pill Selection & Form Submission
  function selectCityPill(cityValue) {
    cityPills.forEach((pill) => {
      const pillVal = pill.getAttribute('data-city-pill');
      const isMatch = pillVal === cityValue;
      if (isMatch) {
        pill.className =
          'city-pill active inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-terracotta text-alabaster border border-terracotta transition-all';
      } else {
        pill.className =
          'city-pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-stonewarm text-earthgray border border-borderwarm hover:border-espresso transition-all';
      }
    });

    if (inputCity) {
      if (cityValue === 'other') {
        inputCity.value = '';
        inputCity.focus();
      } else {
        inputCity.value = cityValue;
      }
    }
  }

  cityPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const cityVal = pill.getAttribute('data-city-pill');
      selectCityPill(cityVal);
      if (errorStep3) errorStep3.classList.add('hidden');
    });
  });

  if (inputCity) {
    inputCity.addEventListener('input', () => {
      const typed = inputCity.value.trim().toLowerCase();
      cityPills.forEach((pill) => {
        const pillVal = pill.getAttribute('data-city-pill');
        const isMatch =
          pillVal.toLowerCase() === typed ||
          (pillVal === 'other' &&
            typed.length > 0 &&
            !['surabaya', 'jakarta', 'bandung', 'yogyakarta'].includes(typed));

        if (isMatch) {
          pill.className =
            'city-pill active inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-terracotta text-alabaster border border-terracotta transition-all';
        } else {
          pill.className =
            'city-pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-stonewarm text-earthgray border border-borderwarm hover:border-espresso transition-all';
        }
      });
    });
  }

  if (backToStep2Btn) {
    backToStep2Btn.addEventListener('click', () => showModalStep(2));
  }

  if (onboardingForm) {
    onboardingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (currentModalStep === 1) {
        if (validateStep1()) showModalStep(2);
        return;
      }

      if (currentModalStep === 2) {
        if (getSelectedLonging()) {
          showModalStep(3);
        } else if (errorStep2) {
          errorStep2.classList.remove('hidden');
        }
        return;
      }

      const nickname = inputNickname ? inputNickname.value.trim() : 'Teman';
      const longing = getSelectedLonging() || 'Didengar tanpa dihakimi';
      const whatsapp = inputWhatsapp ? inputWhatsapp.value.trim() : '';
      const city = inputCity ? inputCity.value.trim() : '';

      if (!whatsapp || whatsapp.length < 7 || !city) {
        if (errorStep3) errorStep3.classList.remove('hidden');
        return;
      }

      if (errorStep3) errorStep3.classList.add('hidden');

      if (confirmNickname) confirmNickname.textContent = nickname;
      if (confirmCity) confirmCity.textContent = city;
      if (confirmLonging) confirmLonging.textContent = `“${longing}”`;
      if (confirmWa) confirmWa.textContent = `WA: ${whatsapp}`;

      showModalStep(4);
    });
  }
});

