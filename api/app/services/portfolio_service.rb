require 'net/http'
require 'uri'
require 'json'

class PortfolioService
  BUDA_BASE_URL = 'https://www.buda.com/api/v2'.freeze

  def self.call(portfolio_form:)
    new(portfolio_form).calculate
  end

  def initialize(portfolio_form)
    @portfolio = portfolio_form.portfolio
    @fiat = portfolio_form.fiat_currency
  end

  def calculate
    quotations = @portfolio.to_h.filter_map do |asset_code, quantity|
      next unless quantity.to_f.positive?

      Thread.new do
        fetch_quotation(asset_code, quantity)
      end.tap { |t| t.abort_on_exception = true }
    end

    quotations.map(&:value).compact.sum.round(2)
  end

  private

  def fetch_quotation(asset_code, quantity)
    market_id = "#{asset_code.upcase}-#{@fiat}"
    uri = URI("#{BUDA_BASE_URL}/markets/#{market_id}/quotations")

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.path, 'Content-Type' => 'application/json')
    request.body = { type: 'bid_given_size', amount: quantity }.to_json
    response = http.request(request)

    unless response.is_a?(Net::HTTPSuccess)
      raise ExternalApiError, "API returned status #{response.code}"
    end

    JSON.parse(response.body).dig('quotation', 'quote_exchanged', 0)&.to_f
  rescue StandardError => e
    Rails.logger.error "Buda API Error: #{e.message}"
    raise ExternalApiError, "Error fetching quotation for #{asset_code}"
  end
end

class ExternalApiError < StandardError; end
