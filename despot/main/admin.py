from django.contrib import admin
from .models import Review, Hero, Person

@admin.register(Hero)
class HeroAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'aka', 'race', 'status', 'position')
    list_filter = ('status', 'gender')  # Добавит фильтр по новому статусу
    search_fields = ('first_name', 'last_name', 'aka', 'race')
    list_editable = ('status', 'position')
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('first_name', 'last_name', 'aka', 'photo')
        }),
        ('Биографические данные', {
            'fields': ('race', 'gender', 'age', 'height', 'superpower', 'birth_place', 'phone')
        }),
        ('Дополнительная информация', {
            'fields': ('biography', 'superpower_description', 'convicted_for')
        }),
        ('Статус', {
            'fields': ('status', 'position'),
            'description': 'Позиция используется только для действующих героев. "Персонал в отставке" - бывшие диспетчеры и другой персонал.'
        }),
    )

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'overall_rating')
    list_filter = ('created_at', 'overall_rating')
    search_fields = ('name', 'text')
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'created_at')
        }),
        ('Оценки', {
            'fields': ('overall_rating', 
                      ('hero1', 'hero1_rating'),
                      ('hero2', 'hero2_rating'),
                      ('hero3', 'hero3_rating'),
                      ('hero4', 'hero4_rating'),
                      ('hero5', 'hero5_rating'))
        }),
        ('Содержание', {
            'fields': ('text', 'photo')
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not obj.author:
            obj.author = request.user
        super().save_model(request, obj, form, change)

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('name', 'age', 'city', 'status', 'created_at')
    list_filter = ('status', 'city')
    search_fields = ('name', 'comment', 'features')