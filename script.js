const choices = document.querySelectorAll('.choice');
const resultText = document.getElementById('resultText');
const restartButton = document.getElementById('restartButton');

choices.forEach(choice => {
    choice.addEventListener('click', () => {
        const userChoice = choice.dataset.choice;
        const computerChoice = getComputerChoice();
        const result = determineWinner(userChoice, computerChoice);
        displayResult(result, userChoice, computerChoice);
    });
});

function getComputerChoice() {
    const options = ['piedra', 'papel', 'tijera'];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}

function determineWinner(userChoice, computerChoice) {
    if (userChoice === computerChoice) {
        return 'empate';
    }
    if (
        (userChoice === 'piedra' && computerChoice === 'tijera') ||
        (userChoice === 'papel' && computerChoice === 'piedra') ||
        (userChoice === 'tijera' && computerChoice === 'papel')
    ) {
        return 'gana';
    }
    return 'pierde';
}

function displayResult(result, userChoice, computerChoice) {
    if (result === 'empate') {
        resultText.textContent = `Empate! Ambos eligieron ${userChoice}.`;
    } else if (result === 'gana') {
        resultText.textContent = `¡Ganaste! ${userChoice} vence a ${computerChoice}.`;
    } else {
        resultText.textContent = `¡Perdiste! ${computerChoice} vence a ${userChoice}.`;
    }
    restartButton.classList.remove('hidden');
}

restartButton.addEventListener('click', () => {
    resultText.textContent = '';
    restartButton.classList.add('hidden');
});
