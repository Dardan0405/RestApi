const except = require("chai").expect;
it('should add numbers currectly', function(){
    const num1 = 2;
    const num2 = 3;
    except(num1 + num2).to.equal(5);
    
})
it("should not give a result 6", function(){
    const num1 = 2;
    const num2 = 3;
    except(num1 + num2).not.to.equal(6)
})