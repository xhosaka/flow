import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'styled-bootstrap-grid';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import PageAbout from './pages/About';

import { fetchPlaylist } from './store/ducks/playlists';

const Wrapper = styled.div`
  margin: 100px 0;
`;

const Inner = styled.div`
  background-color: ${({ theme }) => theme.colors.content};
  padding: 25px;
`;

const Layout = () => {
  const dispatch = useDispatch();
  console.log(dispatch(fetchPlaylist({ location: 'inPlayerLocation' })));
  return (
    <Wrapper>
      {/* <Container>
        <Inner>
          <Switch>
            <Route exact path="/" component={1} />
            <Route path="/playlist" component={2} />
            <Route path="/about" component={PageAbout} />
          </Switch>
        </Inner>
      </Container> */}
    </Wrapper>
  );
};

export default Layout;
