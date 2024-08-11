require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const Controller = require('./Controller');
const User = require('../models/User');
const { loginValidation, registerValidation, handleValidationErrors } = require('../middlewares/validation');
class controller  extends Controller {
    constructor() {
        super();
        this.routes();
    }

    routes() {

        this.router.post('/login', loginValidation,handleValidationErrors, async (req, res) => {
            const { email, password } = req.body;
            try {
                let user = await User.findOne({ email });
                if (!user) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
                }

                const payload = { user: { id: user.id, role: user.role } };
                jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
                if (err) throw err;
                res.json({ token });
                });
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        })

        this.router.post('/register', registerValidation,handleValidationErrors, async (req, res) => {
            const { username, email, password, role } = req.body;
            try {
                let user = await User.findOne({ email });
                if (user) {
                return res.status(400).json({ msg: 'User already exists' });
                }

                user = new User({ username, email, password, role });

                await user.save();

                const payload = { user: { id: user.id, role: user.role } };
                jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
                if (err) throw err;
                res.json({ token });
                });
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        });
        
    }
}
module.exports = new controller().router;