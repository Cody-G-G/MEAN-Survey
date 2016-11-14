// database model for a survey submission
var mongoose = require('mongoose');

// creating survey submission schema using mongoose
var surveySubmissionSchema = mongoose.Schema({
    entries: [{
        question: String,
        answer: String
    }],
    user: String
});

// performing require(surveySubmission.js) will return the surveySubmissionSchema object
module.exports = mongoose.model('SurveySubmission', surveySubmissionSchema);