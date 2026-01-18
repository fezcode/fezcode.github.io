import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  LayoutIcon,
  DatabaseIcon,
  PlusIcon,
  TrashIcon,
  SlidersIcon,
  TrendUpIcon,
  FileSvgIcon,
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import domtoimage from 'dom-to-image-more';
import Seo from '../../components/Seo';
import CustomDropdown from '../../components/CustomDropdown';
import CustomSlider from '../../components/CustomSlider';
import CustomColorPicker from '../../components/CustomColorPicker';
import CustomToggle from '../../components/CustomToggle';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import { useToast } from '../../hooks/useToast';

const CHART_TYPES = [
  { label: 'Box Plot (Statistical)', value: 'box' },
  { label: 'Frequency Dots', value: 'dot' },
  { label: 'Brutalist Bar', value: 'bar' },
  { label: 'Metric Signal (Line)', value: 'line' },
  { label: 'Pie Chart', value: 'pie' },
];

const INITIAL_DATA = [
  {
    label: 'Horror',
    value: 6.2,
    min: 4.5, q1: 5.8, median: 6.2, q3: 6.8, max: 8.5,
    color: '#f87171'
  },
  {
    label: 'Sci-Fi',
    value: 7.1,
    min: 5.2, q1: 6.5, median: 7.1, q3: 7.8, max: 9.2,
    color: '#3b82f6'
  },
  {
    label: 'Drama',
    value: 7.8,
    min: 6.0, q1: 7.2, median: 7.8, q3: 8.4, max: 9.8,
    color: '#10b981'
  },
];

// --- Visualizers ---

const BauhausGrid = () => (
  <div
    className="absolute inset-0 pointer-events-none opacity-[0.02]"
    style={{
      backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
      backgroundSize: '40px 40px'
    }}
  />
);

const BoxPlotVis = ({ data, params }) => {
  const allValues = data.flatMap(d => [d.min, d.max]);
  const gMin = Math.min(...allValues) * 0.9;
  const gMax = Math.max(...allValues) * 1.1;
  const gRange = gMax - gMin;

  const mapY = (val) => 360 - ((val - gMin) / (gRange || 1)) * 320;
  const boxWidth = params.boxWidth || 40;

  return (
    <svg viewBox="0 0 800 400" className="w-full h-full font-mono" xmlns="http://www.w3.org/2000/svg">
      {data.map((item, i) => {
        const x = 400 + (i - (data.length - 1) / 2) * (600 / (data.length || 1));

        const yMin = mapY(item.min);
        const yQ1 = mapY(item.q1);
        const yMed = mapY(item.median);
        const yQ3 = mapY(item.q3);
        const yMax = mapY(item.max);

        return (
          <g key={i} className="group">
            <line x1={x} y1={yMin} x2={x} y2={yMax} stroke={item.color} strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
            <line x1={x - 10} y1={yMin} x2={x + 10} y2={yMin} stroke={item.color} strokeWidth="1" />
            <line x1={x - 10} y1={yMax} x2={x + 10} y2={yMax} stroke={item.color} strokeWidth="1" />
            <motion.rect
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              x={x - boxWidth / 2}
              y={Math.min(yQ1, yQ3)}
              width={boxWidth}
              height={Math.max(1, Math.abs(yQ1 - yQ3))}
              fill={item.color}
              fillOpacity="0.1"
              stroke={item.color}
              strokeWidth="2"
            />
            <line x1={x - boxWidth / 2} y1={yMed} x2={x + boxWidth / 2} y2={yMed} stroke={item.color} strokeWidth="3" />

            {params.showValues && (
                <g style={{ fontFamily: 'monospace', fontSize: '7px', fill: 'white', opacity: 0.6 }}>
                    <text x={x + boxWidth/2 + 4} y={yMax} dominantBaseline="middle">{item.max}</text>
                    <text x={x + boxWidth/2 + 4} y={yQ3} dominantBaseline="middle">{item.q3}</text>
                    <text x={x + boxWidth/2 + 4} y={yMed} dominantBaseline="middle" style={{ fill: item.color, fontWeight: 'bold' }}>{item.median}</text>
                    <text x={x + boxWidth/2 + 4} y={yQ1} dominantBaseline="middle">{item.q1}</text>
                    <text x={x + boxWidth/2 + 4} y={yMin} dominantBaseline="middle">{item.min}</text>
                </g>
            )}

            <text x={x} y="385" fill="white" textAnchor="middle" fontSize="10" letterSpacing="0.1em" opacity="0.4" style={{ textTransform: 'uppercase' }}>{item.label}</text>

            {!params.showValues && (
                <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <text x={x + boxWidth/2 + 10} y={yMed} fill={item.color} fontSize="10" fontWeight="bold">MED: {item.median}</text>
                    <text x={x + boxWidth/2 + 10} y={yQ3} fill="white" fontSize="8" opacity="0.5">Q3: {item.q3}</text>
                    <text x={x + boxWidth/2 + 10} y={yQ1} fill="white" fontSize="8" opacity="0.5">Q1: {item.q1}</text>
                </g>
            )}
          </g>
        );
      })}
      <line x1="80" y1="40" x2="80" y2="360" stroke="white" strokeWidth="1" opacity="0.1" />
      <text x="70" y="45" fill="white" opacity="0.2" fontSize="8" textAnchor="end">MAX={gMax.toFixed(1)}</text>
      <text x="70" y="365" fill="white" opacity="0.2" fontSize="8" textAnchor="end">MIN={gMin.toFixed(1)}</text>
    </svg>
  );
};

