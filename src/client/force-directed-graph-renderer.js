/* eslint-disable no-magic-numbers */

import AppEvents from './app-events';
import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';
import md5 from 'md5';

export default class ForceDirectedGraphRenderer {
  constructor(containerElement, showLegend = true) {
    this.appEvents = new AppEvents();
    this.containerElement = containerElement;
    this.showLegend = showLegend;
  }

  render(users) {
    this.wireGroupingEvents();

    const width = 1000;
    const height = 700;
    const radius = 15;

    const vis = d3
      .select(this.containerElement)
      .append('div')
      .classed('svg-container', true)
      .append('svg')
      .classed('svg-content-responsive', true)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${width} ${height}`);

    const defs = d3
      .select(this.containerElement)
      .select('svg')
      .append('defs');

    // http://www.sawyerh.com/writing/generating-black-and-white-images-with-svg/
    d3
      .select(this.containerElement)
      .select('svg')
      .append('filter')
      .attr('id', 'grayscale')
      .append('feColorMatrix')
      .attr('type', 'saturate')
      .attr('values', '0');

    const links = [];

    users.forEach((user, userIndex) => {
      if (user.manager) {
        const manager = users.find(x => x.id === user.manager.id);

        if (manager) {
          const managerIndex = users.findIndex(x => x.id === manager.id);

          links.push({
            source: userIndex,
            target: managerIndex
          });
        } else {
          // eslint-disable-next-line no-console
          console.log(`Missing manager for ${user.displayName} (${user.id}) in data.`);
        }
      }
    });

    const link = vis.selectAll('line')
      .data(links)
      .enter().append('line');

    const node = vis.selectAll('.node')
      .data(users)
      .enter().append('g')
      .attr('class', 'node')
      .on('click', d => this.onNodeClick(d));

    node.append('circle')
      .attr('r', d => {
        d.radiusMultiplier = 1;

        if (!d.manager) {
          d.radiusMultiplier = 1.6;
        } else {
          const atLeastOneDirectReport = users.some(x => x.manager && x.manager.id === d.id);

          const manager = users.find(x => x.id === d.manager.id);

          if (!manager.manager && atLeastOneDirectReport) {
            d.radiusMultiplier = 1.5;
          } else if (atLeastOneDirectReport) {
            d.radiusMultiplier = 1.2;
          }
        }

        return radius * d.radiusMultiplier;
      });

    this.updateGrouping();
    Array.from(document.querySelectorAll('#js-group-by-container input'))
      .forEach(x => (x.onclick = () => this.updateGrouping()));

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('class', 'circle-text')
      .text(x => this.getNameAbbreviation(x.displayName));

    const circleImageStrokeBorderPx = 4;

    // Add items to svg defs for every .circle-image to perform image rounding
    node.data().forEach(d => {
      defs.append('rect')
        .attr('id', `clip-rect-${d.id}`)
        .attr('width', radius * 2 * d.radiusMultiplier - circleImageStrokeBorderPx * 2)
        .attr('height', radius * 2 * d.radiusMultiplier - circleImageStrokeBorderPx * 2)
        .attr('rx', '100%')
        .attr('ry', '100%');

      defs.append('clipPath')
        .attr('id', `clip-${d.id}`)
        .append('use')
        .attr('xlink:href', `#clip-rect-${d.id}`);
    });

    node.append('image')
      .attr('class', 'circle-image')
      .attr('xlink:href', d => `image?email=${d.email}`)
      .attr('clip-path', d => `url(#clip-${d.id})`)
      .attr('onerror', 'this.style.display = "none"') // Adapted from http://stackoverflow.com/a/3236110
      .attr('width', d => radius * 2 * d.radiusMultiplier - circleImageStrokeBorderPx * 2)
      .attr('height', d => radius * 2 * d.radiusMultiplier - circleImageStrokeBorderPx * 2);

    const forceSimultation = d3.forceSimulation(users)
      .force('charge', d3.forceManyBody().strength(-60))
      .force('link', d3.forceLink(links).distance(30).strength(0.3))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(d => radius * d.radiusMultiplier + 1.0))
      .force('x', d3.forceX().strength(0.04))
      .force('y', d3.forceY().strength(0.04));

    forceSimultation.on('tick', () => {
      link.attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

      d3.selectAll('circle')
          .attr('cx', d => Math.max(radius, Math.min(width - radius, d.x)))
          .attr('cy', d => Math.max(radius, Math.min(height - radius, d.y)));

      d3.selectAll('.circle-text')
        .attr('x', d => Math.max(radius, Math.min(width - radius, d.x)))
        .attr('y', d => Math.max(radius, Math.min(height - radius, d.y)) + 5);

      d3.selectAll('.circle-image')
        .attr('x', d => {
          const value = Math.max(radius, Math.min(width - radius, d.x))
            - radius * d.radiusMultiplier
            + circleImageStrokeBorderPx;

          d3.select(`#clip-rect-${d.id}`)
            .attr('x', value);

          return value;
        })
        .attr('y', d => {
          const value = Math.max(radius, Math.min(height - radius, d.y))
            - radius * d.radiusMultiplier
            + circleImageStrokeBorderPx;

          d3.select(`#clip-rect-${d.id}`)
            .attr('y', value);

          return value;
        });
    });
  }

  wireGroupingEvents() {
    const groupByDepartment = document.getElementById('js-group-by-department');
    const groupByLocation = document.getElementById('js-group-by-location');

    groupByDepartment.onchange = () => this.appEvents.emit('orgChartSidebar:toggleDepartment');
    groupByLocation.onchange = () => this.appEvents.emit('orgChartSidebar:toggleLocation');
  }

  updateGrouping() {
    const groupByDepartment = document.getElementById('js-group-by-department');
    const groupByLocation = document.getElementById('js-group-by-location');

    let groupBy = () => { }; // eslint-disable-line no-empty-function

    if (groupByDepartment && groupByDepartment.checked) {
      groupBy = d => d.department;
    } else if (groupByLocation && groupByLocation.checked) {
      groupBy = d => (d.city || d.state)
        ? `${d.city || ''}${d.city ? ',' : ''} ${d.state || ''}`
        : 'Unknown';
    }

    const circles = d3.select(this.containerElement)
      .selectAll('circle');

    const uniqueGroupItems = Array.from(new Set(circles.data().map(d => groupBy(d))));

    const color = d3.scaleOrdinal(
      uniqueGroupItems.length > 10
        ? d3.schemeCategory20
        : d3.schemeCategory10);

    circles.style('fill', d => color(groupBy(d)));

    const groupsWithColors = Array.from(new Set(circles.data().map(d => {
      return {
        group: groupBy(d),
        color: color(groupBy(d))
      };
    }))).filter(x => x.group);

    const uniqueGroupsWithColors = [];

    groupsWithColors.forEach(x => {
      if (!uniqueGroupsWithColors.some(y => y.group === x.group)) {
        uniqueGroupsWithColors.push(x);
      }
    });

    this.updateLegend(uniqueGroupsWithColors);
  }

  updateLegend(groupsWithColors) {
    if (!this.showLegend) {
      return;
    }

    groupsWithColors
      .sort((x, y) => x.group.localeCompare(y.group));

    const groupScale = d3.scaleOrdinal()
      .domain(groupsWithColors.map(x => x.group))
      .range(groupsWithColors.map(x => x.color));

    const svg = d3.select(this.containerElement)
      .select('svg');

    svg.append('g')
      .attr('class', 'legend-ordinal')
      .attr('transform', 'translate(20, 20)');

    const legendOrdinal = legendColor()
      .scale(groupScale);

    svg.select('.legend-ordinal')
      .call(legendOrdinal);
  }

  search(str) {
    const searchNonMatchClass = 'search-non-match';
    const regExp = new RegExp(str, 'gi');

    // Remove grayscale from all circle images
    d3.select(this.containerElement)
      .selectAll('.node')
      .selectAll('image')
      .attr('filter', null);

    // Apply searchNonMatchClass to circle items if a search is specified
    d3.select(this.containerElement)
      .selectAll('circle')
      .classed(searchNonMatchClass, false)
      .filter(x => str && !(
          (x.displayName && x.displayName.match(regExp))
          || (x.jobTitle && x.jobTitle.match(regExp))
          || (x.department && x.department.match(regExp))
          || (x.telephoneNumber && x.telephoneNumber.match(regExp))
          || (x.email && x.email.match(regExp))
        )
      )
      .classed(searchNonMatchClass, true)

    // Apply grayscale to circle images if a search is specified
      .each(function () {
        d3
          .select(this.parentNode) // eslint-disable-line no-invalid-this
          .selectAll('image')
          .attr('filter', 'url(#grayscale)');
      });

    // If single match found, select that match
    const highlightedCircles = d3.select(this.containerElement)
      .selectAll(`circle:not(.${searchNonMatchClass})`);

    if (highlightedCircles._groups[0].length === 1) {
      const d = highlightedCircles.datum();

      this.onNodeClick(d);
    }

    document.getElementById('js-search-record-count').innerText = str
      ? `(${highlightedCircles._groups[0].length} matches)`
      : '';
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

  onNodeClick(d) {
    this.appEvents.emit('orgChartSvg:circleSelect');

    document
      .getElementById('js-information-container')
      .style
      .visibility = 'visible';

    const highlightClass = 'highlight';

    d3.select(this.containerElement)
      .selectAll('circle')
      .classed(highlightClass, false)
      .filter(x => x.id === d.id)
      .classed(highlightClass, true);

    const pictureElement = document.getElementById('js-information-picture');
    const imageUrl = `/image?email=${d.email}`;

    if (imageUrl) {
      pictureElement.src = imageUrl;
      pictureElement.style.visibility = 'visible';
    } else {
      pictureElement.style.visibility = 'hidden';
    }

    pictureElement.onerror = evt => {
      // Prevent infinite loop
      if (!new RegExp('gravatar.*&f=y', 'i').test(evt.target.src)) {
        evt.target.src = `https://www.gravatar.com/avatar/${md5(d.email.trim().toLowerCase())}.jpg`
          + '?s=150&r=g&d=identicon&f=y';
      }
    };

    this._setElementIdText('js-information-name', d.displayName);
    this._setElementIdText('js-information-job-title', d.jobTitle);
    this._setElementIdText('js-information-department', d.department);
    this._setElementIdText('js-location', `${d.city || ''}${d.city ? ',' : ''} ${d.state || ''}`);
    this._setElementIdText('js-information-telephone-number', d.telephoneNumber);

    const emailLink = document.getElementById('js-information-email-link');

    emailLink.innerHTML = d.email;
    emailLink.href = `mailto:${encodeURI(d.email)}`;
  }

  _setElementIdText(id, text) {
    document.getElementById(id).innerHTML = text;
  }
}
