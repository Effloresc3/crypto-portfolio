import pytest
from fastapi.testclient import TestClient
import respx
from app.main import app

client = TestClient(app)

pytestmark = pytest.mark.asyncio

@respx.mock
async def test_should_return_200_ok_and_total_calculated_value(mock_buda_quotation):
    """Corresponds to PortfolioControllerTest#test_should_return_200_OK"""
    
    mock_buda_quotation('BTC', 1.0, 50000.00, 'USD') 
    mock_buda_quotation('ETH', 5.0, 75000.00, 'USD') 

    payload = {
        "fiat_currency": "USD",
        "portfolio": {"BTC": 1.0, "ETH": 5.0}
    }

    response = client.post("/", json=payload)

    assert response.status_code == 200
    assert response.text == '125000.0' 


@respx.mock
async def test_should_return_500_internal_server_error_when_api_fails(mock_buda_error):
    """Corresponds to PortfolioControllerTest#test_should_return_500_Internal_Server_Error"""
    
    mock_buda_error('ETH-USD', 5.0)

    payload = {
        "fiat_currency": "USD",
        "portfolio": {"BTC": 1.0, "ETH": 5.0}
    }

    response = client.post("/", json=payload)

    assert response.status_code == 500
    assert response.json()['message'] == 'Failed to communicate with external service for quotation data.'


@respx.mock
async def test_should_return_422_unprocessable_entity_if_portfolio_is_missing():
    """Corresponds to PortfolioControllerTest#test_should_return_400_Bad_Request_if_portfolio_is_missing"""
    
    payload = {
        "fiat_currency": "USD"
    }

    response = client.post("/", json=payload)

    assert response.status_code == 422
    
    errors = response.json()['detail']
    
    assert any(
        err['loc'] == ['body', 'portfolio'] and ('required' in err['msg'] or err.get('type') == 'missing')
        for err in errors
    ), f"Expected error for missing 'portfolio', got {errors}"
