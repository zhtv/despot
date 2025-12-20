from django import forms
from .models import Review, Hero
from datetime import datetime
from django.utils import timezone

class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['name', 'created_at', 'overall_rating', 'hero1_rating', 'hero2_rating', 
                 'hero3_rating', 'hero4_rating', 'hero5_rating', 'text', 'photo']
        widgets = {
            'name': forms.TextInput(attrs={'placeholder': 'Введите ваше имя'}),
            'text': forms.Textarea(attrs={'rows': 4, 'placeholder': 'Введите текст отзыва'}),
            'created_at': forms.DateTimeInput(
                attrs={
                    'type': 'datetime-local',
                    'class': 'form-control'
                },
                format='%Y-%m-%dT%H:%M'
            ),
            'overall_rating': forms.RadioSelect(
                choices=[(i, str(i)) for i in range(1, 6)],
                attrs={'class': 'rating_radio'}
            ),
            'hero1_rating': forms.RadioSelect(
                choices=[(0, '-'), (1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')],
                attrs={'class': 'rating_radio'}
            ),
            'hero2_rating': forms.RadioSelect(
                choices=[(0, '-'), (1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')],
                attrs={'class': 'rating_radio'}
            ),
            'hero3_rating': forms.RadioSelect(
                choices=[(0, '-'), (1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')],
                attrs={'class': 'rating_radio'}
            ),
            'hero4_rating': forms.RadioSelect(
                choices=[(0, '-'), (1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')],
                attrs={'class': 'rating_radio'}
            ),
            'hero5_rating': forms.RadioSelect(
                choices=[(0, '-'), (1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')],
                attrs={'class': 'rating_radio'}
            ),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.instance.pk:
            self.fields['overall_rating'].initial = 1
            self.fields['hero1_rating'].initial = 0
            self.fields['hero2_rating'].initial = 0
            self.fields['hero3_rating'].initial = 0
            self.fields['hero4_rating'].initial = 0
            self.fields['hero5_rating'].initial = 0
            
            now = datetime.now()
            self.fields['created_at'].initial = now.strftime('%Y-%m-%dT%H:%M')
    
    def clean_created_at(self):
        created_at = self.cleaned_data.get('created_at')
        if not created_at:
            created_at = timezone.now()
        return created_at