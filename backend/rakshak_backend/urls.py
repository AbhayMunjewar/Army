from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def root_status(request):
    return JsonResponse({
        "system": "VEERSETU High-Altitude Logistics Intelligence API",
        "status": "ONLINE",
        "version": "1.0.0",
        "api_endpoints": "/api/status/"
    })

urlpatterns = [
    path('', root_status),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
