from rest_framework.permissions import BasePermission
from .models import Dentists, Patients


class IsDentist(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return Dentists.objects.filter(user=request.user).exists()


class IsPatient(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return Patients.objects.filter(user=request.user).exists()


class IsOwnerDentistOfResource(BasePermission):
    """
    For endpoints that return resources associated with patients, consults, tasks:
    Checks if the requesting dentist is the dentist associated with the patient or resource.
    """

    def has_object_permission(self, request, view, obj):
        # obj could be a Patient, Consult, Task
        # Ensure request.user is a dentist
        if not Dentists.objects.filter(user=request.user).exists():
            return False
        dentist = Dentists.objects.get(user=request.user)

        # If this is a Consult or Task object which has a patient or dentist attribute
        if hasattr(obj, 'patient') and obj.patient is not None:
            return obj.patient.dentist_id == dentist.id

        if hasattr(obj, 'dentist') and obj.dentist is not None:
            return obj.dentist_id == dentist.id

        return False


class IsParticipantInMessage(BasePermission):
    """
    Patients: can see only messages involving themselves and their dentist.
    Dentists: can see only messages involving their patients.
    """

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user.is_authenticated:
            return False

        # If user is a patient
        if Patients.objects.filter(user=user).exists():
            patient = Patients.objects.get(user=user)
            # Message is visible if it involves this patient and their dentist
            return obj.patient_id == patient.id and obj.dentist_id == patient.dentist_id
        elif Dentists.objects.filter(user=user).exists():
            # If user is a dentist
            dentist = Dentists.objects.get(user=user)
            # Message is visible if it belongs to the dentist and the patient is that dentist's patient
            return obj.dentist_id == dentist.id and obj.patient.dentist_id == dentist.id
        else:
            return False
