import d3 from 'd3';

export default class ForceDirectedGraphRenderer {
  renderSvg(containerElement, users) {
    const width = 900;
    const height = 500;
    const radius = 5;

    const vis = d3
      .select(containerElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const links = users
      .filter(user => {
        if (!user.manager) {
          return false;
        }

        const manager = users.find(x => x.id === user.manager);

        if (!manager) {
          console.log(`Missing manager for ${user.id} in data.`); // eslint-disable-line no-console
        }

        return !manager;
      })
      .map((user, index) => {
        const managerIndex = users.find(x => x.id === user.manager.id);

        return {
          source: index,
          target: managerIndex,
          value: 1
        };
      });

    const link = vis.selectAll('line')
        .data(links)
        .enter().append('line');

    const node = vis.selectAll('circle')
        .data(users)
        .enter().append('circle')
        .attr('r', radius);

    const force = d3.layout.force()
      .nodes(users)
      .links(links)
      .size([width, height])
      .start();

    node.call(force.drag);

    force.on('tick', () => {
      link.attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

      node.attr('cx', d => d.x)
          .attr('cy', d => d.y);
    });
  }
}
