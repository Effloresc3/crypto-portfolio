## 🚀 Crypto Portfolio Equivalent Value API

This is a high-performance backend service built with **NestJS** (Node.js) to calculate the real-time fiat equivalent value of a user's cryptocurrency portfolio. It integrates with an external exchange API (Buda.com) using the advanced `/quotations` endpoint for precise, slippage-and-fee-adjusted valuations.

### ✨ Features

* **Real-time Valuation:** Uses the exchange's real-time quotation endpoint (POST) for the most accurate pricing, reflecting market depth and transaction fees.
* **Performance:** Utilizes `Promise.all` in the service layer to concurrently fetch quotations for all assets in a portfolio, maximizing throughput.
* **Robust Error Handling:** Employs a dedicated NestJS Interceptor to cleanly catch external API errors (`axios` exceptions) and transform them into standardized HTTP 500 responses.
* **Data Validation (DTOs):** Uses `class-validator` and `class-transformer` for strict input validation and automatic transformation of snake\_case fields (`fiat_currency`) to camelCase (`fiatCurrency`).
* **Testing:** Comprehensive unit covering service business logic and controller routing.

### 🏗️ Architecture

The project follows a standard NestJS modular architecture:

* **`main.ts`**: Global setup, enabling the `ValidationPipe`.
* **`AppModule`**: Registers the `PortfolioModule`.
* **`PortfolioModule`**:
    * **`PortfolioController`**: Handles the POST request to `/`. Uses the custom `AxiosExceptionInterceptor`.
    * **`PortfolioService`**: Contains the core business logic, executing concurrent `axios.post` calls to the external API and performing the total summation using `Array.reduce`.
* **`common/interceptors/`**: Houses the custom `AxiosExceptionInterceptor` to centralize external error handling.

### ⚙️ Technologies

* **Framework:** NestJS (Node.js)
* **Language:** TypeScript
* **HTTP Client:** Axios
* **Validation:** `class-validator` and `class-transformer`
* **Testing:** Jest, Supertest

### 📦 Setup and Installation

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/Effloresc3/crypto-portfolio.git
    cd crypto-portfolio/api
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

### 🏃 Running the Application

To run the application in development mode with live-reloading:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

### 🧪 Testing

The project includes unit tests for the service logic.

* **Run all tests:**
  ```bash
  npm run test
  ```
* **Run tests with coverage report:**
  ```bash
  npm run test:cov
  ```

### API Endpoint

The API exposes a single endpoint for portfolio valuation.

#### **POST /**

Calculates the total fiat equivalent value of a given portfolio.

* **Method:** `POST`
* **URL:** `http://localhost:3000/`
* **Headers:** `Content-Type: application/json`

| Field | Type | Description |
| :--- | :--- | :--- |
| `portfolio` | `Record<string, number>` | A key/value map of assets and quantities (e.g., `{"BTC": 0.5, "ETH": 10}`). |
| `fiat_currency` | `string` | The target currency code (e.g., `"CLP"`, `"USD"`). |

**Example Request:**

```json
{
    "portfolio": {
        "BTC": 0.5,
        "ETH": 2.0,
        "LTC": 5.0
    },
    "fiat_currency": "CLP"
}
```

**Example Successful Response (200 OK):**

The response body is a plain number representing the total fiat value.

```
4872696.01
```

**Example Error Response (500 Internal Server Error):**

Occurs if the external exchange API fails or returns an invalid status.

```json
{
    "statusCode": 500,
    "message": "Failed to communicate with external service for quotation data.",
    "error": "Internal Server Error"
}
```