from rest_framework import serializers
from django.contrib.auth.models import User  # Import the User model

from .models import (
    Dentists,
    Patients,
    Consults,
    Messages,
    ConsultNotes,
    Tags,
    Tasks,
    RAFile
)

import logging

logger = logging.getLogger(__name__)

# Serializer for the User model
class UserSerializer(serializers.ModelSerializer):
    associated_id = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'associated_id']

    def get_associated_id(self, obj):
        logger.info(f"User ID: {obj.id}")
        logger.info(f"Patient: {getattr(obj, 'patients', None)}")
        logger.info(f"Dentist: {getattr(obj, 'dentists', None)}")

        if getattr(obj, 'patients', None):
            return obj.patients.id
        elif getattr(obj, 'dentists', None):
            return obj.dentists.id
        return None

    def get_first_name(self, obj):
        logger.info(f"User ID: {obj.id}")
        logger.info(f"Patient: {getattr(obj, 'patients', None)}")
        logger.info(f"Dentist: {getattr(obj, 'dentists', None)}")

        if getattr(obj, 'patients', None):
            return obj.patients.first_name
        elif getattr(obj, 'dentists', None):
            return obj.dentists.first_name
        return obj.first_name

    def get_last_name(self, obj):
        logger.info(f"User ID: {obj.id}")
        logger.info(f"Patient: {getattr(obj, 'patients', None)}")
        logger.info(f"Dentist: {getattr(obj, 'dentists', None)}")

        if getattr(obj, 'patients', None):
            return obj.patients.last_name
        elif getattr(obj, 'dentists', None):
            return obj.dentists.last_name
        return obj.last_name

    def get_email(self, obj):
        logger.info(f"User ID: {obj.id}")
        logger.info(f"Patient: {getattr(obj, 'patients', None)}")
        logger.info(f"Dentist: {getattr(obj, 'dentists', None)}")

        if getattr(obj, 'patients', None):
            return obj.patients.email
        elif getattr(obj, 'dentists', None):
            return obj.dentists.email
        return obj.email


class DentistsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dentists
        exclude = ['user']  # Don't expose user info


class PatientsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patients
        exclude = ['user']


class ConsultsSerializer(serializers.ModelSerializer):
    patient = PatientsSerializer(read_only=True)
    dentist = DentistsSerializer(read_only=True)

    class Meta:
        model = Consults
        fields = [
            'id', 'category', 'stage', 'description', 'amount',
            'created_at', 'updated_at', 'archived_at', 'expected_visit_date',
            'patient', 'dentist', 'stage', 'index'
        ]


class ConsultNotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultNotes
        exclude = ['consult']  # Don't expose consult directly


class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = ['id', 'name', 'color']


class TasksSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.first_name', read_only=True)
    dentist_name = serializers.CharField(source='dentist.first_name', read_only=True)

    class Meta:
        model = Tasks
        fields = [
            'id', 'patient_name', 'dentist_name', 'type', 'text', 'due_date', 'done_date'
        ]


class PatientsSignupSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=255)
    last_name = serializers.CharField(max_length=255)
    phone_number = serializers.CharField(max_length=15, required=False, allow_blank=True)
    smile_goals = serializers.CharField(max_length=500)
    dentist_id = serializers.UUIDField()  # Foreign key to the dentist

    def validate_email(self, value):
        """
        Ensure the email is not already registered.
        """
        if Patients.objects.filter(email=value).exists():
            raise serializers.ValidationError("A patient with this email already exists.")
        return value


class RAFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RAFile
        fields = ['id', 'file', 'title', 'src', 'path', 'type']  # Include all metadata fields
        read_only_fields = ['src', 'path']  # These fields will be auto-calculated

class MessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Messages
        fields = ['id', 'patient', 'dentist', 'text', 'title', 'date']