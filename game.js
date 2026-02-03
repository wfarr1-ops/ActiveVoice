/**
 * ACTIVE VOICE ARENA - Main Game Engine
 * A retro arcade game teaching active voice in legal writing
 */

class ActiveVoiceGame {
    constructor() {
        // Canvas setup
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Game state
        this.state = 'start'; // start, playing, paused, levelup, gameover
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.streak = 0;
        this.maxStreak = 0;

        // Statistics
        this.totalAnswered = 0;
        this.correctAnswers = 0;
        this.activeCorrect = 0;
        this.passiveCorrect = 0;

        // Game objects
        this.currentSentence = null;
        this.sentences = [];
        this.usedSentences = new Set();
        this.particles = [];

        // Timing
        this.lastTime = 0;
        this.sentenceTimer = 0;
        this.sentenceInterval = 8000; // ms between sentences
        this.fallSpeed = 30; // pixels per second
        this.levelUpTimer = 0;

        // Audio
        this.audioContext = null;
        this.sounds = {};

        // DOM elements
        this.scoreEl = document.getElementById('score');
        this.livesEl = document.getElementById('lives');
        this.levelEl = document.getElementById('level');
        this.streakEl = document.getElementById('streak');
        this.feedbackPopup = document.getElementById('feedback-popup');
        this.feedbackText = document.getElementById('feedback-text');
        this.explanationPopup = document.getElementById('explanation-popup');
        this.explanationContent = document.getElementById('explanation-content');

        // Screens
        this.startScreen = document.getElementById('start-screen');
        this.levelScreen = document.getElementById('level-screen');
        this.gameoverScreen = document.getElementById('gameover-screen');
        this.pauseScreen = document.getElementById('pause-screen');

        // Initialize
        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Input handlers
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());

        // Initialize audio on first interaction
        document.addEventListener('click', () => this.initAudio(), { once: true });
        document.addEventListener('keydown', () => this.initAudio(), { once: true });

        // Prepare sentences by difficulty
        this.prepareSentences();

        // Start render loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    resizeCanvas() {
        const container = document.getElementById('game-area');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    prepareSentences() {
        // Organize sentences by difficulty
        this.sentencesByDifficulty = {
            1: SENTENCES.filter(s => s.difficulty === 1),
            2: SENTENCES.filter(s => s.difficulty === 2),
            3: SENTENCES.filter(s => s.difficulty === 3)
        };
    }

    getNextSentence() {
        // Determine which difficulties to use based on level
        let difficulties = [1];
        if (this.level >= 3) difficulties.push(2);
        if (this.level >= 5) difficulties.push(3);

        // Weight toward harder difficulties at higher levels
        let weights = difficulties.map((d, i) => Math.pow(2, i));
        let totalWeight = weights.reduce((a, b) => a + b, 0);

        // Pick a difficulty
        let rand = Math.random() * totalWeight;
        let cumulative = 0;
        let chosenDifficulty = difficulties[0];
        for (let i = 0; i < difficulties.length; i++) {
            cumulative += weights[i];
            if (rand <= cumulative) {
                chosenDifficulty = difficulties[i];
                break;
            }
        }

        // Get available sentences
        let available = this.sentencesByDifficulty[chosenDifficulty].filter(
            s => !this.usedSentences.has(s.text)
        );

        // If we've used all sentences at this difficulty, reset
        if (available.length === 0) {
            this.sentencesByDifficulty[chosenDifficulty].forEach(s => {
                this.usedSentences.delete(s.text);
            });
            available = this.sentencesByDifficulty[chosenDifficulty];
        }

        // Pick random sentence
        const sentence = available[Math.floor(Math.random() * available.length)];
        this.usedSentences.add(sentence.text);
        return sentence;
    }

    // ========================================
    // Audio System
    // ========================================

