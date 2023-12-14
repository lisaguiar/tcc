import { validationResult, body } from 'express-validator'
import moment from 'moment'

const validateFields = (req, res, next) => {
  const validationRules = []

  Object.keys(req.body).forEach((fieldName) => {
    switch (true) {
      case fieldName.includes('title'):
        validationRules.push(
          body(fieldName)
            .isLength({ min: 3 })
            .withMessage("O título deve conter pelo menos 3 caracteres.")
        )
        break
      case fieldName.includes('description'):
        if (!req.body[fieldName] || req.body[fieldName].trim().length === 0) {
          req.body[fieldName] = 'Campo não preenchido.'
          break
        }
        validationRules.push(
          body(fieldName)
            .custom((value) => value.length >= 10)
            .withMessage("A descrição deve conter no mínimo 10 caracteres.")
        )
        break
      case fieldName.includes('content'):
        validationRules.push(
          body(fieldName)
            .isLength({ min: 1 })
            .withMessage("O conteúdo não pode estar vazio.")
        )
        break
      case fieldName.includes('createdAt'):
        validationRules.push(
          body(fieldName)
          .custom((value) => {
            const formattedDate = moment(value).format('YYYY-MM-DD HH:mm:ss')
            req.body[fieldName] = formattedDate
            return true
          })
        )
        break
      case fieldName.includes('id'):
        validationRules.push(
          body(fieldName)
            .isInt()
            .withMessage("Valor de identificação inválido.")
        )
        break
    }
  })

  const promises = validationRules.map((rule) => rule(req, res, () => {}))

  Promise.all(promises)
    .then(() => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg })
      }

      next()
    })
}

export default validateFields