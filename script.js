// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;

let counter = 0;
let coinsPerClick = 1;
let doubleClickCost = 10;
let autoClickerCost = 50;
let autoCollectorCost = 100;

let energy = 6500;
const maxEnergy = 6500;
const energyCostPerClick = 10;
const energyRegenRate = 5; // Количество энергии, восстанавливаемой каждые 1000 мс

let autoClickerInterval = null;
let autoCollectorInterval = null;

// Функция для обновления отображения энергии
function updateEnergy() {
    document.getElementById('energy').style.width = (energy / maxEnergy) * 100 + '%';
    document.getElementById('energy-text').innerText = `${energy}/${maxEnergy}`;
}

// Функция для сохранения прогресса в localStorage
function saveProgress() {
    const progress = {
        counter,
        coinsPerClick,
        doubleClickCost,
        autoClickerCost,
        autoCollectorCost,
        energy
    };
    localStorage.setItem('gameProgress', JSON.stringify(progress));
}

// Функция для загрузки прогресса из localStorage
function loadProgress() {
    const savedProgress = localStorage.getItem('gameProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        counter = progress.counter;
        coinsPerClick = progress.coinsPerClick;
        doubleClickCost = progress.doubleClickCost;
        autoClickerCost = progress.autoClickerCost;
        autoCollectorCost = progress.autoCollectorCost;
        energy = progress.energy;
        document.getElementById('counter').innerText = counter;
        document.getElementById('doubleClickCost').innerText = doubleClickCost;
        document.getElementById('autoClickerCost').innerText = autoClickerCost;
        document.getElementById('autoCollectorCost').innerText = autoCollectorCost;
        updateEnergy();
    }
}

// Функция для увеличения счетчика монет
function incrementCounter() {
    if (energy >= energyCostPerClick) {
        counter += coinsPerClick;
        energy -= energyCostPerClick;
        document.getElementById('counter').innerText = counter;
        updateEnergy();
        saveProgress();
    } else {
        alert('Недостаточно энергии для клика!');
    }
}

// Функция для покупки улучшений
function buyUpgrade(type) {
    if (type === 'doubleClick' && counter >= doubleClickCost) {
        counter -= doubleClickCost;
        coinsPerClick *= 2;
        doubleClickCost *= 2;
        document.getElementById('doubleClickCost').innerText = doubleClickCost;
    } else if (type === 'autoClicker' && counter >= autoClickerCost) {
        counter -= autoClickerCost;
        autoClickerCost *= 2;
        document.getElementById('autoClickerCost').innerText = autoClickerCost;
        if (!autoClickerInterval) {
            autoClickerInterval = setInterval(() => {
                incrementCounter();
                saveProgress();
            }, 1000);
        }
    } else if (type === 'autoCollector' && counter >= autoCollectorCost) {
        counter -= autoCollectorCost;
        autoCollectorCost *= 2;
        document.getElementById('autoCollectorCost').innerText = autoCollectorCost;
        if (!autoCollectorInterval) {
            autoCollectorInterval = setInterval(() => {
                counter += 5; // Количество монет, добавляемых авто-сборщиком
                document.getElementById('counter').innerText = counter;
                saveProgress();
            }, 10000);
        }
    } else {
        alert('Недостаточно монет для улучшения!');
    }
    document.getElementById('counter').innerText = counter;
    saveProgress();
}

// Восстановление энергии с течением времени
setInterval(() => {
    if (energy < maxEnergy) {
        energy = Math.min(energy + energyRegenRate, maxEnergy);
        updateEnergy();
        saveProgress();
    }
}, 1000);

// Отправка данных в Telegram WebApp
function sendData() {
    tg.sendData(JSON.stringify({
        coins: counter,
        coinsPerClick: coinsPerClick,
        doubleClickCost: doubleClickCost,
        autoClickerCost: autoClickerCost,
        autoCollectorCost: autoCollectorCost
    }));
}

// Инициализация приложения
tg.ready();
loadProgress();
updateEnergy();
