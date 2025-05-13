from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'User'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    roleId = db.Column(db.Integer, db.ForeignKey('Role.id'))
    areaId = db.Column(db.Integer, db.ForeignKey('Area.id'))
    branchId = db.Column(db.Integer, db.ForeignKey('Branch.id'))
    monthlyEncoded = db.Column(db.Integer)
    dailyEncoded = db.Column(db.Integer)
    userName = db.Column(db.String(64))
    firstName = db.Column(db.String(64))
    lastName = db.Column(db.String(64))
    email = db.Column(db.String(64))
    passwordHash = db.Column(db.String(64))
    isActive = db.Column(db.Boolean)

    def to_dict(self):
        # Import here to avoid circular imports
        from models import Role, Area, Branch
        role = Role.query.get(self.roleId)
        area = Area.query.get(self.areaId)
        branch = Branch.query.get(self.branchId)
        return {
            'id': self.id,
            'roleId': self.roleId,
            'roleName': role.roleName if role else None,
            'areaId': self.areaId,
            'areaName': area.areaName if area else None,
            'branchId': self.branchId,
            'branchName': branch.branchName if branch else None,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'email': self.email,
            'isActive': self.isActive,
            'username': self.userName,
            'monthlyEncoded': self.monthlyEncoded,
            'dailyEncoded': self.dailyEncoded
        }

class Role(db.Model):
    __tablename__ = 'Role'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    roleName = db.Column(db.String(64))
    description = db.Column(db.String(256))

class Area(db.Model):
    __tablename__ = 'Area'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    areaCode = db.Column(db.Integer, nullable=False)
    areaName = db.Column(db.String(64))
    isActive = db.Column(db.Boolean)

class Branch(db.Model):
    __tablename__ = 'Branch'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    areaId = db.Column(db.Integer, db.ForeignKey('Area.id'))
    branchCode = db.Column(db.Integer)
    branchName = db.Column(db.String(64))
    isActive = db.Column(db.Boolean)

class Daily(db.Model):
    __tablename__ = 'Daily'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    monthlyId = db.Column(db.Integer, db.ForeignKey('Monthly.id'))
    sourceType = db.Column(db.String(64))
    sourceName = db.Column(db.String(64))
    status = db.Column(db.String(32))
    byUser = db.Column(db.Integer, db.ForeignKey('User.id'))
    date = db.Column(db.DateTime)
    productionVolume = db.Column(db.Float)
    operationHours = db.Column(db.Float)
    serviceInterruption = db.Column(db.Boolean)
    totalHoursServiceInterruption = db.Column(db.Float)
    electricityConsumption = db.Column(db.Float)
    VFDFrequency = db.Column(db.Float)
    spotFlow = db.Column(db.Float)
    spotPressure = db.Column(db.Float)
    timeSpotMeasurements = db.Column(db.DateTime)
    lineVoltage1 = db.Column(db.Float)
    lineVoltage2 = db.Column(db.Float)
    lineVoltage3 = db.Column(db.Float)
    lineCurrent1 = db.Column(db.Float)
    lineCurrent2 = db.Column(db.Float)
    lineCurrent3 = db.Column(db.Float)
    comment = db.Column(db.String(512))
    isActive = db.Column(db.Boolean)