const DotPlotVis = ({ data, params }) => {
  const points = useMemo(() => {
    return data.flatMap((item, idx) => {
      const count = Math.floor(item.value * params.density);
      const spacing = 400 / (params.density * 10);
      const centerX = 400 + (idx - (data.length - 1) / 2) * (600 / (data.length || 1));
      return Array.from({ length: count }, (_, i) => ({
        id: `${idx}-${i}`,
        x: centerX + (params.jitter ? (Math.random() - 0.5) * 20 : 0),
        y: 320 - (i * spacing),
        color: item.color
      }));
    });
  }, [data, params.density, params.jitter]);

  return (
    <svg viewBox="0 0 800 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {points.map((p) => (
        <motion.circle
          key={p.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.8, scale: 1 }}
          cx={p.x}
          cy={p.y}
          r="3"
          fill={p.color}
        />
      ))}
      {data.map((item, i) => {
        const x = 400 + (i - (data.length - 1) / 2) * (600 / (data.length || 1));
        return (
          <text key={i} x={x} y="360" fill="white" textAnchor="middle" fontSize="10" letterSpacing="0.1em" opacity="0.4" style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}>{item.label}</text>
        );
      })}
    </svg>
  );
};

const BarChartVis = ({ data }) => {
  const max = Math.max(...data.map(d => d.value));

  return (
    <svg viewBox="0 0 800 400" className="w-full h-full font-mono" xmlns="http://www.w3.org/2000/svg">
      {data.map((item, i) => {
        const barWidth = 500 / (data.length || 1);
        const xOffset = 400 - (500 / 2);
        const x = xOffset + i * barWidth;
        const h = (item.value / (max || 1)) * 250;

        return (
          <g key={i} className="group">
            <motion.rect
              initial={{ height: 0, y: 320 }}
              animate={{ height: h, y: 320 - h }}
              x={x + 10}
              width={barWidth - 20}
              fill={item.color}
              fillOpacity="0.8"
            />
            <text x={x + barWidth/2} y="350" fill="white" textAnchor="middle" fontSize="10" letterSpacing="0.1em" opacity="0.4" style={{ textTransform: 'uppercase' }}>{item.label}</text>
            <text x={x + barWidth/2} y={320 - h - 10} fill={item.color} textAnchor="middle" fontSize="12" fontWeight="black">{item.value}</text>
          </g>
        );
      })}
    </svg>
  );
};

