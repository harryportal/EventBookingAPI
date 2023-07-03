# EventBookingAPI
Backend for an Event Booking Application build with Node and TypeScript:rocket:
***
![](https://github.com/harryportal/EventBookingAPI/actions/workflows/main.yml/badge.svg)
***

***
This project uses yarn package manager, To install yarn use ```npm i -g yarn```
***
To start the project, clone the repository and install dependecies: 

```sh
> git clone https://github.com/harryportal/EventBookingAPI
> cd EventBookingAPI
> yarn add
```

***
Create a .env.test and .env.development and populate using the .env.sample file.
***
If you have docker installed, you can start the postgres database with ```yarn run start:db```

```sh
# run migrations on your database
> yarn run db:migrate
# start server
> yarn run dev
```

To run the Unit and Integration test:
- Create a test database or your use this command if you have docker installed to start the test db ```yarn run test:db```
```sh
# run migration
> yarn run test:migrate
# yarn test
> yarn run test
```

ROADMAP:
- [x] Set up Boiler Plate
- [x] Set up model with Prisma
- [x] Implement Authentication Endpoints and Google Sign In
- [x] Implement Event creation and attendee endpoints
- [x] Implement Mailing with nodemailer and google app
- [x] Set up Cloudinary for storing event images 
- [ ] Add Documentation with Postman
- [x] Write Unit and Integration Test
- [ ] Deploy to Heroku:rocket: 


