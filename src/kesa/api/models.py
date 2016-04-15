from __future__ import unicode_literals

from django.db import models

import json
import mptt

from django.contrib.auth.models import User
from mptt.models import MPTTModel, TreeForeignKey

# Create your models here.

class Graph(MPTTModel):
	name = models.CharField(max_length=200, unique=True)
	data = models.TextField()
	parent = TreeForeignKey('self', null=True, blank=True, related_name='children', db_index=True)
	user = models.ForeignKey(User)
	read = models.IntegerField(default=0)

	class MPTTMeta:
		order_insertion_by = ['name']

# mptt.register(Graph)


class Story(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	graph = models.ForeignKey(Graph, on_delete=models.CASCADE, null=True, blank=True)
	title = models.CharField(max_length=200)
	read = models.IntegerField(default=0)
	is_complete = models.BooleanField(default=False)
	is_open = models.BooleanField(default=False)

class Contributors(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	story = models.ForeignKey(Story, on_delete=models.CASCADE)

class Likes(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	story = models.ForeignKey(Story, on_delete=models.CASCADE)

