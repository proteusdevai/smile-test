import os

from django.db import connections
from django.db.utils import OperationalError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthCheckView(APIView):
    """
    A health check view that verifies the status of the application.
    Includes checks for:
    - Database connectivity
    - Required environment variables
    """

    def get(self, request, *args, **kwargs):
        health_status = {
            "database": False,
            "environment": False,
            "status": "unhealthy",
        }
        print('Received a healthcheck request')
        # Check Database Connectivity
        try:
            db_conn = connections['default']
            db_conn.cursor()
            health_status["database"] = True
        except OperationalError:
            health_status["database"] = False

        # Check Required Environment Variables
        required_env_vars = ["SECRET_KEY", "DEBUG", "DATABASE_URL"]
        missing_env_vars = [
            var for var in required_env_vars if not os.getenv(var)
        ]

        if not missing_env_vars:
            health_status["environment"] = True

        # Overall Status
        if health_status["database"] and health_status["environment"]:
            health_status["status"] = "healthy"
            return Response(health_status, status=status.HTTP_200_OK)
        else:
            health_status["missing_environment_variables"] = missing_env_vars
            return Response(health_status, status=status.HTTP_503_SERVICE_UNAVAILABLE)
