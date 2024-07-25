# App

Gympass style app.

## Functional Requirement

- [x] It should be possible to sign-up an user;
- [x] It should be possible to authenticate an user;
- [x] It should be possible to obtain logged user profile;
- [x] It should be possible to obtain the number of check-ins made by logged user;
- [x] It should be possible to user retrive their check-in history;
- [x] It should be possible for user to search for nearby gyms (within 10km);
- [x] It should be possible for user to search for gyms by name;
- [x] It should be possible for user made check-in in a gym;
- [x] It should be possible to validate user check-in;
- [x] It should be possible to register a gym;

## Business Rules

- [x] It shouldn't be possible to register with a duplicated email;
- [x] It shouldn't be possible to make more than ONE check-in per day;
- [x] It shouldn't be possible for a user to make a check-in if they are not within 100 meters of the gym;
- [] A check-in should only be valid within 20 minutes after it has been created;
- [] A check-in should only be validated by administrators;
- [] A gym should only be registered by administrators;

## Nonfunctional Requirements

- [x] User passwords should be encrypted;f
- [x] User passwords should be encrypted;f
- [x] The application data should be persisted inside a PostgreSQL database;
- [x] All data lists should be paginated with 20 items per page;
- [x] All data lists should be paginated with 20 items per page;
- [] User should be identified by a JWT (JSON Web Token);
