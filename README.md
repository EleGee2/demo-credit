# Demo-credit

## Introduction
This repository contains the code for a minimum viable product (MVP) of a wallet service for the mobile lending app "Demo Credit". The service allows users to create accounts, fund their accounts, transfer funds to other user's account and withdraw funds from their accounts.

## Tech Stack
* NodeJS (LTS version)
* KnexJS ORM
* MySQL database

## Features
* User account creation
* Account funding
* Fund transfer
* Withdrawal
* Transaction

## Prerequisites
* NodeJS LTS version installed
* MySQL server running
* Create a new database for the project
* Create config.env file with database configuration

## Getting Started

### Installation
* Clone the repository
* Run ***npm install*** to install the required dependencies

### Running the server
* Run ***npm run start*** to start the server
* Server will be running on ***http://localhost:/{{port}}***

## Testing
* Configure test in ***knexfile.js*** with test database configuration
* Run ***npm run test*** to run unit tests

## API Endpoints
<https://documenter.getpostman.com/view/19737798/2s8ZDSckKF>

## ER DIAGRAM
![E-R](https://user-images.githubusercontent.com/58389328/212484694-852596d7-916f-4255-a383-9a090ca16cad.png)

