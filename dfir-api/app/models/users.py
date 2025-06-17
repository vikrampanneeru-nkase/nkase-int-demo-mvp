from sqlalchemy.orm import Mapped, mapped_column, declarative_base
from sqlalchemy import String

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    user_id: Mapped[str] = mapped_column(String, primary_key=True)
    password: Mapped[str] = mapped_column(String)
    api_key: Mapped[str] = mapped_column(String)
    account_id: Mapped[str] = mapped_column(String)
    external_id: Mapped[str] = mapped_column(String)
    api_gateway_url: Mapped[str] = mapped_column(String)
    account_name: Mapped[str] = mapped_column(String)
    email_id: Mapped[str] = mapped_column(String)

