# 💰 Crypto Portfolio Equivalent Calculator API
This is a minimal Ruby on Rails 8 API designed to calculate the total equivalent value of a user's cryptocurrency portfolio in a specified fiat currency by concurrently fetching real-time market data from an external service (Buda.com API).

## 🚀 Architecture and Design
The project follows the "Skinny Controller, Fat Service" principle:

* **Controller (`PortfolioController`):** Handles HTTP requests, delegates validation to the Form Object, and delegates business logic to the Service Object.
* **Form Object (`PortfolioForm`):** Encapsulates and validates all incoming data (presence, type, and business rules like non-empty portfolio).
* **Service Object (`PortfolioService`):** Contains the core business logic, including multithreading for concurrent API calls and error handling.

## 🛠️ Setup and Installation
### Prerequisites
* Ruby 3.4+
* Rails 8.0+
* Bundler

### Steps
1. **Move to the api folder:**
```bash
cd api
```
2. **Install Dependencies:**
```bash
bundle install
```
3. **Run the Server:**
```bash
bin/rails s
```

## 🎯 API Endpoint
The service exposes a single endpoint for calculation.

### `POST /`
Calculates the total value of the portfolio based on current market data.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `fiat_currency` | String | Yes | The target fiat currency code (e.g., `USD`, `CLP`). |
| `portfolio` | Object | Yes | A hash where keys are cryptocurrency codes (e.g., `BTC`, `ETH`) and values are the quantities (e.g., `1.0`, `5.0`). |

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

### Response Statuses and Body
| Status Code | Scenario | Response Body (Example) |
| --- | --- | --- |
| **200 OK** | Success | `125000.0` (Plain Text) |
| **400 Bad Request** | Validation Failure | `{"errors":["Portfolio must contain at least one asset."]}` |
| **500 Internal Server Error** | External API Failure | `{"statusCode":500,"message":"Failed to communicate with external service for quotation data.","error":"Internal Server Error"}` |

## 🧪 Testing
The test suite covers validation, successful calculation, concurrency, and external error handling.

To run all tests:

```bash
bundle exec rails test
```

### Key Technical Details
The `PortfolioService` uses Ruby's built-in `Thread` class to perform concurrent HTTP requests to the external API. This implementation is key to ensuring fast calculation for portfolios with multiple assets.


