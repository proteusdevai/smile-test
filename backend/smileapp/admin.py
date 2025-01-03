from django.contrib import admin
from .models import Messages, Patients, ConsultNotes, Consults, Dentists, Tags, Tasks, RAFile

admin.site.register(Messages)
admin.site.register(Patients)
admin.site.register(ConsultNotes)
admin.site.register(Consults)
admin.site.register(Dentists)
admin.site.register(Tags)
admin.site.register(Tasks)
admin.site.register(RAFile)
