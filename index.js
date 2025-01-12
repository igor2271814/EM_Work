// Константы
const FIELD_WIDTH = 40;
const FIELD_HEIGHT = 24;
const TILE_SIZE = 40;
const NUM_ENEMIES = 10; // Количество противников
const START_POINT = { x: 0, y: 0 }; // Левый верхний угол
const END_POINT = { x: FIELD_WIDTH - 1, y: FIELD_HEIGHT - 1 }; // Правый нижний угол

let playerPosition = { x: 0, y: 0 };
let field;
let gameMap = [];
const ENEMY = 'EN'; // Добавляем идентификатор для противника
let playerStats = {
    health: 100,
    maxHealth: 100,
    attackPower: 10,
};


// Вспомогательные функции
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Генерация комнат
function addRooms(field) {
    const roomCount = getRandom(5, 10);
    let previousRoom = null;

    for (let i = 0; i < roomCount; i++) {
        const roomWidth = getRandom(3, 8);
        const roomHeight = getRandom(3, 8);
        const roomX = getRandom(0, FIELD_WIDTH - roomWidth);
        const roomY = getRandom(0, FIELD_HEIGHT - roomHeight);

        const room = { x: roomX, y: roomY, width: roomWidth, height: roomHeight };

        // Соединяем комнаты
        if (previousRoom) {
            connectRooms(field, previousRoom, room);
        }
        previousRoom = room;

        for (let y = roomY; y < roomY + roomHeight; y++) {
            for (let x = roomX; x < roomX + roomWidth; x++) {
                field[y][x] = 'E';
            }
        }
    }
}

// Соединение комнат тоннелями
function connectRooms(field, room1, room2) {
    let x = room1.x + Math.floor(room1.width / 2);
    let y = room1.y + Math.floor(room1.height / 2);
    const targetX = room2.x + Math.floor(room2.width / 2);
    const targetY = room2.y + Math.floor(room2.height / 2);

    while (x !== targetX) {
        field[y][x] = 'E';
        x += x < targetX ? 1 : -1;
    }
    while (y !== targetY) {
        field[y][x] = 'E';
        y += y < targetY ? 1 : -1;
    }
}
function createMainPath(field) {
    let x = START_POINT.x;
    let y = START_POINT.y;

    // Двигаемся вправо до конца
    while (x < END_POINT.x) {
        field[y][x] = 'E'; // Проход
        x++;
    }

    // Двигаемся вниз до конца
    while (y < END_POINT.y) {
        field[y][x] = 'E'; // Проход
        y++;
    }

    // Убедимся, что конечная точка тоже проходима
    field[END_POINT.y][END_POINT.x] = 'E';
}
// Размещение игрока
function addPlayer(field) {
    while (true) {
        const x = getRandom(0, FIELD_WIDTH - 1);
        const y = getRandom(0, FIELD_HEIGHT - 1);
        if (field[y][x] === 'E') { // Проверяем, что клетка пустая
            field[y][x] = 'P';
            playerPosition = { x, y }; // Сохраняем позицию игрока
            
            break;
        }
    }
}
function updateHealthBar() {
    const healthBar = document.querySelector('.player-health-bar');
    healthBar.style.width = `${(playerStats.health / playerStats.maxHealth) * 100}%`;
}
function healPlayer(amount) {
    playerStats.health += amount;
    if (playerStats.health > playerStats.maxHealth) {
        playerStats.health = playerStats.maxHealth;
    }
    console.log(`Здоровье игрока восстановлено! Текущее здоровье: ${playerStats.health}`);
    updateHealthBar(); // Обновляем полоску здоровья
}
function usePotion(potionX, potionY) {
    console.log(`Игрок подобрал зелье на координатах: ${potionX}, ${potionY}`);
    healPlayer(20); // Восстанавливаем здоровье
    field[potionY][potionX] = 'E'; // Убираем зелье с карты
    renderField(); // Перерисовываем поле
    debugGameState(); // Выводим отладочную информацию
}


function removePotion(x, y) {
    field[y][x] = '.'; // Убираем зелье с игрового поля
    renderField(); // Перерисовываем поле
}

