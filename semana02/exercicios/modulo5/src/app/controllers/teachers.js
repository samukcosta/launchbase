const {age, graduation, type, date} = require("../../lib/utils")
const teacher = require("../models/teacher")


module.exports = {
    index(req, res){
        const {filter} = req.query

        if (filter) {
            teacher.findBy(filter, function(teachers){
                console.log(filter)
                console.log(teachers)
                return res.render("teachers/index", {filter,teachers})
            })
        } else {
            teacher.all(function(teachers){
                return res.render("teachers/index", {teachers})
            })
        }
        
    },
    post(req,res){
        const keys = Object.keys(req.body)
    
        for (key of keys) {
            if (req.body[key] == ""){
                return res.send("Please, fill all fields")
            }
        }
        
        teacher.create(req.body, function(member){
            return res.redirect(`/teachers/${member.id}`)
        })

    },
    show(req,res){
        teacher.find(req.params.id, function(teacher){
            if (!teacher) return res.send("Teacher not found") 

            teacher.age = age(teacher.birth_date)
            teacher.subjects_taught = teacher.subjects_taught.split(",")
            teacher.created_at = date(teacher.created_at).format
            teacher.education_level = graduation(teacher.education_level)

            return res.render("teachers/show", {teacher})
        })
    },
    edit(req,res){
        teacher.find(req.params.id, function(teacher){
            if (!teacher) return res.send("Teacher not found")

            teacher.birth = date(teacher.birth).iso

            return res.render("teachers/edit", {teacher})
        })
    },
    put(req,res){
        const keys = Object.keys(req.body)
    
        for (key of keys) {
            if (req.body[key] == ""){
                console.log(key)
                return res.send("Please, fill all fields")
            }
        }

        teacher.update(req.body, function(){
            return res.redirect(`teachers/${req.body.id}`) 
        })

    },
    delete(req,res){
        teacher.delete(req.body.id, function(){
            return res.redirect("/teachers/")
        })
    }
}