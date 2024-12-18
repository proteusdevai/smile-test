from rest_framework import serializers
from .models import (
    Dentists,
    Patients,
    Consults,
    Messages,
    ConsultNotes,
    Tags,
    Tasks
)

class DentistsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dentists
        exclude = ['user']  # Don't expose user info


class PatientsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patients
        exclude = ['user']
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone_number',
            'smile_goals', 'first_seen', 'last_seen', 'stage', 'tags'
        ]


class ConsultsSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.first_name', read_only=True)
    dentist_name = serializers.CharField(source='dentist.first_name', read_only=True)

    class Meta:
        model = Consults
        fields = [
            'id', 'patient_name', 'category', 'stage', 'description', 'amount',
            'created_at', 'updated_at', 'archived_at', 'expected_visit_date',
            'dentist_name', 'index'
        ]


class MessagesSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.first_name', read_only=True)
    dentist_name = serializers.CharField(source='dentist.first_name', read_only=True)

    class Meta:
        model = Messages
        fields = ['id', 'patient_name', 'dentist_name', 'text', 'date', 'attachments']


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
