from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from django.core.urlresolvers import reverse
import json
import os
from itertools import chain
from django.db.models import Count

from .models import Graph, Story, Contributors, Likes

from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth.decorators import permission_required

# ##### Helper Methods #####

# code taken from: http://stackoverflow.com/questions/12556268/fastest-way-to-create-json-to-reflect-a-tree-structure-in-python-django-using

def recursive_node_to_dict(node):
    result = {
        'id': node.pk,
        'name': node.name,
    }
    children = [recursive_node_to_dict(c) for c in node.get_children()]
    if children:
        result['children'] = children
    return result


# ##### logout #####

from django.contrib.auth import logout

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('api.views.index',))

# Create your views here.

def index(request):
    response = render(request,'api/index.html')
    return response

def profile(request):
    response = render(request,'api/profile.html')
    return response

def reading(request,id):
    response = render(request,'api/reading.html')
    return response

def writing(request,id):
    response = render(request,'api/writing.html')
    return response

def analytics(request):
    response = render(request,'api/analytics.html')
    return response

def signup(request):
	response = render(request,'api/signup.html')
	return response

# ##### GET methods #####

@login_required
def getInit(request):
	storiesComp = Story.objects.filter(is_complete=True).order_by('id')[:10]
	storiesAct = Story.objects.filter(is_complete=False, is_open=True).order_by('id')[:10]
	concat = list(chain(storiesComp, storiesAct))
	data = serializers.serialize('json', concat)
	return HttpResponse(data, content_type = "application/json") 

@login_required
def getStory(request, sid):
	story = Story.objects.get(id=sid)
	graph = story.graph
	graphTree = recursive_node_to_dict(graph)
	return HttpResponse(json.dumps(graphTree), content_type = "application/json")


@login_required	
def getBranch(request, bid):
	branch = Graph.objects.get(id=bid)
	graphTree = recursive_node_to_dict(graph)
	return HttpResponse(json.dumps(graphTree), content_type = "application/json")

@login_required
def getContributors(request, sid):
	story = Story.objects.get(id=sid)
	contributors = Contributors.objects.filter(sid=story)
	data = serializers.serialize('json', contributors)
	return HttpResponse(data, content_type = "application/json") 

@login_required
def getNumContributions(request, uid):
	user = User.objects.get(id=uid)
	contributions = Contributors.objects.get(user=user)
	count = len(contributions)
	return HttpResponse(json.dumps(count), content_type = "application/json")

@login_required
def getUserLikesUser(request, uid):
	user = User.objects.get(id=uid)
	likes = Likes.objects.get(user=user)
	data = serializers.serialize('json', likes)
	return HttpResponse(data, content_type = "application/json")

@login_required
def getLikesStory(request, sid):
	story = Story.objects.get(id=sid)
	likes = Likes.objects.filter(story=story)
	data = serializers.serialize('json', likes)
	return HttpResponse(data, content_type = "application/json")

@login_required
def getLikesUser(request, uid):
	user = User.objects.get(id=uid)
	likes = Likes.objects.filter(user=user)
	data = serializers.serialize('json', likes)
	return HttpResponse(data, content_type = "application/json")

@login_required
def getNCompleted(request,n):
	stories = Story.objects.filter(is_complete=True).order_by('id')[:n]
	data = serializers.serialize('json', stories)
	return HttpResponse(data, content_type = "application/json")

@login_required
def getNActive(request,n):
	stories = Story.objects.filter(is_open=True).order_by('id')[:n]
	data = serializers.serialize('json', stories)
	return HttpResponse(data, content_type = "application/json")

@login_required
def getUser(request,uid,cid):
	user = User.objects.filter(id=cid)
	data = serializers.serialize('json', user)
	return HttpResponse(data, content_type = "application/json")


# ##### POST methods #####

@csrf_exempt
def sign_up(request):
	user = User.objects.create_user(request.POST['userName'], '', request.POST['password'])
	user.first_name = request.POST['firstName']
	user.last_name = request.POST['lastName']
	user.email = request.POST['email']
	user.save()
	return HttpResponseRedirect(reverse('api.views.index',))

