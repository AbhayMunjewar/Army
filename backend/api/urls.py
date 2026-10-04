from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OutpostViewSet, IndentViewSet, ConvoyViewSet,
    log_consumption_view, ai_predict_view, dijkstra_route_view,
    qr_verify_view, audit_logs_view, system_status_view
)

router = DefaultRouter()
router.register(r'outposts', OutpostViewSet, basename='outpost')
router.register(r'indents', IndentViewSet, basename='indent')
router.register(r'convoys', ConvoyViewSet, basename='convoy')

urlpatterns = [
    path('', include(router.urls)),
    path('consumption/log/', log_consumption_view, name='log-consumption'),
    path('predict/', ai_predict_view, name='ai-predict'),
    path('route/optimize/', dijkstra_route_view, name='dijkstra-route'),
    path('qr/verify/', qr_verify_view, name='qr-verify'),
    path('audit/logs/', audit_logs_view, name='audit-logs'),
    path('status/', system_status_view, name='system-status'),
]
