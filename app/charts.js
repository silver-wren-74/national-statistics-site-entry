// Indonesia in Numbers — small SVG chart builders, no dependencies.
// Every chart is drawn from the figures in data.js; nothing is fetched.
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  function el(name, attrs, text) {
    var node = document.createElementNS(NS, name);
    for (var key in attrs) node.setAttribute(key, attrs[key]);
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function fmt(value, decimals) {
    return Number(value).toFixed(decimals === undefined ? 1 : decimals);
  }

  // Vertical bar chart. rows: [{label, value}], valueLabel formats the value.
  function barChart(rows, opts) {
    var width = opts.width || 640;
    var height = opts.height || 300;
    var padL = 52;
    var padB = 34;
    var padT = 14;
    var max = 0;
    rows.forEach(function (r) { if (r.value > max) max = r.value; });
    max = max * 1.12 || 1;
    var svg = el('svg', {
      viewBox: '0 0 ' + width + ' ' + height,
      role: 'img',
      'aria-label': opts.label || 'Bar chart',
      class: 'chart-svg',
    });
    var plotW = width - padL - 12;
    var plotH = height - padT - padB;
    var slot = plotW / rows.length;
    var barW = Math.min(64, slot * 0.62);
    rows.forEach(function (row, i) {
      var x = padL + i * slot + (slot - barW) / 2;
      var h = (row.value / max) * plotH;
      var y = padT + plotH - h;
      var bar = el('rect', {
        x: x.toFixed(1), y: y.toFixed(1), width: barW.toFixed(1), height: h.toFixed(1),
        rx: 4, fill: row.color || (i === rows.length - 1 ? '#b45309' : '#0f766e'),
      });
      svg.appendChild(bar);
      svg.appendChild(el('text', {
        x: (x + barW / 2).toFixed(1), y: (y - 6).toFixed(1),
        'text-anchor': 'middle', class: 'chart-value',
      }, opts.valueLabel ? opts.valueLabel(row.value) : fmt(row.value)));
      svg.appendChild(el('text', {
        x: (x + barW / 2).toFixed(1), y: (height - 12).toFixed(1),
        'text-anchor': 'middle', class: 'chart-label',
      }, row.label));
    });
    svg.appendChild(el('line', {
      x1: padL, y1: padT + plotH, x2: width - 12, y2: padT + plotH, class: 'chart-axis',
    }));
    return svg;
  }

  // Horizontal bar chart, best for ranked lists. rows: [{label, value}]
  function hbarChart(rows, opts) {
    var width = opts.width || 640;
    var rowH = 34;
    var height = rows.length * rowH + 30;
    var padL = 190;
    var max = 0;
    rows.forEach(function (r) { if (r.value > max) max = r.value; });
    max = max * 1.1 || 1;
    var svg = el('svg', {
      viewBox: '0 0 ' + width + ' ' + height,
      role: 'img',
      'aria-label': opts.label || 'Horizontal bar chart',
      class: 'chart-svg',
    });
    rows.forEach(function (row, i) {
      var y = 14 + i * rowH;
      var w = (row.value / max) * (width - padL - 70);
      svg.appendChild(el('text', {
        x: padL - 10, y: y + 13, 'text-anchor': 'end', class: 'chart-label',
      }, row.label));
      svg.appendChild(el('rect', {
        x: padL, y: y, width: Math.max(2, w).toFixed(1), height: 18, rx: 4,
        fill: row.color || (i === 0 ? '#b45309' : '#0f766e'),
      }));
      svg.appendChild(el('text', {
        x: padL + Math.max(2, w) + 8, y: y + 13, class: 'chart-value',
      }, opts.valueLabel ? opts.valueLabel(row.value) : fmt(row.value)));
    });
    return svg;
  }

  // Donut chart with a centre label. rows: [{label, value}]
  function donutChart(rows, opts) {
    var size = opts.size || 300;
    var cx = size / 2;
    var cy = size / 2;
    var r = size / 2 - 14;
    var inner = r - 34;
    var total = 0;
    rows.forEach(function (r) { total += r.value; });
    var svg = el('svg', {
      viewBox: '0 0 ' + size + ' ' + size,
      role: 'img',
      'aria-label': opts.label || 'Donut chart',
      class: 'chart-svg donut',
    });
    var palette = ['#0f766e', '#b45309', '#0369a1', '#a16207', '#4d7c0f', '#7c3aed'];
    var start = -Math.PI / 2;
    rows.forEach(function (row, i) {
      var frac = row.value / total;
      var end = start + frac * Math.PI * 2;
      var large = frac > 0.5 ? 1 : 0;
      var x1 = cx + r * Math.cos(start);
      var y1 = cy + r * Math.sin(start);
      var x2 = cx + r * Math.cos(end);
      var y2 = cy + r * Math.sin(end);
      var ix1 = cx + inner * Math.cos(end);
      var iy1 = cy + inner * Math.sin(end);
      var ix2 = cx + inner * Math.cos(start);
      var iy2 = cy + inner * Math.sin(start);
      var path = el('path', {
        d: 'M ' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
          ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1) +
          ' L ' + ix1.toFixed(1) + ' ' + iy1.toFixed(1) +
          ' A ' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + ix2.toFixed(1) + ' ' + iy2.toFixed(1) + ' Z',
        fill: row.color || palette[i % palette.length],
      });
      svg.appendChild(path);
      start = end;
    });
    var centre = el('text', {
      x: cx, y: cy - 4, 'text-anchor': 'middle', class: 'chart-centre',
    }, opts.centre || '');
    svg.appendChild(centre);
    if (opts.centreSub) {
      svg.appendChild(el('text', {
        x: cx, y: cy + 18, 'text-anchor': 'middle', class: 'chart-label',
      }, opts.centreSub));
    }
    return svg;
  }

  // Legend list for a donut: coloured dot + label + share.
  function legend(rows, total) {
    var palette = ['#0f766e', '#b45309', '#0369a1', '#a16207', '#4d7c0f', '#7c3aed'];
    var ul = document.createElement('ul');
    ul.className = 'legend';
    rows.forEach(function (row, i) {
      var li = document.createElement('li');
      var dot = document.createElement('span');
      dot.className = 'legend-dot';
      dot.style.background = row.color || palette[i % palette.length];
      li.appendChild(dot);
      li.appendChild(document.createTextNode(row.label + ' — ' + fmt(row.value) + '%'));
      ul.appendChild(li);
    });
    return ul;
  }

  window.StatCharts = {
    barChart: barChart,
    hbarChart: hbarChart,
    donutChart: donutChart,
    legend: legend,
    fmt: fmt,
  };
})();