@login_required
@csrf_exempt
def addToStory(request, uid, sid, bid):
	data={}
	if request.user == uid:
		s = Story.objects.get(id=sid)
		u = User.objects.get(id=uid)
		p = Graph.objects.get(id=bid)
		g = Graph(name = request.POST['data'],\
					data = request.POST['data'],\
					parent = p,\
					user = request.POST['user'])
		g.save()
		data['result'] = 'true' 
	else:
		data['result'] = 'false'
	return HttpResponse(json.dumps(data), content_type = "application/json")



@login_required
@csrf_exempt
def setOpen(request, uid, sid):
	data={}
	if request.user == uid:
		s = Story.objects.get(id=sid)
		s.is_open = True
		s.save()
		data['result'] = 'true' 
	else:
		data['result'] = 'false'
	return HttpResponse(json.dumps(data), content_type = "application/json")

@login_required
@csrf_exempt
def setClosed(request, uid, sid):
	data={}
	if request.user == uid:
		s = Story.objects.get(id=sid)
		s.is_open = False
		s.save()
		data['result'] = 'true' 
	else:
		data['result'] = 'false'
	return HttpResponse(json.dumps(data), content_type = "application/json")

@login_required
@csrf_exempt
def setComplete(request, uid, sid):
	data={}
	if request.user == uid:
		s = Story.objects.get(id=sid)
		s.is_complete = True
		s.save()
		data['result'] = 'true' 
	else:
		data['result'] = 'false'
	return HttpResponse(json.dumps(data), content_type = "application/json")

@login_required
@csrf_exempt
def setIncomplete(request, uid, sid):
	data={}
	if request.user == uid:
		s = Story.objects.get(id=sid)
		s.is_complete = False
		s.save()
		data['result'] = 'true' 
	else:
		data['result'] = 'false'
	return HttpResponse(json.dumps(data), content_type = "application/json")

@login_required
@csrf_exempt
def like(request, uid, sid):
	data = {}
	if request.user.id == uid:
		s = Story.objects.get(id=sid)
		l = Like(user = request.user,\
					story = s)
		l.save()
		data['result'] = 'true' 
	else:
		data['result'] = 'false'
	return HttpResponse(json.dumps(data), content_type = "application/json")
	

@login_required
@csrf_exempt
def deleteBranch(request, uid, sid, bid):
	story = Entry.objects.get(id=sid)
	branch = Graph.objects.get(id=bid)
	data = {}
	if story.user == request.user or branch.user == request.user and\
	   request.user == uid:
		Graph.objects.filter(id=bid).delete()
		data['result'] = 'true' 
	else:
		data['result'] = 'false'
	return HttpResponse(json.dumps(data), content_type = "application/json")

@login_required
@csrf_exempt
def deleteStory(request, uid, sid):
	story = Entry.objects.get(id=sid)
	data = {}
	if story.user == request.user and request.user == uid:
		Story.objects.filter(id=sid).delete()
		data['result'] = 'true' 
	else:
		data['result'] = 'false'
	return HttpResponse(json.dumps(data), content_type = "application/json")

@login_required
@csrf_exempt
def addSReads(request, uid, sid):
	data = {}
	if request.user == uid:
		s = Story.objects.get(id = sid)
		count = s.read
		s.read = count+1
		s.save()
		data['result'] = 'true'
	else:
		data['result'] = 'false'
	return HttpResponse(json.dumps(data), content_type = "application/json") 


@login_required
@csrf_exempt
def addBReads(request, uid, bid):
	data = {}
	if request.user == uid:
		b = Graph.objects.get(id = bid)
		count = b.read
		b.read = count+1
		b.save()
		data['result'] = 'true'
	else:
		data['result'] = 'false'
	return HttpResponse(json.dumps(data), content_type = "application/json") 

@login_required
@csrf_exempt
def createStory(request, uid):
	data = {}
	if request.user.id == uid:
		g = Graph(name = request.POST['data'],\
					data = request.POST['data'],\
					user = request.POST['user'])
		g.save()
		s = Story(user = request.user,\
					title = request.POST['title'],\
					roomID = request.POST['roomID'],\
					graph = g)
		s.save()
		data['result'] = 'true'
	else:
		data['result'] = 'false'
	return HttpResponse(json.dumps(data), content_type = "application/json") 



