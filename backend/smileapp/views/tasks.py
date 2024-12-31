from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from smileapp.models import Tasks
from smileapp.serializers import TasksSerializer
from smileapp.filters import  TasksFilter
from smileapp.permissions import IsDentist, IsOwnerDentistOfResource
from .utils import get_user_dentist

import logging

logger = logging.getLogger(__name__)

class TasksViewSet(viewsets.ModelViewSet):
    """Only the dentist who owns the task can see it."""
    serializer_class = TasksSerializer
    permission_classes = [IsAuthenticated, IsDentist, IsOwnerDentistOfResource]
    filter_backends = [DjangoFilterBackend]
    filterset_class = TasksFilter

    def create(self, request, *args, **kwargs):
        """Override create to handle initial message creation with attachments."""
        logger.info("Received TASK request: {}".format(request.data))
        patient_id = request.data.get('patient_id')
        dentist_id = request.data.get('dentist_id')
        text = request.data.get('text')
        type = request.data.get('type')
        due_date = request.data.get('due_date')




        # Create the message
        task = Tasks.objects.create(
            patient_id=patient_id,
            dentist_id=dentist_id,
            text=text,
            type=type,
            due_date=due_date
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
            TasksSerializer(task).data,
            status=status.HTTP_201_CREATED,
        )

    def get_queryset(self):
        logger.info('GETTING A TASK LIST REQUEST')

        dentist = get_user_dentist(self.request.user)
        logger.info(dentist.id)
        tasks = Tasks.objects.filter(dentist=dentist)
        logger.info(tasks.count())
        return tasks


