from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from smileapp.filters import ConsultsFilter, ConsultNotesFilter
from smileapp.models import ConsultNotes, Consults
from smileapp.permissions import IsDentist, IsOwnerDentistOfResource
from smileapp.serializers import ConsultNotesSerializer, ConsultsSerializer
from .utils import get_user_dentist


class ConsultNotesViewSet(viewsets.ModelViewSet):
    """Only dentists who own the consult can view/create consult messages."""
    serializer_class = ConsultNotesSerializer
    permission_classes = [IsAuthenticated, IsDentist, IsOwnerDentistOfResource]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ConsultNotesFilter

    def get_queryset(self):
        dentist = get_user_dentist(self.request.user)
        return ConsultNotes.objects.filter(consult__dentist=dentist)


class ConsultsViewSet(viewsets.ModelViewSet):
    """Only the dentist who owns the consult can see it."""
    serializer_class = ConsultsSerializer
    permission_classes = [IsAuthenticated, IsDentist, IsOwnerDentistOfResource]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ConsultsFilter

    def get_queryset(self):
        dentist = get_user_dentist(self.request.user)
        return Consults.objects.filter(dentist=dentist).select_related('patient', 'dentist')


class UnarchiveConsultView(APIView):
    def patch(self, request):
        consult_id = request.data.get('id')
        try:
            consult = Consults.objects.get(id=consult_id)
            consult.archived_at = None
            consult.save()

            # Recalculate indices for consults in the same stage
            consults = Consults.objects.filter(stage=consult.stage).order_by('id')
            for idx, c in enumerate(consults):
                c.index = idx + 1
                c.save()

            return Response({"status": "Consult unarchived"}, status=status.HTTP_200_OK)
        except Consults.DoesNotExist:
            return Response({"error": "Consult not found"}, status=status.HTTP_404_NOT_FOUND)
