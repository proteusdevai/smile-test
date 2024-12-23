from django.shortcuts import get_object_or_404
from smileapp.models import Dentists

def get_user_dentist(user):
    """Helper to get the dentist object associated with a user."""
    if hasattr(user, 'dentist'):
        return user.dentist  # Cached reverse relation for OneToOneField
    return get_object_or_404(Dentists, user=user)