from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .permissions import IsDentist, IsOwnerDentistOfResource, IsParticipantInMessage
from .models import Patients, Dentists, Tasks, Consults, Messages, Tags, ConsultNotes
from .serializers import (
    PatientsSerializer, TasksSerializer, ConsultsSerializer,
    MessagesSerializer, TagsSerializer, DentistsSerializer, ConsultNotesSerializer
)
from django.shortcuts import get_object_or_404

def get_user_dentist(user):
    """Helper to get the dentist object associated with a user."""
    if hasattr(user, 'dentist'):
        return user.dentist  # Cached reverse relation for OneToOneField
    return get_object_or_404(Dentists, user=user)

class PatientsViewSet(viewsets.ModelViewSet):
    """Only the logged-in dentist can view their own patients."""
    serializer_class = PatientsSerializer
    permission_classes = [IsAuthenticated, IsDentist, IsOwnerDentistOfResource]

    def get_queryset(self):
        dentist = get_user_dentist(self.request.user)
        return Patients.objects.filter(dentist=dentist)

class DentistsViewSet(viewsets.ReadOnlyModelViewSet):
    """Dentists can only see their own information."""
    serializer_class = DentistsSerializer
    permission_classes = [IsAuthenticated, IsDentist]

    def get_queryset(self):
        return Dentists.objects.filter(user=self.request.user)

class TagsViewSet(viewsets.ModelViewSet):
    """Only authenticated dentists can view and manage tags."""
    queryset = Tags.objects.all().order_by('id')
    serializer_class = TagsSerializer
    permission_classes = [IsAuthenticated, IsDentist]

class ConsultNotesViewSet(viewsets.ModelViewSet):
    """Only dentists who own the consult can view/create consult notes."""
    serializer_class = ConsultNotesSerializer
    permission_classes = [IsAuthenticated, IsDentist, IsOwnerDentistOfResource]

    def get_queryset(self):
        dentist = get_user_dentist(self.request.user)
        return ConsultNotes.objects.filter(consult__dentist=dentist)

class ConsultsViewSet(viewsets.ModelViewSet):
    """Only the dentist who owns the consult can see it."""
    serializer_class = ConsultsSerializer
    permission_classes = [IsAuthenticated, IsDentist, IsOwnerDentistOfResource]

    def get_queryset(self):
        dentist = get_user_dentist(self.request.user)
        return Consults.objects.filter(dentist=dentist)

class TasksViewSet(viewsets.ModelViewSet):
    """Only the dentist who owns the task can see it."""
    serializer_class = TasksSerializer
    permission_classes = [IsAuthenticated, IsDentist, IsOwnerDentistOfResource]

    def get_queryset(self):
        dentist = get_user_dentist(self.request.user)
        return Tasks.objects.filter(dentist=dentist)

class MessagesViewSet(viewsets.ModelViewSet):
    """Only the participant of a message (dentist or patient) can see it."""
    serializer_class = MessagesSerializer
    permission_classes = [IsAuthenticated, IsParticipantInMessage]

    def get_queryset(self):
        """Return only messages for the logged-in dentist or patient."""
        user = self.request.user
        dentist = getattr(user, 'dentist', None)  # Get dentist if the user is a dentist
        patient = getattr(user, 'patient', None)  # Get patient if the user is a patient

        if dentist:
            # If the user is a dentist, return messages where the dentist is the participant
            return Messages.objects.filter(dentist=dentist)

        if patient:
            # If the user is a patient, return messages where the patient is the participant
            return Messages.objects.filter(patient=patient)

        # If the user is neither a dentist nor a patient, return an empty queryset
        return Messages.objects.none()
