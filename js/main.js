// 1. Функционал перемещения по карточка, веперд и назад
// 2. Проверка на ввод данных
// 3. Получение (сбор) данных с карточек
// 4. Записывать все введенные данные
// 5. Реализовать работу прогресс бара
// 6. Подсветка рамки для радио чекбоксов

const answers = {
    2: null,
    3: null,
    4: null,
    5: null,
};

// Движение вперед
const btnNext = document.querySelectorAll('[data-nav="next"]');

btnNext.forEach(function (button) {
    button.addEventListener('click', function () {
        let thisCard = this.closest('[data-card]');
        let thisCardNumber = parseInt(thisCard.dataset.card);

        if (thisCard.dataset.validate == 'novalidate') {
            navigate('next', thisCard);
            updateProgressBar('next', thisCardNumber);
        } else {
            // При движении вперед, сохраняем данные в объект

            saveAnswer(thisCardNumber, gatherCardDate(thisCardNumber));

            // isFilled(thisCardNumber); // true // false

            // Валидация на заполненность

            if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
                navigate('next', thisCard);
                updateProgressBar('next', thisCardNumber);
            } else {
                alert('Сделайте ответ, прежде чем переходить далее');
            }
        }
    });
});

// Движение назад
const btnPrev = document.querySelectorAll('[data-nav="prev"]');

btnPrev.forEach(function (button) {
    button.addEventListener('click', function () {
        let thisCard = this.closest('[data-card]');
        let thisCardNumber = parseInt(thisCard.dataset.card);

        navigate('prev', thisCard);
        updateProgressBar('prev', thisCardNumber);
    });
});

// Функция для навигации вперед и назад
function navigate(direction, thisCard) {
    let thisCardNumber = parseInt(thisCard.dataset.card);
    let nextCard;

    if (direction == 'next') {
        nextCard = thisCardNumber + 1;
    } else {
        nextCard = thisCardNumber - 1;
    }

    thisCard.classList.add('hidden');
    document.querySelector(`[data-card = "${nextCard}"]`).classList.remove('hidden');
}

// Функция сбора заполнения данных с карточки
function gatherCardDate(number) {
    let question;
    let result = [];

    // Находим карточку по номеру и data-фтрибуту

    let currenCard = document.querySelector(`[data-card = '${number}']`);

    // Находим главный вопрос карточки

    question = currenCard.querySelector('[data-question]').innerText;

    // Находим все заполненные значения из радио кнопок

    let radioValues = currenCard.querySelectorAll('[type="radio"]');
    radioValues.forEach(function (item) {
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value,
            });
        }
    });

    // 2. Находим все заполненные  значения из чекбоксов

    let checkBoxValues = currenCard.querySelectorAll('[type="checkbox"]');
    checkBoxValues.forEach(function (item) {
        console.dir(item);
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value,
            });
        }
    });

    // 3. Находим все значения из инпутов

    let inputValues = currenCard.querySelectorAll(`[type="text"], [type="email"], [type="number"]`);
    console.log(inputValues);
    inputValues.forEach(function (item) {
        let itemValue = item.value;
        if (itemValue.trim() != '') {
            result.push({
                name: item.name,
                value: item.value,
            });
        }
    });

    // Формируем объект в который записываем значения

    let data = {
        question: question,
        answer: result,
    };

    return data;
}

// Функция записи ответов в объект с ответами

function saveAnswer(number, data) {
    answers[number] = data;
}

// Функция проверки на заполненность
function isFilled(number) {
    if (answers[number].answer.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Функция проверки email

function validateEmail(email) {
    let pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email);
}

// Проверка на заполненность required чекбоксов и инпутов с email

function checkOnRequired(number) {
    let currenCard = document.querySelector(`[data-card="${number}"]`);

    let requiredFields = currenCard.querySelectorAll('[required]');

    let isValidArray = [];

    requiredFields.forEach(function (item) {
        console.dir(item.type);
        console.dir(item.value);

        if (item.type == 'checkbox' && item.checked == false) {
            isValidArray.push(false);
        } else if (item.type == 'email') {
            if (validateEmail(item.value)) {
                isValidArray.push(true);
            } else {
                isValidArray.push(false);
            }
        }
    });

    if (isValidArray.indexOf(false) == -1) {
        return true;
    } else {
        return false;
    }
}

// Подсвечиваем рамку у радиокнопок

document.querySelectorAll('.radio-group').forEach(function (item) {
    item.addEventListener('click', function (event) {
        // Проверяем где произошел клик, внутри тега label или нет
        let label = event.target.closest('label');
        if (label) {
            // Отменяем активный класс у всех тегов label
            label
                .closest('.radio-group')
                .querySelectorAll('label')
                .forEach(function (item) {
                    item.classList.remove('radio-block--active');
                });

            // Добавляем класс к label по которому был клик

            label.classList.add('radio-block--active');
        }
    });
});

// Подсвечиваем рамку у чекбоксов

document.querySelectorAll(`label.checkbox-block input[type = "checkbox"]`).forEach(function (item) {
    item.addEventListener('change', function () {
        // Если чекбокс проставлен то
        if (item.checked) {
            // Добавляем активный класс к тегу label в котором он лежит
            item.closest('label').classList.add('checkbox-block--active');
        } else {
            item.closest('label').classList.remove('checkbox-block--active');
        }
    });
});

// Отображение прогресс бара

function updateProgressBar(direction, cardNumber) {
    // Расчет всего кол-ва карточек // 10

    let cardsTotalNumber = document.querySelectorAll('[data-card]').length;
    // Текущая карточка
    // Проверка направления перемещения
    if (direction == 'next') {
        cardNumber = cardNumber + 1;
    } else if (direction == 'prev') {
        cardNumber = cardNumber - 1;
    }

    // Расчет процента прохождени

    let progress = ((cardNumber * 100) / cardsTotalNumber).toFixed();

    // Обновляем прогресс бар

    let progressBar = document.querySelector(`[data-card="${cardNumber}"]`).querySelector('.progress');

    if (progressBar) {
        // Обновить число прогресс бара
        progressBar.querySelector('.progress__label strong').innerText = `${progress}%`;

        // Обновить полоску прогресс бара
        progressBar.querySelector('.progress__line-bar').style = `width: ${progress}%`;
    }
}
