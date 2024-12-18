from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField

class Dentists(models.Model):
    id = models.BigAutoField(primary_key=True)
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


class Patients(models.Model):
    id = models.BigAutoField(primary_key=True)
    first_name = models.TextField(null=True, blank=True)
    last_name = models.TextField(null=True, blank=True)
    email = models.TextField(null=True, blank=True)
    phone_number = models.TextField(null=True, blank=True)
    smile_goals = models.TextField(null=True, blank=True)
    first_seen = models.DateTimeField(null=True, blank=True)
    last_seen = models.DateTimeField(null=True, blank=True)
    stage = models.TextField(null=True, blank=True)
    tags = ArrayField(models.BigIntegerField(), null=True, blank=True)
    dentist = models.ForeignKey(Dentists, on_delete=models.CASCADE)  # Exactly one dentist
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"Patient: {self.first_name} {self.last_name}"


class Consults(models.Model):
    id = models.BigAutoField(primary_key=True)
    patient = models.ForeignKey(Patients, on_delete=models.CASCADE)
    category = models.TextField(null=True, blank=True)
    stage = models.TextField()
    description = models.TextField(null=True, blank=True)
    amount = models.BigIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archived_at = models.DateTimeField(null=True, blank=True)
    expected_visit_date = models.DateTimeField(null=True, blank=True)
    dentist = models.ForeignKey(Dentists, on_delete=models.SET_NULL, null=True, blank=True)
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

    def __str__(self):
        return f"Message {self.id} between Patient {self.patient_id} and Dentist {self.dentist_id}"


class ConsultNotes(models.Model):
    id = models.BigAutoField(primary_key=True)
    consult = models.ForeignKey(Consults, on_delete=models.CASCADE)
    type = models.TextField(null=True, blank=True)
    text = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    dentist = models.ForeignKey(Dentists, on_delete=models.SET_NULL, null=True, blank=True)
    attachments = ArrayField(models.JSONField(null=True, blank=True), null=True, blank=True)

    def __str__(self):
        return f"ConsultNote {self.id} for Consult {self.consult_id}"


class Tags(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.TextField()
    color = models.TextField()

    def __str__(self):
        return self.name


class Tasks(models.Model):
    id = models.BigAutoField(primary_key=True)
    patient = models.ForeignKey(Patients, on_delete=models.CASCADE)
    dentist = models.ForeignKey(Dentists, on_delete=models.CASCADE)
    type = models.TextField(null=True, blank=True)
    text = models.TextField(null=True, blank=True)
    due_date = models.DateTimeField()
    done_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Task {self.id} for Patient {self.patient_id}"