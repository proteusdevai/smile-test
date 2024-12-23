from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from smileapp.models import Tags
from smileapp.serializers import TagsSerializer
from smileapp.filters import  TagsFilter
from smileapp.permissions import IsDentist

class TagsViewSet(viewsets.ModelViewSet):
    """Only authenticated dentists can view and manage tags."""
    queryset = Tags.objects.all().order_by('id')
    serializer_class = TagsSerializer
    permission_classes = [IsAuthenticated, IsDentist]
    filter_backends = [DjangoFilterBackend]
    filterset_class = TagsFilter



