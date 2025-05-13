from flask import Blueprint, jsonify
from models import Daily
from utils.auth import token_required  # Adjust the import path if needed

daily_bp = Blueprint('daily', __name__)

@daily_bp.route('/api/daily', methods=['GET'])
@token_required
def get_all_daily(current_user):
    daily_reports = Daily.query.all()
    return jsonify([{
        'id': report.id,
        'monthlyId': report.monthlyId,
        'sourceType': report.sourceType,
        'sourceName': report.sourceName,
        'status': report.status,
        'byUser': report.byUser,
        'date': report.date,
        'productionVolume': report.productionVolume,
        'operationHours': report.operationHours,
        'serviceInterruption': report.serviceInterruption,
        'totalHoursServiceInterruption': report.totalHoursServiceInterruption,
        'electricityConsumption': report.electricityConsumption,
        'VFDFrequency': report.VFDFrequency,
        'spotFlow': report.spotFlow,
        'spotPressure': report.spotPressure,
        'timeSpotMeasurements': report.timeSpotMeasurements,
        'lineVoltage1': report.lineVoltage1,
        'lineVoltage2': report.lineVoltage2,
        'lineVoltage3': report.lineVoltage3,
        'lineCurrent1': report.lineCurrent1,
        'lineCurrent2': report.lineCurrent2,
        'lineCurrent3': report.lineCurrent3,
        'comment': report.comment,
        'isActive': report.isActive
    } for report in daily_reports])