from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from smileapp.filters import PatientsFilter
from smileapp.models import Patients, Dentists
from smileapp.permissions import IsDentist, IsOwnerDentistOfResource
from smileapp.serializers import PatientsSerializer, PatientsSignupSerializer
from utils import get_user_dentist


class PatientsViewSet(viewsets.ModelViewSet):
    """Only the logged-in dentist can view their own patients."""
    serializer_class = PatientsSerializer
    permission_classes = [IsAuthenticated, IsDentist, IsOwnerDentistOfResource]
    filter_backends = [DjangoFilterBackend]
    filterset_class = PatientsFilter

    def get_queryset(self):
        dentist = get_user_dentist(self.request.user)
        return Patients.objects.filter(dentist=dentist)


class SignupView(APIView):
    """
    View to handle patient signup. Creates a User and a Patient.
    """
    permission_classes = [AllowAny]  # Allows access to unauthenticated users

    def post(self, request):
        """
        Handles POST requests to register a new patient.
        """
        serializer = PatientsSignupSerializer(data=request.data)

        # Validate the incoming data
        if serializer.is_valid():
            # Extract validated data
            validated_data = serializer.validated_data
            email = validated_data.get('email')
            password = validated_data.get('password')
            first_name = validated_data.get('first_name')
            last_name = validated_data.get('last_name')
            phone_number = validated_data.get('phone_number')
            smile_goals = validated_data.get('smile_goals')
            dentist_id = validated_data.get('dentist_id')  # Dentist ID must be provided

            # Ensure the dentist exists
            dentist = get_object_or_404(Dentists, id=dentist_id)

            # Create a new User object
            try:
                user = User.objects.create_user(
                    username=email,  # Use email as the username
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name
                )
            except Exception as e:
                raise ValidationError(f"Error creating user: {str(e)}")

            # Create a new Patient object
            patient = Patients.objects.create(
                user=user,
                dentist=dentist,
                email=email,
                first_name=first_name,
                last_name=last_name,
                phone_number=phone_number,
                smile_goals=smile_goals,
                stage="Opportunity",
            )

            # Generate JWT tokens for the user
            refresh = RefreshToken.for_user(user)
            tokens = {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }

            # Return a success response with tokens
            return Response(
                {
                    "message": "Signup successful",
                    "patient_id": patient.id,
                    "tokens": tokens,
                },
                status=status.HTTP_201_CREATED
            )

        # If the data is invalid, return errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdatePasswordView(APIView):
    def patch(self, request, pk):
        try:
            patient = Patients.objects.get(pk=pk)
            patient.set_password(request.data['password'])
            patient.save()
            return Response({"status": "Password updated"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
