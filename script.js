// ===============================
// Lógica del juego Piedra, Papel o Tijera
// ===============================

// Opciones posibles
const OPTIONS = ["piedra", "papel", "tijera"];

// Estado del juego
const state = {
  playerScore: 0,
  computerScore: 0,
  drawScore: 0,
  roundsPlayed: 0,
  maxRounds: 5, // mejor de 5
};

// ===============================
// Referencias a elementos del DOM
// ===============================

// Botones de jugada
const choiceButtons = document.querySelectorAll(".choice");

// Botones de reinicio
const resetRoundsBtn = document.getElementById("reset-rounds");
const resetAllBtn = document.getElementById("reset-all");

// Elementos de resultado actual
const playerChoiceEl = document.getElementById("player-choice");
const computerChoiceEl = document.getElementById("computer-choice");
const roundMessageEl = document.getElementById("round-message");

// Elementos de marcador
const playerScoreEl = document.getElementById("player-score");
const computerScoreEl = document.getElementById("computer-score");
const drawScoreEl = document.getElementById("draw-score");

// Estado de partida
const roundCounterEl = document.getElementById("round-counter");
const matchMessageEl = document.getElementById("match-message");

// Historial
const historyListEl = document.getElementById("history-list");

// ===============================
// Funciones auxiliares
// ===============================

/**
 * Devuelve una jugada aleatoria para la computadora.
 * @returns {"piedra" | "papel" | "tijera"}
 */
function getRandomChoice() {
  const index = Math.floor(Math.random() * OPTIONS.length);
  return OPTIONS[index];
}

/**
 * Determina el ganador de la ronda.
 * @param {string} playerChoice
 * @param {string} computerChoice
 * @returns {"win" | "lose" | "draw"}
 */
function getRoundResult(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) return "draw";

  const winConditions = {
    piedra: "tijera", // piedra gana a tijera
    papel: "piedra", // papel gana a piedra
    tijera: "papel", // tijera gana a papel
  };

  // Si la opción de la PC es la que pierde contra la del jugador ==> gana el jugador
  if (winConditions[playerChoice] === computerChoice) {
    return "win";
  }

  // En cualquier otro caso, gana la PC
  return "lose";
}

/**
 * Convierte el string de la jugada en un texto con emoji (para mostrar en pantalla).
 * @param {string} choice
 * @returns {string}
 */
function formatChoice(choice) {
  const map = {
    piedra: "🪨 Piedra",
    papel: "📄 Papel",
    tijera: "✂️ Tijera",
  };
  return map[choice] || "-";
}

/**
 * Actualiza los textos de marcador, contador de rondas y resultados.
 */
function renderState() {
  // Marcador
  playerScoreEl.textContent = state.playerScore;
  computerScoreEl.textContent = state.computerScore;
  drawScoreEl.textContent = state.drawScore;

  // Rondas
  roundCounterEl.textContent = `${state.roundsPlayed} / ${state.maxRounds}`;
}

/**
 * Limpia el mensaje de match (ganador de la partida) y sus estilos.
 */
function clearMatchMessage() {
  matchMessageEl.textContent = "";
  matchMessageEl.classList.remove(
    "match-message--win",
    "match-message--lose",
    "match-message--draw"
  );
}

/**
 * Muestra el resultado final de la partida (mejor de X rondas).
 */
function showMatchResultIfNeeded() {
  // Si todavía no se alcanzó el máximo de rondas, no mostramos nada
  if (state.roundsPlayed < state.maxRounds) return;

  let message = "";
  let cssClass = "";

  if (state.playerScore > state.computerScore) {
    message = "¡Ganaste la partida! 🏆";
    cssClass = "match-message--win";
  } else if (state.playerScore < state.computerScore) {
    message = "La computadora ganó la partida. 🤖";
    cssClass = "match-message--lose";
  } else {
    message = "La partida terminó en empate. 🤝";
    cssClass = "match-message--draw";
  }

  matchMessageEl.textContent = message;
  matchMessageEl.classList.add(cssClass);
}

/**
 * Agrega una entrada nueva al historial de jugadas.
 * @param {object} data
 * @param {number} data.round
 * @param {string} data.playerChoice
 * @param {string} data.computerChoice
 * @param {"win" | "lose" | "draw"} data.result
 */
