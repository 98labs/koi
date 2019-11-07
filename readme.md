# Koi: A Koa-Typescript Boilerplate

## Tech/Library stack
- Node >= v10.15.1
- Koa v2.7
- Typescript

## Boilerplate Features
- Typescript linting based on [AirBnb Javascript Styleguide](https://github.com/airbnb/javascript)
- Non-opinionated approach, you can eject from the structure anytime
- JWT Authentication Starting point
- Standard API response (using MessageBag + Model Transformers)
- Winston logger: currently uses file transport (can be integrated AWS Cloudwatch and others)

## Quickstart

### Environment Configuration -- Dev
1. Make a .env file based on the .env.example file
2. Fill-up all necessary variables that the app needs (environment, ports, log level, db connections, etc)

### Running on Dev

Run with nodemon watching every file and auto-restarts the app:
``npm run start-dev``

### Building for Production

    npm run build

**Optional:** run the built code to test it

    npm run serve

## Structure

### Folder Structure
- src
	- config
	- controllers
	- middlewares
	- models
	- routes
	- services
	- transformers
	- typings
	- utilities
- test

### BaseBreadController

A base class meant to be inherited by controllers that needs a working **BREAD** functionality for their modelled database tables.

**BREAD** is a controller action pattern used to map actions against operations that can be performed on a database record/record set. You've probably heard of CRUD, well BREAD is similar, however it breaks the read action out into two, a crucial difference.

**BREAD** is an acronym, just like *CRUD*:

B - Browse  
R - Read  
E - Edit  
A - Add  
D - Delete

**Browse vs Read**

Browse is a paginated list of all records in a table (Eg. select * from t), whereas read is displaying a single record (Eg. select * from t where id = :id).

### Models

Koa Typescript Boilerplate v2 models extends a BaseModel class.

The BaseModel has also some static functionalities (that was meant to be overridden, explained below) that would make the models more 'standard' on parts like the controllers, output transformers and services.

Static functionalities were meant to be overridden because Typescript does not [yet] support ``abstract static`` members. 

**Analogy**: Model = a row in a database table. 

### Services

Services are the middle component that actually solves the domain logic needed in order to complete a task of the controller; a service can also use other services.

There is a **BaseDBService** that acts like a Data Access Object (DAO) for simple operations that needs database interaction (Eg. findById(), update(), create(), delete() etc.) The BaseDBService methods returns the Models that are 

#### Guidelines: 
- Thin controllers, thick services.
- Controllers route params to services -> services process logic -> controllers send response

### Transformers

Transformers define which fields for each Models will be shown on the controller responses. There is the **TransformableObjectAbstract** abstract class that defines the 'generic' way of transforming a model instance. We can override the ``transform()`` and ``transformError()`` methods if we would need to provide custom functionality for it.

#### Error Responses
- General Error
```
{
    "status": 500,
    "messages": [
        {
            "type": "ERROR",
            "message": "Internal Server Error",
            "context": ""
        }
    ],
    "data": {}
}
```

## Coming Soon

- [koi-cli](https://github.com/98labs/koi-cli) integration
- proper testing setup
- OpenAPI v3 standards compliance (via Transformers)