from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from django.core.urlresolvers import reverse
import json
import os

from django.db.models import Count

from .models import Graph, Story, Contributors, Likes

from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth.decorators import permission_required

# ##### logout #####

from django.contrib.auth import logout

# Create your views here.


# ##### GET methods #####

@login_required
def getInit(request):
	return

@login_required
def getStory(request, sid):
	pass

@login_required	
def getBranch(request, sid):
	pass

@login_required
def getContributors(request, sid):
	pass

@login_required
def getNumContributions(request, uid):
	pass

@login_required
def getUser(request, uid, cid):
	pass


# ##### POST methods #####

@csrf_exempt
def sign_up(request):
	user = User.objects.create_user(request.POST['userName'], '', request.POST['password'])
	user.first_name = request.POST['firstName']
	user.last_name = request.POST['lastName']
	user.email = request.POST['email']
	user.save()
	data = {}
	return HttpResponse(data, content_type = "application/json")

@login_required
@csrf_exempt
def addToStory(request, uid, sid):
	pass

@login_required
@csrf_exempt
def setOpen(request, uid, sid):
	pass

@login_required
@csrf_exempt
def setClosed(request, uid, sid):
	pass

@login_required
@csrf_exempt
def like(request, uid, sid):
	pass

@login_required
@csrf_exempt
def deleteBranch(request, uid, sid):
	pass

@login_required
@csrf_exempt
def deleteStroy(request, uid, sid):
	pass

@login_required
@csrf_exempt
def addSRead(request, uid, sid):
	pass

@login_required
@csrf_exempt
def addBread(request, uid, sid):
	pass

@login_required
@csrf_exempt
def createStroy(request, uid):
	pass



