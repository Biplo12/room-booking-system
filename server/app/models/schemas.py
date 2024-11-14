from enum import Enum
from marshmallow import Schema, fields

class RoleEnum(Enum):
    USER = 'user'
    ADMIN = 'admin'

class ConferenceRoomSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    capacity = fields.Int(required=True)
    equipment = fields.Str()

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    role = fields.Enum(RoleEnum, required=True) # 'user' | 'admin'
