from django.conf.urls import url

from . import views

urlpatterns = [
	url(r'^signup/$', views.sign_up, name='sign_up'),
	url(r'^getInit/$', views.getInit, name='getInit'),
	url(r'^getStory/(?P<sid>\d+)/$', views.getStory, name='getStory'),
	url(r'^getBranch/(?P<bid>\d+)/$', views.getBranch, name='getBranch'),
	url(r'^getContributors/(?P<sid>\d+)/$', views.getContributors, name='getContributors'),
	url(r'^getCompleted/(?P<n>\d+)/$', views.getNCompleted, name='getNCompleted'),
    url(r'^getActive/(?P<n>\d+)/$', views.getNActive, name='getNActive'),
    url(r'^getLikesStory/(?P<sid>\d+)/$', views.getLikesStory, name='getLikesStory'),
    url(r'^getLikesUser/(?P<uid>\d+)/$', views.getLikesUser, name='getLikesUser'),
	url(r'^(?P<uid>\d+)/getNumContributions/$', views.getNumContributions, name='getNumContributions'),
	url(r'^(?P<uid>\d+)/getUser/(?P<cid>\d+)/$', views.getUser, name='getUser'),
    url(r'^(?P<uid>\d+)/addToStory/(?P<sid>\d+)/$', views.addToStory, name='addToStory'),
    url(r'^(?P<uid>\d+)/setOpen/(?P<sid>\d+)/$', views.setOpen, name='setOpen'),
    url(r'^(?P<uid>\d+)/setClosed/(?P<sid>\d+)/$', views.setClosed, name='setClosed'),
    url(r'^(?P<uid>\d+)/setComplete/(?P<sid>\d+)/$', views.setComplete, name='setComplete'),
    url(r'^(?P<uid>\d+)/setIncomplete/(?P<sid>\d+)/$', views.setIncomplete, name='setIncomplete'),
    url(r'^(?P<uid>\d+)/like/(?P<sid>\d+)/$', views.like, name='like'),
    url(r'^(?P<uid>\d+)/deleteBranch/(?P<sid>\d+)/(?P<bid>\d+)/$', views.deleteBranch, name='deleteBranch'),
    url(r'^(?P<uid>\d+)/deleteStory/(?P<sid>\d+)/$', views.deleteStory, name='deleteStory'),
    url(r'^(?P<uid>\d+)/addSReads/(?P<sid>\d+)/$', views.addSReads, name='addSReads'),
    url(r'^(?P<uid>\d+)/addBReads/(?P<bid>\d+)/$', views.addBReads, name='addBReads'),
    url(r'^(?P<uid>\d+)/createStory/$', views.createStory, name='createStory'),  
]