from flask import Blueprint, jsonify, request
from models import User
from utils.auth import token_required  # Adjust the import path if needed

user_bp = Blueprint('user', __name__)

@user_bp.route('/api/user/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    try:
        return jsonify(current_user.to_dict())
    except Exception as e:
        return jsonify({'message': f'Failed to get profile: {str(e)}'}), 500

@user_bp.route('/api/users', methods=['GET'])
@token_required
def get_all_users(current_user):
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])
    except Exception as e:
        return jsonify({'message': f'Failed to get users: {str(e)}'}), 500