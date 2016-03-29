from __future__ import unicode_literals

from django.db import models

import json

from django.contrib.auth.models import User
from mptt.models import MPTTModel, TreeForeignKey

# Create your models here.

class Graph(models.Model):
	name = models.CharFeild(max_length=200, unique=True)
	parent = TreeForeignKey('self', null=True, blank=True, related_name='children', db_index=True)
	user = models.ForeignKey(User)
	read = models.IntegerField(default=0)


class Story(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	graph = models.ForeignKey(Graph, on_delete=models.CASCADE)
	title = models.CharFeild(max_length=200)
	roomID = models.CharFeild(max_length=10000)
	read = models.IntegerField(default=0)
	is_complete = models.BooleanField(default=False)
	is_open = models.BooleanField(default=False)

class Contributors(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	story = models.ForeignKey(story, on_delete=models.CASCADE)

class Likes(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	story = models.ForeignKey(story, on_delete=models.CASCADE)

