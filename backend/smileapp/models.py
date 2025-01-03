import os
import uuid

from django.conf import settings
from django.contrib.sites.models import Site
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q


class Dentists(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.TextField()
    last_name = models.TextField()
    email = models.TextField()
    administrator = models.BooleanField()
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    disabled = models.BooleanField(default=False)

    def __str__(self):
        return f"Dentist: {self.first_name} {self.last_name}"

    def full_name(self):
        """Returns the full name of the dentist."""
        return f"{self.first_name} {self.last_name}"

    def current_patients_count(self):
        """Returns the number of active patients assigned to this dentist."""
        return self.patients_set.count()

    def get_tasks(self):
        """Returns all tasks assigned to this dentist."""
        return Tasks.objects.filter(dentist=self).order_by("due_date")


class Patients(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.TextField(null=False, blank=False)
    first_name = models.TextField(null=False, blank=False)
    last_name = models.TextField(null=False, blank=False)
    phone_number = models.TextField(null=True, blank=True)
    smile_goals = models.TextField(null=False, blank=False)
    first_seen = models.DateTimeField(null=True, blank=True)
    last_seen = models.DateTimeField(null=True, blank=True)
    stage = models.TextField(null=False, blank=False)
    category = models.TextField(null=True, blank=True)
    tags = ArrayField(models.BigIntegerField(), null=True, blank=True)
    dentist = models.ForeignKey(Dentists, on_delete=models.CASCADE)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
    )

    def __str__(self):
        return f"Patient: {self.first_name} {self.last_name}"


class Consults(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.TextField(null=False, blank=False)
    patient = models.ForeignKey(Patients, on_delete=models.CASCADE)
    dentist = models.ForeignKey(Dentists, on_delete=models.CASCADE)
    stage = models.TextField(null=False, blank=False)
    category = models.TextField(null=False, blank=False)
    description = models.TextField(null=False, blank=False)
    amount = models.BigIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archived_at = models.DateTimeField(null=True, blank=True)
    expected_visit_date = models.DateTimeField(null=True, blank=True)
    index = models.SmallIntegerField(null=True, blank=True)

    @property
    def stage(self):
        """Fetch the stage directly from the associated patient."""
        return self.patient.stage

    def __str__(self):
        return f"Consult {self.id} for Patient {self.patient_id}"


class Messages(models.Model):


    id = models.BigAutoField(primary_key=True)
    patient = models.ForeignKey(Patients, on_delete=models.CASCADE, related_name="messages")
    dentist = models.ForeignKey(Dentists, on_delete=models.CASCADE, related_name="messages")
    sender_id = models.UUIDField()  # Will store either a patient or dentist ID
    sender_type = models.CharField(
        max_length=10,
        choices=(("patient", "Patient"), ("dentist", "Dentist"))
    )  # Indicates the type of sender
    text = models.TextField(null=True, blank=True)
    title = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=Q(text__isnull=False),
                name="text_required",
            ),
        ]
        ordering = ['-created_at']

    def clean(self):
        """Ensure that text is provided."""
        if not self.text:
            raise ValidationError("Message must have text.")

    def __str__(self):
        """String representation of the message."""
        return f"Message {self.id} between Patient {self.patient_id} and Dentist {self.dentist_id}"

    def get_sender(self):
        """Return sender information."""
        if self.sender_type == "patient":
            return Patients.objects.get(id=self.sender_id)
        elif self.sender_type == "dentist":
            return Dentists.objects.get(id=self.sender_id)
        return None

    def get_receiver(self):
        """Return receiver information."""
        if self.sender_type == "patient":
            return Dentists.objects.get(id=self.dentist_id)
        elif self.sender_type == "dentist":
            return Patients.objects.get(id=self.patient_id)
        return None


class ConsultNotes(models.Model):
    id = models.BigAutoField(primary_key=True)
    consult = models.ForeignKey(Consults, on_delete=models.CASCADE)
    text = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    dentist = models.ForeignKey(Dentists, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"ConsultNote {self.id} for Consult {self.consult_id}"


class Tags(models.Model):
    id = models.BigAutoField(primary_key=True)
    dentist = models.ForeignKey(Dentists, on_delete=models.CASCADE)
    name = models.TextField()
    color = models.TextField()

    def __str__(self):
        return self.name

    def related_patients(self):
        """Returns all patients associated with this tag."""
        return Patients.objects.filter(tags__contains=[self.id])


class Tasks(models.Model):
    id = models.BigAutoField(primary_key=True)
    patient = models.ForeignKey(Patients, on_delete=models.CASCADE)
    dentist = models.ForeignKey(Dentists, on_delete=models.SET_NULL, null=True, blank=True)
    type = models.TextField()
    text = models.TextField(null=True, blank=True)
    due_date = models.DateTimeField()
    done_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Task {self.id} for Patient {self.patient_id}"

    class Meta:
        ordering = ['due_date']  # Order by due date, earli

class RAFile(models.Model):
    id = models.BigAutoField(primary_key=True, editable=False)
    file = models.FileField()  # The actual file stored in the backend
    title = models.CharField(max_length=255, blank=True)  # The descriptive title of the file
    path = models.CharField(max_length=255, blank=True)
    src = models.URLField(blank=True)  # URL for accessing the file
    type = models.CharField(max_length=50, blank=True, null=True)  # MIME type
    message = models.ForeignKey('Messages', on_delete=models.CASCADE, related_name='files', null=True, blank=True)

    def save(self, *args, **kwargs):
        # Automatically set `src` and `title` based on the uploaded file
        if self.file:
            self.title = os.path.splitext(self.file.name)[0]  # Get the file name without the extension
            self.path = os.path.join(settings.MEDIA_ROOT, self.file.name)
            self.src = self.build_absolute_uri(self.file.url)
        super().save(*args, **kwargs)

    def build_absolute_uri(self, relative_url):
        # Construct the absolute URL based on the request
        domain = getattr(settings, 'BACKEND_URL', 'http://localhost:8000')
        return f"{domain}{relative_url}"
