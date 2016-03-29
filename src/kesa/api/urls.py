from django.conf.urls import url

from . import views

urlpatterns = [
	url(r'^signup/$', views.sign_up, name='sign_up'),
	url(r'^getInit/$', views.getInit, name='getInit'),
	url(r'^getStory/(?P<sid>\w+)/$', views.getStory, name='getStory'),
	url(r'^getBranch/(?P<sid>\w+)/$', views.getBranch, name='getBranch'),
	url(r'^getContributors/(?P<sid>\w+)/$', views.getContributors, name='getContributors'),
	url(r'^getCompleted/(?P<n>\w+)/$', views.getNCompleted, name='getNCompleted'),
    url(r'^getActive/(?P<n>\w+)/$', views.getNActive, name='getNActive'),
	url(r'^(?P<uid>\w+)/getNumContributions/$', views.getNumContributions, name='getNumContributions'),
	url(r'^(?P<uid>\d+)/getUser/(?P<cid>\w+)/$', views.getUser, name='getUser'),
    url(r'^(?P<uid>\d+)/addToStory/(?P<sid>\w+)/$', views.addToStory, name='addToStory'),
    url(r'^(?P<uid>\d+)/setOpen/(?P<sid>\w+)/$', views.setOpen, name='setOpen'),
    url(r'^(?P<uid>\d+)/setClosed/(?P<sid>\w+)/$', views.setClosed, name='setClosed'),
    url(r'^(?P<uid>\d+)/like/(?P<sid>\w+)/$', views.like, name='like'),
    url(r'^(?P<uid>\d+)/deleteBranch/(?P<sid>\w+)/$', views.deleteBranch, name='deleteBranch'),
    url(r'^(?P<uid>\d+)/deleteStory/(?P<sid>\w+)/$', views.deleteStory, name='deleteStory'),
    url(r'^(?P<uid>\d+)/addSReads/(?P<sid>\w+)/$', views.addSReads, name='addSReads'),
    url(r'^(?P<uid>\d+)/addBReads/(?P<sid>\w+)/$', views.addBReads, name='addBReads'),
    url(r'^(?P<uid>\w+)/createStory/$', views.createStory, name='createStory'),  
]