class Monthly(db.Model):
    __tablename__ = 'Monthly'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    branchId = db.Column(db.Integer, db.ForeignKey('Branch.id'))
    sourceType = db.Column(db.Integer, db.ForeignKey('sourceType.id'))
    sourceName = db.Column(db.Integer)
    status = db.Column(db.Integer, db.ForeignKey('Status.id'))
    byUser = db.Column(db.Integer)
    month = db.Column(db.String(32))
    year = db.Column(db.Integer)
    electricityConsumption = db.Column(db.Float)
    electricityCost = db.Column(db.Float)
    bulkCost = db.Column(db.Float)
    bulkOuttake = db.Column(db.Float)
    bulkProvider = db.Column(db.Float)
    WTPCost = db.Column(db.Float)
    WTPSource = db.Column(db.Float)
    WTPVolume = db.Column(db.Float)
    disinfectionMode = db.Column(db.String(128))
    disinfectantCost = db.Column(db.Float)
    disinfectionAmount = db.Column(db.Float)
    disinfectionBrandType = db.Column(db.String(128))
    otherTreatmentCost = db.Column(db.Float)
    emergencyLitersConsumed = db.Column(db.Float)
    emergencyFuelCost = db.Column(db.Float)
    emergencyTotalHoursUsed = db.Column(db.Float)
    gensetLitersConsumed = db.Column(db.Float)
    gensetFuelCost = db.Column(db.Float)
    isActive = db.Column(db.Boolean)
    comment = db.Column(db.String(1024))

class SourceType(db.Model):
    __tablename__ = 'sourceType'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    branchId = db.Column(db.Integer, db.ForeignKey('Branch.id'))
    sourceType = db.Column(db.String(64))
    isActive = db.Column(db.Boolean)

    def to_dict(self):
        return {
            'id': self.id,
            'branchId': self.branchId,
            'sourceType': self.sourceType,
            'isActive': self.isActive
        }

class SourceName(db.Model):
    __tablename__ = 'sourceName'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    branchId = db.Column(db.Integer, db.ForeignKey('Branch.id'))
    sourceTypeId = db.Column(db.Integer, db.ForeignKey('sourceType.id'))
    sourceName = db.Column(db.String(64))
    isActive = db.Column(db.Boolean)

    def to_dict(self):
        return {
            'id': self.id,
            'branchId': self.branchId,
            'sourceTypeId': self.sourceTypeId,
            'sourceName': self.sourceName,
            'isActive': self.isActive
        }

class Status(db.Model):
    __tablename__ = 'Status'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    statusName = db.Column(db.String(16))

    def to_dict(self):
        return {
            'id': self.id,
            'statusName': self.statusName
        }


class BranchSource(db.Model):
    __tablename__ = 'branchSource'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    branchId = db.Column(db.Integer, db.ForeignKey('Branch.id'))
    sourceTypeId = db.Column(db.Integer, db.ForeignKey('sourceType.id'))
    isActive = db.Column(db.Boolean, default=True)
    areaId = db.Column(db.Integer, db.ForeignKey('Area.id'))
    area = db.relationship('Area')
    branch = db.relationship('Branch', backref='branch_sources')
    source_type = db.relationship('SourceType', backref='branch_sources')

    def to_dict(self):
        return {
            'id': self.id,
            'branchId': self.branchId,
            'sourceTypeId': self.sourceTypeId,
            'isActive': self.isActive,
            'branchName': self.branch.branchName if self.branch else None,
            'sourceType': self.source_type.sourceType if self.source_type else None,
            'areaId': self.areaId,
            'areaName': self.area.areaName if self.area else None
        }

class BranchSourceName(db.Model):
    __tablename__ = 'branchSourceName'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    branchId = db.Column(db.Integer, db.ForeignKey('Branch.id'))
    sourceNameId = db.Column(db.Integer, db.ForeignKey('sourceName.id'))
    isActive = db.Column(db.Boolean, default=True)
    areaId = db.Column(db.Integer, db.ForeignKey('Area.id'), nullable=False)
    area = db.relationship('Area')
    branch = db.relationship('Branch', backref='branch_source_names')
    source_name = db.relationship('SourceName', backref='branch_source_names')

    def to_dict(self):
        return {
            'id': self.id,
            'branchId': self.branchId,
            'sourceNameId': self.sourceNameId,
            'isActive': self.isActive,
            'branchName': self.branch.branchName if self.branch else None,
            'sourceName': self.source_name.sourceName if self.source_name else None,
            'areaId': self.areaId,
            'areaName': self.area.areaName if self.area else None
        }