var Calculadora = require('../index');
var assert = require('assert');
var chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
var should = require('chai').should();
var chaiHttp = require('chai-http');
var server = 'http://localhost:8080';

chai.use(chaiHttp);
chai.use(chaiAsPromised);
//

describe('Banco', function(){
    describe('Crear cuenta', function(){
        //Nombrefuncion_Scenario_valorEsperado
        var cuenta = {
            Cedula: '0506199100519',
            Nombre: 'Antonio Sosa 19'
        };      
        it('CrearCuenta_NoExisteLacuenta_RetornaSucessTrue', (done) => {
            chai.request(server)
            .post('/api/v1/cuenta/crear')
            .send(cuenta).then((res)=>{
                res.should.have.status(200);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(true);
                done();
            }).catch((err) => {
                done(err);
            });
        })
        it('CrearCuenta_SiExisteLacuenta_RetornaSucessFalse', (done) => {
            chai.request(server)
            .post('/api/v1/cuenta/crear')
            .send(cuenta).then((res)=>{
                res.should.have.status(400);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(false);
                done();
            }).catch((err) => {
                done(err);
            });
        })
    });
    describe('Abonar cuenta', function(){
        var abono = {
            Cedula: '0506199100519',
            Cantidad: 1000
        };
        var abono2 = {
            Cedula: '0506199100600123',
            Cantidad: 1000
        };
        it('AbonarCuenta_ExisteLaCuenta_RetornaSucessTrue', (done) => {
            chai.request(server)
            .post('/api/v1/cuenta/depositar')
            .send(abono)
            .then((res)=>{
                res.should.have.status(200);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(true);
                done();
            }).catch((err) => {
                done(err);
            });
        })
        it('AbonarCuenta_NoExisteLaCuenta_RetornaSucessFalse', (done) => {
            chai.request(server)
            .post('/api/v1/cuenta/depositar')
            .send(abono2)
            .then((res)=>{
                res.should.have.status(400);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(false);
                done();
            }).catch((err) => {
                done(err);
            });
        })
    });
    describe('Retirar cuenta', function(){
        var retiro = {
            Cedula: '0506199100519',
            Cantidad: 100
        };
        it('RetirarCuenta_LaExisteLaCuentaHaySaldodisponible1erIntento_RetornaSucessTrue', (done) => {
            chai.request(server)
            .post('/api/v1/cuenta/retirar')
            .send(retiro).then((res)=>{
                res.should.have.status(200);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(true);
                done();
            }).catch((err) => {
                done(err);
            });
        })
        it('RetirarCuenta_LaExisteLaCuentaHaySaldodisponible2doIntento_RetornaSucessTrue', (done) => {
            chai.request(server)
            .post('/api/v1/cuenta/retirar')
            .send(retiro).then((res)=>{
                res.should.have.status(200);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(true);
                done();
            }).catch((err) => {
                done(err);
            });
        })
        it('RetirarCuenta_LaExisteLaCuentaHaySaldodisponible3erIntento_RetornaSucessFalse', (done) => {
            chai.request(server)
            .post('/api/v1/cuenta/retirar')
            .send(retiro).then((res)=>{
                    res.should.have.status(400);
                    res.body.should.have.property('success');
                    res.body.should.have.property('success').be.equal(false);
                    res.body.should.have.property('numeroRetiros');
                    res.body.should.have.property('numeroRetiros').be.gt(2);
                    done();
            }).catch((err) => {
                done(err);
            });
        })
        it('RetirarCuenta_LaExisteLaCuentaYNoHaySaldodisponibleParaRetiro_RetornaSucessFalse', (done) => {
            chai.request(server)
            .post('/api/v1/cuenta/retirar')
            .send({
                Cedula: '0506199100519',
                Cantidad: 70000
            })
            .then((res)=>{
                res.should.have.status(400);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(false);
                //res.body.should.have.property('saldo').be.gt(0);
                done();
            }).catch((err) => {
                done(err);
            });
        })
    });
    describe('Eliminar cuenta', function(){
        var eliminar = {
            Cedula: '0506199100519'
        };
        it('RetirarCuenta_LaExisteLaCuenta_RetornaSucessTrue', (done) => {
            chai.request(server)
            .delete('/api/v1/cuenta/eliminar')
            .send(eliminar).then((res)=>{
                res.should.have.status(200);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(true);
                done();
            }).catch((err) => {
                done(err);
            });
        })
        it('RetirarCuenta_LaExisteNoLaCuenta_RetornaSucessFalse', (done) => {
            chai.request(server)
            .delete('/api/v1/cuenta/eliminar')
            .send(eliminar)
            .then((res)=>{
                res.should.have.status(400);
                res.body.should.have.property('success');
                res.body.should.have.property('success').be.equal(false);              
                done();
            }).catch((err) => {
                done(err);
            });
        })
    });
})