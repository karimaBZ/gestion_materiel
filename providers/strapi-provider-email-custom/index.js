const nodemailer = require('nodemailer');
const Twig = require('twig');

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const templateDir = './providers/strapi-provider-email-custom/templates/';

const mailerRender = (path, options) =>
  new Promise((resolve, reject) => {
    Twig.renderFile(path, options, (err, html) => {
      if (err) reject(err);
      resolve(html);
    });
  });

const {
  MAILER_HOST: host,
  MAILER_PORT: port,
  MAILER_API: username,
  MAILER_API_KEY: password,
  DEFAULT_FROM: nodemailerDefaultFrom,
  DEFAULT_REPLY_TO: nodemailerDefaultReplyTo,
} = process.env;

function getTransporterConfig() {
  const transporterConfig = {
    host,
    port: Number.parseInt(port, 10),
    secure: Number.parseInt(port, 10) === 465,
    secureConnection: Number.parseInt(port, 10) === 465,
    pool: 'true',
    debug: false,
    logger: true,
    maxConnections: 10,
    maxMessages: 100,
    rateDelta: 1000,
    auth: {
      user: username,
      pass: password,
    },
  };

  if (transporterConfig.port === 465) {
    transporterConfig.tls = {
      // Do not fail on invalid certs
      rejectUnauthorized: false,
    };
  }

  return transporterConfig;
}

module.exports = {
  provider: 'Custom Mailer',
  name: 'Custom mailer',
  auth: {},
  init: config => {
    const sleepTime = config.sleep ? Number.parseInt(config.sleep, 10) : 1000;
    const transporterConfig = getTransporterConfig(config);
    const transporter = nodemailer.createTransport(transporterConfig);

    let attempts =
      config.attempts && Number.parseInt(config.attempts, 10) > 0
        ? Number.parseInt(config.attempts, 10)
        : 1;

    return {
      send: options => {
        return new Promise(async (resolve, reject) => {
          const castedOptions = options instanceof Object ? { ...options } : {};
          const html = castedOptions.template
            ? await mailerRender(`${templateDir}${castedOptions.template}`, castedOptions.data)
            : castedOptions.html;
          const message = {
            from: nodemailerDefaultFrom,
            to: castedOptions.to,
            replyTo: nodemailerDefaultReplyTo,
            subject: castedOptions.subject,
            text: castedOptions.text || '',
            html,
          };

          if (castedOptions.attachments) {
            message.attachments = castedOptions.attachments;
          }

          while (attempts > 0) {
            try {
              // eslint-disable-next-line no-await-in-loop
              const info = await transporter.sendMail(message);

              return resolve(info);
            } catch (e) {
              if (attempts === 0) {
                return reject(e);
              }
            }

            attempts -= 1;
            // eslint-disable-next-line no-await-in-loop
            await sleep(sleepTime);
          }

          // eslint-disable-next-line prefer-promise-reject-errors
          return reject({
            message: `Unable to send the email to ${message.to}`,
          });
        });
      },
    };
  },
};
