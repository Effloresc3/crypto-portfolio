# 💰 Crypto Portfolio Equivalent Calculator
This repository contains implementations of a high-performance API designed to calculate the total equivalent value of a cryptocurrency portfolio in a specified fiat currency by concurrently fetching real-time market data.

**🚀 Deployed API:** [https://crypto-portfolio-4g1j.onrender.com/](https://crypto-portfolio-4g1j.onrender.com/)  
*(Note: This is a POST-only endpoint. The instance may be asleep and could take a few moments to boot up on the first request.)*

The project is implemented across multiple languages to demonstrate different architectural patterns and technologies suitable for I/O-bound tasks involving external API calls.

## 🗂️ Implementations by Branch
To view the source code, setup instructions, and specific architecture details for a particular implementation, please check out the corresponding branch:

| Language | Branch                                                                         | Framework/Technology | Architecture Focus |
| --- |--------------------------------------------------------------------------------| --- | --- |
| **Ruby** | [`ruby`](https://github.com/Effloresc3/crypto-portfolio/tree/ruby)             | Ruby on Rails (API Mode) | Skinny Controller, Fat Service, Minitest/RSpec |
| **Python** | [`python`](https://github.com/Effloresc3/crypto-portfolio/tree/python)         | FastAPI, Pydantic, Uvicorn | Asynchronous I/O (`asyncio`), Dependency Injection |
| **TypeScript** | [`typescript`](https://github.com/Effloresc3/crypto-portfolio/tree/typescript) | Node.js, Express.js (or similar), TypeScript | Promises/Async/Await, Type Enforcement, Service Layering |

## 💡 Core Functionality
The primary goal of every implementation is to serve a single, fast API endpoint:

### `POST /`
Calculates the total value by fetching quotes for each asset concurrently.

| Parameter | Type | Description |
| --- | --- | --- |
| `fiat_currency` | String | The target fiat currency code (e.g., `USD`). |
| `portfolio` | Object | A map of asset codes (e.g., `BTC`) to quantities (e.g., `1.0`). |

### Key Architectural Requirements:
1. **Input Validation:** Robustly reject invalid or incomplete payloads (e.g., missing currency, empty portfolio).
2. **Concurrency:** Utilize the language's best tool for I/O concurrency (Ruby Threads, Python `asyncio`, TypeScript Promises) to minimize API latency.
3. **Error Handling:** Implement graceful error handling for external API failures, returning a standardized `500 Internal Server Error`.

---

## 💻 Getting Started
To explore an implementation:

1. **Clone the Repository:**
```bash
git clone https://github.com/Effloresc3/crypto-portfolio.git
```
2. **Switch to the Desired Branch:**
```bash
git checkout <branch-name>  # e.g., git checkout python
```
3. **Follow the `README.md` on that branch** for specific setup, installation, and run instructions.
