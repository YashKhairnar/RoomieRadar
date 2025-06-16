from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from ..db.db import db
from ..db.models import Conversation, Messages
from ..utils.logger import logger
from ..db.synthetic_models import ActionType, SentMessage
# from db.db import db
# from db.models import Conversation, Messages
# from utils.logger import logger
# from db.synthetic_models import ActionType, SentMessage


router = APIRouter()

@router.get('/conversations')
def get_conversation(request: Request):
    db_session: Session = next(db.get_db())
    # session_id = request.query_params.get("session_id", "no_session")
    user_id = request.query_params.get("user_id", None)
    
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    
    conversations = db_session.query(Conversation).filter((Conversation.user_id == user_id) | (Conversation.roommate_profile_id == user_id)).all()  
    
    if not conversations:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return conversations or []


@router.get('/messages')
def get_messages(request: Request):
    db_session: Session = next(db.get_db())
    conversation_id = request.query_params.get("conversation_id", None)
    
    if not conversation_id:
        raise HTTPException(status_code=400, detail="Conversation ID is required")
    
    messages = db_session.query(Conversation).filter(Conversation.id == conversation_id).first()
    
    if not messages:
        raise HTTPException(status_code=404, detail="Messages not found")
    
    return messages.messages or []


@router.post('/send_message')
def send_message(msg: SentMessage, request: Request):
    db_session: Session = next(db.get_db())
    session_id = request.query_params.get('session_id')

    new_message = Messages(
        conversation_id=msg.conversation_id,
        content=msg.content,
        sender_id=msg.sender_id,
    )

    db_session.add(new_message)
    db_session.commit()
    db_session.refresh(new_message)

    logger.log_action(
                session_id, 
                ActionType.DB_UPDATE,
                {
                    "table_name": "Messages", 
                    "update_type": "insert", 
                    "text": f"New message {new_message.id} created in database from sender {new_message.sender_id}",
                    "values": {
                        "id": new_message.id
                    }
                }
    )

    return {"messageId" : new_message.id }


@router.post('/create_conversation')
def create_conversation(request: Request):
    db_session: Session = next(db.get_db())
    user1 = request.query_params.get('user1')
    user2 = request.query_params.get('user2')
    session_id = request.query_params.get('session_id')

    convo = db_session.query(Conversation).filter(
        or_(
            and_(Conversation.user_id == user1, Conversation.roommate_profile_id == user2),
            and_(Conversation.user_id == user2, Conversation.roommate_profile_id == user1)
        )
    ).first()
    if(convo):
        return {"conversationId" : convo.id}
    else:
        new_conversation = Conversation(   
            user_id=user1,
            roommate_profile_id=user2,
            )
        db_session.add(new_conversation)
        db_session.commit()
        db_session.refresh(new_conversation)

        logger.log_action(
                session_id, 
                ActionType.DB_UPDATE,
                {
                    "table_name": "Matches", 
                    "update_type": "insert", 
                    "text": f"User {new_conversation.user_id} started a new conversation with {new_conversation.match_roommate_id}",
                    "values": {
                        "id": new_conversation.id
                    }
                }
        )
        return {"conversationId" : new_conversation.id}