from django.contrib import admin
from .models import Review, Hero, Person

@admin.register(Hero)
class HeroAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'aka', 'race', 'is_active', 'position')
    list_filter = ('is_active', 'gender')
    search_fields = ('first_name', 'last_name', 'aka', 'race')
    list_editable = ('is_active', 'position')
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('first_name', 'last_name', 'aka', 'photo')
        }),
        ('Биографические данные', {
            'fields': ('race', 'gender', 'age', 'height', 'birth_place', 'phone')
        }),
        ('Дополнительная информация', {
            'fields': ('biography', 'convicted_for')
        }),
        ('Статус', {
            'fields': ('is_active', 'position')
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