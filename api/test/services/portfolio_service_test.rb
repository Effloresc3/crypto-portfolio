require 'test_helper'
require_relative '../../app/services/portfolio_service'

class PortfolioServiceTest < ActiveSupport::TestCase

  def setup
    @valid_form = PortfolioForm.new(
      fiat_currency: 'USD',
      portfolio: { 'BTC' => 1.0, 'ETH' => 5.0 }
    )
  end

  test 'calculates total equivalent value correctly from mocked responses' do
    mock_buda_quotation('BTC-USD', 1.0, 50000)
    mock_buda_quotation('ETH-USD', 5.0, 75000)

    result = PortfolioService.call(portfolio_form: @valid_form)

    assert_equal 125000.00, result
  end

  test 'handles asset with zero or nil quantity by skipping the API call' do
    form_with_zero = PortfolioForm.new(
      fiat_currency: 'USD',
      portfolio: { 'BTC' => 1.0, 'ETH' => 0 }
    )

    mock_buda_quotation('BTC-USD', 1.0, 50000)

    result = PortfolioService.call(portfolio_form: form_with_zero)

    assert_equal 50000.00, result
    assert_requested(:post, /BTC-USD/, times: 1)
    assert_not_requested(:post, /ETH-USD/)
  end

  test 'raises ExternalApiError when any concurrent call fails' do
    mock_buda_quotation('BTC-USD', 1.0, 50000)
    mock_buda_error('ETH-USD', 5.0)

    assert_raises ExternalApiError do
      PortfolioService.call(portfolio_form: @valid_form)
    end
  end
end
