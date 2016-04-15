from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from django.core.urlresolvers import reverse
import json
import random
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
        'body': node.data,
    }
    children = [recursive_node_to_dict(c) for c in node.get_children()]
    if children:
        result['children'] = children
    return result


# ##### logout #####

from django.contrib.auth import logout


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('api.views.index', ))


# Create your views here.

def landing(request):
    response = render(request, 'api/index.html')
    return response


def index(request):
    response = render(request, 'api/index.html')
    return response


def stories(request):
    response = render(request, 'api/stories.html')
    return response


def profile(request, username):
    response = None
    if (request.user.is_authenticated()):
        response = render(request, 'api/profile.html')
    else:
        response = render(request, 'api/index.html')
    return response


def story(request, id):
    response = None
    if (request.user.is_authenticated()):
        s = Story.objects.get(id=id)
        if (s.is_open):
            if (s.user == request.user):
                response = render(request, 'api/writingowner.html')
            else:
                response = render(request, 'api/writingguest.html')
        else:
            response = render(request, 'api/reading.html')
    else:
        response = render(request, 'api/index.html')
    return response


def analytics(request):
    response = None
    if (request.user.is_authenticated()):
        response = render(request, 'api/analytics.html')
    else:
        response = render(request, 'api/index.html')
    return response


def signup(request):
    response = render(request, 'api/signup.html')
    return response


# ##### GET methods #####

@login_required
def getInit(request):
    storiesComp = Story.objects.filter(is_complete=True).order_by('id')[:10]
    storiesAct = Story.objects.filter(is_complete=False, is_open=True).order_by('id')[:10]
    concat = list(chain(storiesComp, storiesAct))
    data = serializers.serialize('json', concat)
    return HttpResponse(data, content_type="application/json")


@login_required
def getStory(request, sid):
    story = Story.objects.get(id=sid)
    graph = story.graph
    graphTree = "undefined"
    if (graph != None):
        graphTree = recursive_node_to_dict(graph)
        graphTree['title'] = story.title
    return HttpResponse(json.dumps(graphTree), content_type="application/json")


@login_required
def getBranch(request, bid):
    branch = Graph.objects.get(id=bid)
    graphTree = recursive_node_to_dict(branch)
    return HttpResponse(json.dumps(graphTree), content_type="application/json")


@login_required
def getContributors(request, sid):
    story = Story.objects.get(id=sid)
    contributors = Contributors.objects.filter(story=story)
    data = serializers.serialize('json', contributors)
    return HttpResponse(data, content_type="application/json")


@login_required
def getNumContributions(request, uid):
    user = User.objects.get(id=uid)
    contributions = Contributors.objects.filter(user=user)
    count = len(contributions)
    return HttpResponse(json.dumps(count), content_type="application/json")


@login_required
def getNumStories(request, uid):
    user = User.objects.get(id=uid)
    story = Story.objects.filter(user=user)
    story = len(story)
    return HttpResponse(json.dumps(story), content_type="application/json")


@login_required
def getLikesStory(request, sid):
    story = Story.objects.get(id=sid)
    likes = Likes.objects.filter(story=story)
    data = serializers.serialize('json', likes)
    return HttpResponse(data, content_type="application/json")


@login_required
def getLikesUser(request, uid):
    user = User.objects.get(id=uid)
    likes = Likes.objects.filter(user=user)
    data = serializers.serialize('json', likes)
    return HttpResponse(data, content_type="application/json")


@login_required
def getNCompleted(request, sid, n):
    stories = Story.objects.filter(is_complete=True).filter(id__gt=sid).order_by('id')[:n]
    data = serializers.serialize('json', stories)
    return HttpResponse(data, content_type="application/json")


@login_required
def getNIncompleted(request, sid, n):
    stories = Story.objects.filter(is_complete=False).filter(id__gt=sid).order_by('id')[:n]
    data = serializers.serialize('json', stories)
    return HttpResponse(data, content_type="application/json")


@login_required
def getNActive(request, sid, n):
    stories = Story.objects.filter(is_open=True).filter(id__gt=sid).order_by('id')[:n]
    data = serializers.serialize('json', stories)
    return HttpResponse(data, content_type="application/json")


@login_required
def getUser(request, uid, cid):
    story = Story.objects.get(id=cid)
    user = story.user
    data = serializers.serialize('json', [user])
    return HttpResponse(data, content_type="application/json")


@login_required
def getUserByName(request, username):
    user = User.objects.get(username=username)
    data = serializers.serialize('json', [user])
    return HttpResponse(data, content_type="application/json")


@login_required
def getUserStories(request, uid, sid, n):
    story = None
    user = User.objects.get(id=uid)
    if (int(sid) == 0):
        story = Story.objects.filter(user=user).filter(id__gt=sid).order_by('-id')[:n]
    else:
        story = Story.objects.filter(user=user).filter(id__lt=sid).order_by('-id')[:n]
    data = serializers.serialize('json', story)
    return HttpResponse(data, content_type="application/json")


