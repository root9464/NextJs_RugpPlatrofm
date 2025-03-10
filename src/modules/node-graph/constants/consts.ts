import { Edge, Node } from '@xyflow/react';

// Функция для создания начальных элементов (нод и связей)
export function initialElements(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Определяем центр для главной ноды
  const center = { x: 0, y: 0 }; // Можно настроить в зависимости от размеров экрана

  // Главная нода (аналог "Target" из примера)
  nodes.push({
    id: '1',
    position: center,
    data: { title: 'Wallet', subline: 'то откуда' },
    type: 'turbo',
  });

  // Создаем 8 нод вокруг центральной, как в примере
  for (let i = 0; i < 8; i++) {
    const degrees = i * (360 / 8); // Угол для каждой ноды (360 / 8 = 45 градусов)
    const radians = degrees * (Math.PI / 180);
    const radius = 250; // Расстояние от центра (можно настроить)
    const x = radius * Math.cos(radians) + center.x;
    const y = radius * Math.sin(radians) + center.y;

    const nodeId = `${i + 2}`; // Начинаем с ID 2, так как 1 — это главная нода
    nodes.push({
      id: nodeId,
      position: { x, y },
      data: { title: `Node ${i + 1}`, subline: `Subline ${i + 1}` },
      type: 'turbo',
    });

    // Создаем связь между главной нодой и каждой новой нодой
    edges.push({
      id: `e1-${nodeId}`,
      source: '1', // Источник — главная нода
      target: nodeId, // Цель — новая нода
      type: 'turbo', // Используем твой кастомный тип ребра
    });
  }

  return { nodes, edges };
}

export const { nodes: initialNodes, edges: initialEdges } = initialElements();
