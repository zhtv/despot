from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.urls import reverse
from django.db.models import Avg, Count, Q
from .models import Review, Hero, Person
from .forms import ReviewForm
from django.http import JsonResponse

def index(request):
    recent_reviews = Review.objects.all().order_by('-created_at')[:5]
    
    context = {
        'recent_reviews': recent_reviews,
    }
    
    return render(request, "main/index.html", context)

def index2(request):
    return render(request, "main/index2.html")

def adblock(request):
    return render(request, "main/adblock.html")

def auth(request):
    # Проверяем, есть ли ошибки в сессии
    error_username = request.session.pop('error_username', None)
    error_password = request.session.pop('error_password', None)
    
    if request.method == 'GET':
        return render(request, "main/auth.html", {
            'error_username': error_username,
            'error_password': error_password
        })
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        try:
            user_exists = User.objects.get(username=username)
        except User.DoesNotExist:
            user_exists = None
        
        if user_exists is None:
            request.session['error_username'] = '⚠️ такого логина не существует'
            return redirect(reverse('auth'))
        else:
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                login(request, user)
                return redirect('index')
            else:
                request.session['error_password'] = '⚠️ неверный пароль'
                return redirect(reverse('auth'))

def logout_view(request):
    logout(request)
    return redirect('index')

def reviews(request):
    all_reviews = Review.objects.all().order_by('-created_at')
    reviews_count = all_reviews.count()
    avg_overall_rating = all_reviews.aggregate(avg=Avg('overall_rating'))['avg'] or 0
    
    # Получаем действующих героев по позициям
    active_heroes = Hero.objects.filter(status='active').order_by('position')
    
    hero_stats_list = []
    
    for hero in active_heroes:
        hero1_reviews = Review.objects.filter(hero1=hero, hero1_rating__gt=0)
        hero2_reviews = Review.objects.filter(hero2=hero, hero2_rating__gt=0)
        hero3_reviews = Review.objects.filter(hero3=hero, hero3_rating__gt=0)
        hero4_reviews = Review.objects.filter(hero4=hero, hero4_rating__gt=0)
        hero5_reviews = Review.objects.filter(hero5=hero, hero5_rating__gt=0)
        
        ratings = []
        ratings.extend([r.hero1_rating for r in hero1_reviews])
        ratings.extend([r.hero2_rating for r in hero2_reviews])
        ratings.extend([r.hero3_rating for r in hero3_reviews])
        ratings.extend([r.hero4_rating for r in hero4_reviews])
        ratings.extend([r.hero5_rating for r in hero5_reviews])
        
        if ratings:
            avg_rating = sum(ratings) / len(ratings)
            count = len(ratings)
        else:
            avg_rating = 0
            count = 0
            
        hero_stats_list.append({
            'position': hero.position,
            'hero': hero,
            'avg_rating': round(avg_rating, 1),
            'count': count
        })
    
    hero_stats_list.sort(key=lambda x: x['position'])
    
    hero_stats = []
    for i in range(1, 6):
        hero_stat = next((hs for hs in hero_stats_list if hs['position'] == i), None)
        if hero_stat:
            hero_stats.append(hero_stat)
        else:
            hero_stats.append({
                'position': i,
                'hero': None,
                'avg_rating': 0,
                'count': 0
            })
    
    context = {
        'reviews': all_reviews,
        'reviews_count': reviews_count,
        'avg_overall_rating': round(avg_overall_rating, 1),
        'hero_stats': hero_stats,
    }
    
    return render(request, "main/reviews.html", context)

@login_required
def new_review(request):
    # Получаем только действующих героев (не диспетчеров) для отображения в форме
    active_heroes = Hero.objects.filter(status='active').order_by('position')
    
    if request.method == 'POST':
        form = ReviewForm(request.POST, request.FILES)
        if form.is_valid():
            review = form.save(commit=False)
            review.author = request.user
            
            for i, hero in enumerate(active_heroes, 1):
                if i == 1:
                    review.hero1 = hero
                elif i == 2:
                    review.hero2 = hero
                elif i == 3:
                    review.hero3 = hero
                elif i == 4:
                    review.hero4 = hero
                elif i == 5:
                    review.hero5 = hero
            
            if 'photo' in request.FILES:
                review.photo = request.FILES['photo']
            
            review.save()
            return redirect('reviews')
    else:
        form = ReviewForm()
    
    context = {
        'form': form,
        'active_heroes': active_heroes,
    }
    
    return render(request, "main/new_review.html", context)

