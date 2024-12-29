from django.urls import path, include
from rest_framework.routers import DefaultRouter

from smileapp.views import (
    DentistsViewSet,
    PatientsViewSet,
    ConsultsViewSet,
    MessagesViewSet,
    ConsultNotesViewSet,
    TagsViewSet,
    TasksViewSet
)

router = DefaultRouter()
router.register('dentists', DentistsViewSet, basename='dentists')
router.register('patients', PatientsViewSet, basename='patients')
router.register('consults', ConsultsViewSet, basename='consults')
router.register('messages', MessagesViewSet, basename='messages')
router.register('consult-messages', ConsultNotesViewSet, basename='consul-tnotes')
router.register('tasks', TasksViewSet, basename='tasks')
router.register('tags', TagsViewSet, basename='tags')