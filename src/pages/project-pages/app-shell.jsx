import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../../utils/projectParser';
import Seo from '../../components/Seo';
import Loading from '../../components/Loading';

/* ============================================================
 * Shared plumbing for the per-project application themes.
 *
 * Every desktop-app project keeps its content in
 * /projects/<slug>/app.txt. Each theme reads the same schema and
 * presents it in its own visual language, so the copy stays in one
 * place and only the presentation differs.
 * ============================================================ */

export const useAppConfig = () => {
  const { slug } = useParams();
  const { projects, loading: loadingProjects } = useProjects();
  const [cfg, setCfg] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!slug) return undefined;
    let alive = true;
    fetch(`/projects/${slug}/app.txt`)
      .then((res) => {
        if (!res.ok) throw new Error(`app.txt missing for ${slug}`);
        return res.json();
      })
      .then((data) => alive && setCfg(data))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [slug]);

  return {
    slug,
    cfg,
    failed,
    project: projects.find((p) => p.slug === slug),
    loading: loadingProjects || (!cfg && !failed),
  };
};

/** Inject a theme's webfonts once per document. */
export const useThemeFonts = (href, key) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.querySelector(`link[data-theme-fonts="${key}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-theme-fonts', key);
    document.head.appendChild(link);
  }, [href, key]);
};

export const AppLoading = () => <Loading />;

export const AppMissing = ({ background = '#101418', color = '#E8ECF0' }) => (
  <div
    className="min-h-screen flex items-center justify-center px-6 text-center"
    style={{ background, color }}
  >
    <div>
      <p className="mb-4">This project has no app.txt yet.</p>
      <Link to="/projects" className="underline">
        Back to projects
      </Link>
    </div>
  </div>
);

export const AppSeo = ({ cfg, project }) => (
  <Seo
    title={`${cfg.name} | Fezcodex`}
    description={cfg.tagline || project?.shortDescription}
    image={project?.image}
    keywords={project?.technologies}
  />
);

/** Back-to-projects link, styled by the caller. */
export const BackLink = ({ color, label = 'Projects', className = '' }) => (
  <Link
    to="/projects"
    className={`inline-flex items-center gap-2 text-[13px] hover:opacity-100 ${className}`}
    style={{ color, opacity: 0.72 }}
  >
    <span aria-hidden>&larr;</span>
    {label}
  </Link>
);

/** Meta row shared by several themes: version, platforms, stack. */
export const metaItems = (cfg) => [
  ...(cfg.version ? [`v${cfg.version}`] : []),
  ...(cfg.platforms || []),
  ...(cfg.stack || []),
];
