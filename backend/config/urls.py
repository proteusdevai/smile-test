from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView
)
from django.http import HttpResponse
from django.conf.urls.static import static
from .settings import MEDIA_ROOT, STATIC_ROOT
from smileapp.urls import router
from smileapp.views import PatientSignUpView, UpdatePasswordView, UnarchiveConsultView, RAFileView, ResetPasswordView
from smileapp.views.health_check import HealthCheckView
from smileapp.views.user_views import UpdateUserView
from django.conf import settings


def home_view(request):
    return HttpResponse("Welcome to the Smile App!")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/patient-signup/', PatientSignUpView.as_view(), name='patient-signup'),
    path('api/patients/<int:pk>/update_password/', UpdatePasswordView.as_view(), name='update-password-signup'),
    path('api/consults/unarchive/', UnarchiveConsultView.as_view(), name='unarchive_consult'),
    path('api/upload/', RAFileView.as_view(), name='file_upload'),
    path('api/health-check/', HealthCheckView.as_view(), name='health-check'),
    path('api/reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('api/update-user/', UpdateUserView.as_view(), name='update-user'),
path('', home_view),  # Add this line
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
