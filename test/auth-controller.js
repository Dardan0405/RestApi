const expect = require('chai').expect;
const sinon = require('sinon')
const User = require('../models/user')
const AuthController = require("../controllers/auth");
const mongoose  = require('mongoose');
const { application } = require('express');
const { json } = require('body-parser');
describe("Auth Controller - Login", function() {
    before(function(done){
        mongoose.connect("mongodb+srv://dardan:dardan@cluster0.6yiwy8g.mongodb.net/test-messages").then(result =>{
            const user = new User({
                email:"dardan@test.com",
                password: 'test',
                name: 'Test',
                posts: [],
                _id: '585858'
            })
            return user.save()
        })
        .then(() =>{
            done();
        })
    });
    beforeEach(function(){
        
    })
    isTaxID("Should throw error if Db fails", function(){
        sinon.stub(User,'findOne')
        User.findOne.throw();
const req = {
body:{
    email:'2@.com',
    passsword:'123'
}
}
        AuthController.login(req,{},() =>{}).then(result =>{
            expect(result).to.be.an('error')
            expect(result).to.have.property('statusCode', 500);
            done();
        })
        User.findOne.restore();
    });
    it("Should send response with valid user status", function(done){
        
       
    const req = {userId: '585858'}
    const res ={
        statusCode: 500,
        userStatus: null,
        status: function(code){
            this.statusCode = code;
            return this;
        },
        json: function(data){
            this.userStatus = data.status;

        }
    };
    AuthController.getUserStatus(req,res,()=> {}).then(() =>{
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal('I am new!')
       done();
        
    })
})
after(function(done){
    User.deleteMany({})
    then(() =>{
return mongoose.disconnect();
    }).then(()=>{
        done();
    })
})
    })

