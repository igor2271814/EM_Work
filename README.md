Проверить игру можно <a href="https://igor2271814.github.io/EM_Work/">тут</a>
# Документация к коду игры

## Описание игры
Игра представляет собой текстовый рогалик, где игрок перемещается по полю, сражается с врагами, собирает зелья и улучшает свои характеристики. Поле генерируется случайным образом, включая комнаты и проходы. Игрок может атаковать врагов, подбирать зелья для восстановления здоровья и мечи для увеличения силы атаки.

## Основные функции

### `generateField()`
Генерирует игровое поле, заполняя его стенами (`W`), комнатами (`E`), коридорами, игроком (`P`), зельями (`HP`), мечами (`SW`) и врагами (`EN`).

### `renderField()`
Отрисовывает игровое поле на основе текущего состояния массива `field`. Каждая клетка поля представлена как `div` с соответствующим классом, в зависимости от содержимого клетки (стена, проход, игрок, зелье, меч, враг).

### `startGame()`
Запускает игру, вызывая генерацию поля и его отрисовку. Также запускает интервал для перемещения врагов и проверки атак на игрока.

## Вспомогательные функции

### `getRandom(min, max)`
Возвращает случайное целое число в диапазоне от `min` до `max`.

### `addRooms(field)`
Добавляет случайные комнаты на поле. Комнаты соединяются между собой коридорами.

### `connectRooms(field, room1, room2)`
Соединяет две комнаты коридором.

### `addCorridors(field)`
Добавляет горизонтальные и вертикальные коридоры на поле.

### `createMainPath(field)`
Создает основной путь от стартовой точки до конечной.

### `addPlayer(field)`
Размещает игрока на поле в случайной пустой клетке.

### `addObjects(field, type, count)`
Добавляет объекты (зелья, мечи) на поле в случайные пустые клетки.

### `placeEnemies(field, numEnemies)`
Размещает врагов на поле в случайных пустых клетках.

### `updateHealthBar()`
Обновляет полоску здоровья игрока на основе текущего здоровья.

### `healPlayer(amount)`
Восстанавливает здоровье игрока на указанное количество.

### `usePotion(potionX, potionY)`
Обрабатывает подбор зелья игроком, восстанавливая здоровье и удаляя зелье с поля.

### `removePotion(x, y)`
Удаляет зелье с поля.

### `attackEnemies()`
Обрабатывает атаку игрока по врагам, находящимся в соседних клетках.

### `enemyAttack()`
Обрабатывает атаку врагов по игроку, если они находятся рядом.

### `moveEnemies()`
Перемещает врагов на поле в случайном направлении.

### `addHealthBar(parentElement, currentHealth, maxHealth, isPlayer)`
Добавляет полоску здоровья к элементу (игроку или врагу).

### `handleMovement(event)`
Обрабатывает движение игрока по полю при нажатии клавиш WASD.

### `debugGameState()`
Выводит текущее состояние игры в консоль для отладки.

### `checkWin()`
Проверяет, победил ли игрок (все враги уничтожены), и предлагает перезапустить игру.

## Константы

- `FIELD_WIDTH` - ширина игрового поля.
- `FIELD_HEIGHT` - высота игрового поля.
- `TILE_SIZE` - размер клетки.
- `NUM_ENEMIES` - количество врагов.
- `START_POINT` - стартовая точка игрока.
- `END_POINT` - конечная точка игрока.
- `ENEMY` - идентификатор врага.

## Глобальные переменные

- `playerPosition` - текущая позиция игрока.
- `field` - двумерный массив, представляющий игровое поле.
- `gameMap` - карта игры.
- `enemies` - массив врагов.
- `playerStats` - статистика игрока (здоровье, сила атаки).

## Обработчики событий

- `keydown` - обрабатывает нажатие клавиш для движения игрока и атаки.
- `DOMContentLoaded` - запускает игру после загрузки DOM.
