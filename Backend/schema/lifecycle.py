from datetime import date
from pydantic import BaseModel
from typing import Optional


# ── Joining flow ──────────────────────────────────────────────

class JoiningInitiate(BaseModel):
    """Company → sets joining date. Sent by company."""
    user_email: str
    joining_date: date
    designation: str


class JoiningConfirm(BaseModel):
    """Candidate → confirms or disputes joining date."""
    company_id: int
    joining_date: date          # candidate's version of the date


class JoiningDocuments(BaseModel):
    """Candidate → submits document checklist after joining."""
    company_id: int

    # Received from company
    offer_letter: bool            = False
    appointment_letter: bool      = False
    salary_breakdown: bool        = False
    nda_agreement: bool           = False
    id_card_issued: bool          = False

    # Submitted to company
    aadhaar_submitted: bool       = False
    pan_submitted: bool           = False
    form_11_submitted: bool       = False
    bank_details_submitted: bool  = False
    photos_submitted: bool        = False
    education_docs_submitted: bool = False
    prev_exp_docs_submitted: bool = False

    notes: Optional[str]          = None


# ── Exit flow ─────────────────────────────────────────────────

class ExitInitiate(BaseModel):
    """Company → sets exit date."""
    user_email: str
    exit_date: date


class ExitConfirm(BaseModel):
    """Candidate → confirms or disputes exit date."""
    company_id: int
    exit_date: date             # candidate's version of the date


class ExitDocuments(BaseModel):
    """Candidate → submits exit document checklist."""
    company_id: int

    # Received from company
    experience_letter: bool       = False
    relieving_letter: bool        = False
    fnf_settlement: bool          = False
    salary_slip_last3: bool       = False
    pf_contribution_letter: bool  = False
    no_dues_certificate: bool     = False
    form_16: bool                 = False

    # Submitted to company
    resignation_email: bool       = False
    company_id_returned: bool     = False
    company_assets_returned: bool = False
    nda_compliance: bool          = False

    notes: Optional[str]          = None


# ── Dispute resolution (admin) ────────────────────────────────

class DisputeUpdate(BaseModel):
    status: str                 # 'resolved', 'rejected', 'under review'
    resolution_note: Optional[str] = None
