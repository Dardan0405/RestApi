const expect = require('chai').expect;
const sinon = require('sinon')
const Post = require('../models/post')
const FeedController = require("../controllers/feed");
const mongoose  = require('mongoose');
const { application } = require('express');
const { json } = require('body-parser');
describe("Feed Controller - Login", function() {
    before(function(done){
        mongoose.connect("mongodb+srv://dardan:dardan@cluster0.6yiwy8g.mongodb.net/test-messages").then(result =>{
            const user = new Post({
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
    it("Should add created post of the creator", function(){
        
const req = {
body:{
    title:'Test Post',
    content: 'A Test Post'
},
file:{
path:'abc'
},
userId: '1212992'
}
const res = {status: function(){
    return this;
}, json: function() {}};
        FeedController.createPost(req,res, () =>{}).then((savedUser) =>{
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
            done()
        })
        
    });
    after(function(done){
        User.deleteMany({})
        then(() =>{
    return mongoose.disconnect();
        }).then(()=>{
            done();
        })
    })
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

    })

