from fastapi import FastAPI, Depends
from fastapi.responses import PlainTextResponse, JSONResponse 
from .schemas import PortfolioInput
from .services.portfolio_service import PortfolioService
from .exceptions import ExternalApiError
from .dependencies import get_portfolio_service

app = FastAPI(title="Crypto Portfolio API")

@app.exception_handler(ExternalApiError)
async def external_api_error_handler(request, exc: ExternalApiError):
    
    return JSONResponse(
        status_code=500,
        content={ 
            "statusCode": 500,
            "message": "Failed to communicate with external service for quotation data.",
            "error": "Internal Server Error"
        }
    )

@app.post("/", response_class=PlainTextResponse)
async def calculate_portfolio_value(form: PortfolioInput, portfolio_service: PortfolioService = Depends(get_portfolio_service)):
    total_value = await PortfolioService.calculate(form)
    return str(total_value)
