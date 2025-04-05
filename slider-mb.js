// Define heading + scramble animation first (so it's available to the class)
const scrambleHeading = document.getElementById('scramble-heading');
const chars = "abcdefghijklmnopqrstuvwxyz";

function scrambleText(newText) {
	const totalDuration = 400;
	const fps = 60;
	const totalFrames = Math.round((totalDuration / 1000) * fps);

	const oldText = scrambleHeading.textContent;
	const length = Math.max(oldText.length, newText.length);
	let frame = 0;
	let queue = [];

	for (let i = 0; i < length; i++) {
		const from = oldText[i] || "";
		const to = newText[i] || "";

		if (to === " ") {
			queue.push({ from: " ", to: " ", start: 0, end: 0, char: " " });
		} else {
			const start = Math.floor(Math.random() * totalFrames * 0.6);
			const end = start + Math.floor(Math.random() * (totalFrames * 0.4));
			queue.push({ from, to, start, end, char: "" });
		}
	}

	function update() {
		let output = "";
		let complete = 0;

		for (let i = 0; i < queue.length; i++) {
			const { from, to, start, end, char } = queue[i];

			if (to === " ") {
				output += " ";
				complete++;
				continue;
			}

			if (frame >= end) {
				output += to;
				complete++;
			} else if (frame >= start) {
				if (!char || Math.random() < 0.28) {
					queue[i].char = chars[Math.floor(Math.random() * chars.length)];
				}
				output += queue[i].char;
			} else {
				output += from;
			}
		}

		scrambleHeading.textContent = output;

		if (complete < queue.length) {
			frame++;
			requestAnimationFrame(update);
		}
	}

	update();
}

// Slider class
class DepthMapEffect {
	constructor(container) {
		this.container = document.querySelector(container);

		this.imageSets = [
			{
				original: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756da336f08670cc24b5744_bg1.webp',
				character: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94a89e94d5f060ba272_character1.webp',
				graffiti: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94beb0ce3c356aebe83_graffiti1.webp',
			},
			{
				original: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756da343538ad9615a3e8e3_bg2.webp',
				character: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94b17bbe69f351bf5cb_character2.webp',
				graffiti: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94b7b7928efc8a1ab02_graffiti2.webp',
			},
			{
				original: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756da34bb5f1230758e3287_bg3.webp',
				character: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94bc0f6499a0bea1ca2_character3.webp',
				graffiti: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94b151d20d360320cd9_graffiti3.webp',
			},
			{
				original: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756da33f92ab0e6f329759d_bg4.webp',
				character: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94b5ed4549ca8f90ccd_character4.webp',
				graffiti: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/67edb7ced0ea720e18c421bd_GRAFFITI44%201.avif',
			},
			{
				original: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756da3325a2363cf420673d_bg5.webp',
				character: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94b0eda885a6e929f4f_character5.webp',
				graffiti: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/67eda8180b63cb2ac5e5267f_GRAFFITI-28xxo%20(1).avif',
			},
		];

		this.titles = [
			"Otango River",
			"Pokawa Mountain",
			"Volco Ring",
			"Crimson Dunes",
			"Sunsillo Beach"
		];

		this.currentIndex = 0;

		this.characterImg = document.querySelector('.character-img');
		this.graffitiImg = document.querySelector('.graffiti-img');

		if (window.innerWidth < 1024) {
			this.initMobileSlider();
		} else {
			this.init(); // Placeholder
		}
	}

	init() {
		// Empty on purpose for desktop (WebGL not used here)
	}

	initMobileSlider() {
		let bgLayer = document.querySelector('.background-layer');
		if (!bgLayer) {
			bgLayer = document.createElement('div');
			bgLayer.classList.add('background-layer');
			bgLayer.innerHTML = `<img src="${this.imageSets[0].original}" alt="Background" />`;
			document.body.appendChild(bgLayer);
		}
		bgLayer.style.display = 'block';
		bgLayer.querySelector('img').src = this.imageSets[0].original;

		this.setCharacter(0);
		this.setGraffiti(0);
		scrambleText(this.titles[0]);

		const buttons = document.querySelectorAll('.slider-controls button');
		const sliderActive = document.querySelector('.slider-active');

		const updateSliderActivePosition = (button) => {
			const buttonLeft = button.offsetLeft;
			const buttonTop = button.offsetTop;

			gsap.to(sliderActive, {
				duration: 0.5,
				x: buttonLeft,
				y: buttonTop,
				ease: "power2.out"
			});

			buttons.forEach(btn => btn.classList.remove('active'));
			button.classList.add('active');
		};

		updateSliderActivePosition(buttons[0]);

		buttons.forEach((button) => {
			button.addEventListener('click', () => {
				const index = parseInt(button.getAttribute('data-index'), 10);
				if (index === this.currentIndex) return;

				this.currentIndex = index;
				const set = this.imageSets[index];

				document.querySelector('.background-layer img').src = set.original;
				this.setCharacter(index);
				this.setGraffiti(index);
				scrambleText(this.titles[index]);
				updateSliderActivePosition(button);
			});
		});
	}

	setCharacter(index) {
		const character = this.imageSets[index].character;

		const glitchIn = () => {
			gsap.fromTo(this.characterImg, {
				opacity: 0,
				x: -20,
				skewX: 15,
				filter: 'contrast(200%) brightness(150%) hue-rotate(20deg)',
			}, {
				duration: 0.5,
				opacity: 1,
				x: 0,
				skewX: 0,
				filter: 'none',
				ease: 'expo.out'
			});
		};

		const tl = gsap.timeline({
			onComplete: () => {
				this.characterImg.src = character;
				glitchIn();
			}
		});

		tl.to(this.characterImg, { duration: 0.08, x: 10, scaleX: 1.05, opacity: 0.8, ease: 'none' })
			.to(this.characterImg, { duration: 0.06, x: -15, scaleX: 0.95, opacity: 0.5, ease: 'none' })
			.to(this.characterImg, { duration: 0.1, x: 5, scaleX: 1, opacity: 0.2, ease: 'none' });
	}

	setGraffiti(index) {
		const graffiti = this.imageSets[index].graffiti;

		const glitchIn = () => {
			gsap.fromTo(this.graffitiImg, {
				opacity: 0,
				x: -20,
				skewX: 15,
				filter: 'contrast(200%) brightness(150%) hue-rotate(20deg)',
			}, {
				duration: 0.5,
				opacity: 1,
				x: 0,
				skewX: 0,
				filter: 'none',
				ease: 'expo.out'
			});
		};

		const tl = gsap.timeline({
			onComplete: () => {
				this.graffitiImg.src = graffiti;
				glitchIn();
			}
		});

		tl.to(this.graffitiImg, { duration: 0.08, x: 10, scaleX: 1.05, opacity: 0.8, ease: 'none' })
			.to(this.graffitiImg, { duration: 0.06, x: -15, scaleX: 0.95, opacity: 0.5, ease: 'none' })
			.to(this.graffitiImg, { duration: 0.1, x: 5, scaleX: 1, opacity: 0.2, ease: 'none' });
	}
}

// Launch slider
new DepthMapEffect('#depthMapContainer');
