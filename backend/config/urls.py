from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView
)

from smileapp.urls import router
from smileapp.views import SignupView, UpdatePasswordView, UnarchiveConsultView, RAFileView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/patient-signup', SignupView.as_view(), name='patient-signup'),
    path('api/patients/<int:pk>/update_password', UpdatePasswordView.as_view(), name='update-password-signup'),
    path('api/consults/unarchive/', UnarchiveConsultView.as_view(), name='unarchive_consult'),
    path('api/upload/', RAFileView.as_view(), name='file_upload')
]
