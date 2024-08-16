const except = require("chai").expect;

const AuthMiddleware = require("../middleware/auth");

describe('Auth middleware', function(){
    it("should throw an error if no authorication header is present", function(){
        const req = {
            get: function(headerName){
                return null;
            }
    
        };
        except(AuthMiddleware.bind(this, req, {}, () =>{})).to.throw(
            "No Auth"
        )
    })
    it("should throw an error is auth header is only one string", function(){
        const req = {
            get: function(headerName){
                return 'xyz';
            }
    
        };
        except(AuthMiddleware.bind(this, req, {}, () =>{})).to.throw();
    
    });
    it("should throw an error if the token cannot be verified", function(){
        const req = {
            get: function(headerName){
                return 'Bearer xyz';
            }
    
        };
        except(AuthMiddleware.bind(this,req,{},() =>{})).to.throw();
    })
    it("should throw an yield a userId after decoding the token", function(){
        const req = {
            get: function(headerName){
                return 'Bearer djdjdj';
            }
    
        };
       AuthMiddleware(req, {}, () =>{});
       except(req).to.have.property('userId')
    })
})

