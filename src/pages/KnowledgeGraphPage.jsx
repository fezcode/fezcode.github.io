import React, { useEffect, useState, useRef, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { useNavigate } from 'react-router-dom';
import { fetchGraphData } from '../utils/graphDataManager';
import Loading from '../components/Loading';
import { ArrowLeftIcon, InfoIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

const KnowledgeGraphPage = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [hoverNode, setHoverNode] = useState(null);
  const fgRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchGraphData();
      setGraphData(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleNodeClick = useCallback(
    (node) => {
      if (!node) return;

      // Aim at node from outside it
      const distance = 40;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      if (fgRef.current) {
        fgRef.current.cameraPosition(
          {
            x: node.x * distRatio,
            y: node.y * distRatio,
            z: node.z * distRatio,
          }, // new position
          node, // lookAt ({ x, y, z })
          3000, // ms transition duration
        );
      }

      // Navigate logic
      setTimeout(() => {
        if (node.group === 'post') {
          navigate(`/blog/${node.slug}`);
        } else if (node.group === 'app') {
          navigate(node.to || `/apps/${node.slug}`);
        } else if (node.group === 'project') {
          navigate(`/projects/${node.slug}`);
        }
      }, 1500); // Wait for half the zoom
    },
    [navigate],
  );

  if (loading) return <Loading />;

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden">
      <Seo
        title="Fezcodex | Neural Net"
        description="A 3D visualization of the Fezcodex knowledge base."
        keywords={['graph', '3d', 'visualization', 'network', 'fezcodex']}
      />
      {/* UI Overlay */}
      <div className="absolute top-6 left-6 z-50 pointer-events-none">
        <Link
          to="/"
          className="group flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 text-white rounded-sm pointer-events-auto hover:bg-white hover:text-black transition-all"
        >
          <ArrowLeftIcon weight="bold" />
          <span className="font-mono text-xs uppercase tracking-widest">
            Exit_Sim
          </span>
        </Link>
      </div>

      <div className="absolute bottom-6 left-6 z-50 pointer-events-none text-white/50 font-mono text-xs">
        <div className="flex items-center gap-2 mb-2">
          <InfoIcon size={16} />
          <span>Double-click to center. Click to navigate.</span>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#f87171]"></span> Post
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#34d399]"></span> App
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#60a5fa]"></span> Project
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#4b5563]"></span> Tag
          </span>
        </div>
      </div>

      {hoverNode && (
        <div className="absolute top-6 right-6 z-50 max-w-xs bg-black/80 backdrop-blur-md border border-white/20 p-4 text-white font-mono pointer-events-none">
          <div className="text-xs text-emerald-500 uppercase mb-1">
            {hoverNode.group}
          </div>
          <div className="font-bold text-lg mb-2">{hoverNode.name}</div>
          {hoverNode.desc && (
            <div className="text-xs text-gray-400">
              {hoverNode.desc.substring(0, 100)}...
            </div>
          )}
        </div>
      )}

      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        backgroundColor="#050505"
        nodeLabel="name"
        nodeColor="color"
        nodeVal="val"
        onNodeClick={handleNodeClick}
        onNodeHover={setHoverNode}
        linkColor={() => '#ffffff20'}
        linkWidth={0.5}
        linkOpacity={0.2}
        enableNodeDrag={false}
      />
    </div>
  );
};

export default KnowledgeGraphPage;
