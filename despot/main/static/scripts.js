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
    return text.replace(/\n/g, '<br>');
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
    
    document.getElementById('heroBirthPlace').textContent = heroData.birth_place;
    document.getElementById('heroPhone').textContent = heroData.phone;
    document.getElementById('heroBiography').innerHTML = heroData.biography.replace(/\n/g, '<br>');
    document.getElementById('heroConvicted').innerHTML = heroData.convicted_for ? 
        heroData.convicted_for.replace(/\n/g, '<br>') : 'нет информации';
    
    // Статус
    if (heroData.is_active) {
        document.getElementById('heroStatus').textContent = 'действующий герой';
        document.getElementById('heroStatus').className = 'status-active';
    } else {
        document.getElementById('heroStatus').textContent = 'в отставке';
        document.getElementById('heroStatus').className = 'status-retired';
    }

    // Фото героя
    const photoContainer = document.getElementById('heroPhotoContainer');
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
});