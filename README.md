# Babbo Natale Segreto (Your secret Santa)

🎁 Do you have a group of friends and you want to exchange gift randomly for Christmas?
This application allows you to assign randomly the friend you're going to make a present to with two simple steps:

1. Edit the file `config.json` with your name and the ones of your friends.
2. Edit the SMTP configuration (see [Nodemailer](https://nodemailer.com/about/)) for your email server configuration.
3. Run the program with: `npm start`

This tool will randomly pick each friend another friend to make the present to and you'll receive an email with your present destination!

In the `config.json` you can customize also the sender settings.
