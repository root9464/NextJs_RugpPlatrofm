import { Edge, Node } from '@xyflow/react';

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { title: 'Wallet', subline: 'то откуда' },
    type: 'turbo',
  },
  {
    id: '2',
    position: { x: 250, y: -100 },
    data: { title: '1', subline: '1' },
    type: 'turbo',
  },
  {
    id: '3',
    position: { x: 250, y: 0 },
    data: { title: '2', subline: '2' },
    type: 'turbo',
  },
  {
    id: '4',
    position: { x: 250, y: 100 },
    data: { title: '3', subline: '3' },
    type: 'turbo',
  },
  {
    id: '5',
    position: { x: 500, y: -150 },
    data: { title: '4', subline: '4' },
    type: 'turbo',
  },
  {
    id: '6',
    position: { x: 500, y: -50 },
    data: { title: '5', subline: '5' },
    type: 'turbo',
  },
  {
    id: '7',
    position: { x: 500, y: 50 },
    data: { title: '6', subline: '6' },
    type: 'turbo',
  },
  {
    id: '8',
    position: { x: 750, y: -100 },
    data: { title: '7' },
    type: 'turbo',
  },
  {
    id: '9',
    position: { x: 750, y: 50 },
    data: { title: '7' },
    type: 'turbo',
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'step' },
  { id: 'e1-3', source: '1', target: '3', type: 'step' },
  { id: 'e1-4', source: '1', target: '4', type: 'step' },
  { id: 'e2-5', source: '2', target: '5', type: 'step' },
  { id: 'e2-6', source: '2', target: '6', type: 'step' },
  { id: 'e3-7', source: '3', target: '7', type: 'step' },
  { id: 'e5-8', source: '5', target: '8', type: 'step' },
  { id: 'e6-8', source: '6', target: '8', type: 'step' },
  { id: 'e7-9', source: '7', target: '9', type: 'step' },
];

export { initialEdges, initialNodes };
