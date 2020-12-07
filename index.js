const config = require('./config.json');
const {cloneDeep, shuffle, map, uniqBy} = require('lodash');
const mailer = require('nodemailer');
const smtpClient = mailer.createTransport(config.smtp);

// all people
const people = shuffle(
    config.recipients.map((i) => ({...i, makePresentTo: null})),
);

// bucket to extract the people from
const bucket = shuffle(cloneDeep(people));


for (let i = 0; i < people.length; i++) {
  const pickerOne = people[i];
  let bucketIndex = -1;
  let pickedOne = {};
  let tempRemaining = [];

  do {
    bucketIndex = Math.floor(Math.random() * bucket.length);
    pickedOne = cloneDeep(bucket[bucketIndex]);
    delete pickedOne.makePresentTo;
    tempRemaining = [...bucket];
    tempRemaining.splice(bucketIndex, 1);
  } while (
    pickedOne.email === pickerOne.email ||
    // it is the last element or in the next iteration there
    // will be an item !== next-item to avoid loop
    (i !== (people.length - 1) &&
    !tempRemaining.some((p) => p.email !== people[i + 1].email))
  );

  // assigned the picked person to the current commissioner
  pickerOne.makePresentTo = pickedOne;
  // remove from bucket
  bucket.splice(bucketIndex, 1);
}

// i know.. I'm not sure of the algorithm...
if (
  people.some((i) => i.makePresentTo.email === i.email) ||
  uniqBy(map(people, 'makePresentTo'), 'email').length !== people.length ||
  uniqBy(people, 'email').length !== people.length
) {
  console.error('Generato male, ci sono duplicati!');
  console.log(people);
  process.exit(1);
}

let i = 0;
for (const commissioner of people) {
  const {name, email, makePresentTo} = commissioner;
  const {name: presentToName} = makePresentTo;

  setTimeout(() => {
    smtpClient.sendMail({
      from: `${config.sender.name} <${config.sender.email}>`,
      to: `${name} <${email}>`,
      subject: `${config.sender.subject}`,
      html: `
        <p>Hello ${name.toUpperCase()}!</p>
        <p>
        🤖 Your Santa Bot is glad to announce that your present will go to:<br />
  
        <br/>
        <b style="font-size: 17pt;">🎁 ${presentToName.toUpperCase()} 🎁</b><br/>
        <br/>
  
        A big hug! 🎅
  
        </p>
  
        <br/><br/>
        <i>${config.sender.signature}! ✨</i>
      `,
    }).then((res) => {
      console.log('Sent mail to: ', commissioner.email);
    }).catch((e) => {
      console.error('Unable to send mail to: ', commissioner.email);
      console.error(e);
    });
  }, 15000 * i);
  i++;
}