# ##### POST methods #####

@csrf_exempt
def sign_up(request):
    user = User.objects.create_user(request.POST['userName'], '', request.POST['password'])
    user.first_name = request.POST['firstName']
    user.last_name = request.POST['lastName']
    user.email = request.POST['email']
    user.save()
    return HttpResponseRedirect(reverse('api.views.index', ))


@login_required
@csrf_exempt
def addToStory(request, uid, sid, bid):
    data = {}
    if request.user.id == int(uid):
        s = Story.objects.get(id=sid)
        u = User.objects.get(id=uid)
        p = Graph.objects.get(id=bid)
        g = Graph(name=request.POST['data'], \
                  data=request.POST['data'], \
                  parent=p, \
                  user=request.POST['user'])
        g.save()
        data['result'] = 'true'
    else:
        data['result'] = 'false'
    return HttpResponse(json.dumps(data), content_type="application/json")


@login_required
@csrf_exempt
def setOpen(request, sid):
    data = {}
    s = Story.objects.get(id=sid)
    if (request.user == s.user):
        s.is_open = True
        s.save()
        data['result'] = 'true'
    else:
        data['result'] = 'false'
    return HttpResponse(json.dumps(data), content_type="application/json")


@login_required
@csrf_exempt
def setClosed(request, sid):
    data = {}
    s = Story.objects.get(id=sid)
    if (request.user == s.user):
        s.is_open = False
        s.save()
        data['result'] = 'true'
    else:
        data['result'] = 'false'
    return HttpResponse(json.dumps(data), content_type="application/json")


@login_required
@csrf_exempt
def setComplete(request, sid):
    data = {}
    s = Story.objects.get(id=sid)
    if (request.user == s.user):
        s.is_complete = True
        s.save()
        data['result'] = 'true'
    else:
        data['result'] = 'false'
    return HttpResponse(json.dumps(data), content_type="application/json")


@login_required
@csrf_exempt
def setIncomplete(request, sid):
    data = {}
    s = Story.objects.get(id=sid)
    if (request.user == s.user):
        s.is_complete = False
        s.save()
        data['result'] = 'true'
    else:
        data['result'] = 'false'
    return HttpResponse(json.dumps(data), content_type="application/json")


@login_required
@csrf_exempt
def like(request, uid, sid):
    data = {}
    if request.user.id == int(uid):

        s = Story.objects.get(id=sid)
        u = User.objects.get(id=uid)
        l = Likes.objects.filter(user=u, story=s)
        if (len(l) != 0):
            l = Likes(user=request.user, \
                      story=s)
            l.save()
        data['result'] = 'true'
    else:
        data['result'] = 'false'
    return HttpResponse(json.dumps(data), content_type="application/json")


@login_required
@csrf_exempt
def deleteBranch(request, sid, bid):
    story = Story.objects.get(id=sid)
    branch = Graph.objects.get(id=bid)
    data = {}
    if story.user == request.user or branch.user == request.user:
        Graph.objects.filter(id=bid).delete()
        data['result'] = 'true'
    else:
        data['result'] = 'false'
    return HttpResponse(json.dumps(data), content_type="application/json")


@login_required
@csrf_exempt
def deleteStory(request, sid):
    story = Story.objects.get(id=sid)
    data = {}
    if story.user == request.user:
        Story.objects.filter(id=sid).delete()
        data['result'] = 'true'
    else:
        data['result'] = 'false'
    return HttpResponse(json.dumps(data), content_type="application/json")


@login_required
@csrf_exempt
def addSReads(request, sid):
    data = {}
    s = Story.objects.get(id=sid)
    count = s.read
    s.read = count + 1
    s.save()
    data['result'] = 'true'
    return HttpResponse(json.dumps(data), content_type="application/json")


@login_required
@csrf_exempt
def addBReads(request, bid):
    data = {}
    b = Graph.objects.get(id=bid)
    count = b.read
    b.read = count + 1
    b.save()
    data['result'] = 'true'
    return HttpResponse(json.dumps(data), content_type="application/json")


@login_required
@csrf_exempt
def createStory(request, uid):
    data = {}
    if request.user.id == int(uid):
        g = Graph(name=request.POST['name'], \
                  data=request.POST['data'], \
                  user=request.POST['user'])
        g.save()
        s = Story(user=request.user, \
                  title=request.POST['title'], \
                  graph=g)
        s.save()
        data['result'] = 'true'
    else:
        data['result'] = 'false'
    return HttpResponse(json.dumps(data), content_type="application/json")


def getUniqueName():
    id = Graph.object.all().order_by('-id')[0].id
    return id


def getData(dataList):
    i = random.randint(1, len(dataList))
    data = dataList[i]
    return data