from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class ResetPasswordView(APIView):
    """
    A view to handle user password reset.
    """
    permission_classes = [AllowAny]

    def patch(self, request, *args, **kwargs):
        user_id = request.data.get('id')
        new_password = request.data.get('password')

        # Validate required fields
        if not user_id or not new_password:
            return Response(
                {"error": "Both 'id' and 'password' are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Retrieve user by ID
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Validate the new password
        try:
            validate_password(new_password, user=user)
        except ValidationError as e:
            return Response(
                {"error": e.messages},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update the password securely
        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password reset successful."},
            status=status.HTTP_200_OK,
        )


class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        user_id = request.data.get('id')
        data = request.data

        if user_id == 'me':
            user_id = request.user.id  # Resolve 'me' to the logged-in user's ID

        if not user_id or not data:
            return Response(
                {"error": "Both 'id' and 'data' are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Fetch the user by ID
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        # Update fields
        user.email = data.get('email', user.email)
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.save()

        return Response({'message': 'User updated successfully.'})
