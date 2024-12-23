from django_filters.rest_framework import DjangoFilterBackend
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from smileapp.models import Messages
from smileapp.serializers import MessagesSerializer
from smileapp.filters import  MessagesFilter
from smileapp.permissions import IsParticipantInMessage



class MessagesViewSet(viewsets.ModelViewSet):
    """Only the participant of a message (dentist or patient) can see it."""
    serializer_class = MessagesSerializer
    permission_classes = [IsAuthenticated, IsParticipantInMessage]
    filter_backends = [DjangoFilterBackend]
    filterset_class = MessagesFilter


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

