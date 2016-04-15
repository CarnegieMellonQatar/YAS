from django.contrib import admin

# Register your models here.

from django_mptt_admin.admin import DjangoMpttAdmin
from mptt.admin import MPTTModelAdmin
from .models import Graph, Story, Contributors, Likes, Image

class GraphAdmin(DjangoMpttAdmin):
    tree_auto_open = 0
    list_display = ('name','read')
    ordering = ('name',)

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser

admin.site.register(Graph, GraphAdmin)
admin.site.register(Story)
admin.site.register(Contributors)
admin.site.register(Likes)
admin.site.register(Image)