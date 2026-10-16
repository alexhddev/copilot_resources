from typing import Literal

from pydantic import BaseModel


class MenuEntry(BaseModel):
    name: str
    description: str
    imageUrl: str


class OrderItem(BaseModel):
    name: str
    quantity: int


class Order(BaseModel):
    id: str
    sender: str
    status: Literal['RECEIVED', 'DELIVERING', 'DELIVERED', 'CANCELED']
    contents: list[OrderItem]
