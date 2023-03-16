# EventBookingAPI
Backend for an Event Booking Application build with Node and TypeScript:rocket:

***
To run on a development server: 

```sh
> git clone https://github.com/harryportal/EventBookingAPI
> cd EventBookingAPI
> npm install
```

***
Create a .env.test and .env.development and populate using the .env.sample file.
***
If you have docker installed, you can start the postgres database with ```npm run start:db```

```sh
# run migrations on your database
> npm run db:migrate
# start server
> npm run dev
```

To run the Unit and Integration test:
- Create a test database or your use this command if you have docker installed to start the test db ```npm run test:db```
```sh
# run migration
> npm run migrate:test
# run test
> npm run test
```

ROADMAP:
- [x] Set up Boiler Plate
- [x] Set up model with Prisma
- [x] Implement Authentication Endpoints and Google Sign In
- [x] Implement Event creation and attendee endpoints
- [x] Implement Mailing with nodemailer and google app
- [ ] Add AWS S3 for storing event images 
- [ ] Add Documentation with Postman
- [ ] Write Unit and Integration Test
- [ ] Deploy to Heroku:rocket: 


