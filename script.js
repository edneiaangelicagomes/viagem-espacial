class ViagemEspacialGame {
    constructor() {
        this.currentScreen = 'home';
        this.currentNarrative = 0;
        this.currentLevel = 1;
        this.currentQuestion = 0;
        this.score = 0;
        this.soundEnabled = true;
        this.timers = {};
        this.deferredPrompt = null;
        this.correctAnswers = 0;

        this.narratives = [
            { text: "Vocês são jovens cadetes da Academia Estelar, enviados para explorar o planeta Marte.", img: "viagem-espacial/viagem-espacial/assets///imagens/narrativa-1.jpg" },
            { text: "Durante a viagem, um campo magnético misterioso desvia a nave, deixando a tripulação presa em uma enorme nebulosa.", img: "viagem-espacial/viagem-espacial/assets///imagens/narrativa-2.jpg" },
            { text: "Agora vocês têm que encarar altos desafios para consertar a nave, escapar da nebulosa e continuar a missão.", img: "viagem-espacial/viagem-espacial/assets///imagens/narrativa-3.jpg" }
        ];

        this.level1Questions = [
            { panelNumber: 9, alternatives: ["4 + 5", "6 + 2", "5 + 3", "8 + 0"], correct: 0 },
            { panelNumber: 10, alternatives: ["4 + 5", "6 + 2", "5 + 3", "8 + 2"], correct: 3 },
            { panelNumber: 8, alternatives: ["4 + 5", "6 + 3", "5 + 3", "8 + 1"], correct: 2 },
            { panelNumber: 14, alternatives: ["6 + 5", "6 + 3", "7 + 7", "8 + 0"], correct: 2 },
            { panelNumber: 15, alternatives: ["9 + 5", "7 + 8", "8 + 8", "8 + 4"], correct: 1 }
        ];

        this.level2Questions = [
            {
                text: "Se o astronauta andar 3 casas para cima e 2 casas para a esquerda, ele vai ficar na mesma posição do(a):",
                grid: { astronauta: "E2", items: { "A1": "☀️", "C3": "⭐", "B4": "🌜", "D2": "☄️" } },
                alternatives: ["SOL", "LUA", "ASTEROIDE", "ESTRELA"],
                correct: 3
            },
            {
                text: "Qual é a localização da estrela Alfa?",
                grid: { star: "B5", items: {} },
                alternatives: ["A1", "D5", "B5", "C3"],
                correct: 2
            },
            {
                text: "Se o foguete avançar 4 casas para cima e 2 casas à direita, em que posição ele vai ficar?",
                grid: { rocket: "E5", items: {} },
                alternatives: ["A4", "D5", "B4", "A5"],
                correct: 3
            },
            {
                text: "Qual é a posição do astronauta?",
                grid: { astronauta: "A4", items: {} },
                alternatives: ["A4", "A3", "C4", "B1"],
                correct: 0
            },
            {
                text: "Se o astronauta avançar duas casas para baixo e três casas à esquerda, ele vai ficar em qual posição?",
                grid: { astronauta: "A4", items: {} },
                alternatives: ["A3", "D1", "C1", "B1"],
                correct: 2
            }
        ];

        this.level3Questions = [
            { text: "Qual das operações abaixo deixa o tanque 100% cheio?", alternatives: ["55 + 45", "55 + 55", "45 + 45", "60 + 45"], correct: 0 },
            { text: "Qual das operações abaixo deixa o tanque 100% cheio?", alternatives: ["45 + 50", "60 + 35", "25 + 75", "50 + 45"], correct: 2 },
            { text: "Qual das operações abaixo deixa o tanque 100% cheio?", alternatives: ["78 + 21", "77 + 34", "33 + 77", "65 + 35"], correct: 3 },
            { text: "Qual das operações abaixo deixa o tanque 100% cheio?", alternatives: ["98 + 1", "95 + 6", "84 + 26", "94 + 6"], correct: 3 },
            { text: "Qual das operações abaixo deixa o tanque 100% cheio?", alternatives: ["38 + 45", "54 + 26", "63 + 37", "92 + 7"], correct: 2 }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkPWAInstall();
        this.startBackgroundMusic();
    }

    setupEventListeners() {
        document.getElementById('soundToggle').addEventListener('click', () => this.toggleSound());
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('installBtn').addEventListener('click', () => this.installPWA());

        // Entrada de código com setas
        for (let i = 1; i <= 4; i++) {
            const input = document.getElementById(`digit${i}`);
            input.addEventListener('input', (e) => this.handleCodeInput(e, i));
            input.addEventListener('keydown', (e) => this.handleCodeKeydown(e, i));
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            document.getElementById('installBtn').classList.remove('hidden');
        });

        window.addEventListener('appinstalled', () => {
            this.deferredPrompt = null;
            document.getElementById('installBtn').classList.add('hidden');
        });
    }

    checkPWAInstall() {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            document.getElementById('installBtn').classList.add('hidden');
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const btn = document.getElementById('soundToggle');
        btn.classList.toggle('muted');
        btn.textContent = this.soundEnabled ? '🔊' : '🔇';
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Erro ao entrar em tela cheia: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    installPWA() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then(choiceResult => {
                if (choiceResult.outcome === 'accepted') {
                    this.deferredPrompt = null;
                }
            });
        }
    }

    playSound(filename) {
        if (!this.soundEnabled) return;
        const audio = new Audio(`viagem-espacial/viagem-espacial/assets///sons/${filename}`);
        audio.play().catch(err => console.log('Erro ao reproduzir som:', err));
    }

    startBackgroundMusic() {
        const music = new Audio('viagem-espacial/viagem-espacial/assets///sons/musica.mp3');
        music.loop = true;
        music.volume = 0.3;
        if (this.soundEnabled) {
            music.play().catch(err => console.log('Erro ao reproduzir música:', err));
        }
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
    }

    startNarrative() {
        this.currentNarrative = 0;
        this.showNarrativeScreen();
    }

    showNarrativeScreen() {
        if (this.currentNarrative < this.narratives.length) {
            const narrative = this.narratives[this.currentNarrative];
            document.getElementById('narrativeImage').src = narrative.img;
            document.getElementById('narrativeText').textContent = narrative.text;
            this.showScreen('narrativeScreen');
        } else {
            // Começar com o nível 1
            this.startLevel1();
        }
    }

    nextNarrative() {
        this.currentNarrative++;
        if (this.currentNarrative < this.narratives.length) {
            this.showNarrativeScreen();
        } else {
            this.startLevel1();
        }
    }

    // NÍVEL 1
    startLevel1() {
        this.currentLevel = 1;
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.showLevel1Question();
    }

    showLevel1Question() {
        const question = this.level1Questions[this.currentQuestion];
        document.getElementById('panelNumber1').textContent = question.panelNumber;
        document.getElementById('questionNumber1').textContent = `Questão ${this.currentQuestion + 1} de 5`;

        // Desenhar painel
        const panel = document.getElementById('panel1');
        const lights = panel.querySelectorAll('.light');
        lights.forEach((light, index) => {
            light.classList.remove('active');
            if (index < question.panelNumber) {
                light.classList.add('active');
            }
        });

        // Renderizar alternativas
        const alternatives = document.getElementById('alternatives1');
        alternatives.innerHTML = question.alternatives.map((alt, index) => 
            `<div class="alternative" onclick="game.selectLevel1Answer(${index})">${String.fromCharCode(65 + index)}) ${alt}</div>`
        ).join('');

        this.startTimer('timer1', 60);
        this.showScreen('level1Screen');
    }

    selectLevel1Answer(index) {
        const question = this.level1Questions[this.currentQuestion];
        if (index === question.correct) {
            this.playSound('acerto.mp3');
            this.correctAnswers++;
            this.showCorrectFeedback();
        } else {
            this.playSound('erro.mp3');
            this.showIncorrectFeedback();
        }
    }

    // NÍVEL 2
    startLevel2() {
        this.currentLevel = 2;
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.showLevel2Question();
    }

    showLevel2Question() {
        const question = this.level2Questions[this.currentQuestion];
        document.getElementById('questionNumber2').textContent = `Questão ${this.currentQuestion + 1} de 5`;

        // Desenhar grid
        this.drawGrid('grid2', question.grid);

        // Renderizar alternativas
        const alternatives = document.getElementById('alternatives2');
        alternatives.innerHTML = question.alternatives.map((alt, index) => 
            `<div class="alternative" onclick="game.selectLevel2Answer(${index})">${String.fromCharCode(65 + index)}) ${alt}</div>`
        ).join('');

        this.startTimer('timer2', 60);
        this.showScreen('level2Screen');
    }

    drawGrid(gridId, gridData) {
        const grid = document.getElementById(gridId);
        grid.innerHTML = '';

        for (let row = 1; row <= 5; row++) {
            for (let col = 1; col <= 5; col++) {
                const pos = String.fromCharCode(64 + col) + row;
                const cell = document.createElement('div');
                cell.className = 'grid-cell';

                // Mostrar item se existir
                if (gridData.items && gridData.items[pos]) {
                    cell.textContent = gridData.items[pos];
                } else if (gridData.astronauta === pos) {
                    cell.textContent = '🧑‍🚀';
                } else if (gridData.star === pos) {
                    cell.textContent = '⭐';
                } else if (gridData.rocket === pos) {
                    cell.textContent = '🚀';
                }

                grid.appendChild(cell);
            }
        }
    }

    selectLevel2Answer(index) {
        const question = this.level2Questions[this.currentQuestion];
        if (index === question.correct) {
            this.playSound('acerto.mp3');
            this.correctAnswers++;
            this.showCorrectFeedback();
        } else {
            this.playSound('erro.mp3');
            this.showIncorrectFeedback();
        }
    }

    // NÍVEL 3
    startLevel3() {
        this.currentLevel = 3;
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.updateFuelLevel();
        this.showLevel3Question();
    }

    showLevel3Question() {
        const question = this.level3Questions[this.currentQuestion];
        document.getElementById('questionNumber3').textContent = `Questão ${this.currentQuestion + 1} de 5`;

        // Renderizar alternativas
        const alternatives = document.getElementById('alternatives3');
        alternatives.innerHTML = question.alternatives.map((alt, index) => 
            `<div class="alternative" onclick="game.selectLevel3Answer(${index})">${String.fromCharCode(65 + index)}) ${alt}</div>`
        ).join('');

        this.startTimer('timer3', 60);
        this.showScreen('level3Screen');
    }

    selectLevel3Answer(index) {
        const question = this.level3Questions[this.currentQuestion];
        if (index === question.correct) {
            this.playSound('acerto.mp3');
            this.correctAnswers++;
            this.updateFuelLevel();
            this.showCorrectFeedback();
        } else {
            this.playSound('erro.mp3');
            this.showIncorrectFeedback();
        }
    }

    updateFuelLevel() {
        const percentage = this.correctAnswers * 20;
        const fuelLevel = document.getElementById('fuelLevel');
        fuelLevel.style.height = percentage + '%';
        fuelLevel.textContent = percentage + '%';
    }

    // Feedback
    showCorrectFeedback() {
        const result = document.getElementById('resultContent');
        result.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2 style="font-size: 2.5em; color: #4CAF50; margin-bottom: 20px;">✓ CORRETO!</h2>
                <p style="font-size: 1.3em; color: #ccc;">Parabéns! Você acertou!</p>
            </div>
        `;
        this.showScreen('resultScreen');
        setTimeout(() => this.nextQuestion(), 1500);
    }

    showIncorrectFeedback() {
        const result = document.getElementById('resultContent');
        result.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2 style="font-size: 2.5em; color: #f44336; margin-bottom: 20px;">✗ ERRO!</h2>
                <p style="font-size: 1.3em; color: #ccc;">Tente novamente!</p>
            </div>
        `;
        this.showScreen('resultScreen');
        setTimeout(() => this.nextQuestion(), 1500);
    }

    nextQuestion() {
        this.currentQuestion++;
        if (this.currentQuestion < 5) {
            if (this.currentLevel === 1) {
                this.showLevel1Question();
            } else if (this.currentLevel === 2) {
                this.showLevel2Question();
            } else if (this.currentLevel === 3) {
                this.showLevel3Question();
            }
        } else {
            this.showLevelResult();
        }
    }

    showLevelResult() {
        const success = this.correctAnswers >= 4;
        const result = document.getElementById('resultContent');

        if (this.currentLevel === 1) {
            const narrativa = success ? "narrativa-4" : "narrativa-4";
            const img = success ? "nivel1-vitoria.jpg" : "nivel1-derrota.jpg";
            const msg = success ? 
                "Vocês conseguiram! As luzes da nave voltaram a se acender!" :
                "Vocês fracassaram, é preciso escalar outra equipe para tentar fazer o trabalho.";
            const btnText = success ? "CONTINUAR" : "TENTAR NOVAMENTE";
            const action = success ? "startLevel2()" : "startLevel1()";

            result.innerHTML = `
                <div class="result-layout">
                    <div class="result-image">
                        <img src="viagem-espacial/viagem-espacial/assets///imagens/${img}" alt="Resultado">
                    </div>
                    <div class="result-text">
                        <h2>${msg}</h2>
                        <button class="btn btn-next" onclick="game.${action}">${btnText}</button>
                    </div>
                </div>
            `;
        } else if (this.currentLevel === 2) {
            const img = success ? "nivel2-vitoria.jpg" : "nivel2-derrota.jpg";
            const msg = success ? 
                "O mapa foi reconstruído, agora vocês já podem se orientar!" :
                "Vocês fracassaram, é preciso escalar outra equipe para tentar fazer o trabalho.";
            const btnText = success ? "CONTINUAR" : "TENTAR NOVAMENTE";
            const action = success ? "startLevel3()" : "startLevel2()";

            result.innerHTML = `
                <div class="result-layout">
                    <div class="result-image">
                        <img src="viagem-espacial/viagem-espacial/assets///imagens/${img}" alt="Resultado">
                    </div>
                    <div class="result-text">
                        <h2>${msg}</h2>
                        <button class="btn btn-next" onclick="game.${action}">${btnText}</button>
                    </div>
                </div>
            `;
        } else if (this.currentLevel === 3) {
            const img = success ? "nivel3-vitoria.jpg" : "nivel3-derrota.jpg";
            const msg = success ? 
                "Vocês conseguiram! O tanque está cheio e já podem avançar!" :
                "Vocês fracassaram, é preciso escalar outra equipe para tentar fazer o trabalho.";
            const btnText = success ? "IR PARA O DESAFIO FINAL" : "TENTAR NOVAMENTE";
            const action = success ? "startFinalChallenge()" : "startLevel3()";

            result.innerHTML = `
                <div class="result-layout">
                    <div class="result-image">
                        <img src="viagem-espacial/viagem-espacial/assets///imagens/${img}" alt="Resultado">
                    </div>
                    <div class="result-text">
                        <h2>${msg}</h2>
                        <button class="btn btn-next" onclick="game.${action}">${btnText}</button>
                    </div>
                </div>
            `;
        }

        this.playSound(success ? 'vitoria.mp3' : 'derrota.mp3');
        this.showScreen('resultScreen');
    }

    // Desafio Final
    startFinalChallenge() {
        this.showScreen('cluesScreen');
        this.startTimer('timerClues', 300); // 5 minutos
    }

    goToCodeInput() {
        this.clearTimer('timerClues');
        this.showScreen('codeInputScreen');
        document.getElementById('digit1').focus();
        this.startTimer('timerCode', 300); // 5 minutos
    }

    handleCodeInput(e, index) {
        const input = e.target;
        if (input.value && index < 4) {
            document.getElementById(`digit${index + 1}`).focus();
        } else if (!input.value && index > 1) {
            document.getElementById(`digit${index - 1}`).focus();
        }
    }

    handleCodeKeydown(e, index) {
        if (e.key === 'Backspace' && !e.target.value && index > 1) {
            document.getElementById(`digit${index - 1}`).focus();
        } else if (e.key === 'Enter') {
            this.submitCode();
        }
    }

    submitCode() {
        const code = 
            document.getElementById('digit1').value +
            document.getElementById('digit2').value +
            document.getElementById('digit3').value +
            document.getElementById('digit4').value;

        if (code.length !== 4) {
            alert('Por favor, insira todos os 4 dígitos!');
            return;
        }

        if (code === '8569') {
            this.playSound('vitoria.mp3');
            this.showFinalVictory();
        } else {
            this.playSound('erro.mp3');
            this.showFinalDefeat();
        }
    }

    showFinalVictory() {
        const result = document.getElementById('resultContent');
        result.innerHTML = `
            <div class="result-layout">
                <div class="result-image">
                    <img src="viagem-espacial/viagem-espacial/assets///imagens/vitoria-final.jpg" alt="Vitória Final">
                </div>
                <div class="result-text">
                    <h2>MISSÃO CUMPRIDA!</h2>
                    <p>Vocês conseguiram descobrir o código e escapar da nebulosa!</p>
                    <button class="btn btn-next" onclick="game.showCredits()">VER CRÉDITOS</button>
                </div>
            </div>
        `;
        this.clearTimer('timerCode');
        this.showScreen('resultScreen');
    }

    showFinalDefeat() {
        const result = document.getElementById('resultContent');
        result.innerHTML = `
            <div class="result-layout">
                <div class="result-image">
                    <img src="viagem-espacial/assets//imagens/derrota-final.jpg" alt="Derrota Final">
                </div>
                <div class="result-text">
                    <h2>PORTAL TRANCADO!</h2>
                    <p>O código está incorreto. Revise as pistas e tente novamente!</p>
                    <button class="btn btn-next" onclick="game.startFinalChallenge()">TENTAR NOVAMENTE</button>
                </div>
            </div>
        `;
        this.clearTimer('timerCode');
        this.showScreen('resultScreen');
    }

    showCredits() {
        this.showScreen('creditsScreen');
    }

    restart() {
        this.currentNarrative = 0;
        this.currentLevel = 1;
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.clearAllTimers();
        this.showScreen('homeScreen');
    }

    // Timer
    startTimer(elementId, seconds) {
        this.clearTimer(elementId);
        let remainingTime = seconds;
        const element = document.getElementById(elementId);

        const updateDisplay = () => {
            const mins = Math.floor(remainingTime / 60);
            const secs = remainingTime % 60;
            element.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

            if (remainingTime === 10) {
                this.playSound('tic-tac.mp3');
            }

            if (remainingTime === 0) {
                this.playSound('tempo-esgotado.mp3');
                this.handleTimeUp();
                clearInterval(this.timers[elementId]);
            } else {
                remainingTime--;
            }
        };

        updateDisplay();
        this.timers[elementId] = setInterval(updateDisplay, 1000);
    }

    clearTimer(elementId) {
        if (this.timers[elementId]) {
            clearInterval(this.timers[elementId]);
            delete this.timers[elementId];
        }
    }

    clearAllTimers() {
        Object.keys(this.timers).forEach(timerId => this.clearTimer(timerId));
    }

    handleTimeUp() {
        if (this.currentScreen === 'level1Screen' || 
            this.currentScreen === 'level2Screen' || 
            this.currentScreen === 'level3Screen') {
            // Tratamento de tempo esgotado durante questões
            this.nextQuestion();
        } else if (this.currentScreen === 'codeInputScreen') {
            this.showFinalDefeat();
        }
    }
}

// Inicializar o jogo quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
    window.game = new ViagemEspacialGame();
});