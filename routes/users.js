const router = require('express').Router(); 
const { celebrate, Joi } = require('celebrate'); 

const { 
  getUsersInfo, 
  getUserInfo, 
  getCurrentUserInfo, 

  setUserInfo, 
  setUserAvatar, 
} = require('../controllers/users'); 

router.get('/', getUsersInfo); 
router.get('/me', getCurrentUserInfo); 

router.get('/:id', celebrate({ 
  params: Joi.object().keys({ 
    id: Joi.string().hex().length(24).required(), 
  }), 
}), getUserInfo); 

router.patch('/me', celebrate({ 
  body: Joi.object().keys({ 
    name: Joi.string().required().min(2).max(30), 
    about: Joi.string().required().min(2).max(30), 
  }), 
}), setUserInfo); 

router.patch('/me/avatar', celebrate({ 
  body: Joi.object().keys({ 
    avatar: Joi.string().required().pattern(/^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/), 
  }), 
}), setUserAvatar); 

module.exports = router;
