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

import logging

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
            messages =  Messages.objects.filter(dentist=dentists)
            logger.info('Found {} messages for dentist with id: {}'.format(len(messages), user.id))
            return messages

        if patients:
            # If the user is a patient, return messages where the patient is the participant
            return Messages.objects.filter(patient=patients)

        # If the user is neither a dentist nor a patient, return an empty queryset
        return Messages.objects.none()


    def create(self, request, *args, **kwargs):
        """Override create to handle initial message creation with attachments."""
        logger.info("Received request: {}".format(request.data))
        patient_id = request.data.get('patient_id')
        dentist_id = request.data.get('dentist_id')
        sender_id = request.data.get('sender_id')
        text = request.data.get('text', 'Initial Message Text')
        title = request.data.get('title', 'Initial Message Title')


        # Ensure both patient and dentist exist
        patient = Patients.objects.filter(id=patient_id).first()
        dentist = Dentists.objects.filter(id=dentist_id).first()

        is_patient = Patients.objects.filter(id=sender_id).exists()  # Check if sender_id exists in Patients
        is_dentist = Dentists.objects.filter(id=sender_id).exists()  #

        if not patient or not dentist or (not is_patient and not is_dentist):
            return Response(
                {'error': 'Invalid patient or dentist ID'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        sender_type = 'Patient' if is_patient else 'Dentist'


        # Create the message
        message = Messages.objects.create(
            patient=patient,
            dentist=dentist,
            sender_id=sender_id,
            sender_type=sender_type,
            text=text,
            title=title,
        )

        # Save attachments if provided
        #for attachment in attachments:
            # Save the file and determine its path
         #   path = default_storage.save(f"uploads/{attachment.name}", ContentFile(attachment.read()))
         #   full_path = os.path.join(settings.MEDIA_ROOT, path)
         #   file_url = default_storage.url(path)

            # Create RAFile for each attachment
          #  RAFile.objects.create(
         #       file=path,
          #      title=os.path.splitext(attachment.name)[0],  # File name without extension
         #       type=attachment.content_type,  # MIME type of the file
          #      message=message,  # Associate with the created message
          #      path=full_path,  # Full path to the file
          #      src=file_url,  # Publicly accessible URL
         #   )

        return Response(
            MessagesSerializer(message).data,
            status=status.HTTP_201_CREATED,
        )
