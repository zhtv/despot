// scripts.js
// Функция для создания звездного рейтинга с учетом "без оценки"
function createStars(rating) {
    if (rating === 0) {
        return '-';  // Возвращаем "-" если оценка 0
    }
    
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += '★';
        } else {
            stars += '☆';
        }
    }
    return stars;
}

// Функция для получения отображаемого значения рейтинга
function getRatingDisplay(rating) {
    if (rating === 0) {
        return 'не участвовал';
    }
    return `${rating}/5`;
}

// Функция для сохранения переносов строк в тексте
function formatTextWithLineBreaks(text) {
    return text ? text.replace(/\n/g, '<br>') : '';
}

// Функции для работы с модальными окнами людей
function getStatusClass(status) {
    const statusClasses = {
        'Пропал': 'status-missing',
        'Розыск': 'status-wanted',
        'Найден': 'status-found',
        'Пойман': 'status-caught'
    };
    return statusClasses[status] || '';
}

function showPersonModal(personId) {
    fetch(`/get-person-data/${personId}/`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Ошибка загрузки данных');
                return;
            }
            
            console.log('Данные человека:', data); // Для отладки
            
            // Создаем HTML для модального окна
            let modalHTML = `
                <div class="modal-person-header">
                    <span class="modal-person-name font-2">${data.name}</span>
                </div>
                
                <div class="modal-person-content">
                    <div class="modal-person-left">
                        ${data.photo_url ? 
                            `<img src="${data.photo_url}" alt="${data.name}" class="modal-person-photo">` : 
                            '<div class="no-photo">Нет фото</div>'
                        }
                        <div class="modal-person-detail">
                            <span class="detail-label">Возраст:</span>
                            <span class="detail-value">${data.age}</span>
                        </div>
                        <div class="modal-person-detail">
                            <span class="detail-label">Город:</span>
                            <span class="detail-value">${data.city}</span>
                        </div>
                        <div class="modal-person-detail">
                            <span class="detail-label">Статус:</span>
                            <span class="detail-value">${data.status}</span>
                        </div>
                    </div>
                    
                    <div class="modal-person-details">
                        <div class="modal-person-comment">
                            <div class="detail-title">Одежда</div>
                            <div class="detail-value2">${data.clothing || 'не указана'}</div>
                        </div>
                        <div class="modal-person-comment">
                            <div class="detail-title">Приметы</div>
                            <div class="detail-value2">${data.features || 'нет информации'}</div>
                        </div>
                        <div class="modal-person-comment">
                            <div class="detail-title">Комментарий</div>
                            <div class="detail-value2">${formatTextWithLineBreaks(data.comment)}</div>
                        </div>
                    </div>
                </div>
            `;
            
            // Вставляем HTML в модальное окно
            const modalInfo = document.querySelector('.modal-person-info');
            modalInfo.innerHTML = modalHTML;
            
            // Показываем модальное окно
            const modal = document.getElementById('personModal');
            modal.style.display = 'flex';
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Ошибка загрузки данных');
        });
}

// Функция для отображения полной информации об отзыве
function showReviewModal(reviewElement) {
    // Получаем данные из data-атрибутов
    const name = reviewElement.dataset.name;
    const date = reviewElement.dataset.date;
    const overallRating = parseInt(reviewElement.dataset.overallRating);
    
    // ПРОСТО получаем прозвища героев
    const hero1Name = reviewElement.dataset.hero1Name;
    const hero1Rating = parseInt(reviewElement.dataset.hero1Rating);
    const hero2Name = reviewElement.dataset.hero2Name;
    const hero2Rating = parseInt(reviewElement.dataset.hero2Rating);
    const hero3Name = reviewElement.dataset.hero3Name;
    const hero3Rating = parseInt(reviewElement.dataset.hero3Rating);
    const hero4Name = reviewElement.dataset.hero4Name;
    const hero4Rating = parseInt(reviewElement.dataset.hero4Rating);
    const hero5Name = reviewElement.dataset.hero5Name;
    const hero5Rating = parseInt(reviewElement.dataset.hero5Rating);
    
    const text = reviewElement.dataset.text;
    const photoUrl = reviewElement.dataset.photoUrl;
    
    // Форматируем текст с сохранением переносов строк
    const formattedText = formatTextWithLineBreaks(text);
    
    // Создаем HTML для модального окна
    let modalHTML = `
        <div class="modal-review-header">
            <span class="modal-review-name font-2">${name}</span>
            <span class="modal-review-date mon">${date}</span>
        </div>
        
        <div class="modal-review-rating-section">
            <div class="modal-sides">
                <div class="modal-rating-item">
                    <span class="modal-rating-label">Общая оценка:</span>
                    <span class="modal-rating-stars font-175">${createStars(overallRating)} (${getRatingDisplay(overallRating)})</span>
                </div>
                <div class="modal-rating-item">
                    <span class="modal-rating-label">${hero1Name}:</span>
                    <span class="modal-rating-stars font-15">${createStars(hero1Rating)} (${getRatingDisplay(hero1Rating)})</span>
                </div>
                <div class="modal-rating-item">
                    <span class="modal-rating-label">${hero2Name}:</span>
                    <span class="modal-rating-stars font-15">${createStars(hero2Rating)} (${getRatingDisplay(hero2Rating)})</span>
                </div>
                <div class="modal-rating-item">
                    <span class="modal-rating-label">${hero3Name}:</span>
                    <span class="modal-rating-stars font-15">${createStars(hero3Rating)} (${getRatingDisplay(hero3Rating)})</span>
                </div>
                <div class="modal-rating-item">
                    <span class="modal-rating-label">${hero4Name}:</span>
                    <span class="modal-rating-stars font-15">${createStars(hero4Rating)} (${getRatingDisplay(hero4Rating)})</span>
                </div>
                <div class="modal-rating-item">
                    <span class="modal-rating-label">${hero5Name}:</span>
                    <span class="modal-rating-stars font-15">${createStars(hero5Rating)} (${getRatingDisplay(hero5Rating)})</span>
                </div>
    `;

    // Добавляем фото внутри modal-sides, если оно есть
    if (photoUrl && photoUrl.trim() !== '') {
        modalHTML += `
                <div class="modal-review-photo-container">
                    <img src="${photoUrl}" alt="Фото отзыва" class="modal-review-photo">
                </div>
        `;
    }

    // Завершаем HTML
    modalHTML += `
            </div>
            
            <div class="modal-review-text font-1 mon">
                ${formattedText}
            </div>
        </div>
    `;
    
    // Вставляем HTML в модальное окно
    const modalInfo = document.querySelector('.modal-review-info');
    modalInfo.innerHTML = modalHTML;
    
    // Показываем модальное окно
    const modal = document.getElementById('reviewModal');
    modal.style.display = 'flex';
}

