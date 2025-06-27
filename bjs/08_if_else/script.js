// --- Переменные для хранения диапазона и состояния игры ---
let minValue = 0;
let maxValue = 100;
let answerNumber = 0;
let orderNumber = 1;
let gameRun = false;

const orderNumberField = document.getElementById('orderNumberField');
const answerField = document.getElementById('answerField');

// --- Массивы фраз для вопросов и победы ---
const questionPhrases = [
    'Да это легко! Ты загадал',
    'Наверное, это число',
    'Это твое число'
];
const winPhrases = [
    'Ура, я угадал!',
    'Победа, это было просто!',
    'Я знал, что это оно!'
];

// --- Функция для выбора случайной фразы ---
function getRandomPhrase(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// --- Функция для преобразования числа в текст (до 999, поддержка минус) ---
function numberToText(num) {
    const units = ['ноль','один','два','три','четыре','пять','шесть','семь','восемь','девять'];
    const teens = ['десять','одиннадцать','двенадцать','тринадцать','четырнадцать','пятнадцать','шестнадцать','семнадцать','восемнадцать','девятнадцать'];
    const tens = ['','десять','двадцать','тридцать','сорок','пятьдесят','шестьдесят','семьдесят','восемьдесят','девяносто'];
    const hundreds = ['','сто','двести','триста','четыреста','пятьсот','шестьсот','семьсот','восемьсот','девятьсот'];
    let result = '';
    if (num < 0) {
        result = 'минус ';
        num = Math.abs(num);
    }
    if (num === 0) return 'ноль';
    if (num > 999) return num.toString();
    if (num >= 100) {
        result += hundreds[Math.floor(num/100)] + ' ';
        num = num % 100;
    }
    if (num >= 20) {
        result += tens[Math.floor(num/10)] + ' ';
        num = num % 10;
    }
    if (num >= 10 && num <= 19) {
        result += teens[num-10] + ' ';
        num = 0;
    }
    if (num > 0 && num < 10) {
        result += units[num] + ' ';
    }
    return result.trim();
}

// --- Функция для вывода вопроса с числом (текст/цифра) ---
function getQuestionText(num) {
    let text = numberToText(num);
    if (text.length <= 20) {
        return `${getRandomPhrase(questionPhrases)} ${text}?`;
    } else {
        return `${getRandomPhrase(questionPhrases)} ${num}?`;
    }
}

// --- Функция для показа модального окна сообщения ---
function showMessageModal(message) {
    document.getElementById('messageModalBody').innerText = message;
    $('#messageModal').modal('show');
}

// --- Функция для старта игры с заданным диапазоном ---
function startGame(min, max) {
    minValue = min;
    maxValue = max;
    orderNumber = 1;
    gameRun = true;
    answerNumber  = Math.floor((minValue + maxValue) / 2);
    orderNumberField.innerText = orderNumber;
    answerField.innerText = getQuestionText(answerNumber);
}

// --- Обработка формы диапазона ---
document.getElementById('rangeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let min = parseInt(document.getElementById('minValueInput').value) || 0;
    let max = parseInt(document.getElementById('maxValueInput').value) || 100;
    // Ограничение диапазона
    min = min < -999 ? -999 : min > 999 ? 999 : min;
    max = max < -999 ? -999 : max > 999 ? 999 : max;
    if (min > max) {
        showMessageModal('Минимальное значение не может быть больше максимального!');
        return;
    }
    $('#rangeModal').modal('hide');
    startGame(min, max);
});

// --- Кнопка "Заново" ---
document.getElementById('btnRetry').addEventListener('click', function () {
    // Открываем модалку для ввода диапазона
    document.getElementById('minValueInput').value = 0;
    document.getElementById('maxValueInput').value = 100;
    $('#rangeModal').modal('show');
});

// --- Кнопка "Больше" ---
document.getElementById('btnOver').addEventListener('click', function () {
    if (gameRun){
        if (minValue === maxValue){
            showMessageModal('Вы загадали неправильное число!\n\u{1F914}');
            gameRun = false;
        } else {
            minValue = answerNumber  + 1;
            answerNumber  = Math.floor((minValue + maxValue) / 2);
            orderNumber++;
            orderNumberField.innerText = orderNumber;
            answerField.innerText = getQuestionText(answerNumber);
        }
    }
});

// --- Кнопка "Меньше" ---
document.getElementById('btnLess').addEventListener('click', function () {
    if (gameRun){
        if (minValue === maxValue){
            showMessageModal('Вы загадали неправильное число!\n\u{1F914}');
            gameRun = false;
        } else {
            maxValue = answerNumber  - 1;
            answerNumber  = Math.floor((minValue + maxValue) / 2);
            orderNumber++;
            orderNumberField.innerText = orderNumber;
            answerField.innerText = getQuestionText(answerNumber);
        }
    }
});

// --- Кнопка "Верно!" ---
document.getElementById('btnEqual').addEventListener('click', function () {
    if (gameRun){
        showMessageModal(`${getRandomPhrase(winPhrases)}\n\u{1F60E}`);
        gameRun = false;
    }
});

// --- Открываем модалку диапазона при старте ---
window.onload = function() {
    $('#rangeModal').modal({backdrop: 'static', keyboard: false});
    $('#rangeModal').modal('show');
};

