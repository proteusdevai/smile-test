from django.contrib.auth.models import User
from rest_framework import viewsets
from smileapp.serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
import logging

logger = logging.getLogger(__name__)

# ViewSet for User
class UsersViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request):
        logger.info("UsersViewSet was queried for a list of users.")
        users = User.objects.all()
        serialized_users = [{'id': user.id, 'username': user.username, 'email': user.email} for user in users]
        return Response(serialized_users)


    def retrieve(self, request, pk=None):
        logger.info(f"UsersViewSet was queried for user ID: {pk}")
        try:
            user = User.objects.get(pk=pk)
            serialized_user = {'id': user.id, 'username': user.username, 'email': user.email}
            return Response(serialized_user)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

    def get_queryset(self):
        """
        Optionally filter users by the current logged-in user if needed.
        """
        print('Received a user view')
        user = self.request.user
        if self.request.query_params.get('me'):
            return User.objects.filter(id=user.id)
        return super().get_queryset()