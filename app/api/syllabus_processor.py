"""
Syllabus processing endpoints - handle raw text structuring and persistence.

This module extends the syllabus API with LLM-based structuring.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import logging

from app.db.session import get_db
from app.db.models import QuestionPaper
from app.core.syllabus_structurer import SyllabusStructurer

logger = logging.getLogger(__name__)


class SyllabusStructureUnit(BaseModel):
    """Single unit in structured syllabus"""
    unit_title: str
    topics: list[str]


class SyllabusStructureResponse(BaseModel):
    """Response containing structured syllabus"""
    units: list[SyllabusStructureUnit]


class SyllabusProcessRequest(BaseModel):
    """Request to process raw syllabus text"""
    paper_id: int
    raw_text: str


class SyllabusProcessResponse(BaseModel):
    """Response after processing syllabus"""
    status: str  # "STRUCTURED"
    units: list[SyllabusStructureUnit]
    total_topics: int


class SyllabusConfirmRequest(BaseModel):
    """Request to confirm syllabus structure"""
    paper_id: int
    structured_units: list[SyllabusStructureUnit]
    # Optional edits/changes made by user


router = APIRouter(prefix="/syllabus", tags=["Syllabus Management"])
structurer = SyllabusStructurer()


@router.post("/process", response_model=SyllabusProcessResponse)
async def process_syllabus(
    request: SyllabusProcessRequest,
    db: Session = Depends(get_db)
) -> SyllabusProcessResponse:
    """
    Process raw syllabus text through LLM to create structure.
    
    STEP 3.2 - Backend Flow:
    1. Validate paper exists
    2. Call LLM to structure raw text
    3. Save to database with status=REVIEW_PENDING
    4. Return structured result for user review (STEP 3.3)
    
    Args:
        request: Contains paper_id and raw_text
        db: Database session
        
    Returns:
        Structured syllabus ready for user review
        
    Raises:
        HTTPException: If paper not found or LLM fails
    """
    # Validate paper exists
    paper = db.query(QuestionPaper).filter(
        QuestionPaper.id == request.paper_id
    ).first()
    
    if not paper:
        raise HTTPException(
            status_code=404,
            detail=f"Paper not found: {request.paper_id}"
        )
    
    if not request.raw_text or not request.raw_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Raw syllabus text cannot be empty"
        )
    
    try:
        logger.info(f"Processing syllabus for paper {request.paper_id}")
        
        # Call LLM to structure syllabus (single call, no retries)
        structured = structurer.structure_syllabus(request.raw_text)
        
        # Convert to response format
        units = [
            SyllabusStructureUnit(
                unit_title=unit["unit_title"],
                topics=unit["topics"]
            )
            for unit in structured["units"]
        ]
        
        # Save to database
        # Note: You'll need to add this to models.py:
        # from app.db.models import SyllabusStructure
        # 
        # from app.db.models import SyllabusStructure
        # 
        # syllabi_structure = SyllabusStructure(
        #     paper_id=request.paper_id,
        #     syllabus_raw=request.raw_text,
        #     syllabus_structured=structured,
        #     status="REVIEW_PENDING"
        # )
        # db.add(syllabi_structure)
        # db.commit()
        
        logger.info(f"Syllabus processed for paper {request.paper_id}")
        
        return SyllabusProcessResponse(
            status="STRUCTURED",
            units=units,
            total_topics=sum(len(unit.topics) for unit in units)
        )
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Failed to structure syllabus: {str(e)}"
        )
    
    except Exception as e:
        logger.error(f"Error processing syllabus: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process syllabus: {str(e)}"
        )


@router.post("/confirm")
async def confirm_syllabus(
    request: SyllabusConfirmRequest,
    db: Session = Depends(get_db)
):
    """
    Confirm the structured syllabus after user review.
    
    STEP 3.3 - User Review Complete:
    1. User reviewed and potentially edited the structure
    2. User clicks "Confirm Syllabus"
    3. Save confirmed structure to database
    4. Mark as CONFIRMED - ready for question generation
    
    Args:
        request: Contains paper_id and final structured units
        db: Database session
        
    Returns:
        Confirmation with status update
        
    Raises:
        HTTPException: If paper not found
    """
    # Validate paper exists
    paper = db.query(QuestionPaper).filter(
        QuestionPaper.id == request.paper_id
    ).first()
    
    if not paper:
        raise HTTPException(
            status_code=404,
            detail=f"Paper not found: {request.paper_id}"
        )
    
    try:
        logger.info(f"Confirming syllabus for paper {request.paper_id}")
        
        # Update syllabus structure status in database
        # Note: Once SyllabusStructure model is added:
        # 
        # syllabi_structure = db.query(SyllabusStructure).filter(
        #     SyllabusStructure.paper_id == request.paper_id
        # ).first()
        # 
        # if syllabi_structure:
        #     syllabi_structure.status = "CONFIRMED"
        #     syllabi_structure.confirmed_at = datetime.utcnow()
        #     # Store user edits
        #     syllabi_structure.edits_applied = {
        #         "units": [
        #             {
        #                 "unit_title": unit.unit_title,
        #                 "topics": unit.topics
        #             }
        #             for unit in request.structured_units
        #         ]
        #     }
        #     db.commit()
        
        logger.info(f"Syllabus confirmed for paper {request.paper_id}")
        
        return {
            "status": "CONFIRMED",
            "message": "Syllabus confirmed. Ready for question generation.",
            "paper_id": request.paper_id,
            "total_units": len(request.structured_units),
            "total_topics": sum(len(unit.topics) for unit in request.structured_units)
        }
        
    except Exception as e:
        logger.error(f"Error confirming syllabus: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to confirm syllabus: {str(e)}"
        )


@router.get("/status/{paper_id}")
async def get_syllabus_status(
    paper_id: int,
    db: Session = Depends(get_db)
):
    """
    Get current status of syllabus for a paper.
    
    Returns:
        Current status and structure (if available)
        
    Raises:
        HTTPException: If paper not found
    """
    paper = db.query(QuestionPaper).filter(
        QuestionPaper.id == paper_id
    ).first()
    
    if not paper:
        raise HTTPException(
            status_code=404,
            detail=f"Paper not found: {paper_id}"
        )
    
    # Once SyllabusStructure model is added:
    # 
    # syllabi_structure = db.query(SyllabusStructure).filter(
    #     SyllabusStructure.paper_id == paper_id
    # ).first()
    # 
    # if syllabi_structure:
    #     return {
    #         "paper_id": paper_id,
    #         "status": syllabi_structure.status,
    #         "structured": syllabi_structure.syllabus_structured,
    #         "confirmed_at": syllabi_structure.confirmed_at
    #     }
    
    return {
        "paper_id": paper_id,
        "status": "NO_SYLLABUS",
        "message": "No syllabus structure found for this paper"
    }
