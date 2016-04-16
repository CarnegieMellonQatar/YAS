from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from django.core.urlresolvers import reverse
import json
import os
import random
import datetime
from datetime import datetime, timedelta
from itertools import chain
from django.db.models import Count

from .models import Graph, Story, Contributors, Likes, Image

from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth.decorators import permission_required


# ##### Helper Methods #####

# code taken from: http://stackoverflow.com/questions/12556268/fastest-way-to-create-json-to-reflect-a-tree-structure-in-python-django-using

def recursive_node_to_dict(node):
    print node.name
    indexvalue = node.name.find(str(node.pk))
    if(indexvalue == -1):
        indexvalue = len(node.name)
    result = {
        'branchid': node.pk,
        'name': node.name[0:indexvalue],
        'body': node.data,
        'read': node.read,
    }
    children = [recursive_node_to_dict(c) for c in node.get_children()]
    if children:
        result['children'] = children
    return result

def getMaxChild(nodeList):
    maxNode = nodeList[0]
    for i in nodeList:
        if i.read > maxNode.read:
            maxNode = i
    return maxNode

def getMinChild(nodeList):
    minNode = nodeList[0]
    for i in nodeList:
        if i.read < minNode.read:
            minNode = i
    return minNode

def recuesive_get_max_path(node, nlist):
    children = node.get_children()
    # if len(children) == 0:
    if node.is_leaf_node():
        # print node.id
        nlist.append(node.id)
    else:
        nlist.append(node.id)
        nextNode = getMaxChild(children)
        recuesive_get_max_path(nextNode, nlist)

def recuesive_get_min_path(node, nlist):
    children = node.get_children()
    # if len(children) == 0:
    if node.is_leaf_node():
        # print node.id
        nlist.append(node.id)
    else:
        # print node.id
        nlist.append(node.id)
        nextNode = getMinChild(children)
        recuesive_get_min_path(nextNode, nlist)

def getStoryAnalysis(storyList):
    result = []
    m_brach = []
    l_brach = []
    for i in storyList:
        data = {}
        data['sid'] = i.id
        recuesive_get_max_path(i.graph, m_brach)
        recuesive_get_min_path(i.graph, l_brach)
        data['m_brach'] = m_brach
        data['l_brach'] = l_brach
        result.append(data)
        m_brach = []
        l_brach = []
    return result



# ##### logout #####

from django.contrib.auth import logout


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('api.views.index', ))


# Create your views here.

def index(request):
    response = render(request, 'api/index.html')
    return response


def stories(request):
    response = None
    if (request.user.is_authenticated()):
        response = render(request, 'api/stories.html')
    else:
        response = render(request, 'api/index.html')
    return response

def create(request):
    response = None
    if (request.user.is_authenticated()):
        response = render(request, 'api/create.html')
    else:
        response = render(request, 'api/index.html')
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
        s = Story.objects.filter(id=id)
        if(len(s) != 0):
            s=s[0]
            if(s.is_open):
                if(s.user == request.user):
                    response = render(request, 'api/writingowner.html')
                else:
                    response = render(request, 'api/writingguest.html')
            else:
                response = render(request, 'api/reading.html')
        else:
            response = render(request, 'api/error.html')
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
    if(graph != None):
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

@login_required
def getImage(request, username):
    user = User.objects.filter(username = username)
    i = Image.objects.filter(user=user)
    if len(i) == 0:
        default = Image.objects.get(0)
        return HttpResponse(default.image.read(), content_type = default.mimeType)
    else:
        im = i[0]
        return HttpResponse(im.image.read(), content_type = im.mimeType)


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
def addImage(request):
    data = {}
    user = User.objects.get(id = request.user.id)
    u = Image.objects.filter(user = user)
    if request.FILES:
        if len(u) == 0:
            i = Image(user = user,\
                      image = request.FILES['img_file'],\
                      mimeType = request.FILES['img_file'].content_type)
            i.save()
        else: 
            i = u[0]
            i.image = request.FILES['img_file']
            i.mimeType = request.FILES['img_file'].content_type
            i.save()
        data['result'] = 'true'
    else:
        data['result'] = 'false'
    return HttpResponse(json.dumps(data), content_type="application/json")


@login_required
@csrf_exempt
def addToStory(request, sid, bid):
    data = {}
    s = Story.objects.get(id=sid)
    u = User.objects.get(id=request.user.id)
    p = Graph.objects.get(id=bid)
    g = Graph(name="Empty Branch/"+str(bid), \
              data="Add something here", \
              parent=p, \
              user=u)
    g.save()
    g.name = g.name[:g.name.find("/"+str(bid))]+str(int(g.id))
    g.save()
    data['result'] = str(g.id)
    return HttpResponse(json.dumps(data), content_type="application/json")

@login_required
@csrf_exempt
def editStory(request, sid, bid):
    data = {}
    p = Graph.objects.get(id=bid)
    if(request.user == p.user):
        p.data = request.POST['body']
        p.name = request.POST['name']+str(p.id)
        p.save()
        data['result'] = "true"
    else:
        data['result'] = "false"
    return HttpResponse(json.dumps(data), content_type="application/json")


