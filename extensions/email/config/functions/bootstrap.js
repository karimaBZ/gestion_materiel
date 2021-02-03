/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 */
const { get, find, uniq } = require('lodash');

module.exports = async () => {
  // set default provider
  const { MAILER_PROVIDER: defaultProvider } = process.env;

  // set plugin store
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: 'plugin',
    name: 'email',
  });

  strapi.plugins.email.config.providers = [];

  const installedProviders = Object.keys(strapi.config.info.dependencies)
    .filter(d => d.includes('strapi-provider-email-'))
    .concat('strapi-provider-email-sendmail');

  uniq(installedProviders).forEach(installedProvider =>
    // eslint-disable-next-line global-require,import/no-dynamic-require
    strapi.plugins.email.config.providers.push(require(installedProvider)),
  );

  //--------------------------------------------------------------------
  // if no existing config or not the preferred provider update it
  //-------------------------------------------------------------------
  const provider = await pluginStore.get({ key: 'provider' });
  const providerName = get(provider, 'provider', null);

  if (!provider || providerName !== defaultProvider) {
    const toPersistProvider = find(strapi.plugins.email.config.providers, {
      provider: defaultProvider,
    });
    await pluginStore.set({
      key: 'provider',
      value: { ...toPersistProvider },
    });
  }
};
