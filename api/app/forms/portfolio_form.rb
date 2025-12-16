class PortfolioForm
  include ActiveModel::Model
  include ActiveModel::Validations

  validates :fiat_currency, presence: true
  validates :portfolio, presence: true
  validate :portfolio_not_empty

  attr_accessor :portfolio, :fiat_currency

  def initialize(params)
    @fiat_currency = params[:fiat_currency].presence&.upcase
    @portfolio = params[:portfolio].presence
  end

  def portfolio_not_empty
    if portfolio.nil? || portfolio.empty?
      errors.add(:portfolio, "can't be empty")
    end
  end
end
