from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ReadOnlyModelViewSet
from smileapp.models import Dentists
from smileapp.serializers import DentistsSerializer
from smileapp.filters import DentistsFilter  # Create this filter if not already defined
from rest_framework.permissions import IsAuthenticated

class DentistsViewSet(ReadOnlyModelViewSet):
    """Dentists can only see their own information."""
    serializer_class = DentistsSerializer
    permission_classes = [IsAuthenticated]  # Assuming IsDentist checks the user's role
    filter_backends = [DjangoFilterBackend]
    filterset_class = DentistsFilter  # Use a filter class for Dentists

    def get_queryset(self):
        return Dentists.objects.filter(user=self.request.user)
