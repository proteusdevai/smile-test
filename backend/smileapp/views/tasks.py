from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from smileapp.models import Tasks
from smileapp.serializers import TasksSerializer
from smileapp.filters import  TasksFilter
from smileapp.permissions import IsDentist, IsOwnerDentistOfResource
from utils import get_user_dentist



class TasksViewSet(viewsets.ModelViewSet):
    """Only the dentist who owns the task can see it."""
    serializer_class = TasksSerializer
    permission_classes = [IsAuthenticated, IsDentist, IsOwnerDentistOfResource]
    filter_backends = [DjangoFilterBackend]
    filterset_class = TasksFilter


    def get_queryset(self):
        dentist = get_user_dentist(self.request.user)
        return Tasks.objects.filter(dentist=dentist)