// Проверка соседних клеток
function attackEnemies() {
    const directions = [
        { dx: 0, dy: -1 }, // Вверх
        { dx: 0, dy: 1 },  // Вниз
        { dx: -1, dy: 0 }, // Влево
        { dx: 1, dy: 0 },  // Вправо
    ];

    directions.forEach(({ dx, dy }) => {
        const x = playerPosition.x + dx;
        const y = playerPosition.y + dy;

        if (x >= 0 && x < FIELD_WIDTH && y >= 0 && y < FIELD_HEIGHT) {
            if (field[y][x] === ENEMY) {
                const enemy = enemies.find((e) => e.x === x && e.y === y);
                if (enemy) {
                    enemy.health -= playerStats.attackPower; // Наносим урон врагу
                    console.log(`Враг получил ${playerStats.attackPower} урона! Осталось здоровья: ${enemy.health}`);

                    if (enemy.health <= 0) {
                        field[y][x] = 'E'; // Освобождаем клетку
                        const enemyIndex = enemies.findIndex((e) => e.x === x && e.y === y);
                        if (enemyIndex !== -1) {
                            enemies.splice(enemyIndex, 1); // Убираем врага
                        }
                        console.log('Враг убит!');
                    }
                }
            }
        }
    });

    renderField(); // Перерисовываем поле
}

// Обработка нажатия пробела
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        attackEnemies();
    }
});

// Добавление объектов
function addObjects(field, type, count) {
    let placed = 0;

    while (placed < count) {
        const x = getRandom(0, FIELD_WIDTH - 1);
        const y = getRandom(0, FIELD_HEIGHT - 1);

        if (field[y][x] === 'E') { // Добавляем только в пустые клетки
            field[y][x] = type;
            placed++;
            console.log(`Зелье добавлено на координаты: ${x}, ${y}`);
        }
    }
    
}


// Генерация поля
function generateField() {
    field = Array.from({ length: FIELD_HEIGHT }, () => Array(FIELD_WIDTH).fill('W')); // Заполняем поле стенами

    createMainPath(field); // Создаем основной проход
    addRooms(field); // Добавляем случайные комнаты
    addPlayer(field); // Размещаем игрока
    addObjects(field, 'SW', 2); // Добавляем мечи
    addObjects(field, 'HP', 10); // Добавляем зелья
    placeEnemies(field, NUM_ENEMIES); // Размещаем противников

    console.table(field); // Для отладки
}


// Отрисовка поля
function renderField() {
    const fieldDiv = document.querySelector('.field');
    fieldDiv.innerHTML = ''; // Очищаем старое поле

    field.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            const tileDiv = document.createElement('div');
            tileDiv.className = 'tile';

            if (tile === 'W') tileDiv.classList.add('tileW');
            else if (tile === 'E') tileDiv.classList.add('tileE');
            else if (tile === 'P') {
                tileDiv.classList.add('tileP');
                addHealthBar(tileDiv, playerStats.health, playerStats.maxHealth, true); // Зеленая полоска для игрока
            } else if (tile === 'SW') tileDiv.classList.add('tileSW');
            else if (tile === 'HP') tileDiv.classList.add('tileHP');
            else if (tile === 'EN') {
                tileDiv.classList.add('enemy');
                const enemy = enemies.find((e) => e.x === colIndex && e.y === rowIndex);
                if (enemy) {
                    addHealthBar(tileDiv, enemy.health, 30); // Красная полоска для врагов
                }
            }

            fieldDiv.appendChild(tileDiv);
        });
    });
}
//Создание противников
let enemies = []; // Глобальный массив для врагов

function placeEnemies(field, numEnemies) {
    for (let i = 0; i < numEnemies; i++) {
        let x, y;
        let attempts = 0;

        do {
            x = getRandom(0, FIELD_WIDTH - 1);
            y = getRandom(0, FIELD_HEIGHT - 1);
            attempts++;

            // Если после 100 попыток не нашли подходящую клетку, выходим
            if (attempts > 100) {
                console.error('Не удалось разместить врага!');
                return;
            }
        } while (field[y][x] !== 'E'); // Проверяем, что клетка пустая

        // Размещаем противника
        field[y][x] = 'EN'; // Обозначаем врага
        enemies.push({ x, y, health: 30 }); // Добавляем врага в глобальный массив
    }
    console.log('Противники успешно размещены:', enemies);
    
}

//ХП противника
function enemyAttack() {
    let damageTaken = 0;

    enemies.forEach((enemy) => {
        const distanceX = Math.abs(enemy.x - playerPosition.x);
        const distanceY = Math.abs(enemy.y - playerPosition.y);

        if (distanceX <= 1 && distanceY <= 1) {
            damageTaken += 10; // Каждый враг наносит 10 урона
        }
    });

    if (damageTaken > 0) {
        playerStats.health -= damageTaken;
        console.log(`Герой получил ${damageTaken} урона! Здоровье: ${playerStats.health}`);

        if (playerStats.health <= 0) {
            alert('Герой погиб! Игра окончена.');
            location.reload(); // Перезапуск игры
        }

        updateHealthBar(); // Обновляем полоску здоровья
    }
}