const LineGraphVis = ({ data, params }) => {
  const max = Math.max(...data.map(d => d.value));
  const points = data.map((d, i) => ({
    x: 400 + (i - (data.length - 1) / 2) * (600 / (data.length - 1 || 1)),
    y: 320 - (d.value / (max || 1)) * 200,
    color: d.color
  }));

  const pathD = points.length > 0 ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}` : '';
  const areaD = points.length > 0 ? `${pathD} L ${points[points.length-1].x},320 L ${points[0].x},320 Z` : '';

  return (
    <svg viewBox="0 0 800 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={params.metricAreaColor || "#ffffff"} stopOpacity="0.2" />
          <stop offset="100%" stopColor={params.metricAreaColor || "#ffffff"} stopOpacity="0" />
        </linearGradient>
      </defs>
      {params.showArea && points.length > 1 && (
        <motion.path initial={{ opacity: 0 }} animate={{ opacity: 1 }} d={areaD} fill="url(#lineGrad)" />
      )}
      {points.length > 1 && (
        <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} d={pathD} fill="none" stroke={params.metricLineColor || "#ffffff"} strokeWidth="2" opacity="0.3" />
      )}
      {points.map((p, i) => (
        <g key={i}>
          <motion.circle initial={{ r: 0 }} animate={{ r: 6 }} cx={p.x} cy={p.y} fill={p.color} />
          <text x={p.x} y="350" fill="white" textAnchor="middle" fontSize="9" letterSpacing="0.1em" opacity="0.4" style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}>{data[i].label}</text>
          <text x={p.x} y={p.y - 15} fill={p.color} textAnchor="middle" fontSize="12" fontWeight="bold" style={{ fontFamily: 'monospace' }}>{data[i].value}</text>
        </g>
      ))}
    </svg>
  );
};

const PieChartVis = ({ data, params }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  let currentAngle = 0;

  return (
    <svg viewBox="0 0 800 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(400, 200)">
        {data.map((item, i) => {
          const sliceAngle = (item.value / (total || 1)) * Math.PI * 2;
          const x1 = Math.cos(currentAngle) * 150;
          const y1 = Math.sin(currentAngle) * 150;
          const x2 = Math.cos(currentAngle + sliceAngle) * 150;
          const y2 = Math.sin(currentAngle + sliceAngle) * 150;
          const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
          const pathData = `M 0 0 L ${x1} ${y1} A 150 150 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
          const labelAngle = currentAngle + sliceAngle / 2;
          const lx = Math.cos(labelAngle) * 180;
          const ly = Math.sin(labelAngle) * 180;
          currentAngle += sliceAngle;

          return (
            <g key={i} className="group">
              <motion.path initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 0.8, rotate: 0 }} whileHover={{ opacity: 1, scale: 1.05 }} d={pathData} fill={item.color} stroke="#000" strokeWidth="1" />
              <text
                x={lx} y={ly} fill="white" textAnchor={lx > 0 ? "start" : "end"} fontSize="10"
                style={{
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    opacity: params.showLabels ? 1 : 0,
                    transition: 'opacity 0.2s'
                }}
                className={params.showLabels ? '' : 'group-hover:opacity-100'}
              >
                {item.label} ({((item.value/(total||1))*100).toFixed(1)}%)
              </text>
            </g>
          );
        })}
        <circle r="40" fill="#050505" stroke="white" strokeWidth="1" opacity="0.1" />
      </g>
    </svg>
  );
};

// --- Main Component ---

