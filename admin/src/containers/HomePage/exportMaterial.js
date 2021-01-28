import React, { useState } from "react";
import moment from 'moment';
import styled from 'styled-components';
import CustomInputDate from '../../components/CustomInputDate';
import {
  Block,
  Container,
} from './components';

const Wrapper = styled.div`   
      input {
        margin-top: 0;
        padding-top: 0;
      }
      .form__link {
          margin-left: 1rem;
          margin-top: 9px;
          padding: .4rem;
          max-width: 100%;
          overflow: hidden;
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
          min-width: 14rem;
          font-weight: 500;
          background:
          rgba(0, 0, 0, 0) linear-gradient(315deg, rgb(0, 151, 246) 0%,
          rgb(0, 94, 234) 100%) repeat scroll 0 0;
          color:white;
      }
`;

const ExportMaterial = () => {
  const [dateRange, setDateRange] = useState({start : moment(null), end: moment(null) });
  const exportUrl= 'strapi-export/export-material';
  return (
    <Wrapper>
        <Container>
          <Block>
          <h1>Exporter la liste de matériel</h1>
            <p>Veuillez choisir l'intervalle de temps ou exporter toutes les données : </p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <CustomInputDate name="start" placeholder="du" value={dateRange.start} onChange={({ target: { value } }) => setDateRange({ ...dateRange, start: moment(value)})}/>
                <CustomInputDate name="end" placeholder="au"  value={dateRange.end}  onChange={({ target: { value } }) => setDateRange({ ...dateRange, end: moment(value) })} />
              {!dateRange.start.isValid() && !dateRange.end.isValid()  ?
                <a target="_blank" className="form__link" href={`${strapi.backendURL}/${exportUrl}`}>Exporter</a>
              : (
                <a className="form__link"
                   target="_blank"
                   {...(!(dateRange.start.isSameOrBefore(dateRange.end))
                     ? { style: { background: 'red' } }
                     : { href: `${strapi.backendURL}/${exportUrl}?start=${dateRange.start.format()}&end=${dateRange.end.format()}` })}
                >
                  {!(dateRange.start.isSameOrBefore(dateRange.end)) ? 'Interval du temps Invalid' : 'Exporter un extrait'}
                </a>
                )
              }
            </div>
          </Block>
        </Container>
    </Wrapper>
  );
};

export default ExportMaterial;
