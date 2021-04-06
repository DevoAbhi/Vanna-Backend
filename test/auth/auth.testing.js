process.env.NODE_ENV = 'test';
const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should();
const mongoose = require('mongoose')

var server = require('../../server')
const User = require('../../models/user')

chai.use(chaiHttp)

describe('Auth API', function() {

    before((done) => {
        const MongoDB_URI = "mongodb+srv://Abhinab:" + process.env.MONGO_ATLAS_PW + "@vanna.6yczg.mongodb.net/users"
        mongoose.connect(MongoDB_URI,
            { useUnifiedTopology: true, useNewUrlParser: true }
          )
          .then(result => {
            console.log("Database has been connected successfully!")
            done();
            
          })
          .catch(err => {
            console.log("Could not connect to the Database!")
            console.log(err)
        })
        done();
    })

    it('should register user, login user and get user', function(done){

        chai.request(server)

        .post('/user/signup')

        .send({
            'name': 'Tester',
            'email': 'test@gmail.com',
            'phone': '9304618936',
            'address1': 'test in Testing Towers',
            'address2': 'Test Lane Testkhand',
            'city': 'Testbad',
            'state': 'TestKhand',
            'pin': '826001',
            'password': 'test@12345'
        })

        .end((err, res) => {

            res.should.have.status(201);

            chai.request(server)
                .post('user/login')

                .send({
                    'email': 'test@gmail.com',
                    'password': 'test@12345'
                })

                .end((err, res) => {
                    console.log('Runs logic after login');
                    res.body.should.have.property('token');
                    const token = res.body.token;
                    
                    chai.request(server)
                        .get('user/user-details')

                        .set('Authorization', 'Bearer ' + token)

                        .end(function(err, res) {
                            res.should.have.status(200);
                            res.body.should.have.property('success');
                            
                        })
                }) 
        })
        done();
    })
})