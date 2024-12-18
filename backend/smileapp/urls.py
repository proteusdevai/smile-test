from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DentistsViewSet,
    PatientsViewSet,
    ConsultsViewSet,
    MessagesViewSet,
    ConsultNotesViewSet,
    TagsViewSet,
    TasksViewSet,
)

router = DefaultRouter()
router.register('dentists', DentistsViewSet, basename='dentists')
router.register('patients', PatientsViewSet, basename='patients')
router.register('consults', ConsultsViewSet, basename='consults')
router.register('messages', MessagesViewSet, basename='messages')
router.register('consult-notes', ConsultNotesViewSet, basename='consultnotes')
router.register('tags', TagsViewSet, basename='tags')
router.register('tasks', TasksViewSet, basename='tasks')

urlpatterns = [
    path('', include(router.urls)),
]
