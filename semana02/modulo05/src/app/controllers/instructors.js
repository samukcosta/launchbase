const instructors = require("../models/instructor")
const {age, date} = require("../../lib/utils")


module.exports = {
    index(req,res){
        let {filter, page, limit} = req.query

        page = page || 1
        limit = limit || 1
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(instructors) {
                const pagination = {
                    total: Math.ceil(instructors[0].total / limit),
                    page
                }
                return res.render("instructors/index", {instructors,pagination, filter})
            }
        }

        instructors.paginate(params)

        /*if (filter) {
            instructors.findBy(filter, function(instructors){
                return res.render("instructors/index", {instructors, filter})
            })
        } else {
            instructors.all(function(instructors){
                return res.render("instructors/index", {instructors})
            })
        }*/
    },
    create(req,res){
        return res.render("instructors/create")
    },
    post(req,res){

        const keys = Object.keys(req.body)
    
        for (key of keys) {
            if (req.body[key] == ""){
                return res.send("Please, fill all fields")
            }
        }
    
        instructors.create(req.body, function(instructor) {
            return res.redirect(`/instructors/${instructor.id}`)
        })

        return
    },
    show(req,res){
        instructors.find(req.params.id, function(instructor){
            if (!instructor) return res.send("Instructor not found")

            instructor.age = age(instructor.birth)
            instructor.services = instructor.services.split(",")
            instructor.create_at = date(instructor.create_at).format

            return res.render("instructors/show", {instructor})
        })
    },
    edit(req,res){
        instructors.find(req.params.id, function(instructor){
            if (!instructor) return res.send("Instructor not found")

            instructor.birth = date(instructor.birth).iso

            return res.render("instructors/edit", {instructor})
        })
    },
    put(req,res){
        const keys = Object.keys(req.body)
    
        for (key of keys) {
            if (req.body[key] == ""){
                return res.send("Please, fill all fields")
            }
        }

        instructors.update(req.body, function(){
            return res.redirect(`instructors/${req.body.id}`)
        })
    },
    delete(req,res){
        instructors.delete(req.body.id, function(){
            return res.redirect(`instructors`)
        })
    }
}