//Передвижение противника
function moveEnemies() {
    const directions = [
        { dx: 0, dy: -1 },
        { dx: 0, dy: 1 },
        { dx: -1, dy: 0 },
        { dx: 1, dy: 0 },
    ];

    enemies.forEach((enemy) => {
        const randomDirection = directions[getRandom(0, directions.length - 1)];
        const newX = enemy.x + randomDirection.dx;
        const newY = enemy.y + randomDirection.dy;

        if (
            newX >= 0 &&
            newX < FIELD_WIDTH &&
            newY >= 0 &&
            newY < FIELD_HEIGHT &&
            field[newY][newX] === 'E'
        ) {
            field[enemy.y][enemy.x] = 'E'; // Освобождаем старую клетку
            field[newY][newX] = 'EN'; // Новая позиция
            enemy.x = newX; // Обновляем координаты врага в массиве
            enemy.y = newY;
        }
    });

    renderField(); // Перерисовываем поле
}


function renderField() {
    const fieldDiv = document.querySelector('.field');
    fieldDiv.innerHTML = ''; // Очищаем старое поле

    field.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            const tileDiv = document.createElement('div');
            tileDiv.className = 'tile';

            if (tile === 'W') tileDiv.classList.add('tileW');
            else if (tile === 'E') tileDiv.classList.add('tileE');
            else if (tile === 'P') {
                tileDiv.classList.add('tileP');
                addHealthBar(tileDiv, playerStats.health, playerStats.maxHealth, true); // Зеленая полоска для игрока
            } else if (tile === 'SW') tileDiv.classList.add('tileSW');
            else if (tile === 'HP') tileDiv.classList.add('tileHP');
            else if (tile === 'EN') {
                tileDiv.classList.add('enemy');
                const enemy = enemies.find((e) => e.x === colIndex && e.y === rowIndex);
                if (enemy) {
                    addHealthBar(tileDiv, enemy.health, 30); // Красная полоска для врагов
                }
            }

            fieldDiv.appendChild(tileDiv);
        });
    });
}

// Функция для добавления полоски здоровья
function addHealthBar(parentElement, currentHealth, maxHealth, isPlayer = false) {
    const healthBarContainer = document.createElement('div');
    healthBarContainer.className = 'health-bar-container';

    const healthBar = document.createElement('div');
    healthBar.className = 'health-bar';
    healthBar.style.width = `${(currentHealth / maxHealth) * 100}%`;
    healthBar.style.backgroundColor = isPlayer ? 'green' : 'red'; // Зеленый для игрока, красный для врагов

    healthBarContainer.appendChild(healthBar);
    parentElement.appendChild(healthBarContainer);
}
// Обработчик передвижения героя
function handleMovement(event) {
    const key = event.key.toLowerCase(); // Получаем нажатую клавишу
    let newX = playerPosition.x;
    let newY = playerPosition.y;

    // Проверяем, какая клавиша нажата
    if (key === 'w') newY -= 1; // Вверх
    else if (key === 'a') newX -= 1; // Влево
    else if (key === 's') newY += 1; // Вниз
    else if (key === 'd') newX += 1; // Вправо

    // Проверяем, не выходит ли игрок за границы
    if (newX >= 0 && newX < FIELD_WIDTH && newY >= 0 && newY < FIELD_HEIGHT) {
        // Проверяем, можно ли встать на новую клетку
        if (field[newY][newX] === 'E' || field[newY][newX] === 'HP' || field[newY][newX] === 'SW') {
            // Обновляем массив поля
            field[playerPosition.y][playerPosition.x] = 'E'; // Старая позиция становится пустой
            playerPosition.x = newX;
            playerPosition.y = newY;

            // Проверка на подбор зелья или меча
            if (field[newY][newX] === 'HP') {
                usePotion(newX, newY); // Подбираем зелье
            } else if (field[newY][newX] === 'SW') {
                playerStats.attackPower += 10; // Увеличиваем силу атаки
                console.log('Сила удара увеличена! Текущая сила:', playerStats.attackPower);
                field[newY][newX] = 'E'; // Удаляем меч с карты
            }

            field[newY][newX] = 'P'; // Новая позиция для игрока
            renderField(); // Перерисовываем поле
        }
    }
}
function debugGameState() {
    console.log('Поле:');
    console.table(field);
    console.log('Здоровье врагов:');
    enemies.forEach((enemy, index) => {
        console.log(`Враг ${index + 1}: x=${enemy.x}, y=${enemy.y}, здоровье=${enemy.health}`);
    });
}

// Запуск игры
function startGame() {
    generateField();
    renderField();
    setInterval(() => {
        moveEnemies();
        
    updateHealthBar();
    enemyAttack(); // Проверяем, атакуют ли противники героя
}, 1000); // Обновление каждую секунду
}

document.addEventListener('DOMContentLoaded', startGame);
// Привязываем обработчик к событию нажатия клавиш
document.addEventListener('keydown', handleMovement);