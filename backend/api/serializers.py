from rest_framework import serializers
from .models import Outpost, InventoryLog, RequisitionIndent, Convoy, CheckpointScan, AuditLog

class OutpostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outpost
        fields = '__all__'


class InventoryLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryLog
        fields = '__all__'


class RequisitionIndentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequisitionIndent
        fields = '__all__'


class ConvoySerializer(serializers.ModelSerializer):
    cargo_manifest = serializers.SerializerMethodField()
    checkpoints = serializers.SerializerMethodField()

    class Meta:
        model = Convoy
        fields = '__all__'

    def get_cargo_manifest(self, obj):
        return obj.get_cargo()

    def get_checkpoints(self, obj):
        return obj.get_checkpoints()


class CheckpointScanSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckpointScan
        fields = '__all__'


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'
