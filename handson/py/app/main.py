import base64
import json

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from .database import add_order, daily_menu, find_order_by_id, update_order_by_id
from .model import OrderItem

# Token payload: base64({"role":"admin"})
HARDCODED_TOKEN = "eyJyb2xlIjoiYWRtaW4ifQ=="

USERS = [{"username": "user", "password": "pass"}]

VALID_STATUSES = {"RECEIVED", "DELIVERING", "DELIVERED", "CANCELED"}

app = FastAPI(title="Awesome Pizza API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content=exc.detail)


def extract_bearer_token(request: Request) -> str | None:
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    return auth_header[len("Bearer "):]


def require_token(request: Request) -> None:
    token = extract_bearer_token(request)
    if not token or token != HARDCODED_TOKEN:
        raise HTTPException(401, {"success": False, "error": "Unauthorized", "message": "Valid token required"})


class CreateOrderRequest(BaseModel):
    sender: str
    contents: list[OrderItem]


class UpdateOrderRequest(BaseModel):
    sender: str | None = None
    status: str | None = None
    contents: list[OrderItem] | None = None


class LoginRequest(BaseModel):
    username: str
    password: str


@app.get("/api/daily-menu")
def get_daily_menu():
    return {"success": True, "data": daily_menu, "message": "Daily menu retrieved successfully"}


@app.get("/api/orders/{order_id}")
def get_order(order_id: str):
    order = find_order_by_id(order_id)
    if order is None:
        raise HTTPException(404, {"success": False, "error": "Not found", "message": f"Order with ID '{order_id}' not found"})
    return {"success": True, "data": order, "message": "Order retrieved successfully"}


@app.post("/api/orders", status_code=201)
def create_order(payload: CreateOrderRequest):
    if not payload.sender.strip():
        raise HTTPException(400, {"success": False, "error": "Bad request", "message": "Order sender is required and must be a non-empty string"})
    if not payload.contents:
        raise HTTPException(400, {"success": False, "error": "Bad request", "message": "Order contents are required and must be a non-empty array"})

    new_order = add_order(payload.sender.strip(), payload.contents)
    return {"success": True, "data": new_order, "message": "Order created successfully"}


@app.put("/api/orders/{order_id}")
def update_order(order_id: str, payload: UpdateOrderRequest):
    existing = find_order_by_id(order_id)
    if existing is None:
        raise HTTPException(404, {"success": False, "error": "Not found", "message": f"Order with ID '{order_id}' not found"})

    updates = {}

    if payload.sender is not None:
        if not payload.sender.strip():
            raise HTTPException(400, {"success": False, "error": "Bad request", "message": "Order sender must be a non-empty string"})
        updates["sender"] = payload.sender.strip()

    if payload.status is not None:
        if payload.status not in VALID_STATUSES:
            raise HTTPException(400, {"success": False, "error": "Bad request", "message": f"Status must be one of: {', '.join(sorted(VALID_STATUSES))}"})
        updates["status"] = payload.status

    if payload.contents is not None:
        if not payload.contents:
            raise HTTPException(400, {"success": False, "error": "Bad request", "message": "Order contents must be a non-empty array"})
        updates["contents"] = payload.contents

    updated_order = update_order_by_id(order_id, updates)
    return {"success": True, "data": updated_order, "message": "Order updated successfully"}


@app.post("/api/login")
def login(payload: LoginRequest):
    match = next((u for u in USERS if u["username"] == payload.username and u["password"] == payload.password), None)
    if match is None:
        raise HTTPException(401, {"success": False, "error": "Invalid credentials"})
    return {"success": True, "token": HARDCODED_TOKEN}


@app.get("/api/protected")
def protected(request: Request):
    require_token(request)
    return {
        "success": True,
        "message": "Access granted",
        "data": {
            "secretRecipes": ["Margherita Supreme", "Dragon Pepperoni", "Black Truffle Delight"],
            "staffDiscount": "50% off all pizzas",
            "vipCode": "PIZZA-VIP-2024",
            "deliveryNote": "Drivers use entrance B",
        },
    }


@app.get("/api/admin")
def admin(request: Request):
    token = extract_bearer_token(request)
    if not token:
        raise HTTPException(401, {"success": False, "error": "Unauthorized", "message": "Token required"})

    try:
        payload = json.loads(base64.b64decode(token).decode("utf-8"))
    except Exception:
        raise HTTPException(401, {"success": False, "error": "Unauthorized", "message": "Invalid token format"})

    if payload.get("role") == "admin":
        return {"success": True, "message": "Welcome, admin!"}
    raise HTTPException(403, {"success": False, "error": "Forbidden", "message": "Not authorised"})
