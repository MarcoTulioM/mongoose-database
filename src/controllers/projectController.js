const Project = require('../models/Project');
const Task = require('../models/Task');

module.exports = {
    async list (req, res) {
        try {
            const allProjects = await Project.find().populate(['user', 'task']);

            return res.send( allProjects );
        } catch (err) {
            return req.send({error: "Error loading projects"});
        }
    },

    async show (req, res) {
        try {
            const project = await Project
                .findById(req.params.projectId)
                .populate(['user', 'task']); 

            return res.send({ project });
        } catch (err) {
            return req.send({error: "Error loading project"});
        }
    },

    async create (req, res) {
        try {

            const { title, description, task } = req.body;

            const project = await Project.create({ 
                title,
                description,
                user: req.userId 
            });
    
            await Promise.all( task.map( async task => { 
                const creatingTask = new Task({  
                    ...task,
                    project: project._id    
                }); 
        
                await creatingTask.save(); 

                project.task.push( creatingTask ); 
            }));
        
                await project.save() 

            return res.send({ project });
        } catch (err) {
    
            return res.send({error: "Error creating new project"});
        }
    },

    async put (req, res) {
        try {

            const { title, description, task } = req.body;

            const project = await Project.findByIdAndUpdate( 
            req.params.projectId,
            { 
                title,
                description,
            }, { new: true }); 
    
            project.task = [];
            await Task.remove({ project: project._id });

            await Promise.all( task.map( async task => {
                const creatingTask = new Task({  
                    ...task,
                    project: project._id    
                }); 
        
                await creatingTask.save();

                project.task.push( creatingTask ); 
            }));
        
                await project.save() 

            return res.send({ project });
        } catch (err) {
    
            return res.send({error: "Errorupdating new project"});
        }
    },

    async delete (req, res) {
        try {
            await Project.findByIdAndRemove(req.params.projectId);

            return res.send();
        } catch (err) {
            return req.send({error: "Error deleting project"});
        }
    } 
};