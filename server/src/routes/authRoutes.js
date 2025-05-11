const express = require("express");
const { login, register, updatePassword, getUserProfile, updateUserProfile , getAllUsers,deleteUser,getUserCount } = require("../controllers/authcontroller"); // Adjust the path as necessary

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/update-password', updatePassword);
router.get('/user-profile', getUserProfile);
router.put('/user-profile', updateUserProfile);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/user-count', getUserCount);

module.exports = router;
