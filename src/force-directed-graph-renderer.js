import d3 from 'd3';

export default class ForceDirectedGraphRenderer {
  renderSvg(containerElement, users) {
    const width = 1200;
    const height = 700;
    const radius = 15;

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

        const manager = users.find(x => x.id === user.manager.id);

        if (!manager) {
          console.log(`Missing manager for ${user.id} in data.`); // eslint-disable-line no-console
        }

        return !!manager;
      })
      .map((user, index) => {
        const managerIndex = users.find(x => x.id === user.manager.id);

        if (!managerIndex && managerIndex !== 0) {
          throw new Error(`managerIndex could be not found for user.manager.id: '${user.manager.id}'.`);
        }

        return {
          source: index,
          target: managerIndex,
          value: 1
        };
      });

    const link = vis.selectAll('line')
      .data(links)
      .enter().append('line');

    const node = vis.selectAll('.node')
      .data(users)
      .enter().append('g')
      .attr('class', 'node');

    node.append('circle')
      .attr('r', radius);

    node.append('text')
      .attr('text-anchor', 'middle')
      .text(x => this.getNameAbbreviation(x.displayName));

    node.append('title')
      .text(x => x.displayName);

    const force = d3.layout.force()
      .nodes(users)
      .links(links)
      .size([width, height])
      .linkDistance(30)
      .charge(-400)
      .gravity(0.3)
      .start();

    node.call(force.drag);

    force.on('tick', () => {
      link.attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

      d3.selectAll('circle')
          .attr('cx', d => Math.max(radius, Math.min(width - radius, d.x)))
          .attr('cy', d => Math.max(radius, Math.min(height - radius, d.y)));

      d3.selectAll('text')
        // TODO: Fix labels at svg edges
        .attr('x', d => d.x)
        .attr('y', d => d.y + 5);
    });
  }

  getNameAbbreviation(displayName) {
    const split = displayName.split(' ');

    if (split.length > 0) {
      const givenName = split[0];
      const surName = split[1];

      const firstLetter = givenName ? givenName[0] : '?';
      const secondLetter = surName ? surName[0] : '';

      return `${firstLetter}${secondLetter}`;
    }
  }
}
