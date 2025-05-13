from flask import Blueprint, jsonify, request
from models import db, BranchSource, SourceType, Branch

branch_source_bp = Blueprint('branch_source', __name__)

@branch_source_bp.route('/branch-source', methods=['POST'])
def create_branch_source():
    data = request.json
    branch_id = data['branchId']
    source_type_id = data['sourceTypeId']
    is_active = data.get('isActive', True)

    # Fetch the branch and get areaId
    branch = Branch.query.get(branch_id)
    if not branch:
        return jsonify({'error': 'Branch not found'}), 404

    area_id = branch.areaId
    if area_id is None:
        return jsonify({'error': 'Branch has no areaId set'}), 400

    new_branch_source = BranchSource(
        branchId=branch_id,
        sourceTypeId=source_type_id,
        areaId=area_id,  # Always set from branch
        isActive=is_active
    )
    db.session.add(new_branch_source)
    db.session.commit()
    return jsonify(new_branch_source.to_dict()), 201