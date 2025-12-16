

# 💰 Crypto Portfolio Equivalent Calculator API
This is a high-performance Python API built with **FastAPI** and **Pydantic** to calculate the total equivalent value of a cryptocurrency portfolio in a specified fiat currency. It concurrently fetches real-time market quotation data from an external service (Buda.com API) using non-blocking asynchronous I/O.

## 🚀 Architecture and Design Principles
The project is structured according to modern Python and API best practices to ensure high performance, testability, and maintainability:

* **FastAPI & Uvicorn:** Provides an extremely fast, modern API framework utilizing asynchronous capabilities.
* **Pydantic (`app/schemas.py`):** Used for data validation, enforcing the contract for all incoming request payloads and ensuring data integrity.
* **Service Layer (`app/services/portfolio_service.py`):** Separates business logic (calculation, concurrent API calls, error handling) from the HTTP layer.
* **Asynchronous Concurrency:** Utilizes `asyncio.gather` and `httpx.AsyncClient` to perform multiple external API calls simultaneously, significantly reducing latency.
* **Dependency Injection (DI):** Uses FastAPI's built-in `Depends` mechanism to inject the `PortfolioService` into the router, ensuring the application is highly testable without mocking global objects.
* **Custom Error Handling:** Uses a global exception handler (`app/main.py`) to intercept and handle the custom `ExternalApiError` raised by the service, ensuring a clean `500 Internal Server Error` is returned to the client.

## 🛠️ Setup and Installation
### Prerequisites
* Python 3.10+
* `pip` (Python package installer)

### Steps
1. **Move to the api folder:**
```bash
cd api
```
2. **Create and Activate Virtual Environment:**
```bash
python -m venv venv
source venv/bin/activate # Use '.\venv\Scripts\activate' on Windows
```

3. **Install Dependencies:**
```bash
pip install -r api/requirements.txt
```

## 🎯 API Endpoint 
The service exposes a single, high-performance endpoint.

### `POST /`
Calculates the total value of the portfolio based on current market data.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `fiat_currency` | String | Yes | The target fiat currency code (e.g., `USD`, `CLP`). |
| `portfolio` | Object | Yes | A dictionary of cryptocurrency codes (`BTC`, `ETH`) and their quantities (e.g., `1.0`, `5.0`). |

### Request Example (JSON)
```json
POST /
Content-Type: application/json

{
    "fiat_currency": "USD",
    "portfolio": {
        "BTC": 1.0,
        "ETH": 5.0
    }
}

```

### Success Response (Status: 200 OK)
The response is a plain text body containing the total calculated value.

```text
125000.0
```

### Error Responses
| Status Code | Scenario | Body Structure |
| --- | --- | --- |
| **422 Unprocessable Entity** | Validation Failure (e.g., `portfolio` is missing or empty, data type is incorrect). | Standard Pydantic/FastAPI error detail list. |
| **500 Internal Server Error** | External API Failure (e.g., Buda.com API is down or returns an error). | Custom JSON message (handled by the exception handler). |

## ▶️ Running the Application
### Local Development
Use Uvicorn with the `--reload` flag for auto-reloading changes:

```bash
uvicorn app.main:app --reload
```

The API will be available at: `http://127.0.0.1:8000`

## 🧪 Testing
The test suite uses **`pytest`**, **`pytest-asyncio`**, and **`respx`** for reliable, asynchronous, and hermetic testing.

### Running Tests
Run the test suite from the root directory:

```bash
python -m pytest
```

### Key Testing Components
* **Hermetic Testing:** `respx` mocks all external API calls, ensuring tests are fast and do not rely on a live internet connection.
* **DI Testing:** Dependency Injection is leveraged to easily replace the `PortfolioService` with a mock service for isolated testing of the API router.
* **Concurrency Verification:** Tests explicitly assert that all expected API calls are made concurrently (via `respx.calls.call_count`).

