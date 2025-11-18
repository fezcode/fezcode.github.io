import useSeo from '../hooks/useSeo';

const Seo = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  twitterCard,
  twitterTitle,
  twitterDescription,
  twitterImage,
}) => {
  useSeo({
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
  });

  return null;
};

export default Seo;
