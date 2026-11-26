import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import '../../styles/Studio.css';

export default function StudioNotFoundPage() {
  return (
    <div className="std-root">
      <Seo title="Page not found | Fezcodex" />
      <div className="std-page">
        <section className="std-hero std-flow">
          <p>Page not found · 404</p>
          <h1>A little off course.</h1>
          <p>This page isn’t here. There’s plenty more to discover.</p>
          <Link className="std-button" to="/">
            Back to the codex
          </Link>
        </section>
      </div>
    </div>
  );
}
