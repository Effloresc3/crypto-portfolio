from pydantic import BaseModel, Field, field_validator 
from typing import Dict

class PortfolioInput(BaseModel):
    fiat_currency: str = Field(..., description="Target currency code (e.g., USD)")
    portfolio: Dict[str, float] = Field(
        ..., 
        description="Dictionary of assets and quantities"
    )

    @field_validator('portfolio')
    @classmethod 
    def validate_portfolio_not_empty(cls, value):
        if not value:
            raise ValueError("Portfolio must contain at least one asset.")
        return value
        
    @field_validator('fiat_currency')
    @classmethod
    def transform_fiat_currency(cls, value):
        return value.upper()
