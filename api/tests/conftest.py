import pytest
from httpx import Response
import respx
import json

BUDA_BASE_URL = 'https://www.buda.com/api/v2'

@pytest.fixture
def mock_buda_quotation():
    """Returns a function to mock a successful Buda API quotation response."""
    
    def _mock(asset_code, amount, quote_value, fiat='USD'):
        market_id = f"{asset_code.upper()}-{fiat.upper()}"
        url = f"{BUDA_BASE_URL}/markets/{market_id}/quotations"
        
        request_body = json.dumps({"type": "bid_given_size", "amount": amount})
        
        response_body = {
            "quotation": {
                "quote_exchanged": [str(quote_value), 'CLP'] 
            }
        }
        
        respx.post(url, content=request_body).mock(
            return_value=Response(
                200, 
                json=response_body,
                headers={'Content-Type': 'application/json'}
            )
        )

    return _mock

@pytest.fixture
def mock_buda_error():
    """Returns a function to mock a failed Buda API response (500)."""
    
    def _mock(market_id, amount):
        url = f"{BUDA_BASE_URL}/markets/{market_id}/quotations"
        request_body = json.dumps({"type": "bid_given_size", "amount": amount})
        
        respx.post(url, content=request_body).mock(
            return_value=Response(
                500, 
                content="External service error",
                headers={}
            )
        )
    return _mock
