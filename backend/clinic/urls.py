from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import auth_views

router = DefaultRouter()
router.register(r'clinics', views.ClinicViewSet)
router.register(r'dentists', views.DentistViewSet)
router.register(r'patients', views.PatientViewSet)
router.register(r'appointments', views.AppointmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('check-availability/', views.check_availability, name='check-availability'),
    path('dashboard-stats/', views.dashboard_stats, name='dashboard-stats'),
    # Auth endpoints
    path('auth/login/', auth_views.login_view, name='auth-login'),
    path('auth/logout/', auth_views.logout_view, name='auth-logout'),
    path('auth/me/', auth_views.me_view, name='auth-me'),
    path('auth/clinics/', auth_views.clinics_list, name='auth-clinics'),
]

