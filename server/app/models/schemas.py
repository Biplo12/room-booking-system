from marshmallow import Schema, fields

class ConferenceRoomSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    capacity = fields.Int(required=True)
    equipment = fields.Str()

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    role = fields.Enum('user', 'admin', required=True) # 'user' | 'admin'
