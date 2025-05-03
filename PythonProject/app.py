from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import jwt
from functools import wraps
import pyodbc

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-jwt-secret-key-here')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Initialize SQLAlchemy
db = SQLAlchemy(app)


# Test database connection
@app.route('/test-db')
def test_db():
    try:
        # Try to connect to the database
        db.session.execute('SELECT 1')
        return jsonify({
            'status': 'success',
            'message': 'Database connection successful'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Database connection failed: {str(e)}'
        }), 500


# Models
class User(db.Model):
    __tablename__ = 'User'

    id = db.Column(db.Integer, primary_key=True, autoincrement=False)
    roleId = db.Column(db.Integer, db.ForeignKey('Role.id'), nullable=False)
    areaId = db.Column(db.Integer, db.ForeignKey('Area.id'), nullable=False)
    branchId = db.Column(db.Integer, db.ForeignKey('Branch.id'), nullable=False)
    monthlyEncoded = db.Column(db.Integer, nullable=False)
    dailyEncoded = db.Column(db.Integer, nullable=False)
    userName = db.Column(db.String(64))
    firstName = db.Column(db.String(64))
    lastName = db.Column(db.String(64))
    email = db.Column(db.String(128))
    passwordHash = db.Column(db.String(64))
    isActive = db.Column(db.Boolean)

    def to_dict(self):
        return {
            'id': self.id,
            'roleId': self.roleId,
            'areaId': self.areaId,
            'branchId': self.branchId,
            'monthlyEncoded': self.monthlyEncoded,
            'dailyEncoded': self.dailyEncoded,
            'userName': self.userName,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'email': self.email,
            'isActive': self.isActive
        }


class Role(db.Model):
    __tablename__ = 'Role'

    id = db.Column(db.Integer, primary_key=True, autoincrement=False)
    roleName = db.Column(db.String(64))
    description = db.Column(db.String(256))


class Area(db.Model):
    __tablename__ = 'Area'

    id = db.Column(db.Integer, primary_key=True, autoincrement=False)
    areaCode = db.Column(db.Integer, nullable=False)
    areaName = db.Column(db.String(64))
    description = db.Column(db.String(256))
    isActive = db.Column(db.Boolean)


class Branch(db.Model):
    __tablename__ = 'Branch'

    id = db.Column(db.Integer, primary_key=True, autoincrement=False)
    areaId = db.Column(db.Integer, db.ForeignKey('Area.id'))
    branchCode = db.Column(db.Integer)
    branchName = db.Column(db.String(64))
    isActive = db.Column(db.Boolean)


# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'User not found'}), 401
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)

    return decorated


# Routes
@app.route('/')
def home():
    return jsonify({
        "message": "Welcome to the API",
        "version": "1.0.0",
        "endpoints": {
            "test_db": "/test-db",
            "login": "/api/auth/login",
            "profile": "/api/user/profile",
            "users": "/users",
            "areas": "/areas",
            "branches": "/branches",
            "roles": "/roles",
            "daily_reports": "/daily-reports"
        }
    })


# Auth routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        if not data or not data.get('username') or not data.get('password'):
            return jsonify({'message': 'Missing username or password'}), 400

        user = User.query.filter_by(userName=data['username']).first()

        if not user or not user.passwordHash == data['password']:  # In production, use proper password hashing!
            return jsonify({'message': 'Invalid username or password'}), 401

        if not user.isActive:
            return jsonify({'message': 'Account is inactive'}), 401

        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + app.config['JWT_ACCESS_TOKEN_EXPIRES']
        }, app.config['JWT_SECRET_KEY'])

        return jsonify({
            'token': token,
            'user': user.to_dict()
        })
    except Exception as e:
        return jsonify({'message': f'Login failed: {str(e)}'}), 500


# User routes
@app.route('/api/user/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    try:
        return jsonify(current_user.to_dict())
    except Exception as e:
        return jsonify({'message': f'Failed to get profile: {str(e)}'}), 500


@app.route('/users', methods=['GET'])
@token_required
def get_all_users(current_user):
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])
    except Exception as e:
        return jsonify({'message': f'Failed to get users: {str(e)}'}), 500


# Area routes
@app.route('/areas', methods=['GET'])
@token_required
def get_all_areas(current_user):
    try:
        areas = Area.query.filter_by(isActive=True).all()
        return jsonify([{
            'id': area.id,
            'areaCode': area.areaCode,
            'areaName': area.areaName,
            'description': area.description,
            'isActive': area.isActive
        } for area in areas])
    except Exception as e:
        return jsonify({'message': f'Failed to get areas: {str(e)}'}), 500


# Branch routes
@app.route('/branches', methods=['GET'])
@token_required
def get_all_branches(current_user):
    try:
        branches = Branch.query.filter_by(isActive=True).all()
        return jsonify([{
            'id': branch.id,
            'areaId': branch.areaId,
            'branchCode': branch.branchCode,
            'branchName': branch.branchName,
            'isActive': branch.isActive
        } for branch in branches])
    except Exception as e:
        return jsonify({'message': f'Failed to get branches: {str(e)}'}), 500


@app.route('/roles', methods=['GET'])
@token_required
def get_all_roles(current_user):
    try:
        roles = Role.query.all()
        return jsonify([{
            'id': role.id,
            'roleName': role.roleName,
            'description': role.description
        } for role in roles])
    except Exception as e:
        return jsonify({'message': f'Failed to get roles: {str(e)}'}), 500


@app.route('/daily-reports', methods=['GET'])
@token_required
def get_daily_reports(current_user):
    try:
        # Mock daily reports data
        return jsonify({
            'message': 'Daily reports retrieved successfully',
            'data': [
                {
                    'id': 1,
                    'date': datetime.now().strftime('%Y-%m-%d'),
                    'area': 'JV',
                    'branch': 'Lipa',
                    'status': 'Completed'
                }
            ]
        })
    except Exception as e:
        return jsonify({'message': f'Failed to get daily reports: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(debug=True)