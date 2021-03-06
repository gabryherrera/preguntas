var models = require('../models/models.js');

// Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
  console.log(req.query.search);
  if (req.query.search) {
    search = ('%' + req.query.search + '%').replace(' ', '%');
    console.log(search);
    models.Quiz.findAll({where: ["lower(pregunta) like lower(?)", search], order: ["pregunta"]}).then(
      function(quizes) {
        res.render('quizes/index.ejs', {quizes: quizes});
      }
    ).catch(function(error) {next(error); });
  } else {
    models.Quiz.findAll().then(
      function(quizes) {
        res.render('quizes/index.ejs', { quizes: quizes});
      }
    ).catch(function(error) { next(error); })
  }
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz) {
    if (req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()) {
      res.render('quizes/answer', 
          { quiz: quiz, respuesta: 'Correcto'});
    } else {
      res.render('quizes/answer', 
          { quiz: quiz, respuesta: 'Incorrecto'});
    }
  })
};


// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build( // crea objeto quiz
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

  // guarda en DB los campos pregunta y respuesta de quiz
  quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
    res.redirect('/quizes');
  })  // Redireccion HTTP (URL relativo) lista de preguntas
};
