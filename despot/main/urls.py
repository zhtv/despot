from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('index2/', views.index2, name='index2'),
    path('adblock/', views.adblock, name='adblock'),
    path('reviews/', views.reviews, name='reviews'),
    path('heroes/', views.heroes, name='heroes'),
    path('search/', views.search, name='search'),
    path('get-person-data/<int:person_id>/', views.get_person_data, name='get_person_data'),
    path('new-review/', views.new_review, name='new_review'),
    path('auth/', views.auth, name='auth'),
    path('logout/', views.logout_view, name='logout'),
    path('get-hero-data/<int:hero_id>/', views.get_hero_data, name='get_hero_data'),
]