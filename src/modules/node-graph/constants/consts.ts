import { GraphEdge, GraphNode, Theme } from 'reagraph';

const nodes: GraphNode[] = [
  { id: '0', label: 'Node 0' },
  { id: '1', label: 'Node 1' },
  { id: '2', label: 'Node 2' },
  { id: '3', label: 'Node 3' },
  { id: '4', label: 'Node 4' },
  { id: '6', label: 'Node 6' },
  { id: '7', label: 'Node 7' },
  { id: '8', label: 'Node 8' },
  { id: '9', label: 'Node 9' },
  { id: '10', label: 'Node 10' },
  { id: '11', label: 'Node 11' },
];

const edges: GraphEdge[] = [
  { source: '0', target: '1', id: '0-1', label: '0-1' },
  { source: '0', target: '2', id: '0-2', label: '0-2' },
  { source: '0', target: '3', id: '0-3', label: '0-3' },
  { source: '0', target: '4', id: '0-4', label: '0-4' },
  { source: '2', target: '6', id: '2-6', label: '2-6' },
  { source: '2', target: '7', id: '2-7', label: '2-7' },
  { source: '3', target: '8', id: '3-8', label: '3-8' },
  { source: '6', target: '9', id: '6-9', label: '6-9' },
  { source: '7', target: '10', id: '7-10', label: '7-10' },
  { source: '8', target: '11', id: '8-11', label: '8-11' },
];

const theme: Theme = {
  canvas: {
    background: 'rgba(9, 12, 20, 1)',
    fog: '#1E2026',
  },
  node: {
    fill: 'blue',
    activeFill: 'rgb(192,21,252)',
    opacity: 1,
    selectedOpacity: 1,
    inactiveOpacity: 0.3,
    label: {
      color: 'rgb(65, 74, 96)',
      activeColor: 'rgb(192,21,252)',
    },
  },
  edge: {
    fill: '#54616D',
    activeFill: 'rgb(192,21,252)',
    opacity: 1,
    selectedOpacity: 1,
    inactiveOpacity: 0.3,
    label: {
      color: 'rgb(65, 74, 96)',
      activeColor: 'blue',
    },
  },
  ring: {
    fill: '',
    activeFill: '',
  },
  arrow: {
    fill: '#414a60',
    activeFill: 'rgb(192,21,252)',
  },
  lasso: {
    background: '',
    border: '',
  },
};

export { edges, nodes, theme };
