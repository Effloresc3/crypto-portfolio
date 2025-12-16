import asyncio
from typing import Dict
import httpx
import json
from ..exceptions import ExternalApiError
from ..schemas import PortfolioInput

BUDA_BASE_URL = 'https://www.buda.com/api/v2'

class PortfolioService:
    @staticmethod
    async def calculate(form: PortfolioInput) -> float:
        tasks = []
        for asset_code, quantity in form.portfolio.items():
                tasks.append(
                    PortfolioService._fetch_quotation(
                        asset_code, quantity, form.fiat_currency
                    )
                )

        quotations = await asyncio.gather(*tasks, return_exceptions=True)

        total_value = 0.0
        for result in quotations:
            if isinstance(result, Exception):
                raise result
            
            if result is not None:
                total_value += result
                
        return round(total_value, 2)

    @staticmethod
    async def _fetch_quotation(asset_code: str, quantity: float, fiat: str) -> float | None:
        market_id = f"{asset_code.upper()}-{fiat}"
        url = f"{BUDA_BASE_URL}/markets/{market_id}/quotations"
        payload = json.dumps({"type": "bid_given_size", "amount": quantity})

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    url,
                    headers={"Content-Type": "application/json"},
                    content=payload
                )
                
                response.raise_for_status() 

                data = response.json()
                
                quote = data.get('quotation', {}).get('quote_exchanged')
                
                if quote and quote[0]:
                    return float(quote[0])
                return None

            except httpx.HTTPStatusError as e:
                raise ExternalApiError(
                    f"API returned status {e.response.status_code} for {asset_code}",
                    status_code=500
                ) from e
            except (json.JSONDecodeError, Exception) as e:
                raise ExternalApiError(
                    f"Error fetching quotation for {asset_code}: {e.__class__.__name__}",
                    status_code=500
                ) from e
