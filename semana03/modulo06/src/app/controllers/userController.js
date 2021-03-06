const User = require('../models/user')
const { formatCep, formatCpfCnpj} = require('../../lib/utils')

module.exports = {
    registerForm(req, res){
        return res.render("users/register")
    },
    async show(req, res) {
        const {user} = req

        user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
        user.cep = formatCep(user.cep)

        return res.render('users/index', {user})
    },
    async post(req, res) {

        const userID = await User.create(req.body)

        req.session.userID = userID

        return res.redirect('/users')
        
    },
    async update(req, res) {
        try {

            const {user} = req

            let {name, email, cpf_cnpj, cep, address} = req.body

            cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
            cep = cep.replace(/\D/g, "")

            await User.update(user.id, {
                name, email, cpf_cnpj, cep, address
            })

            return res.render("users/index", {
                user: req.body,
                success: "Conta atualizada com sucesso!"
            })

        } catch (err) {
            console.error(err)
            return res.render("users/index", {
                error: "Algum erro aconteceu!"
            })
        }
    }
}