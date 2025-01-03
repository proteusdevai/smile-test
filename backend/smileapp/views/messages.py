import logging
import os
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from config import settings
from smileapp.filters import MessagesFilter
from smileapp.models import Messages, Patients, Dentists, RAFile
from smileapp.permissions import IsParticipantInMessage
from smileapp.serializers import MessagesSerializer, RAFileSerializer

logger = logging.getLogger(__name__)


class MessagesViewSet(viewsets.ModelViewSet):
    """Only the participant of a message (dentist or patient) can see it."""
    serializer_class = MessagesSerializer
    permission_classes = [IsAuthenticated, IsParticipantInMessage]
    filter_backends = [DjangoFilterBackend]
    filterset_class = MessagesFilter

    def get_queryset(self):
        """Return only messages for the logged-in dentist or patient."""
        user = self.request.user
        dentists = getattr(user, 'dentists', None)  # Get dentist if the user is a dentist
        patients = getattr(user, 'patients', None)  # Get patient if the user is a patient
        logger.info('Trying to pull messages for dentist with id: {}'.format(user.id))
        if dentists:
            # If the user is a dentist, return messages where the dentist is the participant
            messages = Messages.objects.filter(dentist=dentists).prefetch_related('files').order_by('-created_at')
            logger.info('Found {} messages for dentist with id: {}'.format(len(messages), user.id))
            return messages

        if patients:
            # If the user is a patient, return messages where the patient is the participant
            return Messages.objects.filter(patient=patients).prefetch_related('files').order_by('-created_at')

        # If the user is neither a dentist nor a patient, return an empty queryset
        return Messages.objects.none()

    def create(self, request, *args, **kwargs):
        logger.info("Received request: {}".format(request.data))
        patient_id = request.data.get('patient_id')
        dentist_id = request.data.get('dentist_id')
        sender_id = request.data.get('sender_id')
        text = request.data.get('text', 'Initial Message Text')
        title = request.data.get('title', 'Initial Message Title')
        attachments = request.data.get('attachments', [])

        # Ensure both patient and dentist exist
        patient = Patients.objects.filter(id=patient_id).first()
        dentist = Dentists.objects.filter(id=dentist_id).first()

        if not patient or not dentist:
            return Response(
                {'error': 'Invalid patient or dentist ID'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        sender_type = 'Patient' if Patients.objects.filter(id=sender_id).exists() else 'Dentist'

        # Create the message
        message = Messages.objects.create(
            patient=patient,
            dentist=dentist,
            sender_id=sender_id,
            sender_type=sender_type,
            text=text,
            title=title,
        )

        logger.info(f"Message created with ID: {message.id}")

        # Save attachments if provided
        for attachment in attachments:
            raw_file = attachment.get('rawFile')  # Extract the raw file info
            if not raw_file:
                logger.warning(f"Skipping attachment without rawFile: {attachment}")
                continue

            file_id = attachment.get('id')
            logger.info('Attachment ID: {}'.format(file_id))
            RAFile.objects.filter(id=file_id).update(message=message)

        return Response(MessagesSerializer(message).data, status=status.HTTP_201_CREATED)