const DataPrismPage = () => {
  const [data, setData] = useState(INITIAL_DATA);
  const [chartType, setChartType] = useState('box');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const visContainerRef = useRef(null);
  const { addToast } = useToast();

  const [visualParams, setVisualParams] = useState({
    boxWidth: 40,
    iqrMultiplier: 1.2,
    showOutliers: true,
    density: 8,
    jitter: false,
    showArea: true,
    showLabels: false,
    showValues: false,
    metricLineColor: '#ffffff',
    metricAreaColor: '#ffffff'
  });

  const updateNodeField = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = field === 'label' || field === 'color' ? value : parseFloat(value) || 0;
    setData(newData);
  };

  const handleAddNode = () => {
    const colors = ['#f87171', '#3b82f6', '#10b981', '#fb923c', '#ffffff', '#a78bfa', '#ec4899'];
    setData([...data, { label: 'New Node', value: 5.0, min: 2, q1: 4, median: 5, q3: 7, max: 9, color: colors[data.length % colors.length] }]);
  };

  const handleRemoveNode = (index) => {
    if (data.length <= 1) return;
    setData(data.filter((_, i) => i !== index));
  };

  const handleExportSVG = () => {
    if (!visContainerRef.current) return;

    domtoimage.toSvg(visContainerRef.current, {
        bgcolor: '#050505',
        width: 1600,
        height: 800,
        style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px'
        }
    })
    .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `fezcodex-prism-${chartType}.svg`;
        link.href = dataUrl;
        link.click();
        addToast({ title: 'EXPORT_SVG', message: 'Vector artifact saved.', type: 'success' });
    })
    .catch((error) => {
        console.error('SVG Export Failed:', error);
        addToast({ title: 'EXPORT_ERROR', message: 'SVG generation failed.', type: 'error' });
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f4] flex flex-col font-sans selection:bg-emerald-500/30 overflow-hidden">
      <Seo title="Data Prism | Fezcodex" description="Statistical visualization laboratory." />

      <header className="p-6 border-b border-white/10 flex justify-between items-center bg-[#080808] z-30">
        <div className="flex items-center gap-6">
          <Link to="/apps" className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500">
            <ArrowLeftIcon size={20} weight="bold" />
          </Link>
          <BreadcrumbTitle title="Data Prism" breadcrumbs={['fc', 'lab', 'metrics']} variant="brutalist" />
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsPanelOpen(!isPanelOpen)} className={`p-3 border rounded-sm transition-colors ${isPanelOpen ? 'bg-emerald-500 text-black border-emerald-500' : 'border-white/10 text-gray-500 hover:text-white'}`}>
            <DatabaseIcon size={20} weight="bold" />
          </button>
          <button onClick={handleExportSVG} className="flex items-center gap-2 px-4 py-2 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-emerald-400 transition-colors">
            <FileSvgIcon size={16} weight="bold" />
            <span>Export SVG</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <AnimatePresence>
          {isPanelOpen && (
            <motion.aside initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} className="w-80 border-r border-white/10 bg-[#080808] flex flex-col z-20 overflow-hidden">
              <div className="p-6 space-y-8 overflow-y-auto no-scrollbar pb-2 flex-1">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2"><LayoutIcon size={14} /> Visualization_Type</h3>
                  <CustomDropdown variant="brutalist" fullWidth options={CHART_TYPES} value={chartType} onChange={setChartType} />
                </div>

                <div className="space-y-6 pt-6 border-t border-white/5">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2"><SlidersIcon size={14} /> Visual_Params</h3>
                    {chartType === 'box' && (
                        <div className="space-y-4">
                            <CustomSlider label="Box Width" value={visualParams.boxWidth} onChange={(v) => setVisualParams({...visualParams, boxWidth: v})} min={10} max={100} />
                            <CustomToggle label="Show Values" checked={visualParams.showValues} onChange={() => setVisualParams({...visualParams, showValues: !visualParams.showValues})} />
                        </div>
                    )}
                    {chartType === 'dot' && (
                        <CustomSlider label="Particle Density" value={visualParams.density} onChange={(v) => setVisualParams({...visualParams, density: v})} min={2} max={20} />
                    )}
                    {chartType === 'line' && (
                        <div className="space-y-4">
                            <CustomToggle label="Fill Area" checked={visualParams.showArea} onChange={() => setVisualParams({...visualParams, showArea: !visualParams.showArea})} />
                            <CustomColorPicker variant="brutalist" label="Line Color" value={visualParams.metricLineColor} onChange={(val) => setVisualParams({...visualParams, metricLineColor: val})} />
                            <CustomColorPicker variant="brutalist" label="Area Color" value={visualParams.metricAreaColor} onChange={(val) => setVisualParams({...visualParams, metricAreaColor: val})} />
                        </div>
                    )}
                    {chartType === 'pie' && (
                        <CustomToggle label="Always Show Labels" checked={visualParams.showLabels} onChange={() => setVisualParams({...visualParams, showLabels: !visualParams.showLabels})} />
                    )}
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2"><TrendUpIcon size={14} /> Dataset_Nodes</h3>
                    <button onClick={handleAddNode} className="text-emerald-500 hover:text-emerald-400 p-1"><PlusIcon size={16} weight="bold" /></button>
                  </div>

                  <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                    {data.map((item, i) => (
                      <div key={i} className="p-4 bg-white/5 border border-white/5 space-y-4 group rounded-sm">
                        <div className="flex justify-between items-center">
                          <input value={item.label} onChange={(e) => updateNodeField(i, 'label', e.target.value)} className="bg-transparent border-none text-[10px] font-mono text-white focus:ring-0 uppercase tracking-widest w-full font-bold" />
                          <button onClick={() => handleRemoveNode(i)} className="text-red-500 opacity-30 group-hover:opacity-100 transition-opacity"><TrashIcon size={14} /></button>
                        </div>

                        {chartType === 'box' ? (
                            <div className="grid grid-cols-2 gap-2">
                                <MetricInput label="MIN" value={item.min} onChange={(v) => updateNodeField(i, 'min', v)} />
                                <MetricInput label="MAX" value={item.max} onChange={(v) => updateNodeField(i, 'max', v)} />
                                <MetricInput label="Q1" value={item.q1} onChange={(v) => updateNodeField(i, 'q1', v)} />
                                <MetricInput label="Q3" value={item.q3} onChange={(v) => updateNodeField(i, 'q3', v)} />
                                <div className="col-span-2">
                                    <MetricInput label="MEDIAN" value={item.median} onChange={(v) => updateNodeField(i, 'median', v)} highlight />
                                </div>
                            </div>
                        ) : (
                            <MetricInput label="VALUE" value={item.value} onChange={(v) => updateNodeField(i, 'value', v)} />
                        )}
                        <CustomColorPicker variant="brutalist" label="Node Color" value={item.color} onChange={(val) => updateNodeField(i, 'color', val)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <main className="flex-1 relative bg-black flex items-center justify-center p-8 md:p-20">
          <BauhausGrid />
          <div
            ref={visContainerRef}
            className="w-full h-full max-w-6xl relative flex items-center justify-center border border-white/5 bg-white/[0.01] overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div key={chartType} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex items-center justify-center">
                {chartType === 'box' && <BoxPlotVis data={data} params={visualParams} />}
                {chartType === 'dot' && <DotPlotVis data={data} params={visualParams} />}
                {chartType === 'bar' && <BarChartVis data={data} />}
                {chartType === 'line' && <LineGraphVis data={data} params={visualParams} />}
                {chartType === 'pie' && <PieChartVis data={data} params={visualParams} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

const MetricInput = ({ label, value, onChange, highlight }) => (
    <div className="space-y-1">
        <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest block">{label}</span>
        <input
            type="number" step="0.1" value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full bg-black border ${highlight ? 'border-emerald-500/50 text-emerald-400' : 'border-white/10 text-gray-400'} px-2 py-1 font-mono text-[10px] outline-none transition-colors`}
        />
    </div>
);

export default DataPrismPage;
