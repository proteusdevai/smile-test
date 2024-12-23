from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework import viewsets, status
from rest_framework.response import Response

from config import settings
from smileapp.models import Messages, Patients, Dentists, RAFile
from smileapp.serializers import MessagesSerializer
from smileapp.filters import MessagesFilter
from smileapp.permissions import IsParticipantInMessage
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
import os

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
            return Messages.objects.filter(dentist=dentist).select_related('attachments')

        if patient:
            # If the user is a patient, return messages where the patient is the participant
            return Messages.objects.filter(patient=patient).select_related('attachments')

        # If the user is neither a dentist nor a patient, return an empty queryset
        return Messages.objects.none()


    def create(self, request, *args, **kwargs):
        """Override create to handle initial message creation with attachments."""
        patient_id = request.data.get('patient_id')
        dentist_id = request.data.get('dentist_id')
        text = request.data.get('text', 'Initial Message Text')
        title = request.data.get('title', 'Initial Message Title')
        attachments = request.FILES.getlist('attachments')  # List of uploaded files

        # Ensure both patient and dentist exist
        patient = Patients.objects.filter(id=patient_id).first()
        dentist = Dentists.objects.filter(id=dentist_id).first()

        if not patient or not dentist:
            return Response(
                {'error': 'Invalid patient or dentist ID'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create the message
        message = Messages.objects.create(
            patient=patient,
            dentist=dentist,
            text=text,
            title=title,
        )

        # Save attachments if provided
        for attachment in attachments:
            # Save the file and determine its path
            path = default_storage.save(f"uploads/{attachment.name}", ContentFile(attachment.read()))
            full_path = os.path.join(settings.MEDIA_ROOT, path)
            file_url = default_storage.url(path)

            # Create RAFile for each attachment
            RAFile.objects.create(
                file=path,
                title=os.path.splitext(attachment.name)[0],  # File name without extension
                type=attachment.content_type,  # MIME type of the file
                message=message,  # Associate with the created message
                path=full_path,  # Full path to the file
                src=file_url,  # Publicly accessible URL
            )

        return Response(
            MessagesSerializer(message).data,
            status=status.HTTP_201_CREATED,
        )
