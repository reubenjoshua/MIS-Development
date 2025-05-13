from flask import Blueprint, jsonify, request
from models import db, Branch, BranchSourceName, SourceName, SourceType

branch_source_name_bp = Blueprint('branch_source_name', __name__)

@branch_source_name_bp.route('/api/branch/<int:branch_id>/source-names', methods=['GET'])
def get_branch_source_names(branch_id):
    source_type_id = request.args.get('sourceTypeId', type=int)
    area_id = request.args.get('areaId', type=int)  # <-- get areaId from query params

    query = (
        db.session.query(SourceName, SourceType)
        .join(BranchSourceName, BranchSourceName.sourceNameId == SourceName.id)
        .join(SourceType, SourceName.sourceTypeId == SourceType.id)
        .filter(BranchSourceName.branchId == branch_id)
    )
    if source_type_id:
        query = query.filter(SourceName.sourceTypeId == source_type_id)
    if area_id:
        query = query.filter(BranchSourceName.areaId == area_id)  # <-- filter by areaId

    results = query.all()
    print(f"Results for branch {branch_id}, area {area_id}: {results}")  # Debug print
    response = [
        {
            **sn.to_dict(),
            "sourceTypeName": st.sourceType
        }
        for sn, st in results
    ]
    print(f"Response: {response}")  # Debug print
    return jsonify(response)

@branch_source_name_bp.route('/api/branch-source-name', methods=['POST'])
def create_branch_source_name():
    data = request.json
    branch_id = data['branchId']
    source_name_id = data['sourceNameId']
    is_active = data.get('isActive', True)

    # Fetch the branch to get areaId
    branch = Branch.query.get(branch_id)
    if not branch:
        return jsonify({'error': 'Branch not found'}), 404

    area_id = branch.areaId
    if area_id is None:
        return jsonify({'error': 'Branch has no areaId set'}), 400

    new_bsn = BranchSourceName(
        branchId=branch_id,
        sourceNameId=source_name_id,
        areaId=area_id,  # <-- always set from branch
        isActive=is_active
    )
    db.session.add(new_bsn)
    db.session.commit()
    return jsonify(new_bsn.to_dict()), 201