    initAudio() {
        if (this.audioContext) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
        } catch (e) {
            console.log('Web Audio not supported');
        }
    }

    createSounds() {
        // We'll create simple synthesized sounds
        this.sounds = {
            correct: () => this.playTone([523.25, 659.25, 783.99], 0.1, 'square'),
            wrong: () => this.playTone([200, 150], 0.2, 'sawtooth'),
            levelup: () => this.playTone([523.25, 659.25, 783.99, 1046.5], 0.15, 'square'),
            gameover: () => this.playTone([400, 350, 300, 250, 200], 0.2, 'sawtooth'),
            spawn: () => this.playTone([300], 0.05, 'sine')
        };
    }

    playTone(frequencies, duration, type) {
        if (!this.audioContext) return;

        frequencies.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = freq;
            oscillator.type = type;

            const startTime = this.audioContext.currentTime + (i * duration);
            gainNode.gain.setValueAtTime(0.1, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    }

    // ========================================
    // Game State Management
    // ========================================

    startGame() {
        this.state = 'playing';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.streak = 0;
        this.maxStreak = 0;
        this.totalAnswered = 0;
        this.correctAnswers = 0;
        this.activeCorrect = 0;
        this.passiveCorrect = 0;
        this.usedSentences.clear();
        this.currentSentence = null;
        this.sentenceTimer = 0;
        this.particles = [];

        this.updateUI();
        this.hideAllScreens();
        this.showLevelScreen();
    }

    restartGame() {
        this.startGame();
    }

    pauseGame() {
        if (this.state === 'playing') {
            this.state = 'paused';
            this.pauseScreen.classList.remove('hidden');
        } else if (this.state === 'paused') {
            this.state = 'playing';
            this.pauseScreen.classList.add('hidden');
        }
    }

    gameOver() {
        this.state = 'gameover';
        if (this.sounds.gameover) this.sounds.gameover();

        // Update final stats
        document.getElementById('final-score').textContent = this.score;
        const accuracy = this.totalAnswered > 0
            ? Math.round((this.correctAnswers / this.totalAnswered) * 100)
            : 0;
        document.getElementById('accuracy').textContent = accuracy;
        document.getElementById('active-correct').textContent = this.activeCorrect;
        document.getElementById('passive-correct').textContent = this.passiveCorrect;

        // Determine rank
        const rank = RANKS.find(r => accuracy >= r.threshold);
        const rankEl = document.getElementById('rank');
        rankEl.textContent = rank.title;
        rankEl.style.color = rank.color;

        this.gameoverScreen.classList.remove('hidden');
    }

    levelUp() {
        this.level++;
        this.state = 'levelup';

        // Increase difficulty
        this.fallSpeed += 5;
        this.sentenceInterval = Math.max(4000, this.sentenceInterval - 500);

        if (this.sounds.levelup) this.sounds.levelup();
        this.showLevelScreen();
    }

    showLevelScreen() {
        this.state = 'levelup';
        this.hideAllScreens();
        document.getElementById('level-display').textContent = this.level;

        // Show a random tip
        const tip = LEVEL_TIPS[Math.floor(Math.random() * LEVEL_TIPS.length)];
        document.getElementById('level-tip').textContent = tip;

        this.levelScreen.classList.remove('hidden');

        // Auto-continue after delay
        this.levelUpTimer = 3000;
    }

    hideAllScreens() {
        this.startScreen.classList.add('hidden');
        this.levelScreen.classList.add('hidden');
        this.gameoverScreen.classList.add('hidden');
        this.pauseScreen.classList.add('hidden');
    }

    // ========================================
    // Input Handling
    // ========================================

    handleKeydown(e) {
        const key = e.key.toLowerCase();

        // Start screen
        if (this.state === 'start' && (key === ' ' || key === 'enter')) {
            e.preventDefault();
            this.startGame();
            return;
        }

        // Game over screen
        if (this.state === 'gameover' && (key === ' ' || key === 'enter')) {
            e.preventDefault();
            this.restartGame();
            return;
        }

        // Pause
        if (key === 'escape' || (key === 'p' && !this.currentSentence)) {
            if (this.state === 'playing' || this.state === 'paused') {
                this.pauseGame();
                return;
            }
        }

        // Answer input
        if (this.state === 'playing' && this.currentSentence) {
            if (key === 'a') {
                this.submitAnswer('active');
            } else if (key === 'p') {
                this.submitAnswer('passive');
            }
        }
    }

    submitAnswer(answer) {
        if (!this.currentSentence) return;

        const correct = answer === this.currentSentence.voice;
        this.totalAnswered++;

        if (correct) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer();
        }

        this.showExplanation(correct);
        this.currentSentence = null;
    }

    handleCorrectAnswer() {
        this.correctAnswers++;
        this.streak++;
        if (this.streak > this.maxStreak) this.maxStreak = this.streak;

        // Track by type
        if (this.currentSentence.voice === 'active') {
            this.activeCorrect++;
        } else {
            this.passiveCorrect++;
        }

        // Calculate score with streak bonus
        let points = 100 * this.level;
        if (this.streak >= 3) points *= 1.5;
        if (this.streak >= 5) points *= 2;
        if (this.streak >= 10) points *= 3;
        this.score += Math.round(points);

        // Effects
        this.showFeedback('CORRECT!', true);
        this.createExplosion();
        if (this.sounds.correct) this.sounds.correct();

        // Level up every 5 correct answers
        if (this.correctAnswers % 5 === 0) {
            this.levelUp();
        }

        this.updateUI();
    }

    handleWrongAnswer() {
        this.streak = 0;
        this.lives--;

        // Effects
        this.showFeedback('WRONG!', false);
        this.shakeScreen();
        if (this.sounds.wrong) this.sounds.wrong();

        if (this.lives <= 0) {
            this.gameOver();
        }

        this.updateUI();
    }

    showFeedback(text, isCorrect) {
        this.feedbackText.textContent = text;
        this.feedbackPopup.classList.remove('hidden', 'correct', 'wrong');
        this.feedbackPopup.classList.add(isCorrect ? 'correct' : 'wrong');

        // Reset animation
        this.feedbackPopup.style.animation = 'none';
        this.feedbackPopup.offsetHeight; // Trigger reflow
        this.feedbackPopup.style.animation = null;

        setTimeout(() => {
            this.feedbackPopup.classList.add('hidden');
        }, 500);
    }

    showExplanation(wasCorrect) {
        const sentence = this.currentSentence;
        let html = '';

        if (wasCorrect) {
            html = `<strong>Correct!</strong> This sentence is <span class="${sentence.voice}-word">${sentence.voice.toUpperCase()}</span> voice.<br>`;
        } else {
            html = `<strong>Not quite!</strong> This sentence is <span class="${sentence.voice}-word">${sentence.voice.toUpperCase()}</span> voice.<br>`;
        }

        html += sentence.explanation;

        if (sentence.voice === 'passive' && sentence.improved) {
            html += `<br><br><span class="active-word">Better:</span> "${sentence.improved}"`;
        }

        this.explanationContent.innerHTML = html;
        this.explanationPopup.classList.remove('hidden');

        setTimeout(() => {
            this.explanationPopup.classList.add('hidden');
        }, 4000);
    }

    shakeScreen() {
        const container = document.getElementById('game-container');
        container.classList.add('shake');
        setTimeout(() => container.classList.remove('shake'), 300);
    }

    updateUI() {
        this.scoreEl.textContent = this.score;
        this.levelEl.textContent = this.level;
        this.streakEl.textContent = this.streak;

        // Update lives display
        let hearts = '';
        for (let i = 0; i < 3; i++) {
            hearts += i < this.lives ? '♥' : '♡';
        }
        this.livesEl.textContent = hearts;

        // Streak visual effect
        if (this.streak >= 3) {
            this.streakEl.classList.add('combo');
        } else {
            this.streakEl.classList.remove('combo');
        }
    }

    // ========================================
    // Particle System
    // ========================================

    createExplosion() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const speed = 100 + Math.random() * 100;
            this.particles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                color: this.getRandomNeonColor()
            });
        }
    }

    getRandomNeonColor() {
        const colors = ['#39ff14', '#ff1493', '#00d4ff', '#ffff00', '#bf00ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;
            p.life -= deltaTime * 2;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    drawParticles() {
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 10;
            this.ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
            this.ctx.restore();
        });
    }

    // ========================================
    // Main Game Loop
    // ========================================

    gameLoop(time) {
        const deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(deltaTime) {
        // Level up screen timer
        if (this.state === 'levelup') {
            this.levelUpTimer -= deltaTime * 1000;
            if (this.levelUpTimer <= 0) {
                this.state = 'playing';
                this.hideAllScreens();
            }
            return;
        }

        if (this.state !== 'playing') return;

        // Update particles
        this.updateParticles(deltaTime);

        // Spawn new sentence if needed
        if (!this.currentSentence) {
            this.sentenceTimer += deltaTime * 1000;
            if (this.sentenceTimer >= this.sentenceInterval) {
                this.spawnSentence();
                this.sentenceTimer = 0;
            }
        }

        // Update current sentence position
        if (this.currentSentence) {
            this.currentSentence.y += this.fallSpeed * deltaTime;

            // Check if sentence reached bottom (player missed it)
            if (this.currentSentence.y > this.canvas.height - 50) {
                this.missedSentence();
            }
        }
    }

    spawnSentence() {
        const sentence = this.getNextSentence();
        this.currentSentence = {
            ...sentence,
            x: this.canvas.width / 2,
            y: 50,
            opacity: 1
        };
        if (this.sounds.spawn) this.sounds.spawn();
    }

    missedSentence() {
        this.lives--;
        this.streak = 0;
        this.totalAnswered++;

        this.showFeedback('MISSED!', false);
        this.shakeScreen();
        if (this.sounds.wrong) this.sounds.wrong();

        this.currentSentence = null;

        if (this.lives <= 0) {
            this.gameOver();
        }

        this.updateUI();
    }

    // ========================================
    // Rendering
    // ========================================

    render() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw particles
        this.drawParticles();

        // Draw current sentence
        if (this.currentSentence && this.state === 'playing') {
            this.drawSentence(this.currentSentence);
        }

        // Draw danger zone indicator
        this.drawDangerZone();
    }

    drawSentence(sentence) {
        const ctx = this.ctx;
        const padding = 20;
        const maxWidth = this.canvas.width - 100;

        // Set font for measurement
        ctx.font = '14px "Press Start 2P", monospace';

        // Word wrap the sentence
        const words = sentence.text.split(' ');
        const lines = [];
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        if (currentLine) lines.push(currentLine);

        // Calculate box dimensions
        const lineHeight = 24;
        const boxWidth = Math.min(maxWidth + padding * 2, this.canvas.width - 40);
        const boxHeight = lines.length * lineHeight + padding * 2;
        const boxX = sentence.x - boxWidth / 2;
        const boxY = sentence.y;

        // Draw box background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.strokeStyle = this.getSentenceColor(sentence);
        ctx.lineWidth = 3;
        ctx.shadowColor = this.getSentenceColor(sentence);
        ctx.shadowBlur = 15;

        // Rounded rectangle
        this.roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 8);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Draw category badge
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText(sentence.category.toUpperCase(), sentence.x, boxY + 15);

        // Draw sentence text
        ctx.font = '12px "Press Start 2P", monospace';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';

        lines.forEach((line, i) => {
            ctx.fillText(line, sentence.x, boxY + padding + 20 + i * lineHeight);
        });

        // Draw difficulty indicator
        const stars = '★'.repeat(sentence.difficulty) + '☆'.repeat(3 - sentence.difficulty);
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffff00';
        ctx.fillText(stars, sentence.x, boxY + boxHeight - 10);

        // Draw input prompts
        this.drawInputPrompts(boxX, boxY + boxHeight + 20, boxWidth);
    }

    getSentenceColor(sentence) {
        // Color based on difficulty
        const colors = {
            1: '#39ff14', // Green - easy
            2: '#00d4ff', // Blue - medium
            3: '#ff1493'  // Pink - hard
        };
        return colors[sentence.difficulty] || '#39ff14';
    }

    drawInputPrompts(x, y, width) {
        const ctx = this.ctx;
        const centerX = x + width / 2;

        // Draw "A" button
        ctx.fillStyle = '#39ff14';
        ctx.strokeStyle = '#39ff14';
        ctx.lineWidth = 2;
        ctx.font = '10px "Press Start 2P", monospace';

        // Active button
        this.drawButton(centerX - 80, y, 'A', 'ACTIVE', '#39ff14');

        // Passive button
        this.drawButton(centerX + 80, y, 'P', 'PASSIVE', '#ff1493');
    }

    drawButton(x, y, key, label, color) {
        const ctx = this.ctx;

        // Key box
        ctx.strokeStyle = color;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.roundRect(x - 15, y - 10, 30, 25, 4);
        ctx.fill();
        ctx.stroke();

        // Key letter
        ctx.fillStyle = color;
        ctx.font = '12px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(key, x, y + 8);

        // Label
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillText(label, x, y + 30);
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    drawDangerZone() {
        const ctx = this.ctx;
        const y = this.canvas.height - 60;

        // Warning line
        ctx.strokeStyle = 'rgba(255, 20, 147, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(this.canvas.width, y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Warning text
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = 'rgba(255, 20, 147, 0.5)';
        ctx.textAlign = 'center';
        ctx.fillText('⚠ DANGER ZONE ⚠', this.canvas.width / 2, y + 20);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new ActiveVoiceGame();
});
