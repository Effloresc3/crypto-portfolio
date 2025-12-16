import pytest
import respx
from app.services.portfolio_service import PortfolioService
from app.schemas import PortfolioInput
from app.exceptions import ExternalApiError

pytestmark = pytest.mark.asyncio

@respx.mock
async def test_calculates_total_equivalent_value_correctly(mock_buda_quotation):
    """Corresponds to PortfolioServiceTest#test_calculates_total_equivalent_value_correctly"""
    
    mock_buda_quotation('BTC', 1.0, 50000.00, 'USD') 
    mock_buda_quotation('ETH', 5.0, 75000.00, 'USD') 
    
    valid_form = PortfolioInput(
        fiat_currency='USD',
        portfolio={'BTC': 1.0, 'ETH': 5.0}
    )

    total_value = await PortfolioService.calculate(valid_form)

    assert total_value == 125000.00
    assert respx.calls.call_count == 2


@respx.mock
async def test_raises_external_api_error_when_any_concurrent_call_fails(mock_buda_quotation, mock_buda_error):
    """Corresponds to PortfolioServiceTest#test_raises_ExternalApiError_when_any_concurrent_call_fails"""
    
    mock_buda_quotation('BTC', 1.0, 50000.00, 'USD')
    mock_buda_error('ETH-USD', 5.0) 
    
    valid_form = PortfolioInput(
        fiat_currency='USD',
        portfolio={'BTC': 1.0, 'ETH': 5.0}
    )

    with pytest.raises(ExternalApiError):
        await PortfolioService.calculate(valid_form)
        
    assert respx.calls.call_count == 2
