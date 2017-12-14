'use strict';

const LessonMember = require('../../services/models/LessonMember');

class LessonMemberController {

    constructor(model) {
        this.model = LessonMember;
    }

    // this will find all the records in database and return it
    index() {
        return this.model.find()
            .sort('created_at')
            .exec()
            .then( records => {
                return records;
            })
            .catch( error => {
                return error;
            });
    }

    search(options) {
        console.log("LessonMember.search",options)        
        return this.model.find(options)
            .sort('created_at')
            .exec()
            .then( records => {
                return records;
            })
            .catch( error => {
                return error;
            });
    }

    count(options) {
        console.log("LessonMember.count",options)        
        return this.model.find(options).count()
            .exec()
            .then( count => {
                return count;
            })
            .catch( error => {
                return error;
            });
    }
    
    // this will find a single record based on id and return it.
    single( options ) {
        return this.model.findOne({ _id: options.id })
            .exec()
            .then( record => {
                return record;
            })
            .catch( error => {
                return error;
            });
    }

    // this will insert a new record in database
    create(data) {
        const record = new this.model(data);
        return record.save()
            .then( (record) => {
                return record;
            })
            .catch( (error) => {
                return error;
            });
    }

    // this will update existing record in database
    update(data) {
        return this.model.findOne({ _id: data.id })
            .exec()
            .then( (record) => {
                Object.keys(data).map( field => {
                    record[field] = data[field];
                });

                return record.save()
                    .then( updated => {
                        return updated;
                    })
                    .catch( (error) => {
                        return error;
                    });

            })
            .catch( (error) => {
                return error;
            });
    }

    // this will remove the record from database.
    delete( options ) {
        this.model.findById( options.id )
            .exec()
            .then( record => {
                record.remove();
                return { status: true };
            })
            .catch( error => {
                return error;
            });
    }

};

const lesson_member_controller = new LessonMemberController();
module.exports = lesson_member_controller;
