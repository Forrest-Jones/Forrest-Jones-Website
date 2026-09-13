/* Forrest Jones — site behaviour
   Plain ES2017. No build step, no dependencies. */

(function () {
	'use strict';

	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/* ---------- Mobile navigation ---------- */

	var toggle = document.getElementById('nav-toggle');
	var menu = document.getElementById('nav-menu');

	function setMenu(open) {
		if (!toggle || !menu) return;
		menu.classList.toggle('open', open);
		document.body.classList.toggle('nav-open', open);
		toggle.setAttribute('aria-expanded', String(open));
		toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
	}

	if (toggle && menu) {
		toggle.addEventListener('click', function () {
			setMenu(toggle.getAttribute('aria-expanded') !== 'true');
		});

		menu.addEventListener('click', function (event) {
			if (event.target.closest('a')) setMenu(false);
		});

		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape') setMenu(false);
		});

		window.addEventListener('resize', function () {
			if (window.innerWidth > 900) setMenu(false);
		});
	}

	/* ---------- Header state, scroll progress, back-to-top ---------- */

	var header = document.getElementById('header');
	var progress = document.getElementById('scroll-progress');
	var toTop = document.getElementById('to-top');
	var ticking = false;

	function onScroll() {
		var y = window.scrollY || document.documentElement.scrollTop;
		var max = document.documentElement.scrollHeight - window.innerHeight;

		if (header) header.classList.toggle('scrolled', y > 24);
		if (toTop) toTop.classList.toggle('visible', y > 600);
		if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

		ticking = false;
	}

	window.addEventListener('scroll', function () {
		if (!ticking) {
			window.requestAnimationFrame(onScroll);
			ticking = true;
		}
	}, { passive: true });
	onScroll();

	if (toTop) {
		toTop.addEventListener('click', function () {
			window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
		});
	}

	/* ---------- Reveal on scroll ----------
	   The effect is progressive enhancement only: CSS hides `.reveal` just under
	   `html.js`, so with JS off nothing is ever hidden. An IntersectionObserver
	   drives the animation, and a polling sweep backs it up — fast scrolling,
	   in-page jumps, find-in-page and throttled frames can all outrun the
	   observer, and content must never be left stuck at opacity 0. ---------- */

	var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
	var pending = revealables.length;

	function reveal(el) {
		if (el.classList.contains('in-view')) return;
		el.classList.add('in-view');
		pending--;
	}

	if (reduceMotion || !('IntersectionObserver' in window)) {
		revealables.forEach(reveal);
	} else {
		revealables.forEach(function (el, i) {
			el.style.transitionDelay = Math.min(i % 5, 4) * 60 + 'ms';
		});

		var revealObserver = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				reveal(entry.target);
				revealObserver.unobserve(entry.target);
			});
		}, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

		revealables.forEach(function (el) { revealObserver.observe(el); });

		// Backstop: reveal anything whose top has already passed the fold.
		var sweep = function () {
			var limit = window.innerHeight * 0.95;
			revealables.forEach(function (el) {
				if (el.classList.contains('in-view')) return;
				if (el.getBoundingClientRect().top < limit) {
					reveal(el);
					revealObserver.unobserve(el);
				}
			});
			if (pending <= 0) window.clearInterval(sweepTimer);
		};

		// Polling rather than rAF: continuous scrolling can starve animation frames,
		// which previously left passed-over sections invisible.
		var sweepTimer = window.setInterval(sweep, 200);
		window.addEventListener('scroll', sweep, { passive: true });
		window.addEventListener('resize', sweep);
		window.addEventListener('load', sweep);
		sweep();
	}

	/* ---------- Scroll spy ---------- */

	var navLinks = Array.prototype.slice.call(
		document.querySelectorAll('#nav-menu a[href^="#"]')
	);
	var sections = navLinks
		.map(function (link) { return document.querySelector(link.getAttribute('href')); })
		.filter(Boolean);

	if ('IntersectionObserver' in window && sections.length) {
		var spy = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				navLinks.forEach(function (link) {
					link.classList.toggle(
						'active',
						link.getAttribute('href') === '#' + entry.target.id
					);
				});
			});
		}, { rootMargin: '-45% 0px -50% 0px' });

		sections.forEach(function (section) { spy.observe(section); });
	}

	/* ---------- Lazy video (the hero-project clip is large) ---------- */

	var lazyVideos = document.querySelectorAll('video.lazy-video');

	function loadVideo(video) {
		if (video.dataset.loaded) return;
		video.dataset.loaded = '1';
		var source = document.createElement('source');
		source.src = video.dataset.src;
		source.type = 'video/mp4';
		video.appendChild(source);
		video.load();
		if (!reduceMotion) {
			var attempt = video.play();
			if (attempt && attempt.catch) attempt.catch(function () { /* autoplay blocked */ });
		}
	}

	if ('IntersectionObserver' in window) {
		var videoObserver = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				loadVideo(entry.target);
				videoObserver.unobserve(entry.target);
			});
		}, { rootMargin: '200px' });

		lazyVideos.forEach(function (video) { videoObserver.observe(video); });
	} else {
		lazyVideos.forEach(loadVideo);
	}

	/* ---------- Rotating role in the hero ---------- */

	var rotator = document.getElementById('role-rotator');
	var roles = [
		'Chief Financial Officer',
		'Head of Capital Formation',
		'Hedge Fund Manager, CHFP',
		'Director of Capital Markets',
		'AI-Driven Investor Relations'
	];

	if (rotator && !reduceMotion) {
		var roleIndex = 0;
		var charIndex = roles[0].length;
		var deleting = false;

		var tick = function () {
			var word = roles[roleIndex];
			charIndex += deleting ? -1 : 1;
			rotator.textContent = word.slice(0, charIndex);

			var delay = deleting ? 35 : 65;

			if (!deleting && charIndex === word.length) {
				deleting = true;
				delay = 2200;
			} else if (deleting && charIndex === 0) {
				deleting = false;
				roleIndex = (roleIndex + 1) % roles.length;
				delay = 320;
			}

			window.setTimeout(tick, delay);
		};

		window.setTimeout(tick, 2200);
	}

	/* ---------- Copy-to-clipboard ---------- */

	document.querySelectorAll('.copy-btn').forEach(function (button) {
		button.addEventListener('click', function () {
			var value = button.dataset.copy;
			var original = button.textContent;

			var done = function (ok) {
				button.textContent = ok ? 'Copied' : 'Press Ctrl+C';
				button.classList.toggle('copied', ok);
				window.setTimeout(function () {
					button.textContent = original;
					button.classList.remove('copied');
				}, 2000);
			};

			if (navigator.clipboard && window.isSecureContext) {
				navigator.clipboard.writeText(value).then(function () { done(true); },
					function () { done(false); });
			} else {
				var field = document.createElement('textarea');
				field.value = value;
				field.setAttribute('readonly', '');
				field.style.position = 'fixed';
				field.style.opacity = '0';
				document.body.appendChild(field);
				field.select();
				var ok = false;
				try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
				document.body.removeChild(field);
				done(ok);
			}
		});
	});

	/* ---------- Artwork stamp: flips to the original drawing ---------- */

	var stamp = document.getElementById('stamp');
	var caption = document.getElementById('stamp-caption');
	var zoom = document.getElementById('stamp-zoom');
	var lightbox = document.getElementById('lightbox');
	var lightboxClose = document.getElementById('lightbox-close');
	var lastFocus = null;

	if (stamp) {
		stamp.addEventListener('click', function () {
			var flipped = stamp.getAttribute('aria-pressed') !== 'true';
			stamp.setAttribute('aria-pressed', String(flipped));

			if (!reduceMotion) {
				stamp.classList.remove('flashing');
				// Reflow so the flash animation restarts on every flip.
				void stamp.offsetWidth;
				stamp.classList.add('flashing');
			}

			if (caption) {
				caption.innerHTML = flipped
					? 'Original drawing by Forrest Jones &middot; <span>tap to flip back</span>'
					: 'Unfollow the Dead &middot; <span>tap to reveal</span>';
			}
			if (zoom) zoom.hidden = !flipped;
		});

		stamp.addEventListener('animationend', function () {
			stamp.classList.remove('flashing');
		});
	}

	function openLightbox() {
		if (!lightbox) return;
		lastFocus = document.activeElement;
		lightbox.hidden = false;
		document.body.style.overflow = 'hidden';
		if (lightboxClose) lightboxClose.focus();
	}

	function closeLightbox() {
		if (!lightbox || lightbox.hidden) return;
		lightbox.hidden = true;
		document.body.style.overflow = '';
		if (lastFocus && lastFocus.focus) lastFocus.focus();
	}

	if (zoom) zoom.addEventListener('click', openLightbox);
	if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
	if (lightbox) {
		lightbox.addEventListener('click', function (event) {
			if (event.target === lightbox) closeLightbox();
		});
	}
	document.addEventListener('keydown', function (event) {
		if (event.key === 'Escape') closeLightbox();
	});

	/* ---------- Footer year ---------- */

	var year = document.getElementById('year');
	if (year) year.textContent = String(new Date().getFullYear());
})();
