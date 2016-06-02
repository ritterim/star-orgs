import mermaidAPI from 'mermaid';
import svgPanZoom from 'svg-pan-zoom';

export default class SvgPanZoomMermaidRenderer {
  renderSvg(containerElement, users) {
    mermaidAPI.initialize({
      startOnLoad: false,
      flowchart: {
        // useMaxWidth: true,
        width: '100%'
      }
    });

    const orgSvgId = 'org-svg';
    const graphDefinition = this._getGraphDefintion(users);

    mermaidAPI.render(orgSvgId, graphDefinition, svgCode => {
      containerElement.innerHTML = svgCode;

      const panZoomOrg = svgPanZoom(`#${orgSvgId}`, {
        controlIconsEnabled: true,
        zoomScaleSensitivity: 2
      });

      panZoomOrg.resize();
    });
  }

  _getGraphDefintion(users) {
    const graphRows = users.map(x => {
      let row = this._getUserString(x);

      if (x.manager) {
        row = `${row}-->${this._getUserString(x.manager)}`;
      }

      row = `${row};\n`;

      return row;
    });

    // TODO: Add tooltips
    return `graph BT;\n${graphRows.join('')}`;
  }

  _getUserString(user) {
    return `${user.id}("${user.displayName}<br />(${user.jobTitle})")`;
  }
}

/*
function getGraphDefinition(users) {
  return `graph TD;
1("Ken")-->3("Khalid");
2("Tim")-->3("Khalid");

click 1 callback "Test Test Test Test Test Test Test Test Test"
`;
}*/
