/*
 *
 * HomePage
 *
 */
/* eslint-disable */
import React, { memo, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { get, upperFirst } from 'lodash';
import { auth, LoadingIndicatorPage   } from 'strapi-helper-plugin';
import PageTitle from '../../components/PageTitle';
import { useModels } from '../../hooks';
import { Block, Container } from './components';
import ShortCuts from './ShortCuts';
import ExportMaterial from './exportMaterial'

const HomePage = ({ }) => {

  const { collectionTypes, singleTypes, isLoading: isLoadingForModels } = useModels();


  const hasAlreadyCreatedContentTypes = useMemo(() => {
    const filterContentTypes = contentTypes => contentTypes.filter(c => c.isDisplayed);

    return (
      filterContentTypes(collectionTypes).length > 1 || filterContentTypes(singleTypes).length > 0
    );
  }, [collectionTypes, singleTypes]);

  if (isLoadingForModels) {
    return <LoadingIndicatorPage />;
  }

  const headerId = hasAlreadyCreatedContentTypes
    ? 'HomePage.greetings'
    : 'app.components.HomePage.welcome';

  const firstname = get(auth.getUserInfo(), 'firstname', '');
  const lastname = get(auth.getUserInfo(), 'lastname', '');

  return (
    <>
      <FormattedMessage id="HomePage.helmet.title">
        {title => <PageTitle title={title} />}
      </FormattedMessage>
      <Container className="container-fluid">
        <div className="row">
          <div className="col-lg-8 col-md-12">
            <Block>
            <FormattedMessage
                id={headerId}
                values={{
                  name: upperFirst(firstname)+" "+ upperFirst(lastname),
                }}
              > 
                {msg => <h2 id="mainHeader">{msg}</h2>}
              </FormattedMessage>
              <ShortCuts /> 
            </Block>
            <Block>
            <ExportMaterial />
            </Block>
          </div>
        </div>
      </Container>
    </>
  );
};

export default memo(HomePage);
