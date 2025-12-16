class ApplicationController < ActionController::API
  rescue_from ExternalApiError, with: :handle_external_api_error

  private

  def handle_external_api_error(exception)
    Rails.logger.error("External API Error: #{exception.message}")

    render json: {
      statusCode: 500,
      message: 'Failed to communicate with external service for quotation data.',
      error: 'Internal Server Error'
    }, status: :internal_server_error
  end
end