def heroes(request):
    # Получаем героев по категориям
    all_heroes = Hero.objects.all().order_by('last_name', 'first_name')
    active_heroes = Hero.objects.filter(status='active').order_by('position')
    dispatch_heroes = Hero.objects.filter(status='dispatch').order_by('last_name', 'first_name')
    
    # Объединяем оба типа отставки для отображения в одном разделе
    retired_heroes = Hero.objects.filter(
        status__in=['retired', 'staff_retired']
    ).order_by('last_name', 'first_name')
    
    # Разделяем для логики в шаблоне (если нужно)
    just_retired_heroes = Hero.objects.filter(status='retired').order_by('last_name', 'first_name')
    staff_retired_heroes = Hero.objects.filter(status='staff_retired').order_by('last_name', 'first_name')
    
    # Получаем ID героя из GET параметра
    hero_id = request.GET.get('hero_id')
    selected_hero = None
    
    if hero_id:
        try:
            selected_hero = Hero.objects.get(id=hero_id)
        except Hero.DoesNotExist:
            pass
    
    context = {
        'all_heroes': all_heroes,
        'active_heroes': active_heroes,
        'dispatch_heroes': dispatch_heroes,
        'retired_heroes': retired_heroes,  # Все отставленные вместе
        'just_retired_heroes': just_retired_heroes,  # Только герои в отставке
        'staff_retired_heroes': staff_retired_heroes,  # Персонал в отставке
        'selected_hero': selected_hero,
        'selected_hero_id': hero_id,
    }
    
    return render(request, "main/heroes.html", context)

def get_hero_data(request, hero_id):
    try:
        hero = Hero.objects.get(id=hero_id)
        data = {
            'id': hero.id,
            'first_name': hero.first_name,
            'last_name': hero.last_name,
            'aka': hero.aka,
            'race': hero.race,
            'gender': hero.get_gender_display(),
            'age': hero.age,
            'height': hero.height,
            'superpower': hero.superpower,  # НОВОЕ ПОЛЕ
            'birth_place': hero.birth_place,
            'phone': hero.phone,
            'biography': hero.biography,
            'superpower_description': hero.superpower_description,  # НОВОЕ ПОЛЕ
            'convicted_for': hero.convicted_for,
            'status': hero.status,  # Изменено с is_active на status
            'position': hero.position,
            'photo_url': hero.photo.url if hero.photo else '',
        }
        return JsonResponse(data)
    except Hero.DoesNotExist:
        return JsonResponse({'error': 'Герой не найден'}, status=404)


def search(request):
    # Получаем всех людей, сгруппированных по статусу
    persons_missing = Person.objects.filter(status='missing')
    persons_found = Person.objects.filter(status='found')
    persons_wanted = Person.objects.filter(status='wanted')
    persons_caught = Person.objects.filter(status='caught')
    
    context = {
        'persons_missing': persons_missing,
        'persons_found': persons_found,
        'persons_wanted': persons_wanted,
        'persons_caught': persons_caught,
    }
    
    return render(request, "main/search.html", context)

def get_person_data(request, person_id):
    try:
        person = Person.objects.get(id=person_id)
        data = {
            'id': person.id,
            'name': person.name,
            'age': person.age,
            'city': person.get_city_display(),
            'comment': person.comment,
            'features': person.features,
            'clothing': person.clothing,
            'status': person.get_status_display(),
            'photo_url': person.photo.url if person.photo else '',
            'created_at': person.created_at.strftime('%d.%m.%Y %H:%M'),
        }
        return JsonResponse(data)
    except Person.DoesNotExist:
        return JsonResponse({'error': 'Человек не найден'}, status=404)