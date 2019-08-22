var Calculadora = require('../index');
var assert = require('assert');
var chai = require('chai');
var should = require('chai').should();
var chaiHttp = require('chai-http');
var server = 'http://localhost:8080';

chai.use(chaiHttp);

describe('Banco', function(){
    describe('Crear cuenta', function(){
        it('should return status 200 success execution', function() {
            chai.request(server)
            .post('/api/v1/cuenta/crear')
            //.type('form')
            .send({
                Cedula: '0506199100500',
                Nombre: 'Antonio mendosa'
            })
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(true);
            })
            .catch(function (err) {
                throw err;
            });
        });
    })
})