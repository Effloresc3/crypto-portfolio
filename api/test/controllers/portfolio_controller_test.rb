require 'test_helper'

class PortfolioControllerTest < ActionDispatch::IntegrationTest

  def setup
    mock_buda_quotation('BTC-USD', 1.0, 50000)
    mock_buda_quotation('ETH-USD', 5.0, 75000)

    @valid_payload = {
      fiat_currency: 'USD',
      portfolio: { 'BTC' => 1.0, 'ETH' => 5.0 }
    }
  end

  test 'should return 200 OK and the total calculated value as plain text' do
    post '/', params: @valid_payload, as: :json

    assert_response :success
    assert_equal '125000.0', @response.body
    assert_equal 'text/plain; charset=utf-8', @response.content_type
  end

  test 'should return 400 Bad Request if fiat_currency is missing' do
    invalid_payload = @valid_payload.except(:fiat_currency)

    post '/', params: invalid_payload, as: :json

    assert_response :bad_request
    assert_includes json_response['errors'], "Fiat currency can't be blank"
  end

  test 'should return 400 Bad Request if portfolio is missing' do
    invalid_payload = {
      fiat_currency: 'USD',
      portfolio: {}
    }

    post '/', params: invalid_payload, as: :json

    assert_response :bad_request
    assert_includes json_response['errors'], "Portfolio can't be empty"
  end

  test 'should return 500 Internal Server Error when external API fails' do
    WebMock.reset!
    mock_buda_quotation('BTC-USD', 1.0, 50000)
    mock_buda_error('ETH-USD', 5.0)

    post '/', params: @valid_payload, as: :json

    assert_response :internal_server_error
    assert_equal 'Failed to communicate with external service for quotation data.', json_response['message']
  end

  private

  def json_response
    JSON.parse(@response.body)
  end
end