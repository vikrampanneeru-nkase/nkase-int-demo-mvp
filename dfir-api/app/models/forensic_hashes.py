from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean, ForeignKey
from app.db.database import Base

class ForensicHash(Base):
    __tablename__ = "forensic_hashes"

    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, ForeignKey("evidence.id"), nullable=False)
    case_number = Column(String, ForeignKey("cases.case_number"), nullable=False)
    sha256_hash = Column(String, nullable=False)
    sha1_hash = Column(String, nullable=True)
    md5_hash = Column(String, nullable=True)
    verified_by = Column(String, nullable=False)
    verified_at = Column(TIMESTAMP, nullable=False)
    verification_method = Column(String, nullable=False)
    verification_status = Column(String, default='verified', nullable=False)
    blockchain_id = Column(String, nullable=True)
    blockchain_timestamp = Column(TIMESTAMP, nullable=True)
    legal_certification = Column(Boolean, default=False)
    certificate_id = Column(String, nullable=True)

