require_relative '../services/portfolio_service'

class PortfolioController < ApplicationController
  def calculate
    form = PortfolioForm.new(portfolio_params)

    return render_errors(form) unless form.valid?

    total_value = PortfolioService.call(portfolio_form: form)
    render plain: total_value.to_s, status: :ok
  end

  def portfolio_params
    params.permit(:fiat_currency, portfolio: {})
  end

  def render_errors(form)
    render json: { errors: form.errors.full_messages }, status: :bad_request
  end
end
