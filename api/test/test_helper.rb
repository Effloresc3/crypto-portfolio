ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"
require "webmock/minitest"

WebMock.disable_net_connect!(allow_localhost:true)

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    # Add more helper methods to be used by all tests here...
  end
end

def mock_buda_quotation(market_id, amount, quote_value)
  url = "https://www.buda.com/api/v2/markets/#{market_id}/quotations"
  body = {
    type: 'bid_given_size',
    amount: amount
  }.to_json
  response = {
    quotation: {
      quote_exchanged: [quote_value.to_s, 'CLP'] 
    }
  }.to_json

  stub_request(:post, url)
    .with(body: body)
    .to_return(status: 200, body: response, headers: { 'Content-Type' => 'application/json' })
end

def mock_buda_error(market_id, amount)
  url = "https://www.buda.com/api/v2/markets/#{market_id}/quotations"
  body = { type: 'bid_given_size', amount: amount }.to_json
  
  stub_request(:post, url)
    .with(body: body)
    .to_return(status: 500, body: "External service error", headers: {})
end
