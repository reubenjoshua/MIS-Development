from flask import Blueprint, jsonify
from models import Monthly
from utils.auth import token_required  # Adjust the import path if needed

monthly_bp = Blueprint('monthly', __name__)

@monthly_bp.route('/api/monthly', methods=['GET'])
@token_required
def get_all_monthly(current_user):
    items = Monthly.query.all()
    def monthly_to_dict(m):
        return {
            'id': m.id,
            'branchId': m.branchId,
            'sourceType': m.sourceType,
            'sourceName': m.sourceName,
            'status': m.status,
            'byUser': m.byUser,
            'month': m.month,
            'year': m.year,
            'electricityConsumption': m.electricityConsumption,
            'electricityCost': m.electricityCost,
            'bulkCost': m.bulkCost,
            'bulkOuttake': m.bulkOuttake,
            'bulkProvider': m.bulkProvider,
            'WTPCost': m.WTPCost,
            'WTPSource': m.WTPSource,
            'WTPVolume': m.WTPVolume,
            'disinfectionMode': m.disinfectionMode,
            'disinfectantCost': m.disinfectantCost,
            'disinfectionAmount': m.disinfectionAmount,
            'disinfectionBrandType': m.disinfectionBrandType,
            'otherTreatmentCost': m.otherTreatmentCost,
            'emergencyLitersConsumed': m.emergencyLitersConsumed,
            'emergencyFuelCost': m.emergencyFuelCost,
            'emergencyTotalHoursUsed': m.emergencyTotalHoursUsed,
            'gensetLitersConsumed': m.gensetLitersConsumed,
            'gensetFuelCost': m.gensetFuelCost,
            'isActive': m.isActive,
            'comment': m.comment
        }
    return jsonify([monthly_to_dict(m) for m in items])