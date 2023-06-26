require('dotenv').config()
const jwt = require('jsonwebtoken')

/**
 * @notice - functions give permissions to users with certain roles
 * @param {token} req - token from the client 
 * @returns user object with id
 */
exports.requireUserSignIn = (req, res, next) => {
    if (req.headers.authorization) {

        //get token from headers
        const token = req.headers.authorization

        // verufy if token is valid
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

            // if error occured while validating token return that error
            if (err) {
                res.status(500).send({ error: err.message })
            }
            // if token is valid return user object
            if (user) {
                req.user = user
                next()
            }
            else{
                return res.status(500).send({ message: 'Only HRs perform that task' })
            }
        })

    } else {
        return res.status(500).send({ message: 'Authorisation Required!' })
    }
}