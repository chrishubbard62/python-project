from .db import db, add_prefix_for_prod, environment, SCHEMA

class Coffee(db.Model):
  __tablename__ = 'coffees'

  if environment == "production":
      __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
  name = db.Column(db.String(50), nullable=False)
  price = db.Column(db.Float(), nullable=False)
  description = db.Column(db.String(500), nullable=False)
  roast = db.Column(db.String(20), nullable=False)
  region = db.Column(db.String(20), nullable=False)

  owner = db.relationship('User', back_populates='coffees')
  favorites = db.relationship('Favorite', back_populates='coffee')
  coffee_images = db.relationship('CoffeeImage', back_populates='coffee')
  reviews = db.relationship('Review', back_populates='coffee')

  def to_dict_basic(self):
    return {
      "id": self.id,
      "ownerId": self.owner_id,
      "name": self.name,
      "price": self.price,
      "description": self.description,
      "roast": self.roast,
      "region": self.region
    }