function addHistoryItem({ round, playerChoice, computerChoice, result }) {
  const li = document.createElement("li");
  li.classList.add("history-item");

  // Texto "Ronda X"
  const roundSpan = document.createElement("span");
  roundSpan.classList.add("history-item__round");
  roundSpan.textContent = `Ronda ${round}`;

  // Texto con jugadas
  const choicesSpan = document.createElement("span");
  choicesSpan.textContent = `${formatChoice(playerChoice)} vs ${formatChoice(
    computerChoice
  )}`;

  // Resultado
  const resultSpan = document.createElement("span");
  let resultText = "";
  let resultClass = "history-item__result--draw";

  if (result === "win") {
    resultText = "Ganaste";
    resultClass = "history-item__result--win";
  } else if (result === "lose") {
    resultText = "Perdiste";
    resultClass = "history-item__result--lose";
  } else {
    resultText = "Empate";
  }

  resultSpan.textContent = resultText;
  resultSpan.classList.add(resultClass);

  li.appendChild(roundSpan);
  li.appendChild(choicesSpan);
  li.appendChild(resultSpan);

  // Insertamos al principio para ver la última primero
  historyListEl.insertBefore(li, historyListEl.firstChild);
}

/**
 * Deshabilita o habilita los botones de jugada.
 * Esto se usa para que, al terminar la partida, no se pueda seguir jugando
 * hasta reiniciar el marcador.
 * @param {boolean} disabled
 */
function setChoicesDisabled(disabled) {
  choiceButtons.forEach((btn) => {
    btn.disabled = disabled;
    btn.style.opacity = disabled ? "0.4" : "1";
    btn.style.cursor = disabled ? "not-allowed" : "pointer";
  });
}

// ===============================
// Manejadores de eventos
// ===============================

/**
 * Maneja el click del jugador en una opción (piedra/papel/tijera).
 * @param {MouseEvent} event
 */
function handlePlayerChoice(event) {
  const button = event.currentTarget;
  const playerChoice = button.dataset.choice;

  // Si ya se alcanzó el máximo de rondas, no dejamos seguir jugando
  if (state.roundsPlayed >= state.maxRounds) {
    roundMessageEl.textContent =
      "La partida ya terminó. Reiniciá el marcador para volver a jugar.";
    return;
  }

  const computerChoice = getRandomChoice();
  const result = getRoundResult(playerChoice, computerChoice);

  // Actualizamos el estado según el resultado de la ronda
  if (result === "win") {
    state.playerScore++;
    roundMessageEl.textContent = "¡Ganaste esta ronda! 🎉";
  } else if (result === "lose") {
    state.computerScore++;
    roundMessageEl.textContent = "Perdiste esta ronda. 😅";
  } else {
    state.drawScore++;
    roundMessageEl.textContent = "Empate. 🤝";
  }

  // Actualizamos jugadas mostradas
  playerChoiceEl.textContent = formatChoice(playerChoice);
  computerChoiceEl.textContent = formatChoice(computerChoice);

  // Sumamos una ronda jugada
  state.roundsPlayed++;

  // Refrescamos marcador y contador
  renderState();

  // Agregamos al historial
  addHistoryItem({
    round: state.roundsPlayed,
    playerChoice,
    computerChoice,
    result,
  });

  // Vemos si se terminó la partida (mejor de 5)
  clearMatchMessage();
  showMatchResultIfNeeded();

  // Si ya llegó al máximo de rondas, bloqueamos los botones
  if (state.roundsPlayed >= state.maxRounds) {
    setChoicesDisabled(true);
  }
}

/**
 * Reinicia SOLO el marcador de la partida actual (mejor de 5).
 * Mantiene el historial para que se vea lo que se jugó.
 */
function handleResetRounds() {
  state.playerScore = 0;
  state.computerScore = 0;
  state.drawScore = 0;
  state.roundsPlayed = 0;

  renderState();
  clearMatchMessage();
  roundMessageEl.textContent =
    "Marcador reiniciado. Empezá una nueva partida al mejor de 5.";
  playerChoiceEl.textContent = "-";
  computerChoiceEl.textContent = "-";

  // Volvemos a habilitar los botones de jugada
  setChoicesDisabled(false);
}

/**
 * Reinicio total: marcador + historial.
 */
function handleResetAll() {
  handleResetRounds(); // primero reiniciamos el marcador
  // Luego limpiamos historial
  historyListEl.innerHTML =
    "<li class=\"history-item\"><span>Historial limpio.</span><span></span><span></span></li>";
}

// ===============================
// Inicialización
// ===============================

function init() {
  // Asignamos eventos a los botones de jugada
  choiceButtons.forEach((btn) => {
    btn.addEventListener("click", handlePlayerChoice);
  });

  // Eventos de reinicio
  resetRoundsBtn.addEventListener("click", handleResetRounds);
  resetAllBtn.addEventListener("click", handleResetAll);

  // Estado inicial en UI
  renderState();
  clearMatchMessage();
}

// Iniciamos cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", init);
