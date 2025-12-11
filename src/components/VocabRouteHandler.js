import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSidePanel } from '../context/SidePanelContext';
import { vocabulary } from '../data/vocabulary';

const VocabRouteHandler = () => {
  const { term } = useParams();
  const navigate = useNavigate();
  const { openSidePanel } = useSidePanel();

  useEffect(() => {
    if (term && vocabulary[term]) {
      const def = vocabulary[term];
      openSidePanel(def.title, def.content);
    }
    // Redirect to home so the background isn't empty/404.
    // In a real app, we might want to stay on the "previous" page, but we don't know what that is on hard refresh.
    navigate('/', { replace: true });
  }, [term, navigate, openSidePanel]);

  return null;
};

export default VocabRouteHandler;
