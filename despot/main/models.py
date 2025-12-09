from django.db import models
from django.contrib.auth.models import User

class Hero(models.Model):
    # Основная информация
    first_name = models.CharField(max_length=50, verbose_name="Имя")
    last_name = models.CharField(max_length=50, verbose_name="Фамилия")
    aka = models.CharField(max_length=100, verbose_name="Прозвище", blank=True)
    
    # Биографические данные
    race = models.CharField(max_length=100, verbose_name="Раса")  # ← Текстовое поле вместо choices
    
    GENDER_CHOICES = [
        ('male', 'мужской'),
        ('female', 'женский'),
        ('other', 'другое'),
    ]
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, verbose_name="Пол", default='male')
    
    age = models.IntegerField(verbose_name="Возраст", null=True, blank=True)
    height = models.IntegerField(verbose_name="Рост (см)", null=True, blank=True)
    birth_place = models.CharField(max_length=100, verbose_name="Место рождения")
    phone = models.CharField(max_length=20, verbose_name="Номер телефона")
    
    # Биография и статус
    biography = models.TextField(verbose_name="Биография")
    convicted_for = models.TextField(verbose_name="Осуждён за", blank=True)
    
    # Фотография
    photo = models.ImageField(upload_to='hero_photos/', blank=True, null=True, verbose_name="Фото")
    
    # Статус
    is_active = models.BooleanField(default=True, verbose_name="Действующий герой")
    position = models.IntegerField(verbose_name="Позиция в списке (1-5)", null=True, blank=True, unique=True, 
                                   help_text="Позиция от 1 до 5 для отображения в форме отзыва")
    
    # Дополнительные поля
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата добавления")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.aka})"
    
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    class Meta:
        verbose_name = "Герой"
        verbose_name_plural = "Герои"
        ordering = ['position']

class Review(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, verbose_name="Имя")
    
    created_at = models.DateTimeField(
        verbose_name="Дата и время",
        null=True,
        blank=True
    )
    
    overall_rating = models.IntegerField(
        choices=[(i, str(i)) for i in range(1, 6)], 
        verbose_name="Общая оценка",
        default=1
    )
    
    # Связываем с моделью Hero вместо числовых полей
    hero1 = models.ForeignKey(Hero, on_delete=models.SET_NULL, null=True, blank=True, 
                             related_name='hero1_reviews', verbose_name="Герой 1")
    hero1_rating = models.IntegerField(
        choices=[(0, '-'), (1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], 
        verbose_name="Оценка героя 1",
        default=0
    )
    
    hero2 = models.ForeignKey(Hero, on_delete=models.SET_NULL, null=True, blank=True,
                             related_name='hero2_reviews', verbose_name="Герой 2")
    hero2_rating = models.IntegerField(
        choices=[(0, '-'), (1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], 
        verbose_name="Оценка героя 2",
        default=0
    )
    
    hero3 = models.ForeignKey(Hero, on_delete=models.SET_NULL, null=True, blank=True,
                             related_name='hero3_reviews', verbose_name="Герой 3")
    hero3_rating = models.IntegerField(
        choices=[(0, '-'), (1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], 
        verbose_name="Оценка героя 3",
        default=0
    )
    
    hero4 = models.ForeignKey(Hero, on_delete=models.SET_NULL, null=True, blank=True,
                             related_name='hero4_reviews', verbose_name="Герой 4")
    hero4_rating = models.IntegerField(
        choices=[(0, '-'), (1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], 
        verbose_name="Оценка героя 4",
        default=0
    )
    
    hero5 = models.ForeignKey(Hero, on_delete=models.SET_NULL, null=True, blank=True,
                             related_name='hero5_reviews', verbose_name="Герой 5")
    hero5_rating = models.IntegerField(
        choices=[(0, '-'), (1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], 
        verbose_name="Оценка героя 5",
        default=0
    )
    
    text = models.TextField(verbose_name="Текст отзыва")
    photo = models.ImageField(upload_to='review_photos/', blank=True, null=True, verbose_name="Фото")
    
    def __str__(self):
        return f"Отзыв от {self.name} ({self.created_at})"

    class Meta:
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"

# models.py (добавить после класса Review)
class Person(models.Model):
    STATUS_CHOICES = [
        ('missing', 'Пропал'),
        ('wanted', 'Розыск'),
        ('found', 'Найден'),
        ('caught', 'Пойман'),
    ]
    
    CITY_CHOICES = [
        ('city1', 'Вуменсфилд'),
        ('city2', 'Девоур Сан'),
        ('city3', 'Джымиетта'),
        ('city4', 'Занисасаллэ'),
        ('city5', 'Ивклитор'),
        ('city6', 'Кант'),
        ('city7', 'Клеверленд'),
        ('city8', 'Ксения'),
        ('city9', 'Марина'),
        ('city10', 'Мидалтавн'),
        ('city11', 'Похфимар'),
        ('city12', 'Ротик'),
        ('city13', 'С. Перм'),
        ('city14', 'Садженск'),
        ('city15', 'Симпсоны'),
        ('city16', 'Синабоны'),
        ('city17', 'Сыендуски'),
        ('city18', 'Тимчиккотик'),
        ('city19', 'Толетоле'),
        ('city20', 'Томаш'),
        ('city21', 'Фараон'),
        ('city22', 'Финн'),
        ('city23', 'Янго'),
    ]
    
    # Основные поля
    photo = models.ImageField(upload_to='person_photos/', blank=True, null=True, verbose_name="Фото")
    name = models.CharField(max_length=100, verbose_name="Имя")
    age = models.IntegerField(verbose_name="Возраст")
    city = models.CharField(max_length=50, choices=CITY_CHOICES, verbose_name="Город")
    comment = models.TextField(verbose_name="Комментарий")
    features = models.TextField(verbose_name="Приметы", blank=True)
    clothing = models.TextField(verbose_name="Одежда", blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, verbose_name="Статус")
    
    # Дополнительные поля
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата добавления")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    
    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"
    
    class Meta:
        verbose_name = "Человек"
        verbose_name_plural = "Люди"
        ordering = ['-created_at']