import { validationResult, param } from 'express-validator'

const validateParams = (req, res, next) => {
    const validationRules = []
  
    if (req.params && typeof req.params === 'object') {
        Object.keys(req.params).forEach((paramName) => {
            const paramValue = req.params[paramName]
            const intValue = parseInt(paramValue, 10)

            if (!isNaN(intValue) && paramName.includes('id')) {
                validationRules.push(
                    param(paramName)
                        .isInt()
                        .withMessage("Problema na identificação do usuário. Por favor, recarregue a páginmmma.")
                )
            }
        })
    }

    validationRules.forEach((rule) => rule(req, res, () => {}))

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg })
    }
    next()
}

export default validateParams
