from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from smileapp.serializers import DentistsSerializer
from smileapp.models import Dentists
from smileapp.permissions import IsDentist, IsOwnerDentistOfResource, IsParticipantInMessage
from smileapp.filters import PatientsFilter


class DentistsViewSet(viewsets.ReadOnlyModelViewSet):
    """Dentists can only see their own information."""
    serializer_class = DentistsSerializer
    permission_classes = [IsAuthenticated, IsDentist]
    filter_backends = [DjangoFilterBackend]
    filterset_class = PatientsFilter

    def get_queryset(self):
        return Dentists.objects.filter(user=self.request.user)