@login_required
@csrf_exempt
def setOpen(request, sid):
    data = {}
    s = Story.objects.get(id=sid)
    if(request.user == s.user):
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
    if(request.user == s.user):
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
    if(request.user == s.user):
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
    if(request.user == s.user):
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
        s = Story.objects.filter(id=sid)
        s[0].graph.delete()
        s.delete()
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
    response = None
    if request.user.id == int(uid):
        g = Graph(name=request.POST['name'], \
                  data="This is empty!! Edit me", \
                  user=request.user)
        g.save()
        g.name = g.name+str(g.id)
        g.save()
        s = Story(user=request.user, \
                  title=request.POST['title'], \
                  is_open=request.POST['is_open'],\
                  graph=g)
        s.save()
        string = "/"+str(s.id)+"/story"
        return HttpResponseRedirect(string)
    else:
        return HttpResponseRedirect("/create")

@login_required
@csrf_exempt
def getGraphAnalytics(request, username, numDays):
    data = {}
    if request.user.username == str(username):
        user = User.objects.get(username=str(username))
        stories = Story.objects.filter(user = user)
        likes = Likes.objects.filter(story__in=stories, date__gte=datetime.now()-timedelta(days=int(numDays)))
        data = serializers.serialize('json', likes)
        return HttpResponse(data, content_type="application/json")
    else:
        data['result'] = 'false'
        return HttpResponse(json.dumps(data), content_type="application/json")


@login_required
@csrf_exempt
def getGenericAnalytics(request, username):
    data = {}
    if request.user.username == str(username):
        user = User.objects.get(username=str(username))
        stories = Story.objects.filter(user = user)
        fan = Likes.objects.filter(story__in=stories).values('user').annotate(total=Count('user')).order_by('-total')[0]
        fan = fan['user']
        contributor = Contributors.objects.filter(story__in=stories).values('user').annotate(total=Count('user')).order_by('-total')[0]
        contributor = contributor['user']
        result = {}
        # result['fan'] = serializers.serialize('json',User.objects.filter(id = fan))
        # result['contributor'] = serializers.serialize('json',User.objects.filter(id = contributor)) 
        # print json.loads(serializers.serialize('json',User.objects.filter(id = contributor)))
        result['fan'] = fan
        result['contributor'] = contributor
        s = getStoryAnalysis(stories)
        result['stories'] = s
        return HttpResponse(json.dumps(result), content_type="application/json")
    else:
        data['result'] = 'false'
        return HttpResponse(json.dumps(data), content_type="application/json")
    

# Functions to populate the database with garbage values to get analatics

def makeBodies(numBodies, length):
    smallestChar = 32
    largestChar = 122
    retList = []
    string = ""
    for i in range(numBodies):
        string = ""
        for j in range(length):
            currentChar = chr(random.randint(smallestChar, largestChar))
            string += currentChar
        retList.append(string)
    return retList

def getUniqueName():
    id = Graph.objects.all().order_by('-id')[0].id
    return str(id+1)


def getData(dataList):
    i = random.randint(0, len(dataList)-1)
    data = dataList[i]
    return data

def getBool():
    i = random.randint(0,1)
    if i == 0:
        return True
    else:
        return False

def getRandomUser():
    allUsers = User.objects.all()
    l = len(allUsers)
    index = random.randint(0,l-1)
    return allUsers[index]

def makeGraph(parent, user, d, story):
    dataList = makeBodies(100, 100)
    name = getUniqueName()
    data = getData(dataList)
    read = random.randint(1,10)
    g = Graph(name = name, \
              data = data,\
              read = read,\
              user = user,\
              parent = parent)
    g.save()
    c = Contributors.objects.filter(user = user, story = story)
    if len(c) == 0:
        contributor = Contributors(story = story,\
                                   user = user)
        contributor.save()
    user1 = getRandomUser()
    r = random.randint(1,3)
    if(d == 5):
        return
    else:
        for i in range(r):
            makeGraph(g, user1, d+1, story)


def makeStories(user, n):
    dataList = makeBodies(100, 100)
    for i in range(n):
        g = Graph(name = str(user.id)+ " " +str(i), \
                  data = getData(dataList),\
                  read = random.randint(1,10),\
                  user = user)
        g.save()
        user1 = getRandomUser()
        # makeGraph(g, user1, 1)
        s = Story(user = user,\
                  title = str(user.id)+ " " +str(i),\
                  graph = g,\
                  read = random.randint(1,10),\
                  is_complete = getBool(),\
                  is_open = getBool())
        s.save()
        makeGraph(g, user1, 1, s)


def makeUsers(request, n):
    data = {}
    for i in range(int(n)):
        users = User.objects.filter(username = str(i))
        if len(users) == 0:
            user = User.objects.create_user(str(i), "", str(i))
            user.firstName = str(i)
            user.lastName = str(i)
            user.email = "a@a.com"
            user.save()
            r =  random.randint(1, 5)
            makeStories(user, r)
    data['result'] = 'true'
    return HttpResponse(json.dumps(data), content_type="application/json")

def populateLikes(request):
    data = {}
    numStories = Story.objects.all().count()
    users = User.objects.all()
    stories = Story.objects.all()
    for i in users:
        for j in range(numStories/4):
            story = stories[random.randint(0, numStories-1)]
            l = Likes.objects.filter(user=i, story=story)
            while (len(l) != 0):
                story = stories[random.randint(0, numStories-1)]
                l = Likes.objects.filter(user=i, story=story)

            like = Likes(user=i, \
                         story=story)
            like.save()
    data['result'] = 'true'
    return HttpResponse(json.dumps(data), content_type="application/json")
