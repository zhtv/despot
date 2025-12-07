from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('reviews/', views.reviews, name='reviews'),
    path('index2/', views.index2, name='index2'),
    path('heroes/', views.heroes, name='heroes'),
    path('search/', views.search, name='search'),
    path('new-review/', views.new_review, name='new_review'),
    path('auth/', views.auth, name='auth'),
    path('logout/', views.logout_view, name='logout'),
    path('get-hero-data/<int:hero_id>/', views.get_hero_data, name='get_hero_data'),
]