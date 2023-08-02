const router = require('express').Router(); 
const { celebrate, Joi } = require('celebrate'); 

const { 
  createCard, 
  receiveCards, 
  likeCard, 
  dislikeCard, 
  deleteCard, 
} = require('../controllers/cards'); 

router.post('/', celebrate({ 
  body: Joi.object().keys({ 
    name: Joi.string().required().min(2).max(30), 
    link: Joi.string().required().uri({scheme: ['http', 'https']}), 
    // Use a custom validator for hexadecimals
    cardId: Joi.string().length(24).hex(),
  }), 
}), createCard); 

router.get('/', receiveCards); 

router.put('/:cardId/likes', celebrate({ 
  params: Joi.object().keys({ 
    // Use a custom validator for hexadecimals
    cardId: Joi.string().length(24).hex(),
  }), 
}), likeCard); 

router.delete('/:cardId/likes', celebrate({ 
  params: Joi.object().keys({ 
    // Use a custom validator for hexadecimals
    cardId: Joi.string().length(24).hex(),
  }), 
}), dislikeCard); 

router.delete('/:id', celebrate({ 
  params: Joi.object().keys({ 
    // Use a custom validator for hexadecimals
    id: Joi.string().length(24).hex(),
  }), 
}), deleteCard); 

module.exports = router;  
