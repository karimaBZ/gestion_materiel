import React from "react";
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  Container,
} from './components';


const Wrapper = styled.div`
      
      input {
        margin-top: 0;
        padding-top: 0;
      }
      .btns__container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        
          .form__link {
              display: inline-block;
              margin-left: 1rem;
              margin-top: 9px;
              padding: .4rem 1rem;
              text-overflow: ellipsis;
              text-align: center;
              height: 3rem;
              position: relative;
              border-radius: 0.3rem;
              white-space: nowrap;
              margin-right: 1.8rem;
              line-height: 26px;
              font-size: 13px;
              cursor: pointer;
              font-family: Lato, sans-serif;
              font-weight: 500;
              background:
              rgba(0, 0, 0, 0) linear-gradient(315deg, rgb(0, 151, 246) 0%,
              rgb(0, 94, 234) 100%) repeat scroll 0 0;
              color:white;
            }
      }
`;




const ShortCuts = () => {
  const history = useHistory();
  return (
    <Wrapper>
      <Container>
        <h1>Raccourcis</h1>
        <p>Des raccourcis pour vous faciliter la vie: </p>
        <div className="btns__container">
          <button className="form__link" onClick={() => history.push('/plugins/content-manager/collectionType/application::material.material')} >Gérer les matériels</button>
          <button className="form__link" onClick={() => history.push('/plugins/content-manager/collectionType/application::employeur.employeur')} >Gérer les employés</button>
        </div>
      </Container>
    </Wrapper>
  );
};

export default ShortCuts;
