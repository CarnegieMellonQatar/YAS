from django.contrib import admin

# Register your models here.

from django_mptt_admin.admin import DjangoMpttAdmin
from models import Country
from .models import Graph, Story, Contributors, Likes

class CountryAdmin(DjangoMpttAdmin):
    pass

admin.site.register(Country, CountryAdmin)
admin.site.register(Graph)
admin.site.register(Story)
admin.site.register(Contributors)
admin.site.register(Likes)