// Функция для получения данных героя через AJAX
function getHeroData(heroId, callback) {
    fetch(`/get-hero-data/${heroId}/`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Ошибка:', data.error);
                return;
            }
            callback(data);
        })
        .catch(error => {
            console.error('Ошибка загрузки данных героя:', error);
        });
}

// Функция для отображения героя
function showHero(heroData) {
    // Скрываем сообщение и показываем карточку
    document.getElementById('noHeroSelected').style.display = 'none';
    const heroCard = document.getElementById('heroCard');
    heroCard.style.display = 'flex';

    // Заполняем данные героя
    document.getElementById('heroFirstName').textContent = heroData.first_name;
    document.getElementById('heroLastName').textContent = heroData.last_name;
    document.getElementById('heroAka').textContent = heroData.aka;
    document.getElementById('heroRace').textContent = heroData.race;
    document.getElementById('heroGender').textContent = heroData.gender;
    
    // Возраст (может быть null)
    if (heroData.age) {
        document.getElementById('heroAge').textContent = heroData.age;
    } else {
        document.getElementById('heroAge').textContent = 'не указан';
    }
    
    // Рост (может быть null)
    if (heroData.height) {
        document.getElementById('heroHeight').textContent = heroData.height + 'см';
    } else {
        document.getElementById('heroHeight').textContent = 'не указан';
    }
    
    // НОВОЕ ПОЛЕ: Суперспособность (может быть null)
    const superpowerElement = document.getElementById('heroSuperpower');
    if (superpowerElement) {
        if (heroData.superpower) {
            superpowerElement.textContent = heroData.superpower;
        } else {
            superpowerElement.textContent = 'не указана';
        }
    }
    
    document.getElementById('heroBirthPlace').textContent = heroData.birth_place;
    document.getElementById('heroPhone').textContent = heroData.phone;
    document.getElementById('heroBiography').innerHTML = heroData.biography ? 
        heroData.biography.replace(/\n/g, '<br>') : '';
    
    // НОВОЕ ПОЛЕ: Описание суперспособности (может быть null)
    const superpowerDescElement = document.getElementById('heroSuperpowerDescription');
    if (superpowerDescElement) {
        if (heroData.superpower_description) {
            superpowerDescElement.innerHTML = heroData.superpower_description.replace(/\n/g, '<br>');
        } else {
            superpowerDescElement.innerHTML = '[—]';
        }
    }
    
    // Обновляем текст для полей в зависимости от статуса
    const convictedElement = document.getElementById('heroConvicted');
    const convictedLabel = document.getElementById('convictedLabel');
    const biographyLabel = document.getElementById('biographyLabel');
    
    if (convictedElement) {
        if (heroData.convicted_for) {
            convictedElement.innerHTML = heroData.convicted_for.replace(/\n/g, '<br>');
        } else {
            if (heroData.status === 'dispatch' || heroData.status === 'staff_retired') {
                convictedElement.innerHTML = 'нет информации об активном умении';
            } else {
                convictedElement.innerHTML = 'нет информации';
            }
        }
    }
    
    // Меняем заголовки в зависимости от статуса
    if (heroData.status === 'dispatch' || heroData.status === 'staff_retired') {
        if (biographyLabel) biographyLabel.textContent = 'Пассивное умение:';
        if (convictedLabel) convictedLabel.textContent = 'Активное умение:';
    } else {
        if (biographyLabel) biographyLabel.textContent = 'Биография:';
        if (convictedLabel) convictedLabel.textContent = 'Нарушение:';
    }
    
    // Обновляем отображение статуса
    const statusElement = document.getElementById('heroStatus');
    if (statusElement) {
        let statusText = '';
        let statusClass = '';
        
        // Используем новый статус из heroData
        if (heroData.status === 'active') {
            statusText = 'действующий герой';
            statusClass = 'detail_value status-active';
        } else if (heroData.status === 'dispatch') {
            statusText = 'диспетчер';
            statusClass = 'detail_value status-dispatch';
        } else if (heroData.status === 'staff_retired') {
            statusText = 'персонал в отставке';
            statusClass = 'detail_value status-staff-retired';
        } else if (heroData.status === 'retired') {
            statusText = 'в отставке';
            statusClass = 'detail_value status-retired';
        } else {
            // Для обратной совместимости
            if (heroData.is_active) {
                statusText = 'действующий герой';
                statusClass = 'detail_value status-active';
            } else {
                statusText = 'в отставке';
                statusClass = 'detail_value status-retired';
            }
        }
        
        statusElement.textContent = statusText;
        statusElement.className = statusClass;
    }

    // Фото героя
    const photoContainer = document.getElementById('heroPhotoContainer');
    if (photoContainer) {
        photoContainer.innerHTML = '';
        if (heroData.photo_url) {
            const img = document.createElement('img');
            img.src = heroData.photo_url;
            img.alt = heroData.first_name + ' ' + heroData.last_name;
            img.className = 'hero_photo';
            photoContainer.appendChild(img);
        } else {
            const noPhoto = document.createElement('div');
            noPhoto.className = 'no_photo';
            noPhoto.textContent = 'Нет фото';
            photoContainer.appendChild(noPhoto);
        }
    }

    // Убираем выделение у всех и добавляем текущему
    document.querySelectorAll('.hero-select-item').forEach(item => {
        item.classList.remove('selected');
    });
    const selectedItem = document.querySelector(`[data-hero-id="${heroData.id}"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
    }
}

// Функция для автоматического открытия героя при загрузке страницы с параметром
function openHeroOnPageLoad() {
    // Проверяем, есть ли в URL параметр hero_id
    const urlParams = new URLSearchParams(window.location.search);
    const heroId = urlParams.get('hero_id');
    
    if (heroId && document.querySelector('.hero-select-item')) {
        // Загружаем данные героя и отображаем их
        getHeroData(heroId, showHero);
        
        // Прокручиваем к карточке героя
        setTimeout(() => {
            const heroCard = document.getElementById('heroCard');
            if (heroCard) {
                heroCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
}

// Инициализация для страницы героев
function initHeroesPage() {
    // Добавляем обработчики клика на элементы выбора героя
    document.querySelectorAll('.hero-select-item').forEach(item => {
        item.addEventListener('click', function() {
            const heroId = this.getAttribute('data-hero-id');
            getHeroData(heroId, showHero);
            
            // КОММЕНТИРУЕМ: обновление URL в истории браузера
            // Теперь при обновлении страницы выбранная вкладка сбросится
            // const url = new URL(window.location);
            // url.searchParams.set('hero_id', heroId);
            // window.history.pushState({}, '', url);
        });
    });
    
    // Автоматически открываем героя при загрузке страницы
    openHeroOnPageLoad();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('reviewModal');
    const closeBtn = document.querySelector('.modal-close');
    const reviewBlocks = document.querySelectorAll('.review_block');
    
    // Добавляем обработчики клика на каждый отзыв
    reviewBlocks.forEach(reviewBlock => {
        reviewBlock.addEventListener('click', function() {
            showReviewModal(this);
        });
    });
    
    // Закрытие модального окна по крестику
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Закрытие модального окна по клику вне его
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Закрытие модального окна по клавише Esc
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal) {
            modal.style.display = 'none';
        }
    });

    // Инициализируем страницу героев, если есть соответствующие элементы
    if (document.querySelector('.hero-select-item')) {
        initHeroesPage();
    }

    // Добавляем обработчики для карточек людей
    document.querySelectorAll('.person-card').forEach(card => {
        card.addEventListener('click', function() {
            const personId = this.getAttribute('data-person-id');
            console.log('Нажали на карточку, ID:', personId); // Для отладки
            showPersonModal(personId);
        });
    });
    
    // Закрытие модального окна для персон
    const personModal = document.getElementById('personModal');
    const personCloseBtn = personModal?.querySelector('.modal-close');
    
    if (personCloseBtn) {
        personCloseBtn.addEventListener('click', function() {
            personModal.style.display = 'none';
        });
    }
    
    if (personModal) {
        personModal.addEventListener('click', function(event) {
            if (event.target === personModal) {
                personModal.style.display = 'none';
            }
        });
    }
    
    // Закрытие по Esc
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (personModal && personModal.style.display === 'flex') {
                personModal.style.display = 'none';
            }
        }
    });
});