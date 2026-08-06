from typing import TypedDict


class MenuItem(TypedDict):
    id: str
    name: str
    category: str
    cuisine: str
    price: int
    rating: float
    dietary_tags: list[str]
    description: str
    available: bool


class Order(TypedDict):
    order_id: str
    item_name: str
    customer_name: str
    customer_email: str
    status: str
    price: int
    estimated_delivery: str
    tracking_id: str


MENU: list[MenuItem] = [
    {
        "id": "D01",
        "name": "Margherita Pizza",
        "category": "main",
        "cuisine": "Italian",
        "price": 299,
        "rating": 4.7,
        "dietary_tags": ["vegetarian"],
        "description": "Thin crust with tomato, mozzarella, and basil",
        "available": True,
    },
    {
        "id": "D02",
        "name": "Vegan Pasta Primavera",
        "category": "main",
        "cuisine": "Italian",
        "price": 349,
        "rating": 4.5,
        "dietary_tags": ["vegan"],
        "description": "Penne with vegetables, olive oil, and garlic",
        "available": True,
    },
    {
        "id": "D03",
        "name": "Butter Chicken",
        "category": "main",
        "cuisine": "Indian",
        "price": 379,
        "rating": 4.9,
        "dietary_tags": ["gluten-free"],
        "description": "Creamy tomato curry with tender chicken",
        "available": True,
    },
    {
        "id": "D04",
        "name": "Vegan Buddha Bowl",
        "category": "main",
        "cuisine": "Fusion",
        "price": 319,
        "rating": 4.6,
        "dietary_tags": ["vegan", "gluten-free"],
        "description": "Quinoa, chickpeas, avocado, greens, and tahini",
        "available": True,
    },
    {
        "id": "D05",
        "name": "Classic Cheeseburger",
        "category": "main",
        "cuisine": "American",
        "price": 259,
        "rating": 4.4,
        "dietary_tags": [],
        "description": "Beef patty, cheddar, lettuce, and tomato",
        "available": True,
    },
    {
        "id": "D06",
        "name": "Paneer Tikka",
        "category": "main",
        "cuisine": "Indian",
        "price": 199,
        "rating": 4.8,
        "dietary_tags": ["vegetarian", "gluten-free"],
        "description": "Tandoor-grilled cottage cheese with peppers",
        "available": True,
    },
    {
        "id": "D07",
        "name": "Aglio e Olio",
        "category": "main",
        "cuisine": "Italian",
        "price": 279,
        "rating": 4.5,
        "dietary_tags": ["vegan"],
        "description": "Spaghetti with garlic, chilli, olive oil, and parsley",
        "available": False,
    },
    {
        "id": "D08",
        "name": "Mango Lassi",
        "category": "drink",
        "cuisine": "Indian",
        "price": 99,
        "rating": 4.7,
        "dietary_tags": ["vegetarian", "gluten-free"],
        "description": "Yogurt with Alphonso mango and cardamom",
        "available": True,
    },
]


ORDERS: dict[str, Order] = {
    "ORD-201": {
        "order_id": "ORD-201",
        "item_name": "Butter Chicken",
        "customer_name": "Priya Nair",
        "customer_email": "priya@example.com",
        "status": "Out for Delivery",
        "price": 379,
        "estimated_delivery": "15 minutes",
        "tracking_id": "SS201TRK",
    },
    "ORD-202": {
        "order_id": "ORD-202",
        "item_name": "Margherita Pizza",
        "customer_name": "Arjun Mehta",
        "customer_email": "arjun@example.com",
        "status": "Placed",
        "price": 299,
        "estimated_delivery": "35 minutes",
        "tracking_id": "SS202TRK",
    },
    "ORD-203": {
        "order_id": "ORD-203",
        "item_name": "Classic Cheeseburger",
        "customer_name": "Sneha Roy",
        "customer_email": "sneha@example.com",
        "status": "Preparing",
        "price": 259,
        "estimated_delivery": "25 minutes",
        "tracking_id": "SS203TRK",
    },
    "ORD-204": {
        "order_id": "ORD-204",
        "item_name": "Vegan Buddha Bowl",
        "customer_name": "Rahul Das",
        "customer_email": "rahul@example.com",
        "status": "Delivered",
        "price": 319,
        "estimated_delivery": "Delivered",
        "tracking_id": "SS204TRK",
    },
    "ORD-205": {
        "order_id": "ORD-205",
        "item_name": "Paneer Tikka",
        "customer_name": "Kavya Sharma",
        "customer_email": "kavya@example.com",
        "status": "Placed",
        "price": 199,
        "estimated_delivery": "40 minutes",
        "tracking_id": "SS205TRK",
    },
}
