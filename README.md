# Strapi application
this application is used to manage the materials in an IT company.
it contains a strapi interface to manage materials and employees and extract an excel file to present them
# First step 
create a strapi project using : npx create-strapi-app gestion_materiel
# Second step 
## yarn install
## yarn build
## yarn develop 
# change login interface:
you have to copy file from node_modules/strapi-admin/admin floder to project directory 
and modify files that you need to change 
# create excel file
you have to change into the HomePage floder 
### 1 - add exportMaterial Compenent which we add calander and button submit witch it's a click to strapi-export/export-material
### 2-  Before this step we should add strapi-export floder in extensions 
### 3- Create routes to export-strapi controllers
### 4- strapiExport file contains the export function (file , csv , excell ... )
# create send email custom provider
### create a free compte in https://app.mailjet.com/
get 
MAILER_HOST=in-v3.mailjet.com
MAILER_PORT= 587
MAILER_API=your username
MAILER_API_KEY=your API key 
### create .env (copy of .en.example)
### create a twig template