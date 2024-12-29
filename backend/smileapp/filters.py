import django_filters
from django_filters import rest_framework as filters

from .models import Dentists, Patients, Consults, Messages, ConsultNotes, Tags, Tasks


class DentistsFilter(filters.FilterSet):
    first_name = django_filters.CharFilter(field_name="first_name", lookup_expr="icontains")
    last_name = django_filters.CharFilter(field_name="last_name", lookup_expr="icontains")
    email = django_filters.CharFilter(field_name="email", lookup_expr="icontains")
    administrator = django_filters.BooleanFilter(field_name="administrator")

    class Meta:
        model = Dentists
        fields = ["first_name", "last_name", "email", "administrator"]


class PatientsFilter(filters.FilterSet):
    first_name = django_filters.CharFilter(field_name="first_name", lookup_expr="icontains")
    last_name = django_filters.CharFilter(field_name="last_name", lookup_expr="icontains")
    email = django_filters.CharFilter(field_name="email", lookup_expr="icontains")
    stage = django_filters.CharFilter(field_name="stage", lookup_expr="icontains")
    dentist = django_filters.NumberFilter(field_name="dentist_id")

    class Meta:
        model = Patients
        fields = ["first_name", "last_name", "email", "stage", "dentist"]


class ConsultsFilter(filters.FilterSet):
    stage = django_filters.CharFilter(field_name="stage", lookup_expr="icontains")
    category = django_filters.CharFilter(field_name="category", lookup_expr="icontains")
    patient = django_filters.NumberFilter(field_name="patient_id")
    dentist = django_filters.NumberFilter(field_name="dentist_id")
    created_after = django_filters.DateTimeFilter(field_name="created_at", lookup_expr="gte")
    created_before = django_filters.DateTimeFilter(field_name="created_at", lookup_expr="lte")

    class Meta:
        model = Consults
        fields = ["stage", "category", "patient", "dentist"]


class MessagesFilter(filters.FilterSet):
    text = django_filters.CharFilter(field_name="text", lookup_expr="icontains")
    patient = django_filters.NumberFilter(field_name="patient_id")
    dentist = django_filters.NumberFilter(field_name="dentist_id")
    date_after = django_filters.DateTimeFilter(field_name="date", lookup_expr="gte")
    date_before = django_filters.DateTimeFilter(field_name="date", lookup_expr="lte")

    class Meta:
        model = Messages
        fields = ["patient", "dentist", "text"]


class ConsultNotesFilter(filters.FilterSet):
    consult = django_filters.NumberFilter(field_name="consult_id")
    type = django_filters.CharFilter(field_name="type", lookup_expr="icontains")
    text = django_filters.CharFilter(field_name="text", lookup_expr="icontains")
    date_after = django_filters.DateTimeFilter(field_name="date", lookup_expr="gte")
    date_before = django_filters.DateTimeFilter(field_name="date", lookup_expr="lte")

    class Meta:
        model = ConsultNotes
        fields = ["consult", "type", "text"]


class TagsFilter(filters.FilterSet):
    name = django_filters.CharFilter(field_name="name", lookup_expr="icontains")
    color = django_filters.CharFilter(field_name="color", lookup_expr="icontains")

    class Meta:
        model = Tags
        fields = ["name", "color"]


class TasksFilter(filters.FilterSet):
    patient = django_filters.NumberFilter(field_name="patient_id")
    dentist = django_filters.NumberFilter(field_name="dentist_id")
    type = django_filters.CharFilter(field_name="type", lookup_expr="icontains")
    text = django_filters.CharFilter(field_name="text", lookup_expr="icontains")
    due_after = django_filters.DateTimeFilter(field_name="due_date", lookup_expr="gte")
    due_before = django_filters.DateTimeFilter(field_name="due_date", lookup_expr="lte")

    class Meta:
        model = Tasks
        fields = ["patient", "dentist", "type", "text"]
