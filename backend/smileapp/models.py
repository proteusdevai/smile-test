from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q


class Dentists(models.Model):
    id = models.BigAutoField(primary_key=True)
    first_name = models.TextField()
    last_name = models.TextField()
    email = models.TextField()
    administrator = models.BooleanField()
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL
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
    id = models.BigAutoField(primary_key=True)
    email = models.TextField(null=False, blank=False)
    first_name = models.TextField(null=False, blank=False)
    last_name = models.TextField(null=False, blank=False)
    phone_number = models.TextField(null=True, blank=True)
    smile_goals = models.TextField(null=False, blank=False)
    first_seen = models.DateTimeField(null=True, blank=True)
    last_seen = models.DateTimeField(null=True, blank=True)
    stage = models.TextField(null=False, blank=False)
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
    category = models.TextField(null=False, blank=False)
    description = models.TextField(null=False, blank=False)
    amount = models.BigIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archived_at = models.DateTimeField(null=True, blank=True)
    expected_visit_date = models.DateTimeField(null=True, blank=True)
    index = models.SmallIntegerField(null=True, blank=True)

    def __str__(self):
        return f"Consult {self.id} for Patient {self.patient_id}"


class Messages(models.Model):
    id = models.BigAutoField(primary_key=True)
    patient = models.ForeignKey(Patients, on_delete=models.CASCADE)
    dentist = models.ForeignKey(Dentists, on_delete=models.CASCADE)
    text = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    attachments = ArrayField(models.JSONField(null=True, blank=True), null=True, blank=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=Q(text__isnull=False) | Q(attachments__isnull=False),
                name="text_or_attachments",
            ),
        ]

    def clean(self):
        if not self.text and not self.attachments:
            raise ValidationError("Message must have text or attachments.")

    def __str__(self):
        return f"Message {self.id} between Patient {self.patient_id} and Dentist {self.dentist_id}"

    def has_attachments(self):
        """Checks if the message has any attachments."""
        return bool(self.attachments)


class ConsultNotes(models.Model):
    id = models.BigAutoField(primary_key=True)
    consult = models.ForeignKey(Consults, on_delete=models.CASCADE)
    type = models.TextField(null=True, blank=True)
    text = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    dentist = models.ForeignKey(Dentists, on_delete=models.SET_NULL, null=True, blank=True)
    attachments = ArrayField(models.JSONField(null=True, blank=True), null=True, blank=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=Q(text__isnull=False) | Q(attachments__isnull=False),
                name="text_or_attachments",
            ),
        ]

    def clean(self):
        if not self.text and not self.attachments:
            raise ValidationError("Message must have text or attachments.")

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
    dentist = models.ForeignKey(Dentists, on_delete=models.SET_NULL)
    type = models.TextField()
    text = models.TextField(null=True, blank=True)
    due_date = models.DateTimeField()
    done_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Task {self.id} for Patient {self.patient_id}"

class RAFile(models.Model):
    file = models.FileField(upload_to='/uploads/')  # The actual file stored in the backend
    title = models.CharField(max_length=255)       # The descriptive title of the file
    src = models.URLField()   # URL for accessing the file
    path = models.CharField(max_length=255)  # Storage path
    type = models.CharField(max_length=50, blank=True, null=True)   # MIME type

    def save(self, *args, **kwargs):
        # Automatically set `src` and `path` based on the uploaded file
        if self.file:
            self.path = self.file.name
            self.src = self.file.url
        super().save(*args, **kwargs)
